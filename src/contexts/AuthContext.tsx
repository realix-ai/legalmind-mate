
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  getUserPrefix: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Get a prefix for user-specific localStorage keys
  const getUserPrefix = (): string => {
    return user ? `user_${user.id}_` : '';
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real application, this would be an API call
      setIsLoading(true);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password with basic validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Create a mock user (in real app, this would come from your backend)
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0],
      };
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast.success('Successfully logged in');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to login';
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // In a real application, this would be an API call
      setIsLoading(true);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any registration with basic validation
      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }
      
      // Create a mock user (in real app, this would come from your backend)
      const mockUser = {
        id: Date.now().toString(),
        email,
        name,
      };
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast.success('Account created successfully');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create account';
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        getUserPrefix,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
