import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  ArrowRightIcon,
  CreditCardIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl w-full flex items-center justify-center gap-12 relative z-10">
        {/* Left Side - Branding (Hidden on mobile) */}
        <div className="hidden lg:flex flex-col items-start max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-3xl">
                <CreditCardIcon className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">ExpensIO</h1>
                <p className="text-purple-200 text-sm">Smart Money Management</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 text-white">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <SparklesIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Track Every Expense</h3>
                <p className="text-purple-200 text-sm">Monitor your spending with intelligent categorization and insights</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <SparklesIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Smart Budgeting</h3>
                <p className="text-purple-200 text-sm">Set budgets and get alerts before you overspend</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <SparklesIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Visual Analytics</h3>
                <p className="text-purple-200 text-sm">Beautiful charts and reports to understand your finances</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
                <CreditCardIcon className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">ExpensIO</h1>
                <p className="text-purple-200 text-sm">Smart Money Management</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back!
              </h2>
              <p className="text-purple-200">
                Sign in to continue to your dashboard
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-purple-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-200 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-purple-300" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-200 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-gray-100 text-purple-600 font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRightIcon className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-purple-200 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleLoginButton />
              </div>

              <div className="text-center">
                <p className="text-purple-200 text-sm">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-bold text-white hover:text-purple-100 transition-colors"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <p className="text-center text-purple-200 text-xs mt-6">
            © 2026 ExpensIO. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
