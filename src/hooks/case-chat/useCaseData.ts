
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getCase, getCaseDocuments, normalizeCaseId } from '@/utils/documents';

export function useCaseData(caseId: string | undefined) {
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<any | null>(null);
  const [caseDocuments, setCaseDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!caseId) {
      navigate('/case-management');
      return;
    }
    
    const loadCase = () => {
      try {
        // Always normalize the case ID consistently
        const normalizedCaseId = normalizeCaseId(caseId);
        console.log("Loading case with normalized ID:", normalizedCaseId);
        
        const caseInfo = getCase(normalizedCaseId);
        if (caseInfo) {
          console.log("Case found:", caseInfo);
          setCaseData({
            ...caseInfo,
            caseNumber: caseInfo.id
          });
          
          // Use the normalized case ID for getting documents
          const docs = getCaseDocuments(normalizedCaseId);
          console.log(`Found ${docs.length} documents for case:`, normalizedCaseId);
          
          setCaseDocuments(docs.map(doc => ({
            id: doc.id,
            name: doc.title,
            type: 'Document',
            date: new Date(doc.lastModified).toLocaleDateString()
          })));
          
          setLoading(false);
        } else {
          console.error("Case not found with ID:", normalizedCaseId);
          toast.error('Case not found');
          navigate('/case-management');
        }
      } catch (error) {
        console.error('Error loading case:', error);
        toast.error('Failed to load case');
        navigate('/case-management');
      }
    };
    
    loadCase();
  }, [caseId, navigate]);

  return { caseData, caseDocuments, loading };
}
