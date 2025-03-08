
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, File, Mail } from 'lucide-react';

interface ExportFormatButtonProps {
  format: string;
  onExport: () => void;
  label: string;
  icon?: React.ElementType;
}

const ExportFormatButton: React.FC<ExportFormatButtonProps> = ({ 
  format, 
  onExport, 
  label,
  icon: Icon
}) => {
  return (
    <Button onClick={onExport} className="w-full justify-start">
      {Icon && <Icon className="h-4 w-4 mr-2" />}
      {label}
    </Button>
  );
};

export default ExportFormatButton;
