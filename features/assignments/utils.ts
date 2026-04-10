// features/assignments/utils.ts
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function getDueDateUrgency(dueDate: string): 'overdue' | 'urgent' | 'normal' {
  const daysUntilDue = Math.ceil(
    (new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysUntilDue < 0) return 'overdue';
  if (daysUntilDue <= 3) return 'urgent';
  return 'normal';
}

export function getCompletionPercentage(graded: number, total: number): number {
  return total > 0 ? Math.round((graded / total) * 100) : 0;
}
