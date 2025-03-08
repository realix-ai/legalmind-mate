
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  MoreVertical, 
  Wand2,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import SaveToCaseDialog from './SaveToCaseDialog';
import ExportOptions from './ExportOptions';
import SaveToIManageDialog from './SaveToIManageDialog';
import GetFromIManageDialog from './GetFromIManageDialog';
import { DocumentCategories } from './DocumentCategories';
import { SavedDocument } from '@/utils/documents/types';
import CitationTool from './citation/CitationTool';

interface DocumentToolbarProps {
  onBack: () => void;
  showAiPrompt: boolean;
  setShowAiPrompt: (show: boolean) => void;
  onSaveDocument: () => void;
  documentTitle: string;
  documentContent: string;
  documentCategory: string;
  currentDocumentId: string | null;
  onDocumentSaved: (id: string) => void;
  onDocumentLoaded: (document: SavedDocument) => void;
}

const DocumentToolbar = ({
  onBack,
  showAiPrompt,
  setShowAiPrompt,
  onSaveDocument,
  documentTitle,
  documentContent,
  documentCategory,
  currentDocumentId,
  onDocumentSaved,
  onDocumentLoaded,
}: DocumentToolbarProps) => {
  const navigate = useNavigate();
  const [showSaveToCaseDialog, setShowSaveToCaseDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showSaveToIManageDialog, setShowSaveToIManageDialog] = useState(false);
  const [showGetFromIManageDialog, setShowGetFromIManageDialog] = useState(false);

  const handleInsertCitation = (citation: string) => {
    // Create a citation insertion event
    const event = new CustomEvent('insertCitation', { 
      detail: { text: citation }
    });
    document.dispatchEvent(event);
  };

  const handleInsertCaseText = (text: string) => {
    // Create a case text insertion event
    const event = new CustomEvent('insertCaseText', { 
      detail: { text }
    });
    document.dispatchEvent(event);
  };
  
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAiPrompt(!showAiPrompt)}
            className="gap-1"
          >
            <Wand2 className="h-4 w-4" />
            <span className="hidden md:inline">AI Assistant</span>
          </Button>
          
          <CitationTool 
            onInsertCitation={handleInsertCitation}
            onInsertCaseText={handleInsertCaseText}
          />
          
          <Button 
            variant="default" 
            size="sm" 
            onClick={onSaveDocument}
            className="gap-1"
          >
            <Save className="h-4 w-4" />
            <span className="hidden md:inline">Save</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowSaveToCaseDialog(true)}>
                Save to Case
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowExportDialog(true)}>
                Export Document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowSaveToIManageDialog(true)}>
                Save to iManage
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowGetFromIManageDialog(true)}>
                Get from iManage
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <SaveToCaseDialog 
        open={showSaveToCaseDialog}
        onOpenChange={setShowSaveToCaseDialog}
        documentId={currentDocumentId}
        documentTitle={documentTitle}
        onDocumentSaved={onDocumentSaved}
      />
      
      <ExportOptions 
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        documentTitle={documentTitle}
        documentContent={documentContent}
      />
      
      <SaveToIManageDialog 
        open={showSaveToIManageDialog}
        onOpenChange={setShowSaveToIManageDialog}
        documentId={currentDocumentId}
        documentTitle={documentTitle}
      />
      
      <GetFromIManageDialog 
        open={showGetFromIManageDialog}
        onOpenChange={setShowGetFromIManageDialog}
        onDocumentLoaded={onDocumentLoaded}
      />
    </div>
  );
};

export default DocumentToolbar;
