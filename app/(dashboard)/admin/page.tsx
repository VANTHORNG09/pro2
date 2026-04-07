"use client";

import * as React from "react";
import {
  Users,
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
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

// --- Mock Data ---

const overviewStats = [
  {
    title: "Total Students",
    value: "1,248",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "from last month",
  },
  {
    title: "Total Teachers",
    value: "86",
    change: "+4.2%",
    trend: "up",
    icon: FileText,
    description: "from last month",
  },
  {
    title: "Active Assignments",
    value: "342",
    change: "+18.7%",
    trend: "up",
    icon: CheckCircle2,
    description: "from last month",
  },
  {
    title: "Pending Submissions",
    value: "156",
    change: "-3.2%",
    trend: "down",
    icon: Clock,
    description: "from last month",
  },
];

const submissionsChartData = [
  { name: "Mon", submissions: 45, graded: 32 },
  { name: "Tue", submissions: 62, graded: 48 },
  { name: "Wed", submissions: 78, graded: 55 },
  { name: "Thu", submissions: 91, graded: 72 },
  { name: "Fri", submissions: 110, graded: 89 },
  { name: "Sat", submissions: 38, graded: 28 },
  { name: "Sun", submissions: 22, graded: 15 },
];

const assignmentsByStatus = [
  { name: "Published", value: 186, color: "#22c55e" },
  { name: "Draft", value: 78, color: "#3b82f6" },
  { name: "Closed", value: 78, color: "#6b7280" },
];

const activityChartData = [
  { month: "Jan", assignments: 65, submissions: 420 },
  { month: "Feb", assignments: 78, submissions: 510 },
  { month: "Mar", assignments: 92, submissions: 680 },
  { month: "Apr", assignments: 110, submissions: 790 },
  { month: "May", assignments: 135, submissions: 920 },
  { month: "Jun", assignments: 148, submissions: 1050 },
];

const recentAssignments = [
  {
    id: "ASG-001",
    title: "Data Structures Final Project",
    teacher: "Dr. Sarah Chen",
    class: "CS-301",
    dueDate: "2026-04-15",
    submissions: "42/58",
    status: "published",
  },
  {
    id: "ASG-002",
    title: "Organic Chemistry Lab Report",
    teacher: "Prof. James Miller",
    class: "CHEM-202",
    dueDate: "2026-04-12",
    submissions: "35/35",
    status: "closed",
  },
  {
    id: "ASG-003",
    title: "Calculus Problem Set 7",
    teacher: "Dr. Emily Rodriguez",
    class: "MATH-201",
    dueDate: "2026-04-20",
    submissions: "12/65",
    status: "published",
  },
  {
    id: "ASG-004",
    title: "Modern History Essay",
    teacher: "Prof. Michael Brown",
    class: "HIST-101",
    dueDate: "2026-04-25",
    submissions: "0/72",
    status: "draft",
  },
  {
    id: "ASG-005",
    title: "Machine Learning Assignment 3",
    teacher: "Dr. Alex Kumar",
    class: "CS-450",
    dueDate: "2026-04-18",
    submissions: "28/45",
    status: "published",
  },
  {
    id: "ASG-006",
    title: "English Literature Review",
    teacher: "Prof. Lisa Wang",
    class: "ENG-205",
    dueDate: "2026-04-10",
    submissions: "50/50",
    status: "closed",
  },
];

const recentTeachers = [
  { id: "T-001", name: "Dr. Sarah Chen", department: "Computer Science", assignments: 12, students: 174, status: "active" },
  { id: "T-002", name: "Prof. James Miller", department: "Chemistry", assignments: 8, students: 120, status: "active" },
  { id: "T-003", name: "Dr. Emily Rodriguez", department: "Mathematics", assignments: 15, students: 210, status: "active" },
  { id: "T-004", name: "Prof. Michael Brown", department: "History", assignments: 6, students: 95, status: "inactive" },
  { id: "T-005", name: "Dr. Alex Kumar", department: "Computer Science", assignments: 10, students: 145, status: "active" },
];

// --- Helper Components ---

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    published: "bg-green-500/20 text-green-400 border-green-500/30",
    draft: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    closed: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    active: "bg-green-500/20 text-green-400 border-green-500/30",
    inactive: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  return (
    <Badge className={`capitalize ${variants[status] || variants.draft}`}>
      {status}
    </Badge>
  );
}

