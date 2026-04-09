"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, X, UserPlus, Search, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";

import { useUsers } from "@/lib/hooks/queries/useUsers";
import { useToast } from "@/hooks/use-toast";

export default function AddStudentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const classId = params.id;

  const { data: users = [], isLoading } = useUsers({ role: "student" });

  const [search, setSearch] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());

  const filteredStudents = users.filter((student) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      student.fullName.toLowerCase().includes(q) ||
      student.email.toLowerCase().includes(q)
    );
  });

  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedStudentIds.size === filteredStudents.length) {
      setSelectedStudentIds(new Set());
    } else {
      setSelectedStudentIds(new Set(filteredStudents.map((s) => s.id)));
    }
  };

  const handleAddStudents = () => {
    if (selectedStudentIds.size === 0) {
      toast({
        title: "No students selected",
        description: "Please select at least one student to add.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Call API to add students to class
    toast({
      title: "Students added",
      description: `${selectedStudentIds.size} student(s) have been added to this class.`,
    });

    router.push(`/admin/classes/${classId}`);
  };

  const handleBulkUpload = () => {
    // TODO: Implement CSV/bulk upload functionality
    toast({
      title: "Bulk upload",
      description: "CSV upload feature coming soon.",
    });
  };

  return (
    <PageShell>
      <PageHeader
        title="Add Students to Class"
        description={`Select students to add to class #${classId}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBulkUpload}>
              <Upload className="mr-2 h-4 w-4" />
              Bulk Upload
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleAddStudents} disabled={selectedStudentIds.size === 0}>
              <Save className="mr-2 h-4 w-4" />
              Add Selected ({selectedStudentIds.size})
            </Button>
          </div>
        }
      />

      {/* Search */}
      <SectionCard title="Search Students">
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

      {/* Student Selection Table */}
      <SectionCard
        title="Available Students"
        description={`${filteredStudents.length} student(s) available`}
      >
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-left">
            <thead className="border-b border-border/60">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredStudents.length > 0 &&
                      selectedStudentIds.size === filteredStudents.length
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
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-border/20 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.has(student.id)}
                        onChange={() => toggleSelectStudent(student.id)}
                        className="h-4 w-4 rounded border-border"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {student.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{student.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{student.email}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label="Student" variant="warning" />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={student.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No students found.
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
