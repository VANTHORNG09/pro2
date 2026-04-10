"use client";

import * as React from "react";
import {
  Award,
  Trophy,
  Medal,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Users,
  BookOpen,
  Calendar,
  Star,
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

interface TopPerformer {
  rank: number;
  student: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  class: {
    id: string;
    name: string;
    code: string;
  };
  stats: {
    overallGrade: number;
    assignmentsCompleted: number;
    averageGrade: number;
    submissionsOnTime: number;
    totalSubmissions: number;
    trend: "up" | "down" | "stable";
  };
}

// --- Mock Data ---

const mockTopPerformers: TopPerformer[] = [
  {
    rank: 1,
    student: {
      id: "S001",
      name: "Alice Johnson",
      email: "alice@assignbridge.com",
    },
    class: {
      id: "C001",
      name: "Data Structures & Algorithms",
      code: "CS-401",
    },
    stats: {
      overallGrade: 98.5,
      assignmentsCompleted: 15,
      averageGrade: 97.2,
      submissionsOnTime: 15,
      totalSubmissions: 15,
      trend: "up",
    },
  },
  {
    rank: 2,
    student: {
      id: "S002",
      name: "Bob Smith",
      email: "bob@assignbridge.com",
    },
    class: {
      id: "C002",
      name: "Machine Learning",
      code: "CS-450",
    },
    stats: {
      overallGrade: 96.8,
      assignmentsCompleted: 12,
      averageGrade: 95.9,
      submissionsOnTime: 11,
      totalSubmissions: 12,
      trend: "up",
    },
  },
  {
    rank: 3,
    student: {
      id: "S003",
      name: "Charlie Brown",
      email: "charlie@assignbridge.com",
    },
    class: {
      id: "C003",
      name: "Database Systems",
      code: "CS-350",
    },
    stats: {
      overallGrade: 95.3,
      assignmentsCompleted: 10,
      averageGrade: 94.7,
      submissionsOnTime: 10,
      totalSubmissions: 10,
      trend: "stable",
    },
  },
  {
    rank: 4,
    student: {
      id: "S004",
      name: "Diana Prince",
      email: "diana@assignbridge.com",
    },
    class: {
      id: "C004",
      name: "Web Development",
      code: "CS-301",
    },
    stats: {
      overallGrade: 94.1,
      assignmentsCompleted: 14,
      averageGrade: 93.8,
      submissionsOnTime: 13,
      totalSubmissions: 14,
      trend: "up",
    },
  },
  {
    rank: 5,
    student: {
      id: "S005",
      name: "Eve Wilson",
      email: "eve@assignbridge.com",
    },
    class: {
      id: "C005",
      name: "Object-Oriented Programming",
      code: "CS-202",
    },
    stats: {
      overallGrade: 92.7,
      assignmentsCompleted: 13,
      averageGrade: 92.1,
      submissionsOnTime: 12,
      totalSubmissions: 13,
      trend: "down",
    },
  },
  {
    rank: 6,
    student: {
      id: "S006",
      name: "Frank Miller",
      email: "frank@assignbridge.com",
    },
    class: {
      id: "C001",
      name: "Data Structures & Algorithms",
      code: "CS-401",
    },
    stats: {
      overallGrade: 91.4,
      assignmentsCompleted: 15,
      averageGrade: 90.8,
      submissionsOnTime: 14,
      totalSubmissions: 15,
      trend: "stable",
    },
  },
  {
    rank: 7,
    student: {
      id: "S007",
      name: "Grace Lee",
      email: "grace@assignbridge.com",
    },
    class: {
      id: "C002",
      name: "Machine Learning",
      code: "CS-450",
    },
    stats: {
      overallGrade: 89.9,
      assignmentsCompleted: 11,
      averageGrade: 89.3,
      submissionsOnTime: 10,
      totalSubmissions: 11,
      trend: "up",
    },
  },
  {
    rank: 8,
    student: {
      id: "S008",
      name: "Henry Davis",
      email: "henry@assignbridge.com",
    },
    class: {
      id: "C003",
      name: "Database Systems",
      code: "CS-350",
    },
    stats: {
      overallGrade: 88.6,
      assignmentsCompleted: 9,
      averageGrade: 88.1,
      submissionsOnTime: 9,
      totalSubmissions: 9,
      trend: "stable",
    },
  },
];

// --- Components ---

function RankBadge({ rank }: { rank: number }) {
  const getRankConfig = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          icon: Trophy,
          color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
          size: "w-12 h-12",
        };
      case 2:
        return {
          icon: Medal,
          color: "bg-slate-500/10 text-slate-600 border-slate-500/20",
          size: "w-10 h-10",
        };
      case 3:
        return {
          icon: Award,
          color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
          size: "w-10 h-10",
        };
      default:
        return {
          icon: Award,
          color: "bg-muted text-muted-foreground",
          size: "w-8 h-8",
        };
    }
  };

  const config = getRankConfig(rank);
  const IconComponent = config.icon;

  return (
    <div className={`flex items-center justify-center rounded-full border ${config.color} ${config.size}`}>
      {rank <= 3 ? <IconComponent className="w-4 h-4" /> : <span className="text-sm font-bold">{rank}</span>}
    </div>
  );
}

