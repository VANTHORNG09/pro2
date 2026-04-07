"use client";

import * as React from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

// --- Mock Data ---

const studentStats = [
  {
    title: "Enrolled Courses",
    value: "6",
    change: "+1",
    trend: "up",
    icon: BookOpen,
    description: "this semester",
  },
  {
    title: "Assignments Due",
    value: "4",
    change: "2 urgent",
    trend: "down",
    icon: Clock,
    description: "next 7 days",
  },
  {
    title: "Completed",
    value: "28",
    change: "+5",
    trend: "up",
    icon: CheckCircle2,
    description: "this semester",
  },
  {
    title: "Current GPA",
    value: "3.72",
    change: "+0.15",
    trend: "up",
    icon: Award,
    description: "cumulative",
  },
];

const upcomingAssignments = [
  {
    id: "ASG-301",
    title: "Data Structures Final Project",
    course: "CS-301",
    courseName: "Data Structures & Algorithms",
    dueDate: "2026-04-10",
    daysLeft: 3,
    status: "pending",
    progress: 65,
  },
  {
    id: "ASG-302",
    title: "Database Design Project",
    course: "CS-350",
    courseName: "Database Management Systems",
    dueDate: "2026-04-08",
    daysLeft: 1,
    status: "urgent",
    progress: 40,
  },
  {
    id: "ASG-303",
    title: "Operating Systems Lab 5",
    course: "CS-301",
    courseName: "Data Structures & Algorithms",
    dueDate: "2026-04-12",
    daysLeft: 5,
    status: "pending",
    progress: 20,
  },
  {
    id: "ASG-304",
    title: "Network Security Essay",
    course: "CS-420",
    courseName: "Network Security",
    dueDate: "2026-04-15",
    daysLeft: 8,
    status: "not_started",
    progress: 0,
  },
  {
    id: "ASG-305",
    title: "Machine Learning Assignment 3",
    course: "CS-450",
    courseName: "Machine Learning Fundamentals",
    dueDate: "2026-04-20",
    daysLeft: 13,
    status: "not_started",
    progress: 0,
  },
];

const submittedAssignments = [
  {
    id: "SUB-201",
    title: "Algorithm Analysis Report",
    course: "CS-301",
    submittedAt: "2026-04-03",
    status: "graded",
    grade: "92/100",
    feedback: "Excellent work on the complexity analysis.",
  },
  {
    id: "SUB-202",
    title: "SQL Query Optimization",
    course: "CS-350",
    submittedAt: "2026-04-02",
    status: "graded",
    grade: "85/100",
    feedback: "Good approach, but missing edge cases.",
  },
  {
    id: "SUB-203",
    title: "Sorting Algorithms Comparison",
    course: "CS-301",
    submittedAt: "2026-04-01",
    status: "submitted",
    grade: null,
    feedback: null,
  },
  {
    id: "SUB-204",
    title: "Cryptography Basics Quiz",
    course: "CS-420",
    submittedAt: "2026-03-30",
    status: "graded",
    grade: "88/100",
    feedback: "Strong understanding of core concepts.",
  },
  {
    id: "SUB-205",
    title: "Neural Networks Lab 2",
    course: "CS-450",
    submittedAt: "2026-03-28",
    status: "returned",
    grade: "78/100",
    feedback: "Review backpropagation derivation.",
  },
];

