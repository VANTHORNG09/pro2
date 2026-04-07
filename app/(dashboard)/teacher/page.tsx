"use client";

import * as React from "react";
import {
  FileText,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  BarChart3,
  MessageSquare,
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

// --- Mock Data ---

const teacherStats = [
  {
    title: "My Classes",
    value: "5",
    change: "+1",
    trend: "up",
    icon: BookOpen,
    description: "this semester",
  },
  {
    title: "Total Students",
    value: "248",
    change: "+12",
    trend: "up",
    icon: Users,
    description: "across all classes",
  },
  {
    title: "Pending Grading",
    value: "34",
    change: "-8",
    trend: "down",
    icon: Clock,
    description: "awaiting review",
  },
  {
    title: "Avg Grade",
    value: "82.5%",
    change: "+3.2%",
    trend: "up",
    icon: BarChart3,
    description: "overall average",
  },
];

const gradingQueue = [
  {
    id: "SUB-101",
    student: "Alice Johnson",
    assignment: "Data Structures Final Project",
    class: "CS-301",
    submittedAt: "2026-04-05 14:30",
    status: "submitted",
    files: 3,
  },
  {
    id: "SUB-102",
    student: "Bob Smith",
    assignment: "Algorithm Analysis Report",
    class: "CS-301",
    submittedAt: "2026-04-05 12:15",
    status: "late",
    files: 2,
  },
  {
    id: "SUB-103",
    student: "Carol Davis",
    assignment: "Database Design Project",
    class: "CS-350",
    submittedAt: "2026-04-04 23:55",
    status: "submitted",
    files: 4,
  },
  {
    id: "SUB-104",
    student: "David Lee",
    assignment: "Operating Systems Lab 5",
    class: "CS-301",
    submittedAt: "2026-04-04 18:20",
    status: "graded",
    grade: "88/100",
    files: 2,
  },
  {
    id: "SUB-105",
    student: "Emma Wilson",
    assignment: "Network Security Essay",
    class: "CS-420",
    submittedAt: "2026-04-03 09:45",
    status: "returned",
    grade: "92/100",
    files: 1,
  },
];

const myAssignments = [
  {
    id: "ASG-201",
    title: "Data Structures Final Project",
    class: "CS-301",
    dueDate: "2026-04-15",
    submissions: "42/58",
    submissionRate: 72,
    status: "published",
  },
  {
    id: "ASG-202",
    title: "Algorithm Analysis Report",
    class: "CS-301",
    dueDate: "2026-04-10",
    submissions: "58/58",
    submissionRate: 100,
    status: "closed",
  },
  {
    id: "ASG-203",
    title: "Database Design Project",
    class: "CS-350",
    dueDate: "2026-04-20",
    submissions: "15/45",
    submissionRate: 33,
    status: "published",
  },
  {
    id: "ASG-204",
    title: "Operating Systems Lab 5",
    class: "CS-301",
    dueDate: "2026-04-08",
    submissions: "50/58",
    submissionRate: 86,
    status: "published",
  },
  {
    id: "ASG-205",
    title: "Network Security Essay",
    class: "CS-420",
    dueDate: "2026-04-25",
    submissions: "0/35",
    submissionRate: 0,
    status: "draft",
  },
];

const myClasses = [
  { id: "CS-301", name: "Data Structures & Algorithms", students: 58, avgGrade: 84, assignments: 12, pending: 8 },
  { id: "CS-350", name: "Database Management Systems", students: 45, avgGrade: 79, assignments: 8, pending: 15 },
  { id: "CS-420", name: "Network Security", students: 35, avgGrade: 88, assignments: 6, pending: 5 },
  { id: "CS-450", name: "Machine Learning Fundamentals", students: 62, avgGrade: 81, assignments: 10, pending: 12 },
  { id: "CS-101", name: "Intro to Computer Science", students: 48, avgGrade: 76, assignments: 7, pending: 3 },
];

const weeklyGradingData = [
  { name: "Mon", graded: 8, submitted: 15 },
  { name: "Tue", graded: 12, submitted: 22 },
  { name: "Wed", graded: 15, submitted: 28 },
  { name: "Thu", graded: 10, submitted: 18 },
  { name: "Fri", graded: 18, submitted: 32 },
  { name: "Sat", graded: 5, submitted: 8 },
  { name: "Sun", graded: 3, submitted: 5 },
];

const gradeDistribution = [
  { name: "A (90-100)", value: 45, color: "#22c55e" },
  { name: "B (80-89)", value: 78, color: "#3b82f6" },
  { name: "C (70-79)", value: 62, color: "#f59e0b" },
  { name: "D (60-69)", value: 35, color: "#f97316" },
  { name: "F (<60)", value: 18, color: "#ef4444" },
];

const monthlyPerformance = [
  { month: "Jan", avgGrade: 76, submissions: 180 },
  { month: "Feb", avgGrade: 78, submissions: 210 },
  { month: "Mar", avgGrade: 80, submissions: 245 },
  { month: "Apr", avgGrade: 82, submissions: 280 },
  { month: "May", avgGrade: 81, submissions: 265 },
  { month: "Jun", avgGrade: 84, submissions: 310 },
];

// --- Helper Components ---

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    published: "bg-green-500/20 text-green-400 border-green-500/30",
    draft: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    closed: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    submitted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    late: "bg-red-500/20 text-red-400 border-red-500/30",
    graded: "bg-green-500/20 text-green-400 border-green-500/30",
    returned: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };

  return (
    <Badge className={`capitalize ${variants[status] || variants.draft}`}>
      {status}
    </Badge>
  );
}

