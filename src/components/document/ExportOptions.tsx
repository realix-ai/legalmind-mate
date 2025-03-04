
import React from 'react';
import { 
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenu
} from '@/components/ui/dropdown-menu';
import { FileText, File, Download } from 'lucide-react';
import { toast } from 'sonner';

// Define export format types
export type ExportFormat = 'pdf' | 'docx' | 'html' | 'txt' | 'md';

interface ExportOptionsProps {
  onExport: (format: ExportFormat) => void;
  documentTitle: string;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ onExport, documentTitle }) => {
  const handleExport = (format: ExportFormat) => {
    onExport(format);
    toast.success(`Exporting "${documentTitle}" as ${format.toUpperCase()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-muted">
          <Download className="h-4 w-4" />
          Export
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('docx')}>
          <File className="h-4 w-4 mr-2" />
          Export as DOCX
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('html')}>
          Export as HTML
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('txt')}>
          Export as TXT
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('md')}>
          Export as Markdown
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportOptions;
