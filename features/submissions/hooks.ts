// features/submissions/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionsAPI } from './api';
import type { GradeSubmissionPayload, SubmissionFilters } from './types';

export const submissionKeys = {
  all: ['submissions'] as const,
  lists: () => [...submissionKeys.all, 'list'] as const,
  list: (assignmentId: number, filters: SubmissionFilters) => [...submissionKeys.lists(), assignmentId, filters] as const,
  mySubmission: (assignmentId: number) => [...submissionKeys.all, 'mySubmission', assignmentId] as const,
  allMySubmissions: () => [...submissionKeys.all, 'allMySubmissions'] as const,
  allPending: () => [...submissionKeys.all, 'allPending'] as const,
  allSubmissions: (filters: SubmissionFilters) => [...submissionKeys.all, 'allSubmissions', filters] as const,
};

export function useAllSubmissions(filters?: SubmissionFilters) {
  return useQuery({
    queryKey: submissionKeys.allSubmissions(filters || {}),
    queryFn: () => submissionsAPI.getAll(filters),
  });
}

export function useAllPendingSubmissions() {
  return useQuery({
    queryKey: submissionKeys.allPending(),
    queryFn: () => submissionsAPI.getAllPending(),
  });
}

export function useSubmissions(assignmentId: number) {
  return useQuery({
    queryKey: submissionKeys.list(assignmentId, {}),
    queryFn: () => submissionsAPI.getByAssignment(assignmentId),
    enabled: !!assignmentId,
  });
}

export function useMySubmission(assignmentId: number) {
  return useQuery({
    queryKey: submissionKeys.mySubmission(assignmentId),
    queryFn: () => submissionsAPI.getMySubmission(assignmentId),
    enabled: !!assignmentId,
  });
}

export function useAllMySubmissions() {
  return useQuery({
    queryKey: submissionKeys.allMySubmissions(),
    queryFn: () => submissionsAPI.getAllMySubmissions(),
  });
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assignmentId, formData }: { assignmentId: number; formData: FormData }) =>
      submissionsAPI.submitAssignment(assignmentId, formData),
    onSuccess: (_, { assignmentId }) => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.mySubmission(assignmentId) });
      queryClient.invalidateQueries({ queryKey: submissionKeys.allMySubmissions() });
    },
  });
}

export function useGradeSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: GradeSubmissionPayload }) =>
      submissionsAPI.gradeSubmission(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.list(data.assignmentId, {}) });
    },
  });
}

export function useReturnSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => submissionsAPI.returnSubmission(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.list(data.assignmentId, {}) });
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ submissionId, content }: { submissionId: number; content: string }) =>
      submissionsAPI.addComment(submissionId, content),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.mySubmission(data.submissionId) });
    },
  });
}
