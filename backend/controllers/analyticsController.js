const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const now = new Date();
  const currentMonth = month ? parseInt(month) : now.getMonth() + 1;
  const currentYear = year ? parseInt(year) : now.getFullYear();

  const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

  // Current month stats
  const [incomeData, expenseData] = await Promise.all([
    Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'income',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]),
    Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const totalIncome = incomeData.length > 0 ? incomeData[0].total : 0;
  const totalExpense = expenseData.length > 0 ? expenseData[0].total : 0;
  const savings = totalIncome - totalExpense;
  const incomeCount = incomeData.length > 0 ? incomeData[0].count : 0;
  const expenseCount = expenseData.length > 0 ? expenseData[0].count : 0;

  // Category breakdown
  const categoryBreakdown = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        type: 'expense',
        date: { $gte: startOfMonth, $lte: endOfMonth },
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

  // Recent transactions
  const recentTransactions = await Transaction.find({
    user: req.user._id,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  })
    .sort({ date: -1 })
    .limit(10);

  res.json({
    success: true,
    data: {
      summary: {
        totalIncome,
        totalExpense,
        savings,
        incomeCount,
        expenseCount,
      },
      categoryBreakdown,
      recentTransactions,
    },
  });
});

// @desc    Get monthly comparison
// @route   GET /api/analytics/monthly-comparison
// @access  Private
const getMonthlyComparison = asyncHandler(async (req, res) => {
  const { months = 6 } = req.query;
  const now = new Date();
  const monthsData = [];

  for (let i = parseInt(months) - 1; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const startOfMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const [income, expense] = await Promise.all([
      Transaction.aggregate([
        {
          $match: {
            user: req.user._id,
            type: 'income',
            date: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]),
      Transaction.aggregate([
        {
          $match: {
            user: req.user._id,
            type: 'expense',
            date: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]),
    ]);

    const totalIncome = income.length > 0 ? income[0].total : 0;
    const totalExpense = expense.length > 0 ? expense[0].total : 0;

    monthsData.push({
      month: targetDate.toLocaleString('default', { month: 'short' }),
      year: targetDate.getFullYear(),
      income: totalIncome,
      expense: totalExpense,
      savings: totalIncome - totalExpense,
    });
  }

  res.json({
    success: true,
    data: monthsData,
  });
});

// @desc    Get expense trends
// @route   GET /api/analytics/trends
// @access  Private
const getExpenseTrends = asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const now = new Date();
  const startDate = new Date(now.getTime() - parseInt(days) * 24 * 60 * 60 * 1000);

  const trends = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        type: 'expense',
        date: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$date' },
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        date: '$_id',
        total: 1,
        count: 1,
        _id: 0,
      },
    },
  ]);

  res.json({
    success: true,
    data: trends,
  });
});

// @desc    Get spending insights
// @route   GET /api/analytics/insights
// @access  Private
const getSpendingInsights = asyncHandler(async (req, res) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  // Current month expenses by category
  const currentMonthStart = new Date(currentYear, currentMonth - 1, 1);
  const currentMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

  const currentExpenses = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        type: 'expense',
        date: { $gte: currentMonthStart, $lte: currentMonthEnd },
      },
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
      },
    },
  ]);

  // Last month expenses by category
  const lastMonthStart = new Date(lastMonthYear, lastMonth - 1, 1);
  const lastMonthEnd = new Date(lastMonthYear, lastMonth, 0, 23, 59, 59);

  const lastExpenses = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        type: 'expense',
        date: { $gte: lastMonthStart, $lte: lastMonthEnd },
      },
    },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
      },
    },
  ]);

  // Calculate insights
  const insights = [];
  const currentMap = new Map(currentExpenses.map((e) => [e._id, e.total]));
  const lastMap = new Map(lastExpenses.map((e) => [e._id, e.total]));

  // Compare categories
  currentExpenses.forEach((current) => {
    const category = current._id;
    const currentTotal = current.total;
    const lastTotal = lastMap.get(category) || 0;

    if (lastTotal > 0) {
      const change = ((currentTotal - lastTotal) / lastTotal) * 100;
      if (Math.abs(change) > 10) {
        insights.push({
          type: change > 0 ? 'increase' : 'decrease',
          category,
          message: `Your ${category} expenses ${
            change > 0 ? 'increased' : 'decreased'
          } by ${Math.abs(change).toFixed(1)}% this month`,
          percentage: change,
          currentAmount: currentTotal,
          previousAmount: lastTotal,
        });
      }
    }
  });

  // Find top spending category
  if (currentExpenses.length > 0) {
    const topCategory = currentExpenses.reduce((max, curr) =>
      curr.total > max.total ? curr : max
    );
    insights.push({
      type: 'top-spending',
      category: topCategory._id,
      message: `${topCategory._id} is your highest expense category this month`,
      amount: topCategory.total,
    });
  }

  // Calculate average daily spending
  const daysInMonth = currentMonthEnd.getDate();
  const totalCurrentExpense = currentExpenses.reduce(
    (sum, e) => sum + e.total,
    0
  );
  const avgDailySpending = totalCurrentExpense / daysInMonth;

  insights.push({
    type: 'average',
    message: `Your average daily spending is $${avgDailySpending.toFixed(2)}`,
    amount: avgDailySpending,
  });

  res.json({
    success: true,
    data: insights,
  });
});

module.exports = {
  getDashboardAnalytics,
  getMonthlyComparison,
  getExpenseTrends,
  getSpendingInsights,
};
