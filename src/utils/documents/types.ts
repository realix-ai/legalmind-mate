
// Common types shared across document management modules

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface CustomTemplate {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  createdAt: number;
}

export interface SavedDocument {
  id: string;
  title: string;
  content: string;
  lastModified: number;
  caseId?: string;
  category?: string;
  externalSystem?: string; // Added for external DMS integration
  externalId?: string;    // External system document ID
}

export interface Case {
  id: string;
  name: string;
  createdAt: number;
  status?: 'active' | 'pending' | 'closed';
  priority?: 'high' | 'medium' | 'low';
  deadline?: number;
  notes?: string;
  clientName?: string;
}

// Added for section-based commenting
export interface DocumentSection {
  id: string;
  title: string;
  level: number;
  startPosition: number;
  endPosition: number;
  content: string;
}
