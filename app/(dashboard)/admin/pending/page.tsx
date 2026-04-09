"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Users,
  AlertCircle,
  XCircle,
} from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAllSubmissions } from "@/lib/hooks/queries/useSubmissions";
import { useToast } from "@/hooks/use-toast";
import type { Submission, SubmissionStatus } from "@/lib/types/assignment";

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

// ─── Submission Row Component ─────────────────────────────────────────
function SubmissionRow({
  submission,
  onView,
}: {
  submission: Submission;
  onView: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
            {getInitials(submission.studentName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate">{submission.studentName}</p>
            {submission.isLate && (
              <Badge variant="outline" className="text-[10px] border-red-500/30 text-red-500 shrink-0">
                Late
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{submission.studentEmail}</p>
          <p className="text-sm text-muted-foreground mt-1">{submission.assignmentName || "—"}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-muted-foreground">Submitted</p>
          <p className="text-sm">{formatDate(submission.submittedAt)}</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs text-muted-foreground">Status</p>
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                submission.status === "submitted"
                  ? "bg-blue-500"
                  : submission.status === "pending"
                    ? "bg-amber-500"
                    : submission.status === "late"
                      ? "bg-red-500"
                      : "bg-muted"
              }`}
            />
            <span className="text-sm capitalize">{submission.status}</span>
          </div>
        </div>
        <Button size="icon-sm" variant="ghost" onClick={onView} title="Review">
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function PendingReviewPage() {
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  // Fetch only pending/submitted submissions
  const { data: allSubmissions = [], isLoading } = useAllSubmissions({});

  // Filter to only pending review items
  const pendingSubmissions = allSubmissions.filter(
    (s) => s.status === "pending" || s.status === "submitted" || s.status === "late"
  );

  const filtered = pendingSubmissions.filter((s) => {
    if (activeTab !== "all") {
      if (activeTab === "late") return s.isLate || s.status === "late";
      return s.status === activeTab;
    }
    if (search) {
      const q = search.toLowerCase();
      return (
        s.studentName.toLowerCase().includes(q) ||
        s.studentEmail.toLowerCase().includes(q) ||
        (s.assignmentName || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Counts
  const counts = {
    all: pendingSubmissions.length,
    pending: pendingSubmissions.filter((s) => s.status === "pending").length,
    submitted: pendingSubmissions.filter((s) => s.status === "submitted").length,
    late: pendingSubmissions.filter((s) => s.isLate || s.status === "late").length,
  };

  const totalPending = counts.pending + counts.submitted;
  const totalLate = counts.late;

  const handleView = (submission: Submission) => {
    toast({
      title: "Opening submission",
      description: `${submission.studentName}'s submission for ${submission.assignmentName}`,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pending Review</h1>
        <p className="text-sm text-muted-foreground">
          Review and grade student submissions awaiting your attention.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          title="Pending Review"
          value={totalPending}
          subtitle="awaiting grading"
          icon={<Clock className="h-4 w-4" />}
        />
        <DashboardStat
          title="Submitted"
          value={counts.submitted}
          subtitle="ready to grade"
          icon={<FileText className="h-4 w-4" />}
        />
        <DashboardStat
          title="Late Submissions"
          value={totalLate}
          subtitle="past due date"
          icon={<AlertCircle className="h-4 w-4" />}
          trend={totalLate > 0 ? { value: `${totalLate} late`, positive: false } : undefined}
        />
        <DashboardStat
          title="Avg Wait Time"
          value="2.3h"
          subtitle="estimated"
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Submissions Queue</CardTitle>
              <CardDescription>
                {isLoading ? "Loading..." : `${filtered.length} submission(s) pending review`}
              </CardDescription>
            </div>
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students or assignments..."
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
                <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
                <TabsTrigger value="submitted">Submitted ({counts.submitted})</TabsTrigger>
                <TabsTrigger value="late">Late ({counts.late})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Submissions List */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span className="text-sm">Loading submissions...</span>
              </div>
            ) : filtered.length > 0 ? (
              <div className="space-y-3">
                {filtered.map((submission) => (
                  <SubmissionRow
                    key={submission.id}
                    submission={submission}
                    onView={() => handleView(submission)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                <CheckCircle className="h-12 w-12 text-emerald-500" />
                <p className="text-lg font-medium text-foreground">All caught up!</p>
                <p className="text-sm">No submissions pending review</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {pendingSubmissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Batch operations for pending submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <Button variant="outline" className="justify-start h-auto py-4">
                <CheckCircle className="mr-2 h-5 w-5 text-emerald-500" />
                <div className="text-left">
                  <p className="font-medium">Mark All as Reviewed</p>
                  <p className="text-xs text-muted-foreground">Bulk approve pending submissions</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4">
                <Clock className="mr-2 h-5 w-5 text-amber-500" />
                <div className="text-left">
                  <p className="font-medium">Set Reminder</p>
                  <p className="text-xs text-muted-foreground">Get notified of late submissions</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4">
                <FileText className="mr-2 h-5 w-5 text-blue-500" />
                <div className="text-left">
                  <p className="font-medium">Export Queue</p>
                  <p className="text-xs text-muted-foreground">Download pending list as CSV</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
