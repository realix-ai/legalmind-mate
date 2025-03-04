
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';

interface EmptyCaseStateProps {
  cases: any[];
  setIsCreateCaseDialogOpen: (isOpen: boolean) => void;
  resetFilters: () => void;
}

const EmptyCaseState = ({ cases, setIsCreateCaseDialogOpen, resetFilters }: EmptyCaseStateProps) => {
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
      className="text-center py-16 border rounded-lg"
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-2">No cases found</h3>
      <p className="text-muted-foreground mb-6">
        {cases.length === 0 
          ? "You haven't created any cases yet. Click 'New Case' to get started."
          : "Try adjusting your search or filters to find what you're looking for."}
      </p>
      {cases.length === 0 ? (
        <Button onClick={() => setIsCreateCaseDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create your first case
        </Button>
      ) : (
        <Button variant="outline" onClick={resetFilters}>
          Reset filters
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyCaseState;
