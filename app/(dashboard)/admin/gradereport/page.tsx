// app/(dashboard)/admin/gradereport/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Download, Search, BookOpen, Users, TrendingUp, Award, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/shared/stat-card";

import { useClasses } from "@/lib/hooks/queries/useClasses";
import { useClassStudents } from "@/lib/hooks/queries/useClasses";
import type { Class } from "@/lib/types/classes";
import type { StudentInClass } from "@/lib/types/classes";

// ─── Grade helpers ─────────────────────────────────────────────────────
function gradeLetter(g: number): string {
  if (g >= 93) return "A";
  if (g >= 90) return "A-";
  if (g >= 87) return "B+";
  if (g >= 83) return "B";
  if (g >= 80) return "B-";
  if (g >= 77) return "C+";
  if (g >= 73) return "C";
  if (g >= 70) return "C-";
  if (g >= 67) return "D+";
  if (g >= 60) return "D";
  return "F";
}

function gradeColor(g: number): string {
  if (g >= 90) return "text-emerald-400";
  if (g >= 80) return "text-blue-400";
  if (g >= 70) return "text-amber-400";
  return "text-red-400";
}

// ─── Export to CSV ─────────────────────────────────────────────────────
function exportGradeReportToCSV(data: { class: Class; students: StudentInClass[] }[]) {
  const headers = ["Class", "Code", "Student", "Email", "Grade", "Letter", "Submissions", "Graded", "Pending", "Status"];
  const rows: string[] = [];
  data.forEach(({ class: cls, students }) => {
    students.forEach((s) => {
      rows.push([
        cls.name,
        cls.code,
        s.studentName,
        s.studentEmail,
        s.grade?.toString() ?? "N/A",
        s.grade != null ? gradeLetter(s.grade) : "N/A",
        s.submissionCount,
        s.gradedCount,
        s.pendingCount,
        s.status,
      ].map((c) => `"${c}"`).join(","));
    });
  });

  const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
  const link = document.createElement("a");
  link.href = encodeURI(csv);
  link.download = `grade-report-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
}

// ─── Grade Bar Component ──────────────────────────────────────────────
function GradeBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="h-2 w-full rounded-full bg-muted/50">
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: `${pct}%`,
          background: pct >= 90 ? "rgb(52 211 153)" : pct >= 80 ? "rgb(96 165 250)" : pct >= 70 ? "rgb(251 191 36)" : "rgb(248 113 113)",
        }}
      />
    </div>
  );
}

export default function AdminGradeReportPage() {
  const { data: classes = [], isLoading: classesLoading } = useClasses({});
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const { data: students = [], isLoading: studentsLoading } = useClassStudents(
    selectedClassId ?? 0
  );

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  // All students across all classes (for overview)
  const allStudentsWithClasses = useMemo(() => {
    const result: { class: Class; student: StudentInClass }[] = [];
    // We show the selected class students or a summary
    return result;
  }, []);

  // Stats
  const stats = useMemo(() => {
    if (students.length === 0) {
      return {
        avgGrade: 0,
        highestGrade: 0,
        lowestGrade: 0,
        totalSubmissions: 0,
        passRate: 0,
        gradedCount: 0,
        pendingCount: 0,
      };
    }
    const graded = students.filter((s) => s.grade != null);
    const grades = graded.map((s) => s.grade!);
    const avgGrade = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
    const highestGrade = grades.length > 0 ? Math.max(...grades) : 0;
    const lowestGrade = grades.length > 0 ? Math.min(...grades) : 0;
    const totalSubmissions = students.reduce((sum, s) => sum + s.submissionCount, 0);
    const passRate = grades.filter((g) => g >= 60).length / grades.length * 100;
    const gradedCount = students.reduce((sum, s) => sum + s.gradedCount, 0);
    const pendingCount = students.reduce((sum, s) => sum + s.pendingCount, 0);

    return { avgGrade, highestGrade, lowestGrade, totalSubmissions, passRate, gradedCount, pendingCount };
  }, [students]);

  // Grade distribution
  const gradeDistribution = useMemo(() => {
    if (students.length === 0) return [];
    const buckets = [
      { label: "A (90-100)", count: 0, color: "bg-emerald-500" },
      { label: "B (80-89)", count: 0, color: "bg-blue-500" },
      { label: "C (70-79)", count: 0, color: "bg-amber-500" },
      { label: "D (60-69)", count: 0, color: "bg-orange-500" },
      { label: "F (<60)", count: 0, color: "bg-red-500" },
    ];
    students.forEach((s) => {
      if (s.grade == null) return;
      if (s.grade >= 90) buckets[0].count++;
      else if (s.grade >= 80) buckets[1].count++;
      else if (s.grade >= 70) buckets[2].count++;
      else if (s.grade >= 60) buckets[3].count++;
      else buckets[4].count++;
    });
    return buckets;
  }, [students]);

  // Filter students
  const filteredStudents = useMemo(() => {
    if (!search) return students;
    const q = search.toLowerCase();
    return students.filter(
      (s) => s.studentName.toLowerCase().includes(q) || s.studentEmail.toLowerCase().includes(q)
    );
  }, [students, search]);

  const handleExport = () => {
    if (selectedClassId && selectedClass) {
      exportGradeReportToCSV([{ class: selectedClass, students: filteredStudents }]);
    } else {
      const allData: { class: Class; students: StudentInClass[] }[] = [];
      // If no class selected, export what we can from mock data
      alert("Select a class to export its grade report.");
    }
  };

  return (
    <PageShell>
      <PageHeader
        title="Grade Reports"
        description="View and analyze student grades across all classes."
        action={
          <Button onClick={handleExport} disabled={students.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        }
      />

      {/* Stats Overview */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Average Grade"
          value={stats.avgGrade > 0 ? `${stats.avgGrade.toFixed(1)}` : "—"}
          subtitle={stats.avgGrade > 0 ? gradeLetter(stats.avgGrade) : "No data"}
          icon={<Award className="h-4 w-4" />}
        />
        <StatCard
          title="Pass Rate"
          value={stats.passRate > 0 ? `${stats.passRate.toFixed(0)}%` : "—"}
          subtitle="Grade ≥ 60"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          title="Total Submissions"
          value={stats.totalSubmissions}
          subtitle="Across all students"
          icon={<FileText className="h-4 w-4" />}
        />
        <StatCard
          title="Grading Progress"
          value={`${stats.gradedCount} / ${stats.gradedCount + stats.pendingCount}`}
          subtitle={`${stats.pendingCount} pending`}
          icon={<BookOpen className="h-4 w-4" />}
        />
      </div>

      {/* Class Selector & Filters */}
      <SectionCard title="Select Class">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[240px]">
            <select
              className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
              value={selectedClassId ?? ""}
              onChange={(e) => setSelectedClassId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">All Classes</option>
              {classesLoading ? (
                <option disabled>Loading classes...</option>
              ) : (
                classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))
              )}
            </select>
          </div>
          {selectedClassId && (
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Grade Distribution Chart */}
      {selectedClassId && gradeDistribution.length > 0 && (
        <SectionCard title="Grade Distribution">
          <div className="flex flex-wrap gap-4">
            {gradeDistribution.map((bucket) => {
              const maxCount = Math.max(...gradeDistribution.map((b) => b.count), 1);
              const height = (bucket.count / maxCount) * 100;
              return (
                <div key={bucket.label} className="flex flex-col items-center gap-2 flex-1 min-w-[60px]">
                  <span className="text-sm font-medium">{bucket.count}</span>
                  <div className="h-24 w-full rounded-lg bg-muted/30 flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-lg ${bucket.color} transition-all`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground text-center">{bucket.label}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      {/* Student Grades Table */}
      {selectedClassId && (
        <SectionCard
          title={`Student Grades — ${selectedClass?.name ?? "Unknown"}`}
          description={`${filteredStudents.length} student(s) found`}
        >
          {studentsLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading students...</p>
          ) : filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse text-left">
                <thead className="border-b border-border/60">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Grade</th>
                    <th className="px-4 py-3">Letter</th>
                    <th className="px-4 py-3">Submissions</th>
                    <th className="px-4 py-3">Graded</th>
                    <th className="px-4 py-3">Pending</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="border-b border-border/20 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {s.studentName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{s.studentName}</p>
                            <p className="text-xs text-muted-foreground">{s.studentEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {s.grade != null ? (
                          <div className="flex flex-col gap-1">
                            <span className={`text-lg font-bold ${gradeColor(s.grade)}`}>
                              {s.grade.toFixed(1)}
                            </span>
                            <GradeBar value={s.grade} />
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {s.grade != null ? (
                          <span className={`rounded-lg bg-muted px-3 py-1 text-sm font-semibold ${gradeColor(s.grade)}`}>
                            {gradeLetter(s.grade)}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">{s.submissionCount}</td>
                      <td className="px-4 py-3 text-sm">{s.gradedCount}</td>
                      <td className="px-4 py-3 text-sm">
                        {s.pendingCount > 0 ? (
                          <span className="text-amber-400 font-medium">{s.pendingCount}</span>
                        ) : (
                          <span className="text-emerald-400">{s.pendingCount}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={s.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No students found in this class.
            </p>
          )}
        </SectionCard>
      )}

      {/* Empty State */}
      {!selectedClassId && (
        <SectionCard title="">
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/50" />
            <div>
              <h3 className="text-lg font-medium">Select a Class</h3>
              <p className="text-sm text-muted-foreground">
                Choose a class above to view student grades and analytics.
              </p>
            </div>
          </div>
        </SectionCard>
      )}
    </PageShell>
  );
}
