
import { useState } from 'react';
import { getCase } from '@/utils/documents';

export const useCaseDialog = () => {
  const [newCaseName, setNewCaseName] = useState('');
  const [isCreateCaseDialogOpen, setIsCreateCaseDialogOpen] = useState(false);
  const [isEditCaseDialogOpen, setIsEditCaseDialogOpen] = useState(false);
  const [editingCaseId, setEditingCaseId] = useState<string | null>(null);
  const [editCaseName, setEditCaseName] = useState('');
  const [editCaseStatus, setEditCaseStatus] = useState<'active' | 'pending' | 'closed'>('active');
  const [editCasePriority, setEditCasePriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [editCaseDeadline, setEditCaseDeadline] = useState<Date | undefined>(undefined);
  const [editCaseDescription, setEditCaseDescription] = useState('');
  const [editClientName, setEditClientName] = useState('');

  const handleEditCase = (e: React.MouseEvent, caseId: string) => {
    e.stopPropagation();
    const caseToEdit = getCase(caseId);
    if (caseToEdit) {
      setEditingCaseId(caseId);
      setEditCaseName(caseToEdit.name);
      setEditCaseStatus(caseToEdit.status || 'active');
      setEditCasePriority(caseToEdit.priority || 'medium');
      setEditCaseDeadline(caseToEdit.deadline ? new Date(caseToEdit.deadline) : undefined);
      setEditCaseDescription(caseToEdit.notes || '');
      setEditClientName(caseToEdit.clientName || '');
      setIsEditCaseDialogOpen(true);
    }
  };

  const resetCreateCaseForm = () => {
    setNewCaseName('');
    setIsCreateCaseDialogOpen(false);
  };

  const resetEditCaseForm = () => {
    setEditingCaseId(null);
    setEditCaseName('');
    setEditCaseStatus('active');
    setEditCasePriority('medium');
    setEditCaseDeadline(undefined);
    setEditCaseDescription('');
    setEditClientName('');
    setIsEditCaseDialogOpen(false);
  };

  return {
    // Create case dialog
    newCaseName,
    setNewCaseName,
    isCreateCaseDialogOpen,
    setIsCreateCaseDialogOpen,
    resetCreateCaseForm,
    
    // Edit case dialog
    isEditCaseDialogOpen,
    setIsEditCaseDialogOpen,
    editingCaseId,
    editCaseName,
    setEditCaseName,
    editCaseStatus,
    setEditCaseStatus,
    editCasePriority,
    setEditCasePriority,
    editCaseDeadline,
    setEditCaseDeadline,
    editCaseDescription,
    setEditCaseDescription,
    editClientName,
    setEditClientName,
    handleEditCase,
    resetEditCaseForm
  };
};
