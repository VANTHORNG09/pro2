"use client";

import * as React from "react";
import {
  Flag,
  Search,
  Filter,
  AlertTriangle,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  FileText,
  Download,
  RotateCcw,
  Ban,
  Info,
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

type FlagType = "plagiarism" | "late" | "suspicious" | "incomplete" | "duplicate" | "policy_violation";
type FlagStatus = "pending" | "resolved" | "dismissed" | "escalated";

interface FlaggedSubmission {
  id: string;
  student: string;
  email: string;
  assignment: string;
  class: string;
  flagType: FlagType;
  flagReason: string;
  flaggedDate: string;
  status: FlagStatus;
  submittedDate: string;
  similarity?: number;
  files: { name: string; size: string }[];
  reviewedBy?: string;
  reviewNotes?: string;
}

// --- Mock Data ---

const mockFlaggedSubmissions: FlaggedSubmission[] = [
  {
    id: "F001",
    student: "Alex Thompson",
    email: "alex@assignbridge.com",
    assignment: "Database Design Project",
    class: "CS-350",
    flagType: "plagiarism",
    flagReason: "High similarity detected with another student's submission (92% match)",
    flaggedDate: "2026-04-10",
    status: "pending",
    submittedDate: "2026-04-09",
    similarity: 92,
    files: [{ name: "schema.sql", size: "2.3 KB" }],
  },
  {
    id: "F002",
    student: "Jordan Rivera",
    email: "jordan@assignbridge.com",
    assignment: "React Portfolio",
    class: "CS-301",
    flagType: "suspicious",
    flagReason: "Submission time anomaly detected - submitted within 2 minutes of assignment release",
    flaggedDate: "2026-04-10",
    status: "pending",
    submittedDate: "2026-04-10",
    files: [{ name: "portfolio.zip", size: "4.1 MB" }],
  },
  {
    id: "F003",
    student: "Casey Morgan",
    email: "casey@assignbridge.com",
    assignment: "ML Model Training",
    class: "CS-450",
    flagType: "incomplete",
    flagReason: "Missing required model weights file and training logs",
    flaggedDate: "2026-04-09",
    status: "resolved",
    submittedDate: "2026-04-08",
    files: [{ name: "model.ipynb", size: "256 KB" }],
    reviewedBy: "Admin User",
    reviewNotes: "Student clarified that weights were too large to upload. Accepted alternative submission.",
  },
  {
    id: "F004",
    student: "Sam Kim",
    email: "sam@assignbridge.com",
    assignment: "Sorting Algorithms",
    class: "CS-401",
    flagType: "duplicate",
    flagReason: "Identical code submitted by two different students",
    flaggedDate: "2026-04-08",
    status: "escalated",
    submittedDate: "2026-04-07",
    files: [{ name: "sorting.java", size: "8.5 KB" }],
    reviewedBy: "Dr. Sarah Johnson",
    reviewNotes: "Escalated to academic integrity committee for review.",
  },
  {
    id: "F005",
    student: "Taylor Chen",
    email: "taylor@assignbridge.com",
    assignment: "Calculus Problem Set 5",
    class: "MATH-101",
    flagType: "late",
    flagReason: "Submitted 3 days past deadline without extension request",
    flaggedDate: "2026-04-07",
    status: "pending",
    submittedDate: "2026-04-07",
    files: [{ name: "solutions.pdf", size: "1.8 MB" }],
  },
  {
    id: "F006",
    student: "Riley Patel",
    email: "riley@assignbridge.com",
    assignment: "OOP Design Patterns",
    class: "CS-202",
    flagType: "policy_violation",
    flagReason: "Used prohibited external library (ChatGPT-generated code detected)",
    flaggedDate: "2026-04-06",
    status: "resolved",
    submittedDate: "2026-04-05",
    similarity: 78,
    files: [{ name: "patterns.java", size: "12 KB" }],
    reviewedBy: "Prof. Michael Chen",
    reviewNotes: "Warning issued. Student asked to resubmit without AI-generated code.",
  },
];

// --- Config ---

const flagTypeConfig: Record<FlagType, { label: string; icon: typeof AlertTriangle; color: string }> = {
  plagiarism: { label: "Plagiarism", icon: AlertTriangle, color: "text-red-500" },
  late: { label: "Late Submission", icon: Clock, color: "text-amber-500" },
  suspicious: { label: "Suspicious", icon: Flag, color: "text-orange-500" },
  incomplete: { label: "Incomplete", icon: FileText, color: "text-yellow-500" },
  duplicate: { label: "Duplicate", icon: RotateCcw, color: "text-purple-500" },
  policy_violation: { label: "Policy Violation", icon: Ban, color: "text-red-600" },
};

const statusConfig: Record<FlagStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  resolved: { label: "Resolved", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  dismissed: { label: "Dismissed", color: "bg-slate-500/10 text-slate-700 dark:text-slate-400" },
  escalated: { label: "Escalated", color: "bg-red-500/10 text-red-700 dark:text-red-400" },
};

// --- Main Page ---

export default function FlaggedSubmissionsPage() {
  const [flaggedSubmissions, setFlaggedSubmissions] = React.useState<FlaggedSubmission[]>(mockFlaggedSubmissions);
  const [search, setSearch] = React.useState("");
  const [flagTypeFilter, setFlagTypeFilter] = React.useState<FlagType | "all">("all");
  const [statusFilter, setStatusFilter] = React.useState<FlagStatus | "all">("all");
  const [selectedSubmission, setSelectedSubmission] = React.useState<FlaggedSubmission | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = React.useState(false);
  const [reviewNotes, setReviewNotes] = React.useState("");
  const [reviewAction, setReviewAction] = React.useState<FlagStatus>("resolved");

  const filteredSubmissions = flaggedSubmissions.filter((sub) => {
    if (flagTypeFilter !== "all" && sub.flagType !== flagTypeFilter) return false;
    if (statusFilter !== "all" && sub.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        sub.student.toLowerCase().includes(q) ||
        sub.assignment.toLowerCase().includes(q) ||
        sub.class.toLowerCase().includes(q) ||
        sub.flagReason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: flaggedSubmissions.length,
    pending: flaggedSubmissions.filter((s) => s.status === "pending").length,
    resolved: flaggedSubmissions.filter((s) => s.status === "resolved").length,
    escalated: flaggedSubmissions.filter((s) => s.status === "escalated").length,
    plagiarism: flaggedSubmissions.filter((s) => s.flagType === "plagiarism").length,
  };

  const handleReviewSubmission = (submission: FlaggedSubmission) => {
    setSelectedSubmission(submission);
    setReviewNotes(submission.reviewNotes || "");
    setReviewAction("resolved");
    setIsReviewDialogOpen(true);
  };

  const handleReviewSubmit = () => {
    if (!selectedSubmission) return;
    setFlaggedSubmissions((prev) =>
      prev.map((s) =>
        s.id === selectedSubmission.id
          ? { ...s, status: reviewAction, reviewedBy: "Admin User", reviewNotes }
          : s
      )
    );
    toast.success(`Submission ${selectedSubmission.id} ${statusConfig[reviewAction].label.toLowerCase()}`);
    setIsReviewDialogOpen(false);
    setSelectedSubmission(null);
    setReviewNotes("");
  };

  const handleDismiss = (id: string) => {
    setFlaggedSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "dismissed" as FlagStatus, reviewedBy: "Admin User" } : s))
    );
    toast.success(`Submission ${id} dismissed`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Flagged Submissions</h1>
          <p className="text-sm text-muted-foreground">
            Review and resolve flagged submissions for academic integrity.
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
              <Flag className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Flagged</p>
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
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-emerald-500/10 p-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.resolved}</p>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-red-500/10 p-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.escalated}</p>
              <p className="text-sm text-muted-foreground">Escalated</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-purple-500/10 p-3">
              <Ban className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.plagiarism}</p>
              <p className="text-sm text-muted-foreground">Plagiarism Cases</p>
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
              <Input placeholder="Search flagged submissions..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={flagTypeFilter} onValueChange={(v) => setFlagTypeFilter(v as FlagType | "all")}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Flag Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="plagiarism">Plagiarism</SelectItem>
                <SelectItem value="late">Late Submission</SelectItem>
                <SelectItem value="suspicious">Suspicious</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
                <SelectItem value="duplicate">Duplicate</SelectItem>
                <SelectItem value="policy_violation">Policy Violation</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as FlagStatus | "all")}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
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
              <TabsTrigger value="resolved">Resolved ({stats.resolved})</TabsTrigger>
              <TabsTrigger value="escalated">Escalated ({stats.escalated})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <FlaggedTable submissions={filteredSubmissions} onReview={handleReviewSubmission} onDismiss={handleDismiss} />
            </TabsContent>
            <TabsContent value="pending" className="mt-0">
              <FlaggedTable submissions={filteredSubmissions.filter((s) => s.status === "pending")} onReview={handleReviewSubmission} onDismiss={handleDismiss} />
            </TabsContent>
            <TabsContent value="resolved" className="mt-0">
              <FlaggedTable submissions={filteredSubmissions.filter((s) => s.status === "resolved")} onReview={handleReviewSubmission} onDismiss={handleDismiss} />
            </TabsContent>
            <TabsContent value="escalated" className="mt-0">
              <FlaggedTable submissions={filteredSubmissions.filter((s) => s.status === "escalated")} onReview={handleReviewSubmission} onDismiss={handleDismiss} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        {selectedSubmission && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Review Flagged Submission
              </DialogTitle>
              <DialogDescription>
                Review and resolve the flagged submission for {selectedSubmission.student}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Submission Info */}
              <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Student</p>
                  <p className="text-sm font-medium">{selectedSubmission.student}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assignment</p>
                  <p className="text-sm font-medium">{selectedSubmission.assignment}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Class</p>
                  <p className="text-sm font-medium">{selectedSubmission.class}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Flag Type</p>
                  <div className="flex items-center gap-1">
                    {React.createElement(flagTypeConfig[selectedSubmission.flagType].icon, { className: "h-3 w-3" })}
                    <p className="text-sm font-medium">{flagTypeConfig[selectedSubmission.flagType].label}</p>
                  </div>
                </div>
              </div>

              {/* Flag Reason */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-400">Flag Reason</p>
                    <p className="text-sm text-amber-700 dark:text-amber-500">{selectedSubmission.flagReason}</p>
                  </div>
                </div>
              </div>

              {/* Review Action */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Review Action</label>
                <Select value={reviewAction} onValueChange={(v) => setReviewAction(v as FlagStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resolved">Mark as Resolved</SelectItem>
                    <SelectItem value="dismissed">Dismiss Flag</SelectItem>
                    <SelectItem value="escalated">Escalate to Committee</SelectItem>
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

function FlaggedTable({
  submissions,
  onReview,
  onDismiss,
}: {
  submissions: FlaggedSubmission[];
  onReview: (submission: FlaggedSubmission) => void;
  onDismiss: (id: string) => void;
}) {
  if (!submissions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Filter className="mb-3 h-10 w-10 opacity-50" />
        <p className="text-sm">No flagged submissions match the current filters.</p>
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
          <TableHead>Flag Type</TableHead>
          <TableHead>Flagged Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((sub) => {
          const flagCfg = flagTypeConfig[sub.flagType];
          const FlagIcon = flagCfg.icon;
          const statusCfg = statusConfig[sub.status];

          return (
            <TableRow key={sub.id}>
              <TableCell className="font-mono text-sm">{sub.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{sub.student}</p>
                    <p className="text-xs text-muted-foreground">{sub.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm font-medium">{sub.assignment}</p>
                  <p className="text-xs text-muted-foreground">{sub.class}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <FlagIcon className={`h-4 w-4 ${flagCfg.color}`} />
                  <span className="text-sm">{flagCfg.label}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{sub.flaggedDate}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusCfg.color}>
                  {statusCfg.label}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onReview(sub)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {sub.status === "pending" && (
                    <Button variant="ghost" size="icon" onClick={() => onDismiss(sub.id)}>
                      <XCircle className="h-4 w-4 text-slate-500" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
