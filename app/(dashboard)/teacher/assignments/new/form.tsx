// app/(dashboard)/teacher/assignments/new/form.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, FileText, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PageHeader } from '@/components/shared/page-header';
import { PageShell } from '@/components/shared/page-shell';
import { SectionCard } from '@/components/shared/section-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { useClasses } from '@/lib/hooks/queries/useClasses';
import { useCreateAssignment } from '@/lib/hooks/queries/useAssignments';
import { assignmentSchema, type AssignmentFormData } from '@/features/assignments/schema';
import type { AssignmentStatus } from '@/lib/types/assignment';

const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.gif', '.zip', '.rar', '.py', '.js', '.ts', '.java', '.cpp', '.html', '.css'];

export function AssignmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClassId = searchParams.get('classId');
  const { data: classes = [], isLoading: classesLoading } = useClasses();
  const createAssignment = useCreateAssignment();
  const [showPreview, setShowPreview] = useState(false);

  const form = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: '',
      description: '',
      instructions: '',
      classId: preselectedClassId || '',
      dueDate: '',
      dueTime: '23:59',
      maxPoints: 100,
      maxFileSize: 10,
      status: 'draft',
    },
  });

  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues } = form;
  const selectedClassId = watch('classId');
  const selectedClass = classes.find((c) => c.id === parseInt(selectedClassId));

  const onSubmit = (data: AssignmentFormData, saveAsDraft = false) => {
    const dueDateTime = data.dueDate ? new Date(`${data.dueDate}T${data.dueTime || '23:59'}`) : new Date('2099-12-31T23:59:59Z');
    if (isNaN(dueDateTime.getTime())) {
      form.setError('dueDate', { message: 'Invalid date format' });
      return;
    }

    createAssignment.mutate(
      {
        title: data.title,
        description: data.description,
        instructions: data.instructions,
        classId: parseInt(data.classId),
        className: selectedClass?.name || '',
        dueDate: dueDateTime.toISOString(),
        maxPoints: data.maxPoints,
        allowedFileTypes: ALLOWED_FILE_TYPES,
        maxFileSize: data.maxFileSize * 1024 * 1024,
        status: saveAsDraft ? 'draft' : (data.status as AssignmentStatus),
      },
      {
        onSuccess: (newAssignment) => router.push(`/teacher/assignments/${newAssignment.id}`),
      }
    );
  };

  return (
    <PageShell>
      <PageHeader
        title="Create New Assignment"
        description="Design and configure a new assignment for your students"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPreview(true)} disabled={!getValues('title')}>
              <Info className="mr-2 h-4 w-4" />Preview
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-6">
        {/* Basic Information */}
        <SectionCard title="Basic Information" description="Assignment title, description, and target class">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Assignment Title *</Label>
              <Input id="title" {...register('title')} className={errors.title ? 'border-red-500' : ''} />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Class *</Label>
              <Select value={selectedClassId} onValueChange={(v) => setValue('classId', v)}>
                <SelectTrigger className={errors.classId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classesLoading ? <SelectItem value="loading" disabled>Loading...</SelectItem>
                    : classes.filter((c) => c.status === 'active').map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.name} ({c.code})</SelectItem>
                      ))}
                </SelectContent>
              </Select>
              {errors.classId && <p className="text-sm text-red-500">{errors.classId.message}</p>}
              {selectedClass && <p className="text-sm text-muted-foreground">{selectedClass.studentCount} students will receive this assignment</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" {...register('description')} rows={3} className={errors.description ? 'border-red-500' : ''} />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>
          </div>
        </SectionCard>

        {/* Instructions */}
        <SectionCard title="Detailed Instructions" description="Comprehensive instructions for students">
          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions *</Label>
            <Textarea id="instructions" {...register('instructions')} rows={10} className={errors.instructions ? 'border-red-500' : ''} />
            {errors.instructions && <p className="text-sm text-red-500">{errors.instructions.message}</p>}
          </div>
        </SectionCard>

        {/* Due Date */}
        <SectionCard title="Due Date & Time" description="When is this assignment due?">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input id="dueDate" type="date" {...register('dueDate')} min={new Date().toISOString().split('T')[0]} className={errors.dueDate ? 'border-red-500' : ''} />
              {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueTime">Due Time</Label>
              <Input id="dueTime" type="time" {...register('dueTime')} />
            </div>
          </div>
          {getValues('dueDate') && (
            <div className="mt-4 p-3 rounded-lg bg-muted/50 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Due: {new Date(`${getValues('dueDate')}T${getValues('dueTime')}`).toLocaleString()}</span>
            </div>
          )}
        </SectionCard>

        {/* Grading */}
        <SectionCard title="Grading Settings" description="Configure point values">
          <div className="space-y-2">
            <Label htmlFor="maxPoints">Maximum Points</Label>
            <Input id="maxPoints" type="number" min="0" {...register('maxPoints')} className={errors.maxPoints ? 'border-red-500' : ''} />
            {errors.maxPoints && <p className="text-sm text-red-500">{errors.maxPoints.message}</p>}
          </div>
        </SectionCard>

        {/* File Settings */}
        <SectionCard title="File Upload Settings" description="Configure what file types students can upload">
          <div className="space-y-2">
            <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
            <Input id="maxFileSize" type="number" min="1" max="100" {...register('maxFileSize')} />
            <p className="text-sm text-muted-foreground">Students can upload files up to {getValues('maxFileSize')} MB each</p>
          </div>
        </SectionCard>

        {/* Actions */}
        <SectionCard title="Publishing Options" description="Choose whether to save as draft or publish">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="button" variant="outline" onClick={handleSubmit((data) => onSubmit(data, true))} disabled={createAssignment.isPending}>
              <FileText className="mr-2 h-4 w-4" />Save as Draft
            </Button>
            <Button type="submit" disabled={createAssignment.isPending}>
              {createAssignment.isPending ? 'Creating...' : 'Publish Assignment'}
            </Button>
          </div>
        </SectionCard>
      </form>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assignment Preview</DialogTitle>
            <DialogDescription>This is how students will see the assignment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{getValues('title') || 'Untitled Assignment'}</h2>
              <div className="flex gap-2 mb-4">
                {selectedClass && <Badge variant="secondary">{selectedClass.name}</Badge>}
                <StatusBadge status={getValues('status')} />
              </div>
            </div>
            {getValues('description') && <div><h3 className="font-semibold mb-2">Description</h3><p className="text-muted-foreground">{getValues('description')}</p></div>}
            {getValues('instructions') && <div><h3 className="font-semibold mb-2">Instructions</h3><p className="text-muted-foreground whitespace-pre-wrap">{getValues('instructions')}</p></div>}
            {getValues('dueDate') && (
              <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <div><p className="text-sm font-medium">Due Date</p><p className="text-sm text-muted-foreground">{new Date(`${getValues('dueDate')}T${getValues('dueTime')}`).toLocaleString()}</p></div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50"><p className="text-sm font-medium">Maximum Points</p><p className="text-2xl font-bold">{getValues('maxPoints')}</p></div>
              <div className="p-3 rounded-lg bg-muted/50"><p className="text-sm font-medium">Max File Size</p><p className="text-2xl font-bold">{getValues('maxFileSize')} MB</p></div>
            </div>
          </div>
          <DialogFooter><Button onClick={() => setShowPreview(false)}>Close Preview</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
