"use client";

import * as React from "react";
import {
  Search,
  Filter,
  Eye,
  Download,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  FileText,
  Users,
  Loader2,
  ChevronDown,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GradingInterface } from "@/components/assignments/GradingInterface";
import { useAllSubmissions } from "@/lib/hooks/queries/useSubmissions";
import { Submission, SubmissionFilters, SubmissionStatus } from "@/lib/types/assignment";

// --- Helper Components ---

function StatusBadge({ status }: { status: SubmissionStatus | string }) {
  const variants: Record<string, string> = {
    pending: "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-500/30",
    submitted: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30",
    graded: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30",
    returned: "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:bg-violet-500/20 dark:text-violet-400 dark:border-violet-500/30",
    late: "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
  };

  return (
    <Badge className={`capitalize ${variants[status] || variants.pending}`}>
      {status}
    </Badge>
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-purple-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

// --- Submissions Table Row ---

function SubmissionRow({
  submission,
  selected,
  onSelect,
  onView,
  onDownloadFiles,
}: {
  submission: Submission;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onView: () => void;
  onDownloadFiles: () => void;
}) {
  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect(checked as boolean)}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor(submission.studentName)}`}
          >
            {getInitials(submission.studentName)}
          </div>
          <div>
            <p className="font-medium text-sm text-slate-800 dark:text-white">
              {submission.studentName}
            </p>
            <p className="text-xs text-slate-400">{submission.studentEmail}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {submission.assignmentName ?? "—"}
        </p>
      </TableCell>
      <TableCell className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {formatDate(submission.submittedAt)}
      </TableCell>
      <TableCell className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {submission.status === "graded" || submission.status === "returned" ? (
          <span className="font-medium">
            {submission.grade} / {submission.maxPoints}
          </span>
        ) : (
          <span className="text-slate-400">—</span>
        )}
      </TableCell>
      <TableCell>
        {submission.files.length > 0 ? (
          <div className="space-y-0.5">
            {submission.files.map((f) => (
              <p
                key={f.id}
                className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]"
                title={f.fileName}
              >
                {f.fileName}
              </p>
            ))}
          </div>
        ) : (
          <span className="text-xs text-slate-400">No files</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <StatusBadge status={submission.status} />
          {submission.isLate && (
            <Badge
              variant="outline"
              className="text-xs border-red-500/30 text-red-600 dark:text-red-400"
            >
              Late
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="View & Grade"
            onClick={onView}
          >
            <Eye className="h-3.5 w-3.5 text-slate-500" />
          </Button>
          {submission.files.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Download Files"
              onClick={onDownloadFiles}
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

// --- Main Page ---

export default function AdminSubmissionsPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<SubmissionStatus | "all">("all");
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set());
  const [selectedSubmission, setSelectedSubmission] = React.useState<Submission | null>(null);
  const [activeTab, setActiveTab] = React.useState("all");

  const filters: SubmissionFilters = {
    status: statusFilter === "all" ? undefined : statusFilter,
    search: search || undefined,
  };

  const { data, isLoading, isError } = useAllSubmissions(filters);

  const submissions = (data && data.length > 0) ? data : [];

  // Derive tab counts
  const counts = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    submitted: submissions.filter((s) => s.status === "submitted").length,
    graded: submissions.filter((s) => s.status === "graded").length,
    late: submissions.filter((s) => s.isLate || s.status === "late").length,
    returned: submissions.filter((s) => s.status === "returned").length,
  };

  const filtered = submissions.filter((s) => {
    const matchTab =
      activeTab === "all" ||
      activeTab === "late"
        ? activeTab === "late"
          ? s.isLate || s.status === "late"
          : true
        : s.status === activeTab;
    return matchTab;
  });

  const isAllSelected = filtered.length > 0 && filtered.every((s) => selectedIds.has(s.id));

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filtered.map((s) => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelect = (id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleExportCSV = () => {
    const dataToExport = selectedIds.size > 0
      ? filtered.filter((s) => selectedIds.has(s.id))
      : filtered;

    const headers = ["Student Name", "Student Email", "Assignment", "Status", "Submitted", "Graded At", "Grade", "Max Points", "Late", "Feedback"];
    const rows = dataToExport.map((s) => [
      s.studentName,
      s.studentEmail,
      s.assignmentName ?? "—",
      s.status,
      formatDate(s.submittedAt),
      formatDate(s.gradedAt),
      s.grade?.toString() ?? "—",
      s.maxPoints.toString(),
      s.isLate ? "Yes" : "No",
      s.feedback ?? "—",
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `submissions_${activeTab}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSelected = () => {
    const selectedSubmissions = submissions.filter((s) => selectedIds.has(s.id));
    selectedSubmissions.forEach((s) => {
      s.files.forEach((f) => {
        const a = document.createElement("a");
        a.href = f.fileUrl;
        a.download = f.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    });
  };

  const handleDownloadFiles = (submission: Submission) => {
    submission.files.forEach((f) => {
      const a = document.createElement("a");
      a.href = f.fileUrl;
      a.download = f.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
            All Submissions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor, review, and manage all student submissions platform-wide.
          </p>
        </div>
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <Button variant="outline" className="gap-2" onClick={handleDownloadSelected}>
              <Download className="h-4 w-4" />
              Download Selected ({selectedIds.size})
            </Button>
          )}
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            <BarChart3 className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg p-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{counts.all}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg p-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{counts.pending}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{counts.submitted}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Submitted</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{counts.graded}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Graded</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg p-2 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
              <RotateCcw className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{counts.returned}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Returned</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{counts.late}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Late</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search students, emails, or assignments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as SubmissionStatus | "all")}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="graded">Graded</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="late">Late</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs + Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Submissions</CardTitle>
              <CardDescription>
                {isLoading ? (
                  "Loading submissions..."
                ) : (
                  <>
                    {filtered.length} submission{filtered.length !== 1 ? "s" : ""} found
                    {selectedIds.size > 0 && ` · ${selectedIds.size} selected`}
                  </>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6 pt-2 pb-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
              <TabsTrigger value="submitted">Submitted ({counts.submitted})</TabsTrigger>
              <TabsTrigger value="graded">Graded ({counts.graded})</TabsTrigger>
              <TabsTrigger value="late">Late ({counts.late})</TabsTrigger>
              <TabsTrigger value="returned">Returned ({counts.returned})</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-16 text-slate-500">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Failed to load submissions.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={(checked) => toggleSelectAll(checked as boolean)}
                    />
                  </TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Files</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-slate-500">
                      {search || statusFilter !== "all" || activeTab !== "all"
                        ? "No submissions match your filters."
                        : "No submissions found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s) => (
                    <SubmissionRow
                      key={s.id}
                      submission={s}
                      selected={selectedIds.has(s.id)}
                      onSelect={(checked) => toggleSelect(s.id, checked)}
                      onView={() => setSelectedSubmission(s)}
                      onDownloadFiles={() => handleDownloadFiles(s)}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Grading Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-500" />
              View Submission
            </DialogTitle>
            <DialogDescription>
              {selectedSubmission?.studentName} — {selectedSubmission?.assignmentName}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <GradingInterface
              submission={selectedSubmission}
              onUpdate={() => {
                setSelectedSubmission(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
