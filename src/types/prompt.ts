
export interface Prompt {
  id: string;
  text: string;
  createdAt?: number;
  updatedAt?: number;
  userId?: string;
  isPublic?: boolean;
  category?: string;
}

export interface PromptResponse {
  success: boolean;
  data?: Prompt[];
  prompt?: Prompt;
  error?: string;
}
