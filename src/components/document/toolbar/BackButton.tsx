
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  onClick: () => void;
}

const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    <Button 
      variant="ghost" 
      size="xs" 
      onClick={onClick}
      className="gap-1"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      <span>Back</span>
    </Button>
  );
};

export default BackButton;
