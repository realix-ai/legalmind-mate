
import React from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  statusFilter: string[];
  priorityFilter: string[];
}

const SearchAndFilters = ({
  searchQuery,
  setSearchQuery,
  isFilterOpen,
  setIsFilterOpen,
  statusFilter,
  priorityFilter
}: SearchAndFiltersProps) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <motion.div 
      variants={itemVariants}
      className="flex flex-col md:flex-row gap-3 mb-4"
    >
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
        <input
          type="text"
          placeholder="Search cases..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-4 py-1.5 text-sm rounded-md border border-input bg-background"
        />
        {searchQuery && (
          <button
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        className="gap-1 text-xs py-1.5"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filters
        {(statusFilter.length > 0 || priorityFilter.length > 0) && (
          <span className="ml-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-medium rounded-full bg-primary text-primary-foreground">
            {statusFilter.length + priorityFilter.length}
          </span>
        )}
      </Button>
    </motion.div>
  );
};

export default SearchAndFilters;
