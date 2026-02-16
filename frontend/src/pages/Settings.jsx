import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currency: user?.currency || 'USD',
    monthlyBudget: user?.monthlyBudget || 0,
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear password error when user types
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords if user is trying to change password
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setPasswordError('Passwords do not match');
        toast.error('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        toast.error('Password must be at least 6 characters');
        return;
      }
    }
    
    setPasswordError('');

    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        currency: formData.currency,
        monthlyBudget: parseFloat(formData.monthlyBudget),
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const { data } = await api.put('/auth/profile', updateData);
      updateUser(data.data);
      toast.success('Profile updated successfully');
      setFormData({ ...formData, password: '', confirmPassword: '' });
      setPasswordError('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Profile Picture Section */}
        <div className="flex items-center gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Avatar
              email={formData.email}
              name={formData.name}
              profilePicture={user?.profilePicture}
              size={160}
              className="h-20 w-20 rounded-full border-4 border-purple-500 shadow-lg object-cover"
            />
            <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full"></div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Picture</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {user?.authProvider === 'google' ? (
                <>Your profile picture is synced with your Google account. You cannot edit it here.</>
              ) : (
                <>
                  Your profile picture is synced with{' '}
                  <a 
                    href="https://gravatar.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Gravatar
                  </a>
                  . Update it by changing your Gravatar associated with your email address.
                </>
              )}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Default Monthly Budget
                </label>
                <input
                  type="number"
                  name="monthlyBudget"
                  value={formData.monthlyBudget}
                  onChange={handleChange}
                  className="input-field"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Leave blank to keep current password"
                minLength="6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input-field ${passwordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Confirm new password"
                minLength="6"
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <div className="card mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
          Danger Zone
        </h3>
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">
          Account deletion is permanent and cannot be undone.
        </p>
        <button
          type="button"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
          onClick={() => toast.error('Account deletion not implemented in demo')}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;
