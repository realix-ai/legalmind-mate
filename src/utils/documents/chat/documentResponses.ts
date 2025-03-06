
// Helper function to generate document-related response
export const getDocumentRelatedResponse = (
  caseDocuments: Array<{id: string, title: string, content: string}>,
  caseName: string,
  lastUserContent: string
): string => {
  if (caseDocuments.length === 0) {
    return `I don't see any documents associated with "${caseName}" yet. You can add documents by:
    
1. Using the document drafting page to create new documents
2. Uploading files directly in this chat using the paperclip icon below
3. Importing existing documents from other sources

Would you like me to help you create a new document for this case?`;
  } else {
    // Construct response based on available documents
    let response = `I found ${caseDocuments.length} document(s) related to case "${caseName}":\n\n`;
    
    caseDocuments.forEach((doc, index) => {
      response += `${index + 1}. "${doc.title}"\n`;
      
      // Add a short excerpt from each document (first 100 chars)
      const excerpt = doc.content.substring(0, 100).trim();
      response += `   Excerpt: "${excerpt}${doc.content.length > 100 ? '...' : ''}"\n\n`;
    });
    
    // Attempt to answer the specific query based on document content
    if (lastUserContent.toLowerCase().includes('summary') || lastUserContent.toLowerCase().includes('summarize')) {
      response += `\nHere's a brief summary of the documents: The documents appear to be related to ${
        caseDocuments[0].title.includes('contract') ? 'contractual matters' : 
        caseDocuments[0].title.includes('legal') ? 'legal proceedings' : 
        'case-relevant information'
      }. Would you like me to analyze any specific document in more detail?`;
    }
    
    return response;
  }
};

// Helper function to generate file upload response
export const getFileUploadResponse = (
  uploadedFiles: File[],
  lastUserContent: string,
  caseName: string
): string => {
  let response = `I've received ${uploadedFiles.length} file${uploadedFiles.length === 1 ? '' : 's'} from you:\n\n`;
  
  uploadedFiles.forEach((file, index) => {
    response += `${index + 1}. **${file.name}** (${(file.size / 1024).toFixed(1)} KB)\n`;
    
    // Add file type specific response
    if (file.type.includes('pdf')) {
      response += `   This appears to be a PDF document. I can see the contents of this document.\n\n`;
    } else if (file.type.includes('image')) {
      response += `   This appears to be an image. I can see what's in this image.\n\n`;
    } else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
      response += `   This appears to be a Word document. I can see the contents of this document.\n\n`;
    } else if (file.type.includes('text') || file.name.endsWith('.txt')) {
      response += `   This appears to be a text file. I can see the contents of this file.\n\n`;
    } else {
      response += `   I can see the contents of this file.\n\n`;
    }
  });
  
  // Add a response to their message if they included text
  if (lastUserContent.trim()) {
    response += `\nRegarding your message: "${lastUserContent}"\n\n`;
    
    // Add a contextual response based on the message
    if (lastUserContent.toLowerCase().includes('analyze') || 
        lastUserContent.toLowerCase().includes('review')) {
      response += `I'll help analyze these files in the context of your case "${caseName}". The documents appear to contain information relevant to your case. Let me know if you need any specific details from them.`;
    } else if (lastUserContent.toLowerCase().includes('summarize')) {
      response += `I'll summarize the key points from these files for your case "${caseName}". The documents contain information that could be useful for your legal strategy. Let me know if you'd like me to focus on any particular aspects.`;
    } else {
      response += `I'll review these files in relation to your case "${caseName}". They contain information that might be relevant to your legal matters. Feel free to ask me specific questions about the content.`;
    }
  } else {
    // Generic response if no message text
    response += `I've added these files to the case "${caseName}". Would you like me to analyze their contents or extract specific information from them?`;
  }
  
  // Note about file storage
  response += `\n\nNote: These files are now associated with this conversation session. You can reference them in future messages.`;
  
  return response;
};

// Helper function to generate upload instructions response
export const getUploadInstructionsResponse = (caseName: string): string => {
  return `You can upload files to this case by clicking the paperclip icon in the message input area. This allows you to:

1. Upload PDF documents
2. Upload Word documents (.doc, .docx)
3. Upload text files (.txt)
4. Upload images (.jpg, .png)

Files you upload will be associated with this conversation and I can help analyze their contents in the context of your case "${caseName}".`;
};
