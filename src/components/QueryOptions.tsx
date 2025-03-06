
import { cn } from '@/lib/utils';
import { 
  Search, 
  AlertTriangle, 
  FileText, 
  BarChart,
  CheckCircle
} from 'lucide-react';
import { QueryType } from '@/services/legalQueryService';

interface QueryOptionsProps {
  onSelect: (option: string) => void;
  selectedOption: string;
}

const QueryOptions = ({ onSelect, selectedOption }: QueryOptionsProps) => {
  const options = [
    {
      id: 'legal-research' as QueryType,
      title: 'Legal Research',
      description: 'Find relevant cases, statutes, and legal principles',
      icon: <Search className="h-4 w-4" />,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      id: 'risk-analysis' as QueryType,
      title: 'Risk Analysis',
      description: 'Evaluate potential legal risks and liabilities',
      icon: <AlertTriangle className="h-4 w-4" />,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
    },
    {
      id: 'summarize' as QueryType,
      title: 'Draft/Summarize',
      description: 'Create concise summaries or drafts of legal documents',
      icon: <FileText className="h-4 w-4" />,
      color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
    },
    {
      id: 'data-analysis' as QueryType,
      title: 'Data Analysis',
      description: 'Analyze patterns and insights in legal data',
      icon: <BarChart className="h-4 w-4" />,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-3xl mx-auto">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={cn(
            "flex flex-col items-center p-3 rounded-lg border transition-all duration-300 text-center h-full",
            selectedOption === option.id
              ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
              : "border-border hover:border-primary/30 hover:bg-primary/5"
          )}
        >
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full shrink-0 mb-2",
            option.color
          )}>
            {option.icon}
          </div>
          <div>
            <div className="flex items-center justify-center gap-1">
              <h3 className="font-medium text-sm">{option.title}</h3>
              {selectedOption === option.id && (
                <CheckCircle className="h-3 w-3 text-primary" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {option.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default QueryOptions;
