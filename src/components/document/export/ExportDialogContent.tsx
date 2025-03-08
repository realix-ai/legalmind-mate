
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, File } from 'lucide-react';
import ExportFormatButton from './ExportFormatButton';

interface ExportDialogContentProps {
  onExportPdf: () => void;
  onExportDocx: () => void;
  onExportTxt: () => void;
  onExportHTML: () => void;
  onExportMarkdown: () => void;
  onPrint: () => void;
  onOpenChange: (open: boolean) => void;
}

const ExportDialogContent: React.FC<ExportDialogContentProps> = ({
  onExportPdf,
  onExportDocx,
  onExportTxt,
  onExportHTML,
  onExportMarkdown,
  onPrint,
  onOpenChange
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Export Options</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <ExportFormatButton 
          format="pdf" 
          onExport={onExportPdf} 
          label="Export as PDF" 
          icon={FileText} 
        />
        <ExportFormatButton 
          format="docx" 
          onExport={onExportDocx} 
          label="Export as DOCX" 
          icon={File} 
        />
        <ExportFormatButton 
          format="txt" 
          onExport={onExportTxt} 
          label="Export as TXT" 
        />
        <ExportFormatButton 
          format="html" 
          onExport={onExportHTML} 
          label="Export as HTML" 
        />
        <ExportFormatButton 
          format="md" 
          onExport={onExportMarkdown} 
          label="Export as Markdown" 
        />
        <ExportFormatButton 
          format="print" 
          onExport={onPrint} 
          label="Print Document" 
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ExportDialogContent;
