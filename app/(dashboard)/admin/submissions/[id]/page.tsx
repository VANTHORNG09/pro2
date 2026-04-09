export default function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <h1 className="text-2xl font-bold tracking-tight">Submission Detail</h1>
      <p className="text-muted-foreground">
        View and review individual student submissions.
      </p>
    </div>
  );
}
