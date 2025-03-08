
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ToolbarButtonProps {
  icon: LucideIcon;
  label?: string;
  onClick: () => void;
  showLabel?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'xs' | 'lg' | 'icon';
  className?: string;
}

const ToolbarButton = ({
  icon: Icon,
  label,
  onClick,
  showLabel = true,
  variant = 'outline',
  size = 'xs',
  className,
}: ToolbarButtonProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={`gap-1 ${className || ''}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label && showLabel && <span className="hidden md:inline">{label}</span>}
    </Button>
  );
};

export default ToolbarButton;
