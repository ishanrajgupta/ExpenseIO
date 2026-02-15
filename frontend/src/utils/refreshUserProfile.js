import api from './api';

export const refreshUserProfile = async () => {
  try {
    const { data } = await api.get('/auth/me');
    
    // Update localStorage
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const updatedUser = { ...currentUser, ...data.data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error('Failed to refresh user profile:', error);
    return null;
  }
};
