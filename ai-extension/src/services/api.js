import { storage } from './storage';

const API_BASE_URL = 'http://localhost:8000/api';

async function fetchApi(endpoint, options = {}) {
  const { token } = await storage.get('token');
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await response.json();
  
  if (!response.ok) {
    throw new Error(json.message || 'Something went wrong');
  }

  return json.data !== undefined ? json.data : json;
}

export const api = {
  async register(name, email, password) {
    return fetchApi('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  async login(email, password) {
    return fetchApi('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getCurrentUser() {
    return fetchApi('/user');
  },

  async createTextSubmission(title, content, mode) {
    return fetchApi('/text-submissions', {
      method: 'POST',
      body: JSON.stringify({ title, content, mode }),
    });
  },

  async getTextSubmission(id) {
    return fetchApi(`/text-submissions/${id}`);
  },

  async createCodeSubmission(title, content, language, mode) {
    return fetchApi('/submissions', {
      method: 'POST',
      body: JSON.stringify({ title, content, language, mode }),
    });
  },

  async getCodeSubmission(id) {
    return fetchApi(`/submissions/${id}`);
  },

  async listCodeSubmissions() {
    return fetchApi('/submissions');
  },

  deleteCodeSubmission: (id) => fetchApi(`/submissions/${id}`, { method: 'DELETE' }),

  listTextSubmissions: () => fetchApi('/text-submissions'),
  deleteTextSubmission: (id) => fetchApi(`/text-submissions/${id}`, { method: 'DELETE' }),

  // Resume AI
  listResumes: () => fetchApi('/resumes'),
  getResume: (id) => fetchApi(`/resumes/${id}`),
  deleteResume: (id) => fetchApi(`/resumes/${id}`, { method: 'DELETE' }),
  createResume: (title, content) => fetchApi('/resumes', {
    method: 'POST',
    body: JSON.stringify({ title, content })
  }),
};
