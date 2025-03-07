
import { toast } from 'sonner';

// Default iManage API URL
const DEFAULT_IMANAGE_API_URL = 'https://your-imanage-instance.com/api/v2';

// Check if iManage is configured with necessary credentials
export const isIManageConfigured = (): boolean => {
  const token = localStorage.getItem('imanage-token');
  const url = localStorage.getItem('imanage-url');
  return !!token && !!url;
};

// Get the saved iManage API URL
export const getIManageUrl = (): string => {
  return localStorage.getItem('imanage-url') || DEFAULT_IMANAGE_API_URL;
};

// Set iManage credentials
export const setIManageCredentials = (url: string, token: string): void => {
  localStorage.setItem('imanage-url', url);
  localStorage.setItem('imanage-token', token);
  toast.success('iManage credentials saved');
};

// Clear iManage credentials
export const clearIManageCredentials = (): void => {
  localStorage.removeItem('imanage-url');
  localStorage.removeItem('imanage-token');
  toast.success('iManage credentials cleared');
};

// Helper to handle API response errors
export const handleApiError = (error: any, fallbackMessage: string): never => {
  const errorMessage = error instanceof Error ? error.message : fallbackMessage;
  console.error(errorMessage, error);
  toast.error(errorMessage);
  throw new Error(errorMessage);
};

// Get iManage connection status
export const getIManageStatus = (): 'connected' | 'disconnected' | 'checking' => {
  if (!isIManageConfigured()) {
    return 'disconnected';
  }
  
  // We can't know for sure without checking the API, but we can assume it's connected
  // if the credentials are configured
  return 'connected';
};

// Helper to get auth headers for iManage API calls
export const getAuthHeaders = () => {
  return {
    'Authorization': `Bearer ${localStorage.getItem('imanage-token')}`,
    'Content-Type': 'application/json',
  };
};
