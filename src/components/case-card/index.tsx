
import { useState } from 'react';
import CardHeader from './CardHeader';
import ClientInfo from './ClientInfo';
import StatusPrioritySelector from './StatusPrioritySelector';
import NotesSection from './NotesSection';

interface CaseCardProps {
  title: string;
  caseNumber: string;
  clientName: string;
  date: string;
  status: 'active' | 'closed' | 'pending';
  priority: 'high' | 'medium' | 'low';
  onClick: () => void;
  onEdit?: (e: React.MouseEvent) => void;
  notes?: string;
  deadline?: Date;
  onUpdateStatus?: (status: 'active' | 'closed' | 'pending') => void;
  onUpdatePriority?: (priority: 'high' | 'medium' | 'low') => void;
  onUpdateDeadline?: (deadline: Date | undefined) => void;
  onUpdateNotes?: (notes: string) => void;
}

const CaseCard = ({
  title,
  caseNumber,
  clientName,
  date,
  status,
  priority,
  onClick,
  onEdit,
  notes,
  deadline,
  onUpdateStatus,
  onUpdatePriority,
  onUpdateDeadline,
  onUpdateNotes
}: CaseCardProps) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false);
  const [isPriorityPopoverOpen, setIsPriorityPopoverOpen] = useState(false);
  const [isDeadlinePopoverOpen, setIsDeadlinePopoverOpen] = useState(false);
  
  const handleCardClick = (e: React.MouseEvent) => {
    if (
      !isEditingNotes && 
      !isStatusPopoverOpen && 
      !isPriorityPopoverOpen && 
      !isDeadlinePopoverOpen
    ) {
      onClick();
    }
  };

  return (
    <div 
      className="border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-subtle hover:border-primary/30 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-5">
        <CardHeader 
          title={title} 
          caseNumber={caseNumber} 
          onEdit={onEdit} 
        />
        
        <ClientInfo 
          clientName={clientName} 
          date={date} 
          deadline={deadline} 
          onUpdateDeadline={onUpdateDeadline} 
        />
        
        <StatusPrioritySelector 
          status={status} 
          priority={priority} 
          onUpdateStatus={onUpdateStatus} 
          onUpdatePriority={onUpdatePriority} 
        />

        <NotesSection 
          notes={notes} 
          onUpdateNotes={onUpdateNotes} 
        />
      </div>
    </div>
  );
};

export default CaseCard;
