
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { formatCitation } from '@/utils/documents/citationFormatter';
import { toast } from 'sonner';
import { CitationStyleSelector } from '../format/CitationStyleSelector';
import { CitationTypeSelector } from '../format/CitationTypeSelector';
import { CitationFormFields } from '../format/CitationFormFields';
import { FormattedCitationDisplay } from '../format/FormattedCitationDisplay';

interface FormatTabProps {
  onInsertCitation: (citation: string) => void;
}

export function FormatTab({ onInsertCitation }: FormatTabProps) {
  const [customCitation, setCustomCitation] = useState({
    type: 'case' as 'case' | 'statute' | 'regulation' | 'article' | 'book' | 'website',
    title: '',
    year: new Date().getFullYear(),
    volume: '',
    reporter: '',
    court: '',
    pageNumber: '',
    pinpoint: '',
  });
  const [citationStyle, setCitationStyle] = useState('bluebook');
  const [formattedCitation, setFormattedCitation] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);

  // Update the formatted citation whenever any of the inputs change
  useEffect(() => {
    if (customCitation.title) {
      const formatted = formatCitation(
        customCitation,
        citationStyle as any
      );
      setFormattedCitation(formatted);
      setIsGenerated(true);
    }
  }, [customCitation, citationStyle]);

  // Generate the formatted citation (for the button click)
  const generateCitation = () => {
    const formatted = formatCitation(
      customCitation,
      citationStyle as any
    );
    setFormattedCitation(formatted);
    setIsGenerated(true);
    toast.success('Citation generated');
  };

  // Update custom citation field
  const updateCitation = (field: string, value: any) => {
    setCustomCitation({
      ...customCitation,
      [field]: value
    });
  };

  // Handle the insertion of a citation
  const handleInsertCitation = () => {
    if (!isGenerated && customCitation.title) {
      generateCitation();
    }
    if (formattedCitation) {
      onInsertCitation(formattedCitation);
      toast.success('Citation inserted');
    } else {
      toast.error('Please enter a title to generate a citation');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <CitationStyleSelector 
          value={citationStyle} 
          onChange={setCitationStyle} 
        />
        
        <CitationTypeSelector 
          value={customCitation.type} 
          onChange={updateCitation} 
        />
        
        <CitationFormFields 
          data={customCitation} 
          onChange={updateCitation} 
        />

        <Separator />
        
        <FormattedCitationDisplay 
          citation={formattedCitation}
          hasTitle={!!customCitation.title}
          onGenerateClick={generateCitation}
          onInsertClick={handleInsertCitation}
        />
      </div>
    </div>
  );
}

export default FormatTab;
