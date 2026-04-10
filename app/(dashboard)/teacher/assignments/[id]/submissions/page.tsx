"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Search,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import { useAssignment } from "@/lib/hooks/queries/useAssignments";
import { useSubmissions, useDownloadSubmissions } from "@/lib/hooks/queries/useSubmissions";
import { useToast } from "@/hooks/use-toast";
import { GradingInterface } from "@/features/submissions/components/GradingInterface";
import type { SubmissionFilters, SubmissionStatus } from "@/lib/types/assignment";

// ─── Stat Card Component ──────────────────────────────────────────────
function DashboardStat({
  title,
  value,
  subtitle,
  icon,
  trend,
}: {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {trend &&
            (trend.positive ? (
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-500" />
            ))}
          {trend && (
            <span className={trend.positive ? "text-emerald-500" : "text-red-500"}>
              {trend.value}
            </span>
          )}
          <span>{subtitle}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Helper Functions ─────────────────────────────────────────────────
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Submission Card Component ────────────────────────────────────────
function SubmissionCard({
  submission,
  selected,
  onSelect,
}: {
  submission: any;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-lg border transition-all hover:shadow-md ${
        selected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "bg-card hover:bg-muted/50"
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
            {getInitials(submission.studentName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium truncate">{submission.studentName}</p>
            {submission.grade !== null && submission.grade !== undefined && (
              <span className="text-sm font-bold shrink-0">
                {submission.grade}/{submission.maxPoints}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{submission.studentEmail}</p>
          <div className="flex items-center gap-2 mt-2">
            {submission.submittedAt && (
              <span className="text-xs text-muted-foreground">
                Submitted: {formatDate(submission.submittedAt)}
              </span>
            )}
            <div className="flex items-center gap-1">
              <span
                className={`h-2 w-2 rounded-full ${
                  submission.status === "graded"
                    ? "bg-emerald-500"
                    : submission.status === "submitted"
                      ? "bg-blue-500"
                      : submission.status === "late" || submission.isLate
                        ? "bg-red-500"
                        : submission.status === "returned"
                          ? "bg-violet-500"
                          : "bg-muted"
                }`}
              />
              <span className="text-xs capitalize">{submission.status}</span>
              {submission.isLate && submission.status !== "late" && (
                <Badge variant="outline" className="text-[10px] border-red-500/30 text-red-500 h-4 px-1">
                  Late
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function TeacherSubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const assignmentId = parseInt(params.id as string);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);

  const { data: assignment, isLoading: isLoadingAssignment } = useAssignment(assignmentId);
  const { data: submissions = [], isLoading: isLoadingSubmissions } = useSubmissions(assignmentId, {
    status: activeTab === "all" ? undefined : (activeTab as SubmissionStatus),
    search: search || undefined,
  });
  const downloadMutation = useDownloadSubmissions();

  const selectedSubmission = submissions.find((s) => s.id === selectedSubmissionId);

  // Counts
  const counts = {
    all: submissions.length,
    submitted: submissions.filter((s) => s.status === "submitted").length,
    graded: submissions.filter((s) => s.status === "graded" || s.status === "returned").length,
    pending: submissions.filter((s) => s.status === "pending").length,
    late: submissions.filter((s) => s.isLate).length,
  };

  const totalSubmissions = submissions.length;
  const totalGraded = counts.graded;
  const totalPending = counts.pending + counts.submitted;
  const totalLate = counts.late;
  const gradingPct = totalSubmissions > 0 ? Math.round((totalGraded / totalSubmissions) * 100) : 0;

  const handleDownloadAll = async () => {
    try {
      const blob = await downloadMutation.mutateAsync(assignmentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${assignment?.title || "assignments"}-${assignmentId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ title: "Download started", description: "Downloading all submissions as ZIP." });
    } catch {
      toast({ title: "Download failed", description: "Could not download submissions.", variant: "destructive" });
    }
  };

  if (isLoadingAssignment || isLoadingSubmissions) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/teacher/assignments">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assignments
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="text-sm">Loading submissions...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex flex-col gap-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/teacher/assignments">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignments
          </Link>
        </Button>
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
          <FileText className="h-12 w-12" />
          <h3 className="text-lg font-semibold">Assignment not found</h3>
          <p className="text-sm">The requested assignment could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/teacher/assignments">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Assignments
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{assignment.title}</h1>
          <p className="text-sm text-muted-foreground">
            Manage and grade student submissions • {assignment.className}
          </p>
        </div>
        <Button variant="outline" onClick={handleDownloadAll} disabled={downloadMutation.isPending || submissions.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          {downloadMutation.isPending ? "Downloading..." : "Download All"}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          title="Total Submissions"
          value={totalSubmissions}
          subtitle={`${counts.submitted} submitted`}
          icon={<Users className="h-4 w-4" />}
        />
        <DashboardStat
          title="Graded"
          value={totalGraded}
          subtitle="completed reviews"
          icon={<CheckCircle className="h-4 w-4" />}
          trend={
            totalSubmissions > 0
              ? { value: `${gradingPct}% graded`, positive: true }
              : undefined
          }
        />
        <DashboardStat
          title="Pending"
          value={totalPending}
          subtitle="awaiting grading"
          icon={<Clock className="h-4 w-4" />}
        />
        <DashboardStat
          title="Late"
          value={totalLate}
          subtitle="past due date"
          icon={<AlertCircle className="h-4 w-4" />}
          trend={totalLate > 0 ? { value: `${totalLate} late`, positive: false } : undefined}
        />
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Submissions</CardTitle>
              <CardDescription>{submissions.length} submission(s) found</CardDescription>
            </div>
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          {/* Status Tabs */}
          <div className="px-6 pt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
                <TabsTrigger value="submitted">Submitted ({counts.submitted})</TabsTrigger>
                <TabsTrigger value="graded">Graded ({counts.graded})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
                <TabsTrigger value="late">Late ({counts.late})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Submissions List */}
            <div className="border-r p-6">
              <h3 className="font-semibold mb-4">Student Submissions</h3>
              {submissions.length > 0 ? (
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                  {submissions.map((submission) => (
                    <SubmissionCard
                      key={submission.id}
                      submission={submission}
                      selected={selectedSubmissionId === submission.id}
                      onSelect={() => setSelectedSubmissionId(submission.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                  <Users className="h-8 w-8" />
                  <p className="text-sm">No submissions found</p>
                  <p className="text-xs">Try adjusting your filters or search query</p>
                </div>
              )}
            </div>

            {/* Grading Panel */}
            <div className="p-6">
              <h3 className="font-semibold mb-4">Grading</h3>
              {selectedSubmission ? (
                <div className="max-h-[600px] overflow-y-auto pr-2">
                  <GradingInterface
                    submission={selectedSubmission}
                    onUpdate={() => {
                      setSelectedSubmissionId(null);
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground border rounded-lg">
                  <FileText className="h-8 w-8" />
                  <p className="text-sm">Select a submission to start grading</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
