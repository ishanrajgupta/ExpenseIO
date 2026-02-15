import { getGravatarUrl, getInitials } from '../utils/gravatar';

const Avatar = ({ email, name, profilePicture, size = 80, className = '' }) => {
  const initials = getInitials(name);
  
  // Use Google profile picture if available, otherwise use Gravatar
  const avatarUrl = profilePicture || getGravatarUrl(email, size);
  
  // Create fallback SVG without template literals in JSX
  const fallbackSvg = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" fill="#8b5cf6"/>
      <text 
        x="50%" 
        y="50%" 
        dominant-baseline="middle" 
        text-anchor="middle" 
        font-family="system-ui" 
        font-size="${size / 2.5}" 
        fill="white"
      >${initials}</text>
    </svg>
  `)}`;

  return (
    <img
      src={avatarUrl}
      alt={name || 'User'}
      className={className}
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = fallbackSvg;
      }}
    />
  );
};

export default Avatar;
