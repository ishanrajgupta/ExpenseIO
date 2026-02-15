const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  const { type, category, startDate, endDate, month, year } = req.query;
  
  let query = { user: req.user._id };

  // Filter by type
  if (type) {
    query.type = type;
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by date range
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  // Filter by month and year
  if (month && year) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);
    query.date = { $gte: startOfMonth, $lte: endOfMonth };
  }

  const transactions = await Transaction.find(query).sort({ date: -1 });

  res.json({
    success: true,
    count: transactions.length,
    data: transactions,
  });
});

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  // Make sure user owns transaction
  if (transaction.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json({
    success: true,
    data: transaction,
  });
});

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.create({
    user: req.user._id,
    ...req.body,
  });

  // Update budget if expense
  if (transaction.type === 'expense') {
    await updateBudgetSpent(
      req.user._id,
      transaction.category,
      transaction.amount,
      new Date(transaction.date)
    );
  }

  res.status(201).json({
    success: true,
    data: transaction,
  });
});

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
  let transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  // Make sure user owns transaction
  if (transaction.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const oldAmount = transaction.amount;
  const oldCategory = transaction.category;
  const oldType = transaction.type;

  transaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  // Update budget if expense changed
  if (oldType === 'expense') {
    // Subtract old amount
    await updateBudgetSpent(
      req.user._id,
      oldCategory,
      -oldAmount,
      new Date(transaction.date)
    );
  }

  if (transaction.type === 'expense') {
    // Add new amount
    await updateBudgetSpent(
      req.user._id,
      transaction.category,
      transaction.amount,
      new Date(transaction.date)
    );
  }

  res.json({
    success: true,
    data: transaction,
  });
});

// @desc    Delete transaction (soft delete)
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  // Make sure user owns transaction
  if (transaction.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Soft delete
  transaction.isDeleted = true;
  transaction.deletedAt = new Date();
  await transaction.save();

  // Update budget if expense
  if (transaction.type === 'expense') {
    await updateBudgetSpent(
      req.user._id,
      transaction.category,
      -transaction.amount,
      new Date(transaction.date)
    );
  }

  res.json({
    success: true,
    message: 'Transaction deleted',
  });
});

// @desc    Get transaction statistics
// @route   GET /api/transactions/stats/summary
// @access  Private
const getTransactionStats = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  
  let dateFilter = {};
  if (month && year) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);
    dateFilter = { date: { $gte: startOfMonth, $lte: endOfMonth } };
  }

  // Calculate totals
  const incomeResult = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        type: 'income',
        ...dateFilter,
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ]);

  const expenseResult = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        type: 'expense',
        ...dateFilter,
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ]);

  // Category-wise breakdown
  const categoryBreakdown = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        type: 'expense',
        ...dateFilter,
      },
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { total: -1 },
    },
  ]);

  const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;
  const totalExpense = expenseResult.length > 0 ? expenseResult[0].total : 0;
  const savings = totalIncome - totalExpense;

  res.json({
    success: true,
    data: {
      totalIncome,
      totalExpense,
      savings,
      categoryBreakdown,
    },
  });
});

// Helper function to update budget spent
const updateBudgetSpent = async (userId, category, amount, date) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const budget = await Budget.findOne({ user: userId, month, year });

  if (budget) {
    // Update total spent
    budget.totalSpent += amount;

    // Update category spent
    const categoryBudget = budget.categoryBudgets.find(
      (cb) => cb.category === category
    );

    if (categoryBudget) {
      categoryBudget.spent += amount;
    }

    await budget.save();
  }
};

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
};
