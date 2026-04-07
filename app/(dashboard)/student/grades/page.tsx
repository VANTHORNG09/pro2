// app/(dashboard)/student/grades/page.tsx
"use client";

import { Award, TrendingUp, BookOpen, BarChart3 } from "lucide-react";

import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/shared/stat-card";

import { useAllMySubmissions } from "@/lib/hooks/queries/useSubmissions";

export default function StudentGradesPage() {
  const { data: submissions = [], isLoading } = useAllMySubmissions();

  const gradedSubmissions = submissions.filter((s) => s.status === "graded" || s.grade != null);
  const pendingSubmissions = submissions.filter((s) => s.status === "pending" || s.status === "submitted");
  const lateSubmissions = submissions.filter((s) => s.status === "late");

  const avgGrade = gradedSubmissions.length > 0
    ? gradedSubmissions.reduce((sum, s) => sum + ((s.grade ?? 0) / (s.maxPoints ?? 1)) * 100, 0) / gradedSubmissions.length
    : 0;

  const highestGrade = gradedSubmissions.length > 0
    ? Math.max(...gradedSubmissions.map((s) => ((s.grade ?? 0) / (s.maxPoints ?? 1)) * 100))
    : 0;

  // Group by assignment
  const assignmentGrades = gradedSubmissions.map((s) => ({
    assignmentName: s.assignmentName ?? "Unknown Assignment",
    grade: s.grade ?? 0,
    maxPoints: s.maxPoints,
    percentage: Math.round(((s.grade ?? 0) / (s.maxPoints ?? 1)) * 100),
    gradedAt: s.gradedAt,
    feedback: s.feedback,
    status: s.status,
  }));

  const getGradeLetter = (percentage: number): string => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const getGradeColor = (percentage: number): string => {
    if (percentage >= 90) return "text-green-600 dark:text-green-400";
    if (percentage >= 80) return "text-blue-600 dark:text-blue-400";
    if (percentage >= 70) return "text-amber-600 dark:text-amber-400";
    if (percentage >= 60) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <PageShell>
      <PageHeader
        title="Grades"
        description="View your grades, performance analytics, and feedback from teachers."
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Average Grade"
          value={gradedSubmissions.length > 0 ? `${avgGrade.toFixed(1)}%` : "—"}
          subtitle={gradedSubmissions.length > 0 ? `Grade: ${getGradeLetter(avgGrade)}` : "No grades yet"}
          icon={<Award className="h-4 w-4" />}
        />
        <StatCard
          title="Graded Work"
          value={gradedSubmissions.length.toString()}
          subtitle={`${submissions.length} total submissions`}
          icon={<BookOpen className="h-4 w-4" />}
        />
        <StatCard
          title="Highest Score"
          value={gradedSubmissions.length > 0 ? `${highestGrade.toFixed(0)}%` : "—"}
          subtitle="Best performance"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          title="Pending"
          value={pendingSubmissions.length.toString()}
          subtitle={`${lateSubmissions.length} late`}
          icon={<BarChart3 className="h-4 w-4" />}
        />
      </div>

      {/* Grade Distribution */}
      <SectionCard title="Grade Distribution" description="Breakdown of your grades">
        <div className="flex flex-wrap items-center gap-4">
          {["A", "B", "C", "D", "F"].map((letter) => {
            const count = gradedSubmissions.filter((s) => {
              const pct = ((s.grade ?? 0) / (s.maxPoints ?? 1)) * 100;
              return getGradeLetter(pct) === letter;
            }).length;
            const colors: Record<string, string> = {
              A: "bg-green-500",
              B: "bg-blue-500",
              C: "bg-amber-500",
              D: "bg-orange-500",
              F: "bg-red-500",
            };
            return (
              <div key={letter} className="flex flex-col items-center gap-1">
                <div className="flex h-16 w-10 items-end justify-center">
                  <div
                    className={`w-full rounded-t-md ${colors[letter]} transition-all`}
                    style={{ height: `${gradedSubmissions.length > 0 ? (count / gradedSubmissions.length) * 100 : 0}%`, minHeight: count > 0 ? "8px" : "0" }}
                  />
                </div>
                <span className="text-xs font-semibold">{letter}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Grades Table */}
      <SectionCard title="Assignment Grades">
        {isLoading ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Loading grades...</p>
        ) : assignmentGrades.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-left">
              <thead className="border-b border-border/60">
                <tr>
                  <th className="px-4 py-3">Assignment</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3">Percentage</th>
                  <th className="px-4 py-3">Letter</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Graded Date</th>
                </tr>
              </thead>
              <tbody>
                {assignmentGrades.map((g, i) => (
                  <tr key={i} className="border-b border-border/20">
                    <td className="px-4 py-3 font-medium">{g.assignmentName}</td>
                    <td className="px-4 py-3 text-sm font-semibold">{g.grade}/{g.maxPoints}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-muted">
                          <div
                            className={`h-2 rounded-full ${getGradeColor(g.percentage).replace("text-", "bg-").replace("dark:", "")}`}
                            style={{ width: `${g.percentage}%` }}
                          />
                        </div>
                        <span className={`text-sm font-semibold ${getGradeColor(g.percentage)}`}>
                          {g.percentage}%
                        </span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-lg font-bold ${getGradeColor(g.percentage)}`}>
                      {getGradeLetter(g.percentage)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={g.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {g.gradedAt ? new Date(g.gradedAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <Award className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No graded assignments yet.</p>
          </div>
        )}
      </SectionCard>

      {/* Feedback Section */}
      {gradedSubmissions.some((s) => s.feedback) && (
        <SectionCard title="Recent Feedback">
          <div className="space-y-3">
            {gradedSubmissions
              .filter((s) => s.feedback)
              .slice(0, 5)
              .map((s, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{s.assignmentName ?? "Assignment"}</p>
                    <span className={`text-sm font-bold ${getGradeColor(((s.grade ?? 0) / (s.maxPoints ?? 1)) * 100)}`}>
                      {getGradeLetter(((s.grade ?? 0) / (s.maxPoints ?? 1)) * 100)} ({((s.grade ?? 0) / (s.maxPoints ?? 1)) * 100}%)
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.feedback}</p>
                </div>
              ))}
          </div>
        </SectionCard>
      )}
    </PageShell>
  );
}
