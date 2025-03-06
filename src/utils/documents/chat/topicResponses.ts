
// Helper function to generate date-related response
export const getDateRelatedResponse = (
  caseDocuments: Array<{id: string, title: string, content: string}>,
  caseName: string
): string => {
  let response = `Based on our previous conversation about "${caseName}", I notice there are some important deadlines coming up. The main filing deadline appears to be ${new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toLocaleDateString()}.`;
  
  // Add document-specific date information if available
  if (caseDocuments.length > 0) {
    const docsWithDates = caseDocuments.filter(doc => 
      doc.content.toLowerCase().includes('date') || 
      doc.content.toLowerCase().includes('deadline') ||
      doc.content.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)
    );
    
    if (docsWithDates.length > 0) {
      response += `\n\nI also found date references in ${docsWithDates.length} of your case documents that might be relevant.`;
    }
  }
  
  return response;
};

// Helper function to generate summary response
export const getSummaryResponse = (
  caseDocuments: Array<{id: string, title: string, content: string}>,
  caseName: string,
  lastUserContent: string
): string => {
  let response = `Here's a summary of case "${caseName}" based on our discussion so far:\n\n1. Case involves ${['contract dispute', 'intellectual property', 'employment law', 'regulatory compliance'][Math.floor(Math.random() * 4)]}\n2. Current stage: ${['Initial filing', 'Discovery', 'Pre-trial', 'Settlement negotiation'][Math.floor(Math.random() * 4)]}\n3. Key concerns we've discussed: ${lastUserContent.substring(0, 20)}...`;
  
  // Add document count if available
  if (caseDocuments.length > 0) {
    response += `\n4. Case has ${caseDocuments.length} associated document(s)`;
  }
  
  return response;
};

// Helper function to generate generic response
export const getGenericResponse = (
  caseDocuments: Array<{id: string, title: string, content: string}>,
  caseName: string
): string => {
  // Generic responses that reference previous conversation and documents
  const responses = [
    `Based on what we've discussed about "${caseName}" so far, I think we should focus on the ${['legal strategy', 'document preparation', 'witness statements', 'settlement options'][Math.floor(Math.random() * 4)]}.`,
    `Continuing our analysis of "${caseName}", I'd recommend looking into the ${['jurisdictional issues', 'procedural requirements', 'statutory deadlines', 'evidentiary standards'][Math.floor(Math.random() * 4)]}.`,
    `Given the context of our conversation about "${caseName}", the next steps could include ${['filing a motion', 'preparing discovery requests', 'interviewing witnesses', 'researching similar cases'][Math.floor(Math.random() * 4)]}.`,
    `To address the concerns you've raised about "${caseName}", we should consider ${['alternative dispute resolution', 'amending the complaint', 'requesting an extension', 'consulting an expert witness'][Math.floor(Math.random() * 4)]}.`
  ];
  
  let response = responses[Math.floor(Math.random() * responses.length)];
  
  // Add reference to documents if available
  if (caseDocuments.length > 0) {
    response += `\n\nBy the way, I have access to ${caseDocuments.length} document(s) associated with this case. Let me know if you'd like me to provide information from any of them.`;
  }
  
  // Remind about file upload capability
  response += `\n\nRemember, you can also upload files directly to this conversation using the paperclip icon below.`;
  
  return response;
};
