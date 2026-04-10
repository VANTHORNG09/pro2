// features/submissions/types.ts
export type SubmissionStatus = 'pending' | 'submitted' | 'graded' | 'returned' | 'late';

export interface SubmissionFile {
  id: number;
  submissionId: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}

export interface SubmissionComment {
  id: number;
  submissionId: number;
  userId: number;
  userName: string;
  userRole: string;
  content: string;
  createdAt: string;
}

export interface Submission {
  id: number;
  assignmentId: number;
  assignmentName?: string;
  studentId: number;
  studentName: string;
  studentEmail: string;
  status: SubmissionStatus;
  submittedAt: string | null;
  gradedAt: string | null;
  grade: number | null;
  maxPoints: number;
  feedback: string | null;
  files: SubmissionFile[];
  comments: SubmissionComment[];
  isLate: boolean;
}

export interface GradeSubmissionPayload {
  grade: number;
  feedback: string;
}

export interface SubmissionFilters {
  status?: SubmissionStatus | 'all';
  search?: string;
}
