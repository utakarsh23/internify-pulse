import axios from 'axios';
import { getSession } from 'next-auth/react';

// API Base URL - should be configured via environment variables in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7470/company';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  // Try to get token from session first
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  } else {
    // Fallback to localStorage for client-side requests
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

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

// Types based on MongoDB schemas
export interface Company {
  _id: string;
  name: string;
  email: string;
  uniqueName: string;
  description?: string;
  industry: string;
  website?: string;
  location: string;
  internships: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InternshipDetails {
  title: string;
  department?: string;
  responsibilities: string[];
  skillsRequired: string[];
  openings?: number;
  duration?: string;
  applicationDeadline?: string;
  startDate?: string;
  location: {
    address?: string;
    pinCode?: number;
    city?: string;
  };
  stipend?: string;
}

export interface Eligibility {
  optional?: boolean;
  highestLevelOfEducation?: string;
  preferredDegrees?: string[];
  graduationYearRange?: number[];
}

export interface Internship {
  _id: string;
  internshipDetails: InternshipDetails;
  eligibility?: Eligibility;
  assignments: string[];
  applications: string[];
  exSkills: {
    pastHired: string[];
    currHired: string[];
  };
  currentInterns: string[];
  status: boolean;
  company: string;
  sampleQuestions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  username: string;
  name: string;
  gender?: string;
  email: string;
  avatar?: string;
  field?: string;
  phoneNumber?: string;
  about?: string;
  residence?: {
    pin?: number;
    city?: string;
    state?: string;
  };
  experience: {
    internships: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>;
  };
  resume: {
    skills: string[];
    projects: string[];
    certifications: string[];
    socialLinks?: {
      linkedin?: string;
      github?: string;
      website?: string;
    };
  };
  internships: {
    applications: string[];
    pastInternships: string[];
    currentInternship?: string;
  };
  resumeDoc?: {
    filename?: string;
    path?: string;
    mimetype?: string;
    size?: number;
    uploadedAt?: string;
  };
}

export interface Application {
  _id: string;
  internship: string | Internship;
  applicant: string | User;
  status: 'Submitted' | 'Under Review' | 'Shortlisted' | 'Rejected' | 'Hired';
  quiz: Array<{
    question: string;
    answer: string;
    status: string;
  }>;
  documents: string[];
  appliedAt: string;
  updatedAt: string;
}

export default api;