"use client";

import * as React from "react";
import {
  History,
  Search,
  Filter,
  Download,
  User,
  FileText,
  Users,
  BookOpen,
  Shield,
  Settings,
  LogIn,
  LogOut,
  Eye,
  Calendar,
  Clock,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// --- Types ---

interface ActivityLog {
  id: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "teacher" | "student";
  };
  action: string;
  resource: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  category: "authentication" | "assignment" | "class" | "user" | "system" | "security";
}

// --- Mock Data ---

const mockActivityLogs: ActivityLog[] = [
  {
    id: "A001",
    timestamp: "2026-04-10T14:30:00Z",
    user: {
      id: "U001",
      name: "Admin User",
      email: "admin@assignbridge.com",
      role: "admin",
    },
    action: "approved_class_request",
    resource: "Class Request",
    details: "Approved class request for 'Advanced React Development' by Prof. Lisa Chen",
    category: "class",
  },
  {
    id: "A002",
    timestamp: "2026-04-10T14:25:00Z",
    user: {
      id: "U002",
      name: "Alice Johnson",
      email: "alice@assignbridge.com",
      role: "student",
    },
    action: "submitted_assignment",
    resource: "Assignment",
    details: "Submitted 'Database Design Project' for CS-401",
    category: "assignment",
  },
  {
    id: "A003",
    timestamp: "2026-04-10T14:20:00Z",
    user: {
      id: "U003",
      name: "Prof. Michael Chen",
      email: "michael@assignbridge.com",
      role: "teacher",
    },
    action: "created_assignment",
    resource: "Assignment",
    details: "Created new assignment 'Sorting Algorithms' for CS-401",
    category: "assignment",
  },
  {
    id: "A004",
    timestamp: "2026-04-10T14:15:00Z",
    user: {
      id: "U004",
      name: "Bob Smith",
      email: "bob@assignbridge.com",
      role: "student",
    },
    action: "login",
    resource: "Authentication",
    details: "User logged in successfully",
    category: "authentication",
  },
  {
    id: "A005",
    timestamp: "2026-04-10T14:10:00Z",
    user: {
      id: "U001",
      name: "Admin User",
      email: "admin@assignbridge.com",
      role: "admin",
    },
    action: "updated_user_permissions",
    resource: "User Management",
    details: "Updated permissions for teacher Prof. Sarah Johnson",
    category: "user",
  },
  {
    id: "A006",
    timestamp: "2026-04-10T14:05:00Z",
    user: {
      id: "U005",
      name: "Charlie Brown",
      email: "charlie@assignbridge.com",
      role: "student",
    },
    action: "viewed_submission",
    resource: "Assignment",
    details: "Viewed feedback for 'React Portfolio' submission",
    category: "assignment",
  },
  {
    id: "A007",
    timestamp: "2026-04-10T14:00:00Z",
    user: {
      id: "U003",
      name: "Prof. Michael Chen",
      email: "michael@assignbridge.com",
      role: "teacher",
    },
    action: "graded_submission",
    resource: "Assignment",
    details: "Graded submission for 'Data Structures Project' - Score: 95/100",
    category: "assignment",
  },
  {
    id: "A008",
    timestamp: "2026-04-10T13:55:00Z",
    user: {
      id: "U006",
      name: "System",
      email: "system@assignbridge.com",
      role: "admin",
    },
    action: "backup_completed",
    resource: "System",
    details: "Daily database backup completed successfully",
    category: "system",
  },
  {
    id: "A009",
    timestamp: "2026-04-10T13:50:00Z",
    user: {
      id: "U007",
      name: "Diana Prince",
      email: "diana@assignbridge.com",
      role: "student",
    },
    action: "enrolled_class",
    resource: "Class",
    details: "Enrolled in 'Web Development A' (CS-301)",
    category: "class",
  },
  {
    id: "A010",
    timestamp: "2026-04-10T13:45:00Z",
    user: {
      id: "U001",
      name: "Admin User",
      email: "admin@assignbridge.com",
      role: "admin",
    },
    action: "rejected_class_request",
    resource: "Class Request",
    details: "Rejected class request for 'Quantum Computing Basics' - Insufficient resources",
    category: "class",
  },
];

