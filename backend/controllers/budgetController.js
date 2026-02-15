const asyncHandler = require('express-async-handler');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ user: req.user._id }).sort({
    year: -1,
    month: -1,
  });

  res.json({
    success: true,
    count: budgets.length,
    data: budgets,
  });
});

// @desc    Get budget for specific month
// @route   GET /api/budgets/:year/:month
// @access  Private
const getBudgetByMonth = asyncHandler(async (req, res) => {
  const { year, month } = req.params;

  const budget = await Budget.findOne({
    user: req.user._id,
    year: parseInt(year),
    month: parseInt(month),
  });

  if (!budget) {
    res.status(404);
    throw new Error('Budget not found for this month');
  }

  // Calculate budget status
  const status = budget.getBudgetStatus();
  const remaining = budget.getRemainingBudget();

  res.json({
    success: true,
    data: {
      ...budget.toObject(),
      status: status.status,
      percentage: status.percentage,
      remaining,
    },
  });
});

// @desc    Get current month budget
// @route   GET /api/budgets/current
// @access  Private
const getCurrentBudget = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  let budget = await Budget.findOne({
    user: req.user._id,
    year,
    month,
  });

  // If no budget exists, create one
  if (!budget) {
    budget = await Budget.create({
      user: req.user._id,
      month,
      year,
      totalBudget: req.user.monthlyBudget || 0,
      categoryBudgets: [],
    });
  }

  // Calculate budget status
  const status = budget.getBudgetStatus();
  const remaining = budget.getRemainingBudget();

  res.json({
    success: true,
    data: {
      ...budget.toObject(),
      status: status.status,
      percentage: status.percentage,
      remaining,
    },
  });
});

// @desc    Create or update budget
// @route   POST /api/budgets
// @access  Private
const createOrUpdateBudget = asyncHandler(async (req, res) => {
  const { month, year, totalBudget, categoryBudgets } = req.body;

  // Check if budget already exists
  let budget = await Budget.findOne({
    user: req.user._id,
    month,
    year,
  });

  if (budget) {
    // Update existing budget
    budget.totalBudget = totalBudget;
    budget.categoryBudgets = categoryBudgets;
  } else {
    // Create new budget
    budget = new Budget({
      user: req.user._id,
      month,
      year,
      totalBudget,
      categoryBudgets,
    });
  }

  // Recalculate spent amounts from actual transactions
  await recalculateBudgetSpent(budget);

  await budget.save();

  // Check for alerts
  const alerts = checkBudgetAlerts(budget);

  res.status(budget.isNew ? 201 : 200).json({
    success: true,
    data: budget,
    alerts,
  });
});

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);

  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }

  // Make sure user owns budget
  if (budget.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await budget.deleteOne();

  res.json({
    success: true,
    message: 'Budget deleted',
  });
});

// @desc    Get budget alerts
// @route   GET /api/budgets/alerts/check
// @access  Private
const getBudgetAlerts = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const budget = await Budget.findOne({
    user: req.user._id,
    year,
    month,
  });

  if (!budget) {
    return res.json({
      success: true,
      data: [],
    });
  }

  const alerts = checkBudgetAlerts(budget);

  res.json({
    success: true,
    data: alerts,
  });
});

// Helper function to recalculate budget spent
const recalculateBudgetSpent = async (budget) => {
  const startOfMonth = new Date(budget.year, budget.month - 1, 1);
  const endOfMonth = new Date(budget.year, budget.month, 0, 23, 59, 59);

  // Get all expenses for the month
  const expenses = await Transaction.find({
    user: budget.user,
    type: 'expense',
    date: { $gte: startOfMonth, $lte: endOfMonth },
  });

  // Calculate total spent
  budget.totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate category-wise spent
  budget.categoryBudgets.forEach((catBudget) => {
    const categoryExpenses = expenses.filter(
      (exp) => exp.category === catBudget.category
    );
    catBudget.spent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  });
};

// Helper function to check budget alerts
const checkBudgetAlerts = (budget) => {
  const alerts = [];

  // Check total budget
  const totalPercentage = (budget.totalSpent / budget.totalBudget) * 100;

  if (totalPercentage >= 100) {
    alerts.push({
      type: 'danger',
      level: 'total',
      message: `You have exceeded your total monthly budget by ${(
        totalPercentage - 100
      ).toFixed(1)}%`,
      percentage: totalPercentage,
    });
  } else if (totalPercentage >= 80) {
    alerts.push({
      type: 'warning',
      level: 'total',
      message: `You have used ${totalPercentage.toFixed(
        1
      )}% of your monthly budget`,
      percentage: totalPercentage,
    });
  }

  // Check category budgets
  budget.categoryBudgets.forEach((catBudget) => {
    const percentage = (catBudget.spent / catBudget.limit) * 100;

    if (percentage >= 100 && !catBudget.alertSent100) {
      alerts.push({
        type: 'danger',
        level: 'category',
        category: catBudget.category,
        message: `${catBudget.category} budget exceeded by ${(
          percentage - 100
        ).toFixed(1)}%`,
        percentage,
      });
      catBudget.alertSent100 = true;
    } else if (percentage >= 80 && percentage < 100 && !catBudget.alertSent80) {
      alerts.push({
        type: 'warning',
        level: 'category',
        category: catBudget.category,
        message: `${catBudget.category}: ${percentage.toFixed(
          1
        )}% of budget used`,
        percentage,
      });
      catBudget.alertSent80 = true;
    }
  });

  return alerts;
};

module.exports = {
  getBudgets,
  getBudgetByMonth,
  getCurrentBudget,
  createOrUpdateBudget,
  deleteBudget,
  getBudgetAlerts,
};
