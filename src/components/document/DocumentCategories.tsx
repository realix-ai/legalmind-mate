
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';

// Define common document categories
export const DOCUMENT_CATEGORIES = [
  { id: 'general', name: 'General' },
  { id: 'contract', name: 'Contract' },
  { id: 'letter', name: 'Letter' },
  { id: 'memo', name: 'Memo' },
  { id: 'pleading', name: 'Pleading' },
  { id: 'brief', name: 'Brief' },
  { id: 'research', name: 'Research' },
  { id: 'notes', name: 'Notes' }
];

interface DocumentCategoriesProps {
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

const DocumentCategories = ({ 
  currentCategory,
  onCategoryChange
}: DocumentCategoriesProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Tag className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Document Category</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {DOCUMENT_CATEGORIES.map(category => (
          <Button
            key={category.id}
            size="sm"
            variant={currentCategory === category.id ? "default" : "outline"}
            className="h-7 text-xs"
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DocumentCategories;
