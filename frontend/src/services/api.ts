import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const auth = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    company: string;
    role: 'employer' | 'team_member';
  }) => api.post('/auth/register', userData),
};

// Interview endpoints
export const interviews = {
  create: (interviewData: any) => api.post('/interviews', interviewData),
  getAll: () => api.get('/interviews'),
  getById: (id: string) => api.get(`/interviews/${id}`),
  update: (id: string, interviewData: any) =>
    api.put(`/interviews/${id}`, interviewData),
  delete: (id: string) => api.delete(`/interviews/${id}`),
  uploadOverviewVideo: (id: string, videoFile: File) => {
    const formData = new FormData();
    formData.append('video', videoFile);
    return api.post(`/interviews/${id}/overview-video`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadQuestionVideo: (id: string, questionIndex: number, videoFile: File) => {
    const formData = new FormData();
    formData.append('video', videoFile);
    return api.post(
      `/interviews/${id}/questions/${questionIndex}/video`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  },
  inviteCandidates: (id: string, candidates: { email: string }[]) =>
    api.post(`/interviews/${id}/invite`, { candidates }),
};

// Candidate endpoints
export const candidates = {
  startInterview: (id: string, candidateData: { email: string; name: string }) =>
    api.post(`/candidates/interviews/${id}/start`, candidateData),
  submitResponse: (
    sessionId: string,
    questionIndex: number,
    videoFile: File,
    monitoringData: any
  ) => {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('monitoringData', JSON.stringify(monitoringData));
    return api.post(
      `/candidates/sessions/${sessionId}/questions/${questionIndex}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  },
  completeInterview: (sessionId: string) =>
    api.post(`/candidates/sessions/${sessionId}/complete`),
  getResults: (interviewId: string) =>
    api.get(`/candidates/interviews/${interviewId}/results`),
};

export default api; 