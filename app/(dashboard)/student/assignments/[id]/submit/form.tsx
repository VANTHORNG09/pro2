// app/(dashboard)/student/assignments/[id]/submit/form.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useSubmitAssignment } from '@/lib/hooks/queries/useSubmissions';
import { FileUpload } from '@/features/assignments/components/FileUpload';
import type { Assignment, Submission } from '@/lib/types/assignment';

interface SubmitFormProps {
  assignment: Assignment;
  existingSubmission?: Submission;
  onSuccess?: () => void;
}

export function SubmitForm({ assignment, existingSubmission, onSuccess }: SubmitFormProps) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [comments, setComments] = useState('');
  const submitMutation = useSubmitAssignment();

  const isLate = new Date() > new Date(assignment.dueDate);
  const isSubmitted = existingSubmission?.status === 'submitted' || existingSubmission?.status === 'graded';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (comments) formData.append('comments', comments);

    submitMutation.mutate(
      { assignmentId: assignment.id, formData },
      {
        onSuccess: () => {
          setFiles([]);
          setComments('');
          onSuccess?.();
        },
      }
    );
  };

  if (isSubmitted && existingSubmission) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-lg border bg-primary/10">
          <p className="text-sm font-medium">✓ Assignment Submitted</p>
          <p className="text-xs text-muted-foreground mt-1">
            Submitted on {new Date(existingSubmission.submittedAt!).toLocaleDateString()}
          </p>
          {existingSubmission.grade !== null && (
            <div className="mt-3">
              <p className="text-sm font-semibold">Grade: {existingSubmission.grade}/{existingSubmission.maxPoints}</p>
              {existingSubmission.feedback && <p className="text-sm text-muted-foreground mt-1">{existingSubmission.feedback}</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isLate && (
        <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-500">Late Submission</p>
            <p className="text-xs text-muted-foreground mt-1">
              The due date ({new Date(assignment.dueDate).toLocaleDateString()}) has passed.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Files *</label>
        <FileUpload
          files={files}
          onChange={setFiles}
          maxFiles={5}
          maxSize={assignment.maxFileSize}
          allowedTypes={assignment.allowedFileTypes}
          disabled={submitMutation.isPending}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="comments" className="text-sm font-medium">Comments (optional)</label>
        <Textarea id="comments" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Add any comments for your instructor..." rows={4} disabled={submitMutation.isPending} />
      </div>

      <Button type="submit" disabled={submitMutation.isPending || files.length === 0} className="w-full">
        {submitMutation.isPending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>) : isLate ? 'Submit (Late)' : 'Submit Assignment'}
      </Button>
    </form>
  );
}
