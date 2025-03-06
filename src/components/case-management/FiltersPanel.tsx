
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
      className="mb-4 border rounded-lg p-3"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Filters</h3>
        <button
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={resetFilters}
        >
          Reset all
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <h4 className="text-xs font-medium mb-1.5">Status</h4>
          <div className="flex flex-wrap gap-1.5">
            {['active', 'pending', 'closed'].map((status) => (
              <button
                key={status}
                className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
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
          <h4 className="text-xs font-medium mb-1.5">Priority</h4>
          <div className="flex flex-wrap gap-1.5">
            {['high', 'medium', 'low'].map((priority) => (
              <button
                key={priority}
                className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
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
