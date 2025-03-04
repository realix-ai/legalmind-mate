
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import type { ExportFormat } from '@/components/document/ExportOptions';

interface ExportOptions {
  title: string;
  content: string;
  format: ExportFormat;
}

// Helper to convert HTML content to plain text
const htmlToPlainText = (html: string): string => {
  // Create a temporary DOM element
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  
  // Get the text content
  return tempElement.textContent || tempElement.innerText || '';
};

// Mock PDF export function
const exportAsPdf = ({ title, content }: { title: string; content: string }): Blob => {
  // In a real implementation, you would use a library like jsPDF or pdfmake
  // This is just a mock to simulate a PDF export
  const plainText = htmlToPlainText(content);
  
  // Create a pseudo-PDF structure
  const pdfContent = `%PDF-1.5
1 0 obj
<< /Title (${title}) /Author (Legal AI Assistant) /CreationDate (D:${new Date().toISOString()}) >>
endobj
2 0 obj
<< /Type /Catalog /Pages 3 0 R >>
endobj
3 0 obj
<< /Type /Pages /Kids [4 0 R] /Count 1 >>
endobj
4 0 obj
<< /Type /Page /MediaBox [0 0 612 792] /Contents 5 0 R /Parent 3 0 R >>
endobj
5 0 obj
<< /Length ${plainText.length} >>
stream
${plainText}
endstream
endobj
xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000098 00000 n
0000000147 00000 n
0000000206 00000 n
0000000284 00000 n
trailer
<< /Size 6 /Root 2 0 R /Info 1 0 R >>
startxref
${plainText.length + 350}
%%EOF`;
  
  return new Blob([pdfContent], { type: 'application/pdf' });
};

// Mock DOCX export function
const exportAsDocx = ({ title, content }: { title: string; content: string }): Blob => {
  // In a real implementation, you would use a library like docx
  // This is just a mock to simulate a DOCX export
  const plainText = htmlToPlainText(content);
  
  // Create a pseudo-DOCX structure (a ZIP container with XML files)
  const docxContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:t>${title}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>${plainText}</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>`;
  
  return new Blob([docxContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
};

// Export service
export const exportDocument = ({ title, content, format }: ExportOptions): void => {
  try {
    let blob: Blob;
    let fileName: string;
    
    // Create different file types based on the requested format
    switch (format) {
      case 'pdf':
        blob = exportAsPdf({ title, content });
        fileName = `${title}.pdf`;
        break;
        
      case 'docx':
        blob = exportAsDocx({ title, content });
        fileName = `${title}.docx`;
        break;
        
      case 'html':
        blob = new Blob([content], { type: 'text/html' });
        fileName = `${title}.html`;
        break;
        
      case 'txt':
        blob = new Blob([htmlToPlainText(content)], { type: 'text/plain' });
        fileName = `${title}.txt`;
        break;
        
      case 'md':
        // Simple HTML to Markdown conversion
        const markdown = content
          .replace(/<h1.*?>(.*?)<\/h1>/gi, '# $1\n\n')
          .replace(/<h2.*?>(.*?)<\/h2>/gi, '## $1\n\n')
          .replace(/<h3.*?>(.*?)<\/h3>/gi, '### $1\n\n')
          .replace(/<p.*?>(.*?)<\/p>/gi, '$1\n\n')
          .replace(/<strong.*?>(.*?)<\/strong>/gi, '**$1**')
          .replace(/<em.*?>(.*?)<\/em>/gi, '*$1*')
          .replace(/<a href="(.*?)".*?>(.*?)<\/a>/gi, '[$2]($1)')
          .replace(/<ul.*?>(.*?)<\/ul>/gis, '$1\n')
          .replace(/<li.*?>(.*?)<\/li>/gi, '- $1\n')
          .replace(/<br.*?>/gi, '\n')
          .replace(/<[^>]*>/g, '');
          
        blob = new Blob([markdown], { type: 'text/markdown' });
        fileName = `${title}.md`;
        break;
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
    
    // Save the file using FileSaver.js
    saveAs(blob, fileName);
    
    toast.success(`Document exported as ${format.toUpperCase()}`);
  } catch (error) {
    console.error('Error exporting document:', error);
    toast.error('Failed to export document');
  }
};
