// app/(dashboard)/admin/courses/page.tsx
"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, X, Search, BookOpen, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/shared/stat-card";

import { useClasses } from "@/lib/hooks/queries/useClasses";
import type { Class } from "@/lib/types/classes";

export default function AdminCoursesPage() {
  const { data: classes = [], isLoading } = useClasses({});
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Class | null>(null);

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

  const openAddModal = () => { resetForm(); setIsModalOpen(true); };
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
  const closeModal = () => { setIsModalOpen(false); resetForm(); };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      alert("Please fill in course name and code");
      return;
    }
    // TODO: API call — create/update course
    alert(editingCourse ? "Course updated (placeholder)" : "Course created (placeholder)");
    closeModal();
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this course?")) {
      // TODO: API call — delete course
      alert("Course deleted (placeholder)");
    }
  };

  // Extract unique subjects
  const subjects = [...new Set(classes.map((c) => c.subject).filter(Boolean))];
  const filteredClasses = classes.filter((c) => {
    if (subjectFilter !== "all" && c.subject !== subjectFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalEnrollments = classes.reduce((sum, c) => sum + c.studentCount, 0);

  return (
    <PageShell>
      <PageHeader
        title="Course Management"
        description="Manage courses, subjects, and curriculum structure across departments."
        action={
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Courses" value={classes.length} subtitle="All courses" />
        <StatCard title="Active Courses" value={classes.filter((c) => c.status === "active").length} subtitle="Currently running" />
        <StatCard title="Total Enrollments" value={totalEnrollments} subtitle="Student enrollments" icon={<Users className="h-4 w-4" />} />
        <StatCard title="Subjects" value={subjects.length} subtitle="Unique subjects" icon={<BookOpen className="h-4 w-4" />} />
      </div>

      {/* Filters */}
      <SectionCard title="Filters">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by course name, code, or subject..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <select
            className="rounded-xl border border-border bg-background px-4 py-2 text-sm"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </SectionCard>

      {/* Course Table */}
      <SectionCard title="Courses">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-left">
            <thead className="border-b border-border/60">
              <tr>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Teacher</th>
                <th className="px-4 py-3">Students</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Loading courses...
                  </td>
                </tr>
              ) : filteredClasses.length > 0 ? (
                filteredClasses.map((c) => (
                  <tr key={c.id} className="border-b border-border/20">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-sm font-mono">{c.code}</td>
                    <td className="px-4 py-3 text-sm">{c.subject || "—"}</td>
                    <td className="px-4 py-3 text-sm">{c.teacherName}</td>
                    <td className="px-4 py-3 text-sm">{c.studentCount}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => openEditModal(c)}
                          title="Edit course"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDelete()}
                          title="Delete course"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingCourse ? "Edit Course" : "Add Course"}
              </h2>
              <button onClick={closeModal}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="course-name">Course Name</Label>
                <Input
                  id="course-name"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-code">Course Code</Label>
                <Input
                  id="course-code"
                  value={formData.code}
                  onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-subject">Subject</Label>
                <Input
                  id="course-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-dept">Department</Label>
                <Input
                  id="course-dept"
                  value={formData.department}
                  onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))}
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
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="course-desc">Description</Label>
                <textarea
                  id="course-desc"
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button onClick={handleSave}>
                {editingCourse ? "Update Course" : "Save Course"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
