import axios from 'axios';

// API Base URL - should be configured via environment variables in production
const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Company Profile API
export const companyAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data: any) => api.patch('/profile/update', data),
};

// Internships API
export const internshipAPI = {
  getAll: () => api.get('/internships'),
  getById: (id: string) => api.get(`/internship/${id}`),
  create: (data: any) => api.post('/internship/create', data),
  update: (id: string, data: any) => api.patch(`/internship/${id}`, data),
  delete: (id: string) => api.delete(`/internship/${id}`),
  close: (id: string) => api.patch(`/internship/${id}/close`),
  getApplicants: (id: string) => api.get(`/internship/${id}/applicants`),
};

// Applicants API
export const applicantAPI = {
  getById: (applicationId: string) => api.get(`/internship/applicant/${applicationId}`),
  accept: (internshipId: string, userId: string) => api.post(`/${internshipId}/accept/${userId}`),
  reject: (internshipId: string, userId: string) => api.post(`/${internshipId}/reject/${userId}`),
};

// Types
export interface Company {
  id: string;
  name: string;
  email: string;
  description: string;
  industry: string;
  website: string;
  location: string;
  totalInternships: number;
}

export interface Internship {
  id: string;
  title: string;
  department: string;
  openings: number;
  duration: string;
  status: 'open' | 'closed';
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  stipend: number;
  applicationDeadline: string;
  applicantCount: number;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  resumeSummary: string;
  skills: string[];
  experience: string[];
  status: 'applied' | 'shortlisted' | 'accepted' | 'rejected';
  applicationDate: string;
  matchScore: {
    skillSimilarity: number;
    profileMatch: number;
    overallMatch: number;
  };
  documents: string[];
  quizAnswers?: any;
}

export default api;