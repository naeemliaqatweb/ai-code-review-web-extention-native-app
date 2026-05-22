import api from './api';

export interface CodeSubmissionData {
  title: string;
  language: string;
  content: string;
  mode?: 'review' | 'fix' | 'explain';
}

/**
 * Creates a new code submission for analysis.
 */
export const createSubmission = async (data: CodeSubmissionData) => {
  const response = await api.post('/submissions', data);
  return response.data;
};

/**
 * Triggers the AI neural analysis for a specific submission.
 */
export const analyzeCode = async (submissionId: number) => {
  const response = await api.post('/analyze-code', { submission_id: submissionId });
  return response.data;
};

/**
 * Retrieves all previous code submissions for the authenticated user.
 */
export const getSubmissions = async () => {
  const response = await api.get('/submissions');
  return response.data;
};

/**
 * Fetches detailed info including analysis results for a specific submission.
 */
export const getSubmissionDetails = async (id: number) => {
  const response = await api.get(`/submissions/${id}`);
  return response.data;
};

/**
 * Deletes a code submission and its analysis.
 */
export const deleteCodeSubmission = async (id: number) => {
  const response = await api.delete(`/submissions/${id}`);
  return response.data;
};
