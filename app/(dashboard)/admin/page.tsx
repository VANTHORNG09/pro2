"use client";

import {
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
  IconFileText,
  IconCircleCheck,
  IconClock,
  IconPlus,
  IconDownload,
  IconSettings,
  IconUserPlus,
  IconMail,
  IconChartBar,
  IconSchool,
  IconTrophy,
  IconArrowRight,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartAreaInteractive } from "@/components/layout/chart-area-interactive";
import { cn } from "@/lib/utils";

// --- Data ---

const stats = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12.5%",
    trend: "up" as const,
    description: "Across all roles",
    icon: IconUsers,
  },
  {
    title: "Total Assignments",
    value: "456",
    change: "+8.2%",
    trend: "up" as const,
    description: "This semester",
    icon: IconFileText,
  },
  {
    title: "Graded Submissions",
    value: "3,892",
    change: "+15.3%",
    trend: "up" as const,
    description: "On-time completions",
    icon: IconCircleCheck,
  },
  {
    title: "Pending Review",
    value: "87",
    change: "-4.1%",
    trend: "down" as const,
    description: "Awaiting grading",
    icon: IconClock,
  },
];

const recentSubmissions = [
  { id: "SUB-001", student: "Alice Johnson", assignment: "Math Quiz Ch.5", class: "Math 101", status: "Submitted", date: "Apr 8" },
  { id: "SUB-002", student: "Bob Smith", assignment: "Physics Lab Report", class: "Physics 201", status: "Graded", date: "Apr 7" },
  { id: "SUB-003", student: "Charlie Brown", assignment: "Essay: Hamlet", class: "English 301", status: "Late", date: "Apr 7" },
  { id: "SUB-004", student: "Diana Prince", assignment: "Code Review #3", class: "CS 401", status: "Submitted", date: "Apr 6" },
  { id: "SUB-005", student: "Eve Wilson", assignment: "Stats Homework", class: "Stats 101", status: "Graded", date: "Apr 6" },
  { id: "SUB-006", student: "Frank Miller", assignment: "DB Design Project", class: "CS 301", status: "Submitted", date: "Apr 5" },
  { id: "SUB-007", student: "Grace Lee", assignment: "Literature Review", class: "English 201", status: "Graded", date: "Apr 5" },
];

const topTeachers = [
  { name: "Dr. Sarah Connor", classes: 4, assignments: 28, graded: 342, avgGrade: 87 },
  { name: "Prof. James Kirk", classes: 3, assignments: 22, graded: 298, avgGrade: 82 },
  { name: "Dr. Emily Chen", classes: 5, assignments: 35, graded: 410, avgGrade: 91 },
  { name: "Prof. Alan Turing", classes: 3, assignments: 18, graded: 256, avgGrade: 85 },
];

const topClasses = [
  { name: "CS 401 - Advanced Algorithms", students: 45, avgGrade: 89, completionRate: 96 },
  { name: "Math 101 - Calculus I", students: 120, avgGrade: 76, completionRate: 88 },
  { name: "English 301 - Shakespeare", students: 35, avgGrade: 84, completionRate: 92 },
  { name: "Physics 201 - Mechanics", students: 85, avgGrade: 78, completionRate: 91 },
];

const recentActivity = [
  { action: "New user registered", detail: "John Doe joined as Teacher", time: "2 min ago", type: "user" as const },
  { action: "Assignment published", detail: "CS 401 - Final Project by Prof. Turing", time: "15 min ago", type: "assignment" as const },
  { action: "Submission graded", detail: "Physics 201 - Lab #4 by Dr. Connor", time: "1 hour ago", type: "grade" as const },
  { action: "Class created", detail: "Data Science 101 by Dr. Chen", time: "3 hours ago", type: "class" as const },
  { action: "User role updated", detail: "Jane Smith promoted to Admin", time: "5 hours ago", type: "user" as const },
];

// --- Helpers ---

