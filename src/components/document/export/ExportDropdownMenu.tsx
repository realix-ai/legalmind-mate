
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Download, FileText, File, Mail } from 'lucide-react';
import { ExportFormat } from './types';

interface ExportDropdownMenuProps {
  onExportPdf: () => void;
  onExportDocx: () => void;
  onExportTxt: () => void;
  onExportHTML: () => void;
  onExportMarkdown: () => void;
  onEmailDocument: () => void;
  onExportToOutlook: () => void;
  onPrint: () => void;
  isOutlookConnected: boolean;
}

const ExportDropdownMenu: React.FC<ExportDropdownMenuProps> = ({
  onExportPdf,
  onExportDocx,
  onExportTxt,
  onExportHTML,
  onExportMarkdown,
  onEmailDocument,
  onExportToOutlook,
  onPrint,
  isOutlookConnected
}) => {
  return (
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
          <DropdownMenuItem onClick={onExportToOutlook}>
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
        <DropdownMenuItem onClick={onExportHTML}>
          Export as HTML
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportMarkdown}>
          Export as Markdown
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onPrint}>
          Print Document
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportDropdownMenu;
