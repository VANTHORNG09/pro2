// features/submissions/components/SubmissionList.tsx
"use client";

import { Submission } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SubmissionListProps {
  submissions: Submission[];
  onView?: (submission: Submission) => void;
}

export function SubmissionList({ submissions, onView }: SubmissionListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Assignment</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((s) => (
          <TableRow key={s.id}>
            <TableCell>
              <div>
                <p className="font-medium">{s.studentName}</p>
                <p className="text-sm text-muted-foreground">{s.studentEmail}</p>
              </div>
            </TableCell>
            <TableCell className="text-sm">{s.assignmentName}</TableCell>
            <TableCell>
              <Badge
                variant={
                  s.status === 'graded' ? 'default' :
                  s.status === 'late' ? 'destructive' :
                  s.status === 'submitted' ? 'secondary' : 'outline'
                }
              >
                {s.status}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">
              {s.grade !== null ? `${s.grade}/${s.maxPoints}` : '—'}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : '—'}
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={() => onView?.(s)}>
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
