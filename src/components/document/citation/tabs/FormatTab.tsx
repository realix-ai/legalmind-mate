
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { FileText, Check } from 'lucide-react';
import { formatCitation, citationTypes, citationStyles } from '@/utils/documents/citationFormatter';
import { toast } from 'sonner';

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

  // Generate the formatted citation
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
    // Reset the generated state when inputs change
    if (isGenerated) {
      setIsGenerated(false);
    }
  };

  // Handle the insertion of a citation
  const handleInsertCitation = () => {
    // If not generated yet, generate first
    if (!isGenerated) {
      generateCitation();
    }
    onInsertCitation(formattedCitation);
    toast.success('Citation inserted');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="citation-style">Citation Style</Label>
          <Select 
            value={citationStyle} 
            onValueChange={(value) => {
              setCitationStyle(value);
              setIsGenerated(false);
            }}
          >
            <SelectTrigger id="citation-style">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {citationStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="citation-type">Citation Type</Label>
          <Select 
            value={customCitation.type} 
            onValueChange={(value) => updateCitation('type', value)}
          >
            <SelectTrigger id="citation-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {citationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="citation-title">Case Name/Title</Label>
          <Input
            id="citation-title"
            value={customCitation.title}
            onChange={(e) => updateCitation('title', e.target.value)}
            placeholder="e.g., Roe v. Wade"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="citation-year">Year</Label>
            <Input
              id="citation-year"
              type="number"
              value={customCitation.year}
              onChange={(e) => updateCitation('year', parseInt(e.target.value) || customCitation.year)}
              placeholder="e.g., 2023"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="citation-volume">Volume</Label>
            <Input
              id="citation-volume"
              value={customCitation.volume}
              onChange={(e) => updateCitation('volume', e.target.value)}
              placeholder="e.g., 410"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="citation-reporter">Reporter</Label>
            <Input
              id="citation-reporter"
              value={customCitation.reporter}
              onChange={(e) => updateCitation('reporter', e.target.value)}
              placeholder="e.g., U.S."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="citation-page">Page Number</Label>
            <Input
              id="citation-page"
              value={customCitation.pageNumber}
              onChange={(e) => updateCitation('pageNumber', e.target.value)}
              placeholder="e.g., 113"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="citation-court">Court</Label>
          <Input
            id="citation-court"
            value={customCitation.court}
            onChange={(e) => updateCitation('court', e.target.value)}
            placeholder="e.g., Supreme Court"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="citation-pinpoint">Pinpoint Citation</Label>
          <Input
            id="citation-pinpoint"
            value={customCitation.pinpoint}
            onChange={(e) => updateCitation('pinpoint', e.target.value)}
            placeholder="e.g., 115-116"
          />
        </div>

        <Button 
          onClick={generateCitation}
          className="w-full mt-4"
          variant="secondary"
        >
          <FileText className="mr-2 h-4 w-4" />
          Generate Citation
        </Button>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <Label>Formatted Citation:</Label>
        <div className={`p-3 border rounded-md ${isGenerated ? 'bg-muted/80' : 'bg-muted/30'}`}>
          <p className="break-all text-sm font-mono">
            {isGenerated ? formattedCitation : 'Click "Generate Citation" to create your formatted citation'}
          </p>
        </div>
        <Button 
          onClick={handleInsertCitation} 
          className="w-full"
          disabled={!customCitation.title}
        >
          <Check className="mr-2 h-4 w-4" />
          Insert Citation
        </Button>
      </div>
    </div>
  );
}

export default FormatTab;