const myCourses = [
  {
    id: "CS-301",
    name: "Data Structures & Algorithms",
    teacher: "Dr. Sarah Chen",
    progress: 78,
    grade: 88,
    assignments: 12,
    completed: 9,
    upcoming: 2,
  },
  {
    id: "CS-350",
    name: "Database Management Systems",
    teacher: "Prof. Alex Kumar",
    progress: 72,
    grade: 85,
    assignments: 8,
    completed: 6,
    upcoming: 2,
  },
  {
    id: "CS-420",
    name: "Network Security",
    teacher: "Dr. Lisa Wang",
    progress: 85,
    grade: 90,
    assignments: 6,
    completed: 5,
    upcoming: 1,
  },
  {
    id: "CS-450",
    name: "Machine Learning Fundamentals",
    teacher: "Dr. Michael Brown",
    progress: 65,
    grade: 82,
    assignments: 10,
    completed: 7,
    upcoming: 3,
  },
  {
    id: "CS-101",
    name: "Intro to Computer Science",
    teacher: "Prof. Emily Davis",
    progress: 90,
    grade: 92,
    assignments: 7,
    completed: 7,
    upcoming: 0,
  },
  {
    id: "MATH-201",
    name: "Discrete Mathematics",
    teacher: "Dr. James Miller",
    progress: 60,
    grade: 76,
    assignments: 9,
    completed: 5,
    upcoming: 2,
  },
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

// --- Helper Components ---

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    graded: "bg-green-500/20 text-green-400 border-green-500/30",
    submitted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    returned: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    urgent: "bg-red-500/20 text-red-400 border-red-500/30",
    not_started: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  const labels: Record<string, string> = {
    graded: "Graded",
    submitted: "Submitted",
    returned: "Returned",
    pending: "Pending",
    urgent: "Urgent",
    not_started: "Not Started",
  };

  return (
    <Badge className={`capitalize ${variants[status] || variants.pending}`}>
      {labels[status] || status}
    </Badge>
  );
}

