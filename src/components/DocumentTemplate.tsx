
import { cn } from '@/lib/utils';
import { FileText, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface DocumentTemplateProps {
  title: string;
  description: string;
  category: string;
  onClick: () => void;
}

const DocumentTemplate = ({ title, description, category, onClick }: DocumentTemplateProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'contract':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'litigation':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
      case 'corporate':
        return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'ip':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div
      className="border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-subtle hover:border-primary/30 cursor-pointer group"
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium group-hover:text-primary transition-colors">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
          <button
            className={cn(
              "p-1.5 rounded-full transition-all",
              isCopied ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted/90"
            )}
            onClick={handleCopy}
            aria-label="Copy template"
          >
            {isCopied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className={cn(
            "text-xs font-medium py-1 px-2.5 rounded-full",
            getCategoryColor(category)
          )}>
            {category}
          </span>
          
          <div className={cn(
            "text-xs text-muted-foreground transition-opacity",
            isHovering ? "opacity-100" : "opacity-0"
          )}>
            Click to use
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentTemplate;
