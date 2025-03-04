
/**
 * Format a timestamp into a human-readable relative time
 */
export const formatRelativeTime = (date: number): string => {
  const now = new Date();
  const diff = now.getTime() - date;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) {
    return days === 1 ? 'Yesterday' : `${days} days ago`;
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  return 'Just now';
};
