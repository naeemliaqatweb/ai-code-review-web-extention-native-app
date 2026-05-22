import api from './api';

export interface TextSubmissionData {
  title: string;
  content: string;
  mode: 'grammar' | 'rewrite' | 'summarize' | 'improve';
}

export const createTextSubmission = async (data: TextSubmissionData) => {
  const response = await api.post('/text-submissions', data);
  return response.data;
};

export const getTextHistory = async () => {
  const response = await api.get('/text-submissions');
  return response.data;
};

export const deleteTextSubmission = async (id: number) => {
  const response = await api.delete(`/text-submissions/${id}`);
  return response.data;
};
