
import React, { useState } from 'react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FileText, File, Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define export format types
export type ExportFormat = 'pdf' | 'docx' | 'html' | 'txt' | 'md' | 'email' | 'outlook';

interface ExportOptionsProps {
  title: string;
  content: string;
  onExportPdf: () => void;
  onExportDocx: () => void;
  onExportTxt: () => void;
  onPrint: () => void;
  onEmailDocument: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ 
  title, 
  content, 
  onExportPdf, 
  onExportDocx, 
  onExportTxt, 
  onPrint,
  onEmailDocument,
  open,
  onOpenChange
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const isOutlookConnected = localStorage.getItem('outlook-connected') === 'true';
  const outlookEmail = localStorage.getItem('outlook-email') || '';
  
  const handleExportToOutlook = () => {
    try {
      // This would typically use the Microsoft Graph API in a real implementation
      // For our simulation, we'll use the standard mailto: approach
      const subject = encodeURIComponent(`Document: ${title}`);
      const body = encodeURIComponent(`Please find attached the document "${title}".\n\n${content}`);
      
      window.open(`mailto:${outlookEmail}?subject=${subject}&body=${body}`);
      
      console.log(`Sending document "${title}" via Outlook to ${outlookEmail}`);
    } catch (error) {
      console.error('Outlook export error:', error);
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="xs" className="gap-1">
            <Download className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Export</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem onClick={onEmailDocument}>
            <Mail className="h-4 w-4 mr-2" />
            Email Document
          </DropdownMenuItem>
          
          {isOutlookConnected && (
            <DropdownMenuItem onClick={handleExportToOutlook}>
              <Mail className="h-4 w-4 mr-2" />
              Send via Outlook
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={onExportPdf}>
            <FileText className="h-4 w-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportDocx}>
            <File className="h-4 w-4 mr-2" />
            Export as DOCX
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onExportTxt}>
            Export as TXT
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onPrint}>
            Print Document
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Alternative implementation if we need the dialog version */}
      {open !== undefined && onOpenChange !== undefined && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Options</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button onClick={onExportPdf} className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
              <Button onClick={onExportDocx} className="w-full justify-start">
                <File className="h-4 w-4 mr-2" />
                Export as DOCX
              </Button>
              <Button onClick={onExportTxt} className="w-full justify-start">
                Export as TXT
              </Button>
              <Button onClick={onPrint} className="w-full justify-start">
                Print Document
              </Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ExportOptions;
