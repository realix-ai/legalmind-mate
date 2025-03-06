
import React from 'react';
import { CheckCircle2, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StatusInfo } from './types';
import { QueryType } from '@/services/legalQueryService';

// Get status icon and color based on query status
export const getStatusInfo = (status: string): StatusInfo => {
  switch (status) {
    case 'completed':
      return { 
        icon: <CheckCircle2 className="text-green-500 h-5 w-5" />,
        badge: <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Completed</Badge>
      };
    case 'failed':
      return { 
        icon: <AlertCircle className="text-red-500 h-5 w-5" />,
        badge: <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Failed</Badge>
      };
    case 'processing':
      return { 
        icon: <RefreshCw className="text-blue-500 h-5 w-5 animate-spin" />,
        badge: <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Processing</Badge>
      };
    default:
      return { 
        icon: <Clock className="text-gray-500 h-5 w-5" />,
        badge: <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Pending</Badge>
      };
  }
};

export const getTypeLabel = (type: QueryType): string => {
  switch (type) {
    case 'legal-research':
      return 'Legal Research';
    case 'risk-analysis':
      return 'Risk Analysis';
    case 'summarize':
      return 'Draft/Summarize';
    case 'data-analysis':
      return 'Data Analysis';
    default:
      return type;
  }
};
