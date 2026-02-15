const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

// Validation rules
const transactionValidation = [
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
  body('category').notEmpty().withMessage('Category is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
];

// Routes
router.get('/stats/summary', protect, getTransactionStats);
router.get('/', protect, getTransactions);
router.get('/:id', protect, getTransaction);
router.post('/', protect, transactionValidation, validate, createTransaction);
router.put('/:id', protect, transactionValidation, validate, updateTransaction);
router.delete('/:id', protect, deleteTransaction);

module.exports = router;
