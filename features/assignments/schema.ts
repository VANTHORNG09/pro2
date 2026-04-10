// features/assignments/schema.ts
import { z } from 'zod';

export const assignmentSchema = z.object({
  title: z.string().min(1, 'Title is required').min(3, 'Title must be at least 3 characters'),
  description: z.string().min(1, 'Description is required'),
  instructions: z.string().min(1, 'Instructions are required'),
  classId: z.string().min(1, 'Please select a class'),
  dueDate: z.string().min(1, 'Due date is required'),
  dueTime: z.string().default('23:59'),
  maxPoints: z.coerce.number().min(0, 'Max points must be 0 or greater').default(100),
  maxFileSize: z.coerce.number().min(1).max(100).default(10),
  status: z.enum(['draft', 'published', 'closed']).default('draft'),
});

export type AssignmentFormData = z.infer<typeof assignmentSchema>;