// --- Main Page ---

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredUpcoming = upcomingAssignments.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.course.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredSubmitted = submittedAssignments.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.course.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Student Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your assignments, grades, and course progress.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Submit Assignment
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
        </TabsList>

        {/* ===== OVERVIEW TAB ===== */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {studentStats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
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
                    <span
                      className={
                        stat.trend === "up" ? "text-green-500" : "text-red-500"
                      }
                    >
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">
                      {stat.description}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Alerts & Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-red-500/30 bg-red-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <CardTitle>Urgent</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    Database Design Project due tomorrow
                  </span>
                  <Badge variant="destructive">1 day left</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">2 assignments overdue</span>
                  <Badge variant="destructive">Action needed</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    New feedback on Algorithm Analysis Report
                  </span>
                  <Badge variant="outline">View feedback</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used actions</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start">
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Work
                </Button>
                <Button variant="outline" className="justify-start">
                  <Eye className="mr-2 h-4 w-4" />
                  View Grades
                </Button>
                <Button variant="outline" className="justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Teacher
                </Button>
                <Button variant="outline" className="justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resources
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Weekly Study Activity */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Weekly Study Activity</CardTitle>
                <CardDescription>
                  Study hours and tasks completed this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyActivityData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                    />
                    <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(30, 30, 50, 0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar
                      dataKey="hours"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="Study Hours"
                    />
                    <Bar
                      dataKey="tasks"
                      fill="#22c55e"
                      radius={[4, 4, 0, 0]}
                      name="Tasks Done"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Assignment Status */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Assignment Status</CardTitle>
                <CardDescription>
                  Breakdown of all assignments by status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
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
                  {statusDistribution.map((item) => (
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

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>
                Assignments due in the next 2 weeks
              </CardDescription>
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
                  {upcomingAssignments.slice(0, 5).map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-mono text-xs">
                        {assignment.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {assignment.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{assignment.course}</Badge>
                      </TableCell>
                      <TableCell>{assignment.dueDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                assignment.progress >= 80
                                  ? "bg-green-500"
                                  : assignment.progress >= 40
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${assignment.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {assignment.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {assignment.daysLeft <= 2 ? (
                          <span className="text-red-500 font-medium">
                            {assignment.daysLeft} day
                            {assignment.daysLeft !== 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            {assignment.daysLeft} days
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={assignment.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={
                            assignment.progress > 0 ? "default" : "outline"
                          }
                        >
                          <Upload className="mr-1 h-3 w-3" />
                          {assignment.progress > 0 ? "Continue" : "Start"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== ASSIGNMENTS TAB ===== */}
        <TabsContent value="assignments" className="space-y-6">
          {/* Upcoming */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Assignments</CardTitle>
                  <CardDescription>
                    {filteredUpcoming.length} assignments pending
                  </CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search assignments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUpcoming.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-mono text-xs">
                        {assignment.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {assignment.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <Badge variant="secondary">{assignment.course}</Badge>
                          <span className="text-xs text-muted-foreground mt-1">
                            {assignment.courseName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{assignment.dueDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                assignment.progress >= 80
                                  ? "bg-green-500"
                                  : assignment.progress >= 40
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${assignment.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {assignment.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {assignment.daysLeft <= 2 ? (
                          <span className="text-red-500 font-medium">
                            {assignment.daysLeft}d
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            {assignment.daysLeft}d
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={assignment.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={
                            assignment.progress > 0 ? "default" : "outline"
                          }
                        >
                          <Upload className="mr-1 h-3 w-3" />
                          {assignment.progress > 0 ? "Continue" : "Start"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Submitted & Graded */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Submitted & Graded</CardTitle>
                  <CardDescription>
                    {filteredSubmitted.length} recent submissions
                  </CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search submissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
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
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Feedback</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmitted.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-mono text-xs">
                        {submission.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {submission.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{submission.course}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {submission.submittedAt}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={submission.status} />
                      </TableCell>
                      <TableCell>
                        {submission.grade ? (
                          <span className="font-bold text-green-500">
                            {submission.grade}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            Awaiting
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                        {submission.feedback || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Download">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== MY COURSES TAB ===== */}
        <TabsContent value="courses" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myCourses.map((course) => (
              <Card
                key={course.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{course.id}</Badge>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="mt-3">{course.name}</CardTitle>
                  <CardDescription>{course.teacher}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">
                        Course Progress
                      </span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                      <span className="text-lg font-bold">{course.grade}%</span>
                      <span className="text-xs text-muted-foreground">
                        Grade
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                      <span className="text-lg font-bold">
                        {course.completed}/{course.assignments}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Completed
                      </span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                      <span className="text-lg font-bold">
                        {course.upcoming}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Upcoming
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 text-xs">
                      <FileText className="mr-1 h-3 w-3" />
                      Details
                    </Button>
                    <Button className="flex-1 text-xs">
                      <BookOpen className="mr-1 h-3 w-3" />
                      Go to Course
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ===== GRADES TAB ===== */}
        <TabsContent value="grades" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Grade Trend */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Grade Trend</CardTitle>
                <CardDescription>
                  Your average grade over the past 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={gradeTrendData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                    />
                    <YAxis
                      domain={[60, 100]}
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                    />
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
                      dataKey="grade"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={{ fill: "#22c55e", r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* GPA Card */}
            <Card>
              <CardHeader>
                <CardTitle>Cumulative GPA</CardTitle>
                <CardDescription>Overall academic performance</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="text-6xl font-bold text-green-500">3.72</div>
                <p className="text-sm text-muted-foreground mt-2">
                  +0.15 from last semester
                </p>
                <div className="w-full mt-4 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: "93%" }}
                  />
                </div>
                <div className="flex justify-between w-full mt-1 text-xs text-muted-foreground">
                  <span>0.0</span>
                  <span>4.0</span>
                </div>
              </CardContent>
            </Card>

            {/* Completion Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Assignment Completion Rate</CardTitle>
                <CardDescription>
                  Percentage of assignments submitted on time
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="text-6xl font-bold text-blue-500">94%</div>
                <p className="text-sm text-muted-foreground mt-2">
                  28 of 30 assignments completed
                </p>
                <div className="w-full mt-4 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: "94%" }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course-wise Grades */}
          <Card>
            <CardHeader>
              <CardTitle>Course-wise Grades</CardTitle>
              <CardDescription>Performance breakdown by course</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Assignments Done</TableHead>
                    <TableHead>Current Grade</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <Badge variant="outline">{course.id}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {course.name}
                      </TableCell>
                      <TableCell>
                        {course.completed} / {course.assignments}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-bold ${
                            course.grade >= 90
                              ? "text-green-500"
                              : course.grade >= 80
                                ? "text-blue-500"
                                : course.grade >= 70
                                  ? "text-yellow-500"
                                  : "text-red-500"
                          }`}
                        >
                          {course.grade}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {course.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <TrendingUp className="h-4 w-4" />
                        </Button>
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