// --- Main Page ---

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s what&apos;s happening with AssignBridge today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* ===== OVERVIEW TAB ===== */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {overviewStats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 text-xs">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                    )}
                    <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">{stat.description}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Submissions Chart */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Weekly Submissions</CardTitle>
                <CardDescription>Submission and grading activity this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={submissionsChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
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
                    <Bar dataKey="submissions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="graded" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Assignment Status Pie Chart */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Assignments by Status</CardTitle>
                <CardDescription>Distribution of current assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={assignmentsByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {assignmentsByStatus.map((entry, index) => (
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
                  {assignmentsByStatus.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {item.name} ({item.value})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Assignments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Assignments</CardTitle>
              <CardDescription>Latest assignments across all classes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-mono text-xs">{assignment.id}</TableCell>
                      <TableCell className="font-medium">{assignment.title}</TableCell>
                      <TableCell>{assignment.teacher}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{assignment.class}</Badge>
                      </TableCell>
                      <TableCell>{assignment.dueDate}</TableCell>
                      <TableCell>{assignment.submissions}</TableCell>
                      <TableCell>
                        <StatusBadge status={assignment.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Top Teachers */}
          <Card>
            <CardHeader>
              <CardTitle>Teachers Overview</CardTitle>
              <CardDescription>Recent teacher activity and status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Assignments</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-mono text-xs">{teacher.id}</TableCell>
                      <TableCell className="font-medium">{teacher.name}</TableCell>
                      <TableCell>{teacher.department}</TableCell>
                      <TableCell>{teacher.assignments}</TableCell>
                      <TableCell>{teacher.students}</TableCell>
                      <TableCell>
                        <StatusBadge status={teacher.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== ANALYTICS TAB ===== */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Monthly Activity Trend */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Monthly Activity Trend</CardTitle>
                <CardDescription>Assignment creation and submission trends over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={activityChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
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
                    <Line
                      type="monotone"
                      dataKey="assignments"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="submissions"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ fill: "#22c55e", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Submission Rate</CardTitle>
                <CardDescription>Average weekly submission rate</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-green-500">87%</div>
                <p className="text-sm text-muted-foreground mt-2">
                  +5.2% from last month
                </p>
                <div className="w-full mt-4 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: "87%" }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grading Efficiency</CardTitle>
                <CardDescription>Average grading turnaround time</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-blue-500">2.4d</div>
                <p className="text-sm text-muted-foreground mt-2">
                  -0.8 days from last month
                </p>
                <div className="w-full mt-4 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: "76%" }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== REPORTS TAB ===== */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Student Performance Report", desc: "Aggregate performance metrics across all courses", icon: Users },
              { title: "Teacher Activity Report", desc: "Detailed teacher engagement and grading statistics", icon: FileText },
              { title: "Assignment Analytics", desc: "Assignment completion rates and trends analysis", icon: CheckCircle2 },
              { title: "Submission Timeline", desc: "Time-based submission patterns and late analysis", icon: Clock },
              { title: "Class-wise Summary", desc: "Breakdown of metrics by individual classes", icon: TrendingUp },
              { title: "System Health Report", desc: "Platform usage, uptime, and performance metrics", icon: MoreHorizontal },
            ].map((report) => (
              <Card key={report.title} className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <report.icon className="h-8 w-8 text-primary" />
                    <Button variant="ghost" size="icon">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="mt-4">{report.title}</CardTitle>
                  <CardDescription>{report.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
