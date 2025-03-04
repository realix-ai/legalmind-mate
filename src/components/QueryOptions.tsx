
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Search, 
  AlertTriangle, 
  FileText, 
  BarChart,
  CheckCircle
} from 'lucide-react';

interface QueryOptionsProps {
  onSelect: (option: string) => void;
  selectedOption: string;
}

const QueryOptions = ({ onSelect, selectedOption }: QueryOptionsProps) => {
  const options = [
    {
      id: 'legal-research',
      title: 'Legal Research',
      description: 'Find relevant cases, statutes, and legal principles',
      icon: <Search className="h-5 w-5" />,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      id: 'risk-analysis',
      title: 'Risk Analysis',
      description: 'Evaluate potential legal risks and liabilities',
      icon: <AlertTriangle className="h-5 w-5" />,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
    },
    {
      id: 'summarize',
      title: 'Summarize',
      description: 'Create concise summaries of legal documents',
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
    },
    {
      id: 'data-analysis',
      title: 'Data Analysis',
      description: 'Analyze patterns and insights in legal data',
      icon: <BarChart className="h-5 w-5" />,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-3xl mx-auto">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={cn(
            "flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 text-left",
            selectedOption === option.id
              ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
              : "border-border hover:border-primary/30 hover:bg-primary/5"
          )}
        >
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg shrink-0",
            option.color
          )}>
            {option.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{option.title}</h3>
              {selectedOption === option.id && (
                <CheckCircle className="h-4 w-4 text-primary" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {option.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default QueryOptions;
