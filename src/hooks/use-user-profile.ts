
import { useState, useEffect } from 'react';

// Load user profile from localStorage
const loadUserName = () => {
  const savedProfile = localStorage.getItem('userProfile');
  if (savedProfile) {
    try {
      const profile = JSON.parse(savedProfile);
      return profile.name;
    } catch (e) {
      console.error('Error parsing profile data:', e);
    }
  }
  return 'John Doe';
};

export const useUserProfile = () => {
  const [userName, setUserName] = useState(loadUserName());

  useEffect(() => {
    // Listen for profile updates
    const handleProfileUpdate = (event: CustomEvent) => {
      console.log('Profile updated event received:', event.detail);
      if (event.detail && event.detail.name) {
        setUserName(event.detail.name);
      }
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
    };
  }, []);

  return { userName };
};
