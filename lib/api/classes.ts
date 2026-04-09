import { Class, ClassFilters, CreateClassData, UpdateClassData, StudentInClass } from '@/lib/types/classes';
import { mockClasses, mockStudents, mockClassStats } from '@/lib/data/classes';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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

export const classesAPI = {
  // List all classes (with optional filters)
  getAll: async (filters?: ClassFilters): Promise<Class[]> => {
    if (USE_MOCK) {
      let result = [...mockClasses];
      if (filters?.status && filters.status !== 'all') result = result.filter((c) => c.status === filters.status);
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q) ||
            c.teacherName.toLowerCase().includes(q)
        );
      }
      if (filters?.teacherId) result = result.filter((c) => c.teacherId === filters.teacherId);
      if (filters?.semester) result = result.filter((c) => c.semester === filters.semester);
      return result;
    }
    try {
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.teacherId) params.append('teacherId', filters.teacherId.toString());
      if (filters?.semester) params.append('semester', filters.semester);

      const queryString = params.toString();
      const result = await request<Class[]>(`/classes${queryString ? `?${queryString}` : ''}`);

      return result.map((c) => {
        const mock = mockClasses.find((m) => m.id === c.id);
        return {
          ...c,
          teacherName: c.teacherName || mock?.teacherName || 'Unknown',
        };
      });
    } catch {
      console.warn('[classesAPI] Backend unavailable, falling back to mock data.');
      let result = [...mockClasses];
      if (filters?.status && filters.status !== 'all') result = result.filter((c) => c.status === filters.status);
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q) ||
            c.teacherName.toLowerCase().includes(q)
        );
      }
      if (filters?.teacherId) result = result.filter((c) => c.teacherId === filters.teacherId);
      if (filters?.semester) result = result.filter((c) => c.semester === filters.semester);
      return result;
    }
  },

  // Get single class by ID
  getById: async (id: number): Promise<Class> => {
    if (USE_MOCK) {
      const mock = mockClasses.find((c) => c.id === id);
      if (!mock) throw new Error('Class not found');
      return mock;
    }
    try {
      return await request<Class>(`/classes/${id}`);
    } catch {
      console.warn('[classesAPI] Backend unavailable, falling back to mock data.');
      const mock = mockClasses.find((c) => c.id === id);
      if (!mock) throw new Error('Class not found');
      return mock;
    }
  },

  // Create new class
  create: async (data: CreateClassData): Promise<Class> => {
    if (USE_MOCK) {
      const newClass: Class = {
        ...data,
        id: Date.now(),
        teacherId: 0,
        teacherName: 'Unknown',
        subject: data.subject || '',
        status: 'active',
        studentCount: 0,
        assignmentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockClasses.push(newClass);
      return newClass;
    }
    try {
      return await request<Class>('/classes', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      console.warn('[classesAPI] Backend unavailable, falling back to mock data.');
      const newClass: Class = {
        ...data,
        id: Date.now(),
        teacherId: 0,
        teacherName: 'Unknown',
        subject: data.subject || '',
        status: 'active',
        studentCount: 0,
        assignmentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockClasses.push(newClass);
      return newClass;
    }
  },

  // Update class
  update: async (id: number, data: UpdateClassData): Promise<Class> => {
    if (USE_MOCK) {
      const idx = mockClasses.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error('Class not found');
      mockClasses[idx] = { ...mockClasses[idx], ...data, updatedAt: new Date().toISOString() };
      return mockClasses[idx];
    }
    try {
      return await request<Class>(`/classes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch {
      console.warn('[classesAPI] Backend unavailable, falling back to mock data.');
      const idx = mockClasses.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error('Class not found');
      mockClasses[idx] = { ...mockClasses[idx], ...data, updatedAt: new Date().toISOString() };
      return mockClasses[idx];
    }
  },

  // Delete class
  delete: async (id: number): Promise<void> => {
    if (USE_MOCK) {
      const idx = mockClasses.findIndex((c) => c.id === id);
      if (idx !== -1) mockClasses.splice(idx, 1);
      return;
    }
    try {
      await request<void>(`/classes/${id}`, { method: 'DELETE' });
    } catch {
      console.warn('[classesAPI] Backend unavailable, falling back to mock data.');
      const idx = mockClasses.findIndex((c) => c.id === id);
      if (idx !== -1) mockClasses.splice(idx, 1);
    }
  },

  // Get students enrolled in a class
  getStudents: async (classId: number): Promise<StudentInClass[]> => {
    if (USE_MOCK) return mockStudents;
    try {
      return await request<StudentInClass[]>(`/classes/${classId}/students`);
    } catch {
      console.warn('[classesAPI] Backend unavailable, falling back to mock data.');
      return mockStudents;
    }
  },

  // Enroll student in a class
  enrollStudent: async (classId: number, studentId: number): Promise<StudentInClass> => {
    if (USE_MOCK) {
      const newStudent: StudentInClass = {
        id: Date.now(),
        studentId,
        studentName: 'New Student',
        studentEmail: 'student@university.edu',
        enrolledAt: new Date().toISOString(),
        status: 'active',
        grade: 0,
        submissionCount: 0,
        gradedCount: 0,
        pendingCount: 0,
      };
      mockStudents.push(newStudent);
      return newStudent;
    }
    try {
      return await request<StudentInClass>(`/classes/${classId}/students`, {
        method: 'POST',
        body: JSON.stringify({ studentId }),
      });
    } catch {
      console.warn('[classesAPI] Backend unavailable, falling back to mock data.');
      const newStudent: StudentInClass = {
        id: Date.now(),
        studentId,
        studentName: 'New Student',
        studentEmail: 'student@university.edu',
        enrolledAt: new Date().toISOString(),
        status: 'active',
        grade: 0,
        submissionCount: 0,
        gradedCount: 0,
        pendingCount: 0,
      };
      mockStudents.push(newStudent);
      return newStudent;
    }
  },

  // Remove student from class
  removeStudent: async (classId: number, studentId: number): Promise<void> => {
    if (USE_MOCK) {
      const idx = mockStudents.findIndex((s) => s.studentId === studentId);
      if (idx !== -1) mockStudents.splice(idx, 1);
      return;
    }
    try {
      await request<void>(`/classes/${classId}/students/${studentId}`, { method: 'DELETE' });
    } catch {
      console.warn('[classesAPI] Backend unavailable, falling back to mock data.');
      const idx = mockStudents.findIndex((s) => s.studentId === studentId);
      if (idx !== -1) mockStudents.splice(idx, 1);
    }
  },

  // Archive class
  archive: async (id: number): Promise<Class> => {
    if (USE_MOCK) {
      const cls = mockClasses.find((c) => c.id === id);
      if (!cls) throw new Error('Class not found');
      cls.status = 'archived';
      return cls;
    }
    try {
      return await request<Class>(`/classes/${id}/archive`, { method: 'POST' });
    } catch {
      console.warn('[classesAPI] Backend unavailable, falling back to mock data.');
      const cls = mockClasses.find((c) => c.id === id);
      if (!cls) throw new Error('Class not found');
      cls.status = 'archived';
      return cls;
    }
  },

  // Unarchive class
  unarchive: async (id: number): Promise<Class> => {
    if (USE_MOCK) {
      const cls = mockClasses.find((c) => c.id === id);
      if (!cls) throw new Error('Class not found');
      cls.status = 'active';
      return cls;
    }
    try {
      return await request<Class>(`/classes/${id}/unarchive`, { method: 'POST' });
    } catch {
      console.warn('[classesAPI] Backend unavailable, falling back to mock data.');
      const cls = mockClasses.find((c) => c.id === id);
      if (!cls) throw new Error('Class not found');
      cls.status = 'active';
      return cls;
    }
  },

  // Get class statistics
  getStats: async (classId: number): Promise<{
    totalStudents: number;
    activeStudents: number;
    totalAssignments: number;
    publishedAssignments: number;
    averageGrade: number;
    submissionRate: number;
  }> => {
    if (USE_MOCK) return mockClassStats;
    try {
      return await request<{
        totalStudents: number;
        activeStudents: number;
        totalAssignments: number;
        publishedAssignments: number;
        averageGrade: number;
        submissionRate: number;
      }>(`/classes/${classId}/stats`);
    } catch {
      console.warn('[classesAPI] Backend unavailable, falling back to mock data.');
      return mockClassStats;
    }
  },
};
