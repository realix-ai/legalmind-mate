
import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Import our new form field components
import CaseNameField from './edit-case/CaseNameField';
import StatusField from './edit-case/StatusField';
import PriorityField from './edit-case/PriorityField';
import DeadlineField from './edit-case/DeadlineField';
import NotesField from './edit-case/NotesField';

interface EditCaseDialogProps {
  isEditCaseDialogOpen: boolean;
  setIsEditCaseDialogOpen: (isOpen: boolean) => void;
  editCaseName: string;
  setEditCaseName: (name: string) => void;
  editCaseStatus: 'active' | 'pending' | 'closed';
  setEditCaseStatus: (status: 'active' | 'pending' | 'closed') => void;
  editCasePriority: 'high' | 'medium' | 'low';
  setEditCasePriority: (priority: 'high' | 'medium' | 'low') => void;
  editCaseDeadline: Date | undefined;
  setEditCaseDeadline: (deadline: Date | undefined) => void;
  editCaseDescription: string;
  setEditCaseDescription: (description: string) => void;
  handleSaveEditCase: () => void;
}

const EditCaseDialog = ({
  isEditCaseDialogOpen,
  setIsEditCaseDialogOpen,
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
  handleSaveEditCase
}: EditCaseDialogProps) => {
  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Edit Case</DialogTitle>
        <DialogDescription>
          Update the case details below.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <CaseNameField 
          editCaseName={editCaseName}
          setEditCaseName={setEditCaseName}
        />
        
        <StatusField 
          editCaseStatus={editCaseStatus}
          setEditCaseStatus={setEditCaseStatus}
        />
        
        <PriorityField 
          editCasePriority={editCasePriority}
          setEditCasePriority={setEditCasePriority}
        />
        
        <DeadlineField 
          editCaseDeadline={editCaseDeadline}
          setEditCaseDeadline={setEditCaseDeadline}
        />
        
        <NotesField 
          editCaseDescription={editCaseDescription}
          setEditCaseDescription={setEditCaseDescription}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setIsEditCaseDialogOpen(false)}>
          Cancel
        </Button>
        <Button onClick={handleSaveEditCase}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default EditCaseDialog;
