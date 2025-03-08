
import React from 'react';
import { Cloud } from 'lucide-react';
import ToolbarButton from './ToolbarButton';

interface SaveToIManageButtonProps {
  onClick: () => void;
  className?: string;
}

export const SaveToIManageButton = ({ onClick, className }: SaveToIManageButtonProps) => {
  return (
    <ToolbarButton
      icon={Cloud}
      label="Save to iManage"
      onClick={onClick}
      className={className}
    />
  );
};

interface GetFromIManageButtonProps {
  onClick: () => void;
  className?: string;
}

export const GetFromIManageButton = ({ onClick, className }: GetFromIManageButtonProps) => {
  return (
    <ToolbarButton
      icon={Cloud}
      label="Get from iManage"
      onClick={onClick}
      className={className}
    />
  );
};
