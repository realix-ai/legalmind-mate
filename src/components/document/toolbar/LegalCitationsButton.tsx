
import React from 'react';
import { QuoteIcon } from 'lucide-react';
import ToolbarButton from './ToolbarButton';

interface LegalCitationsButtonProps {
  onClick: () => void;
}

const LegalCitationsButton = ({ onClick }: LegalCitationsButtonProps) => {
  return (
    <ToolbarButton
      icon={QuoteIcon}
      label="Legal Citations"
      onClick={onClick}
    />
  );
};

export default LegalCitationsButton;
