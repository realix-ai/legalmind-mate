
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { citationTypes } from '@/utils/documents/citationFormatter';

interface CitationTypeSelectorProps {
  value: 'case' | 'statute' | 'regulation' | 'article' | 'book' | 'website';
  onChange: (value: 'case' | 'statute' | 'regulation' | 'article' | 'book' | 'website') => void;
}

export function CitationTypeSelector({ value, onChange }: CitationTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="citation-type">Citation Type</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
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
  );
}
