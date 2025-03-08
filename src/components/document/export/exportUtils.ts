
import { toast } from 'sonner';
import { ExportFormat } from './types';

// Convert markdown content to HTML
export const convertMarkdownToHtml = (title: string, content: string): string => {
  // Convert markdown content to basic HTML
  let htmlContent = content
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/# (.*)/g, '<h1>$1</h1>')
    .replace(/## (.*)/g, '<h2>$1</h2>')
    .replace(/### (.*)/g, '<h3>$1</h3>');
  
  return `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1, h2, h3 { color: #333; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div>${htmlContent}</div>
</body>
</html>`;
};

// Function to download a file
export const downloadFile = (content: string, filename: string, type: string): void => {
  try {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    const formatName = type.split('/')[1]?.toUpperCase() || type;
    toast.success(`Document exported as ${formatName}`);
  } catch (error) {
    console.error(`Export error (${type}):`, error);
    toast.error(`Failed to export document`);
  }
};

// Export to PDF (mock implementation that would be replaced with actual PDF generation in production)
export const exportToPdf = (title: string, content: string): void => {
  // In a real implementation, you would use a library like jsPDF
  const sanitizedTitle = title.replace(/\s+/g, '-');
  
  // Create a simple pseudo-PDF for demonstration
  const pdfContent = `%PDF-1.5
1 0 obj
<< /Title (${title}) /Author (Legal Document) /CreationDate (D:${new Date().toISOString()}) >>
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
<< /Length ${content.length} >>
stream
${content}
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
${content.length + 350}
%%EOF`;
  
  downloadFile(pdfContent, `${sanitizedTitle}.pdf`, 'application/pdf');
};

// Export to DOCX (mock implementation that would be replaced with actual DOCX generation in production)
export const exportToDocx = (title: string, content: string): void => {
  // In a real implementation, you would use a library like docx-js
  const sanitizedTitle = title.replace(/\s+/g, '-');
  
  // Create a simple XML structure similar to DOCX for demonstration
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
        <w:t>${content}</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>`;
  
  downloadFile(docxContent, `${sanitizedTitle}.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
};

// Export to TXT
export const exportToTxt = (title: string, content: string): void => {
  const sanitizedTitle = title.replace(/\s+/g, '-');
  
  // Convert content to plain text (remove HTML/markdown formatting)
  const plainText = content
    .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold
    .replace(/\*(.*?)\*/g, '$1')      // Remove italics
    .replace(/# (.*)/g, '$1')         // Remove h1
    .replace(/## (.*)/g, '$1')        // Remove h2
    .replace(/### (.*)/g, '$1');      // Remove h3
  
  downloadFile(plainText, `${sanitizedTitle}.txt`, 'text/plain');
};

// Export to HTML
export const exportToHtml = (title: string, content: string): void => {
  const htmlContent = convertMarkdownToHtml(title, content);
  const sanitizedTitle = title.replace(/\s+/g, '-');
  downloadFile(htmlContent, `${sanitizedTitle}.html`, 'text/html');
};

// Export to Markdown
export const exportToMarkdown = (title: string, content: string): void => {
  const sanitizedTitle = title.replace(/\s+/g, '-');
  downloadFile(content, `${sanitizedTitle}.md`, 'text/markdown');
};

// Send via email
export const sendViaEmail = (title: string, content: string, email: string = ''): void => {
  try {
    const subject = encodeURIComponent(`Document: ${title}`);
    const body = encodeURIComponent(content);
    
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
    
    toast.success('Email client opened');
  } catch (error) {
    console.error('Email error:', error);
    toast.error('Failed to open email client');
  }
};

// Send via Outlook
export const sendViaOutlook = (title: string, content: string, outlookEmail: string): void => {
  try {
    const subject = encodeURIComponent(`Document: ${title}`);
    const body = encodeURIComponent(content);
    
    window.open(`mailto:${outlookEmail}?subject=${subject}&body=${body}`);
    
    console.log(`Sending document "${title}" via Outlook to ${outlookEmail}`);
    toast.success(`Document sent via Outlook to ${outlookEmail}`);
  } catch (error) {
    console.error('Outlook export error:', error);
    toast.error('Failed to send via Outlook');
  }
};

// Print document
export const printDocument = (title: string, content: string): void => {
  try {
    // Create a printable version of the document
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Could not open print window. Please check your popup blocker settings.');
      return;
    }
    
    const htmlContent = convertMarkdownToHtml(title, content);
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Trigger the print dialog
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
    
    toast.success('Printing document');
  } catch (error) {
    console.error('Print error:', error);
    toast.error('Failed to print document');
  }
};
