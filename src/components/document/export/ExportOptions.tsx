
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { ExportFormat } from './types';
import { exportToHtml, exportToMarkdown, sendViaEmail, sendViaOutlook } from './exportUtils';
import ExportDropdownMenu from './ExportDropdownMenu';
import ExportDialogContent from './ExportDialogContent';

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
  const isOutlookConnected = localStorage.getItem('outlook-connected') === 'true';
  const outlookEmail = localStorage.getItem('outlook-email') || '';
  
  // Export to HTML handler
  const handleExportHTML = () => {
    exportToHtml(title, content);
  };
  
  // Export to Markdown handler
  const handleExportMarkdown = () => {
    exportToMarkdown(title, content);
  };

  // Export to Outlook handler
  const handleExportToOutlook = () => {
    sendViaOutlook(title, content, outlookEmail);
  };
  
  return (
    <>
      <ExportDropdownMenu 
        onExportPdf={onExportPdf}
        onExportDocx={onExportDocx}
        onExportTxt={onExportTxt}
        onExportHTML={handleExportHTML}
        onExportMarkdown={handleExportMarkdown}
        onEmailDocument={onEmailDocument}
        onExportToOutlook={handleExportToOutlook}
        onPrint={onPrint}
        isOutlookConnected={isOutlookConnected}
      />

      {/* Dialog version of export options */}
      {open !== undefined && onOpenChange !== undefined && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <ExportDialogContent 
            onExportPdf={onExportPdf}
            onExportDocx={onExportDocx}
            onExportTxt={onExportTxt}
            onExportHTML={handleExportHTML}
            onExportMarkdown={handleExportMarkdown}
            onPrint={onPrint}
            onOpenChange={onOpenChange}
          />
        </Dialog>
      )}
    </>
  );
};

export default ExportOptions;
