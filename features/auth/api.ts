// features/auth/api.ts
import { LoginCredentials, SignupData, User, AuthResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || `API request failed: ${response.status}`);
  }

  return data;
}

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (data: SignupData): Promise<{ message: string }> => {
    return request<{ message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: async (): Promise<void> => {
    await request<void>('/auth/logout', { method: 'POST' });
  },

  getMe: async (token: string): Promise<{ user: User }> => {
    return request<{ user: User }>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
