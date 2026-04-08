import { Submission, GradeSubmissionPayload, SubmissionFilters, SubmissionComment } from '@/lib/types/assignment';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || false;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Mock data for pending submissions (admin view)
const mockPendingSubmissions: Submission[] = [
  {
    id: 1001,
    assignmentId: 1,
    assignmentName: "Data Structures Final Project",
    studentId: 201,
    studentName: "Alice Johnson",
    studentEmail: "alice.johnson@university.edu",
    status: "pending",
    submittedAt: "2026-04-05T14:30:00Z",
    gradedAt: null,
    grade: null,
    maxPoints: 100,
    feedback: null,
    files: [
      {
        id: 5001,
        submissionId: 1001,
        fileName: "final_project.zip",
        fileUrl: "/files/final_project.zip",
        fileSize: 2_450_000,
        fileType: "application/zip",
        uploadedAt: "2026-04-05T14:30:00Z",
      },
    ],
    comments: [],
    isLate: false,
  },
  {
    id: 1002,
    assignmentId: 2,
    assignmentName: "Organic Chemistry Lab Report",
    studentId: 202,
    studentName: "Bob Martinez",
    studentEmail: "bob.martinez@university.edu",
    status: "pending",
    submittedAt: "2026-04-03T09:15:00Z",
    gradedAt: null,
    grade: null,
    maxPoints: 50,
    feedback: null,
    files: [
      {
        id: 5002,
        submissionId: 1002,
        fileName: "lab_report_5.pdf",
        fileUrl: "/files/lab_report_5.pdf",
        fileSize: 1_820_000,
        fileType: "application/pdf",
        uploadedAt: "2026-04-03T09:15:00Z",
      },
    ],
    comments: [],
    isLate: true,
  },
  {
    id: 1003,
    assignmentId: 3,
    assignmentName: "Calculus Problem Set 7",
    studentId: 203,
    studentName: "Carol Lee",
    studentEmail: "carol.lee@university.edu",
    status: "submitted",
    submittedAt: "2026-04-06T18:45:00Z",
    gradedAt: null,
    grade: null,
    maxPoints: 75,
    feedback: null,
    files: [
      {
        id: 5003,
        submissionId: 1003,
        fileName: "problem_set_7.pdf",
        fileUrl: "/files/problem_set_7.pdf",
        fileSize: 980_000,
        fileType: "application/pdf",
        uploadedAt: "2026-04-06T18:45:00Z",
      },
    ],
    comments: [],
    isLate: false,
  },
  {
    id: 1004,
    assignmentId: 1,
    assignmentName: "Data Structures Final Project",
    studentId: 204,
    studentName: "David Kim",
    studentEmail: "david.kim@university.edu",
    status: "pending",
    submittedAt: null,
    gradedAt: null,
    grade: null,
    maxPoints: 100,
    feedback: null,
    files: [],
    comments: [],
    isLate: false,
  },
  {
    id: 1005,
    assignmentId: 5,
    assignmentName: "Machine Learning Assignment 3",
    studentId: 205,
    studentName: "Emma Wilson",
    studentEmail: "emma.wilson@university.edu",
    status: "submitted",
    submittedAt: "2026-04-07T11:00:00Z",
    gradedAt: null,
    grade: null,
    maxPoints: 120,
    feedback: null,
    files: [
      {
        id: 5004,
        submissionId: 1005,
        fileName: "ml_assignment_3.zip",
        fileUrl: "/files/ml_assignment_3.zip",
        fileSize: 5_100_000,
        fileType: "application/zip",
        uploadedAt: "2026-04-07T11:00:00Z",
      },
      {
        id: 5005,
        submissionId: 1005,
        fileName: "report.pdf",
        fileUrl: "/files/report.pdf",
        fileSize: 1_200_000,
        fileType: "application/pdf",
        uploadedAt: "2026-04-07T11:00:00Z",
      },
    ],
    comments: [
      {
        id: 3001,
        submissionId: 1005,
        userId: 205,
        userName: "Emma Wilson",
        userRole: "student",
        content: "I had trouble with the dataset preprocessing, hope the approach is fine.",
        createdAt: "2026-04-07T11:05:00Z",
      },
    ],
    isLate: false,
  },
  {
    id: 1006,
    assignmentId: 2,
    assignmentName: "Organic Chemistry Lab Report",
    studentId: 206,
    studentName: "Frank Thompson",
    studentEmail: "frank.thompson@university.edu",
    status: "late",
    submittedAt: "2026-04-04T23:55:00Z",
    gradedAt: null,
    grade: null,
    maxPoints: 50,
    feedback: null,
    files: [
      {
        id: 5006,
        submissionId: 1006,
        fileName: "lab_report_frank.pdf",
        fileUrl: "/files/lab_report_frank.pdf",
        fileSize: 1_550_000,
        fileType: "application/pdf",
        uploadedAt: "2026-04-04T23:55:00Z",
      },
    ],
    comments: [],
    isLate: true,
  },
  {
    id: 1007,
    assignmentId: 7,
    assignmentName: "Database Schema Design",
    studentId: 207,
    studentName: "Grace Patel",
    studentEmail: "grace.patel@university.edu",
    status: "submitted",
    submittedAt: "2026-04-06T16:20:00Z",
    gradedAt: null,
    grade: null,
    maxPoints: 90,
    feedback: null,
    files: [
      {
        id: 5007,
        submissionId: 1007,
        fileName: "schema_design.sql",
        fileUrl: "/files/schema_design.sql",
        fileSize: 45_000,
        fileType: "application/sql",
        uploadedAt: "2026-04-06T16:20:00Z",
      },
    ],
    comments: [],
    isLate: false,
  },
  {
    id: 1008,
    assignmentId: 3,
    assignmentName: "Calculus Problem Set 7",
    studentId: 208,
    studentName: "Henry Zhang",
    studentEmail: "henry.zhang@university.edu",
    status: "pending",
    submittedAt: null,
    gradedAt: null,
    grade: null,
    maxPoints: 75,
    feedback: null,
    files: [],
    comments: [],
    isLate: false,
  },
];

