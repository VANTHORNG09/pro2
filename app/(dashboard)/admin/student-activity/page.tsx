"use client";

import * as React from "react";
import {
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  LogIn,
  FileText,
  Clock,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  User,
  BarChart3,
  PieChart,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// --- Types ---

interface StudentActivity {
  student: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  lastLogin: string;
  totalLogins: number;
  assignmentsSubmitted: number;
  assignmentsPending: number;
  averageGrade: number;
  engagementScore: number; // 0-100
  activityLevel: "high" | "medium" | "low";
  classes: number;
  lastSubmission: string;
}

// --- Mock Data ---

const mockStudentActivity: StudentActivity[] = [
  {
    student: {
      id: "S001",
      name: "Alice Johnson",
      email: "alice@assignbridge.com",
    },
    lastLogin: "2026-04-10T14:30:00Z",
    totalLogins: 45,
    assignmentsSubmitted: 15,
    assignmentsPending: 2,
    averageGrade: 92.5,
    engagementScore: 95,
    activityLevel: "high",
    classes: 4,
    lastSubmission: "2026-04-09T16:20:00Z",
  },
  {
    student: {
      id: "S002",
      name: "Bob Smith",
      email: "bob@assignbridge.com",
    },
    lastLogin: "2026-04-09T09:15:00Z",
    totalLogins: 32,
    assignmentsSubmitted: 12,
    assignmentsPending: 5,
    averageGrade: 87.3,
    engagementScore: 78,
    activityLevel: "medium",
    classes: 3,
    lastSubmission: "2026-04-08T11:45:00Z",
  },
  {
    student: {
      id: "S003",
      name: "Charlie Brown",
      email: "charlie@assignbridge.com",
    },
    lastLogin: "2026-04-10T10:00:00Z",
    totalLogins: 28,
    assignmentsSubmitted: 10,
    assignmentsPending: 3,
    averageGrade: 84.1,
    engagementScore: 72,
    activityLevel: "medium",
    classes: 4,
    lastSubmission: "2026-04-07T14:30:00Z",
  },
  {
    student: {
      id: "S004",
      name: "Diana Prince",
      email: "diana@assignbridge.com",
    },
    lastLogin: "2026-04-08T16:45:00Z",
    totalLogins: 18,
    assignmentsSubmitted: 8,
    assignmentsPending: 7,
    averageGrade: 76.8,
    engagementScore: 45,
    activityLevel: "low",
    classes: 3,
    lastSubmission: "2026-04-05T13:15:00Z",
  },
  {
    student: {
      id: "S005",
      name: "Eve Wilson",
      email: "eve@assignbridge.com",
    },
    lastLogin: "2026-04-07T12:20:00Z",
    totalLogins: 15,
    assignmentsSubmitted: 6,
    assignmentsPending: 8,
    averageGrade: 71.4,
    engagementScore: 35,
    activityLevel: "low",
    classes: 2,
    lastSubmission: "2026-04-03T09:30:00Z",
  },
  {
    student: {
      id: "S006",
      name: "Frank Miller",
      email: "frank@assignbridge.com",
    },
    lastLogin: "2026-04-10T15:10:00Z",
    totalLogins: 52,
    assignmentsSubmitted: 18,
    assignmentsPending: 1,
    averageGrade: 94.7,
    engagementScore: 98,
    activityLevel: "high",
    classes: 5,
    lastSubmission: "2026-04-10T14:45:00Z",
  },
];

// --- Components ---

function ActivityLevelBadge({ level }: { level: StudentActivity["activityLevel"] }) {
  const config = {
    high: { label: "High", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    medium: { label: "Medium", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    low: { label: "Low", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  };

  const { label, color } = config[level];

  return (
    <Badge variant="outline" className={color}>
      {label}
    </Badge>
  );
}

function StudentActivityCard({ student }: { student: StudentActivity }) {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const lastLogin = formatDate(student.lastLogin);
  const lastSubmission = formatDate(student.lastSubmission);

  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(student.student.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{student.student.name}</h3>
                <p className="text-sm text-muted-foreground">{student.student.email}</p>
              </div>
              <div className="text-right">
                <ActivityLevelBadge level={student.activityLevel} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold">{student.engagementScore}%</div>
                <div className="text-xs text-muted-foreground">Engagement</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{student.averageGrade}%</div>
                <div className="text-xs text-muted-foreground">Avg Grade</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{student.assignmentsSubmitted}</div>
                <div className="text-xs text-muted-foreground">Submitted</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{student.totalLogins}</div>
                <div className="text-xs text-muted-foreground">Logins</div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <LogIn className="h-3.5 w-3.5" />
                <span>Last login: {lastLogin.date} {lastLogin.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                <span>Last submission: {lastSubmission.date}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main Page ---

export default function StudentActivityPage() {
  const [students, setStudents] = React.useState<StudentActivity[]>(mockStudentActivity);
  const [search, setSearch] = React.useState("");
  const [activityFilter, setActivityFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("engagement");

  const filteredStudents = students.filter((student) => {
    const matchSearch =
      !search ||
      student.student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.student.email.toLowerCase().includes(search.toLowerCase());
    const matchActivity = activityFilter === "all" || student.activityLevel === activityFilter;
    return matchSearch && matchActivity;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case "engagement":
        return b.engagementScore - a.engagementScore;
      case "grade":
        return b.averageGrade - a.averageGrade;
      case "logins":
        return b.totalLogins - a.totalLogins;
      case "submissions":
        return b.assignmentsSubmitted - a.assignmentsSubmitted;
      default:
        return 0;
    }
  });

  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter((s) => s.activityLevel === "high").length,
    mediumActivity: students.filter((s) => s.activityLevel === "medium").length,
    lowActivity: students.filter((s) => s.activityLevel === "low").length,
    averageEngagement: Math.round(students.reduce((sum, s) => sum + s.engagementScore, 0) / students.length),
    totalLogins: students.reduce((sum, s) => sum + s.totalLogins, 0),
    totalSubmissions: students.reduce((sum, s) => sum + s.assignmentsSubmitted, 0),
  };

  const handleExport = () => {
    const headers = [
      "Student Name",
      "Email",
      "Last Login",
      "Total Logins",
      "Assignments Submitted",
      "Assignments Pending",
      "Average Grade",
      "Engagement Score",
      "Activity Level",
      "Classes",
      "Last Submission",
    ];
    const rows = sortedStudents.map((s) => [
      s.student.name,
      s.student.email,
      s.lastLogin,
      s.totalLogins.toString(),
      s.assignmentsSubmitted.toString(),
      s.assignmentsPending.toString(),
      s.averageGrade.toString(),
      s.engagementScore.toString(),
      s.activityLevel,
      s.classes.toString(),
      s.lastSubmission,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `student-activity-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Activity</h1>
          <p className="text-sm text-muted-foreground">
            Monitor student engagement, login patterns, and submission activity.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engagement">Sort by Engagement</SelectItem>
              <SelectItem value="grade">Sort by Grade</SelectItem>
              <SelectItem value="logins">Sort by Logins</SelectItem>
              <SelectItem value="submissions">Sort by Submissions</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-500/10 p-3">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalStudents}</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-emerald-500/10 p-3">
              <Activity className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.averageEngagement}%</p>
              <p className="text-sm text-muted-foreground">Avg Engagement</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-purple-500/10 p-3">
              <LogIn className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalLogins}</p>
              <p className="text-sm text-muted-foreground">Total Logins</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-amber-500/10 p-3">
              <FileText className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
              <p className="text-sm text-muted-foreground">Total Submissions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Distribution</CardTitle>
          <CardDescription>Student engagement levels across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <div className="text-2xl font-bold text-emerald-600">{stats.activeStudents}</div>
              <div className="text-sm text-emerald-700 dark:text-emerald-400">High Activity</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30">
              <div className="text-2xl font-bold text-amber-600">{stats.mediumActivity}</div>
              <div className="text-sm text-amber-700 dark:text-amber-400">Medium Activity</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/30">
              <div className="text-2xl font-bold text-red-600">{stats.lowActivity}</div>
              <div className="text-sm text-red-700 dark:text-red-400">Low Activity</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Student Activity</CardTitle>
          <CardDescription>{sortedStudents.length} students found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={activityFilter} onValueChange={setActivityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Activity Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="high">High Activity</SelectItem>
                <SelectItem value="medium">Medium Activity</SelectItem>
                <SelectItem value="low">Low Activity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Student Activity List */}
      <div className="space-y-4">
        {sortedStudents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No students found</p>
              <p className="text-xs mt-1">Try adjusting your filters</p>
            </CardContent>
          </Card>
        ) : (
          sortedStudents.map((student) => (
            <StudentActivityCard key={student.student.id} student={student} />
          ))
        )}
      </div>
    </div>
  );
}