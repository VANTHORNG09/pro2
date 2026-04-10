"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  ClipboardList,
  BarChart3,
  Shield,
  FileText,
  Inbox,
  Activity,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Bell,
  Search,
  RotateCcw,
  GraduationCap,
  Target,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- Mock Data ---

const adminStats = [
  { title: "Total Users", value: "1,248", change: "+32", trend: "up" as const, icon: Users, description: "across all roles" },
  { title: "Active Classes", value: "86", change: "+5", trend: "up" as const, icon: BookOpen, description: "this semester" },
  { title: "Pending Reviews", value: "142", change: "-18", trend: "down" as const, icon: Clock, description: "awaiting action" },
  { title: "Platform Uptime", value: "99.8%", change: "+0.2%", trend: "up" as const, icon: Activity, description: "last 30 days" },
];

const quickAccessCards = [
  { href: "/admin/users", icon: Users, color: "blue", title: "User Management", desc: "Manage accounts & roles" },
  { href: "/admin/roles", icon: Shield, color: "purple", title: "Role Management", desc: "Manage permissions" },
  { href: "/admin/classes", icon: BookOpen, color: "emerald", title: "Class Management", desc: "Organize classes" },
  { href: "/admin/assignments", icon: ClipboardList, color: "violet", title: "Assignments", desc: "Review all assignments" },
  { href: "/admin/submissions", icon: Inbox, color: "amber", title: "Submissions", desc: "Monitor submissions" },
  { href: "/admin/flagged", icon: Bell, color: "orange", title: "Flagged", desc: "Review flagged items" },
  { href: "/admin/resubmissions", icon: RotateCcw, color: "cyan", title: "Resubmissions", desc: "Handle resubmissions" },
  { href: "/admin/grading-queue", icon: CheckCircle2, color: "teal", title: "Grading Queue", desc: "Process grading" },
  { href: "/admin/plagiarism", icon: Target, color: "red", title: "Plagiarism", desc: "Review plagiarism cases" },
  { href: "/admin/teachers", icon: GraduationCap, color: "indigo", title: "Teachers", desc: "Manage teachers" },
  { href: "/admin/students", icon: Users, color: "sky", title: "Students", desc: "Manage students" },
  { href: "/admin/pending-users", icon: Search, color: "pink", title: "Pending Users", desc: "Review user requests" },
  { href: "/admin/teacher-activity", icon: Activity, color: "slate", title: "Teacher Activity", desc: "Monitor teachers" },
  { href: "/admin/reports", icon: BarChart3, color: "lime", title: "Reports", desc: "Generate reports" },
  { href: "/admin/logs", icon: FileText, color: "zinc", title: "Activity Logs", desc: "View activity logs" },
  { href: "/admin/analytics", icon: TrendingUp, color: "fuchsia", title: "Analytics", desc: "Platform insights" },
];

const recentActivity = [
  { id: 1, user: "Admin User", action: "created new class", target: "Machine Learning Advanced", time: "2 min ago", type: "create" as const },
  { id: 2, user: "Dr. Sarah Johnson", action: "graded submission", target: "Data Structures Final Project", time: "15 min ago", type: "grade" as const },
  { id: 3, user: "System", action: "flagged suspicious activity", target: "Multiple failed login attempts", time: "1 hour ago", type: "alert" as const },
  { id: 4, user: "Prof. Michael Chen", action: "published assignment", target: "Database Schema Design", time: "2 hours ago", type: "publish" as const },
  { id: 5, user: "Admin User", action: "updated user role", target: "John Smith → Teacher", time: "3 hours ago", type: "update" as const },
  { id: 6, user: "Dr. Alex Kumar", action: "archived class", target: "Organic Chemistry (Fall 2025)", time: "5 hours ago", type: "archive" as const },
];

const userDistribution = [
  { name: "Students", value: 980, color: "#22c55e" },
  { name: "Teachers", value: 186, color: "#3b82f6" },
  { name: "Admins", value: 82, color: "#ef4444" },
];

const monthlyActivityData = [
  { month: "Jan", users: 820, classes: 64, submissions: 1200 },
  { month: "Feb", users: 910, classes: 70, submissions: 1580 },
  { month: "Mar", users: 1020, classes: 75, submissions: 1890 },
  { month: "Apr", users: 1120, classes: 80, submissions: 2240 },
  { month: "May", users: 1180, classes: 82, submissions: 2100 },
  { month: "Jun", users: 1248, classes: 86, submissions: 2450 },
];

const classPerformance = [
  { name: "CS-301", avgGrade: 84, submissions: 180 },
  { name: "CS-350", avgGrade: 79, submissions: 140 },
  { name: "CS-420", avgGrade: 88, submissions: 95 },
  { name: "CS-450", avgGrade: 81, submissions: 160 },
  { name: "MATH-101", avgGrade: 76, submissions: 320 },
];

// --- Helper Components ---

function ActivityIcon({ type }: { type: string }) {
  const icons: Record<string, { icon: typeof Users; color: string }> = {
    create: { icon: CheckCircle2, color: "text-emerald-500" },
    grade: { icon: ClipboardList, color: "text-blue-500" },
    alert: { icon: AlertTriangle, color: "text-red-500" },
    publish: { icon: FileText, color: "text-violet-500" },
    update: { icon: Users, color: "text-amber-500" },
    archive: { icon: BookOpen, color: "text-slate-500" },
  };
  const config = icons[type] || icons.create;
  const Icon = config.icon;
  return <Icon className={`h-4 w-4 ${config.color}`} />;
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  cyan: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
  red: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  teal: "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  orange: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
  pink: "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
  lime: "bg-lime-50 text-lime-600 dark:bg-lime-500/10 dark:text-lime-400",
  zinc: "bg-zinc-50 text-zinc-600 dark:bg-zinc-500/10 dark:text-zinc-400",
  slate: "bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400",
  fuchsia: "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-400",
};

// --- Main Page ---

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor platform activity, manage users, and oversee all operations.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/users">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          </Link>
          <Link href="/admin/flagged">
            <Button variant="outline">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Flagged Items
            </Button>
          </Link>
          <Link href="/admin/grading-queue">
            <Button>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Grading Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-xl p-3 ${stat.trend === "up" ? "bg-blue-500/10 text-blue-500" : "bg-amber-500/10 text-amber-500"}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  <span className={stat.trend === "up" ? "text-emerald-500" : "text-red-500"}>
                    {stat.change}
                  </span>
                  {" "}{stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickAccessCards.map((card) => {
          const Icon = card.icon;
          const cardColor = colorMap[card.color] || colorMap.blue;
          return (
            <Link key={card.href} href={card.href}>
              <Card className="h-full cursor-pointer border-slate-200 hover:border-primary/30 hover:shadow-md dark:border-slate-700 dark:hover:border-primary/30 transition-all group">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cardColor} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{card.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{card.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Platform Growth */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
            <CardDescription>Users, classes, and submissions over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 30, 50, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="classes" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="submissions" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown by role</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 30, 50, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {userDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Class Performance Overview</CardTitle>
          <CardDescription>Average grades and submission counts</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={classPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(30, 30, 50, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="avgGrade" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Avg Grade" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Platform Activity</CardTitle>
          <CardDescription>Latest actions across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell>
                    <ActivityIcon type={item.type} />
                  </TableCell>
                  <TableCell className="font-medium">{item.user}</TableCell>
                  <TableCell className="text-sm">{item.action}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {item.target}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
