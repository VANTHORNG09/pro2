"use client";

import { useState } from "react";
import { Search, Clock, Filter, History, User, AlertTriangle, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const mockLogs: LogEntry[] = [
  { id: 1, timestamp: "2026-04-07T10:30:00Z", type: "auth", level: "info", user: "admin@example.com", action: "User Login", details: "Successful login from 192.168.1.1" },
  { id: 2, timestamp: "2026-04-07T10:25:00Z", type: "assignment", level: "info", user: "teacher@example.com", action: "Assignment Created", details: "Created 'Database Design Project' for CS101" },
  { id: 3, timestamp: "2026-04-07T10:20:00Z", type: "user", level: "info", user: "admin@example.com", action: "User Created", details: "New student account: john@example.com" },
  { id: 4, timestamp: "2026-04-07T10:15:00Z", type: "class", level: "warning", user: "teacher@example.com", action: "Class Modified", details: "Removed 2 students from CS101" },
  { id: 5, timestamp: "2026-04-07T10:10:00Z", type: "system", level: "error", user: "system", action: "Email Service Error", details: "Failed to send notification emails" },
  { id: 6, timestamp: "2026-04-07T10:05:00Z", type: "auth", level: "warning", user: "unknown@example.com", action: "Failed Login", details: "Invalid credentials attempted from 10.0.0.5" },
  { id: 7, timestamp: "2026-04-07T10:00:00Z", type: "assignment", level: "info", user: "student@example.com", action: "Assignment Submitted", details: "Submitted 'UI Prototype Review' for CS101" },
  { id: 8, timestamp: "2026-04-07T09:55:00Z", type: "user", level: "info", user: "admin@example.com", action: "User Deactivated", details: "Deactivated account: olduser@example.com" },
  { id: 9, timestamp: "2026-04-07T09:50:00Z", type: "system", level: "info", user: "system", action: "Backup Completed", details: "Daily database backup completed successfully" },
  { id: 10, timestamp: "2026-04-07T09:45:00Z", type: "assignment", level: "info", user: "teacher@example.com", action: "Assignment Graded", details: "Graded 5 submissions for CS101" },
];

const levelConfig = {
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
  error: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
};

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<LogType>("all");
  const [levelFilter, setLevelFilter] = useState<LogLevel>("all");

  const filteredLogs = mockLogs.filter((log) => {
    if (typeFilter !== "all" && log.type !== typeFilter) return false;
    if (levelFilter !== "all" && log.level !== levelFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return log.action.toLowerCase().includes(q) || log.user.toLowerCase().includes(q) || log.details.toLowerCase().includes(q);
    }
    return true;
  });

  const stats = {
    total: mockLogs.length,
    errors: mockLogs.filter((l) => l.level === "error").length,
    warnings: mockLogs.filter((l) => l.level === "warning").length,
    today: mockLogs.filter((l) => new Date(l.timestamp).toDateString() === new Date().toDateString()).length,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-sm text-muted-foreground">Monitor system events, user actions, and security events.</p>
        </div>
        <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export Logs</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-500/10 p-3"><History className="h-5 w-5 text-blue-500" /></div>
            <div><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted-foreground">Total Logs</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-emerald-500/10 p-3"><Clock className="h-5 w-5 text-emerald-500" /></div>
            <div><p className="text-2xl font-bold">{stats.today}</p><p className="text-sm text-muted-foreground">Today&apos;s Events</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-amber-500/10 p-3"><AlertTriangle className="h-5 w-5 text-amber-500" /></div>
            <div><p className="text-2xl font-bold">{stats.warnings}</p><p className="text-sm text-muted-foreground">Warnings</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-red-500/10 p-3"><AlertTriangle className="h-5 w-5 text-red-500" /></div>
            <div><p className="text-2xl font-bold">{stats.errors}</p><p className="text-sm text-muted-foreground">Errors</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><CardTitle>Filters</CardTitle></div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search logs..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as LogType)}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="auth">Authentication</SelectItem>
                  <SelectItem value="assignment">Assignments</SelectItem>
                  <SelectItem value="class">Classes</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={(v) => setLevelFilter(v as LogLevel)}>
                <SelectTrigger className="w-32"><SelectValue placeholder="Level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <Tabs defaultValue="all">
            <div className="px-2 pb-4">
              <TabsList>
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="warning">Warnings</TabsTrigger>
                <TabsTrigger value="error">Errors</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all" className="mt-0">
              <LogList logs={filteredLogs} />
            </TabsContent>
            {(["info", "warning", "error"] as LogLevel[]).map((level) => (
              <TabsContent key={level} value={level} className="mt-0">
                <LogList logs={filteredLogs.filter((l) => l.level === level)} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function LogList({ logs }: { logs: LogEntry[] }) {
  if (!logs.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Filter className="h-10 w-10 mb-3 opacity-50" />
        <p className="text-sm">No logs match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {logs.map((log) => {
        const cfg = log.level !== "all" ? levelConfig[log.level] : levelConfig.info;
        const LevelIcon = cfg.icon;
        return (
          <div key={log.id} className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${cfg.bg}`}>
              <LevelIcon className={`h-4 w-4 ${cfg.color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{log.action}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${cfg.bg} ${cfg.color}`}>{log.level}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{log.details}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><User className="h-3 w-3" />{log.user}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(log.timestamp).toLocaleString()}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase">{log.type}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
