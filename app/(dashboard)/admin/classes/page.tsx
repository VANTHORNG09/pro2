"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Download,
  BookOpen,
  Users,
  ClipboardList,
  Calendar,
  MapPin,
  Clock,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Archive,
  ArchiveRestore,
  UserPlus,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

// --- Types ---
type ClassStatus = "active" | "inactive" | "archived";

interface ClassData {
  id: string;
  name: string;
  code: string;
  teacher: string;
  teacherEmail: string;
  subject: string;
  students: number;
  assignments: number;
  status: ClassStatus;
  schedule: string;
  room: string;
  semester: string;
  year: number;
  description: string;
}

// --- Mock Data ---
const mockClasses: ClassData[] = [
  { id: "1", name: "Web Development A", code: "CS-301", teacher: "Dr. Sarah Johnson", teacherEmail: "sarah@assignbridge.com", subject: "Computer Science", students: 28, assignments: 12, status: "active", schedule: "Mon/Wed 10:00-11:30", room: "Room 204", semester: "Spring", year: 2026, description: "Full-stack web development with React and Node.js" },
  { id: "2", name: "Object-Oriented Programming", code: "CS-202", teacher: "Dr. Sarah Johnson", teacherEmail: "sarah@assignbridge.com", subject: "Computer Science", students: 32, assignments: 10, status: "active", schedule: "Tue/Thu 14:00-15:30", room: "Lab 101", semester: "Spring", year: 2026, description: "OOP principles with Java and design patterns" },
  { id: "3", name: "Database Systems", code: "CS-350", teacher: "Prof. Michael Chen", teacherEmail: "michael@assignbridge.com", subject: "Computer Science", students: 25, assignments: 8, status: "active", schedule: "Mon/Wed 13:00-14:30", room: "Room 305", semester: "Spring", year: 2026, description: "Relational databases, SQL, and NoSQL systems" },
  { id: "4", name: "Data Structures & Algorithms", code: "CS-401", teacher: "Prof. Michael Chen", teacherEmail: "michael@assignbridge.com", subject: "Computer Science", students: 30, assignments: 15, status: "active", schedule: "Tue/Thu 09:00-10:30", room: "Room 210", semester: "Spring", year: 2026, description: "Advanced data structures and algorithm analysis" },
  { id: "5", name: "Machine Learning", code: "CS-450", teacher: "Dr. Alex Kumar", teacherEmail: "alex@assignbridge.com", subject: "Computer Science", students: 38, assignments: 9, status: "active", schedule: "Wed/Fri 11:00-12:30", room: "Lab 202", semester: "Spring", year: 2026, description: "Supervised and unsupervised learning techniques" },
  { id: "6", name: "Organic Chemistry", code: "CHEM-202", teacher: "Prof. James Miller", teacherEmail: "james@assignbridge.com", subject: "Chemistry", students: 40, assignments: 11, status: "inactive", schedule: "Mon/Wed/Fri 09:00-10:00", room: "Lab 301", semester: "Fall", year: 2025, description: "Organic chemistry fundamentals and reactions" },
  { id: "7", name: "Calculus I", code: "MATH-101", teacher: "Dr. Emily White", teacherEmail: "emily@assignbridge.com", subject: "Mathematics", students: 120, assignments: 14, status: "active", schedule: "Mon/Wed/Fri 08:00-09:00", room: "Hall A", semester: "Spring", year: 2026, description: "Introduction to differential and integral calculus" },
  { id: "8", name: "Physics Mechanics", code: "PHY-201", teacher: "Prof. David Brown", teacherEmail: "david@assignbridge.com", subject: "Physics", students: 85, assignments: 10, status: "archived", schedule: "Tue/Thu 10:00-11:30", room: "Hall B", semester: "Fall", year: 2025, description: "Classical mechanics and thermodynamics" },
];

const statusConfig: Record<ClassStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400" },
  inactive: { label: "Inactive", color: "bg-slate-500/10 text-slate-500 border-slate-500/20 dark:text-slate-400" },
  archived: { label: "Archived", color: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400" },
};

const subjects = [...new Set(mockClasses.map((c) => c.subject))];

// --- Stat Card ---
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
  icon: typeof BookOpen;
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

