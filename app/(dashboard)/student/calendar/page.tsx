// app/(dashboard)/student/calendar/page.tsx
"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Clock, BookOpen, ClipboardList, FileText, AlertCircle } from "lucide-react";

import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/shared/stat-card";

import { useAssignments } from "@/lib/hooks/queries/useAssignments";
import { useAllMySubmissions } from "@/lib/hooks/queries/useSubmissions";

type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  type: "assignment" | "submission" | "exam";
  className: string;
  description?: string;
  dueTime?: string;
};

export default function StudentCalendarPage() {
  const { data: assignments = [] } = useAssignments({});
  const { data: submissions = [] } = useAllMySubmissions();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  // Build calendar events from assignments and submissions
  const events: CalendarEvent[] = [
    ...assignments
      .filter((a) => a.status === "published")
      .map((a) => ({
        id: `assign-${a.id}`,
        date: a.dueDate.slice(0, 10),
        title: a.title,
        type: "assignment" as const,
        className: a.className,
        description: a.description,
      })),
    ...submissions
      .filter((s) => s.submittedAt)
      .map((s) => ({
        id: `sub-${s.id}`,
        date: (s.submittedAt ?? "").slice(0, 10),
        title: s.assignmentName ?? "Submitted Assignment",
        type: "submission" as const,
        className: "",
      })),
  ];

  const upcomingEvents = events
    .filter((e) => e.date >= new Date().toISOString().slice(0, 10))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 10);

  const overdueEvents = events
    .filter((e) => e.date < new Date().toISOString().slice(0, 10))
    .filter((e) => e.type === "assignment")
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const typeConfig = {
    assignment: { icon: ClipboardList, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
    submission: { icon: FileText, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
    exam: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
  };

  // Get month name
  const [year, month] = selectedMonth.split("-").map(Number);
  const monthDate = new Date(year, (month ?? 1) - 1);
  const monthName = monthDate.toLocaleString("en-US", { month: "long", year: "numeric" });

  const upcomingCount = upcomingEvents.length;
  const overdueCount = overdueEvents.length;
  const submittedCount = submissions.filter((s) => s.status === "submitted" || s.status === "graded").length;

  return (
    <PageShell>
      <PageHeader
        title="Calendar"
        description="Track upcoming assignment deadlines, submissions, and important dates."
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Upcoming" value={upcomingCount} subtitle="Pending deadlines" icon={<CalendarIcon className="h-4 w-4" />} />
        <StatCard title="Overdue" value={overdueCount} subtitle="Missed deadlines" icon={<AlertCircle className="h-4 w-4" />} />
        <StatCard title="Submitted" value={submittedCount} subtitle="Completed work" icon={<FileText className="h-4 w-4" />} />
        <StatCard title="Total Events" value={events.length} subtitle="This semester" icon={<BookOpen className="h-4 w-4" />} />
      </div>

      {/* Month Selector */}
      <div className="mb-4 flex items-center gap-3">
        <button
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-muted"
          onClick={() => {
            const d = new Date(year, (month ?? 1) - 2);
            setSelectedMonth(d.toISOString().slice(0, 7));
          }}
        >
          ← Prev
        </button>
        <h2 className="text-lg font-semibold">{monthName}</h2>
        <button
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-muted"
          onClick={() => {
            const d = new Date(year, month);
            setSelectedMonth(d.toISOString().slice(0, 7));
          }}
        >
          Next →
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Events */}
        <div className="lg:col-span-2">
          <SectionCard title="Upcoming Deadlines" description="Assignment due dates ahead">
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => {
                  const TypeIcon = typeConfig[event.type].icon;
                  return (
                    <div key={event.id} className="flex items-start gap-4 rounded-lg border p-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${typeConfig[event.type].bg}`}>
                        <TypeIcon className={`h-5 w-5 ${typeConfig[event.type].color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold">{event.title}</h3>
                          <StatusBadge status={event.type === "assignment" ? "published" : "submitted"} />
                        </div>
                        {event.className && (
                          <p className="mt-1 text-xs text-muted-foreground">{event.className}</p>
                        )}
                        {event.description && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{event.description}</p>
                        )}
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center">
                <CalendarIcon className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No upcoming deadlines. Great job staying on track!</p>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Overdue & Summary */}
        <div className="space-y-6">
          {overdueCount > 0 && (
            <SectionCard title="Overdue" description="Assignments past their deadline">
              <div className="space-y-2">
                {overdueEvents.map((event) => (
                  <div key={event.id} className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-900/10">
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      Due: {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          <SectionCard title="Summary" description="Your calendar at a glance">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Assignments</span>
                </div>
                <span className="text-sm font-semibold">{events.filter((e) => e.type === "assignment").length}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Submissions</span>
                </div>
                <span className="text-sm font-semibold">{events.filter((e) => e.type === "submission").length}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Classes</span>
                </div>
                <span className="text-sm font-semibold">{new Set(events.map((e) => e.className).filter(Boolean)).size}</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </PageShell>
  );
}
