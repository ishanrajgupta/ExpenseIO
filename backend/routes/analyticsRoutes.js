const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getMonthlyComparison,
  getExpenseTrends,
  getSpendingInsights,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// Routes
router.get('/dashboard', protect, getDashboardAnalytics);
router.get('/monthly-comparison', protect, getMonthlyComparison);
router.get('/trends', protect, getExpenseTrends);
router.get('/insights', protect, getSpendingInsights);

module.exports = router;
