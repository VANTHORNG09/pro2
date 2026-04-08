"use client";

import * as React from "react";
import {
  Search,
  Filter,
  Download,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
  ChevronDown,
  Eye,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClasses } from "@/lib/hooks/queries/useClasses";
import { classesAPI } from "@/lib/api/classes";
import { mockClasses, mockStudents } from "@/lib/data/classes";
import { StudentInClass } from "@/lib/types/classes";

// --- Mock Data ---

const classMetrics = [
  {
    code: "CS301",
    name: "Web Development A",
    teacher: "Dr. Sarah Johnson",
    students: 28,
    active: 27,
    assignments: 12,
    published: 10,
    submitted: 252,
    graded: 220,
    pending: 32,
    avgGrade: 87.5,
    submissionRate: 89,
    passRate: 96,
    trend: "up",
    trendValue: 5,
  },
  {
    code: "CS202",
    name: "Object-Oriented Programming B",
    teacher: "Dr. Sarah Johnson",
    students: 32,
    active: 31,
    assignments: 10,
    published: 8,
    submitted: 280,
    graded: 270,
    pending: 10,
    avgGrade: 91.2,
    submissionRate: 94,
    passRate: 100,
    trend: "up",
    trendValue: 8,
  },
  {
    code: "CS305",
    name: "Database Systems C",
    teacher: "Dr. Sarah Johnson",
    students: 25,
    active: 24,
    assignments: 8,
    published: 6,
    submitted: 160,
    graded: 135,
    pending: 25,
    avgGrade: 82.3,
    submissionRate: 84,
    passRate: 92,
    trend: "down",
    trendValue: 3,
  },
  {
    code: "CS201",
    name: "Data Structures",
    teacher: "Prof. Michael Chen",
    students: 30,
    active: 22,
    assignments: 15,
    published: 15,
    submitted: 380,
    graded: 360,
    pending: 20,
    avgGrade: 79.8,
    submissionRate: 82,
    passRate: 87,
    trend: "up",
    trendValue: 2,
  },
  {
    code: "CS450",
    name: "Machine Learning",
    teacher: "Dr. Alex Kumar",
    students: 38,
    active: 36,
    assignments: 9,
    published: 7,
    submitted: 270,
    graded: 225,
    pending: 45,
    avgGrade: 85.1,
    submissionRate: 88,
    passRate: 94,
    trend: "up",
    trendValue: 6,
  },
  {
    code: "CHEM202",
    name: "Organic Chemistry",
    teacher: "Prof. James Miller",
    students: 40,
    active: 38,
    assignments: 11,
    published: 9,
    submitted: 340,
    graded: 300,
    pending: 40,
    avgGrade: 83.7,
    submissionRate: 85,
    passRate: 91,
    trend: "down",
    trendValue: 4,
  },
];

const radarData = [
  { metric: "Completion", CS301: 89, CS202: 94, CS305: 84 },
  { metric: "Avg Grade", CS301: 87, CS202: 91, CS305: 82 },
  { metric: "Pass Rate", CS301: 96, CS202: 100, CS305: 92 },
  { metric: "Active %", CS301: 96, CS202: 97, CS305: 96 },
  { metric: "Published", CS301: 83, CS202: 80, CS305: 75 },
];

// --- Helper Components ---

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30",
    inactive: "bg-slate-500/10 text-slate-500 border-slate-500/20 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-500/30",
    archived: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30",
  };

  return (
    <Badge className={`capitalize ${variants[status] || variants.active}`}>
      {status}
    </Badge>
  );
}

function TrendIndicator({ trend, value }: { trend: string; value: number }) {
  if (trend === "up") {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <ArrowUpRight className="h-3 w-3" />
        +{value}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-red-600 dark:text-red-400">
      <ArrowDownRight className="h-3 w-3" />
      -{value}%
    </span>
  );
}

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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-purple-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

// --- Class Detail Dialog ---

