
import { ExternalLink, Settings } from 'lucide-react';
import { ResearchTool } from '@/services/legalResearchToolsService';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LegalResearchToolItemProps {
  tool: ResearchTool;
  onSearch: (toolId: string) => void;
  onConfigure: (toolId: string) => void;
  isSearching: boolean;
}

const LegalResearchToolItem = ({
  tool,
  onSearch,
  onConfigure,
  isSearching
}: LegalResearchToolItemProps) => {
  return (
    <div className="border rounded-lg p-4 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="text-2xl">{tool.icon}</div>
          <h3 className="font-medium">{tool.name}</h3>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => window.open(tool.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Visit {tool.name} website</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
      
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={() => onSearch(tool.id)}
          disabled={isSearching || !tool.isConfigured}
        >
          Search with {tool.name}
        </Button>
        
        {!tool.isConfigured && tool.id !== 'googlescholar' && (
          <Button
            variant="outline"
            size="sm"
            className="px-2"
            onClick={() => onConfigure(tool.id)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default LegalResearchToolItem;
