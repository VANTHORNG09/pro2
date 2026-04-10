"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Download,
  ClipboardList,
  Users,
  Eye,
  Edit,
  Trash2,
  Send,
  Archive,
  FileText,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type AssignmentStatus = "draft" | "published" | "closed";

interface AssignmentData {
  id: string;
  title: string;
  description: string;
  instructions: string;
  classId: string;
  className: string;
  teacherName: string;
  dueDate: string;
  status: AssignmentStatus;
  submissions: number;
  graded: number;
  pending: number;
  maxPoints: number;
  allowedFiles: string[];
}

const mockAssignments: AssignmentData[] = [
  { id: "1", title: "Database Design Project", description: "Design a relational database schema for an e-commerce platform.", instructions: "Create ERD, normalize to 3NF, write SQL DDL.", classId: "CS-350", className: "Database Systems", teacherName: "Prof. Michael Chen", dueDate: "2026-04-20", status: "published", submissions: 22, graded: 18, pending: 4, maxPoints: 100, allowedFiles: [".sql", ".pdf", ".zip"] },
  { id: "2", title: "React Portfolio Website", description: "Build a personal portfolio using React and Tailwind CSS.", instructions: "Include at least 4 pages, responsive design, and deployment.", classId: "CS-301", className: "Web Development A", teacherName: "Dr. Sarah Johnson", dueDate: "2026-04-25", status: "published", submissions: 25, graded: 25, pending: 0, maxPoints: 100, allowedFiles: [".zip", ".url"] },
  { id: "3", title: "Sorting Algorithm Analysis", description: "Implement and compare 5 sorting algorithms.", instructions: "Write time complexity analysis for each algorithm.", classId: "CS-401", className: "Data Structures & Algorithms", teacherName: "Prof. Michael Chen", dueDate: "2026-04-15", status: "closed", submissions: 30, graded: 30, pending: 0, maxPoints: 50, allowedFiles: [".java", ".py", ".cpp"] },
  { id: "4", title: "OOP Design Patterns", description: "Implement 3 design patterns in Java.", instructions: "Use Factory, Observer, and Strategy patterns.", classId: "CS-202", className: "Object-Oriented Programming", teacherName: "Dr. Sarah Johnson", dueDate: "2026-05-01", status: "draft", submissions: 0, graded: 0, pending: 0, maxPoints: 75, allowedFiles: [".java", ".zip"] },
  { id: "5", title: "ML Model Training", description: "Train a classification model on the Iris dataset.", instructions: "Use scikit-learn, evaluate with cross-validation.", classId: "CS-450", className: "Machine Learning", teacherName: "Dr. Alex Kumar", dueDate: "2026-04-30", status: "published", submissions: 15, graded: 10, pending: 5, maxPoints: 100, allowedFiles: [".ipynb", ".py", ".pdf"] },
  { id: "6", title: "Calculus Problem Set 5", description: "Integration techniques and applications.", instructions: "Solve problems 1-20 from Chapter 7.", classId: "MATH-101", className: "Calculus I", teacherName: "Dr. Emily White", dueDate: "2026-04-18", status: "published", submissions: 98, graded: 85, pending: 13, maxPoints: 50, allowedFiles: [".pdf"] },
];

