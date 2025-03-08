
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CitationFormatSelectorProps {
  citationFormat: 'standard' | 'bluebook' | 'apa' | 'chicago';
  onFormatChange: (format: 'standard' | 'bluebook' | 'apa' | 'chicago') => void;
}

export const CitationFormatSelector = ({ 
  citationFormat, 
  onFormatChange 
}: CitationFormatSelectorProps) => {
  return (
    <Select 
      value={citationFormat} 
      onValueChange={(value) => onFormatChange(value as any)}
    >
      <SelectTrigger className="h-7 text-xs w-[130px]">
        <SelectValue placeholder="Format" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="standard">Standard</SelectItem>
        <SelectItem value="bluebook">Bluebook</SelectItem>
        <SelectItem value="apa">APA</SelectItem>
        <SelectItem value="chicago">Chicago</SelectItem>
      </SelectContent>
    </Select>
  );
};