function PerformerCard({ performer }: { performer: TopPerformer }) {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const onTimeRate = Math.round((performer.stats.submissionsOnTime / performer.stats.totalSubmissions) * 100);

  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <RankBadge rank={performer.rank} />
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(performer.student.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{performer.student.name}</h3>
                <p className="text-sm text-muted-foreground">{performer.student.email}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{performer.stats.overallGrade}%</div>
                <div className="text-xs text-muted-foreground">Overall Grade</div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Badge variant="secondary" className="font-mono text-xs">
                {performer.class.code}
              </Badge>
              <span className="text-sm text-muted-foreground truncate">{performer.class.name}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold">{performer.stats.assignmentsCompleted}</div>
                <div className="text-xs text-muted-foreground">Assignments</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{performer.stats.averageGrade}%</div>
                <div className="text-xs text-muted-foreground">Avg Grade</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{onTimeRate}%</div>
                <div className="text-xs text-muted-foreground">On Time</div>
              </div>
              <div className="text-center">
                {performer.stats.trend === "up" && <TrendingUp className="w-4 h-4 text-emerald-500 mx-auto" />}
                {performer.stats.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500 mx-auto" />}
                {performer.stats.trend === "stable" && <div className="w-4 h-0.5 bg-muted-foreground mx-auto rounded" />}
                <div className="text-xs text-muted-foreground mt-1">Trend</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main Page ---

export default function TopPerformersPage() {
  const [performers, setPerformers] = React.useState<TopPerformer[]>(mockTopPerformers);
  const [search, setSearch] = React.useState("");
  const [classFilter, setClassFilter] = React.useState("all");
  const [timeRange, setTimeRange] = React.useState("semester");

  const classes = [...new Set(performers.map((p) => p.class.code))];

  const filteredPerformers = performers.filter((performer) => {
    const matchSearch =
      !search ||
      performer.student.name.toLowerCase().includes(search.toLowerCase()) ||
      performer.student.email.toLowerCase().includes(search.toLowerCase()) ||
      performer.class.name.toLowerCase().includes(search.toLowerCase());
    const matchClass = classFilter === "all" || performer.class.code === classFilter;
    return matchSearch && matchClass;
  });

  const stats = {
    totalStudents: performers.length,
    averageGrade: Math.round(performers.reduce((sum, p) => sum + p.stats.overallGrade, 0) / performers.length),
    topGrade: Math.max(...performers.map((p) => p.stats.overallGrade)),
    onTimeRate: Math.round(
      (performers.reduce((sum, p) => sum + p.stats.submissionsOnTime, 0) /
        performers.reduce((sum, p) => sum + p.stats.totalSubmissions, 0)) *
        100
    ),
  };

  const handleExport = () => {
    const headers = [
      "Rank",
      "Student Name",
      "Email",
      "Class Name",
      "Class Code",
      "Overall Grade",
      "Assignments Completed",
      "Average Grade",
      "On Time Submissions",
      "Total Submissions",
      "Trend",
    ];
    const rows = filteredPerformers.map((p) => [
      p.rank.toString(),
      p.student.name,
      p.student.email,
      p.class.name,
      p.class.code,
      p.stats.overallGrade.toString(),
      p.stats.assignmentsCompleted.toString(),
      p.stats.averageGrade.toString(),
      p.stats.submissionsOnTime.toString(),
      p.stats.totalSubmissions.toString(),
      p.stats.trend,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `top-performers-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Top Performers</h1>
          <p className="text-sm text-muted-foreground">
            Recognize and celebrate outstanding student achievements across all classes.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semester">This Semester</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
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
            <div className="rounded-xl bg-amber-500/10 p-3">
              <Award className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalStudents}</p>
              <p className="text-sm text-muted-foreground">Top Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-emerald-500/10 p-3">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.averageGrade}%</p>
              <p className="text-sm text-muted-foreground">Average Grade</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-purple-500/10 p-3">
              <Star className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.topGrade}%</p>
              <p className="text-sm text-muted-foreground">Highest Grade</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-500/10 p-3">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.onTimeRate}%</p>
              <p className="text-sm text-muted-foreground">On-Time Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Students ranked by overall academic performance</CardDescription>
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
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Performers List */}
      <div className="space-y-4">
        {filteredPerformers.map((performer) => (
          <PerformerCard key={performer.student.id} performer={performer} />
        ))}
      </div>

      {filteredPerformers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Award className="h-12 w-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">No performers found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}