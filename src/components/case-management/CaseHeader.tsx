
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

interface CaseHeaderProps {
  setIsCreateCaseDialogOpen: (isOpen: boolean) => void;
  isCreateCaseDialogOpen: boolean;
}

const CaseHeader = ({ setIsCreateCaseDialogOpen, isCreateCaseDialogOpen }: CaseHeaderProps) => {
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
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold">Case Management</h1>
        <p className="text-muted-foreground mt-1">Track and manage all your legal cases</p>
      </div>
      
      <Dialog open={isCreateCaseDialogOpen} onOpenChange={setIsCreateCaseDialogOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 self-start">
            <Plus className="h-4 w-4" />
            New Case
          </Button>
        </DialogTrigger>
      </Dialog>
    </motion.div>
  );
};

export default CaseHeader;