function ClassDetailDialog({
  classCode,
  open,
  onOpenChange,
}: {
  classCode: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [students, setStudents] = React.useState<StudentInClass[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setLoading(true);
      const cls = mockClasses.find((c) => c.code === classCode);
      if (cls) {
        classesAPI.getStudents(cls.id).then((s) => {
          setStudents(s);
          setLoading(false);
        });
      } else {
        setStudents(mockStudents);
        setLoading(false);
      }
    }
  }, [open, classCode]);

  const clsData = mockClasses.find((c) => c.code === classCode);
  const metrics = classMetrics.find((m) => m.code === classCode);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-500" />
            {clsData?.name ?? classCode}
          </DialogTitle>
          <DialogDescription>
            {clsData?.code} · {clsData?.teacherName} · {clsData?.subject}
          </DialogDescription>
        </DialogHeader>

        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-xl font-bold text-slate-800 dark:text-white">{metrics.students}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Students</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-xl font-bold text-slate-800 dark:text-white">{metrics.assignments}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Assignments</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-xl font-bold text-slate-800 dark:text-white">{metrics.avgGrade}%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Avg Grade</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-xl font-bold text-slate-800 dark:text-white">{metrics.submissionRate}%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Submission Rate</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="students">
          <TabsList className="w-full">
            <TabsTrigger value="students" className="flex-1">Students</TabsTrigger>
            <TabsTrigger value="assignments" className="flex-1">Assignments</TabsTrigger>
            <TabsTrigger value="performance" className="flex-1">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-3 mt-4">
            {loading ? (
              <p className="text-center text-sm text-slate-500 py-8">Loading students...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-center">Submitted</TableHead>
                    <TableHead className="text-center">Graded</TableHead>
                    <TableHead className="text-center">Pending</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${getAvatarColor(s.studentName)}`}
                          >
                            {getInitials(s.studentName)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800 dark:text-white">{s.studentName}</p>
                            <p className="text-xs text-slate-400">{s.studentEmail}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm">{s.submissionCount}</TableCell>
                      <TableCell className="text-center text-sm">{s.gradedCount}</TableCell>
                      <TableCell className="text-center text-sm text-amber-600">{s.pendingCount}</TableCell>
                      <TableCell className="text-center text-sm font-medium">{s.grade ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="assignments" className="space-y-3 mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Total Assignments</p>
                  <p className="text-xs text-slate-500">Created for this class</p>
                </div>
                <p className="text-lg font-bold">{metrics?.assignments ?? 0}</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Published</p>
                  <p className="text-xs text-slate-500">Currently active</p>
                </div>
                <p className="text-lg font-bold text-emerald-600">{metrics?.published ?? 0}</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Total Submissions</p>
                  <p className="text-xs text-slate-500">Across all assignments</p>
                </div>
                <p className="text-lg font-bold">{metrics?.submitted ?? 0}</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Graded</p>
                  <p className="text-xs text-slate-500">Completed evaluation</p>
                </div>
                <p className="text-lg font-bold text-blue-600">{metrics?.graded ?? 0}</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Pending Grading</p>
                  <p className="text-xs text-slate-500">Awaiting review</p>
                </div>
                <p className="text-lg font-bold text-amber-600">{metrics?.pending ?? 0}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-3 mt-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">Submission Rate</span>
                  <span className="text-slate-500">{metrics?.submissionRate}%</span>
                </div>
                <CompletionBar pct={metrics?.submissionRate ?? 0} />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">Pass Rate</span>
                  <span className="text-slate-500">{metrics?.passRate}%</span>
                </div>
                <CompletionBar pct={metrics?.passRate ?? 0} />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">Average Grade</span>
                  <span className="text-slate-500">{metrics?.avgGrade}%</span>
                </div>
                <CompletionBar pct={metrics?.avgGrade ?? 0} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium">Trend</p>
                    <p className="text-xs text-slate-500">Month-over-month</p>
                  </div>
                </div>
                {metrics && (
                  <TrendIndicator trend={metrics.trend} value={metrics.trendValue} />
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// --- Main Page ---

export default function ClassWiseSummaryPage() {
  const [search, setSearch] = React.useState("");
  const [semesterFilter, setSemesterFilter] = React.useState("all");
  const [teacherFilter, setTeacherFilter] = React.useState("all");
  const [selectedClass, setSelectedClass] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const { data: classes = [], isLoading: loadingClasses } = useClasses({});

  const uniqueTeachers = Array.from(new Set(mockClasses.map((c) => c.teacherName)));
  const uniqueSemesters = Array.from(new Set(mockClasses.map((c) => `${c.semester} ${c.year}`)));

  const filtered = classMetrics.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.teacher.toLowerCase().includes(search.toLowerCase());
    const matchSemester = semesterFilter === "all" || uniqueSemesters.includes(semesterFilter);
    const matchTeacher = teacherFilter === "all" || c.teacher === teacherFilter;
    return matchSearch && matchSemester && matchTeacher;
  });

  // Aggregate stats
  const totalStudents = classMetrics.reduce((sum, c) => sum + c.students, 0);
  const totalAssignments = classMetrics.reduce((sum, c) => sum + c.assignments, 0);
  const totalSubmissions = classMetrics.reduce((sum, c) => sum + c.submitted, 0);
  const totalGraded = classMetrics.reduce((sum, c) => sum + c.graded, 0);
  const avgSubmissionRate = Math.round(classMetrics.reduce((sum, c) => sum + c.submissionRate, 0) / classMetrics.length);
  const avgGrade = Math.round(classMetrics.reduce((sum, c) => sum + c.avgGrade, 0) / classMetrics.length);

  const handleExportCSV = () => {
    const headers = ["Class", "Code", "Teacher", "Students", "Assignments", "Submitted", "Graded", "Pending", "Avg Grade", "Submission Rate", "Pass Rate"];
    const rows = filtered.map((c) => [
      c.name,
      c.code,
      c.teacher,
      c.students.toString(),
      c.assignments.toString(),
      c.submitted.toString(),
      c.graded.toString(),
      c.pending.toString(),
      `${c.avgGrade}%`,
      `${c.submissionRate}%`,
      `${c.passRate}%`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "class_wise_summary.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const openClassDetail = (code: string) => {
    setSelectedClass(code);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
            Class-wise Summary
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Breakdown of metrics by individual classes.
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg p-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{classMetrics.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Classes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{totalStudents}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg p-2 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{totalAssignments}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Assignments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{totalSubmissions}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Submissions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{avgSubmissionRate}%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Avg Submission</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg p-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{avgGrade}%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Avg Grade</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Submissions by Class */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Submissions by Class</CardTitle>
            <CardDescription>Submitted, graded, and pending counts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={filtered.map((c) => ({
                  name: c.code,
                  submitted: c.submitted,
                  graded: c.graded,
                  pending: c.pending,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Bar dataKey="submitted" name="Submitted" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="graded" name="Graded" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar: Class Comparison */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Class Comparison</CardTitle>
            <CardDescription>Multi-metric comparison across classes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid className="stroke-slate-200 dark:stroke-slate-800" />
                <PolarAngleAxis dataKey="metric" className="text-xs" />
                <PolarRadiusAxis domain={[0, 100]} className="text-xs" />
                <Radar name="CS301" dataKey="CS301" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="CS202" dataKey="CS202" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="CS305" dataKey="CS305" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

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
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {uniqueSemesters.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={teacherFilter} onValueChange={setTeacherFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Teacher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {uniqueTeachers.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Class-wise Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Class Metrics</CardTitle>
              <CardDescription>
                {filtered.length} class{filtered.length !== 1 ? "es" : ""} found
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
                <TableHead className="text-center">Students</TableHead>
                <TableHead className="text-center">Assignments</TableHead>
                <TableHead className="text-center">Submitted</TableHead>
                <TableHead className="text-center">Graded</TableHead>
                <TableHead className="text-center">Pending</TableHead>
                <TableHead className="text-center">Avg Grade</TableHead>
                <TableHead className="w-[160px]">Submission Rate</TableHead>
                <TableHead className="text-center">Trend</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-32 text-center text-slate-500">
                    No classes match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow key={c.code}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm text-slate-800 dark:text-white">{c.name}</p>
                        <p className="text-xs text-slate-400 font-mono">{c.code}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                      {c.teacher}
                    </TableCell>
                    <TableCell className="text-center text-sm text-slate-500 dark:text-slate-400">
                      {c.students}
                    </TableCell>
                    <TableCell className="text-center text-sm text-slate-500 dark:text-slate-400">
                      {c.assignments}
                    </TableCell>
                    <TableCell className="text-center text-sm text-slate-500 dark:text-slate-400">
                      {c.submitted}
                    </TableCell>
                    <TableCell className="text-center text-sm text-emerald-600 dark:text-emerald-400">
                      {c.graded}
                    </TableCell>
                    <TableCell className="text-center text-sm text-amber-600 dark:text-amber-400">
                      {c.pending}
                    </TableCell>
                    <TableCell className="text-center text-sm font-medium">
                      {c.avgGrade}%
                    </TableCell>
                    <TableCell>
                      <CompletionBar pct={c.submissionRate} />
                    </TableCell>
                    <TableCell className="text-center">
                      <TrendIndicator trend={c.trend} value={c.trendValue} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="View Details"
                        onClick={() => openClassDetail(c.code)}
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Class Detail Dialog */}
      {selectedClass && (
        <ClassDetailDialog
          classCode={selectedClass}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  );
}
