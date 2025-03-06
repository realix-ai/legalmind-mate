
import { cn } from '@/lib/utils';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    case 'closed':
      return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    case 'pending':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
    default:
      return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    case 'medium':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
    case 'low':
      return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    default:
      return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
};
