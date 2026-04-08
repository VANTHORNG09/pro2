"use client";

import * as React from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Download,
  Search,
  Filter,
  FileText,
  Users,
  GraduationCap,
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
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssignments } from "@/lib/hooks/queries/useAssignments";
import { Assignment } from "@/lib/types/assignment";

// --- Mock Data ---

const weeklyTrends = [
  { week: "W1", submissions: 45, completions: 38, completionRate: 84 },
  { week: "W2", submissions: 62, completions: 54, completionRate: 87 },
  { week: "W3", submissions: 78, completions: 69, completionRate: 88 },
  { week: "W4", submissions: 55, completions: 49, completionRate: 89 },
  { week: "W5", submissions: 91, completions: 82, completionRate: 90 },
  { week: "W6", submissions: 110, completions: 101, completionRate: 92 },
  { week: "W7", submissions: 88, completions: 83, completionRate: 94 },
  { week: "W8", submissions: 125, completions: 119, completionRate: 95 },
];

const monthlyActivity = [
  { month: "Jan", assignments: 12, submissions: 245, graded: 210, avgGrade: 78 },
  { month: "Feb", assignments: 18, submissions: 312, graded: 280, avgGrade: 82 },
  { month: "Mar", assignments: 22, submissions: 456, graded: 420, avgGrade: 80 },
  { month: "Apr", assignments: 28, submissions: 580, graded: 530, avgGrade: 85 },
  { month: "May", assignments: 35, submissions: 720, graded: 680, avgGrade: 83 },
  { month: "Jun", assignments: 30, submissions: 650, graded: 610, avgGrade: 87 },
];

const completionByClass = [
  { className: "Web Development A", code: "CS-301", total: 58, submitted: 48, graded: 42, rate: 83, teacher: "Dr. Sarah Johnson" },
  { className: "Object-Oriented Programming B", code: "CS-202", total: 45, submitted: 45, graded: 45, rate: 100, teacher: "Dr. Sarah Johnson" },
  { className: "Database Systems C", code: "CS-350", total: 32, submitted: 24, graded: 18, rate: 75, teacher: "Prof. Michael Chen" },
  { className: "Data Structures", code: "CS-401", total: 62, submitted: 50, graded: 38, rate: 81, teacher: "Prof. Michael Chen" },
  { className: "Machine Learning", code: "CS-450", total: 38, submitted: 32, graded: 25, rate: 84, teacher: "Dr. Alex Kumar" },
  { className: "Organic Chemistry", code: "CHEM-202", total: 40, submitted: 35, graded: 30, rate: 88, teacher: "Prof. James Miller" },
];

const gradeDistribution = [
  { range: "90-100", count: 186, label: "A" },
  { range: "80-89", count: 312, label: "B" },
  { range: "70-79", count: 245, label: "C" },
  { range: "60-69", count: 98, label: "D" },
  { range: "0-59", count: 42, label: "F" },
];

const lateSubmissionTrend = [
  { month: "Jan", late: 12, onTime: 233, lateRate: 5 },
  { month: "Feb", late: 18, onTime: 294, lateRate: 6 },
  { month: "Mar", late: 25, onTime: 431, lateRate: 5 },
  { month: "Apr", late: 32, onTime: 548, lateRate: 6 },
  { month: "May", late: 45, onTime: 675, lateRate: 6 },
  { month: "Jun", late: 38, onTime: 612, lateRate: 6 },
];

const COLORS = ["#22c55e", "#3b82f6", "#eab308", "#f97316", "#ef4444"];

// --- Helper Components ---

function CompletionBar({ pct }: { pct: number }) {
  const color =
    pct >= 90
      ? "bg-emerald-500"
      : pct >= 75
        ? "bg-blue-500"
        : pct >= 60
          ? "bg-amber-500"
          : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 tabular-nums shrink-0 w-10 text-right">
        {pct}%
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    published: "bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30",
    draft: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30",
    closed: "bg-slate-500/10 text-slate-500 border-slate-500/20 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-500/30",
  };

  return (
    <Badge className={`capitalize ${variants[status] || variants.draft}`}>
      {status}
    </Badge>
  );
}

function TrendIndicator({ value }: { value: number }) {
  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <TrendingUp className="h-3 w-3" />
        +{value}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-red-600 dark:text-red-400">
      <TrendingDown className="h-3 w-3" />
      {value}%
    </span>
  );
}

// --- Custom Tooltip Components ---

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm text-xs">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// --- Main Page ---

