
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResearchToolType } from '@/services/legalResearchToolsService';

interface ResearchToolSelectorProps {
  selectedTool: ResearchToolType | '';
  onToolSelect: (tool: ResearchToolType | '') => void;
}

const ResearchToolSelector = ({ selectedTool, onToolSelect }: ResearchToolSelectorProps) => {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium mb-2">Research database (optional):</p>
      <Select 
        value={selectedTool} 
        onValueChange={(value) => onToolSelect(value as ResearchToolType | '')}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a research database (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None (Use built-in AI only)</SelectItem>
          <SelectItem value="westlaw">Westlaw</SelectItem>
          <SelectItem value="lexisnexis">LexisNexis</SelectItem>
          <SelectItem value="googlescholar">Google Scholar</SelectItem>
          <SelectItem value="heinonline">HeinOnline</SelectItem>
          <SelectItem value="fastcase">Fastcase</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ResearchToolSelector;
