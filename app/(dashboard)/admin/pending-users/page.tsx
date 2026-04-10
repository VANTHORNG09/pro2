"use client";

import * as React from "react";
import {
  Users,
  Search,
  Filter,
  UserPlus,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Mail,
  Calendar,
  Eye,
  Shield,
  GraduationCap,
  School,
  MessageSquare,
  Download,
  AlertTriangle,
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

type RequestType = "new_account" | "role_change" | "account_reactivation" | "department_transfer";
type RequestStatus = "pending" | "approved" | "rejected";
type UserRole = "admin" | "teacher" | "student";

interface PendingUserRequest {
  id: string;
  name: string;
  email: string;
  requestType: RequestType;
  currentRole?: UserRole;
  requestedRole?: UserRole;
  department?: string;
  requestDate: string;
  status: RequestStatus;
  justification: string;
  attachments?: string[];
  reviewedBy?: string;
  reviewNotes?: string;
}

// --- Mock Data ---

const mockPendingRequests: PendingUserRequest[] = [
  {
    id: "PU001",
    name: "Emily Watson",
    email: "emily.watson@university.edu",
    requestType: "new_account",
    requestedRole: "teacher",
    department: "Computer Science",
    requestDate: "2026-04-10",
    status: "pending",
    justification: "New faculty member joining the CS department starting next semester. Need account setup for course management.",
  },
  {
    id: "PU002",
    name: "Marcus Johnson",
    email: "marcus.j@university.edu",
    requestType: "role_change",
    currentRole: "student",
    requestedRole: "teacher",
    department: "Mathematics",
    requestDate: "2026-04-09",
    status: "pending",
    justification: "Completed PhD and appointed as Teaching Assistant. Need role change to manage assigned classes.",
  },
  {
    id: "PU003",
    name: "Sarah Chen",
    email: "sarah.chen@university.edu",
    requestType: "account_reactivation",
    currentRole: "student",
    requestedRole: "student",
    department: "Physics",
    requestDate: "2026-04-08",
    status: "pending",
    justification: "Returning from medical leave. Account was deactivated during absence period.",
  },
  {
    id: "PU004",
    name: "David Kim",
    email: "david.kim@university.edu",
    requestType: "department_transfer",
    currentRole: "teacher",
    requestedRole: "teacher",
    department: "Chemistry",
    requestDate: "2026-04-07",
    status: "approved",
    justification: "Transferring from Biology to Chemistry department. All course assignments need to be updated.",
    reviewedBy: "Admin User",
    reviewNotes: "Transfer approved. Department head notified.",
  },
  {
    id: "PU005",
    name: "Lisa Rodriguez",
    email: "lisa.r@university.edu",
    requestType: "new_account",
    requestedRole: "student",
    department: "Engineering",
    requestDate: "2026-04-06",
    status: "rejected",
    justification: "New graduate student enrolling in Spring 2026.",
    reviewedBy: "Admin User",
    reviewNotes: "Enrollment not yet confirmed by admissions office. Please reapply after enrollment is processed.",
  },
  {
    id: "PU006",
    name: "James Park",
    email: "james.park@university.edu",
    requestType: "role_change",
    currentRole: "student",
    requestedRole: "admin",
    department: "IT Services",
    requestDate: "2026-04-05",
    status: "pending",
    justification: "Promoted to IT administrative role. Needs admin access for system management tasks.",
  },
];

// --- Config ---

const requestTypeConfig: Record<RequestType, { label: string; icon: typeof UserPlus; color: string }> = {
  new_account: { label: "New Account", icon: UserPlus, color: "text-blue-500" },
  role_change: { label: "Role Change", icon: Shield, color: "text-purple-500" },
  account_reactivation: { label: "Account Reactivation", icon: Clock, color: "text-amber-500" },
  department_transfer: { label: "Department Transfer", icon: GraduationCap, color: "text-emerald-500" },
};

const statusConfig: Record<RequestStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  approved: { label: "Approved", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  rejected: { label: "Rejected", color: "bg-red-500/10 text-red-700 dark:text-red-400" },
};

const roleIcons: Record<UserRole, typeof User> = {
  admin: Shield,
  teacher: GraduationCap,
  student: School,
};

// --- Main Page ---

export default function PendingUsersPage() {
  const [requests, setRequests] = React.useState<PendingUserRequest[]>(mockPendingRequests);
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<RequestType | "all">("all");
  const [statusFilter, setStatusFilter] = React.useState<RequestStatus | "all">("all");
  const [selectedRequest, setSelectedRequest] = React.useState<PendingUserRequest | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = React.useState(false);
  const [reviewAction, setReviewAction] = React.useState<RequestStatus>("approved");
  const [reviewNotes, setReviewNotes] = React.useState("");

  const filteredRequests = requests.filter((r) => {
    if (typeFilter !== "all" && r.requestType !== typeFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.department?.toLowerCase().includes(q) ||
        r.justification.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
    newAccounts: requests.filter((r) => r.requestType === "new_account" && r.status === "pending").length,
    roleChanges: requests.filter((r) => r.requestType === "role_change" && r.status === "pending").length,
  };

  const handleReview = (request: PendingUserRequest) => {
    setSelectedRequest(request);
    setReviewAction(request.status === "pending" ? "approved" : request.status);
    setReviewNotes(request.reviewNotes || "");
    setIsReviewDialogOpen(true);
  };

  const handleReviewSubmit = () => {
    if (!selectedRequest) return;
    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedRequest.id
          ? { ...r, status: reviewAction, reviewedBy: "Admin User", reviewNotes }
          : r
      )
    );
    toast.success(`Request ${selectedRequest.id} ${statusConfig[reviewAction].label.toLowerCase()}`);
    setIsReviewDialogOpen(false);
    setSelectedRequest(null);
    setReviewNotes("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pending User Requests</h1>
          <p className="text-sm text-muted-foreground">
            Review and process pending user account requests, role changes, and transfers.
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-500/10 p-3">
              <Users className="h-5 w-5 text-blue-500" />
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
      </div>

      {/* Pending Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending by Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-blue-500" />
                <span className="text-sm">New Accounts</span>
              </div>
              <Badge variant="secondary">{stats.newAccounts}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Role Changes</span>
              </div>
              <Badge variant="secondary">{stats.roleChanges}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-sm">Reactivations</span>
              </div>
              <Badge variant="secondary">
                {requests.filter((r) => r.requestType === "account_reactivation" && r.status === "pending").length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">Transfers</span>
              </div>
              <Badge variant="secondary">
                {requests.filter((r) => r.requestType === "department_transfer" && r.status === "pending").length}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="outline" onClick={() => setStatusFilter("pending")}>
              <Clock className="mr-2 h-4 w-4" />
              View Pending Only
            </Button>
            <Button className="w-full" variant="outline" onClick={() => setTypeFilter("new_account")}>
              <UserPlus className="mr-2 h-4 w-4" />
              View New Accounts
            </Button>
            <Button className="w-full" variant="outline" onClick={() => setTypeFilter("role_change")}>
              <Shield className="mr-2 h-4 w-4" />
              View Role Changes
            </Button>
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
              <Input placeholder="Search requests..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as RequestType | "all")}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Request Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="new_account">New Account</SelectItem>
                <SelectItem value="role_change">Role Change</SelectItem>
                <SelectItem value="account_reactivation">Account Reactivation</SelectItem>
                <SelectItem value="department_transfer">Department Transfer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as RequestStatus | "all")}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
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
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <PendingUsersTable requests={filteredRequests} onReview={handleReview} />
            </TabsContent>
            <TabsContent value="pending" className="mt-0">
              <PendingUsersTable requests={filteredRequests.filter((r) => r.status === "pending")} onReview={handleReview} />
            </TabsContent>
            <TabsContent value="approved" className="mt-0">
              <PendingUsersTable requests={filteredRequests.filter((r) => r.status === "approved")} onReview={handleReview} />
            </TabsContent>
            <TabsContent value="rejected" className="mt-0">
              <PendingUsersTable requests={filteredRequests.filter((r) => r.status === "rejected")} onReview={handleReview} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        {selectedRequest && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Review User Request
              </DialogTitle>
              <DialogDescription>
                Review request {selectedRequest.id} from {selectedRequest.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Request Info */}
              <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{selectedRequest.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{selectedRequest.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium">{selectedRequest.department}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Request Date</p>
                  <p className="text-sm font-medium">{selectedRequest.requestDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Request Type</p>
                  <div className="flex items-center gap-1.5">
                    {React.createElement(requestTypeConfig[selectedRequest.requestType].icon, { className: "h-4 w-4" })}
                    <p className="text-sm font-medium">{requestTypeConfig[selectedRequest.requestType].label}</p>
                  </div>
                </div>
                {(selectedRequest.currentRole || selectedRequest.requestedRole) && (
                  <div>
                    <p className="text-xs text-muted-foreground">Role</p>
                    <div className="flex items-center gap-2 text-sm">
                      {selectedRequest.currentRole && (
                        <span>{selectedRequest.currentRole}</span>
                      )}
                      {selectedRequest.currentRole && selectedRequest.requestedRole && (
                        <span className="text-muted-foreground">→</span>
                      )}
                      {selectedRequest.requestedRole && (
                        <span className="font-medium">{selectedRequest.requestedRole}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Justification */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="flex items-start gap-2">
                  <MessageSquare className="mt-0.5 h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Justification</p>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-500">{selectedRequest.justification}</p>
                  </div>
                </div>
              </div>

              {/* Review Action */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Review Decision</label>
                <Select value={reviewAction} onValueChange={(v) => setReviewAction(v as RequestStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approve Request</SelectItem>
                    <SelectItem value="rejected">Reject Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Review Notes */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Review Notes</label>
                <Textarea
                  placeholder="Add notes about this request..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
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

function PendingUsersTable({
  requests,
  onReview,
}: {
  requests: PendingUserRequest[];
  onReview: (request: PendingUserRequest) => void;
}) {
  if (!requests.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Filter className="mb-3 h-10 w-10 opacity-50" />
        <p className="text-sm">No user requests match the current filters.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Request Type</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Request Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((r) => {
          const typeCfg = requestTypeConfig[r.requestType];
          const TypeIcon = typeCfg.icon;
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
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <TypeIcon className={`h-4 w-4 ${typeCfg.color}`} />
                  <span className="text-sm">{typeCfg.label}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm">{r.department || "—"}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{r.requestDate}</TableCell>
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
