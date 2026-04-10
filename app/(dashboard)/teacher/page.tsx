"use client";

import * as React from "react";
import Link from "next/link";
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
  ClipboardList,
  UserCheck,
  Download,
  Eye,
  Filter,
  TrendingUp,
  GraduationCap,
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
import { toast } from "sonner";

// --- Mock Data ---

const teacherStats = [
  { title: "My Classes", value: "5", change: "+1", trend: "up" as const, icon: BookOpen, description: "this semester" },
  { title: "Total Students", value: "248", change: "+12", trend: "up" as const, icon: Users, description: "across all classes" },
  { title: "Pending Grading", value: "34", change: "-8", trend: "down" as const, icon: Clock, description: "awaiting review" },
  { title: "Avg Grade", value: "82.5%", change: "+3.2%", trend: "up" as const, icon: BarChart3, description: "overall average" },
];

const gradingQueue = [
  { id: "SUB-101", student: "Alice Johnson", assignment: "Data Structures Final Project", class: "CS-301", submittedAt: "2026-04-05 14:30", status: "submitted", files: 3 },
  { id: "SUB-102", student: "Bob Smith", assignment: "Algorithm Analysis Report", class: "CS-301", submittedAt: "2026-04-05 12:15", status: "late", files: 2 },
  { id: "SUB-103", student: "Carol Davis", assignment: "Database Design Project", class: "CS-350", submittedAt: "2026-04-04 23:55", status: "submitted", files: 4 },
  { id: "SUB-104", student: "David Lee", assignment: "Operating Systems Lab 5", class: "CS-301", submittedAt: "2026-04-04 18:20", status: "graded", grade: "88/100", files: 2 },
  { id: "SUB-105", student: "Emma Wilson", assignment: "Network Security Essay", class: "CS-420", submittedAt: "2026-04-03 09:45", status: "returned", grade: "92/100", files: 1 },
];

