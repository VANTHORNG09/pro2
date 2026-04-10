"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  Calendar,
  Award,
  MessageSquare,
  Search,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Eye,
  Upload,
  ClipboardList,
  BarChart3,
  UserCheck,
  Filter,
  AlertTriangle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Mock Data ---

const studentStats = [
  { title: "Enrolled Classes", value: "6", change: "+1", trend: "up" as const, icon: BookOpen, description: "this semester" },
  { title: "Assignments Due", value: "4", change: "2 urgent", trend: "down" as const, icon: Clock, description: "next 7 days" },
  { title: "Completed", value: "28", change: "+5", trend: "up" as const, icon: CheckCircle2, description: "this semester" },
  { title: "Current GPA", value: "3.72", change: "+0.15", trend: "up" as const, icon: Award, description: "cumulative" },
];

const upcomingAssignments = [
  { id: "ASG-301", title: "Data Structures Final Project", course: "CS-301", courseName: "Data Structures & Algorithms", dueDate: "2026-04-10", daysLeft: 3, status: "pending" as const, progress: 65 },
  { id: "ASG-302", title: "Database Design Project", course: "CS-350", courseName: "Database Management Systems", dueDate: "2026-04-08", daysLeft: 1, status: "urgent" as const, progress: 40 },
  { id: "ASG-303", title: "Operating Systems Lab 5", course: "CS-301", courseName: "Data Structures & Algorithms", dueDate: "2026-04-12", daysLeft: 5, status: "pending" as const, progress: 20 },
  { id: "ASG-304", title: "Network Security Essay", course: "CS-420", courseName: "Network Security", dueDate: "2026-04-15", daysLeft: 8, status: "not_started" as const, progress: 0 },
  { id: "ASG-305", title: "Machine Learning Assignment 3", course: "CS-450", courseName: "Machine Learning Fundamentals", dueDate: "2026-04-20", daysLeft: 13, status: "not_started" as const, progress: 0 },
];

const submittedAssignments = [
  { id: "SUB-201", title: "Algorithm Analysis Report", course: "CS-301", submittedAt: "2026-04-03", status: "graded" as const, grade: "92/100", feedback: "Excellent work on the complexity analysis." },
  { id: "SUB-202", title: "SQL Query Optimization", course: "CS-350", submittedAt: "2026-04-02", status: "graded" as const, grade: "85/100", feedback: "Good approach, but missing edge cases." },
  { id: "SUB-203", title: "Sorting Algorithms Comparison", course: "CS-301", submittedAt: "2026-04-01", status: "submitted" as const, grade: null, feedback: null },
  { id: "SUB-204", title: "Cryptography Basics Quiz", course: "CS-420", submittedAt: "2026-03-30", status: "graded" as const, grade: "88/100", feedback: "Strong understanding of core concepts." },
  { id: "SUB-205", title: "Neural Networks Lab 2", course: "CS-450", submittedAt: "2026-03-28", status: "returned" as const, grade: "78/100", feedback: "Review backpropagation derivation." },
];

const myCourses = [
  { id: "CS-301", name: "Data Structures & Algorithms", teacher: "Dr. Sarah Chen", progress: 78, grade: 88, assignments: 12, completed: 9, upcoming: 2 },
  { id: "CS-350", name: "Database Management Systems", teacher: "Prof. Alex Kumar", progress: 72, grade: 85, assignments: 8, completed: 6, upcoming: 2 },
  { id: "CS-420", name: "Network Security", teacher: "Dr. Lisa Wang", progress: 85, grade: 90, assignments: 6, completed: 5, upcoming: 1 },
  { id: "CS-450", name: "Machine Learning Fundamentals", teacher: "Dr. Michael Brown", progress: 65, grade: 82, assignments: 10, completed: 7, upcoming: 3 },
  { id: "CS-101", name: "Intro to Computer Science", teacher: "Prof. Emily Davis", progress: 90, grade: 92, assignments: 7, completed: 7, upcoming: 0 },
  { id: "MATH-201", name: "Discrete Mathematics", teacher: "Dr. James Miller", progress: 60, grade: 76, assignments: 9, completed: 5, upcoming: 2 },
];

