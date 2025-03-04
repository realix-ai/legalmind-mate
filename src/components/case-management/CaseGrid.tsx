
import React from 'react';
import { motion } from 'framer-motion';
import CaseCard from '@/components/CaseCard';
import { Case as CaseType } from '@/utils/documents';

interface CaseGridProps {
  cases: CaseType[];
  handleCaseClick: (caseId: string) => void;
  handleEditCase: (e: React.MouseEvent, caseId: string) => void;
  handleUpdateStatus: (caseId: string, newStatus: 'active' | 'pending' | 'closed') => void;
  handleUpdatePriority: (caseId: string, newPriority: 'high' | 'medium' | 'low') => void;
  handleUpdateDeadline: (caseId: string, newDeadline: Date | undefined) => void;
  handleUpdateNotes: (caseId: string, newNotes: string) => void;
}

const CaseGrid = ({
  cases,
  handleCaseClick,
  handleEditCase,
  handleUpdateStatus,
  handleUpdatePriority,
  handleUpdateDeadline,
  handleUpdateNotes
}: CaseGridProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  };

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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {cases.map((caseItem) => (
        <motion.div key={caseItem.id} variants={itemVariants}>
          <CaseCard
            title={caseItem.name}
            caseNumber={`CASE-${caseItem.id.substring(5, 10)}`}
            clientName={caseItem.clientName || "Client"}
            date={new Date(caseItem.createdAt).toLocaleDateString()}
            status={caseItem.status || "active"}
            priority={caseItem.priority || "medium"}
            notes={caseItem.notes}
            deadline={caseItem.deadline ? new Date(caseItem.deadline) : undefined}
            onClick={() => handleCaseClick(caseItem.id)}
            onEdit={(e) => handleEditCase(e, caseItem.id)}
            onUpdateStatus={(status) => handleUpdateStatus(caseItem.id, status)}
            onUpdatePriority={(priority) => handleUpdatePriority(caseItem.id, priority)}
            onUpdateDeadline={(deadline) => handleUpdateDeadline(caseItem.id, deadline)}
            onUpdateNotes={(notes) => handleUpdateNotes(caseItem.id, notes)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CaseGrid;
