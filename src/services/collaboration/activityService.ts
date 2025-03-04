
import { ActivityItem } from './types';
import { getActivityItemsFromStorage, saveActivityItems } from './storageUtils';

// Export activity management functions
export const getActivityItems = (): ActivityItem[] => {
  return getActivityItemsFromStorage();
};

export const addActivityItem = (item: Omit<ActivityItem, 'id' | 'timestamp'>): ActivityItem => {
  const items = getActivityItems();
  const newItem = {
    ...item,
    id: `activity-${Date.now()}`,
    timestamp: Date.now()
  };
  
  items.unshift(newItem); // Add to the beginning
  
  // Limit to 50 items
  if (items.length > 50) {
    items.pop();
  }
  
  saveActivityItems(items);
  return newItem;
};
