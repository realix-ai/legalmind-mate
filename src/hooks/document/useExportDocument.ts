
import { useCallback } from 'react';
import { toast } from 'sonner';

// Since we can't use the actual document-generation libraries in this sandbox environment,
// we'll simulate the export functionality

export const useExportDocument = () => {
  // PDF Export
  const exportAsPdf = useCallback((title: string, content: string) => {
    try {
      console.log(`Exporting "${title}" as PDF`);
      
      // Create a hidden iframe for printing
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Write the content to the iframe with basic styling
      iframe.contentDocument?.open();
      iframe.contentDocument?.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 2cm;
              }
              h1 {
                font-size: 18pt;
                margin-bottom: 24pt;
              }
              p {
                font-size: 12pt;
                margin-bottom: 12pt;
              }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <div>${content.replace(/\n/g, '<br>')}</div>
          </body>
        </html>
      `);
      iframe.contentDocument?.close();
      
      // Print the iframe as PDF
      setTimeout(() => {
        iframe.contentWindow?.print();
        document.body.removeChild(iframe);
        toast.success('PDF export complete');
      }, 500);
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export as PDF');
    }
  }, []);
  
  // DOCX Export (simulated)
  const exportAsDocx = useCallback((title: string, content: string) => {
    try {
      console.log(`Exporting "${title}" as DOCX`);
      
      // In a real implementation, we would use a library like docx.js
      // For this simulation, we'll create a text file with .docx extension
      
      const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('DOCX export complete');
    } catch (error) {
      console.error('DOCX export error:', error);
      toast.error('Failed to export as DOCX');
    }
  }, []);
  
  // Text Export
  const exportAsTxt = useCallback((title: string, content: string) => {
    try {
      console.log(`Exporting "${title}" as TXT`);
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('TXT export complete');
    } catch (error) {
      console.error('TXT export error:', error);
      toast.error('Failed to export as TXT');
    }
  }, []);
  
  // Print Document
  const printDocument = useCallback((title: string, content: string) => {
    try {
      console.log(`Printing "${title}"`);
      
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      iframe.contentDocument?.open();
      iframe.contentDocument?.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 1cm;
              }
              h1 {
                font-size: 18pt;
                margin-bottom: 24pt;
              }
              p {
                font-size: 12pt;
                margin-bottom: 12pt;
              }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <div>${content.replace(/\n/g, '<br>')}</div>
          </body>
        </html>
      `);
      iframe.contentDocument?.close();
      
      setTimeout(() => {
        iframe.contentWindow?.print();
        document.body.removeChild(iframe);
      }, 500);
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to print document');
    }
  }, []);
  
  return {
    exportAsPdf,
    exportAsDocx,
    exportAsTxt,
    printDocument
  };
};
