export interface CodeAnalysis {
  id: number;
  code_submission_id: number;
  score: number;
  bugs: string[];
  improvements: string[];
  security_issues: string[];
  fixed_code?: string;
  fixed_explanation?: string;
  fixed_improvements?: string[];
  created_at: string;
  updated_at: string;
}

export interface SubmissionVersion {
  id: number;
  content: string;
  version_number: number;
  created_at: string;
}

export interface CodeSubmission {
  id: number;
  user_id: number;
  title: string;
  language: string;
  content: string;
  mode: 'review' | 'fix';
  created_at: string;
  updated_at: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'reviewed';
  analysis?: CodeAnalysis;
  versions?: SubmissionVersion[];
}

export interface CreateSubmissionData {
  title: string;
  language: string;
  content: string;
  mode: 'review' | 'fix';
}

export interface SubmissionResponse {
  data: CodeSubmission;
}

export interface SubmissionListResponse {
  data: CodeSubmission[];
}
