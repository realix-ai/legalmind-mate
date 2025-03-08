
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { citationStyles } from '@/utils/documents/citationFormatter';

interface CitationStyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CitationStyleSelector({ value, onChange }: CitationStyleSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="citation-style">Citation Style</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
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
  );
}
