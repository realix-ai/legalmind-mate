
import AddCollaborator from '@/components/document/AddCollaborator';
import CommentSection from '@/components/document/CommentSection';

interface DocumentRightPanelProps {
  documentId: string | null;
  isAddingCollaborator: boolean;
  onAddCollaborator: (email: string) => void;
}

const DocumentRightPanel = ({ 
  documentId, 
  isAddingCollaborator, 
  onAddCollaborator 
}: DocumentRightPanelProps) => {
  return (
    <div className="w-1/3 space-y-6">
      <AddCollaborator 
        onAddCollaborator={onAddCollaborator}
        isLoading={isAddingCollaborator}
      />
      
      <CommentSection documentId={documentId} />
    </div>
  );
};

export default DocumentRightPanel;
