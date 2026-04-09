"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Download,
  Send,
  Archive,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  MapPin,
  Clock,
  FileText,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

import {
  useAssignments,
  useDeleteAssignment,
  usePublishAssignment,
  useCloseAssignment,
} from "@/lib/hooks/queries/useAssignments";
import { useToast } from "@/hooks/use-toast";
import type { Assignment, AssignmentStatus } from "@/lib/types/assignment";

// ─── Stat Card Component ──────────
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

// ─── Detail Item Sub-Component ────────────────────────────────────────
function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border p-3">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

// ─── Completion Bar Component ─────────────────────────────────────────
function CompletionBar({ submitted, total }: { submitted: number; total: number }) {
  const pct = total > 0 ? Math.round((submitted / total) * 100) : 0;
  const color =
    pct >= 80
      ? "bg-emerald-500"
      : pct >= 50
        ? "bg-amber-500"
        : pct > 0
          ? "bg-orange-500"
          : "bg-muted";

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">
        {submitted}/{total} ({pct}%)
      </span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function AdminAssignmentsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const { data: assignments = [], isLoading } = useAssignments({});
  const deleteAssignment = useDeleteAssignment();
  const publishAssignment = usePublishAssignment();
  const closeAssignment = useCloseAssignment();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | "all">("all");
  const [activeTab, setActiveTab] = useState("all");

  // Modal state
  const [detailsAssignment, setDetailsAssignment] = useState<Assignment | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteAssignmentId, setDeleteAssignmentId] = useState<number | null>(null);

  // Filters
  const filtered = assignments.filter((a) => {
    if (activeTab !== "all" && a.status !== activeTab) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.className.toLowerCase().includes(q) ||
        a.teacherName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Stats
  const stats = {
    total: assignments.length,
    published: assignments.filter((a) => a.status === "published").length,
    draft: assignments.filter((a) => a.status === "draft").length,
    closed: assignments.filter((a) => a.status === "closed").length,
  };

  const totalSubmissions = assignments.reduce((sum, a) => sum + (a.submissionCount || 0), 0);
  const totalGraded = assignments.reduce((sum, a) => sum + (a.gradedCount || 0), 0);

  const handleDelete = (id: number) => {
    setDeleteAssignmentId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteAssignmentId) {
      deleteAssignment.mutate(deleteAssignmentId, {
        onSuccess: () => {
          toast({ title: "Assignment deleted", description: "The assignment has been removed successfully." });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to delete assignment.", variant: "destructive" });
        },
        onSettled: () => {
          setDeleteConfirmOpen(false);
          setDeleteAssignmentId(null);
        },
      });
    }
  };

  const handlePublish = (id: number) => {
    publishAssignment.mutate(id, {
      onSuccess: () => {
        toast({ title: "Assignment published", description: "The assignment is now live." });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to publish assignment.", variant: "destructive" });
      },
    });
  };

  const handleClose = (id: number) => {
    closeAssignment.mutate(id, {
      onSuccess: () => {
        toast({ title: "Assignment closed", description: "No new submissions will be accepted." });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to close assignment.", variant: "destructive" });
      },
    });
  };

  const openDetails = (a: Assignment) => {
    setDetailsAssignment(a);
  };

  const closeDetails = () => {
    setDetailsAssignment(null);
  };

  const uniqueClasses = Array.from(
    new Map(assignments.map((a) => [a.classId, { code: a.classId, name: a.className }])).values()
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assignment Management</h1>
          <p className="text-sm text-muted-foreground">
            Create, manage, and monitor assignments across all classes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push("/teacher/assignments/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          title="Total Assignments"
          value={stats.total}
          subtitle={`${stats.published} published`}
          icon={<FileText className="h-4 w-4" />}
        />
        <DashboardStat
          title="Published"
          value={stats.published}
          subtitle="live assignments"
          icon={<Send className="h-4 w-4" />}
        />
        <DashboardStat
          title="Drafts"
          value={stats.draft}
          subtitle="pending review"
          icon={<Edit2 className="h-4 w-4" />}
        />
        <DashboardStat
          title="Total Submissions"
          value={totalSubmissions}
          subtitle={`${totalGraded} graded`}
          icon={<Users className="h-4 w-4" />}
          trend={
            totalSubmissions > 0
              ? { value: `${Math.round((totalGraded / totalSubmissions) * 100)}% graded`, positive: true }
              : undefined
          }
        />
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Assignments</CardTitle>
              <CardDescription>{filtered.length} assignment(s) found</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search assignments..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AssignmentStatus | "all")}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
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
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Table */}
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Assignment</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[140px] text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span className="text-sm">Loading assignments...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filtered.length > 0 ? (
                  filtered.map((a) => (
                    <TableRow key={a.id} className="hover:bg-muted/50">
                      <TableCell className="pl-6">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{a.title}</p>
                          <p className="truncate text-sm text-muted-foreground">
                            {a.description.slice(0, 60)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{a.className}</p>
                          <Badge variant="secondary" className="font-mono text-xs mt-1">
                            #{a.classId}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                              {a.teacherName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{a.teacherName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(a.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <CompletionBar
                          submitted={a.submissionCount || 0}
                          total={(a.gradedCount || 0) + (a.pendingCount || 0)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              a.status === "published"
                                ? "bg-emerald-500"
                                : a.status === "closed"
                                  ? "bg-amber-500"
                                  : "bg-muted"
                            }`}
                          />
                          <span className="text-sm capitalize">{a.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1">
                          <Button size="icon-sm" variant="ghost" onClick={() => openDetails(a)} title="View details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {a.status === "draft" && (
                            <Button size="icon-sm" variant="ghost" onClick={() => handlePublish(a.id)} title="Publish">
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          {a.status === "published" && (
                            <Button size="icon-sm" variant="ghost" onClick={() => handleClose(a.id)} title="Close">
                              <Archive className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(a.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <FileText className="h-8 w-8" />
                        <p className="text-sm">No assignments found</p>
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

      {/* ─── Assignment Details Dialog ──────────────────────────────── */}
      {detailsAssignment && (
        <Dialog open={!!detailsAssignment} onOpenChange={closeDetails}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {detailsAssignment.title}
              </DialogTitle>
              <DialogDescription>
                View detailed information about this assignment.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    detailsAssignment.status === "published"
                      ? "default"
                      : detailsAssignment.status === "closed"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {detailsAssignment.status}
                </Badge>
                <Badge variant="secondary" className="font-mono">
                  #{detailsAssignment.classId}
                </Badge>
                <span className="text-sm text-muted-foreground">{detailsAssignment.className}</span>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <p className="text-sm">{detailsAssignment.description}</p>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Instructions</Label>
                <p className="text-sm text-muted-foreground">{detailsAssignment.instructions}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem
                  icon={<Users className="h-4 w-4" />}
                  label="Submissions"
                  value={`${detailsAssignment.submissionCount || 0} submitted`}
                />
                <DetailItem
                  icon={<FileText className="h-4 w-4" />}
                  label="Graded"
                  value={`${detailsAssignment.gradedCount || 0} graded`}
                />
                <DetailItem
                  icon={<Clock className="h-4 w-4" />}
                  label="Due Date"
                  value={new Date(detailsAssignment.dueDate).toLocaleDateString()}
                />
                <DetailItem
                  icon={<Calendar className="h-4 w-4" />}
                  label="Max Points"
                  value={detailsAssignment.maxPoints.toString()}
                />
                <DetailItem
                  icon={<Users className="h-4 w-4" />}
                  label="Teacher"
                  value={detailsAssignment.teacherName}
                />
                {detailsAssignment.allowedFileTypes && detailsAssignment.allowedFileTypes.length > 0 && (
                  <DetailItem
                    icon={<FileText className="h-4 w-4" />}
                    label="File Types"
                    value={detailsAssignment.allowedFileTypes.join(", ")}
                  />
                )}
              </div>

              <div className="rounded-lg border p-3 text-xs text-muted-foreground">
                <p>Created: {new Date(detailsAssignment.createdAt).toLocaleDateString()}</p>
                <p>Last Updated: {new Date(detailsAssignment.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              {detailsAssignment.status === "draft" && (
                <Button onClick={() => { closeDetails(); handlePublish(detailsAssignment.id); }}>
                  <Send className="mr-2 h-4 w-4" />
                  Publish
                </Button>
              )}
              {detailsAssignment.status === "published" && (
                <Button variant="outline" onClick={() => { closeDetails(); handleClose(detailsAssignment.id); }}>
                  <Archive className="mr-2 h-4 w-4" />
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ─── Delete Confirmation Dialog ─────────────────────────────── */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Assignment
            </DialogTitle>
            <DialogDescription>
              Review the impact and confirm deletion.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="confirm">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="confirm">Confirm</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
            </TabsList>

            <TabsContent value="confirm" className="space-y-4 pt-4">
              <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                <p className="text-sm font-medium text-destructive">
                  You are about to delete:
                </p>
                <p className="mt-2 font-semibold">
                  {assignments.find((a) => a.id === deleteAssignmentId)?.title || "Unknown Assignment"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {assignments.find((a) => a.id === deleteAssignmentId)?.className || ""}
                </p>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 p-3">
                <span className="mt-0.5">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    This action cannot be undone
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400/80">
                    All submissions and grades will be permanently removed.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="impact" className="space-y-4 pt-4">
              <div className="space-y-3">
                <p className="text-sm font-medium">This deletion will affect:</p>

                <div className="grid gap-2 sm:grid-cols-2">
                  <DetailItem
                    icon={<Users className="h-4 w-4" />}
                    label="Submissions"
                    value={`${assignments.find((a) => a.id === deleteAssignmentId)?.submissionCount || 0} submitted`}
                  />
                  <DetailItem
                    icon={<FileText className="h-4 w-4" />}
                    label="Graded"
                    value={`${assignments.find((a) => a.id === deleteAssignmentId)?.gradedCount || 0} graded`}
                  />
                </div>

                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Teacher</p>
                  <p className="text-sm text-muted-foreground">
                    {assignments.find((a) => a.id === deleteAssignmentId)?.teacherName || "Unknown"}
                  </p>
                </div>

                <div className="flex items-start gap-2 rounded-lg bg-red-500/10 p-3">
                  <span className="mt-0.5">🗑️</span>
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                      Permanent deletion
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400/80">
                      All submissions, grades, and feedback will be permanently removed.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="options" className="space-y-4 pt-4">
              <div className="space-y-3">
                <p className="text-sm font-medium">Deletion options:</p>

                <div className="space-y-2">
                  <label className="flex items-center gap-3 rounded-lg border p-3">
                    <input type="checkbox" className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Archive instead of delete</p>
                      <p className="text-xs text-muted-foreground">
                        Close the assignment and retain all data
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 rounded-lg border p-3">
                    <input type="checkbox" className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Notify affected students</p>
                      <p className="text-xs text-muted-foreground">
                        Send email notification to students who submitted
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 rounded-lg border p-3">
                    <input type="checkbox" className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Export data before deletion</p>
                      <p className="text-xs text-muted-foreground">
                        Download all submissions and grades as CSV
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
