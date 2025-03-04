
import { useState, useEffect } from 'react';

interface UserProfile {
  name: string;
  role: string;
  specialization: string;
}

// Load complete user profile from localStorage
const loadUserProfile = (): UserProfile => {
  const savedProfile = localStorage.getItem('userProfile');
  if (savedProfile) {
    try {
      const profile = JSON.parse(savedProfile);
      return profile;
    } catch (e) {
      console.error('Error parsing profile data:', e);
    }
  }
  return {
    name: 'John Doe',
    role: 'attorney',
    specialization: 'corporate'
  };
};

export const useUserProfile = () => {
  // Store the complete profile, not just the name
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile());
  
  useEffect(() => {
    // Listen for profile updates
    const handleProfileUpdate = (event: CustomEvent) => {
      console.log('Profile updated event received:', event.detail);
      if (event.detail) {
        // Update the entire profile object
        setUserProfile(event.detail);
        
        // Save to localStorage as a backup
        localStorage.setItem('userProfile', JSON.stringify(event.detail));
      }
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener);
    
    // Load the profile from localStorage on mount
    const profile = loadUserProfile();
    setUserProfile(profile);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
    };
  }, []);

  // Return the full profile and just userName for backward compatibility
  return { 
    userProfile, 
    userName: userProfile.name,
    role: userProfile.role,
    specialization: userProfile.specialization
  };
};
