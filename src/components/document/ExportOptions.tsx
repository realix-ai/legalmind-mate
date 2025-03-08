
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
import { toast } from 'sonner';

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
      toast.success(`Document sent via Outlook to ${outlookEmail}`);
    } catch (error) {
      console.error('Outlook export error:', error);
      toast.error('Failed to send via Outlook');
    }
  };
  
  // Function to handle HTML export
  const handleExportHTML = () => {
    try {
      // Convert markdown content to basic HTML
      let htmlContent = content
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br/>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/# (.*)/g, '<h1>$1</h1>')
        .replace(/## (.*)/g, '<h2>$1</h2>')
        .replace(/### (.*)/g, '<h3>$1</h3>');
      
      htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1, h2, h3 { color: #333; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div>${htmlContent}</div>
</body>
</html>`;
      
      // Create data blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Document exported as HTML');
    } catch (error) {
      console.error('HTML export error:', error);
      toast.error('Failed to export HTML');
    }
  };
  
  // Function to handle Markdown export
  const handleExportMarkdown = () => {
    try {
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '-')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Document exported as Markdown');
    } catch (error) {
      console.error('Markdown export error:', error);
      toast.error('Failed to export Markdown');
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
          <DropdownMenuItem onClick={handleExportHTML}>
            Export as HTML
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportMarkdown}>
            Export as Markdown
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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
              <Button onClick={handleExportHTML} className="w-full justify-start">
                Export as HTML
              </Button>
              <Button onClick={handleExportMarkdown} className="w-full justify-start">
                Export as Markdown
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
