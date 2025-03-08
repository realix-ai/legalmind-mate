
import React from 'react';
import { Briefcase } from 'lucide-react';
import ToolbarButton from './ToolbarButton';

interface SaveToCaseButtonProps {
  onClick: () => void;
  className?: string;
}

const SaveToCaseButton = ({ onClick, className }: SaveToCaseButtonProps) => {
  return (
    <ToolbarButton
      icon={Briefcase}
      label="Save to Case"
      onClick={onClick}
      className={className}
    />
  );
};

export default SaveToCaseButton;
