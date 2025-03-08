
import { toast } from 'sonner';

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
    const body = encodeURIComponent(`Please find attached the document "${title}".\n\n${content}`);
    
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
    const body = encodeURIComponent(`Please find attached the document "${title}".\n\n${content}`);
    
    window.open(`mailto:${outlookEmail}?subject=${subject}&body=${body}`);
    
    console.log(`Sending document "${title}" via Outlook to ${outlookEmail}`);
    toast.success(`Document sent via Outlook to ${outlookEmail}`);
  } catch (error) {
    console.error('Outlook export error:', error);
    toast.error('Failed to send via Outlook');
  }
};
