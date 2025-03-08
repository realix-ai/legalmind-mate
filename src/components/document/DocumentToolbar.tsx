
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  MoreVertical, 
  Wand2,
  Briefcase,
  FileText,
  Cloud,
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
import { DOCUMENT_CATEGORIES } from './DocumentCategories';
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
  
  // Mock export handlers for ExportOptions
  const handleExportPdf = () => {
    toast.success('Exporting document as PDF');
  };
  
  const handleExportDocx = () => {
    toast.success('Exporting document as DOCX');
  };
  
  const handleExportTxt = () => {
    toast.success('Exporting document as TXT');
  };
  
  const handlePrint = () => {
    toast.success('Printing document');
  };
  
  const handleEmailDocument = () => {
    toast.success('Email document');
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
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowSaveToCaseDialog(true)}
            className="gap-1 hidden sm:flex"
          >
            <Briefcase className="h-4 w-4" />
            <span className="hidden md:inline">Save to Case</span>
          </Button>
          
          <ExportOptions 
            title={documentTitle}
            content={documentContent}
            onExportPdf={handleExportPdf}
            onExportDocx={handleExportDocx}
            onExportTxt={handleExportTxt}
            onPrint={handlePrint}
            onEmailDocument={handleEmailDocument}
          />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowSaveToIManageDialog(true)}
            className="gap-1 hidden lg:flex"
          >
            <Cloud className="h-4 w-4" />
            <span className="hidden md:inline">Save to iManage</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowGetFromIManageDialog(true)}
            className="gap-1 hidden lg:flex"
          >
            <Cloud className="h-4 w-4" />
            <span className="hidden md:inline">Get from iManage</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setShowSaveToCaseDialog(true)}
                className="sm:hidden"
              >
                Save to Case
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowSaveToIManageDialog(true)}
                className="lg:hidden"
              >
                Save to iManage
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowGetFromIManageDialog(true)}
                className="lg:hidden"
              >
                Get from iManage
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <SaveToCaseDialog 
        title={documentTitle}
        content={documentContent}
        currentDocumentId={currentDocumentId}
        onSaved={onDocumentSaved}
        open={showSaveToCaseDialog}
        onOpenChange={setShowSaveToCaseDialog}
      />
      
      <SaveToIManageDialog 
        title={documentTitle}
        content={documentContent}
        category={documentCategory}
        currentDocumentId={currentDocumentId}
        onSaved={onDocumentSaved}
        open={showSaveToIManageDialog}
        onOpenChange={setShowSaveToIManageDialog}
      />
      
      <GetFromIManageDialog 
        onDocumentSelected={onDocumentLoaded}
        open={showGetFromIManageDialog}
        onOpenChange={setShowGetFromIManageDialog}
      />
    </div>
  );
};

export default DocumentToolbar;
