import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ChartPieIcon,
  BanknotesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

// Circular Progress Component
const CircularProgress = ({ percentage, size = 160, strokeWidth = 12, color = 'purple' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  const colorMap = {
    purple: { gradient: 'url(#gradientPurple)', glow: '#8b5cf6' },
    green: { gradient: 'url(#gradientGreen)', glow: '#10b981' },
    red: { gradient: 'url(#gradientRed)', glow: '#ef4444' },
    orange: { gradient: 'url(#gradientOrange)', glow: '#f59e0b' },
    blue: { gradient: 'url(#gradientBlue)', glow: '#3b82f6' },
    teal: { gradient: 'url(#gradientTeal)', glow: '#14b8a6' },
  };

  const selectedColor = colorMap[color] || colorMap.purple;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <defs>
        <linearGradient id="gradientPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="gradientGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
        <linearGradient id="gradientRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
        <linearGradient id="gradientOrange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id="gradientBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="gradientTeal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="none"
        className="text-gray-200 dark:text-gray-700"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        stroke={selectedColor.gradient}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        filter="url(#glow)"
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
};

const Budget = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalBudget: 0,
    categoryBudgets: [],
  });

  useEffect(() => {
    fetchCurrentBudget();
  }, []);

  const fetchCurrentBudget = async () => {
    try {
      const { data } = await api.get('/budgets/current');
      setBudget(data.data);
      setFormData({
        month: data.data.month,
        year: data.data.year,
        totalBudget: data.data.totalBudget,
        categoryBudgets: data.data.categoryBudgets,
      });
    } catch (error) {
      toast.error('Failed to load budget');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setFormData({
      ...formData,
      categoryBudgets: [
        ...formData.categoryBudgets,
        { category: '', limit: 0, spent: 0 },
      ],
    });
  };

  const handleRemoveCategory = (index) => {
    const newCategories = formData.categoryBudgets.filter((_, i) => i !== index);
    setFormData({ ...formData, categoryBudgets: newCategories });
  };

  const handleCategoryChange = (index, field, value) => {
    const newCategories = [...formData.categoryBudgets];
    newCategories[index][field] = value;
    setFormData({ ...formData, categoryBudgets: newCategories });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budgets', formData);
      toast.success('Budget updated successfully');
      setIsEditing(false);
      fetchCurrentBudget();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update budget');
      console.error(error);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'red';
    if (percentage >= 80) return 'orange';
    if (percentage >= 60) return 'blue';
    return 'green';
  };

  const getBadgeColor = (percentage) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Rent',
    'Insurance',
    'Groceries',
    'Personal Care',
    'Gifts & Donations',
    'Other Expense',
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="card-gradient">
              <div className="skeleton h-96 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalPercentage = budget ? (budget.totalSpent / budget.totalBudget) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Budget Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your monthly spending and stay within budget
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <PencilIcon className="h-5 w-5" />
            Edit Budget
          </button>
        )}
      </div>

      {/* Main Budget Overview with Circular Progress */}
      {!isEditing && budget && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Circular Progress */}
          <div className="card-gradient relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Budget</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(0, budget.month - 1).toLocaleString('default', { month: 'long' })} {budget.year}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg">
                  <ChartPieIcon className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Circular Progress Center Piece */}
              <div className="flex flex-col items-center py-6">
                <div className="relative">
                  <CircularProgress 
                    percentage={totalPercentage} 
                    size={220} 
                    strokeWidth={16}
                    color={getProgressColor(totalPercentage)}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <BanknotesIcon className="h-10 w-10 text-purple-600 dark:text-purple-400 mb-2" />
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">
                      {totalPercentage.toFixed(0)}%
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Budget Used</p>
                  </div>
                </div>

                {/* Stats Below Circle */}
                <div className="grid grid-cols-2 gap-6 mt-8 w-full">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Budget</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(budget.totalBudget, currency)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Spent</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(budget.totalSpent, currency)}
                    </p>
                  </div>
                </div>

                {/* Remaining Amount */}
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl w-full text-center border border-purple-200 dark:border-purple-800/30">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Remaining Balance</p>
                  <p className={`text-3xl font-bold ${
                    budget.remaining >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {budget.remaining >= 0 ? '+' : '-'}{formatCurrency(Math.abs(budget.remaining || (budget.totalBudget - budget.totalSpent)), currency)}
                  </p>
                </div>

                {/* Status Badge */}
                {budget.status && (
                  <div className={`mt-4 px-6 py-3 rounded-full font-semibold text-white shadow-lg ${
                    budget.status === 'exceeded'
                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                      : budget.status === 'warning'
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600'
                  }`}>
                    {budget.status === 'exceeded' && '⚠️ Budget Exceeded'}
                    {budget.status === 'warning' && '⚡ Approaching Limit'}
                    {budget.status === 'good' && '✅ On Track'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Quick Stats */}
          <div className="space-y-6">
            <div className="card-gradient">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Budget Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800/30">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-500 rounded-xl">
                      <ArrowUpIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Budget</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(budget.totalBudget, currency)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl border border-red-200 dark:border-red-800/30">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-500 rounded-xl">
                      <ArrowDownIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(budget.totalSpent, currency)}
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(totalPercentage)} text-white`}>
                    {totalPercentage.toFixed(1)}%
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800/30">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
                      <BanknotesIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {budget.categoryBudgets.length} Active
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Average */}
            <div className="card-gradient">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Spending Insights</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Daily Average</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(budget.totalSpent / new Date().getDate(), currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Daily Budget</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(budget.totalBudget / 30, currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Projected Month End</span>
                  <span className={`text-lg font-bold ${
                    (budget.totalSpent / new Date().getDate()) * 30 > budget.totalBudget
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {formatCurrency((budget.totalSpent / new Date().getDate()) * 30, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Budgets with Mini Circular Progress */}
      {!isEditing && budget && budget.categoryBudgets.length > 0 && (
        <div className="card-gradient">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Category Budgets</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {budget.categoryBudgets.length} categories
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budget.categoryBudgets.map((catBudget, index) => {
              const percentage = (catBudget.spent / catBudget.limit) * 100;
              const colorChoice = getProgressColor(percentage);
              return (
                <div 
                  key={index} 
                  className="group relative p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-600/50 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300"
                >
                  <div className="flex flex-col items-center">
                    {/* Mini Circular Progress */}
                    <div className="relative mb-4">
                      <CircularProgress 
                        percentage={percentage} 
                        size={100} 
                        strokeWidth={8}
                        color={colorChoice}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {percentage.toFixed(0)}%
                        </p>
                      </div>
                    </div>

                    {/* Category Info */}
                    <h4 className="font-bold text-gray-900 dark:text-white text-center mb-2 text-lg">
                      {catBudget.category}
                    </h4>
                    
                    <div className="w-full space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Spent:</span>
                        <span className="font-bold text-red-600 dark:text-red-400">
                          {formatCurrency(catBudget.spent, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Limit:</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {formatCurrency(catBudget.limit, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-600">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Remaining:</span>
                        <span className={`font-bold ${
                          catBudget.limit - catBudget.spent >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {formatCurrency(catBudget.limit - catBudget.spent, currency)}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(percentage)} text-white`}>
                      {percentage >= 100 ? 'Exceeded' : percentage >= 80 ? 'Warning' : 'Good'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="card-gradient space-y-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Budget</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Month
              </label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                className="input-field"
                required
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Year
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="input-field"
                required
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Total Monthly Budget ($)
            </label>
            <input
              type="number"
              value={formData.totalBudget}
              onChange={(e) => setFormData({ ...formData, totalBudget: parseFloat(e.target.value) })}
              className="input-field text-lg"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Category Budgets</h4>
              <button
                type="button"
                onClick={handleAddCategory}
                className="btn-accent flex items-center gap-2 text-sm py-2 px-4"
              >
                <PlusIcon className="h-4 w-4" />
                Add Category
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {formData.categoryBudgets.map((catBudget, index) => (
                <div key={index} className="flex gap-3 items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                  <select
                    value={catBudget.category}
                    onChange={(e) => handleCategoryChange(index, 'category', e.target.value)}
                    className="input-field flex-1"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={catBudget.limit}
                    onChange={(e) => handleCategoryChange(index, 'limit', parseFloat(e.target.value))}
                    className="input-field w-32"
                    placeholder="Limit"
                    step="0.01"
                    min="0"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(index)}
                    className="p-2.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    title="Remove"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
              {formData.categoryBudgets.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No categories added yet. Click "Add Category" to get started.
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                fetchCurrentBudget();
              }}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary">
              💾 Save Budget
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Budget;
