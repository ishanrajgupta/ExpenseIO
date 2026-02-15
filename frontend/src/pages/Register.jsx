import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon,
  ArrowRightIcon,
  CreditCardIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-600 via-purple-600 to-blue-600 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl w-full flex items-center justify-center gap-12 relative z-10">
        {/* Left Side - Benefits (Hidden on mobile) */}
        <div className="hidden lg:flex flex-col items-start max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-3xl">
                <CreditCardIcon className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">ExpensIO</h1>
                <p className="text-pink-200 text-sm">Start Your Journey</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-white">
            <h3 className="text-2xl font-bold mb-6">Why Join ExpensIO?</h3>
            
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-6 w-6 text-green-300 flex-shrink-0" />
              <p className="text-pink-100">Free forever - no credit card required</p>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-6 w-6 text-green-300 flex-shrink-0" />
              <p className="text-pink-100">Track unlimited transactions</p>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-6 w-6 text-green-300 flex-shrink-0" />
              <p className="text-pink-100">Smart budget alerts and insights</p>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-6 w-6 text-green-300 flex-shrink-0" />
              <p className="text-pink-100">Beautiful charts and analytics</p>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-6 w-6 text-green-300 flex-shrink-0" />
              <p className="text-pink-100">Secure and private data</p>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircleIcon className="h-6 w-6 text-green-300 flex-shrink-0" />
              <p className="text-pink-100">Mobile responsive design</p>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
                <CreditCardIcon className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">ExpensIO</h1>
                <p className="text-pink-200 text-sm">Start Your Journey</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Get Started Free
              </h2>
              <p className="text-pink-200">
                Create your account in seconds
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-white px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-pink-300" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-pink-200 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-pink-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-pink-200 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
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
                    <LockClosedIcon className="h-5 w-5 text-pink-300" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-pink-200 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-pink-300" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-pink-200 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-gray-100 text-pink-600 font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span>Creating Account...</span>
                  ) : (
                    <>
                      <span>Create Account</span>
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
                  <span className="px-4 bg-transparent text-pink-200 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleLoginButton />
              </div>

              <div className="text-center">
                <p className="text-pink-200 text-sm">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-bold text-white hover:text-pink-100 transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <p className="text-center text-pink-200 text-xs mt-6">
            © 2026 ExpensIO. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
