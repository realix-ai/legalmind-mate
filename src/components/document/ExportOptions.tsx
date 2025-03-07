
import React from 'react';
import { 
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenu
} from '@/components/ui/dropdown-menu';
import { FileText, File, Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define export format types
export type ExportFormat = 'pdf' | 'docx' | 'html' | 'txt' | 'md' | 'email';

interface ExportOptionsProps {
  title: string;
  content: string;
  onExportPdf: () => void;
  onExportDocx: () => void;
  onExportTxt: () => void;
  onPrint: () => void;
  onEmailDocument: () => void;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ 
  title, 
  content, 
  onExportPdf, 
  onExportDocx, 
  onExportTxt, 
  onPrint,
  onEmailDocument 
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="xs" className="gap-1">
          <Download className="h-3.5 w-3.5 mr-1" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={onEmailDocument}>
          <Mail className="h-4 w-4 mr-2" />
          Email Document
        </DropdownMenuItem>
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
  );
};

export default ExportOptions;