// --- Main Page ---

export default function TeacherDashboardPage() {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredGradingQueue = gradingQueue.filter(
    (item) =>
      item.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your classes, assignments, and grading workflow.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="grading">Grading Queue</TabsTrigger>
          <TabsTrigger value="classes">My Classes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* ===== OVERVIEW TAB ===== */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {teacherStats.map((stat) => (
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

          {/* Quick Actions & Alerts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-yellow-500/30 bg-yellow-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <CardTitle>Attention Needed</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overdue grading</span>
                  <Badge variant="destructive">12 submissions</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Assignments due this week</span>
                  <Badge variant="secondary">3 assignments</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Students requesting extensions</span>
                  <Badge variant="outline">5 requests</Badge>
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
                  <Plus className="mr-2 h-4 w-4" />
                  Create Assignment
                </Button>
                <Button variant="outline" className="justify-start">
                  <Clock className="mr-2 h-4 w-4" />
                  View Pending
                </Button>
                <Button variant="outline" className="justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Grade Report
                </Button>
                <Button variant="outline" className="justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Student List
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Weekly Grading Activity */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Weekly Grading Activity</CardTitle>
                <CardDescription>Submissions received vs graded this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyGradingData}>
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
                    <Bar dataKey="submitted" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="graded" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Grade Distribution */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Overall grade breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {gradeDistribution.map((entry, index) => (
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
                <div className="space-y-1 mt-2">
                  {gradeDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value} students</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>My Assignments</CardTitle>
              <CardDescription>Recent assignments across all your classes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-mono text-xs">{assignment.id}</TableCell>
                      <TableCell className="font-medium">{assignment.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{assignment.class}</Badge>
                      </TableCell>
                      <TableCell>{assignment.dueDate}</TableCell>
                      <TableCell>{assignment.submissions}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                assignment.submissionRate >= 80
                                  ? "bg-green-500"
                                  : assignment.submissionRate >= 50
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${assignment.submissionRate}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {assignment.submissionRate}%
                          </span>
                        </div>
                      </TableCell>
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
        </TabsContent>

        {/* ===== GRADING QUEUE TAB ===== */}
        <TabsContent value="grading" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Grading Queue</CardTitle>
                  <CardDescription>
                    {filteredGradingQueue.length} submissions pending review
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
                    <TableHead>Student</TableHead>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead>Files</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGradingQueue.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-mono text-xs">{submission.id}</TableCell>
                      <TableCell className="font-medium">{submission.student}</TableCell>
                      <TableCell>{submission.assignment}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{submission.class}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{submission.submittedAt}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{submission.files} files</Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={submission.status} />
                      </TableCell>
                      <TableCell>
                        {submission.grade ? (
                          <span className="font-medium text-green-500">{submission.grade}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {submission.status === "submitted" || submission.status === "late" ? (
                          <Button size="sm" variant="default">
                            <CheckCircle2 className="mr-2 h-3 w-3" />
                            Grade
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== MY CLASSES TAB ===== */}
        <TabsContent value="classes" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myClasses.map((cls) => (
              <Card key={cls.id} className="hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{cls.id}</Badge>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="mt-3">{cls.name}</CardTitle>
                  <CardDescription>{cls.students} enrolled students</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-2xl font-bold">{cls.avgGrade}%</span>
                      <span className="text-xs text-muted-foreground">Avg Grade</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-2xl font-bold">{cls.assignments}</span>
                      <span className="text-xs text-muted-foreground">Assignments</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pending grading</span>
                    <Badge variant={cls.pending > 10 ? "destructive" : "secondary"}>
                      {cls.pending} submissions
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 text-xs">
                      View Details
                    </Button>
                    <Button className="flex-1 text-xs">
                      <Plus className="mr-1 h-3 w-3" />
                      New Assignment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ===== ANALYTICS TAB ===== */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Monthly Performance Trend */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Monthly Performance Trend</CardTitle>
                <CardDescription>Average grade and submission volume over the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
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
                      yAxisId="left"
                      type="monotone"
                      dataKey="avgGrade"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ fill: "#22c55e", r: 4 }}
                      name="Avg Grade (%)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="submissions"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", r: 4 }}
                      name="Submissions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Submission Completion Rate</CardTitle>
                <CardDescription>Overall on-time submission rate</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-green-500">89%</div>
                <p className="text-sm text-muted-foreground mt-2">
                  +4.5% from last semester
                </p>
                <div className="w-full mt-4 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: "89%" }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avg Grading Turnaround</CardTitle>
                <CardDescription>Time from submission to grade</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-blue-500">1.8 days</div>
                <p className="text-sm text-muted-foreground mt-2">
                  -0.5 days from last month
                </p>
                <div className="w-full mt-4 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: "72%" }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
