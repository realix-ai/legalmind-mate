
import { toast } from 'sonner';
import { format } from 'date-fns';

export type ExportFormat = 'pdf' | 'docx' | 'txt' | 'html' | 'md';

export interface ExportOptions {
  includePageNumbers?: boolean;
  includeDatetime?: boolean;
  includeHeaders?: boolean;
  headerText?: string;
  footerText?: string;
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  fontSize?: number;
  fontFamily?: string;
}

const defaultExportOptions: ExportOptions = {
  includePageNumbers: true,
  includeDatetime: true,
  includeHeaders: false,
  margins: {
    top: 1,
    right: 1,
    bottom: 1,
    left: 1
  },
  fontSize: 12,
  fontFamily: 'Times New Roman'
};

export const exportDocument = (
  title: string, 
  content: string, 
  format: ExportFormat,
  options: Partial<ExportOptions> = {}
): void => {
  const mergedOptions = { ...defaultExportOptions, ...options };
  
  console.log(`Exporting document "${title}" as ${format} with options:`, mergedOptions);
  
  // In a real implementation, this would call different export functions
  // based on the format. For now, we'll just simulate the export.
  
  setTimeout(() => {
    toast.success(`Document exported as ${format.toUpperCase()}`);
    
    // Create a dummy download that just opens a text file
    simulateDownload(title, content, format);
  }, 1000);
};

export const exportAsPdf = (
  title: string, 
  content: string, 
  options: Partial<ExportOptions> = {}
): void => {
  toast.loading('Generating PDF...');
  exportDocument(title, content, 'pdf', options);
};

export const exportAsDocx = (
  title: string, 
  content: string, 
  options: Partial<ExportOptions> = {}
): void => {
  toast.loading('Generating DOCX...');
  exportDocument(title, content, 'docx', options);
};

export const exportAsText = (
  title: string, 
  content: string
): void => {
  exportDocument(title, content, 'txt');
};

export const exportAsHtml = (
  title: string, 
  content: string, 
  options: Partial<ExportOptions> = {}
): void => {
  exportDocument(title, content, 'html', options);
};

export const exportAsMarkdown = (
  title: string, 
  content: string
): void => {
  exportDocument(title, content, 'md');
};

// Helper function to simulate download
const simulateDownload = (title: string, content: string, format: ExportFormat): void => {
  // Create a blob with the document content
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  // Create a download link
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/\s+/g, '_')}_${format}_${format(new Date(), 'yyyy-MM-dd')}.${format}`;
  
  // Trigger the download
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
