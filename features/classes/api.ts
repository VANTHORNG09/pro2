// features/classes/api.ts
import { Class, ClassFilters, CreateClassData, UpdateClassData, StudentInClass } from './types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const mockClasses: Class[] = [
  {
    id: 1, name: 'Web Development A', code: 'CS301',
    description: 'Modern web development with React, Next.js, and TypeScript',
    teacherId: 1, teacherName: 'Dr. Sarah Johnson', subject: 'Computer Science',
    status: 'active', studentCount: 28, assignmentCount: 12,
    createdAt: '2025-09-01T08:00:00Z', updatedAt: '2026-04-01T10:30:00Z',
    schedule: 'Mon/Wed 10:00-11:30 AM', room: 'Room 204', semester: 'Spring', year: 2026,
  },
  {
    id: 2, name: 'Object-Oriented Programming B', code: 'CS202',
    description: 'Advanced OOP concepts with Java and design patterns',
    teacherId: 1, teacherName: 'Dr. Sarah Johnson', subject: 'Computer Science',
    status: 'active', studentCount: 32, assignmentCount: 10,
    createdAt: '2025-09-01T08:00:00Z', updatedAt: '2026-03-28T14:15:00Z',
    schedule: 'Tue/Thu 2:00-3:30 PM', room: 'Room 305', semester: 'Spring', year: 2026,
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

export const classesAPI = {
  getAll: async (filters?: ClassFilters): Promise<Class[]> => {
    if (USE_MOCK) {
      let result = [...mockClasses];
      if (filters?.status && filters.status !== 'all') result = result.filter((c) => c.status === filters.status);
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
      }
      return result;
    }
    try {
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      const queryString = params.toString();
      return await request<Class[]>(`/classes${queryString ? `?${queryString}` : ''}`);
    } catch {
      console.warn('[classesAPI] Backend unavailable, falling back to mock data.');
      let result = [...mockClasses];
      if (filters?.status && filters.status !== 'all') result = result.filter((c) => c.status === filters.status);
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
      }
      return result;
    }
  },

  getById: async (id: number): Promise<Class> => {
    if (USE_MOCK) {
      const mock = mockClasses.find((c) => c.id === id);
      if (!mock) throw new Error('Class not found');
      return mock;
    }
    return await request<Class>(`/classes/${id}`);
  },

  create: async (data: CreateClassData): Promise<Class> => {
    if (USE_MOCK) {
      const newClass: Class = {
        ...data, id: Date.now(), teacherId: 0, teacherName: 'Unknown',
        status: 'active', studentCount: 0, assignmentCount: 0,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      mockClasses.push(newClass);
      return newClass;
    }
    return await request<Class>('/classes', { method: 'POST', body: JSON.stringify(data) });
  },

  update: async (id: number, data: UpdateClassData): Promise<Class> => {
    if (USE_MOCK) {
      const idx = mockClasses.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error('Class not found');
      mockClasses[idx] = { ...mockClasses[idx], ...data, updatedAt: new Date().toISOString() };
      return mockClasses[idx];
    }
    return await request<Class>(`/classes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  delete: async (id: number): Promise<void> => {
    if (USE_MOCK) {
      const idx = mockClasses.findIndex((c) => c.id === id);
      if (idx !== -1) mockClasses.splice(idx, 1);
      return;
    }
    await request<void>(`/classes/${id}`, { method: 'DELETE' });
  },

  getStudents: async (classId: number): Promise<StudentInClass[]> => {
    if (USE_MOCK) return [];
    return await request<StudentInClass[]>(`/classes/${classId}/students`);
  },

  getStats: async (classId: number): Promise<{ totalStudents: number; activeStudents: number; totalAssignments: number; publishedAssignments: number; averageGrade: number; submissionRate: number }> => {
    if (USE_MOCK) return { totalStudents: 28, activeStudents: 27, totalAssignments: 12, publishedAssignments: 10, averageGrade: 87.5, submissionRate: 89.2 };
    return await request(`/classes/${classId}/stats`);
  },
};
