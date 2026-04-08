// lib/api/users.ts
import type { UserRole, UserStatus } from '@/lib/types/user';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || false;

const mockUsers: ApiUser[] = [
  { id: '1', fullName: 'Dr. Sarah Johnson', email: 'sarah.johnson@university.edu', role: 'teacher', status: 'active', createdAt: '2025-09-01T08:00:00Z', lastLogin: '2026-04-07T10:00:00Z' },
  { id: '2', fullName: 'Prof. Michael Chen', email: 'michael.chen@university.edu', role: 'teacher', status: 'active', createdAt: '2025-09-01T08:00:00Z', lastLogin: '2026-04-06T14:30:00Z' },
  { id: '3', fullName: 'Admin User', email: 'admin@assignbridge.com', role: 'admin', status: 'active', createdAt: '2025-08-15T08:00:00Z', lastLogin: '2026-04-08T09:00:00Z' },
  { id: '4', fullName: 'Alice Williams', email: 'alice.williams@university.edu', role: 'student', status: 'active', createdAt: '2025-09-05T10:00:00Z', lastLogin: '2026-04-07T11:00:00Z' },
  { id: '5', fullName: 'Bob Martinez', email: 'bob.martinez@university.edu', role: 'student', status: 'active', createdAt: '2025-09-05T10:15:00Z', lastLogin: '2026-04-07T12:00:00Z' },
  { id: '6', fullName: 'Carol Davis', email: 'carol.davis@university.edu', role: 'student', status: 'active', createdAt: '2025-09-06T09:00:00Z', lastLogin: '2026-04-05T15:00:00Z' },
  { id: '7', fullName: 'David Lee', email: 'david.lee@university.edu', role: 'student', status: 'active', createdAt: '2025-09-06T09:30:00Z', lastLogin: '2026-04-04T16:00:00Z' },
  { id: '8', fullName: 'Emma Thompson', email: 'emma.thompson@university.edu', role: 'student', status: 'active', createdAt: '2025-09-07T11:00:00Z', lastLogin: '2026-04-07T13:00:00Z' },
  { id: '9', fullName: 'Frank Wilson', email: 'frank.wilson@university.edu', role: 'student', status: 'inactive', createdAt: '2025-09-07T11:30:00Z', lastLogin: '2025-12-10T09:00:00Z' },
];

export interface ApiUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
}

export interface CreateUserPayload {
  fullName: string;
  email: string;
  role: UserRole;
  password?: string;
}

export interface UpdateUserPayload {
  fullName?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserFilters {
  role?: UserRole | 'all';
  status?: UserStatus | 'all';
  search?: string;
}

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

export const usersAPI = {
  // List all users
  getAll: async (filters?: UserFilters): Promise<ApiUser[]> => {
    if (USE_MOCK) {
      let result = [...mockUsers];
      if (filters?.role && filters.role !== 'all') result = result.filter((u) => u.role === filters.role);
      if (filters?.status && filters.status !== 'all') result = result.filter((u) => u.status === filters.status);
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter((u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
      }
      return result;
    }
    try {
      const params = new URLSearchParams();
      if (filters?.role && filters.role !== 'all') params.append('role', filters.role);
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);

      const queryString = params.toString();
      return request<ApiUser[]>(`/users${queryString ? `?${queryString}` : ''}`);
    } catch {
      console.warn('[usersAPI] Backend unavailable, falling back to mock data.');
      return mockUsers;
    }
  },

  // Get single user
  getById: async (id: string): Promise<ApiUser> => {
    if (USE_MOCK) {
      const user = mockUsers.find((u) => u.id === id);
      if (!user) throw new Error('User not found');
      return user;
    }
    try {
      return request<ApiUser>(`/users/${id}`);
    } catch {
      const user = mockUsers.find((u) => u.id === id);
      if (!user) throw new Error('User not found');
      return user;
    }
  },

  // Create user
  create: async (data: CreateUserPayload): Promise<ApiUser> => {
    if (USE_MOCK) {
      const newUser: ApiUser = { ...data, id: String(Date.now()), status: 'active', createdAt: new Date().toISOString() };
      return newUser;
    }
    return request<ApiUser>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update user
  update: async (id: string, data: UpdateUserPayload): Promise<ApiUser> => {
    if (USE_MOCK) {
      const existing = mockUsers.find((u) => u.id === id);
      if (!existing) throw new Error('User not found');
      return { ...existing, ...data };
    }
    return request<ApiUser>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete user
  delete: async (id: string): Promise<void> => {
    if (USE_MOCK) return;
    return request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Activate user
  activate: async (id: string): Promise<ApiUser> => {
    if (USE_MOCK) {
      const existing = mockUsers.find((u) => u.id === id);
      if (!existing) throw new Error('User not found');
      return { ...existing, status: 'active' };
    }
    return request<ApiUser>(`/users/${id}/activate`, {
      method: 'POST',
    });
  },

  // Deactivate user
  deactivate: async (id: string): Promise<ApiUser> => {
    if (USE_MOCK) {
      const existing = mockUsers.find((u) => u.id === id);
      if (!existing) throw new Error('User not found');
      return { ...existing, status: 'inactive' };
    }
    return request<ApiUser>(`/users/${id}/deactivate`, {
      method: 'POST',
    });
  },

  // Get dashboard stats
  getStats: async (): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalClasses: number;
    totalAssignments: number;
    teachersCount: number;
    studentsCount: number;
    adminsCount: number;
  }> => {
    if (USE_MOCK) {
      return {
        totalUsers: mockUsers.length,
        activeUsers: mockUsers.filter((u) => u.status === 'active').length,
        totalClasses: 4,
        totalAssignments: 45,
        teachersCount: mockUsers.filter((u) => u.role === 'teacher').length,
        studentsCount: mockUsers.filter((u) => u.role === 'student').length,
        adminsCount: mockUsers.filter((u) => u.role === 'admin').length,
      };
    }
    return request<{
      totalUsers: number;
      activeUsers: number;
      totalClasses: number;
      totalAssignments: number;
      teachersCount: number;
      studentsCount: number;
      adminsCount: number;
    }>('/users/stats');
  },
};
