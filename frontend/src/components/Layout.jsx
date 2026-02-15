import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Avatar from './Avatar';
import {
  HomeIcon,
  BanknotesIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  CreditCardIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  BanknotesIcon as BanknotesIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from '@heroicons/react/24/solid';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { 
      name: 'Home', 
      href: '/dashboard', 
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
      gradient: 'from-purple-500 to-blue-500'
    },
    { 
      name: 'Transactions', 
      href: '/transactions', 
      icon: BanknotesIcon,
      iconSolid: BanknotesIconSolid,
      gradient: 'from-cyan-500 to-teal-500'
    },
    { 
      name: 'Budget', 
      href: '/budget', 
      icon: ChartBarIcon,
      iconSolid: ChartBarIconSolid,
      gradient: 'from-pink-500 to-rose-500'
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Cog6ToothIcon,
      iconSolid: Cog6ToothIconSolid,
      gradient: 'from-orange-500 to-amber-500'
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 shadow-2xl">
          {/* Close button */}
          <div className="absolute top-4 right-4">
            <button
              className="p-2 rounded-xl bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="px-6 pt-8 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg">
                <CreditCardIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  ExpensIO
                </h1>
                <p className="text-xs text-gray-400">Track & Save</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = isActive ? item.iconSolid : item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-white/10 rounded-2xl blur-sm"></div>
                  )}
                  <Icon className={`h-6 w-6 relative z-10 ${isActive ? 'drop-shadow-lg' : ''}`} />
                  <span className="relative z-10 text-base">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <Avatar
                    email={user?.email}
                    name={user?.name}
                    profilePicture={user?.profilePicture}
                    size={80}
                    className="h-12 w-12 rounded-full border-2 border-purple-500 shadow-lg object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl font-medium transition-colors text-sm"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col z-30">
        <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 shadow-2xl">
          {/* Logo */}
          <div className="px-6 pt-8 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg">
                <CreditCardIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  ExpensIO
                </h1>
                <p className="text-xs text-gray-400">Track & Save</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = isActive ? item.iconSolid : item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-white/10 rounded-2xl blur-sm"></div>
                  )}
                  <Icon className={`h-6 w-6 relative z-10 ${isActive ? 'drop-shadow-lg' : ''}`} />
                  <span className="relative z-10 text-base">{item.name}</span>
                  {isActive && (
                    <div className="absolute right-4 h-2 w-2 bg-white rounded-full shadow-lg"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4">
            <div className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <Avatar
                    email={user?.email}
                    name={user?.name}
                    profilePicture={user?.profilePicture}
                    size={80}
                    className="h-12 w-12 rounded-full border-2 border-purple-500 shadow-lg object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl font-medium transition-colors text-sm"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Mobile header */}
        <div className="sticky top-0 z-20 lg:hidden">
          <div className="glass border-b border-white/20 dark:border-gray-700/50">
            <div className="flex items-center justify-between px-4 py-4">
              <button
                className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="h-6 w-6 text-gray-900 dark:text-white" />
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ExpensIO
              </h1>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
              >
                {isDark ? (
                  <SunIcon className="h-5 w-5 text-yellow-500" />
                ) : (
                  <MoonIcon className="h-5 w-5 text-purple-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop header */}
        <header className="hidden lg:block sticky top-0 z-20">
          <div className="glass border-b border-white/20 dark:border-gray-700/50">
            <div className="px-8 py-5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {navigation.find((item) => item.href === location.pathname)?.name || 'Home'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Welcome back, {user?.name?.split(' ')[0]}! 👋
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all hover:scale-105"
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <SunIcon className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <MoonIcon className="h-5 w-5 text-purple-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
