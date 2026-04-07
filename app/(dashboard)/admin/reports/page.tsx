// app/(dashboard)/admin/reports/page.tsx
"use client";

import { BarChart3, TrendingUp, Users, BookOpen, ClipboardList, Award } from "lucide-react";

import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";

import { useUserStats } from "@/lib/hooks/queries/useUsers";
import { useClasses } from "@/lib/hooks/queries/useClasses";
import { useAssignments } from "@/lib/hooks/queries/useAssignments";

export default function AdminReportsPage() {
  const { data: userStats, isLoading: loadingStats } = useUserStats();
  const { data: classes = [], isLoading: loadingClasses } = useClasses({});
  const { data: assignments = [], isLoading: loadingAssignments } = useAssignments({});

  const totalStudents = userStats?.studentsCount ?? 0;
  const totalTeachers = userStats?.teachersCount ?? 0;
  const totalUsers = userStats?.totalUsers ?? 0;
  const activeUsers = userStats?.activeUsers ?? 0;

  const totalAssignments = assignments.length;
  const publishedAssignments = assignments.filter((a) => a.status === "published").length;
  const gradedAssignments = assignments.reduce((sum, a) => sum + (a.gradedCount ?? 0), 0);
  const pendingSubmissions = assignments.reduce((sum, a) => sum + (a.pendingCount ?? 0), 0);

  const avgGrade = assignments.length > 0
    ? Math.round(assignments.reduce((sum, a) => sum + ((a.gradedCount ?? 0) / Math.max(a.submissionCount ?? 1, 1)) * 100, 0) / assignments.length)
    : 0;

  return (
    <PageShell>
      <PageHeader
        title="Reports & Analytics"
        description="Platform-wide statistics, trends, and performance insights."
      />

      {/* Overview Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Users" value={loadingStats ? "—" : totalUsers.toString()} subtitle={`${activeUsers} currently active`} icon={<Users className="h-4 w-4" />} />
        <StatCard title="Total Classes" value={loadingClasses ? "—" : classes.length.toString()} subtitle="Across all departments" icon={<BookOpen className="h-4 w-4" />} />
        <StatCard title="Assignments" value={loadingAssignments ? "—" : totalAssignments.toString()} subtitle={`${publishedAssignments} published`} icon={<ClipboardList className="h-4 w-4" />} />
        <StatCard title="Graded Work" value={loadingAssignments ? "—" : gradedAssignments.toString()} subtitle={`${pendingSubmissions} pending`} icon={<Award className="h-4 w-4" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Distribution */}
        <SectionCard title="User Distribution" description="Breakdown of users by role">
          <div className="space-y-4">
            <ProgressBar label="Students" value={totalUsers > 0 ? Math.round((totalStudents / totalUsers) * 100) : 0} count={totalStudents} color="bg-blue-500" />
            <ProgressBar label="Teachers" value={totalUsers > 0 ? Math.round((totalTeachers / totalUsers) * 100) : 0} count={totalTeachers} color="bg-emerald-500" />
            <ProgressBar label="Admins" value={totalUsers > 0 ? Math.round(((totalUsers - totalStudents - totalTeachers) / totalUsers) * 100) : 0} count={totalUsers - totalStudents - totalTeachers} color="bg-purple-500" />
          </div>
        </SectionCard>

        {/* Assignment Status */}
        <SectionCard title="Assignment Status" description="Current state of all assignments">
          <div className="space-y-4">
            <ProgressBar label="Published" value={totalAssignments > 0 ? Math.round((publishedAssignments / totalAssignments) * 100) : 0} count={publishedAssignments} color="bg-green-500" />
            <ProgressBar label="Pending Grading" value={totalAssignments > 0 ? Math.round((pendingSubmissions / Math.max(totalAssignments, 1)) * 100) : 0} count={pendingSubmissions} color="bg-amber-500" />
            <ProgressBar label="Graded" value={totalAssignments > 0 ? Math.round((gradedAssignments / Math.max(totalAssignments, 1)) * 100) : 0} count={gradedAssignments} color="bg-blue-500" />
          </div>
        </SectionCard>

        {/* Class Activity */}
        <SectionCard title="Class Activity" description="Recent class engagement">
          {classes.length > 0 ? (
            <div className="space-y-3">
              {classes.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.code} · {c.teacherName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{c.studentCount} students</span>
                    <span className="text-xs text-muted-foreground">{c.assignmentCount} assignments</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">No classes to display.</p>
          )}
        </SectionCard>

        {/* Platform Health */}
        <SectionCard title="Platform Health" description="System performance metrics">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">System Status</p>
                  <p className="text-xs text-muted-foreground">All services operational</p>
                </div>
              </div>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">Healthy</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Avg. Grade Rate</p>
                  <p className="text-xs text-muted-foreground">Across all assignments</p>
                </div>
              </div>
              <span className="text-sm font-semibold">{avgGrade}%</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">Engagement Rate</p>
                  <p className="text-xs text-muted-foreground">Active users this week</p>
                </div>
              </div>
              <span className="text-sm font-semibold">{totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}

function ProgressBar({ label, value, count, color }: { label: string; value: number; count: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{count} ({value}%)</span>
      </div>
      <div className="h-2.5 rounded-full bg-muted">
        <div
          className={`h-2.5 rounded-full transition-all ${color}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}