const myAssignments = [
  { id: "ASG-201", title: "Data Structures Final Project", class: "CS-301", dueDate: "2026-04-15", submissions: "42/58", submissionRate: 72, status: "published" as const },
  { id: "ASG-202", title: "Algorithm Analysis Report", class: "CS-301", dueDate: "2026-04-10", submissions: "58/58", submissionRate: 100, status: "closed" as const },
  { id: "ASG-203", title: "Database Design Project", class: "CS-350", dueDate: "2026-04-20", submissions: "15/45", submissionRate: 33, status: "published" as const },
  { id: "ASG-204", title: "Operating Systems Lab 5", class: "CS-301", dueDate: "2026-04-08", submissions: "50/58", submissionRate: 86, status: "published" as const },
  { id: "ASG-205", title: "Network Security Essay", class: "CS-420", dueDate: "2026-04-25", submissions: "0/35", submissionRate: 0, status: "draft" as const },
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
    published: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    draft: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    closed: "bg-slate-500/10 text-slate-700 dark:text-slate-400",
    submitted: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    late: "bg-red-500/10 text-red-700 dark:text-red-400",
    graded: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    returned: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  };

  return (
    <Badge variant="secondary" className={variants[status] || variants.draft}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

// --- Stat Card ---
function DashboardStat({ title, value, change, trend, icon: Icon, description }: typeof teacherStats[number]) {
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

export default function TeacherDashboardPage() {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filteredGradingQueue = gradingQueue.filter((item) => {
    const matchSearch = item.student.toLowerCase().includes(searchQuery.toLowerCase()) || item.assignment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleExportGrades = () => {
    const headers = ["Student", "Assignment", "Class", "Grade", "Status"];
    const rows = gradingQueue.filter((s) => s.grade).map((s) => [s.student, s.assignment, s.class, s.grade || "", s.status]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grades-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Grades exported");
  };

  // Derived stats
  const totalPending = gradingQueue.filter((s) => s.status === "submitted" || s.status === "late").length;
  const totalGraded = gradingQueue.filter((s) => s.status === "graded" || s.status === "returned").length;
  const avgGradeValue = gradingQueue.filter((s) => s.grade).reduce((sum, s) => sum + parseInt(s.grade || "0"), 0) / gradingQueue.filter((s) => s.grade).length || 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your classes, assignments, and grading workflow.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportGrades}>
            <Download className="mr-2 h-4 w-4" />
            Export Grades
          </Button>
          <Link href="/teacher/assignments/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Assignment
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {teacherStats.map((stat) => (
          <DashboardStat key={stat.title} {...stat} />
        ))}
      </div>

      {/* Performance & Quick Access */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Class Performance Overview</CardTitle>
            <CardDescription>Average grades and student counts by class</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={myClasses}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="id" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(30, 30, 50, 0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }} />
                <Bar dataKey="avgGrade" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Avg Grade" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/teacher/submissions">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Grade Pending ({totalPending})
              </Button>
            </Link>
            <Link href="/teacher/assignments">
              <Button variant="outline" className="w-full justify-start">
                <ClipboardList className="mr-2 h-4 w-4" />
                Manage Assignments
              </Button>
            </Link>
            <Link href="/teacher/grades">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Grade Report
              </Button>
            </Link>
            <Link href="/teacher/students">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                View Students
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Monthly Trend */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
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
              <span className="text-sm">Extension requests</span>
              <Badge variant="outline">5 requests</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(30, 30, 50, 0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }} />
                <Line type="monotone" dataKey="avgGrade" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-6">
        <TabsList className="w-fit">
          <TabsTrigger value="overview">Assignments</TabsTrigger>
          <TabsTrigger value="grading">Grading Queue ({totalPending})</TabsTrigger>
          <TabsTrigger value="classes">My Classes</TabsTrigger>
        </TabsList>

        {/* Assignments Tab */}
        <TabsContent value="overview">
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
                  {myAssignments.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-xs">{a.id}</TableCell>
                      <TableCell className="font-medium">{a.title}</TableCell>
                      <TableCell><Badge variant="secondary">{a.class}</Badge></TableCell>
                      <TableCell>{a.dueDate}</TableCell>
                      <TableCell>{a.submissions}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16"><Progress value={a.submissionRate} className="h-2" /></div>
                          <span className="text-xs text-muted-foreground">{a.submissionRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={a.status} /></TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              <Link href={`/teacher/assignments/${a.id}`}>
                                <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                              </Link>
                              <Link href={`/teacher/assignments/${a.id}/edit`}>
                                <DropdownMenuItem><FileText className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                              </Link>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grading Queue Tab */}
        <TabsContent value="grading">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Grading Queue</CardTitle>
                  <CardDescription>{filteredGradingQueue.length} submissions</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="graded">Graded</SelectItem>
                      <SelectItem value="returned">Returned</SelectItem>
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
                    <TableHead>Student</TableHead>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGradingQueue.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">{s.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7"><AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-[10px]">{getInitials(s.student)}</AvatarFallback></Avatar>
                          <span className="text-sm font-medium">{s.student}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{s.assignment}</TableCell>
                      <TableCell><Badge variant="secondary">{s.class}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.submittedAt}</TableCell>
                      <TableCell><StatusBadge status={s.status} /></TableCell>
                      <TableCell>{s.grade ? <span className="font-medium text-emerald-500">{s.grade}</span> : <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell className="text-right">
                        {s.status === "submitted" || s.status === "late" ? (
                          <Link href={`/teacher/assignments/${s.id}/submissions`}>
                            <Button size="sm">Grade</Button>
                          </Link>
                        ) : (
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myClasses.map((c) => (
              <Card key={c.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-2 font-mono text-xs">{c.id}</Badge>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{c.students} students</p>
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs"><BookOpen className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                  </div>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div><p className="text-muted-foreground">Assignments</p><p className="font-semibold">{c.assignments}</p></div>
                    <div><p className="text-muted-foreground">Avg Grade</p><p className="font-semibold">{c.avgGrade}%</p></div>
                    <div><p className="text-muted-foreground">Pending</p><p className="font-semibold">{c.pending}</p></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Weekly Grading Activity</CardTitle><CardDescription>Submissions received vs graded</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyGradingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(30, 30, 50, 0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }} />
                <Bar dataKey="submitted" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="graded" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Grade Distribution</CardTitle><CardDescription>Overall grade breakdown</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={gradeDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value">
                  {gradeDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "rgba(30, 30, 50, 0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {gradeDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
