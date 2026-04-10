"use client";

import { useState } from "react";
import { Search, Clock, Filter, History, User, AlertTriangle, Info, Download, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AuditType = "all" | "create" | "update" | "delete" | "access" | "login";
type AuditLevel = "all" | "info" | "warning" | "critical";

interface AuditEntry {
  id: number;
  timestamp: string;
  type: AuditType;
  level: AuditLevel;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
}

const mockAuditLogs: AuditEntry[] = [
  { id: 1, timestamp: "2026-04-10T22:30:00Z", type: "login", level: "info", user: "admin@example.com", action: "User Login", resource: "Authentication", details: "Successful login from admin panel", ipAddress: "192.168.1.100" },
  { id: 2, timestamp: "2026-04-10T22:25:00Z", type: "create", level: "info", user: "teacher@example.com", action: "Assignment Created", resource: "Assignments", details: "Created 'Database Design Project' for CS101", ipAddress: "192.168.1.101" },
  { id: 3, timestamp: "2026-04-10T22:20:00Z", type: "update", level: "info", user: "admin@example.com", action: "User Updated", resource: "Users", details: "Updated profile for student@example.com", ipAddress: "192.168.1.100" },
  { id: 4, timestamp: "2026-04-10T22:15:00Z", type: "delete", level: "warning", user: "admin@example.com", action: "User Deleted", resource: "Users", details: "Removed inactive account: olduser@example.com", ipAddress: "192.168.1.100" },
  { id: 5, timestamp: "2026-04-10T22:10:00Z", type: "access", level: "info", user: "student@example.com", action: "Data Access", resource: "Grades", details: "Viewed personal grade report", ipAddress: "192.168.1.102" },
  { id: 6, timestamp: "2026-04-10T22:05:00Z", type: "update", level: "critical", user: "unknown@example.com", action: "Failed Access Attempt", resource: "Admin Panel", details: "Unauthorized access attempt to audit logs", ipAddress: "10.0.0.5" },
  { id: 7, timestamp: "2026-04-10T22:00:00Z", type: "create", level: "info", user: "teacher@example.com", action: "Class Created", resource: "Classes", details: "Created new class: Advanced Algorithms", ipAddress: "192.168.1.101" },
  { id: 8, timestamp: "2026-04-10T21:55:00Z", type: "update", level: "info", user: "admin@example.com", action: "Permissions Changed", resource: "Users", details: "Granted admin privileges to teacher@example.com", ipAddress: "192.168.1.100" },
];

const levelConfig = {
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
  critical: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
};

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<AuditType>("all");
  const [levelFilter, setLevelFilter] = useState<AuditLevel>("all");

  const filteredLogs = mockAuditLogs.filter((log) => {
    if (typeFilter !== "all" && log.type !== typeFilter) return false;
    if (levelFilter !== "all" && log.level !== levelFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return log.action.toLowerCase().includes(q) || log.user.toLowerCase().includes(q) || log.resource.toLowerCase().includes(q) || log.details.toLowerCase().includes(q);
    }
    return true;
  });

  const stats = {
    total: mockAuditLogs.length,
    critical: mockAuditLogs.filter((l) => l.level === "critical").length,
    warnings: mockAuditLogs.filter((l) => l.level === "warning").length,
    today: mockAuditLogs.filter((l) => new Date(l.timestamp).toDateString() === new Date().toDateString()).length,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-sm text-muted-foreground">Track security events, data changes, and compliance activities.</p>
        </div>
        <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export Audit Logs</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-500/10 p-3"><History className="h-5 w-5 text-blue-500" /></div>
            <div><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted-foreground">Total Audits</p></div>
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
            <div className="rounded-xl bg-red-500/10 p-3"><Shield className="h-5 w-5 text-red-500" /></div>
            <div><p className="text-2xl font-bold">{stats.critical}</p><p className="text-sm text-muted-foreground">Critical Events</p></div>
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
                <Input placeholder="Search audit logs..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as AuditType)}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="access">Access</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={(v) => setLevelFilter(v as AuditLevel)}>
                <SelectTrigger className="w-32"><SelectValue placeholder="Level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
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
                <TabsTrigger value="critical">Critical</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all" className="mt-0">
              <AuditLogList logs={filteredLogs} />
            </TabsContent>
            {(["info", "warning", "critical"] as AuditLevel[]).map((level) => (
              <TabsContent key={level} value={level} className="mt-0">
                <AuditLogList logs={filteredLogs.filter((l) => l.level === level)} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function AuditLogList({ logs }: { logs: AuditEntry[] }) {
  if (!logs.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Filter className="h-10 w-10 mb-3 opacity-50" />
        <p className="text-sm">No audit logs match the current filters.</p>
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
                <Badge variant="outline" className="text-[10px]">{log.resource}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{log.details}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><User className="h-3 w-3" />{log.user}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(log.timestamp).toLocaleString()}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase">{log.type}</span>
                <span className="flex items-center gap-1"><Shield className="h-3 w-3" />{log.ipAddress}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}