
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CitationFormat = 'standard' | 'bluebook' | 'apa' | 'chicago';

interface CitationFormatSelectorProps {
  value: CitationFormat;
  onChange: (value: CitationFormat) => void;
}

const CitationFormatSelector = ({ value, onChange }: CitationFormatSelectorProps) => {
  return (
    <Select 
      value={value} 
      onValueChange={(value) => onChange(value as CitationFormat)}
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

export default CitationFormatSelector;
