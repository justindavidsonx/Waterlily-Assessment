// Base Types
export type QuestionType = 'text' | 'number';
export type QuestionCategory = 'demographic' | 'health' | 'financial';
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Database Models
export interface BaseModel {
  id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface User extends BaseModel {
  email: string;
  name: string;
}

export interface Question extends BaseModel {
  title: string;
  description: string;
  type: QuestionType;
  category: QuestionCategory;
}

export interface Response extends BaseModel {
  question_id: number;
  user_id: number;
  answer: string;
  question_title?: string;
}

// API Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SubmitResponseResult {
  id: number;
  updated: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Form Types
export interface FormData {
  [key: string]: string | number;
}

export interface ValidationError {
  [key: string]: string;
}

export interface FormState<T> {
  data: T;
  errors: ValidationError;
  isSubmitting: boolean;
  isDirty: boolean;
}

// Component Props
export interface AuthProps {
  onAuthSuccess: (user: User) => void;
  redirectTo?: string;
}

export interface SurveyFormProps {
  questions: Question[];
  onSubmit: (responses: Response[]) => void;
  initialData?: Response[];
}

export interface SurveyResponsesProps {
  responses: Response[];
  loading: boolean;
  error: string | null;
  onRefresh?: () => void;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

// API Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface SubmitResponseRequest {
  questionId: number;
  answer: string;
}

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncResponse<T> = Promise<ApiResponse<T>>; 