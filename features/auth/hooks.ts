// features/auth/hooks.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { authAPI } from './api';
import type { LoginCredentials, SignupData } from './types';

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authAPI.login(credentials),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: SignupData) => authAPI.register(data),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => authAPI.logout(),
  });
}
