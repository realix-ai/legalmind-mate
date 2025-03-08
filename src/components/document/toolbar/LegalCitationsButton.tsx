
import React from 'react';
import { QuoteIcon } from 'lucide-react';
import ToolbarButton from './ToolbarButton';

interface LegalCitationsButtonProps {
  onClick: () => void;
  className?: string;
}

const LegalCitationsButton = ({ onClick, className }: LegalCitationsButtonProps) => {
  return (
    <ToolbarButton
      icon={QuoteIcon}
      label="Legal Citations"
      onClick={onClick}
      className={className}
    />
  );
};

export default LegalCitationsButton;