// Mock data for all submissions (admin view)
const mockAllSubmissions: Submission[] = [
  ...mockPendingSubmissions,
  {
    id: 1009,
    assignmentId: 1,
    assignmentName: "Data Structures Final Project",
    studentId: 209,
    studentName: "Iris Nakamura",
    studentEmail: "iris.nakamura@university.edu",
    status: "graded",
    submittedAt: "2026-04-02T10:00:00Z",
    gradedAt: "2026-04-04T14:30:00Z",
    grade: 92,
    maxPoints: 100,
    feedback: "Excellent work on the BST implementation. Minor issues with the AVL rotations.",
    files: [
      {
        id: 5008,
        submissionId: 1009,
        fileName: "bst_project.zip",
        fileUrl: "/files/bst_project.zip",
        fileSize: 3_200_000,
        fileType: "application/zip",
        uploadedAt: "2026-04-02T10:00:00Z",
      },
    ],
    comments: [],
    isLate: false,
  },
  {
    id: 1010,
    assignmentId: 4,
    assignmentName: "Modern History Essay",
    studentId: 210,
    studentName: "Jack Rivera",
    studentEmail: "jack.rivera@university.edu",
    status: "graded",
    submittedAt: "2026-04-01T16:00:00Z",
    gradedAt: "2026-04-03T11:00:00Z",
    grade: 78,
    maxPoints: 100,
    feedback: "Good thesis statement. Needs stronger evidence in the second half.",
    files: [
      {
        id: 5009,
        submissionId: 1010,
        fileName: "history_essay.docx",
        fileUrl: "/files/history_essay.docx",
        fileSize: 450_000,
        fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        uploadedAt: "2026-04-01T16:00:00Z",
      },
    ],
    comments: [
      {
        id: 3002,
        submissionId: 1010,
        userId: 1,
        userName: "Dr. Sarah Johnson",
        userRole: "teacher",
        content: "Please revise the conclusion section for a stronger finish.",
        createdAt: "2026-04-03T11:05:00Z",
      },
    ],
    isLate: false,
  },
  {
    id: 1011,
    assignmentId: 5,
    assignmentName: "Machine Learning Assignment 3",
    studentId: 211,
    studentName: "Karen O'Brien",
    studentEmail: "karen.obrien@university.edu",
    status: "returned",
    submittedAt: "2026-04-05T20:00:00Z",
    gradedAt: "2026-04-07T09:00:00Z",
    grade: 65,
    maxPoints: 120,
    feedback: "The model architecture is sound but the training results are suboptimal. Try adjusting the learning rate.",
    files: [
      {
        id: 5010,
        submissionId: 1011,
        fileName: "ml_model.zip",
        fileUrl: "/files/ml_model.zip",
        fileSize: 8_500_000,
        fileType: "application/zip",
        uploadedAt: "2026-04-05T20:00:00Z",
      },
    ],
    comments: [],
    isLate: true,
  },
  {
    id: 1012,
    assignmentId: 7,
    assignmentName: "Database Schema Design",
    studentId: 212,
    studentName: "Leo Fischer",
    studentEmail: "leo.fischer@university.edu",
    status: "graded",
    submittedAt: "2026-04-04T13:30:00Z",
    gradedAt: "2026-04-06T10:15:00Z",
    grade: 88,
    maxPoints: 90,
    feedback: "Well-normalized schema. Lost 2 points for missing indexes on foreign keys.",
    files: [
      {
        id: 5011,
        submissionId: 1012,
        fileName: "schema.sql",
        fileUrl: "/files/schema.sql",
        fileSize: 38_000,
        fileType: "application/sql",
        uploadedAt: "2026-04-04T13:30:00Z",
      },
      {
        id: 5012,
        submissionId: 1012,
        fileName: "er_diagram.pdf",
        fileUrl: "/files/er_diagram.pdf",
        fileSize: 720_000,
        fileType: "application/pdf",
        uploadedAt: "2026-04-04T13:30:00Z",
      },
    ],
    comments: [],
    isLate: false,
  },
  {
    id: 1013,
    assignmentId: 4,
    assignmentName: "Modern History Essay",
    studentId: 213,
    studentName: "Mia Chen",
    studentEmail: "mia.chen@university.edu",
    status: "late",
    submittedAt: "2026-04-09T08:00:00Z",
    gradedAt: null,
    grade: null,
    maxPoints: 100,
    feedback: null,
    files: [
      {
        id: 5013,
        submissionId: 1013,
        fileName: "modern_history_essay.pdf",
        fileUrl: "/files/modern_history_essay.pdf",
        fileSize: 890_000,
        fileType: "application/pdf",
        uploadedAt: "2026-04-09T08:00:00Z",
      },
    ],
    comments: [],
    isLate: true,
  },
  {
    id: 1014,
    assignmentId: 1,
    assignmentName: "Data Structures Final Project",
    studentId: 214,
    studentName: "Noah Williams",
    studentEmail: "noah.williams@university.edu",
    status: "returned",
    submittedAt: "2026-04-03T11:45:00Z",
    gradedAt: "2026-04-05T16:00:00Z",
    grade: 85,
    maxPoints: 100,
    feedback: "Good implementation overall. Please review the memory leak in the tree destructor.",
    files: [
      {
        id: 5014,
        submissionId: 1014,
        fileName: "project_submission.zip",
        fileUrl: "/files/project_submission.zip",
        fileSize: 2_800_000,
        fileType: "application/zip",
        uploadedAt: "2026-04-03T11:45:00Z",
      },
    ],
    comments: [
      {
        id: 3003,
        submissionId: 1014,
        userId: 214,
        userName: "Noah Williams",
        userRole: "student",
        content: "Thanks for the feedback! I'll fix the destructor issue.",
        createdAt: "2026-04-05T17:00:00Z",
      },
    ],
    isLate: false,
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

export const submissionsAPI = {
  // Get all submissions across all assignments (admin view)
  getAll: async (filters?: SubmissionFilters): Promise<Submission[]> => {
    if (USE_MOCK) {
      let result = [...mockAllSubmissions];
      if (filters?.status && filters.status !== 'all') result = result.filter((s) => s.status === filters.status);
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (s) =>
            s.studentName.toLowerCase().includes(q) ||
            s.studentEmail.toLowerCase().includes(q) ||
            (s.assignmentName?.toLowerCase().includes(q) ?? false)
        );
      }
      return result;
    }
    try {
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);

      const queryString = params.toString();
      return request<Submission[]>(`/submissions${queryString ? `?${queryString}` : ''}`);
    } catch {
      console.warn('[submissionsAPI] Backend unavailable, falling back to mock data.');
      let result = [...mockAllSubmissions];
      if (filters?.status && filters.status !== 'all') result = result.filter((s) => s.status === filters.status);
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (s) =>
            s.studentName.toLowerCase().includes(q) ||
            s.studentEmail.toLowerCase().includes(q) ||
            (s.assignmentName?.toLowerCase().includes(q) ?? false)
        );
      }
      return result;
    }
  },

  // Get all submissions for an assignment (teacher view)
  getByAssignment: async (assignmentId: number, filters?: SubmissionFilters): Promise<Submission[]> => {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    return request<Submission[]>(`/assignments/${assignmentId}/submissions${queryString ? `?${queryString}` : ''}`);
  },

  // Get all pending submissions across all assignments (admin view)
  getAllPending: async (filters?: SubmissionFilters): Promise<Submission[]> => {
    if (USE_MOCK) {
      let result = [...mockPendingSubmissions];
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (s) =>
            s.studentName.toLowerCase().includes(q) ||
            s.studentEmail.toLowerCase().includes(q) ||
            (s.assignmentName?.toLowerCase().includes(q) ?? false)
        );
      }
      return result;
    }
    try {
      const params = new URLSearchParams();
      params.append('status', 'pending');
      if (filters?.search) params.append('search', filters.search);

      const queryString = params.toString();
      return request<Submission[]>(`/submissions/pending${queryString ? `?${queryString}` : ''}`);
    } catch {
      console.warn('[submissionsAPI] Backend unavailable, falling back to mock data.');
      return mockPendingSubmissions;
    }
  },

  // Get student's own submission for an assignment
  getMySubmission: async (assignmentId: number): Promise<Submission> => {
    return request<Submission>(`/assignments/${assignmentId}/submissions/me`);
  },

  // Get all student's submissions (student view)
  getAllMySubmissions: async (): Promise<Submission[]> => {
    return request<Submission[]>('/submissions/me');
  },

  // Submit assignment (student)
  submitAssignment: async (assignmentId: number, formData: FormData): Promise<Submission> => {
    const token = getToken();
    
    const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}/submissions`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API request failed: ${response.status}`);
    }

    return data;
  },

  // Update submission (student)
  updateSubmission: async (id: number, formData: FormData): Promise<Submission> => {
    const token = getToken();
    
    const response = await fetch(`${API_BASE_URL}/submissions/${id}`, {
      method: 'PUT',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API request failed: ${response.status}`);
    }

    return data;
  },

  // Delete file from submission
  deleteFile: async (submissionId: number, fileId: number): Promise<Submission> => {
    return request<Submission>(`/submissions/${submissionId}/files/${fileId}`, {
      method: 'DELETE',
    });
  },

  // Grade submission (teacher)
  gradeSubmission: async (id: number, payload: GradeSubmissionPayload): Promise<Submission> => {
    return request<Submission>(`/submissions/${id}/grade`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Return submission to student (teacher)
  returnSubmission: async (id: number): Promise<Submission> => {
    return request<Submission>(`/submissions/${id}/return`, {
      method: 'POST',
    });
  },

  // Add comment to submission
  addComment: async (submissionId: number, content: string): Promise<SubmissionComment> => {
    return request<SubmissionComment>(`/submissions/${submissionId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  // Download all submissions as ZIP (teacher)
  downloadAllSubmissions: async (assignmentId: number): Promise<Blob> => {
    const token = getToken();
    
    const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}/submissions/download`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `API request failed: ${response.status}`);
    }

    return await response.blob();
  },
};
