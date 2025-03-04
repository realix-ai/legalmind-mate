
import { QueryType } from '@/services/legalQueryService';

export interface BatchQuery {
  id: string;
  text: string;
  type: QueryType;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: string;
}

export interface StatusInfo {
  icon: React.ReactNode;
  badge: React.ReactNode;
}
