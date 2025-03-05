
import { useState } from 'react';
import { saveAs } from 'file-saver';
import { 
  Save, 
  Download, 
  Share2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import SaveToCaseDialog from './SaveToCaseDialog';
import { toast } from 'sonner';

interface DocumentToolbarProps {
  onBack: () => void;
  showAiPrompt: boolean;
  setShowAiPrompt: (show: boolean) => void;
  onSaveDocument: () => void;
  documentTitle: string;
  documentContent: string;
  documentCategory: string; // Add this prop
  currentDocumentId: string | null;
  onDocumentSaved: (id: string) => void;
}

const DocumentToolbar = ({ 
  onBack, 
  showAiPrompt, 
  setShowAiPrompt,
  onSaveDocument,
  documentTitle,
  documentContent,
  documentCategory, // Add this prop
  currentDocumentId,
  onDocumentSaved
}: DocumentToolbarProps) => {
  
  const handleExportPDF = () => {
    // Create a hidden iframe to print the content as PDF
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Write document content to the iframe
    iframe.contentDocument?.open();
    iframe.contentDocument?.write(`
      <html>
        <head>
          <title>${documentTitle || 'Document'}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 24px;
              border-bottom: 1px solid #eee;
              padding-bottom: 12px;
            }
            pre {
              white-space: pre-wrap;
              font-family: Arial, sans-serif;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <h1>${documentTitle || 'Untitled Document'}</h1>
          <pre>${documentContent}</pre>
        </body>
      </html>
    `);
    iframe.contentDocument?.close();
    
    // Print the iframe content
    setTimeout(() => {
      iframe.contentWindow?.print();
      document.body.removeChild(iframe);
      toast.success("Document ready for PDF export");
    }, 500);
  };

  const handleExportDocx = () => {
    // For DOCX, we'll create a simple text file
    // In a real app, you would use a library like docx.js
    const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${documentTitle || 'document'}.txt`);
    toast.success("Document exported as text file");
  };

  const handleExportTxt = () => {
    const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${documentTitle || 'document'}.txt`);
    toast.success("Document exported as text file");
  };
  
  return (
    <div className="flex items-center justify-between mb-4">
      <Button
        variant="ghost"
        size="sm"
        className="gap-1"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1 text-xs"
          onClick={onSaveDocument}
        >
          <Save className="h-3 w-3" />
          Save
        </Button>
        
        <SaveToCaseDialog 
          documentTitle={documentTitle}
          documentContent={documentContent}
          documentCategory={documentCategory} // Pass the category to SaveToCaseDialog
          currentDocumentId={currentDocumentId}
          onSaved={onDocumentSaved}
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 text-xs"
            >
              <Download className="h-3 w-3" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportPDF}>
              <Download className="h-3.5 w-3.5 mr-2" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportTxt}>
              <Download className="h-3.5 w-3.5 mr-2" />
              Export as Text File
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          variant="outline"
          size="sm"
          className="gap-1 text-xs"
        >
          <Share2 className="h-3 w-3" />
          Share
        </Button>
        <Button
          variant={showAiPrompt ? "default" : "outline"}
          size="sm"
          className="gap-1 text-xs"
          onClick={() => setShowAiPrompt(!showAiPrompt)}
        >
          <Sparkles className="h-3 w-3" />
          AI Assist
        </Button>
      </div>
    </div>
  );
};

export default DocumentToolbar;
