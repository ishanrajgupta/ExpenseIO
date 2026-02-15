const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getBudgets,
  getBudgetByMonth,
  getCurrentBudget,
  createOrUpdateBudget,
  deleteBudget,
  getBudgetAlerts,
} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

// Validation rules
const budgetValidation = [
  body('month')
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
  body('year')
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be a valid year'),
  body('totalBudget')
    .isFloat({ min: 0 })
    .withMessage('Total budget must be a positive number'),
  body('categoryBudgets').isArray().withMessage('Category budgets must be an array'),
  body('categoryBudgets.*.category')
    .notEmpty()
    .withMessage('Category name is required'),
  body('categoryBudgets.*.limit')
    .isFloat({ min: 0 })
    .withMessage('Budget limit must be a positive number'),
];

// Routes
router.get('/current', protect, getCurrentBudget);
router.get('/alerts/check', protect, getBudgetAlerts);
router.get('/:year/:month', protect, getBudgetByMonth);
router.get('/', protect, getBudgets);
router.post('/', protect, budgetValidation, validate, createOrUpdateBudget);
router.delete('/:id', protect, deleteBudget);

module.exports = router;
