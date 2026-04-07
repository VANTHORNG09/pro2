// app/(dashboard)/admin/logs/page.tsx
"use client";

import { useState } from "react";
import { Search, Filter, Clock, User, AlertTriangle, Info } from "lucide-react";

import { Input } from "@/components/ui/input";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";

type LogType = "all" | "auth" | "assignment" | "class" | "user" | "system";
type LogLevel = "all" | "info" | "warning" | "error";

interface LogEntry {
  id: number;
  timestamp: string;
  type: LogType;
  level: LogLevel;
  user: string;
  action: string;
  details: string;
}

// Static mock data until API is available
const mockLogs: LogEntry[] = [
  { id: 1, timestamp: "2025-04-07T10:30:00Z", type: "auth", level: "info", user: "admin@example.com", action: "User Login", details: "Successful login from 192.168.1.1" },
  { id: 2, timestamp: "2025-04-07T10:25:00Z", type: "assignment", level: "info", user: "teacher@example.com", action: "Assignment Created", details: "Created 'Database Design Project' for CS101" },
  { id: 3, timestamp: "2025-04-07T10:20:00Z", type: "user", level: "info", user: "admin@example.com", action: "User Created", details: "New student account: john@example.com" },
  { id: 4, timestamp: "2025-04-07T10:15:00Z", type: "class", level: "warning", user: "teacher@example.com", action: "Class Modified", details: "Removed 2 students from CS101" },
  { id: 5, timestamp: "2025-04-07T10:10:00Z", type: "system", level: "error", user: "system", action: "Email Service Error", details: "Failed to send notification emails" },
  { id: 6, timestamp: "2025-04-07T10:05:00Z", type: "auth", level: "warning", user: "unknown@example.com", action: "Failed Login", details: "Invalid credentials attempted from 10.0.0.5" },
  { id: 7, timestamp: "2025-04-07T10:00:00Z", type: "assignment", level: "info", user: "student@example.com", action: "Assignment Submitted", details: "Submitted 'UI Prototype Review' for CS101" },
  { id: 8, timestamp: "2025-04-07T09:55:00Z", type: "user", level: "info", user: "admin@example.com", action: "User Deactivated", details: "Deactivated account: olduser@example.com" },
  { id: 9, timestamp: "2025-04-07T09:50:00Z", type: "system", level: "info", user: "system", action: "Backup Completed", details: "Daily database backup completed successfully" },
  { id: 10, timestamp: "2025-04-07T09:45:00Z", type: "assignment", level: "info", user: "teacher@example.com", action: "Assignment Graded", details: "Graded 5 submissions for CS101" },
];

const levelConfig = {
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
  error: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
};

export default function AdminLogsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<LogType>("all");
  const [levelFilter, setLevelFilter] = useState<LogLevel>("all");

  const filteredLogs = mockLogs.filter((log) => {
    if (typeFilter !== "all" && log.type !== typeFilter) return false;
    if (levelFilter !== "all" && log.level !== levelFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: mockLogs.length,
    errors: mockLogs.filter((l) => l.level === "error").length,
    warnings: mockLogs.filter((l) => l.level === "warning").length,
    today: mockLogs.filter((l) => {
      const today = new Date().toDateString();
      return new Date(l.timestamp).toDateString() === today;
    }).length,
  };

  return (
    <PageShell>
      <PageHeader
        title="Activity Logs"
        description="Monitor system events, user actions, and security events."
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Logs" value={stats.total} subtitle="All recorded events" />
        <StatCard title="Today's Events" value={stats.today} subtitle="Last 24 hours" />
        <StatCard title="Warnings" value={stats.warnings} subtitle="Require attention" icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard title="Errors" value={stats.errors} subtitle="System issues" icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      {/* Filters */}
      <SectionCard title="Filters">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <select
            className="rounded-xl border border-border bg-background px-4 py-2 text-sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as LogType)}
          >
            <option value="all">All Types</option>
            <option value="auth">Authentication</option>
            <option value="assignment">Assignments</option>
            <option value="class">Classes</option>
            <option value="user">Users</option>
            <option value="system">System</option>
          </select>
          <select
            className="rounded-xl border border-border bg-background px-4 py-2 text-sm"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as LogLevel)}
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
      </SectionCard>

      {/* Log Entries */}
      <SectionCard title="Activity Log">
        {filteredLogs.length > 0 ? (
          <div className="space-y-2">
            {filteredLogs.map((log) => {
              const cfg = log.level !== "all" ? levelConfig[log.level] : levelConfig.info;
              const LevelIcon = cfg.icon;
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${cfg.bg}`}>
                    <LevelIcon className={`h-4 w-4 ${cfg.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{log.action}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${cfg.bg} ${cfg.color}`}>
                        {log.level}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{log.details}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {log.user}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase">
                        {log.type}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Filter className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No logs match the current filters.</p>
          </div>
        )}
      </SectionCard>
    </PageShell>
  );
}
