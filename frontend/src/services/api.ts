import axios from 'axios';
import { Question, Response, AuthResponse, SubmitResponseResult, ApiError } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// API client instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.error || 'An unexpected error occurred',
      status: error.response?.status
    };
    return Promise.reject(apiError);
  }
);

// API methods
export const api = {
  // Auth
  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', { email, password, name });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
  },

  // Questions
  getQuestions: async (): Promise<Question[]> => {
    const response = await apiClient.get<Question[]>('/questions');
    return response.data;
  },

  // Responses
  submitResponse: async (questionId: number, answer: string): Promise<SubmitResponseResult> => {
    const response = await apiClient.post<SubmitResponseResult>('/responses', { questionId, answer });
    return response.data;
  },

  getResponses: async (): Promise<Response[]> => {
    const response = await apiClient.get<Response[]>('/responses');
    return response.data;
  },
};

const getAuthHeader = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getQuestions = async (): Promise<Question[]> => {
  const response = await fetch(`${API_BASE_URL}/questions`, {
    headers: getAuthHeader()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }
  return response.json();
};

export const submitResponse = async (response: Response): Promise<{ id: number; updated: boolean }> => {
  const res = await fetch(`${API_BASE_URL}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(response)
  });

  if (!res.ok) {
    throw new Error('Failed to submit response');
  }

  return res.json();
};

export const getResponses = async (): Promise<Response[]> => {
  const response = await fetch(`${API_BASE_URL}/responses`, {
    headers: getAuthHeader()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch responses');
  }
  return response.json();
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return response.json();
};

export const register = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, name })
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
}; 