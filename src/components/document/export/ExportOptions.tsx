
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { ExportFormat } from './types';
import { 
  exportToPdf, 
  exportToDocx, 
  exportToTxt, 
  exportToHtml, 
  exportToMarkdown, 
  sendViaEmail, 
  sendViaOutlook,
  printDocument
} from './exportUtils';
import ExportDropdownMenu from './ExportDropdownMenu';
import ExportDialogContent from './ExportDialogContent';

interface ExportOptionsProps {
  title: string;
  content: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ 
  title, 
  content, 
  open,
  onOpenChange
}) => {
  const isOutlookConnected = localStorage.getItem('outlook-connected') === 'true';
  const outlookEmail = localStorage.getItem('outlook-email') || '';
  
  // Export to PDF handler
  const handleExportPdf = () => {
    exportToPdf(title, content);
  };
  
  // Export to DOCX handler
  const handleExportDocx = () => {
    exportToDocx(title, content);
  };
  
  // Export to TXT handler
  const handleExportTxt = () => {
    exportToTxt(title, content);
  };
  
  // Export to HTML handler
  const handleExportHTML = () => {
    exportToHtml(title, content);
  };
  
  // Export to Markdown handler
  const handleExportMarkdown = () => {
    exportToMarkdown(title, content);
  };

  // Email document handler
  const handleEmailDocument = () => {
    sendViaEmail(title, content);
  };

  // Export to Outlook handler
  const handleExportToOutlook = () => {
    sendViaOutlook(title, content, outlookEmail);
  };
  
  // Print document handler
  const handlePrint = () => {
    printDocument(title, content);
  };
  
  return (
    <>
      <ExportDropdownMenu 
        onExportPdf={handleExportPdf}
        onExportDocx={handleExportDocx}
        onExportTxt={handleExportTxt}
        onExportHTML={handleExportHTML}
        onExportMarkdown={handleExportMarkdown}
        onEmailDocument={handleEmailDocument}
        onExportToOutlook={handleExportToOutlook}
        onPrint={handlePrint}
        isOutlookConnected={isOutlookConnected}
      />

      {/* Dialog version of export options */}
      {open !== undefined && onOpenChange !== undefined && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <ExportDialogContent 
            onExportPdf={handleExportPdf}
            onExportDocx={handleExportDocx}
            onExportTxt={handleExportTxt}
            onExportHTML={handleExportHTML}
            onExportMarkdown={handleExportMarkdown}
            onPrint={handlePrint}
            onOpenChange={onOpenChange}
          />
        </Dialog>
      )}
    </>
  );
};

export default ExportOptions;