export default function AssignmentAnalyticsPage() {
  const [search, setSearch] = React.useState("");
  const [classFilter, setClassFilter] = React.useState("all");

  const { data: assignments = [], isLoading: loadingAssignments } = useAssignments({});

  const totalAssignments = assignments.length;
  const totalSubmissions = assignments.reduce((sum, a) => sum + (a.submissionCount ?? 0), 0);
  const totalGraded = assignments.reduce((sum, a) => sum + (a.gradedCount ?? 0), 0);
  const totalPending = assignments.reduce((sum, a) => sum + (a.pendingCount ?? 0), 0);
  const overallCompletionRate = totalSubmissions > 0
    ? Math.round((totalGraded / totalSubmissions) * 100)
    : 0;

  const uniqueClasses = Array.from(
    new Map(completionByClass.map((c) => [c.code, c.className])).entries()
  );

  const filteredClasses = completionByClass.filter((c) => {
    const matchSearch =
      !search ||
      c.className.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.teacher.toLowerCase().includes(search.toLowerCase());
    const matchClass = classFilter === "all" || c.code === classFilter;
    return matchSearch && matchClass;
  });

  const handleExportCSV = () => {
    const headers = ["Class", "Code", "Teacher", "Total Students", "Submitted", "Graded", "Completion Rate"];
    const rows = filteredClasses.map((c) => [
      c.className,
      c.code,
      c.teacher,
      c.total.toString(),
      c.submitted.toString(),
      c.graded.toString(),
      `${c.rate}%`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "assignment_analytics.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
            Assignment Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track completion rates, trends, and performance across all assignments.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg p-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{totalAssignments}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Assignments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{totalSubmissions}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Submissions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{totalGraded}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Graded</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{totalPending}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg p-2 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
              <Target className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{overallCompletionRate}%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Completion Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Completion Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Weekly Completion Rate
            </CardTitle>
            <CardDescription>Submission completion trend over the past 8 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis domain={[0, 100]} className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completionRate"
                  name="Completion %"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              Grade Distribution
            </CardTitle>
            <CardDescription>Breakdown of grades across all assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                <XAxis dataKey="label" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              Monthly Activity
            </CardTitle>
            <CardDescription>Assignments, submissions, and grading over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="submissions"
                  name="Submissions"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="graded"
                  name="Graded"
                  stackId="2"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie: Completion Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Overall Completion</CardTitle>
            <CardDescription>Submissions vs pending</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Graded", value: totalGraded },
                    { name: "Pending", value: totalPending },
                    { name: "Draft", value: Math.max(0, totalSubmissions - totalGraded - totalPending) },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {COLORS.map((c, i) => (
                    <Cell key={i} fill={c} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Graded ({totalGraded})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                Pending ({totalPending})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                In Progress
              </span>
            </div>
            <div className="mt-4 text-center">
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{overallCompletionRate}%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">completion rate</p>
              <TrendIndicator value={5} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Late Submission Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Late Submission Trend
          </CardTitle>
          <CardDescription>Late vs on-time submission rates over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={lateSubmissionTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="onTime" name="On Time" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="late" name="Late" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search classes, codes, or teachers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {uniqueClasses.map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {code} — {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Class Completion Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Completion by Class</CardTitle>
              <CardDescription>
                {filteredClasses.length} class{filteredClasses.length !== 1 ? "es" : ""} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-center">Submitted</TableHead>
                <TableHead className="text-center">Graded</TableHead>
                <TableHead className="w-[200px]">Completion Rate</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                    No classes match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClasses.map((c) => (
                  <TableRow key={c.code}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm text-slate-800 dark:text-white">{c.className}</p>
                        <p className="text-xs text-slate-400 font-mono">{c.code}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                      {c.teacher}
                    </TableCell>
                    <TableCell className="text-center text-sm text-slate-500 dark:text-slate-400">
                      {c.total}
                    </TableCell>
                    <TableCell className="text-center text-sm text-slate-500 dark:text-slate-400">
                      {c.submitted}
                    </TableCell>
                    <TableCell className="text-center text-sm text-slate-500 dark:text-slate-400">
                      {c.graded}
                    </TableCell>
                    <TableCell>
                      <CompletionBar pct={c.rate} />
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge
                        status={
                          c.rate >= 90
                            ? "published"
                            : c.rate >= 75
                              ? "draft"
                              : "closed"
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Average Grade Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-violet-500" />
            Average Grade Trend
          </CardTitle>
          <CardDescription>Monthly average grade performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyActivity}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis domain={[0, 100]} className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="avgGrade"
                name="Avg Grade"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
