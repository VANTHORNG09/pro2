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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NotificationItem = {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: React.ElementType;
  color: string;
  bg: string;
};

const notifications: NotificationItem[] = [
  { id: 1, type: "submission", title: "New submission received", description: "Alice Johnson submitted 'Data Structures Final Project'", time: "2 min ago", read: false, icon: FileText, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { id: 2, type: "grading", title: "Submission graded", description: "Your submission for 'Algorithm Analysis Report' received 92/100", time: "15 min ago", read: false, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
  { id: 3, type: "announcement", title: "Class announcement", description: "Dr. Sarah Chen posted: 'Office hours moved to Thursday 2-4pm'", time: "1 hour ago", read: false, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
  { id: 4, type: "reminder", title: "Assignment due soon", description: "'Database Design Project' is due in 2 days", time: "2 hours ago", read: false, icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
  { id: 5, type: "submission", title: "New submission received", description: "Bob Smith submitted 'Algorithm Analysis Report' (late)", time: "3 hours ago", read: true, icon: FileText, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { id: 6, type: "admin", title: "System maintenance scheduled", description: "Platform will be down on April 20th, 2:00-4:00 AM UTC", time: "5 hours ago", read: true, icon: Shield, color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-500/10" },
  { id: 7, type: "grading", title: "Grade published", description: "Prof. James Miller graded 'Organic Chemistry Lab Report'", time: "6 hours ago", read: true, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
  { id: 8, type: "announcement", title: "New course material available", description: "Machine Learning Fundamentals: Week 8 lecture notes uploaded", time: "Yesterday", read: true, icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { id: 9, type: "reminder", title: "Calendar event", description: "Physics lab session tomorrow at 10:00 AM", time: "Yesterday", read: true, icon: Calendar, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-500/10" },
  { id: 10, type: "submission", title: "Submission returned", description: "'English Literature Review' returned with feedback", time: "2 days ago", read: true, icon: FileText, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
  { id: 11, type: "admin", title: "Password updated", description: "Your account password was changed successfully", time: "3 days ago", read: true, icon: Shield, color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-500/10" },
  { id: 12, type: "grading", title: "Grade updated", description: "Your grade for 'Calculus Problem Set 7' was revised to 85/100", time: "4 days ago", read: true, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10" },
];

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "submission", label: "Submissions" },
  { value: "grading", label: "Grades" },
  { value: "announcement", label: "Announcements" },
  { value: "reminder", label: "Reminders" },
  { value: "admin", label: "Admin" },
];

export default function NotificationsPage() {
  const [filter, setFilter] = React.useState("all");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    const matchRead = filter === "all" || (filter === "unread" && !n.read) || (filter === "read" && n.read);
    const matchType = typeFilter === "all" || n.type === typeFilter;
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.description.toLowerCase().includes(search.toLowerCase());
    return matchRead && matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Notifications</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <CheckCheck className="h-4 w-4" />
            Mark All Read
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark all as read</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Clear all</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Clear read</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search notifications..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Bell className="mr-2 h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ({notifications.length})</SelectItem>
                <SelectItem value="unread">Unread ({unreadCount})</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="mr-2 h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Bell className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">No notifications</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">You are all caught up!</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((n) => (
            <Card
              key={n.id}
              className={`cursor-pointer transition-all hover:shadow-md ${!n.read ? "border-l-4 border-l-blue-500 bg-white dark:bg-slate-900" : "border-slate-200 dark:border-slate-800"}`}
            >
              <CardContent className="flex items-start gap-4 p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${n.bg} ${n.color}`}>
                  <n.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold ${!n.read ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}>
                        {n.title}
                        {!n.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-500" />}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{n.description}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{n.type}</Badge>
                    <span className="text-xs text-slate-400">{n.time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {filtered.length > 0 && (
        <div className="text-center text-xs text-slate-400">
          Showing {filtered.length} of {notifications.length} notifications
        </div>
      )}
    </div>
  );
}
