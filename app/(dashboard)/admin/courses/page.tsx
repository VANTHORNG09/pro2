"use client";

import { useState } from "react";
import { Search, Plus, Download, BookOpen, Users, ClipboardList, MoreHorizontal, Eye, Edit, Trash2, Send, Archive } from "lucide-react";
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

type CourseStatus = "active" | "inactive" | "archived";

interface CourseData {
  id: string;
  name: string;
  code: string;
  subject: string;
  credits: number;
  teacher: string;
  students: number;
  assignments: number;
  status: CourseStatus;
  description: string;
}

const mockCourses: CourseData[] = [
  { id: "1", name: "Introduction to Computer Science", code: "CS101", subject: "Computer Science", credits: 3, teacher: "Dr. Sarah Johnson", students: 120, assignments: 8, status: "active", description: "Foundations of programming and computational thinking." },
  { id: "2", name: "Data Structures and Algorithms", code: "CS201", subject: "Computer Science", credits: 4, teacher: "Prof. Michael Chen", students: 85, assignments: 12, status: "active", description: "Advanced data structures and algorithm analysis." },
  { id: "3", name: "Database Management Systems", code: "CS301", subject: "Computer Science", credits: 3, teacher: "Prof. Michael Chen", students: 60, assignments: 6, status: "active", description: "Relational databases, SQL, and NoSQL systems." },
  { id: "4", name: "Calculus I", code: "MATH101", subject: "Mathematics", credits: 4, teacher: "Dr. Emily White", students: 150, assignments: 10, status: "active", description: "Introduction to differential and integral calculus." },
  { id: "5", name: "Organic Chemistry", code: "CHEM202", subject: "Chemistry", credits: 4, teacher: "Prof. James Miller", students: 75, assignments: 8, status: "inactive", description: "Organic chemistry fundamentals and reactions." },
  { id: "6", name: "Physics Mechanics", code: "PHY201", subject: "Physics", credits: 3, teacher: "Prof. David Brown", students: 90, assignments: 7, status: "archived", description: "Classical mechanics and thermodynamics." },
];

const statusConfig: Record<CourseStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400" },
  inactive: { label: "Inactive", color: "bg-slate-500/10 text-slate-500 border-slate-500/20 dark:text-slate-400" },
  archived: { label: "Archived", color: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400" },
};

const subjects = [...new Set(mockCourses.map((c) => c.subject))];

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

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseData[]>(mockCourses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailCourse, setDetailCourse] = useState<CourseData | null>(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    subject: "",
    credits: "3",
    description: "",
  });

  const filtered = courses.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchSubject = subjectFilter === "all" || c.subject === subjectFilter;
    return matchSearch && matchStatus && matchSubject;
  });

  const counts = {
    total: courses.length,
    active: courses.filter((c) => c.status === "active").length,
    totalStudents: courses.reduce((sum, c) => sum + c.students, 0),
    totalAssignments: courses.reduce((sum, c) => sum + c.assignments, 0),
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

  const handleAdd = () => {
    if (!form.name || !form.code) return;
    setCourses((prev) => [
      ...prev,
      {
        ...form,
        id: String(prev.length + 1),
        credits: parseInt(form.credits) || 3,
        teacher: "",
        students: 0,
        assignments: 0,
        status: "active",
      },
    ]);
    setForm({ name: "", code: "", subject: "", credits: "3", description: "" });
    setAddDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Course Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage courses, subjects, and curriculum structure.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const headers = [
                "Name",
                "Code",
                "Subject",
                "Credits",
                "Students",
                "Assignments",
                "Status",
              ];
              const rows = filtered.map((c) => [
                c.name,
                c.code,
                c.subject,
                String(c.credits),
                String(c.students),
                String(c.assignments),
                c.status,
              ]);
              const csv = [
                headers.join(","),
                ...rows.map((r) => r.map((col) => `"${col}"`).join(",")),
              ].join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "courses.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          title="Total Courses"
          value={counts.total}
          subtitle={`${counts.active} active`}
          icon={BookOpen}
          color="bg-blue-500/10 text-blue-500"
        />
        <DashboardStat
          title="Total Students"
          value={counts.totalStudents}
          subtitle="across all courses"
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
          title="Subjects"
          value={subjects.length}
          subtitle="unique subjects"
          icon={BookOpen}
          color="bg-amber-500/10 text-amber-500"
        />
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <span className="text-sm font-medium">
            {selectedIds.size} course(s) selected
          </span>
          <Button
            size="sm"
            variant="destructive"
            className="ml-auto"
            onClick={() => {
              setCourses((prev) => prev.filter((c) => !selectedIds.has(c.id)));
              setSelectedIds(new Set());
            }}
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            Delete
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedIds(new Set())}
          >
            Clear
          </Button>
        </div>
      )}

      {/* Tabs & Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Courses</CardTitle>
              <CardDescription>{filtered.length} course(s) found</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10 pl-6">
                      <Checkbox
                        checked={
                          selectedIds.size === filtered.length &&
                          filtered.length > 0
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">Credits</TableHead>
                    <TableHead className="text-center">Students</TableHead>
                    <TableHead className="text-center">Assignments</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px] text-right pr-6">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => {
                    const status = statusConfig[c.status];
                    return (
                      <TableRow key={c.id} className="hover:bg-muted/50">
                        <TableCell className="pl-6">
                          <Checkbox
                            checked={selectedIds.has(c.id)}
                            onCheckedChange={() => toggleSelect(c.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{c.name}</p>
                            <p className="truncate text-xs text-muted-foreground mt-0.5">
                              {c.description.slice(0, 50)}...
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono text-xs">
                            {c.code}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-sm">
                          {c.credits}
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {c.students}
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {c.assignments}
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
                              <DropdownMenuItem
                                onClick={() => setDetailCourse(c)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 dark:text-red-400"
                                onClick={() => handleDelete(c.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="active" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">Students</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered
                    .filter((c) => c.status === "active")
                    .map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{c.subject}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {c.students}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusConfig[c.status].color}
                          >
                            {statusConfig[c.status].label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      {detailCourse && (
        <Dialog open={!!detailCourse} onOpenChange={() => setDetailCourse(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{detailCourse.name}</DialogTitle>
              <DialogDescription>
                {detailCourse.code} · {detailCourse.subject}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {detailCourse.description}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Credits
                  </Label>
                  <p className="font-medium mt-1">{detailCourse.credits}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Students
                  </Label>
                  <p className="font-medium mt-1">{detailCourse.students}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Assignments
                  </Label>
                  <p className="font-medium mt-1">{detailCourse.assignments}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Status
                  </Label>
                  <p className="mt-1">
                    <Badge
                      variant="outline"
                      className={statusConfig[detailCourse.status].color}
                    >
                      {statusConfig[detailCourse.status].label}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailCourse(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>
              Create a new course in the curriculum.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="c-name">Course Name</Label>
              <Input
                id="c-name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Introduction to Computer Science"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="c-code">Course Code</Label>
                <Input
                  id="c-code"
                  value={form.code}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, code: e.target.value }))
                  }
                  placeholder="CS101"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-credits">Credits</Label>
                <Input
                  id="c-credits"
                  type="number"
                  value={form.credits}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, credits: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-subject">Subject</Label>
              <Select
                value={form.subject}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, subject: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-desc">Description</Label>
              <Textarea
                id="c-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Brief description..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Create Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
