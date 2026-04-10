"use client";

import * as React from "react";
import {
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  Bell,
  Clock,
  FileText,
  CheckCircle2,
  MessageSquare,
  Calendar,
  GraduationCap,
  Shield,
  AlertTriangle,
  Eye,
  X,
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
import { toast } from "sonner";

// --- Types ---

type NotificationType = "submission" | "grading" | "announcement" | "reminder" | "admin";

interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: typeof Bell;
  color: string;
  bg: string;
}

// --- Mock Data ---

const initialNotifications: NotificationItem[] = [
  { id: 1, type: "submission", title: "New submission received", description: "Alice Johnson submitted 'Data Structures Final Project'", time: "2 min ago", read: false, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 2, type: "grading", title: "Submission graded", description: "Your submission for 'Algorithm Analysis Report' received 92/100", time: "15 min ago", read: false, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: 3, type: "announcement", title: "Class announcement", description: "Dr. Sarah Chen posted: 'Office hours moved to Thursday 2-4pm'", time: "1 hour ago", read: false, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: 4, type: "reminder", title: "Assignment due soon", description: "'Database Design Project' is due in 2 days", time: "2 hours ago", read: false, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: 5, type: "submission", title: "New submission received", description: "Bob Smith submitted 'Algorithm Analysis Report' (late)", time: "3 hours ago", read: true, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 6, type: "admin", title: "System maintenance scheduled", description: "Platform will be down on April 20th, 2:00-4:00 AM UTC", time: "5 hours ago", read: true, icon: Shield, color: "text-slate-500", bg: "bg-slate-500/10" },
  { id: 7, type: "grading", title: "Grade published", description: "Prof. James Miller graded 'Organic Chemistry Lab Report'", time: "6 hours ago", read: true, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: 8, type: "announcement", title: "New course material available", description: "Machine Learning Fundamentals: Week 8 lecture notes uploaded", time: "Yesterday", read: true, icon: GraduationCap, color: "text-teal-500", bg: "bg-teal-500/10" },
  { id: 9, type: "reminder", title: "Calendar event", description: "Physics lab session tomorrow at 10:00 AM", time: "Yesterday", read: true, icon: Calendar, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { id: 10, type: "submission", title: "Submission returned", description: "'English Literature Review' returned with feedback", time: "2 days ago", read: true, icon: FileText, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: 11, type: "admin", title: "Password updated", description: "Your account password was changed successfully", time: "3 days ago", read: true, icon: Shield, color: "text-slate-500", bg: "bg-slate-500/10" },
  { id: 12, type: "grading", title: "Grade updated", description: "Your grade for 'Calculus Problem Set 7' was revised to 85/100", time: "4 days ago", read: true, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

const typeConfig: Record<NotificationType, { label: string; icon: typeof Bell }> = {
  submission: { label: "Submissions", icon: FileText },
  grading: { label: "Grades", icon: CheckCircle2 },
  announcement: { label: "Announcements", icon: MessageSquare },
  reminder: { label: "Reminders", icon: Clock },
  admin: { label: "Admin", icon: Shield },
};

// --- Main Page ---

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(initialNotifications);
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<NotificationType | "all">("all");
  const [activeTab, setActiveTab] = React.useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    const matchTab = activeTab === "all" || (activeTab === "unread" && !n.read) || (activeTab === "read" && n.read);
    const matchType = typeFilter === "all" || n.type === typeFilter;
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.description.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchType && matchSearch;
  });

  const handleMarkRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification deleted");
  };

  const handleClearRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
    toast.success("Read notifications cleared");
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-500/10 p-3"><Bell className="h-5 w-5 text-blue-500" /></div>
            <div><p className="text-2xl font-bold">{notifications.length}</p><p className="text-sm text-muted-foreground">Total</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-amber-500/10 p-3"><AlertTriangle className="h-5 w-5 text-amber-500" /></div>
            <div><p className="text-2xl font-bold">{unreadCount}</p><p className="text-sm text-muted-foreground">Unread</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-emerald-500/10 p-3"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
            <div><p className="text-2xl font-bold">{notifications.filter((n) => n.type === "grading").length}</p><p className="text-sm text-muted-foreground">Grades</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-purple-500/10 p-3"><MessageSquare className="h-5 w-5 text-purple-500" /></div>
            <div><p className="text-2xl font-bold">{notifications.filter((n) => n.type === "announcement").length}</p><p className="text-sm text-muted-foreground">Announcements</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 pt-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search notifications..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as NotificationType | "all")}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(typeConfig).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleClearRead} className="ml-auto">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Read
          </Button>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">No notifications</h3>
                <p className="text-sm text-muted-foreground mt-1">You are all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filtered.map((n) => {
                const Icon = n.icon;
                return (
                  <Card
                    key={n.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${!n.read ? "border-l-4 border-l-blue-500" : ""}`}
                    onClick={() => handleMarkRead(n.id)}
                  >
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${n.bg} ${n.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className={`text-sm font-semibold ${!n.read ? "" : "text-muted-foreground"}`}>
                              {n.title}
                              {!n.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-500" />}
                            </p>
                            <p className="text-sm text-muted-foreground mt-0.5">{n.description}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {!n.read && (
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); handleMarkRead(n.id); }}>
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }}>
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-[10px]">{n.type}</Badge>
                          <span className="text-xs text-muted-foreground">{n.time}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {filtered.length > 0 && (
        <div className="text-center text-xs text-muted-foreground">
          Showing {filtered.length} of {notifications.length} notifications
        </div>
      )}
    </div>
  );
}
