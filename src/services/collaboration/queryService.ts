
import { SharedQuery } from './types';
import { getSharedQueriesFromStorage, saveSharedQueries } from './storageUtils';
import { addActivityItem } from './activityService';

// Export shared query management functions
export const getSharedQueries = (): SharedQuery[] => {
  return getSharedQueriesFromStorage();
};

export const shareQuery = (query: string, type: string, userId: string = '1', userName: string = 'You'): SharedQuery => {
  const queries = getSharedQueries();
  
  // Generate a unique ID for the query
  const uniqueId = Math.random().toString(36).substring(2, 8);
  
  const newQuery = {
    id: `query-${Date.now()}`,
    query,
    sharedBy: userName,
    sharedById: userId,
    date: Date.now(),
    type,
    url: `${window.location.origin}/share/${uniqueId}`
  };
  
  // Add to beginning of array to show most recent first
  queries.unshift(newQuery);
  saveSharedQueries(queries);
  
  // Add activity item
  addActivityItem({
    userId,
    userName,
    action: 'shared a new query',
    target: type
  });
  
  return newQuery;
};

export const deleteSharedQuery = (id: string): boolean => {
  const queries = getSharedQueries();
  const filtered = queries.filter(q => q.id !== id);
  
  if (filtered.length < queries.length) {
    saveSharedQueries(filtered);
    return true;
  }
  
  return false;
};

// Generate a unique sharing link
export const generateShareLink = (query: string): string => {
  // Create a unique identifier
  const shareId = Math.random().toString(36).substring(2, 12);
  return `${window.location.origin}/share/${shareId}`;
};
