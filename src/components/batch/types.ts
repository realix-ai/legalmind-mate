
import { QueryType } from '@/services/legalQueryService';
import { ReactNode } from 'react';

export interface BatchQuery {
  id: string;
  text: string;
  type: QueryType;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: string;
  files?: File[];
}

export interface StatusInfo {
  icon: ReactNode;
  badge: ReactNode;
}
