import api from './api';

export interface ResumeData {
  content?: string;
  file?: any;
}

export const createResume = async (data: ResumeData) => {
  // If we have a file, we should use FormData
  const formData = new FormData();
  if (data.content) formData.append('content', data.content);
  if (data.file) formData.append('file', data.file);

  const response = await api.post('/resumes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getResumes = async () => {
  const response = await api.get('/resumes');
  return response.data;
};

export const deleteResume = async (id: number) => {
  const response = await api.delete(`/resumes/${id}`);
  return response.data;
};

export const getTemplates = async () => {
  const response = await api.get('/resume-templates');
  return response.data;
};

export const downloadResume = async (id: number, template: string = 'modern-minimalist') => {
  const response = await api.get(`/resumes/${id}/download?template=${template}`);
  return response.data;
};
