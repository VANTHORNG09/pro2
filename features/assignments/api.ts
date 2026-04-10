import { Assignment, AssignmentFilters } from './types';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const mockAssignments: Assignment[] = [
  {
    id: 1,
    title: 'React Component Library',
    description: 'Build a reusable component library using React, TypeScript, and Tailwind CSS.',
    instructions: 'Create a GitHub repository with your project. Include a README with setup instructions.',
    classId: 1,
    className: 'Web Development A',
    teacherId: 1,
    teacherName: 'Dr. Sarah Johnson',
    dueDate: '2026-04-15T23:59:59Z',
    maxPoints: 100,
    status: 'published',
    allowedFileTypes: ['.zip', '.pdf', '.docx'],
    maxFileSize: 10 * 1024 * 1024,
    createdAt: '2026-03-20T08:00:00Z',
    updatedAt: '2026-03-25T10:00:00Z',
    submissionCount: 22,
    gradedCount: 18,
    pendingCount: 4,
  },
  {
    id: 2,
    title: 'REST API Design',
    description: 'Design and implement a RESTful API with CRUD endpoints, authentication, and proper error handling.',
    instructions: 'Use Node.js/Express or Python/FastAPI. Include Postman collection.',
    classId: 1,
    className: 'Web Development A',
    teacherId: 1,
    teacherName: 'Dr. Sarah Johnson',
    dueDate: '2026-04-22T23:59:59Z',
    maxPoints: 80,
    status: 'published',
    allowedFileTypes: ['.zip', '.pdf'],
    maxFileSize: 15 * 1024 * 1024,
    createdAt: '2026-03-25T08:00:00Z',
    updatedAt: '2026-03-25T10:00:00Z',
    submissionCount: 15,
    gradedCount: 10,
    pendingCount: 5,
  },
  {
    id: 3,
    title: 'Design Patterns in Java',
    description: 'Implement at least 5 GoF design patterns in Java with unit tests.',
    instructions: 'Choose from Singleton, Factory, Observer, Strategy, and Decorator patterns.',
    classId: 2,
    className: 'Object-Oriented Programming B',
    teacherId: 1,
    teacherName: 'Dr. Sarah Johnson',
    dueDate: '2026-04-10T23:59:59Z',
    maxPoints: 90,
    status: 'closed',
    allowedFileTypes: ['.zip', '.java'],
    maxFileSize: 5 * 1024 * 1024,
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-04-11T00:00:00Z',
    submissionCount: 30,
    gradedCount: 30,
    pendingCount: 0,
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

  if (!response.ok) {
    throw new Error(data.message || `API request failed: ${response.status}`);
  }

  return data;
}

export const assignmentsAPI = {
  getAll: async (filters?: AssignmentFilters): Promise<Assignment[]> => {
    if (USE_MOCK) {
      let result = [...mockAssignments];
      if (filters?.status && filters.status !== 'all') result = result.filter((a) => a.status === filters.status);
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter((a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
      }
      if (filters?.classId) result = result.filter((a) => a.classId === filters.classId);
      return result;
    }
    try {
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.classId) params.append('classId', filters.classId.toString());
      const queryString = params.toString();
      return await request<Assignment[]>(`/assignments${queryString ? `?${queryString}` : ''}`);
    } catch {
      console.warn('[assignmentsAPI] Backend unavailable, falling back to mock data.');
      let result = [...mockAssignments];
      if (filters?.status && filters.status !== 'all') result = result.filter((a) => a.status === filters.status);
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter((a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
      }
      if (filters?.classId) result = result.filter((a) => a.classId === filters.classId);
      return result;
    }
  },

  getById: async (id: number): Promise<Assignment> => {
    if (USE_MOCK) {
      const mock = mockAssignments.find((a) => a.id === id);
      if (!mock) throw new Error('Assignment not found');
      return mock;
    }
    try {
      return await request<Assignment>(`/assignments/${id}`);
    } catch {
      const mock = mockAssignments.find((a) => a.id === id);
      if (!mock) throw new Error('Assignment not found');
      return mock;
    }
  },

  create: async (data: Partial<Assignment>): Promise<Assignment> => {
    if (USE_MOCK) {
      const newAssignment: Assignment = {
        id: Date.now(),
        title: data.title || 'Untitled',
        description: data.description || '',
        instructions: data.instructions || '',
        classId: data.classId || 0,
        className: data.className || 'Unknown',
        teacherId: data.teacherId || 0,
        teacherName: data.teacherName || 'Unknown',
        dueDate: data.dueDate || new Date().toISOString(),
        maxPoints: data.maxPoints || 100,
        status: data.status || 'draft',
        allowedFileTypes: data.allowedFileTypes || ['.pdf'],
        maxFileSize: data.maxFileSize || 10 * 1024 * 1024,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        submissionCount: 0,
        gradedCount: 0,
        pendingCount: 0,
      };
      mockAssignments.push(newAssignment);
      return newAssignment;
    }
    try {
      return await request<Assignment>('/assignments', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      const newAssignment: Assignment = {
        id: Date.now(),
        title: data.title || 'Untitled',
        description: data.description || '',
        instructions: data.instructions || '',
        classId: data.classId || 0,
        className: data.className || 'Unknown',
        teacherId: data.teacherId || 0,
        teacherName: data.teacherName || 'Unknown',
        dueDate: data.dueDate || new Date().toISOString(),
        maxPoints: data.maxPoints || 100,
        status: data.status || 'draft',
        allowedFileTypes: data.allowedFileTypes || ['.pdf'],
        maxFileSize: data.maxFileSize || 10 * 1024 * 1024,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        submissionCount: 0,
        gradedCount: 0,
        pendingCount: 0,
      };
      mockAssignments.push(newAssignment);
      return newAssignment;
    }
  },

  update: async (id: number, data: Partial<Assignment>): Promise<Assignment> => {
    if (USE_MOCK) {
      const idx = mockAssignments.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error('Assignment not found');
      mockAssignments[idx] = { ...mockAssignments[idx], ...data, updatedAt: new Date().toISOString() };
      return mockAssignments[idx];
    }
    try {
      return await request<Assignment>(`/assignments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {
      const idx = mockAssignments.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error('Assignment not found');
      mockAssignments[idx] = { ...mockAssignments[idx], ...data, updatedAt: new Date().toISOString() };
      return mockAssignments[idx];
    }
  },

  delete: async (id: number): Promise<void> => {
    if (USE_MOCK) {
      const idx = mockAssignments.findIndex((a) => a.id === id);
      if (idx !== -1) mockAssignments.splice(idx, 1);
      return;
    }
    try {
      await request<void>(`/assignments/${id}`, { method: 'DELETE' });
    } catch {
      const idx = mockAssignments.findIndex((a) => a.id === id);
      if (idx !== -1) mockAssignments.splice(idx, 1);
    }
  },

  publish: async (id: number): Promise<Assignment> => {
    if (USE_MOCK) {
      const a = mockAssignments.find((a) => a.id === id);
      if (!a) throw new Error('Assignment not found');
      a.status = 'published';
      return a;
    }
    try {
      return await request<Assignment>(`/assignments/${id}/publish`, { method: 'POST' });
    } catch {
      const a = mockAssignments.find((a) => a.id === id);
      if (!a) throw new Error('Assignment not found');
      a.status = 'published';
      return a;
    }
  },

  close: async (id: number): Promise<Assignment> => {
    if (USE_MOCK) {
      const a = mockAssignments.find((a) => a.id === id);
      if (!a) throw new Error('Assignment not found');
      a.status = 'closed';
      return a;
    }
    try {
      return await request<Assignment>(`/assignments/${id}/close`, { method: 'POST' });
    } catch {
      const a = mockAssignments.find((a) => a.id === id);
      if (!a) throw new Error('Assignment not found');
      a.status = 'closed';
      return a;
    }
  },
};
