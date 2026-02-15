import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import {
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/solid';

const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#6366f1'];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currency = user?.currency || 'USD';
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [insights, setInsights] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [dashRes, monthlyRes, insightsRes, alertsRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/monthly-comparison?months=6'),
        api.get('/analytics/insights'),
        api.get('/budgets/alerts/check'),
      ]);

      setDashboardData(dashRes.data.data);
      setMonthlyData(monthlyRes.data.data);
      setInsights(insightsRes.data.data);
      setAlerts(alertsRes.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Refresh dashboard when window/tab gains focus or transaction updates
  useEffect(() => {
    const handleFocus = () => {
      fetchDashboardData();
    };
    
    const handleTransactionUpdate = () => {
      fetchDashboardData();
    };
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('transactionUpdate', handleTransactionUpdate);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('transactionUpdate', handleTransactionUpdate);
    };
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-gradient">
              <div className="skeleton h-32 rounded-xl"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="card">
              <div className="skeleton h-80 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { summary, categoryBreakdown, recentTransactions } = dashboardData || {};

  const pieData = categoryBreakdown?.map((cat) => ({
    name: cat._id,
    value: cat.total,
  })) || [];

  // Calculate percentage change
  const savingsRate = summary?.totalIncome > 0 
    ? ((summary?.savings / summary?.totalIncome) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                alert.type === 'danger'
                  ? 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20'
                  : 'bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20'
              }`}
            >
              <ExclamationTriangleIcon className={`h-6 w-6 flex-shrink-0 ${
                alert.type === 'danger' ? 'text-red-500' : 'text-yellow-500'
              }`} />
              <div className="flex-1">
                <p className={`font-semibold ${
                  alert.type === 'danger' ? 'text-red-700 dark:text-red-400' : 'text-yellow-700 dark:text-yellow-400'
                }`}>
                  {alert.type === 'danger' ? 'Budget Exceeded!' : 'Budget Warning'}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income Card */}
        <div className="stat-card bg-gradient-to-br from-emerald-400 to-green-600 text-white overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <ArrowTrendingUpIcon className="h-7 w-7" />
            </div>
            <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
              <ArrowUpIcon className="h-4 w-4" />
              <span className="font-semibold">{summary?.incomeCount || 0}</span>
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Total Income</p>
          <p className="text-3xl font-bold mb-1">
            {formatCurrency(summary?.totalIncome || 0, currency)}
          </p>
          <p className="text-xs opacity-75">This month</p>
        </div>

        {/* Expenses Card */}
        <div className="stat-card bg-gradient-to-br from-pink-500 to-red-600 text-white overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <ArrowTrendingDownIcon className="h-7 w-7" />
            </div>
            <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
              <ArrowDownIcon className="h-4 w-4" />
              <span className="font-semibold">{summary?.expenseCount || 0}</span>
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Total Expenses</p>
          <p className="text-3xl font-bold mb-1">
            {formatCurrency(summary?.totalExpense || 0, currency)}
          </p>
          <p className="text-xs opacity-75">This month</p>
        </div>

        {/* Savings Card */}

        {/* Savings Card */}
        <div className={`stat-card bg-gradient-to-br ${
          summary?.savings >= 0 
            ? 'from-purple-500 to-blue-600' 
            : 'from-orange-500 to-red-600'
        } text-white overflow-hidden`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <BanknotesIcon className="h-7 w-7" />
            </div>
            <div className="text-sm bg-white/20 px-3 py-1 rounded-full font-semibold">
              {savingsRate}%
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Net Savings</p>
          <p className="text-3xl font-bold mb-1">
            {summary?.savings >= 0 ? '+' : '-'}{formatCurrency(Math.abs(summary?.savings || 0), currency)}
          </p>
          <p className="text-xs opacity-75">Savings rate</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown - Donut Chart */}
        <div className="card-gradient">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Expense Breakdown</h3>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <ChartBarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          {pieData.length > 0 ? (
            <div className="relative">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                    animationEasing="ease-out"
                    isAnimationActive={true}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value) => formatCurrency(value, currency)}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {pieData.slice(0, 6).map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {entry.name}
                    </span>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white ml-auto">
                      {getCurrencySymbol(currency)}{entry.value.toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <ChartBarIcon className="h-16 w-16 mb-3 opacity-50" />
              <p className="text-sm">No expense data available</p>
            </div>
          )}
        </div>

        {/* Monthly Trend - Bar Chart */}
        <div className="card-gradient">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Trend</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Last 6 months</span>
            </div>
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => formatCurrency(value, currency)}
                />
                <Bar 
                  dataKey="income" 
                  fill="url(#colorIncome)" 
                  radius={[8, 8, 0, 0]}
                  name="Income"
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  isAnimationActive={true}
                />
                <Bar 
                  dataKey="expense" 
                  fill="url(#colorExpense)" 
                  radius={[8, 8, 0, 0]}
                  name="Expense"
                  animationBegin={200}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  isAnimationActive={true}
                />
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.4}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <ChartBarIcon className="h-16 w-16 mb-3 opacity-50" />
              <p className="text-sm">No monthly data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Smart Insights */}
      {insights && insights.length > 0 && (
        <div className="card-gradient">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
              <LightBulbIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Smart Insights</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered spending analysis</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden p-5 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative flex items-start gap-3">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <CurrencyDollarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200 flex-1 leading-relaxed">
                    {insight.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="card-gradient">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
          <button 
            onClick={() => navigate('/transactions')}
            className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            View All →
          </button>
        </div>
        {recentTransactions && recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction._id}
                className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded-xl ${
                    transaction.type === 'income'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowTrendingUpIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                        {transaction.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`text-lg font-bold ${
                  transaction.type === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <CurrencyDollarIcon className="h-16 w-16 mb-3 opacity-50" />
            <p className="text-sm font-medium">No transactions yet</p>
            <p className="text-xs mt-1">Start tracking your expenses</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
