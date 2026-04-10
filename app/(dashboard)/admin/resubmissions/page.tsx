"use client";

import * as React from "react";
import {
  RotateCcw,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  FileText,
  AlertTriangle,
  Calendar,
  MessageSquare,
  Download,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// --- Types ---

type ResubmissionReason = "technical_issue" | "poor_quality" | "plagiarism" | "incomplete" | "late_submission" | "other";
type ResubmissionStatus = "pending" | "approved" | "rejected" | "completed";

interface Resubmission {
  id: string;
  student: string;
  email: string;
  assignment: string;
  class: string;
  originalSubmissionDate: string;
  requestDate: string;
  deadline?: string;
  reason: ResubmissionReason;
  studentExplanation: string;
  status: ResubmissionStatus;
  originalGrade?: number;
  maxPoints?: number;
  resubmittedFile?: { name: string; size: string; date: string };
  reviewedBy?: string;
  reviewNotes?: string;
}

// --- Mock Data ---

const mockResubmissions: Resubmission[] = [
  {
    id: "R001",
    student: "Morgan Lee",
    email: "morgan@assignbridge.com",
    assignment: "Database Design Project",
    class: "CS-350",
    originalSubmissionDate: "2026-04-05",
    requestDate: "2026-04-08",
    deadline: "2026-04-15",
    reason: "technical_issue",
    studentExplanation: "My file upload failed due to a network issue and I didn't receive confirmation. I have the file ready to resubmit.",
    status: "pending",
    originalGrade: 0,
    maxPoints: 100,
  },
  {
    id: "R002",
    student: "Jamie Foster",
    email: "jamie@assignbridge.com",
    assignment: "React Portfolio",
    class: "CS-301",
    originalSubmissionDate: "2026-04-03",
    requestDate: "2026-04-06",
    deadline: "2026-04-13",
    reason: "poor_quality",
    studentExplanation: "After reviewing the feedback, I realized my portfolio was missing the responsive design requirement. I've rebuilt it with mobile-first approach.",
    status: "approved",
    originalGrade: 45,
    maxPoints: 100,
    resubmittedFile: { name: "portfolio_v2.zip", size: "5.2 MB", date: "2026-04-10" },
  },
  {
    id: "R003",
    student: "Drew Martinez",
    email: "drew@assignbridge.com",
    assignment: "Sorting Algorithms",
    class: "CS-401",
    originalSubmissionDate: "2026-04-01",
    requestDate: "2026-04-04",
    deadline: "2026-04-11",
    reason: "plagiarism",
    studentExplanation: "I was flagged for similarity but I can prove my code is original. I'd like to resubmit with additional comments explaining my approach.",
    status: "pending",
    originalGrade: 0,
    maxPoints: 100,
  },
  {
    id: "R004",
    student: "Avery Johnson",
    email: "avery@assignbridge.com",
    assignment: "ML Model Training",
    class: "CS-450",
    originalSubmissionDate: "2026-03-28",
    requestDate: "2026-03-30",
    deadline: "2026-04-06",
    reason: "incomplete",
    studentExplanation: "I forgot to include the training logs and model evaluation metrics. I have them all ready now.",
    status: "completed",
    originalGrade: 55,
    maxPoints: 100,
    resubmittedFile: { name: "model_complete.zip", size: "1.1 MB", date: "2026-04-05" },
    reviewedBy: "Dr. Sarah Johnson",
    reviewNotes: "Resubmission accepted. New grade: 82/100.",
  },
  {
    id: "R005",
    student: "Quinn Taylor",
    email: "quinn@assignbridge.com",
    assignment: "Calculus Problem Set 5",
    class: "MATH-101",
    originalSubmissionDate: "2026-04-02",
    requestDate: "2026-04-05",
    reason: "late_submission",
    studentExplanation: "I had a medical emergency and couldn't submit on time. I can provide a doctor's note.",
    status: "rejected",
    originalGrade: 0,
    maxPoints: 50,
    reviewedBy: "Prof. Michael Chen",
    reviewNotes: "Late submission policy enforced. Please contact the academic office for medical exceptions.",
  },
  {
    id: "R006",
    student: "Blake Anderson",
    email: "blake@assignbridge.com",
    assignment: "OOP Design Patterns",
    class: "CS-202",
    originalSubmissionDate: "2026-04-01",
    requestDate: "2026-04-03",
    deadline: "2026-04-10",
    reason: "other",
    studentExplanation: "I used the wrong design patterns for the assignment requirements. I've reviewed the feedback and want to demonstrate my understanding with the correct patterns.",
    status: "approved",
    originalGrade: 40,
    maxPoints: 100,
    resubmittedFile: { name: "patterns_corrected.java", size: "14 KB", date: "2026-04-09" },
  },
];

// --- Config ---

const reasonConfig: Record<ResubmissionReason, { label: string; icon: typeof AlertTriangle; color: string }> = {
  technical_issue: { label: "Technical Issue", icon: AlertTriangle, color: "text-amber-500" },
  poor_quality: { label: "Poor Quality", icon: FileText, color: "text-orange-500" },
  plagiarism: { label: "Plagiarism Review", icon: AlertTriangle, color: "text-red-500" },
  incomplete: { label: "Incomplete Submission", icon: FileText, color: "text-yellow-500" },
  late_submission: { label: "Late Submission", icon: Clock, color: "text-blue-500" },
  other: { label: "Other", icon: MessageSquare, color: "text-slate-500" },
};

const statusConfig: Record<ResubmissionStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  approved: { label: "Approved", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  rejected: { label: "Rejected", color: "bg-red-500/10 text-red-700 dark:text-red-400" },
  completed: { label: "Completed", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
};

// --- Main Page ---

export default function ResubmissionsPage() {
  const [resubmissions, setResubmissions] = React.useState<Resubmission[]>(mockResubmissions);
  const [search, setSearch] = React.useState("");
  const [reasonFilter, setReasonFilter] = React.useState<ResubmissionReason | "all">("all");
  const [statusFilter, setStatusFilter] = React.useState<ResubmissionStatus | "all">("all");
  const [selectedResubmission, setSelectedResubmission] = React.useState<Resubmission | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = React.useState(false);
  const [reviewAction, setReviewAction] = React.useState<ResubmissionStatus>("approved");
  const [reviewNotes, setReviewNotes] = React.useState("");
  const [deadline, setDeadline] = React.useState("");

  const filteredResubmissions = resubmissions.filter((r) => {
    if (reasonFilter !== "all" && r.reason !== reasonFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.student.toLowerCase().includes(q) ||
        r.assignment.toLowerCase().includes(q) ||
        r.class.toLowerCase().includes(q) ||
        r.studentExplanation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: resubmissions.length,
    pending: resubmissions.filter((r) => r.status === "pending").length,
    approved: resubmissions.filter((r) => r.status === "approved").length,
    rejected: resubmissions.filter((r) => r.status === "rejected").length,
    completed: resubmissions.filter((r) => r.status === "completed").length,
  };

  const handleReview = (resubmission: Resubmission) => {
    setSelectedResubmission(resubmission);
    setReviewAction(resubmission.status === "pending" ? "approved" : resubmission.status);
    setReviewNotes(resubmission.reviewNotes || "");
    setDeadline(resubmission.deadline || "");
    setIsReviewDialogOpen(true);
  };

  const handleReviewSubmit = () => {
    if (!selectedResubmission) return;
    setResubmissions((prev) =>
      prev.map((r) =>
        r.id === selectedResubmission.id
          ? { ...r, status: reviewAction, reviewedBy: "Admin User", reviewNotes, deadline: deadline || undefined }
          : r
      )
    );
    toast.success(`Resubmission ${selectedResubmission.id} ${statusConfig[reviewAction].label.toLowerCase()}`);
    setIsReviewDialogOpen(false);
    setSelectedResubmission(null);
    setReviewNotes("");
    setDeadline("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resubmissions</h1>
          <p className="text-sm text-muted-foreground">
            Manage student resubmission requests and track resubmission deadlines.
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-500/10 p-3">
              <RotateCcw className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Requests</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-amber-500/10 p-3">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-emerald-500/10 p-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.approved}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-red-500/10 p-3">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.rejected}</p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-violet-500/10 p-3">
              <CheckCircle2 className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search resubmissions..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={reasonFilter} onValueChange={(v) => setReasonFilter(v as ResubmissionReason | "all")}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                <SelectItem value="technical_issue">Technical Issue</SelectItem>
                <SelectItem value="poor_quality">Poor Quality</SelectItem>
                <SelectItem value="plagiarism">Plagiarism Review</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
                <SelectItem value="late_submission">Late Submission</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ResubmissionStatus | "all")}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs and Table */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <ResubmissionsTable submissions={filteredResubmissions} onReview={handleReview} />
            </TabsContent>
            <TabsContent value="pending" className="mt-0">
              <ResubmissionsTable submissions={filteredResubmissions.filter((r) => r.status === "pending")} onReview={handleReview} />
            </TabsContent>
            <TabsContent value="approved" className="mt-0">
              <ResubmissionsTable submissions={filteredResubmissions.filter((r) => r.status === "approved")} onReview={handleReview} />
            </TabsContent>
            <TabsContent value="rejected" className="mt-0">
              <ResubmissionsTable submissions={filteredResubmissions.filter((r) => r.status === "rejected")} onReview={handleReview} />
            </TabsContent>
            <TabsContent value="completed" className="mt-0">
              <ResubmissionsTable submissions={filteredResubmissions.filter((r) => r.status === "completed")} onReview={handleReview} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        {selectedResubmission && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Review Resubmission Request
              </DialogTitle>
              <DialogDescription>
                Review the resubmission request from {selectedResubmission.student}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Student</p>
                  <p className="text-sm font-medium">{selectedResubmission.student}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assignment</p>
                  <p className="text-sm font-medium">{selectedResubmission.assignment}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Class</p>
                  <p className="text-sm font-medium">{selectedResubmission.class}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Original Grade</p>
                  <p className="text-sm font-medium">
                    {selectedResubmission.originalGrade ? `${selectedResubmission.originalGrade}/${selectedResubmission.maxPoints}` : "Not graded"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Original Submission</p>
                  <p className="text-sm font-medium">{selectedResubmission.originalSubmissionDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Request Date</p>
                  <p className="text-sm font-medium">{selectedResubmission.requestDate}</p>
                </div>
              </div>

              {/* Reason */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <div className="flex items-start gap-2">
                  {React.createElement(reasonConfig[selectedResubmission.reason].icon, { className: "mt-0.5 h-4 w-4 text-amber-500" })}
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-400">Reason: {reasonConfig[selectedResubmission.reason].label}</p>
                    <p className="mt-1 text-sm text-amber-700 dark:text-amber-500">{selectedResubmission.studentExplanation}</p>
                  </div>
                </div>
              </div>

              {/* Deadline (for approved) */}
              {reviewAction === "approved" && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Resubmission Deadline</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Review Action */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Review Action</label>
                <Select value={reviewAction} onValueChange={(v) => setReviewAction(v as ResubmissionStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approve Resubmission</SelectItem>
                    <SelectItem value="rejected">Reject Request</SelectItem>
                    <SelectItem value="completed">Mark as Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Review Notes */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Review Notes</label>
                <Textarea
                  placeholder="Add notes about this review..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReviewSubmit}>
                Submit Review
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

// --- Table Component ---

function ResubmissionsTable({
  submissions,
  onReview,
}: {
  submissions: Resubmission[];
  onReview: (submission: Resubmission) => void;
}) {
  if (!submissions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Filter className="mb-3 h-10 w-10 opacity-50" />
        <p className="text-sm">No resubmission requests match the current filters.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Student</TableHead>
          <TableHead>Assignment</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Request Date</TableHead>
          <TableHead>Deadline</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((r) => {
          const reasonCfg = reasonConfig[r.reason];
          const ReasonIcon = reasonCfg.icon;
          const statusCfg = statusConfig[r.status];

          return (
            <TableRow key={r.id}>
              <TableCell className="font-mono text-sm">{r.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{r.student}</p>
                    <p className="text-xs text-muted-foreground">{r.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm font-medium">{r.assignment}</p>
                  <p className="text-xs text-muted-foreground">{r.class}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <ReasonIcon className={`h-4 w-4 ${reasonCfg.color}`} />
                  <span className="text-sm">{reasonCfg.label}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{r.requestDate}</TableCell>
              <TableCell className="text-sm">{r.deadline || "—"}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusCfg.color}>
                  {statusCfg.label}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onReview(r)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
