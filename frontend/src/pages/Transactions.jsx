import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  FunnelIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import TransactionModal from '../components/TransactionModal';

const Transactions = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.month && filters.year) {
        params.month = filters.month;
        params.year = filters.year;
      }

      const { data } = await api.get('/transactions', { params });
      setTransactions(data.data);
    } catch (error) {
      toast.error('Failed to load transactions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await api.delete(`/transactions/${id}`);
      toast.success('Transaction deleted successfully');
      
      // Dispatch custom event to refresh dashboard
      window.dispatchEvent(new Event('transactionUpdate'));
      
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to delete transaction');
      console.error(error);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleSuccess = () => {
    fetchTransactions();
    handleModalClose();
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
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Other',
  ];

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Transactions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage all your income and expenses
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2 shadow-lg"
        >
          <PlusIcon className="h-5 w-5" />
          New Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <ArrowTrendingUpIcon className="h-6 w-6" />
            </div>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              Income
            </span>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Total Income</p>
          <p className="text-3xl font-bold">
            {formatCurrency(totalIncome, currency)}
          </p>
        </div>

        <div className="stat-card bg-gradient-to-br from-rose-500 to-pink-600 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <ArrowTrendingDownIcon className="h-6 w-6" />
            </div>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              Expenses
            </span>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Total Expenses</p>
          <p className="text-3xl font-bold">
            {formatCurrency(totalExpense, currency)}
          </p>
        </div>

        <div className={`stat-card bg-gradient-to-br ${
          totalIncome - totalExpense >= 0 
            ? 'from-violet-500 to-purple-600' 
            : 'from-orange-500 to-red-600'
        } text-white`}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <BanknotesIcon className="h-6 w-6" />
            </div>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              Balance
            </span>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Net Balance</p>
          <p className="text-3xl font-bold">
            {formatCurrency(Math.abs(totalIncome - totalExpense), currency)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card-gradient">
        <div className="flex items-center gap-2 mb-4">
          <FunnelIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              className="input-field"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="income">💰 Income</option>
              <option value="expense">💸 Expense</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              className="input-field"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Month
            </label>
            <select
              className="input-field"
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Year
            </label>
            <select
              className="input-field"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="card-gradient">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            All Transactions
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({transactions.length} {transactions.length === 1 ? 'item' : 'items'})
            </span>
          </h3>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton h-20 rounded-xl"></div>
            ))}
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="group relative flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-100 dark:border-gray-600/50 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md"
              >
                {/* Left Section */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Icon */}
                  <div className={`p-4 rounded-2xl ${
                    transaction.type === 'income'
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                      : 'bg-gradient-to-br from-rose-500 to-pink-600'
                  } text-white shadow-lg`}>
                    {transaction.type === 'income' ? (
                      <ArrowTrendingUpIcon className="h-6 w-6" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-6 w-6" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-gray-900 dark:text-white truncate text-lg">
                        {transaction.description}
                      </h4>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        transaction.type === 'income'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                      }`}>
                        {transaction.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
                        {transaction.category}
                      </span>
                      <span className="flex items-center gap-1">
                        📅 {new Date(transaction.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    {transaction.notes && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                        "{transaction.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                  <div className={`text-2xl font-bold ${
                    transaction.type === 'income'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
              <BanknotesIcon className="h-16 w-16 opacity-50" />
            </div>
            <p className="text-lg font-semibold mb-1">No transactions found</p>
            <p className="text-sm mb-6">Start by adding your first transaction</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
            >
              <PlusIcon className="h-5 w-5 mr-2 inline" />
              Add Transaction
            </button>
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        transaction={editingTransaction}
      />
    </div>
  );
};

export default Transactions;