const weeklyActivityData = [
  { name: "Mon", hours: 4, tasks: 2 },
  { name: "Tue", hours: 6, tasks: 3 },
  { name: "Wed", hours: 3, tasks: 1 },
  { name: "Thu", hours: 7, tasks: 4 },
  { name: "Fri", hours: 5, tasks: 2 },
  { name: "Sat", hours: 2, tasks: 1 },
  { name: "Sun", hours: 3, tasks: 1 },
];

const gradeTrendData = [
  { month: "Jan", grade: 78 },
  { month: "Feb", grade: 80 },
  { month: "Mar", grade: 82 },
  { month: "Apr", grade: 85 },
  { month: "May", grade: 84 },
  { month: "Jun", grade: 88 },
];

const statusDistribution = [
  { name: "Graded", value: 18, color: "#22c55e" },
  { name: "Submitted", value: 5, color: "#3b82f6" },
  { name: "Pending", value: 4, color: "#f59e0b" },
  { name: "Overdue", value: 1, color: "#ef4444" },
];

// --- Helpers ---

const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const gradeColor = (grade: number) => {
  if (grade >= 90) return "text-emerald-500";
  if (grade >= 80) return "text-blue-500";
  if (grade >= 70) return "text-amber-500";
  return "text-red-500";
};

