
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResearchToolType, researchTools, isToolConfigured } from '@/services/legalResearchToolsService';

interface ResearchToolSelectorProps {
  selectedTool: ResearchToolType | '';
  onToolSelect: (tool: ResearchToolType | '') => void;
}

const ResearchToolSelector = ({ selectedTool, onToolSelect }: ResearchToolSelectorProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Label htmlFor="research-database" className="text-sm font-medium mb-2 block">
        Research Database (Optional)
      </Label>
      <Select value={selectedTool} onValueChange={(value) => onToolSelect(value as ResearchToolType | '')}>
        <SelectTrigger id="research-database" className="w-full">
          <SelectValue placeholder="Select a research database (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">None (Use built-in research)</SelectItem>
          {researchTools.map((tool) => (
            <SelectItem 
              key={tool.id} 
              value={tool.id}
              disabled={!tool.isConfigured && tool.id !== 'googlescholar'}
            >
              {tool.name} {!tool.isConfigured && tool.id !== 'googlescholar' ? "(Not Configured)" : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedTool && !isToolConfigured(selectedTool) && selectedTool !== 'googlescholar' && (
        <p className="text-xs text-amber-500 mt-1">
          This database needs to be configured in the Research Tools tab
        </p>
      )}
    </div>
  );
};

export default ResearchToolSelector;
