export interface TextAnalysis {
  id: number;
  text_submission_id: number;
  score: number;
  bugs: string[]; // Linguistic errors
  improvements: string[]; // Suggestions
  processed_text: string; // The improved version
  explanation?: string;
  created_at: string;
  updated_at: string;
}

export interface TextSubmission {
  id: number;
  user_id: number;
  title: string;
  content: string;
  mode: 'grammar' | 'rewrite' | 'summarize' | 'improve';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  analysis?: TextAnalysis;
  created_at: string;
  updated_at: string;
}

export interface CreateTextSubmissionData {
  title: string;
  content: string;
  mode: 'grammar' | 'rewrite' | 'summarize' | 'improve';
}

export interface TextSubmissionResponse {
  data: TextSubmission;
}

export interface TextSubmissionListResponse {
  data: TextSubmission[];
}
