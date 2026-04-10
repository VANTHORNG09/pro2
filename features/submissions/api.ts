// features/submissions/api.ts
import { Submission, GradeSubmissionPayload, SubmissionFilters, SubmissionComment } from './types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || false;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const mockPendingSubmissions: Submission[] = [
  {
    id: 1001,
    assignmentId: 1,
    assignmentName: 'Data Structures Final Project',
    studentId: 201,
    studentName: 'Alice Johnson',
    studentEmail: 'alice.johnson@university.edu',
    status: 'pending',
    submittedAt: '2026-04-05T14:30:00Z',
    gradedAt: null,
    grade: null,
    maxPoints: 100,
    feedback: null,
    files: [{ id: 5001, submissionId: 1001, fileName: 'final_project.zip', fileUrl: '/files/final_project.zip', fileSize: 2450000, fileType: 'application/zip', uploadedAt: '2026-04-05T14:30:00Z' }],
    comments: [],
    isLate: false,
  },
];

const mockAllSubmissions: Submission[] = [
  ...mockPendingSubmissions,
  {
    id: 1009,
    assignmentId: 1,
    assignmentName: 'Data Structures Final Project',
    studentId: 209,
    studentName: 'Iris Nakamura',
    studentEmail: 'iris.nakamura@university.edu',
    status: 'graded',
    submittedAt: '2026-04-02T10:00:00Z',
    gradedAt: '2026-04-04T14:30:00Z',
    grade: 92,
    maxPoints: 100,
    feedback: 'Excellent work on the BST implementation.',
    files: [{ id: 5008, submissionId: 1009, fileName: 'bst_project.zip', fileUrl: '/files/bst_project.zip', fileSize: 3200000, fileType: 'application/zip', uploadedAt: '2026-04-02T10:00:00Z' }],
    comments: [],
    isLate: false,
  },
];

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `API request failed: ${response.status}`);
  return data;
}

export const submissionsAPI = {
  getAll: async (filters?: SubmissionFilters): Promise<Submission[]> => {
    if (USE_MOCK) {
      let result = [...mockAllSubmissions];
      if (filters?.status && filters.status !== 'all') result = result.filter((s) => s.status === filters.status);
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter((s) => s.studentName.toLowerCase().includes(q) || s.studentEmail.toLowerCase().includes(q));
      }
      return result;
    }
    try {
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      return request<Submission[]>(`/submissions${params.toString() ? `?${params}` : ''}`);
    } catch {
      console.warn('[submissionsAPI] Backend unavailable, falling back to mock data.');
      return mockAllSubmissions;
    }
  },

  getByAssignment: async (assignmentId: number): Promise<Submission[]> => {
    return request<Submission[]>(`/assignments/${assignmentId}/submissions`);
  },

  getAllPending: async (): Promise<Submission[]> => {
    if (USE_MOCK) return mockPendingSubmissions;
    try {
      return request<Submission[]>('/submissions/pending');
    } catch {
      return mockPendingSubmissions;
    }
  },

  getMySubmission: async (assignmentId: number): Promise<Submission> => {
    return request<Submission>(`/assignments/${assignmentId}/submissions/me`);
  },

  getAllMySubmissions: async (): Promise<Submission[]> => {
    return request<Submission[]>('/submissions/me');
  },

  submitAssignment: async (assignmentId: number, formData: FormData): Promise<Submission> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}/submissions`, {
      method: 'POST',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || `API request failed: ${response.status}`);
    return data;
  },

  gradeSubmission: async (id: number, payload: GradeSubmissionPayload): Promise<Submission> => {
    return request<Submission>(`/submissions/${id}/grade`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  returnSubmission: async (id: number): Promise<Submission> => {
    return request<Submission>(`/submissions/${id}/return`, { method: 'POST' });
  },

  addComment: async (submissionId: number, content: string): Promise<SubmissionComment> => {
    return request<SubmissionComment>(`/submissions/${submissionId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  downloadAllSubmissions: async (assignmentId: number): Promise<Blob> => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}/submissions/download`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    if (!response.ok) throw new Error('Download failed');
    return await response.blob();
  },
};
