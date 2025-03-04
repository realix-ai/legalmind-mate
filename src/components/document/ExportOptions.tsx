
import { useState } from 'react';
import { 
  Download, 
  FileText, 
  File, 
  Copy, 
  Mail, 
  Printer, 
  Check 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useExportDocument } from '@/hooks/document/useExportDocument';

interface ExportOptionsProps {
  documentTitle: string;
  documentContent: string;
}

const ExportOptions = ({ documentTitle, documentContent }: ExportOptionsProps) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  
  const { 
    exportAsPdf, 
    exportAsDocx, 
    exportAsTxt, 
    printDocument 
  } = useExportDocument();
  
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(documentContent);
      setCopied(true);
      toast.success('Content copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy to clipboard');
    }
  };
  
  const handleEmailShare = () => {
    const subject = encodeURIComponent(documentTitle);
    const body = encodeURIComponent(documentContent);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    toast.success('Email client opened');
    setShowShareDialog(false);
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Export Options</DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => exportAsPdf(documentTitle, documentContent)}>
            <FileText className="h-4 w-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => exportAsDocx(documentTitle, documentContent)}>
            <File className="h-4 w-4 mr-2" />
            Export as DOCX
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => exportAsTxt(documentTitle, documentContent)}>
            <FileText className="h-4 w-4 mr-2" />
            Export as TXT
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleCopyToClipboard}>
            {copied ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            Copy to Clipboard
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => printDocument(documentTitle, documentContent)}>
            <Printer className="h-4 w-4 mr-2" />
            Print Document
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
            <Mail className="h-4 w-4 mr-2" />
            Share via Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share via Email</DialogTitle>
            <DialogDescription>
              The document will be shared in the body of an email.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Button onClick={handleEmailShare} className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              Open Email Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExportOptions;
