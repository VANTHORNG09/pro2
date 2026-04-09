"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, X, UserPlus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";

import { useUsers } from "@/lib/hooks/queries/useUsers";
import { useToast } from "@/hooks/use-toast";

export default function AddTeacherPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const classId = params.id;

  const { data: users = [], isLoading } = useUsers({ role: "teacher" });

  const [search, setSearch] = useState("");
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<Set<string>>(new Set());

  const filteredTeachers = users.filter((teacher) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      teacher.fullName.toLowerCase().includes(q) ||
      teacher.email.toLowerCase().includes(q)
    );
  });

  const toggleSelectTeacher = (id: string) => {
    setSelectedTeacherIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedTeacherIds.size === filteredTeachers.length) {
      setSelectedTeacherIds(new Set());
    } else {
      setSelectedTeacherIds(new Set(filteredTeachers.map((t) => t.id)));
    }
  };

  const handleAddTeachers = () => {
    if (selectedTeacherIds.size === 0) {
      toast({
        title: "No teachers selected",
        description: "Please select at least one teacher to add.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Call API to add teachers to class
    toast({
      title: "Teachers added",
      description: `${selectedTeacherIds.size} teacher(s) have been added to this class.`,
    });

    router.push(`/admin/classes/${classId}`);
  };

  return (
    <PageShell>
      <PageHeader
        title="Add Teachers to Class"
        description={`Select teachers to add to class #${classId}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleAddTeachers} disabled={selectedTeacherIds.size === 0}>
              <Save className="mr-2 h-4 w-4" />
              Add Selected ({selectedTeacherIds.size})
            </Button>
          </div>
        }
      />

      {/* Search */}
      <SectionCard title="Search Teachers">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </SectionCard>

      {/* Teacher Selection Table */}
      <SectionCard
        title="Available Teachers"
        description={`${filteredTeachers.length} teacher(s) available`}
      >
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-left">
            <thead className="border-b border-border/60">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredTeachers.length > 0 &&
                      selectedTeacherIds.size === filteredTeachers.length
                    }
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-border"
                  />
                </th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Loading teachers...
                  </td>
                </tr>
              ) : filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-border/20 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedTeacherIds.has(teacher.id)}
                        onChange={() => toggleSelectTeacher(teacher.id)}
                        className="h-4 w-4 rounded border-border"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {teacher.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{teacher.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{teacher.email}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label="Teacher" variant="success" />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={teacher.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No teachers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </PageShell>
  );
}
