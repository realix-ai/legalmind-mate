
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
}

export interface Case {
  id: string;
  name: string;
  createdAt: number;
}