// --- Components ---

function ActivityItem({ log }: { log: ActivityLog }) {
  const getCategoryIcon = (category: ActivityLog["category"]) => {
    switch (category) {
      case "authentication":
        return LogIn;
      case "assignment":
        return FileText;
      case "class":
        return BookOpen;
      case "user":
        return Users;
      case "system":
        return Settings;
      case "security":
        return Shield;
      default:
        return History;
    }
  };

  const getCategoryColor = (category: ActivityLog["category"]) => {
    switch (category) {
      case "authentication":
        return "bg-blue-500/10 text-blue-500";
      case "assignment":
        return "bg-emerald-500/10 text-emerald-500";
      case "class":
        return "bg-purple-500/10 text-purple-500";
      case "user":
        return "bg-amber-500/10 text-amber-500";
      case "system":
        return "bg-slate-500/10 text-slate-500";
      case "security":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getRoleColor = (role: ActivityLog["user"]["role"]) => {
    switch (role) {
      case "admin":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "teacher":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "student":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const IconComponent = getCategoryIcon(log.category);
  const categoryColor = getCategoryColor(log.category);
  const roleColor = getRoleColor(log.user.role);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const { date, time } = formatTimestamp(log.timestamp);

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
      <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${categoryColor}`}>
        <IconComponent className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{log.user.name}</span>
              <Badge variant="outline" className={`text-xs ${roleColor}`}>
                {log.user.role}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {log.category}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {time}
              </div>
              <span className="font-mono">{log.id}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---

export default function ActivityLogsPage() {
  const [logs, setLogs] = React.useState<ActivityLog[]>(mockActivityLogs);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [userFilter, setUserFilter] = React.useState("all");
  const [timeRange, setTimeRange] = React.useState("24h");

  const categories = [...new Set(logs.map((log) => log.category))];
  const users = [...new Set(logs.map((log) => log.user.name))];

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      !search ||
      log.user.name.toLowerCase().includes(search.toLowerCase()) ||
      log.user.email.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || log.category === categoryFilter;
    const matchUser = userFilter === "all" || log.user.name === userFilter;
    return matchSearch && matchCategory && matchUser;
  });

  const stats = {
    totalLogs: logs.length,
    todayLogs: logs.filter((log) => {
      const today = new Date();
      const logDate = new Date(log.timestamp);
      return logDate.toDateString() === today.toDateString();
    }).length,
    uniqueUsers: new Set(logs.map((log) => log.user.id)).size,
    securityEvents: logs.filter((log) => log.category === "security").length,
  };

  const handleExport = () => {
    const headers = [
      "Timestamp",
      "User Name",
      "User Email",
      "User Role",
      "Action",
      "Resource",
      "Details",
      "Category",
      "ID",
    ];
    const rows = filteredLogs.map((log) => [
      log.timestamp,
      log.user.name,
      log.user.email,
      log.user.role,
      log.action,
      log.resource,
      log.details,
      log.category,
      log.id,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `activity-logs-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-sm text-muted-foreground">
            Monitor system activities, user actions, and platform events.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-500/10 p-3">
              <History className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalLogs}</p>
              <p className="text-sm text-muted-foreground">Total Logs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-emerald-500/10 p-3">
              <Calendar className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.todayLogs}</p>
              <p className="text-sm text-muted-foreground">Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-purple-500/10 p-3">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.uniqueUsers}</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-red-500/10 p-3">
              <Shield className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.securityEvents}</p>
              <p className="text-sm text-muted-foreground">Security Events</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>{filteredLogs.length} activities found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No activities found</p>
              <p className="text-xs mt-1">Try adjusting your filters or search query</p>
            </CardContent>
          </Card>
        ) : (
          filteredLogs.map((log) => <ActivityItem key={log.id} log={log} />)
        )}
      </div>
    </div>
  );
}