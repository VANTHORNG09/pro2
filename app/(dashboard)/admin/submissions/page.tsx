"use client";

import { useState } from "react";
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
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

import { useAllSubmissions } from "@/lib/hooks/queries/useSubmissions";
import { useToast } from "@/hooks/use-toast";
import { GradingInterface } from "@/components/assignments/GradingInterface";
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
function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function AdminSubmissionsPage() {
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "all">("all");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const filters = {
    status: statusFilter === "all" ? undefined : statusFilter,
    search: search || undefined,
  };

  const { data: submissions = [], isLoading, isError } = useAllSubmissions(filters);

  // Derive counts
  const counts = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    submitted: submissions.filter((s) => s.status === "submitted").length,
    graded: submissions.filter((s) => s.status === "graded").length,
    late: submissions.filter((s) => s.isLate || s.status === "late").length,
    returned: submissions.filter((s) => s.status === "returned").length,
  };

  const totalSubmissions = submissions.length;
  const totalGraded = submissions.filter((s) => s.grade !== null && s.grade !== undefined).length;
  const totalPending = submissions.filter((s) => s.status === "pending" || s.status === "submitted").length;
  const totalLate = counts.late;
  const totalReturned = counts.returned;

  // Filter by active tab
  const filtered = submissions.filter((s) => {
    if (activeTab === "late") return s.isLate || s.status === "late";
    if (activeTab === "all") return true;
    return s.status === activeTab;
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

    toast({ title: "Export complete", description: `Exported ${dataToExport.length} submissions to CSV.` });
  };

  const handleDownloadSelected = () => {
    const selectedSubmissions = submissions.filter((s) => selectedIds.has(s.id));
    let downloaded = 0;
    selectedSubmissions.forEach((s) => {
      s.files.forEach((f) => {
        const a = document.createElement("a");
        a.href = f.fileUrl;
        a.download = f.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        downloaded++;
      });
    });
    toast({ title: "Download started", description: `Downloading ${downloaded} file(s).` });
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
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Submissions</h1>
          <p className="text-sm text-muted-foreground">
            Monitor, review, and manage all student submissions platform-wide.
          </p>
        </div>
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <Button variant="outline" onClick={handleDownloadSelected}>
              <Download className="mr-2 h-4 w-4" />
              Download Selected ({selectedIds.size})
            </Button>
          )}
          <Button variant="outline" onClick={handleExportCSV}>
            <FileText className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <DashboardStat
          title="Total Submissions"
          value={totalSubmissions}
          subtitle="all statuses"
          icon={<FileText className="h-4 w-4" />}
        />
        <DashboardStat
          title="Graded"
          value={totalGraded}
          subtitle="completed reviews"
          icon={<CheckCircle2 className="h-4 w-4" />}
          trend={
            totalSubmissions > 0
              ? { value: `${Math.round((totalGraded / totalSubmissions) * 100)}% graded`, positive: true }
              : undefined
          }
        />
        <DashboardStat
          title="Pending"
          value={totalPending}
          subtitle="awaiting review"
          icon={<Clock className="h-4 w-4" />}
        />
        <DashboardStat
          title="Late"
          value={totalLate}
          subtitle="past due date"
          icon={<AlertTriangle className="h-4 w-4" />}
          trend={totalLate > 0 ? { value: `${totalLate} late`, positive: false } : undefined}
        />
        <DashboardStat
          title="Returned"
          value={totalReturned}
          subtitle="sent back to student"
          icon={<RotateCcw className="h-4 w-4" />}
        />
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Submissions</CardTitle>
              <CardDescription>
                {isLoading ? (
                  "Loading submissions..."
                ) : (
                  <>
                    {filtered.length} submission(s) found
                    {selectedIds.size > 0 && ` · ${selectedIds.size} selected`}
                  </>
                )}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search students or assignments..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as SubmissionStatus | "all")}>
                <SelectTrigger className="w-[140px]">
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
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          {/* Status Tabs */}
          <div className="px-6 pt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
                <TabsTrigger value="submitted">Submitted ({counts.submitted})</TabsTrigger>
                <TabsTrigger value="graded">Graded ({counts.graded})</TabsTrigger>
                <TabsTrigger value="late">Late ({counts.late})</TabsTrigger>
                <TabsTrigger value="returned">Returned ({counts.returned})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Table */}
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 pl-6">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={(checked) => toggleSelectAll(checked as boolean)}
                    />
                  </TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead className="hidden md:table-cell">Submitted</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px] text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span className="text-sm">Loading submissions...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-destructive">
                        <AlertTriangle className="h-8 w-8" />
                        <p className="text-sm">Failed to load submissions</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filtered.length > 0 ? (
                  filtered.map((s) => (
                    <TableRow key={s.id} className="hover:bg-muted/50">
                      <TableCell className="pl-6">
                        <Checkbox
                          checked={selectedIds.has(s.id)}
                          onCheckedChange={(checked) => toggleSelect(s.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                              {getInitials(s.studentName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{s.studentName}</p>
                            <p className="truncate text-xs text-muted-foreground">{s.studentEmail}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm truncate max-w-[200px]">{s.assignmentName || "—"}</p>
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell whitespace-nowrap">
                        {formatDate(s.submittedAt)}
                      </TableCell>
                      <TableCell>
                        {s.grade !== null && s.grade !== undefined ? (
                          <span className="text-sm font-medium">
                            {s.grade} / {s.maxPoints}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              s.status === "graded"
                                ? "bg-emerald-500"
                                : s.status === "submitted"
                                  ? "bg-blue-500"
                                  : s.status === "late" || s.isLate
                                    ? "bg-red-500"
                                    : s.status === "returned"
                                      ? "bg-violet-500"
                                      : "bg-muted"
                            }`}
                          />
                          <span className="text-sm capitalize">{s.status}</span>
                          {s.isLate && s.status !== "late" && (
                            <Badge variant="outline" className="text-xs border-red-500/30 text-red-500">
                              Late
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => setSelectedSubmission(s)}
                            title="View & Grade"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {s.files.length > 0 && (
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => handleDownloadFiles(s)}
                              title="Download Files"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <FileText className="h-8 w-8" />
                        <p className="text-sm">No submissions found</p>
                        <p className="text-xs">Try adjusting your filters or search query</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ─── Grading Dialog ─────────────────────────────────────────── */}
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
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
