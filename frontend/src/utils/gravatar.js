import CryptoJS from 'crypto-js';

/**
 * Generate Gravatar URL from email address
 * @param {string} email - User's email address
 * @param {number} size - Image size (default: 200)
 * @param {string} defaultImage - Default image type (default: 'identicon')
 * @returns {string} Gravatar URL
 */
export const getGravatarUrl = (email, size = 200, defaultImage = 'identicon') => {
  if (!email) {
    return `https://www.gravatar.com/avatar/?s=${size}&d=${defaultImage}`;
  }

  // Create MD5 hash of the email
  const hash = CryptoJS.MD5(email.trim().toLowerCase()).toString();
  
  // Gravatar URL format
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`;
};

/**
 * Get user initials from name for fallback avatar
 * @param {string} name - User's name
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return '?';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