const statusConfig: Record<AssignmentStatus, { label: string; color: string }> = {
  published: { label: "Published", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400" },
  draft: { label: "Draft", color: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400" },
  closed: { label: "Closed", color: "bg-slate-500/10 text-slate-500 border-slate-500/20 dark:text-slate-400" },
};

const classes = [...new Set(mockAssignments.map((a) => a.className))];

function DashboardStat({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: number | string;
  subtitle: string;
  icon: typeof ClipboardList;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentData[]>(mockAssignments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailAssignment, setDetailAssignment] = useState<AssignmentData | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    instructions: "",
    className: "",
    dueDate: "",
    maxPoints: "100",
  });

  const filtered = assignments.filter((a) => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.className.toLowerCase().includes(search.toLowerCase()) || a.teacherName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const matchClass = classFilter === "all" || a.className === classFilter;
    return matchSearch && matchStatus && matchClass;
  });

  const counts = {
    total: assignments.length,
    published: assignments.filter((a) => a.status === "published").length,
    draft: assignments.filter((a) => a.status === "draft").length,
    closed: assignments.filter((a) => a.status === "closed").length,
    totalSubmissions: assignments.reduce((s, a) => s + a.submissions, 0),
    totalGraded: assignments.reduce((s, a) => s + a.graded, 0),
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((a) => a.id)));
  };

  const handleAdd = () => {
    if (!form.title || !form.dueDate) return;
    setAssignments((prev) => [
      ...prev,
      {
        ...form,
        id: String(prev.length + 1),
        classId: "",
        teacherName: "",
        status: "draft",
        maxPoints: parseInt(form.maxPoints) || 100,
        submissions: 0,
        graded: 0,
        pending: 0,
        allowedFiles: [".pdf"],
      },
    ]);
    setForm({ title: "", description: "", instructions: "", className: "", dueDate: "", maxPoints: "100" });
    setAddDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    setSelectedIds((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
  };

  const handlePublish = (id: string) => {
    setAssignments((prev) => prev.map((a) => a.id === id ? { ...a, status: "published" as AssignmentStatus } : a));
  };

  const handleClose = (id: string) => {
    setAssignments((prev) => prev.map((a) => a.id === id ? { ...a, status: "closed" as AssignmentStatus } : a));
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assignment Management</h1>
          <p className="text-sm text-muted-foreground">
            Create, manage, and monitor assignments across all classes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const headers = ["Title", "Class", "Teacher", "Status", "Due Date", "Submissions", "Graded"];
              const rows = filtered.map((a) => [
                a.title,
                a.className,
                a.teacherName,
                a.status,
                a.dueDate,
                String(a.submissions),
                String(a.graded),
              ]);
              const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "assignments.csv";
              link.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          title="Total Assignments"
          value={counts.total}
          subtitle={`${counts.published} published`}
          icon={ClipboardList}
          color="bg-blue-500/10 text-blue-500"
        />
        <DashboardStat
          title="Published"
          value={counts.published}
          subtitle="live assignments"
          icon={Send}
          color="bg-emerald-500/10 text-emerald-500"
        />
        <DashboardStat
          title="Total Submissions"
          value={counts.totalSubmissions}
          subtitle={`${counts.totalGraded} graded`}
          icon={Users}
          color="bg-violet-500/10 text-violet-500"
        />
        <DashboardStat
          title="Drafts"
          value={counts.draft}
          subtitle="pending review"
          icon={Edit}
          color="bg-amber-500/10 text-amber-500"
        />
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <span className="text-sm font-medium">{selectedIds.size} assignment(s) selected</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                selectedIds.forEach((id) => handlePublish(id));
                setSelectedIds(new Set());
              }}
            >
              <Send className="mr-1 h-3.5 w-3.5" /> Publish
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                setAssignments((prev) => prev.filter((a) => !selectedIds.has(a.id)));
                setSelectedIds(new Set());
              }}
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
            </Button>
          </div>
          <Button size="sm" variant="ghost" className="ml-auto" onClick={() => setSelectedIds(new Set())}>
            Clear
          </Button>
        </div>
      )}

      {/* Tabs & Filters */}
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
                <Input placeholder="Search assignments..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <Tabs defaultValue="all">
            <div className="px-6 pt-4">
              <TabsList>
                <TabsTrigger value="all">All ({counts.total})</TabsTrigger>
                <TabsTrigger value="published">Published ({counts.published})</TabsTrigger>
                <TabsTrigger value="draft">Draft ({counts.draft})</TabsTrigger>
                <TabsTrigger value="closed">Closed ({counts.closed})</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <AssignmentTable
                assignments={filtered}
                selectedIds={selectedIds}
                toggleSelect={toggleSelect}
                toggleSelectAll={toggleSelectAll}
                isAllSelected={filtered.length > 0 && selectedIds.size === filtered.length}
                onDelete={handleDelete}
                onPublish={handlePublish}
                onClose={handleClose}
                onView={setDetailAssignment}
              />
            </TabsContent>
            {(["published", "draft", "closed"] as AssignmentStatus[]).map((status) => (
              <TabsContent key={status} value={status} className="mt-0">
                <AssignmentTable
                  assignments={filtered.filter((a) => a.status === status)}
                  selectedIds={selectedIds}
                  toggleSelect={toggleSelect}
                  toggleSelectAll={toggleSelectAll}
                  isAllSelected={false}
                  onDelete={handleDelete}
                  onPublish={handlePublish}
                  onClose={handleClose}
                  onView={setDetailAssignment}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      {detailAssignment && (
        <Dialog open={!!detailAssignment} onOpenChange={() => setDetailAssignment(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="text-lg font-semibold">{detailAssignment.title}</p>
                  <p className="text-sm text-muted-foreground">{detailAssignment.className}</p>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={statusConfig[detailAssignment.status].color}>
                  {statusConfig[detailAssignment.status].label}
                </Badge>
                <Badge variant="secondary">{detailAssignment.maxPoints} pts</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{detailAssignment.description}</p>
              <div className="rounded-lg border p-3 text-sm">{detailAssignment.instructions}</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center rounded-lg border p-3">
                  <p className="text-xl font-bold">{detailAssignment.submissions}</p>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                </div>
                <div className="text-center rounded-lg border p-3">
                  <p className="text-xl font-bold text-emerald-500">{detailAssignment.graded}</p>
                  <p className="text-xs text-muted-foreground">Graded</p>
                </div>
                <div className="text-center rounded-lg border p-3">
                  <p className="text-xl font-bold text-amber-500">{detailAssignment.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">Teacher</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px]">{getInitials(detailAssignment.teacherName)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{detailAssignment.teacherName}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Due Date</Label>
                  <p className="mt-1 font-medium">{new Date(detailAssignment.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailAssignment(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Assignment</DialogTitle>
            <DialogDescription>Add a new assignment and configure its details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="a-title">Title</Label>
              <Input id="a-title" placeholder="Assignment title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="a-class">Class</Label>
                <Select value={form.className} onValueChange={(v) => setForm((p) => ({ ...p, className: v }))}>
                  <SelectTrigger id="a-class"><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="a-due">Due Date</Label>
                <Input id="a-due" type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="a-desc">Description</Label>
              <Textarea id="a-desc" placeholder="Brief description..." value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="a-inst">Instructions</Label>
              <Textarea id="a-inst" placeholder="Detailed instructions..." value={form.instructions} onChange={(e) => setForm((p) => ({ ...p, instructions: e.target.value }))} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="a-points">Max Points</Label>
              <Input id="a-points" type="number" value={form.maxPoints} onChange={(e) => setForm((p) => ({ ...p, maxPoints: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Create Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AssignmentTable({
  assignments,
  selectedIds,
  toggleSelect,
  toggleSelectAll,
  isAllSelected,
  onDelete,
  onPublish,
  onClose,
  onView,
}: {
  assignments: AssignmentData[];
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  isAllSelected: boolean;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onClose: (id: string) => void;
  onView: (a: AssignmentData) => void;
}) {
  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <ClipboardList className="h-12 w-12 mb-3 opacity-50" />
        <p className="text-sm font-medium">No assignments found</p>
        <p className="text-xs mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10 pl-6">
            <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} />
          </TableHead>
          <TableHead>Assignment</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead className="text-center">Submissions</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px] text-right pr-6">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments.map((a) => {
          const status = statusConfig[a.status];
          return (
            <TableRow key={a.id} className="hover:bg-muted/50">
              <TableCell className="pl-6">
                <Checkbox checked={selectedIds.has(a.id)} onCheckedChange={() => toggleSelect(a.id)} />
              </TableCell>
              <TableCell>
                <div className="min-w-0">
                  <p className="truncate font-medium">{a.title}</p>
                  <p className="truncate text-xs text-muted-foreground mt-0.5">
                    {a.description.slice(0, 60)}...
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-mono text-xs">{a.className}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(a.dueDate).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{a.submissions}</span>
                  {a.graded > 0 && <span className="text-emerald-500">/ {a.graded}</span>}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={status.color}>{status.label}</Badge>
              </TableCell>
              <TableCell className="text-right pr-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onView(a)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    {a.status === "draft" && (
                      <DropdownMenuItem onClick={() => onPublish(a.id)}>
                        <Send className="mr-2 h-4 w-4" /> Publish
                      </DropdownMenuItem>
                    )}
                    {a.status === "published" && (
                      <DropdownMenuItem onClick={() => onClose(a.id)}>
                        <Archive className="mr-2 h-4 w-4" /> Close
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => onDelete(a.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