// --- Stat Card ---
function DashboardStat({ title, value, change, trend, icon: Icon, description }: typeof studentStats[number]) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`rounded-xl p-3 ${trend === "up" ? "bg-blue-500/10 text-blue-500" : "bg-amber-500/10 text-amber-500"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-center gap-1 text-xs">
            {trend === "up" ? <ArrowUpRight className="h-3 w-3 text-emerald-500" /> : <ArrowDownRight className="h-3 w-3 text-red-500" />}
            <span className={trend === "up" ? "text-emerald-500" : "text-red-500"}>{change}</span>
            <span className="text-muted-foreground">{description}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main Page ---

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filteredUpcoming = upcomingAssignments.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const urgentCount = upcomingAssignments.filter((a) => a.status === "urgent").length;
  const pendingCount = upcomingAssignments.filter((a) => a.status === "pending").length;
  const gradedCount = submittedAssignments.filter((s) => s.status === "graded").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-sm text-muted-foreground">Track your assignments, grades, and course progress.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/student/calendar">
            <Button variant="outline"><Calendar className="mr-2 h-4 w-4" />Calendar</Button>
          </Link>
          <Link href="/student/assignments">
            <Button><Upload className="mr-2 h-4 w-4" />Submit Assignment</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {studentStats.map((stat) => <DashboardStat key={stat.title} {...stat} />)}
      </div>

      {/* Quick Access & Alerts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/student/assignments">
              <Card className="h-full cursor-pointer border-slate-200 hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:hover:border-blue-500/50 transition-all group">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 group-hover:scale-110 transition-transform"><ClipboardList className="h-6 w-6" /></div>
                  <div><p className="text-sm font-semibold">Assignments</p><p className="text-xs text-muted-foreground">View your assignments</p></div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/student/grades">
              <Card className="h-full cursor-pointer border-slate-200 hover:border-green-300 hover:shadow-md dark:border-slate-700 dark:hover:border-green-500/50 transition-all group">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 group-hover:scale-110 transition-transform"><BarChart3 className="h-6 w-6" /></div>
                  <div><p className="text-sm font-semibold">Grades</p><p className="text-xs text-muted-foreground">View your grade report</p></div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <CardHeader>
            <div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-500" /><CardTitle>Urgent</CardTitle></div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm">Database Design due tomorrow</span><Badge variant="destructive">1 day</Badge></div>
            <div className="flex items-center justify-between"><span className="text-sm">{urgentCount} urgent assignment(s)</span><Badge variant="destructive">Action needed</Badge></div>
            <div className="flex items-center justify-between"><span className="text-sm">New feedback received</span><Badge variant="outline">View</Badge></div>
          </CardContent>
        </Card>
      </div>

      {/* Performance & Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Grade Trend</CardTitle><CardDescription>Your performance over time</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={gradeTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(30, 30, 50, 0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }} />
                <Line type="monotone" dataKey="grade" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Study Activity</CardTitle><CardDescription>Weekly study hours and tasks</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(30, 30, 50, 0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }} />
                <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tasks" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-6">
        <TabsList className="w-fit">
          <TabsTrigger value="overview">Upcoming ({upcomingAssignments.length})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({submittedAssignments.length})</TabsTrigger>
          <TabsTrigger value="courses">My Courses ({myCourses.length})</TabsTrigger>
        </TabsList>

        {/* Upcoming Tab */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><CardTitle>Upcoming Deadlines</CardTitle><CardDescription>Assignments due in the next 2 weeks</CardDescription></div>
                <div className="flex flex-wrap gap-2">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="not_started">Not Started</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUpcoming.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-xs">{a.id}</TableCell>
                      <TableCell className="font-medium">{a.title}</TableCell>
                      <TableCell><Badge variant="secondary">{a.course}</Badge></TableCell>
                      <TableCell>{a.dueDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16"><Progress value={a.progress} className="h-2" /></div>
                          <span className="text-xs text-muted-foreground">{a.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={a.daysLeft <= 2 ? "text-red-500 font-medium" : "text-muted-foreground"}>
                          {a.daysLeft === 0 ? "Today" : a.daysLeft === 1 ? "Tomorrow" : `${a.daysLeft} days`}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={a.status === "urgent" ? "bg-red-500/10 text-red-700 dark:text-red-400" : a.status === "pending" ? "bg-amber-500/10 text-amber-700 dark:text-amber-400" : "bg-slate-500/10 text-slate-700 dark:text-slate-400"}>
                          {a.status === "not_started" ? "Not Started" : a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/student/assignments/${a.id}/submit`}>
                          <Button size="sm" variant={a.progress > 0 ? "default" : "outline"}>
                            <Upload className="mr-1 h-3 w-3" />
                            {a.progress > 0 ? "Continue" : "Start"}
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Submitted Tab */}
        <TabsContent value="submitted">
          <Card>
            <CardHeader><CardTitle>Submitted Assignments</CardTitle><CardDescription>Your grading history</CardDescription></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow><TableHead>ID</TableHead><TableHead>Assignment</TableHead><TableHead>Course</TableHead><TableHead>Submitted</TableHead><TableHead>Status</TableHead><TableHead>Grade</TableHead><TableHead>Feedback</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {submittedAssignments.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">{s.id}</TableCell>
                      <TableCell className="font-medium">{s.title}</TableCell>
                      <TableCell><Badge variant="secondary">{s.course}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.submittedAt}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={s.status === "graded" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : s.status === "submitted" ? "bg-blue-500/10 text-blue-700 dark:text-blue-400" : "bg-purple-500/10 text-purple-700 dark:text-purple-400"}>
                          {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{s.grade ? <span className={`font-medium ${gradeColor(parseInt(s.grade))}`}>{s.grade}</span> : <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell className="max-w-xs text-sm text-muted-foreground truncate">{s.feedback || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myCourses.map((c) => (
              <Card key={c.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-2 font-mono text-xs">{c.id}</Badge>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{c.teacher}</p>
                    </div>
                    <Avatar className="h-8 w-8"><AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs"><BookOpen className="h-4 w-4" /></AvatarFallback></Avatar>
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{c.progress}%</span>
                    </div>
                    <Progress value={c.progress} className="h-2" />
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div><p className="text-muted-foreground">Assignments</p><p className="font-semibold">{c.assignments}</p></div>
                      <div><p className="text-muted-foreground">Grade</p><p className={`font-semibold ${gradeColor(c.grade)}`}>{c.grade}%</p></div>
                      <div><p className="text-muted-foreground">Upcoming</p><p className="font-semibold">{c.upcoming}</p></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Assignment Status Pie */}
      <Card>
        <CardHeader><CardTitle>Assignment Status Overview</CardTitle><CardDescription>Breakdown of all your assignments</CardDescription></CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-6">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={4} dataKey="value">
                {statusDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "rgba(30, 30, 50, 0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3">
            {statusDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.name}: <span className="font-medium text-foreground">{item.value}</span></span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
