
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { formatCitation, customCitationTemplates, FormatOptions } from '@/utils/documents/citationFormatter';
import { toast } from 'sonner';
import { CitationStyleSelector } from '../format/CitationStyleSelector';
import { CitationTypeSelector } from '../format/CitationTypeSelector';
import { CitationFormFields } from '../format/CitationFormFields';
import { FormattedCitationDisplay } from '../format/FormattedCitationDisplay';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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
  const [formatOptions, setFormatOptions] = useState<FormatOptions>({
    includeUrl: false,
    shortForm: false,
    uppercase: false
  });
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Get relevant templates for the selected citation type
  const applicableTemplates = customCitationTemplates.filter(
    template => template.type === customCitation.type
  );

  // Update the formatted citation whenever any of the inputs change
  useEffect(() => {
    if (customCitation.title) {
      const formatted = formatCitation(
        customCitation,
        citationStyle as any,
        formatOptions
      );
      setFormattedCitation(formatted);
      setIsGenerated(true);
    }
  }, [customCitation, citationStyle, formatOptions]);

  // Generate the formatted citation (for the button click)
  const generateCitation = () => {
    const formatted = formatCitation(
      customCitation,
      citationStyle as any,
      formatOptions
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

  // Handle type changes specifically
  const handleTypeChange = (type: 'case' | 'statute' | 'regulation' | 'article' | 'book' | 'website') => {
    updateCitation('type', type);
    // Reset selected template when type changes
    setSelectedTemplate('');
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

  // Apply a template to the current citation
  const applyTemplate = (templateId: string) => {
    if (!templateId) return;
    
    const template = customCitationTemplates.find(t => t.name === templateId);
    if (template) {
      // In a full implementation, we would apply the template logic here
      // For now, just show a toast
      toast.info(`Template "${template.name}" applied`);
    }
    
    setSelectedTemplate(templateId);
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
          onChange={handleTypeChange} 
        />
        
        {applicableTemplates.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="citation-template">Citation Template</Label>
            <Select 
              value={selectedTemplate} 
              onValueChange={applyTemplate}
            >
              <SelectTrigger id="citation-template">
                <SelectValue placeholder="Select template (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Template</SelectItem>
                {applicableTemplates.map((template) => (
                  <SelectItem key={template.name} value={template.name}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
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
          formatOptions={formatOptions}
          onFormatOptionsChange={setFormatOptions}
        />
      </div>
    </div>
  );
}

export default FormatTab;
