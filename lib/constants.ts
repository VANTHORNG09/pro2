// lib/constants.ts - Application constants
export const APP_NAME = 'AssignBridge';
export const APP_DESCRIPTION = 'Smart assignment management platform';

export const ROLES = ['admin', 'teacher', 'student'] as const;

export const ASSIGNMENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  CLOSED: 'closed',
} as const;

export const SUBMISSION_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  RETURNED: 'returned',
  LATE: 'late',
} as const;

export const DEFAULT_PAGE_SIZE = 10;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ALLOWED_FILE_TYPES = [
  '.pdf', '.doc', '.docx', '.txt',
  '.jpg', '.jpeg', '.png', '.gif',
  '.zip', '.rar',
  '.py', '.js', '.ts', '.jsx', '.tsx', '.java', '.cpp', '.html', '.css',
];
