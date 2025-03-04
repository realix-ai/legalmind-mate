
export type Notification = {
  id: string;
  type: 'deadline' | 'document' | 'comment' | 'system';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  link?: string;
  caseId?: string;
  documentId?: string;
};