// --- Add Class Dialog ---
function AddClassDialog({ open, onOpenChange, onAdd }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (cls: Omit<ClassData, "id">) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    teacher: "",
    subject: "",
    schedule: "",
    room: "",
    semester: "Spring",
    year: 2026,
    description: "",
  });

  const handleSubmit = () => {
    if (!form.name || !form.code) return;
    onAdd({
      ...form,
      teacherEmail: "",
      students: 0,
      assignments: 0,
      status: "active",
    });
    setForm({ name: "", code: "", teacher: "", subject: "", schedule: "", room: "", semester: "Spring", year: 2026, description: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
          <DialogDescription>Create a new class and assign a teacher.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="class-name">Class Name</Label>
            <Input id="class-name" placeholder="Web Development A" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class-code">Class Code</Label>
              <Input id="class-code" placeholder="CS-301" value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-subject">Subject</Label>
              <Select value={form.subject} onValueChange={(v) => setForm((p) => ({ ...p, subject: v }))}>
                <SelectTrigger id="class-subject"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="class-teacher">Teacher</Label>
            <Input id="class-teacher" placeholder="Dr. Sarah Johnson" value={form.teacher} onChange={(e) => setForm((p) => ({ ...p, teacher: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class-schedule">Schedule</Label>
              <Input id="class-schedule" placeholder="Mon/Wed 10:00" value={form.schedule} onChange={(e) => setForm((p) => ({ ...p, schedule: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-room">Room</Label>
              <Input id="class-room" placeholder="Room 204" value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="class-desc">Description</Label>
            <Textarea id="class-desc" placeholder="Brief description..." value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Class</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Class Detail Dialog ---
function ClassDetailDialog({ classData, open, onOpenChange }: {
  classData: ClassData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!classData) return null;
  const status = statusConfig[classData.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-left">
              <p className="text-lg font-semibold">{classData.name}</p>
              <p className="text-sm text-muted-foreground">{classData.code}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className={status.color}>{status.label}</Badge>
            <Badge variant="secondary">{classData.subject}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{classData.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Teacher</Label>
              <p className="mt-1 text-sm font-medium">{classData.teacher}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Students</Label>
              <p className="mt-1 text-sm font-medium">{classData.students}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Assignments</Label>
              <p className="mt-1 text-sm font-medium">{classData.assignments}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Schedule</Label>
              <p className="mt-1 text-sm font-medium">{classData.schedule || "—"}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Room</Label>
              <p className="mt-1 text-sm font-medium">{classData.room || "—"}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Semester</Label>
              <p className="mt-1 text-sm font-medium">{classData.semester} {classData.year}</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Main Page ---
export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassData[]>(mockClasses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailClass, setDetailClass] = useState<ClassData | null>(null);

  const filtered = classes.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()) || c.teacher.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchSubject = subjectFilter === "all" || c.subject === subjectFilter;
    return matchSearch && matchStatus && matchSubject;
  });

  const counts = {
    total: classes.length,
    active: classes.filter((c) => c.status === "active").length,
    inactive: classes.filter((c) => c.status === "inactive").length,
    archived: classes.filter((c) => c.status === "archived").length,
    totalStudents: classes.reduce((sum, c) => sum + c.students, 0),
    totalAssignments: classes.reduce((sum, c) => sum + c.assignments, 0),
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
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((c) => c.id)));
    }
  };

  const handleAddClass = (newClass: Omit<ClassData, "id">) => {
    setClasses((prev) => [...prev, { ...newClass, id: String(prev.length + 1) }]);
  };

  const handleDelete = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleToggleStatus = (id: string) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        if (c.status === "archived") return { ...c, status: "active" as ClassStatus };
        return { ...c, status: c.status === "active" ? "archived" : "active" as ClassStatus };
      })
    );
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
          <h1 className="text-2xl font-bold tracking-tight">Class Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage all classes: create, assign teachers, and track enrollment.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {
            const headers = ["Name", "Code", "Teacher", "Subject", "Students", "Assignments", "Status", "Schedule", "Room"];
            const rows = filtered.map((c) => [c.name, c.code, c.teacher, c.subject, String(c.students), String(c.assignments), c.status, c.schedule, c.room]);
            const csv = [headers.join(","), ...rows.map((r) => r.map((col) => `"${col}"`).join(","))].join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "classes.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          title="Total Classes"
          value={counts.total}
          subtitle={`${counts.active} active`}
          icon={BookOpen}
          color="bg-blue-500/10 text-blue-500"
        />
        <DashboardStat
          title="Total Students"
          value={counts.totalStudents}
          subtitle="across all classes"
          icon={Users}
          color="bg-emerald-500/10 text-emerald-500"
        />
        <DashboardStat
          title="Total Assignments"
          value={counts.totalAssignments}
          subtitle="created assignments"
          icon={ClipboardList}
          color="bg-violet-500/10 text-violet-500"
        />
        <DashboardStat
          title="Archived"
          value={counts.archived}
          subtitle="archived classes"
          icon={Archive}
          color="bg-amber-500/10 text-amber-500"
        />
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <span className="text-sm font-medium">{selectedIds.size} class(es) selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Archive className="mr-1 h-3.5 w-3.5" />
              Archive
            </Button>
            <Button size="sm" variant="destructive" onClick={() => {
              setClasses((prev) => prev.filter((c) => !selectedIds.has(c.id)));
              setSelectedIds(new Set());
            }}>
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Delete
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
              <CardTitle>All Classes</CardTitle>
              <CardDescription>{filtered.length} class(es) found</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search classes..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
                <TabsTrigger value="active">Active ({counts.active})</TabsTrigger>
                <TabsTrigger value="inactive">Inactive ({counts.inactive})</TabsTrigger>
                <TabsTrigger value="archived">Archived ({counts.archived})</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <ClassTable
                classes={filtered}
                selectedIds={selectedIds}
                toggleSelect={toggleSelect}
                toggleSelectAll={toggleSelectAll}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                onView={setDetailClass}
                getInitials={getInitials}
                isAllSelected={filtered.length > 0 && selectedIds.size === filtered.length}
              />
            </TabsContent>

            {(["active", "inactive", "archived"] as ClassStatus[]).map((status) => (
              <TabsContent key={status} value={status} className="mt-0">
                <ClassTable
                  classes={filtered.filter((c) => c.status === status)}
                  selectedIds={selectedIds}
                  toggleSelect={toggleSelect}
                  toggleSelectAll={toggleSelectAll}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                  onView={setDetailClass}
                  getInitials={getInitials}
                  isAllSelected={false}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ClassDetailDialog classData={detailClass} open={!!detailClass} onOpenChange={() => setDetailClass(null)} />
      <AddClassDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAdd={handleAddClass} />
    </div>
  );
}

// --- Class Table Component ---
function ClassTable({
  classes,
  selectedIds,
  toggleSelect,
  toggleSelectAll,
  onDelete,
  onToggleStatus,
  onView,
  getInitials,
  isAllSelected,
}: {
  classes: ClassData[];
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onView: (cls: ClassData) => void;
  getInitials: (name: string) => string;
  isAllSelected: boolean;
}) {
  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <BookOpen className="h-12 w-12 mb-3 opacity-50" />
        <p className="text-sm font-medium">No classes found</p>
        <p className="text-xs mt-1">Try adjusting your filters or search query</p>
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
          <TableHead>Class</TableHead>
          <TableHead>Teacher</TableHead>
          <TableHead className="text-center">Students</TableHead>
          <TableHead className="text-center">Assignments</TableHead>
          <TableHead className="hidden md:table-cell">Schedule</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px] text-right pr-6">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {classes.map((cls) => {
          const status = statusConfig[cls.status];
          return (
            <TableRow key={cls.id} className="hover:bg-muted/50">
              <TableCell className="pl-6">
                <Checkbox
                  checked={selectedIds.has(cls.id)}
                  onCheckedChange={() => toggleSelect(cls.id)}
                />
              </TableCell>
              <TableCell>
                <div className="min-w-0">
                  <p className="truncate font-medium">{cls.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge variant="secondary" className="font-mono text-[10px]">{cls.code}</Badge>
                    <span className="text-xs text-muted-foreground">{cls.subject}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {getInitials(cls.teacher)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{cls.teacher}</span>
                </div>
              </TableCell>
              <TableCell className="text-center text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {cls.students}
                </div>
              </TableCell>
              <TableCell className="text-center text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-1">
                  <ClipboardList className="h-3.5 w-3.5" />
                  {cls.assignments}
                </div>
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{cls.schedule || "—"}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={status.color}>
                  {status.label}
                </Badge>
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
                    <DropdownMenuItem onClick={() => onView(cls)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(cls.id)}>
                      {cls.status === "archived" ? (
                        <><ArchiveRestore className="mr-2 h-4 w-4" /> Unarchive</>
                      ) : (
                        <><Archive className="mr-2 h-4 w-4" /> Archive</>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => onDelete(cls.id)}>
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
