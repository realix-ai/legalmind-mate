
import React from 'react';
import { Save } from 'lucide-react';
import ToolbarButton from './ToolbarButton';

interface SaveButtonProps {
  onSaveDocument: () => void;
}

const SaveButton = ({ onSaveDocument }: SaveButtonProps) => {
  return (
    <ToolbarButton
      icon={Save}
      label="Save"
      onClick={onSaveDocument}
    />
  );
};

export default SaveButton;
