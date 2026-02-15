const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  totalBudget: {
    type: Number,
    required: [true, 'Please set a total budget'],
    min: [0, 'Budget cannot be negative']
  },
  categoryBudgets: [{
    category: {
      type: String,
      required: true
    },
    limit: {
      type: Number,
      required: true,
      min: [0, 'Budget limit cannot be negative']
    },
    spent: {
      type: Number,
      default: 0
    },
    alertSent80: {
      type: Boolean,
      default: false
    },
    alertSent100: {
      type: Boolean,
      default: false
    }
  }],
  totalSpent: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for unique user budget per month
budgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

// Method to calculate remaining budget
budgetSchema.methods.getRemainingBudget = function() {
  return this.totalBudget - this.totalSpent;
};

// Method to check if budget is exceeded
budgetSchema.methods.isBudgetExceeded = function() {
  return this.totalSpent > this.totalBudget;
};

// Method to get budget status
budgetSchema.methods.getBudgetStatus = function() {
  const percentage = (this.totalSpent / this.totalBudget) * 100;
  
  if (percentage >= 100) return { status: 'exceeded', percentage };
  if (percentage >= 80) return { status: 'warning', percentage };
  return { status: 'good', percentage };
};

module.exports = mongoose.model('Budget', budgetSchema);
