
import { getIManageUrl, getAuthHeaders, isIManageConfigured } from './core';

// Check iManage connection
export const checkIManageConnection = async (): Promise<boolean> => {
  if (!isIManageConfigured()) {
    return false;
  }

  try {
    const apiUrl = getIManageUrl();
    const response = await fetch(`${apiUrl}/system/status`, {
      method: 'GET',
      headers: getAuthHeaders(),
      // Add a timeout to prevent long waits
      signal: AbortSignal.timeout(5000)
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error checking iManage connection:', error);
    return false;
  }
};
