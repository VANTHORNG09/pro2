// app/(dashboard)/teacher/announcements/page.tsx
"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, X, Megaphone, Clock, Users, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/shared/stat-card";

import { useClasses } from "@/lib/hooks/queries/useClasses";

interface Announcement {
  id: number;
  title: string;
  content: string;
  classId: number;
  className: string;
  createdAt: string;
  isPublished: boolean;
}

// Static mock data
const mockAnnouncements: Announcement[] = [
  { id: 1, title: "Midterm Exam Schedule", content: "The midterm exam will be held next week. Please review chapters 1-8.", classId: 1, className: "CS101", createdAt: "2025-04-06T10:00:00Z", isPublished: true },
  { id: 2, title: "Assignment Extension", content: "The deadline for Assignment 3 has been extended to April 15th.", classId: 1, className: "CS101", createdAt: "2025-04-05T14:30:00Z", isPublished: true },
  { id: 3, title: "Guest Lecture Notice", content: "Dr. Smith will be giving a guest lecture on AI on April 20th.", classId: 2, className: "CS202", createdAt: "2025-04-04T09:00:00Z", isPublished: false },
];

export default function TeacherAnnouncementsPage() {
  const { data: classes = [] } = useClasses({});
  const [search, setSearch] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    classId: "",
  });

  const resetForm = () => {
    setFormData({ title: "", content: "", classId: "" });
    setEditingAnnouncement(null);
  };

  const openAddModal = () => { resetForm(); setIsModalOpen(true); };
  const openEditModal = (item: Announcement) => {
    setFormData({ title: item.title, content: item.content, classId: item.classId.toString() });
    setEditingAnnouncement(item);
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); resetForm(); };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in title and content");
      return;
    }
    const cls = classes.find((c) => c.id.toString() === formData.classId);
    if (editingAnnouncement) {
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === editingAnnouncement.id
            ? { ...a, title: formData.title, content: formData.content, classId: parseInt(formData.classId), className: cls?.name ?? "Unknown" }
            : a
        )
      );
    } else {
      const newAnnouncement: Announcement = {
        id: Date.now(),
        title: formData.title,
        content: formData.content,
        classId: parseInt(formData.classId),
        className: cls?.name ?? "Unknown",
        createdAt: new Date().toISOString(),
        isPublished: true,
      };
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const togglePublish = (id: number) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPublished: !a.isPublished } : a))
    );
  };

  const filtered = announcements.filter((a) => {
    if (search) {
      const q = search.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q) || a.className.toLowerCase().includes(q);
    }
    return true;
  });

  const publishedCount = announcements.filter((a) => a.isPublished).length;
  const draftCount = announcements.filter((a) => !a.isPublished).length;

  return (
    <PageShell>
      <PageHeader
        title="Announcements"
        description="Create and manage announcements for your classes."
        action={
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            New Announcement
          </Button>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Announcements" value={announcements.length} subtitle="All announcements" />
        <StatCard title="Published" value={publishedCount} subtitle="Visible to students" icon={<Megaphone className="h-4 w-4" />} />
        <StatCard title="Drafts" value={draftCount} subtitle="Not yet published" icon={<Edit2 className="h-4 w-4" />} />
        <StatCard title="Classes" value={classes.length} subtitle="Active classes" icon={<Users className="h-4 w-4" />} />
      </div>

      {/* Search */}
      <SectionCard title="Search">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search announcements..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </SectionCard>

      {/* Announcements List */}
      <SectionCard title="Announcements">
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((a) => (
              <div key={a.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Megaphone className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-base font-semibold">{a.title}</h3>
                      <StatusBadge status={a.isPublished ? "published" : "draft"} />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{a.content}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {a.className}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => openEditModal(a)}
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => togglePublish(a.id)}
                      title={a.isPublished ? "Unpublish" : "Publish"}
                    >
                      <Megaphone className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(a.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Megaphone className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No announcements found.</p>
          </div>
        )}
      </SectionCard>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingAnnouncement ? "Edit Announcement" : "New Announcement"}
              </h2>
              <button onClick={closeModal}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ann-title">Title</Label>
                <Input
                  id="ann-title"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g., Midterm Exam Schedule"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ann-class">Class</Label>
                <select
                  id="ann-class"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
                  value={formData.classId}
                  onChange={(e) => setFormData((p) => ({ ...p, classId: e.target.value }))}
                >
                  <option value="">Select a class...</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ann-content">Content</Label>
                <textarea
                  id="ann-content"
                  rows={5}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
                  value={formData.content}
                  onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Write your announcement..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button onClick={handleSave}>
                {editingAnnouncement ? "Update" : "Publish"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