function getStatusVariant(status: string) {
  switch (status) {
    case "Submitted": return "default";
    case "Graded": return "secondary";
    case "Late": return "destructive";
    default: return "outline";
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case "user": return IconUserPlus;
    case "assignment": return IconFileText;
    case "grade": return IconTrophy;
    case "class": return IconSchool;
    default: return IconClock;
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case "user": return "bg-blue-500";
    case "assignment": return "bg-emerald-500";
    case "grade": return "bg-amber-500";
    case "class": return "bg-purple-500";
    default: return "bg-slate-500";
  }
}

// --- Page ---

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, assignments, and monitor platform activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <IconDownload className="mr-2 size-4" />
            Export
          </Button>
          <Button size="sm">
            <IconPlus className="mr-2 size-4" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <IconTrendingUp className="size-3 text-emerald-500" />
                ) : (
                  <IconTrendingDown className="size-3 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-emerald-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks at a glance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4">
              <IconUserPlus className="size-5 text-emerald-500" />
              <span className="text-sm font-medium">Add User</span>
              <span className="text-xs text-muted-foreground">Create a new account</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4">
              <IconMail className="size-5 text-blue-500" />
              <span className="text-sm font-medium">Send Announcement</span>
              <span className="text-xs text-muted-foreground">Notify all users</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4">
              <IconChartBar className="size-5 text-amber-500" />
              <span className="text-sm font-medium">View Reports</span>
              <span className="text-xs text-muted-foreground">Platform analytics</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4">
              <IconSettings className="size-5 text-purple-500" />
              <span className="text-sm font-medium">System Settings</span>
              <span className="text-xs text-muted-foreground">Configure platform</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="flex flex-col gap-4">
        <TabsList className="w-fit">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="flex flex-col gap-4">
          <ChartAreaInteractive />

          {/* Activity Feed + Submissions */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Activity Feed */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform events.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {recentActivity.map((item, i) => {
                    const ActivityIcon = getActivityIcon(item.type);
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <div className={cn("mt-1 size-2 shrink-0 rounded-full", getActivityColor(item.type))} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{item.action}</p>
                          <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">{item.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Submissions */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Recent Submissions</CardTitle>
                  <CardDescription>Latest across all classes.</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  View all <IconArrowRight className="size-3.5" />
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead className="hidden sm:table-cell">Assignment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSubmissions.slice(0, 5).map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.student}</TableCell>
                        <TableCell className="hidden sm:table-cell">{s.assignment}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(s.status)}>{s.status}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{s.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>All Submissions</CardTitle>
              <CardDescription>Manage and review student submissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSubmissions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">{s.id}</TableCell>
                      <TableCell className="font-medium">{s.student}</TableCell>
                      <TableCell>{s.assignment}</TableCell>
                      <TableCell>{s.class}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(s.status)}>{s.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{s.date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Review</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topTeachers.map((teacher) => (
              <Card key={teacher.name}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{teacher.name}</CardTitle>
                  <CardDescription>{teacher.classes} classes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assignments</span>
                    <span className="font-medium">{teacher.assignments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Graded</span>
                    <span className="font-medium">{teacher.graded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Grade</span>
                    <span className="font-medium">{teacher.avgGrade}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes" className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Classes</CardTitle>
              <CardDescription>Classes ranked by student performance.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Avg Grade</TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topClasses.map((cls) => (
                    <TableRow key={cls.name}>
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell>{cls.students}</TableCell>
                      <TableCell>
                        <Badge
                          variant={cls.avgGrade >= 85 ? "default" : cls.avgGrade >= 75 ? "secondary" : "destructive"}
                        >
                          {cls.avgGrade}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 rounded-full bg-muted">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                cls.completionRate >= 95 ? "bg-emerald-500" : cls.completionRate >= 85 ? "bg-amber-500" : "bg-red-500"
                              )}
                              style={{ width: `${cls.completionRate}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{cls.completionRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
