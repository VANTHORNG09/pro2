"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  BookOpen,
  Users,
  GraduationCap,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Calendar,
  MapPin,
  Clock,
  FileText,
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

import { useClasses, useCreateClass, useUpdateClass, useDeleteClass } from "@/lib/hooks/queries/useClasses";
import { useToast } from "@/hooks/use-toast";
import type { Class, CreateClassData } from "@/lib/types/classes";

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

// ─── Main Page ────────────────────────────────────────────────────────
export default function AdminCoursesPage() {
  const { data: classes = [], isLoading } = useClasses({});
  const { toast } = useToast();

  const createClass = useCreateClass();
  const deleteClass = useDeleteClass();

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Class | null>(null);
  const [detailsCourse, setDetailsCourse] = useState<Class | null>(null);

  // Mutation hooks - updateClass needs the ID passed to the hook
  const updateClass = useUpdateClass(editingCourse?.id);

  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    subject: "",
    description: "",
    credits: "3",
    department: "",
  });

  const resetForm = () => {
    setFormData({ name: "", code: "", subject: "", description: "", credits: "3", department: "" });
    setEditingCourse(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (course: Class) => {
    setFormData({
      name: course.name,
      code: course.code,
      subject: course.subject,
      description: course.description,
      credits: "3",
      department: "",
    });
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const openDetails = (course: Class) => {
    setDetailsCourse(course);
  };

  const closeDetails = () => {
    setDetailsCourse(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      toast({
        title: "Validation Error",
        description: "Course name and code are required.",
        variant: "destructive",
      });
      return;
    }

    const payload: CreateClassData = {
      name: formData.name,
      code: formData.code,
      description: formData.description,
      subject: formData.subject,
      schedule: undefined,
      room: undefined,
      semester: undefined,
      year: undefined,
    };

    if (editingCourse) {
      updateClass.mutate(
        { ...payload, status: editingCourse.status },
        {
          onSuccess: () => {
            closeModal();
            toast({ title: "Course updated", description: `${formData.name} has been updated successfully.` });
          },
          onError: () => {
            toast({ title: "Error", description: "Failed to update course.", variant: "destructive" });
          },
        }
      );
    } else {
      createClass.mutate(payload, {
        onSuccess: () => {
          closeModal();
          toast({ title: "Course created", description: `${formData.name} has been created successfully.` });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to create course.", variant: "destructive" });
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    setDeleteCourseId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteCourseId) {
      deleteClass.mutate(deleteCourseId, {
        onSuccess: () => {
          toast({ title: "Course deleted", description: "The course has been removed successfully." });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to delete course.", variant: "destructive" });
        },
        onSettled: () => {
          setDeleteConfirmOpen(false);
          setDeleteCourseId(null);
        },
      });
    }
  };

  // Extract unique subjects
  const subjects = [...new Set(classes.map((c) => c.subject).filter(Boolean))];

  const filteredClasses = classes.filter((c) => {
    if (activeTab !== "all" && c.subject !== activeTab) return false;
    if (subjectFilter !== "all" && c.subject !== subjectFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q);
    }
    return true;
  });

  const totalEnrollments = classes.reduce((sum, c) => sum + c.studentCount, 0);
  const activeCourses = classes.filter((c) => c.status === "active").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Course Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage courses, subjects, and curriculum structure across departments.
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          title="Total Courses"
          value={classes.length}
          subtitle={`${activeCourses} active`}
          icon={<BookOpen className="h-4 w-4" />}
        />
        <DashboardStat
          title="Active Courses"
          value={activeCourses}
          subtitle={`${classes.length - activeCourses} inactive`}
          icon={<BookOpen className="h-4 w-4" />}
        />
        <DashboardStat
          title="Total Enrollments"
          value={totalEnrollments}
          subtitle="student enrollments"
          icon={<Users className="h-4 w-4" />}
        />
        <DashboardStat
          title="Subjects"
          value={subjects.length}
          subtitle="unique subjects"
          icon={<GraduationCap className="h-4 w-4" />}
        />
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Courses</CardTitle>
              <CardDescription>{filteredClasses.length} course(s) found</CardDescription>
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
                <SelectTrigger className="w-[160px]">
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
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          {/* Subject Tabs */}
          <div className="px-6 pt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                {subjects.map((s) => (
                  <TabsTrigger key={s} value={s}>
                    {s}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Table */}
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Course</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Students</TableHead>
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
                        <span className="text-sm">Loading courses...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredClasses.length > 0 ? (
                  filteredClasses.map((c) => (
                    <TableRow key={c.id} className="hover:bg-muted/50">
                      <TableCell className="pl-6">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{c.name}</p>
                          <p className="truncate text-sm text-muted-foreground">{c.description.slice(0, 50)}...</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono text-xs">
                          {c.code}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {c.subject ? (
                          <Badge variant="outline">{c.subject}</Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
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
                          <Button size="icon-sm" variant="ghost" onClick={() => openDetails(c)} title="View details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon-sm" variant="ghost" onClick={() => openEditModal(c)} title="Edit course">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(c.id)}
                            title="Delete course"
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
                        <BookOpen className="h-8 w-8" />
                        <p className="text-sm">No courses found</p>
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

      {/* ─── Add / Edit Course Dialog ───────────────────────────────── */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Edit Course" : "Add Course"}</DialogTitle>
            <DialogDescription>
              {editingCourse ? "Update the course details below." : "Fill in the details to create a new course."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course-name">Course Name</Label>
              <Input
                id="course-name"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="Introduction to Computer Science"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="course-code">Course Code</Label>
                <Input
                  id="course-code"
                  value={formData.code}
                  onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
                  placeholder="CS101"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-credits">Credits</Label>
                <Input
                  id="course-credits"
                  type="number"
                  value={formData.credits}
                  onChange={(e) => setFormData((p) => ({ ...p, credits: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="course-subject">Subject</Label>
                <Input
                  id="course-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                  placeholder="Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-dept">Department</Label>
                <Input
                  id="course-dept"
                  value={formData.department}
                  onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))}
                  placeholder="Engineering"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course-desc">Description</Label>
              <textarea
                id="course-desc"
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Brief description of the course..."
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>{editingCourse ? "Update Course" : "Save Course"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Course Details Dialog ──────────────────────────────────── */}
      {detailsCourse && (
        <Dialog open={!!detailsCourse} onOpenChange={closeDetails}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {detailsCourse.name}
              </DialogTitle>
              <DialogDescription>
                View detailed information about this course.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    detailsCourse.status === "active"
                      ? "default"
                      : detailsCourse.status === "archived"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {detailsCourse.status}
                </Badge>
                <Badge variant="secondary" className="font-mono">
                  {detailsCourse.code}
                </Badge>
                {detailsCourse.subject && (
                  <span className="text-sm text-muted-foreground">{detailsCourse.subject}</span>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                {detailsCourse.description || "No description available."}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem
                  icon={<Users className="h-4 w-4" />}
                  label="Students"
                  value={detailsCourse.studentCount.toString()}
                />
                <DetailItem
                  icon={<FileText className="h-4 w-4" />}
                  label="Assignments"
                  value={detailsCourse.assignmentCount.toString()}
                />
                <DetailItem
                  icon={<GraduationCap className="h-4 w-4" />}
                  label="Teacher"
                  value={detailsCourse.teacherName}
                />
                {detailsCourse.schedule && (
                  <DetailItem
                    icon={<Clock className="h-4 w-4" />}
                    label="Schedule"
                    value={detailsCourse.schedule}
                  />
                )}
                {detailsCourse.room && (
                  <DetailItem
                    icon={<MapPin className="h-4 w-4" />}
                    label="Room"
                    value={detailsCourse.room}
                  />
                )}
                {detailsCourse.semester && (
                  <DetailItem
                    icon={<Calendar className="h-4 w-4" />}
                    label="Semester"
                    value={`${detailsCourse.semester} ${detailsCourse.year}`}
                  />
                )}
              </div>

              <div className="rounded-lg border p-3 text-xs text-muted-foreground">
                <p>Created: {new Date(detailsCourse.createdAt).toLocaleDateString()}</p>
                <p>Last Updated: {new Date(detailsCourse.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button onClick={() => { closeDetails(); openEditModal(detailsCourse); }}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Course
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ─── Delete Confirmation Dialog with Tabs ──────────────────── */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Course
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
                  {classes.find((c) => c.id === deleteCourseId)?.name || "Unknown Course"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {classes.find((c) => c.id === deleteCourseId)?.code || ""}
                </p>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 p-3 dark:bg-amber-500/10">
                <span className="mt-0.5 text-amber-500">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    This action cannot be undone
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400/80">
                    All associated data will be permanently removed from the system.
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
                    label="Students"
                    value={`${classes.find((c) => c.id === deleteCourseId)?.studentCount || 0} enrolled`}
                  />
                  <DetailItem
                    icon={<FileText className="h-4 w-4" />}
                    label="Assignments"
                    value={`${classes.find((c) => c.id === deleteCourseId)?.assignmentCount || 0} assignments`}
                  />
                </div>

                <div className="rounded-lg border p-3">
                  <p className="text-sm font-medium">Teacher</p>
                  <p className="text-sm text-muted-foreground">
                    {classes.find((c) => c.id === deleteCourseId)?.teacherName || "Unknown"}
                  </p>
                </div>

                <div className="flex items-start gap-2 rounded-lg bg-red-500/10 p-3 dark:bg-red-500/10">
                  <span className="mt-0.5 text-red-500">🗑️</span>
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                      Permanent deletion
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400/80">
                      Student enrollments, assignments, submissions, and grades will be permanently removed.
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
                        Move to archive where it can be restored later
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 rounded-lg border p-3">
                    <input type="checkbox" className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Notify affected students</p>
                      <p className="text-xs text-muted-foreground">
                        Send email notification to enrolled students
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 rounded-lg border p-3">
                    <input type="checkbox" className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Transfer enrollments</p>
                      <p className="text-xs text-muted-foreground">
                        Move students to a different course before deletion
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
              Delete Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
