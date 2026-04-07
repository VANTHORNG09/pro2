// app/(dashboard)/admin/classes/page.tsx
"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Search,
  Users,
  BookOpen,
  Archive,
  ArchiveRestore,
  Eye,
  Download,
  CheckSquare,
  Square,
  Calendar,
  MapPin,
  Clock,
  GraduationCap,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/shared/stat-card";

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

export default function AdminClassesPage() {
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
      if (bulkAction === "delete") {
        deleteClass.mutate(id);
      } else if (bulkAction === "archive") {
        archiveClass.mutate(id);
      } else if (bulkAction === "unarchive") {
        unarchiveClass.mutate(id);
      }
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
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.teacherName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ─── Stats ──────────────────────────────────────────────────────────
  const totalStudents = classes.reduce((sum, c) => sum + c.studentCount, 0);
  const totalAssignments = classes.reduce((sum, c) => sum + c.assignmentCount, 0);
  const activeClasses = classes.filter((c) => c.status === "active").length;
  const archivedClasses = classes.filter((c) => c.status === "archived").length;

  return (
    <PageShell>
      <PageHeader
        title="Class Management"
        description="Manage all classes: create, assign teachers, add/remove students, archive, and edit details."
        action={
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
        }
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Classes" value={classes.length} subtitle="All classes" icon={<BookOpen className="h-4 w-4" />} />
        <StatCard title="Active Classes" value={activeClasses} subtitle="Currently active" />
        <StatCard title="Total Students" value={totalStudents} subtitle="Across all classes" icon={<Users className="h-4 w-4" />} />
        <StatCard title="Total Assignments" value={totalAssignments} subtitle="Created assignments" icon={<FileText className="h-4 w-4" />} />
      </div>

      {/* Bulk Action Bar */}
      {selectedClassIds.size > 0 && (
        <SectionCard title="">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {selectedClassIds.size} class(es) selected
            </span>
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
          </div>
        </SectionCard>
      )}

      {/* Filters */}
      <SectionCard title="Filters">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by class name, code, or teacher..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <select
            className="rounded-xl border border-border bg-background px-4 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ClassStatus | "all")}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </SectionCard>

      {/* Class Table */}
      <SectionCard
        title="Classes"
        description={`${filteredClasses.length} class(es) found`}
      >
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-left">
            <thead className="border-b border-border/60">
              <tr>
                <th className="px-4 py-3 w-10">
                  <Checkbox
                    checked={filteredClasses.length > 0 && selectedClassIds.size === filteredClasses.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Teacher</th>
                <th className="px-4 py-3">Students</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Loading classes...
                  </td>
                </tr>
              ) : filteredClasses.length > 0 ? (
                filteredClasses.map((c) => (
                  <tr key={c.id} className="border-b border-border/20 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedClassIds.has(c.id)}
                        onCheckedChange={() => toggleSelectClass(c.id)}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono">{c.code}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">{c.teacherName}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        {c.studentCount}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{c.subject}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => openClassDetails(c)}
                          title="View details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => openManageStudents(c)}
                          title="Manage students"
                        >
                          <Users className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => openEditModal(c)}
                          title="Edit class"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleToggleArchive(c)}
                          title={c.status === "archived" ? "Unarchive" : "Archive"}
                        >
                          {c.status === "archived" ? (
                            <ArchiveRestore className="h-3.5 w-3.5" />
                          ) : (
                            <Archive className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDeleteClass(c.id)}
                          title="Delete class"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    No classes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      year: parseInt(e.target.value) || new Date().getFullYear(),
                    }))
                  }
                />
              </div>

              {editingClass && (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="cls-status">Status</Label>
                  <select
                    id="cls-status"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as ClassStatus,
                      }))
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              )}

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="cls-desc">Description</Label>
                <textarea
                  id="cls-desc"
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Brief description of the class..."
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveClass}>
              {editingClass ? "Update Class" : "Save Class"}
            </Button>
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
                <StatusBadge status={detailsClass.status} />
                <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono">
                  {detailsClass.code}
                </span>
                <span className="text-sm text-muted-foreground">{detailsClass.subject}</span>
              </div>

              <p className="text-sm text-muted-foreground">{detailsClass.description}</p>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem icon={<Users className="h-4 w-4" />} label="Teacher" value={detailsClass.teacherName} />
                <DetailItem icon={<GraduationCap className="h-4 w-4" />} label="Students" value={detailsClass.studentCount.toString()} />
                <DetailItem icon={<FileText className="h-4 w-4" />} label="Assignments" value={detailsClass.assignmentCount.toString()} />
                {detailsClass.schedule && (
                  <DetailItem icon={<Clock className="h-4 w-4" />} label="Schedule" value={detailsClass.schedule} />
                )}
                {detailsClass.room && (
                  <DetailItem icon={<MapPin className="h-4 w-4" />} label="Room" value={detailsClass.room} />
                )}
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
      {managingClass && (
        <ManageStudentsModal
          classItem={managingClass}
          onClose={closeManageStudents}
        />
      )}

      {/* ─── Delete Confirmation ────────────────────────────────────── */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the class
              and all associated data including assignments and enrollments.
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
            <AlertDialogAction
              onClick={confirmBulkAction}
              className={bulkAction === "delete" ? "bg-destructive text-destructive-foreground" : ""}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
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
      <select
        id="cls-teacher"
        className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a teacher...</option>
        {isLoading ? (
          <option disabled>Loading teachers...</option>
        ) : (
          users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.fullName} ({u.email})
            </option>
          ))
        )}
      </select>
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
      toast({ title: "Student not found", description: "No student matches that email.", variant: "destructive" });
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
        { onSuccess: () => toast({ title: "Student removed", description: "The student has been removed from the class." }) }
      );
      setRemoveConfirmOpen(false);
      setRemoveStudentId(null);
    }
  };

  const filteredStudents = students.filter((s) => {
    if (!searchStudent) return true;
    const q = searchStudent.toLowerCase();
    return (
      s.studentName.toLowerCase().includes(q) ||
      s.studentEmail.toLowerCase().includes(q)
    );
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
            <p className="text-sm text-muted-foreground">
              {classItem.name} ({classItem.code})
            </p>
          </DialogHeader>

          {/* Enroll Student */}
          <SectionCard title="Enroll Student">
            <div className="flex gap-2">
              <select
                className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
              >
                <option value="">Select a student...</option>
                {allUsers
                  .filter(
                    (u) =>
                      !students.some((s) => s.studentEmail === u.email)
                  )
                  .map((u) => (
                    <option key={u.id} value={u.email}>
                      {u.fullName} ({u.email})
                    </option>
                  ))}
              </select>
              <Button onClick={handleEnroll} disabled={!studentEmail || enrollStudent.isPending}>
                {enrollStudent.isPending ? "Enrolling..." : "Enroll"}
              </Button>
            </div>
          </SectionCard>

          {/* Student List */}
          <SectionCard
            title={`Enrolled Students (${filteredStudents.length})`}
            action={
              <Input
                placeholder="Search..."
                className="w-48"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
              />
            }
          >
            {isLoading ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Loading students...</p>
            ) : filteredStudents.length > 0 ? (
              <div className="space-y-2">
                {filteredStudents.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {s.studentName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{s.studentName}</p>
                        <p className="text-xs text-muted-foreground">{s.studentEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={s.status} />
                      {s.grade != null && (
                        <span className="text-xs font-medium">Grade: {s.grade}</span>
                      )}
                      {s.submissionCount != null && (
                        <span className="text-xs text-muted-foreground">
                          {s.submissionCount} submissions
                        </span>
                      )}
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleRemove(s.studentId)}
                        title="Remove student"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No students enrolled yet.
              </p>
            )}
          </SectionCard>

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
