
import { useState, useEffect } from 'react';

interface UserProfile {
  name: string;
  role: string;
  specialization: string;
}

// Load complete user profile from localStorage with better error handling
const loadUserProfile = (): UserProfile => {
  try {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      if (profile && typeof profile === 'object' && 'name' in profile) {
        return profile as UserProfile;
      }
    }
  } catch (e) {
    console.error('Error parsing profile data:', e);
  }
  
  // Default profile if nothing in localStorage or parse error
  return {
    name: 'John Doe',
    role: 'attorney',
    specialization: 'corporate'
  };
};

export const useUserProfile = () => {
  // Store the complete profile
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile());
  
  useEffect(() => {
    // Listen for profile updates
    const handleProfileUpdate = (event: CustomEvent) => {
      console.log('Profile updated event received:', event.detail);
      if (event.detail && typeof event.detail === 'object' && 'name' in event.detail) {
        // Update the entire profile object
        setUserProfile(event.detail as UserProfile);
        
        // Save to localStorage
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

  // Update user profile
  const updateUserProfile = (newProfile: Partial<UserProfile>) => {
    const updatedProfile = { ...userProfile, ...newProfile };
    setUserProfile(updatedProfile);
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
    // Dispatch event for other components to react
    const event = new CustomEvent('profileUpdated', { detail: updatedProfile });
    window.dispatchEvent(event);
    
    return updatedProfile;
  };

  // Return the full profile and just userName for backward compatibility
  return { 
    userProfile, 
    userName: userProfile.name,
    role: userProfile.role,
    specialization: userProfile.specialization,
    updateUserProfile
  };
};
