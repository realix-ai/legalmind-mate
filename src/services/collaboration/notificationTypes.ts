
import { TeamMember } from './types';

export interface SharedResponse {
  id: string;
  content: string;
  sharedBy: string;
  sharedById: string;
  sharedWith: string[];
  date: number;
  title?: string;
  query?: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface Notification {
  id: string;
  type: 'response_shared' | 'document_shared' | 'comment_added' | 'mention';
  title: string;
  message: string;
  date: number;
  read: boolean;
  from: {
    id: string;
    name: string;
  };
  data?: {
    responseId?: string;
    documentId?: string;
    commentId?: string;
    content?: string;
  };
}
