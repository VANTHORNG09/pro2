"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  Users,
  BookOpen,
  Archive,
  ArchiveRestore,
  Eye,
  Download,
  Calendar,
  MapPin,
  Clock,
  GraduationCap,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  useClasses,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
  useClassStudents,
  useEnrollStudent,
  useRemoveStudent,
  useArchiveClass,
  useUnarchiveClass,
} from "@/lib/hooks/queries/useClasses";
import { useUsers } from "@/lib/hooks/queries/useUsers";
import { useToast } from "@/hooks/use-toast";
import type { Class, ClassStatus, CreateClassData } from "@/lib/types/classes";
import type { ApiUser } from "@/lib/api/users";

// ─── Export classes to CSV ────────────────────────────────────────────
function exportClassesToCSV(classes: Class[]) {
  const headers = ["Name", "Code", "Teacher", "Subject", "Students", "Assignments", "Status", "Schedule", "Room", "Semester", "Year", "Created"];
  const rows = classes.map((c) => [
    c.name,
    c.code,
    c.teacherName,
    c.subject,
    c.studentCount,
    c.assignmentCount,
    c.status,
    c.schedule ?? "",
    c.room ?? "",
    c.semester ?? "",
    c.year?.toString() ?? "",
    new Date(c.createdAt).toLocaleDateString(),
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = `classes-export-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
}

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

// ─── Teacher Selector Sub-Component ───────────────────────────────────
function TeacherSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const { data: users = [], isLoading } = useUsers({ role: "teacher" });

  return (
    <div className="space-y-2">
      <Label htmlFor="cls-teacher">Assign Teacher</Label>
      <Select value={value || "none"} onValueChange={(v) => onChange(v === "none" ? "" : v)}>
        <SelectTrigger id="cls-teacher">
          <SelectValue placeholder="Select a teacher..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Select a teacher...</SelectItem>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading teachers...
            </SelectItem>
          ) : (
            users.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.fullName} ({u.email})
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── Manage Students Modal ────────────────────────────────────────────
function ManageStudentsModal({
  classItem,
  onClose,
}: {
  classItem: Class;
  onClose: () => void;
}) {
  const { data: students = [], isLoading } = useClassStudents(classItem.id);
  const enrollStudent = useEnrollStudent();
  const removeStudent = useRemoveStudent();
  const { data: allUsers = [] } = useUsers({ role: "student" });
  const { toast } = useToast();

  const [studentEmail, setStudentEmail] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
  const [removeStudentId, setRemoveStudentId] = useState<number | null>(null);

  const handleEnroll = () => {
    const student = allUsers.find((u) => u.email === studentEmail.trim());
    if (!student) {
      toast({
        title: "Student not found",
        description: "No student matches that email.",
        variant: "destructive",
      });
      return;
    }
    enrollStudent.mutate(
      { classId: classItem.id, studentId: parseInt(student.id) },
      {
        onSuccess: () => {
          setStudentEmail("");
          toast({ title: "Student enrolled", description: "The student has been added to the class." });
        },
      }
    );
  };

  const handleRemove = (studentId: number) => {
    setRemoveStudentId(studentId);
    setRemoveConfirmOpen(true);
  };

  const confirmRemoveStudent = () => {
    if (removeStudentId) {
      removeStudent.mutate(
        { classId: classItem.id, studentId: removeStudentId },
        {
          onSuccess: () =>
            toast({ title: "Student removed", description: "The student has been removed from the class." }),
        }
      );
      setRemoveConfirmOpen(false);
      setRemoveStudentId(null);
    }
  };

  const filteredStudents = students.filter((s) => {
    if (!searchStudent) return true;
    const q = searchStudent.toLowerCase();
    return s.studentName.toLowerCase().includes(q) || s.studentEmail.toLowerCase().includes(q);
  });

  return (
    <>
      <Dialog open={!!classItem} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Manage Students
            </DialogTitle>
            <DialogDescription>
              {classItem.name} ({classItem.code})
            </DialogDescription>
          </DialogHeader>

          {/* Enroll Student */}
          <div className="space-y-3">
            <Label>Enroll Student</Label>
            <div className="flex gap-2">
              <Select value={studentEmail} onValueChange={setStudentEmail}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a student..." />
                </SelectTrigger>
                <SelectContent>
                  {allUsers
                    .filter((u) => !students.some((s) => s.studentEmail === u.email))
                    .map((u) => (
                      <SelectItem key={u.id} value={u.email}>
                        {u.fullName} ({u.email})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button onClick={handleEnroll} disabled={!studentEmail || enrollStudent.isPending}>
                {enrollStudent.isPending ? "Enrolling..." : "Enroll"}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Student List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Enrolled Students ({filteredStudents.length})</Label>
              <Input
                placeholder="Search..."
                className="w-48"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
              />
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Loading students...
              </div>
            ) : filteredStudents.length > 0 ? (
              <div className="space-y-2">
                {filteredStudents.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                          {s.studentName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{s.studentName}</p>
                        <p className="text-xs text-muted-foreground">{s.studentEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={s.status === "active" ? "default" : "secondary"}>
                        {s.status}
                      </Badge>
                      {s.grade != null && <span className="text-xs font-medium">Grade: {s.grade}</span>}
                      {s.submissionCount != null && (
                        <span className="text-xs text-muted-foreground">{s.submissionCount} submissions</span>
                      )}
                      <Button size="icon-sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleRemove(s.studentId)} title="Remove student">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
                <Users className="h-8 w-8" />
                <p className="text-sm">No students enrolled yet</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Student Confirmation */}
      <AlertDialog open={removeConfirmOpen} onOpenChange={setRemoveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove student?</AlertDialogTitle>
            <AlertDialogDescription>
              This will unenroll the student from this class. Their submissions and grades will be retained in the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveStudent} className="bg-destructive text-destructive-foreground">
              Remove Student
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function AdminClassesPage() {
  const router = useRouter();
  const { data: classes = [], isLoading } = useClasses({});
  const createClass = useCreateClass();
  const deleteClass = useDeleteClass();
  const archiveClass = useArchiveClass();
  const unarchiveClass = useUnarchiveClass();

  const [updateClassId, setUpdateClassId] = useState<number | undefined>(undefined);
  const updateClass = useUpdateClass(updateClassId);

  const { toast } = useToast();

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClassStatus | "all">("all");
  const [activeTab, setActiveTab] = useState("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [managingClass, setManagingClass] = useState<Class | null>(null);
  const [detailsClass, setDetailsClass] = useState<Class | null>(null);

  // Bulk selection
  const [selectedClassIds, setSelectedClassIds] = useState<Set<number>>(new Set());

  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteClassId, setDeleteClassId] = useState<number | null>(null);

  // Bulk action confirmation
  const [bulkActionConfirmOpen, setBulkActionConfirmOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<"delete" | "archive" | "unarchive" | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    subject: "",
    teacherId: "",
    status: "active" as ClassStatus,
    schedule: "",
    room: "",
    semester: "",
    year: new Date().getFullYear(),
  });

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      subject: "",
      teacherId: "",
      status: "active",
      schedule: "",
      room: "",
      semester: "",
      year: new Date().getFullYear(),
    });
    setEditingClass(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (cls: Class) => {
    setFormData({
      name: cls.name,
      code: cls.code,
      description: cls.description,
      subject: cls.subject,
      teacherId: cls.teacherId.toString(),
      status: cls.status,
      schedule: cls.schedule ?? "",
      room: cls.room ?? "",
      semester: cls.semester ?? "",
      year: cls.year ?? new Date().getFullYear(),
    });
    setEditingClass(cls);
    setIsModalOpen(true);
  };

  const openManageStudents = (cls: Class) => {
    setManagingClass(cls);
  };

  const openClassDetails = (cls: Class) => {
    setDetailsClass(cls);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const closeManageStudents = () => {
    setManagingClass(null);
  };

  const closeClassDetails = () => {
    setDetailsClass(null);
  };

  const handleSaveClass = () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      toast({ title: "Validation Error", description: "Class name and code are required.", variant: "destructive" });
      return;
    }

    const payload: CreateClassData = {
      name: formData.name,
      code: formData.code,
      description: formData.description,
      subject: formData.subject,
      schedule: formData.schedule || undefined,
      room: formData.room || undefined,
      semester: formData.semester || undefined,
      year: formData.year || undefined,
    };

    if (editingClass) {
      setUpdateClassId(editingClass.id);
      updateClass.mutate(
        { ...payload, status: formData.status },
        {
          onSuccess: () => {
            closeModal();
            toast({ title: "Class updated", description: `${formData.name} has been updated.` });
          },
        }
      );
    } else {
      createClass.mutate(payload, {
        onSuccess: () => {
          closeModal();
          toast({ title: "Class created", description: `${formData.name} has been created.` });
        },
      });
    }
  };

  const handleDeleteClass = (id: number) => {
    setDeleteClassId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteClass = () => {
    if (deleteClassId) {
      deleteClass.mutate(deleteClassId, {
        onSuccess: () => toast({ title: "Class deleted", description: "The class has been removed." }),
      });
      setDeleteConfirmOpen(false);
      setDeleteClassId(null);
    }
  };

  const handleToggleArchive = (cls: Class) => {
    if (cls.status === "archived") {
      unarchiveClass.mutate(cls.id, {
        onSuccess: () => toast({ title: "Class unarchived", description: `${cls.name} is now active.` }),
      });
    } else {
      archiveClass.mutate(cls.id, {
        onSuccess: () => toast({ title: "Class archived", description: `${cls.name} has been archived.` }),
      });
    }
  };

  // ─── Bulk Actions ───────────────────────────────────────────────────
  const toggleSelectClass = (id: number) => {
    setSelectedClassIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedClassIds.size === filteredClasses.length) {
      setSelectedClassIds(new Set());
    } else {
      setSelectedClassIds(new Set(filteredClasses.map((c) => c.id)));
    }
  };

  const handleBulkAction = (action: "delete" | "archive" | "unarchive") => {
    setBulkAction(action);
    setBulkActionConfirmOpen(true);
  };

  const confirmBulkAction = () => {
    if (!bulkAction || selectedClassIds.size === 0) return;

    selectedClassIds.forEach((id) => {
      if (bulkAction === "delete") deleteClass.mutate(id);
      else if (bulkAction === "archive") archiveClass.mutate(id);
      else if (bulkAction === "unarchive") unarchiveClass.mutate(id);
    });

    toast({
      title: `Bulk ${bulkAction} complete`,
      description: `${selectedClassIds.size} class(es) have been ${bulkAction === "delete" ? "removed" : bulkAction}.`,
    });

    setSelectedClassIds(new Set());
    setBulkActionConfirmOpen(false);
    setBulkAction(null);
  };

  const clearSelection = () => setSelectedClassIds(new Set());

  // ─── Filtering ──────────────────────────────────────────────────────
  const filteredClasses = classes.filter((c) => {
    if (activeTab !== "all" && c.status !== activeTab) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.teacherName.toLowerCase().includes(q);
    }
    return true;
  });

  // ─── Stats ──────────────────────────────────────────────────────────
  const totalStudents = classes.reduce((sum, c) => sum + c.studentCount, 0);
  const totalAssignments = classes.reduce((sum, c) => sum + c.assignmentCount, 0);
  const activeClasses = classes.filter((c) => c.status === "active").length;
  const archivedClasses = classes.filter((c) => c.status === "archived").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Class Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage all classes: create, assign teachers, add/remove students, archive, and edit details.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportClassesToCSV(filteredClasses)} disabled={filteredClasses.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          title="Total Classes"
          value={classes.length}
          subtitle={`${activeClasses} active, ${archivedClasses} archived`}
          icon={<BookOpen className="h-4 w-4" />}
          trend={archivedClasses > 0 ? { value: `${archivedClasses} archived`, positive: false } : undefined}
        />
        <DashboardStat
          title="Active Classes"
          value={activeClasses}
          subtitle={`${classes.length - activeClasses} inactive`}
          icon={<BookOpen className="h-4 w-4" />}
        />
        <DashboardStat
          title="Total Students"
          value={totalStudents}
          subtitle="across all classes"
          icon={<Users className="h-4 w-4" />}
        />
        <DashboardStat
          title="Total Assignments"
          value={totalAssignments}
          subtitle="created assignments"
          icon={<FileText className="h-4 w-4" />}
        />
      </div>

      {/* Bulk Action Bar */}
      {selectedClassIds.size > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-3 py-4">
            <span className="text-sm font-medium">{selectedClassIds.size} class(es) selected</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("archive")}>
                <Archive className="mr-1 h-3.5 w-3.5" />
                Archive
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("unarchive")}>
                <ArchiveRestore className="mr-1 h-3.5 w-3.5" />
                Unarchive
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
            <Button size="sm" variant="ghost" onClick={clearSelection} className="ml-auto">
              Clear
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Classes</CardTitle>
              <CardDescription>{filteredClasses.length} class(es) found</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search classes..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ClassStatus | "all")}>
                <SelectTrigger className="w-[140px]">
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
          {/* Status Tabs */}
          <div className="px-6 pt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
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
                      checked={filteredClasses.length > 0 && selectedClassIds.size === filteredClasses.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Assignments</TableHead>
                  <TableHead className="hidden md:table-cell">Schedule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[140px] text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span className="text-sm">Loading classes...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredClasses.length > 0 ? (
                  filteredClasses.map((c) => (
                    <TableRow key={c.id} className="hover:bg-muted/50">
                      <TableCell className="pl-6">
                        <Checkbox
                          checked={selectedClassIds.has(c.id)}
                          onCheckedChange={() => toggleSelectClass(c.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{c.name}</p>
                          <div className="flex items-center gap-1.5">
                            <Badge variant="secondary" className="font-mono text-xs">
                              {c.code}
                            </Badge>
                            {c.subject && <span className="text-xs text-muted-foreground">{c.subject}</span>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                              {c.teacherName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{c.teacherName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{c.studentCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{c.assignmentCount}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {c.schedule || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              c.status === "active" ? "bg-emerald-500" : c.status === "archived" ? "bg-amber-500" : "bg-muted"
                            }`}
                          />
                          <span className="text-sm capitalize">{c.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1">
                          <Button size="icon-sm" variant="ghost" onClick={() => openClassDetails(c)} title="View details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon-sm" variant="ghost" onClick={() => openManageStudents(c)} title="Manage students">
                            <Users className="h-4 w-4" />
                          </Button>
                          <Button size="icon-sm" variant="ghost" onClick={() => openEditModal(c)} title="Edit class">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => handleToggleArchive(c)}
                            title={c.status === "archived" ? "Unarchive" : "Archive"}
                          >
                            {c.status === "archived" ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClass(c.id)}
                            title="Delete class"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <BookOpen className="h-8 w-8" />
                        <p className="text-sm">No classes found</p>
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

      {/* ─── Add / Edit Class Dialog ────────────────────────────────── */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingClass ? "Edit Class" : "Add Class"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <TeacherSelector
              value={formData.teacherId}
              onChange={(val) => setFormData((prev) => ({ ...prev, teacherId: val }))}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="cls-name">Class Name</Label>
                <Input
                  id="cls-name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Web Development A"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cls-code">Class Code</Label>
                <Input
                  id="cls-code"
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                  placeholder="CS301"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cls-subject">Subject</Label>
                <Input
                  id="cls-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Computer Science"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cls-room">Room</Label>
                <Input
                  id="cls-room"
                  value={formData.room}
                  onChange={(e) => setFormData((prev) => ({ ...prev, room: e.target.value }))}
                  placeholder="Room 204"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cls-semester">Semester</Label>
                <Input
                  id="cls-semester"
                  value={formData.semester}
                  onChange={(e) => setFormData((prev) => ({ ...prev, semester: e.target.value }))}
                  placeholder="Spring"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cls-schedule">Schedule</Label>
                <Input
                  id="cls-schedule"
                  value={formData.schedule}
                  onChange={(e) => setFormData((prev) => ({ ...prev, schedule: e.target.value }))}
                  placeholder="Mon/Wed 10:00-11:30 AM"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cls-year">Year</Label>
                <Input
                  id="cls-year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData((prev) => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                />
              </div>

              {editingClass && (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="cls-status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData((prev) => ({ ...prev, status: v as ClassStatus }))}
                  >
                    <SelectTrigger id="cls-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="cls-desc">Description</Label>
                <textarea
                  id="cls-desc"
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the class..."
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveClass}>{editingClass ? "Update Class" : "Save Class"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Class Details Dialog ───────────────────────────────────── */}
      {detailsClass && (
        <Dialog open={!!detailsClass} onOpenChange={closeClassDetails}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {detailsClass.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={detailsClass.status === "active" ? "default" : detailsClass.status === "archived" ? "secondary" : "outline"}>
                  {detailsClass.status}
                </Badge>
                <Badge variant="secondary" className="font-mono">
                  {detailsClass.code}
                </Badge>
                {detailsClass.subject && <span className="text-sm text-muted-foreground">{detailsClass.subject}</span>}
              </div>

              <p className="text-sm text-muted-foreground">{detailsClass.description}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem icon={<Users className="h-4 w-4" />} label="Teacher" value={detailsClass.teacherName} />
                <DetailItem icon={<GraduationCap className="h-4 w-4" />} label="Students" value={detailsClass.studentCount.toString()} />
                <DetailItem icon={<FileText className="h-4 w-4" />} label="Assignments" value={detailsClass.assignmentCount.toString()} />
                {detailsClass.schedule && <DetailItem icon={<Clock className="h-4 w-4" />} label="Schedule" value={detailsClass.schedule} />}
                {detailsClass.room && <DetailItem icon={<MapPin className="h-4 w-4" />} label="Room" value={detailsClass.room} />}
                {detailsClass.semester && (
                  <DetailItem icon={<Calendar className="h-4 w-4" />} label="Semester" value={`${detailsClass.semester} ${detailsClass.year}`} />
                )}
              </div>

              <div className="rounded-lg border p-3 text-xs text-muted-foreground">
                <p>Created: {new Date(detailsClass.createdAt).toLocaleDateString()}</p>
                <p>Last Updated: {new Date(detailsClass.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button onClick={() => { closeClassDetails(); openManageStudents(detailsClass); }}>
                <Users className="mr-2 h-4 w-4" />
                Manage Students
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ─── Manage Students Dialog ─────────────────────────────────── */}
      {managingClass && <ManageStudentsModal classItem={managingClass} onClose={closeManageStudents} />}

      {/* ─── Delete Confirmation ────────────────────────────────────── */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the class and all associated data including assignments and enrollments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteClass} className="bg-destructive text-destructive-foreground">
              Delete Class
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── Bulk Action Confirmation ───────────────────────────────── */}
      <AlertDialog open={bulkActionConfirmOpen} onOpenChange={setBulkActionConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkAction === "delete"
                ? "Delete selected classes?"
                : `${bulkAction?.charAt(0).toUpperCase()}${bulkAction?.slice(1)} selected classes?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to {bulkAction} {selectedClassIds.size} class(es). This action{" "}
              {bulkAction === "delete" ? "cannot be undone" : "may take a moment to complete"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkAction} className={bulkAction === "delete" ? "bg-destructive text-destructive-foreground" : ""}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
