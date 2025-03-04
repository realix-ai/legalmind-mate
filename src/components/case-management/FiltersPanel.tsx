
import React from 'react';
import { motion } from 'framer-motion';

interface FiltersPanelProps {
  isFilterOpen: boolean;
  statusFilter: string[];
  setStatusFilter: (filter: string[]) => void;
  priorityFilter: string[];
  setPriorityFilter: (filter: string[]) => void;
  resetFilters: () => void;
}

const FiltersPanel = ({
  isFilterOpen,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  resetFilters
}: FiltersPanelProps) => {
  if (!isFilterOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="mb-8 border rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Filters</h3>
        <button
          className="text-sm text-muted-foreground hover:text-foreground"
          onClick={resetFilters}
        >
          Reset all
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Status</h4>
          <div className="flex flex-wrap gap-2">
            {['active', 'pending', 'closed'].map((status) => (
              <button
                key={status}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter.includes(status)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
                onClick={() => {
                  if (statusFilter.includes(status)) {
                    setStatusFilter(statusFilter.filter(s => s !== status));
                  } else {
                    setStatusFilter([...statusFilter, status]);
                  }
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Priority</h4>
          <div className="flex flex-wrap gap-2">
            {['high', 'medium', 'low'].map((priority) => (
              <button
                key={priority}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  priorityFilter.includes(priority)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
                onClick={() => {
                  if (priorityFilter.includes(priority)) {
                    setPriorityFilter(priorityFilter.filter(p => p !== priority));
                  } else {
                    setPriorityFilter([...priorityFilter, priority]);
                  }
                }}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FiltersPanel;
