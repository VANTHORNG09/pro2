// features/classes/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classesAPI } from './api';
import type { Class, ClassFilters, CreateClassData, UpdateClassData } from './types';

export const classKeys = {
  all: ['classes'] as const,
  lists: () => [...classKeys.all, 'list'] as const,
  list: (filters: ClassFilters) => [...classKeys.lists(), filters] as const,
  details: () => [...classKeys.all, 'detail'] as const,
  detail: (id: number) => [...classKeys.details(), id] as const,
  stats: (classId: number) => [...classKeys.detail(classId), 'stats'] as const,
};

export function useClasses(filters?: ClassFilters) {
  return useQuery({
    queryKey: classKeys.list(filters || {}),
    queryFn: () => classesAPI.getAll(filters),
  });
}

export function useClass(id: number) {
  return useQuery({
    queryKey: classKeys.detail(id),
    queryFn: () => classesAPI.getById(id),
    enabled: !!id,
  });
}

export function useClassStats(classId: number) {
  return useQuery({
    queryKey: classKeys.stats(classId),
    queryFn: () => classesAPI.getStats(classId),
    enabled: !!classId,
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateClassData) => classesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.all });
    },
  });
}

export function useUpdateClass(id: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateClassData) => {
      if (!id) throw new Error('Class ID is required');
      return classesAPI.update(id, data);
    },
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: classKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: classKeys.all });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => classesAPI.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: classKeys.all });
      queryClient.removeQueries({ queryKey: classKeys.detail(id) });
    },
  });
}
