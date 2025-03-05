
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface CaseChatHeaderProps {
  caseName?: string;
}

const CaseChatHeader: React.FC<CaseChatHeaderProps> = ({ caseName }) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/case-management');
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <Button variant="ghost" size="icon" onClick={handleBack}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-2xl font-semibold">Case: {caseName}</h1>
    </div>
  );
};

export default CaseChatHeader;
