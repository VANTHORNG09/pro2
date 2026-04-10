"use client";

import * as React from "react";
import {
  Award,
  TrendingUp,
  TrendingDown,
  Download,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Users,
  BookOpen,
  Calendar,
  FileText,
  Mail,
  Printer,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface GradeReport {
  class: {
    id: string;
    name: string;
    code: string;
    teacher: string;
  };
  stats: {
    totalStudents: number;
    averageGrade: number;
    highestGrade: number;
    lowestGrade: number;
    passRate: number;
    gradeDistribution: {
      A: number;
      B: number;
      C: number;
      D: number;
      F: number;
    };
  };
  assignments: number;
  semester: string;
  year: number;
}

// --- Mock Data ---

const mockGradeReports: GradeReport[] = [
  {
    class: {
      id: "C001",
      name: "Data Structures & Algorithms",
      code: "CS-401",
      teacher: "Prof. Michael Chen",
    },
    stats: {
      totalStudents: 28,
      averageGrade: 85.4,
      highestGrade: 98,
      lowestGrade: 72,
      passRate: 92,
      gradeDistribution: {
        A: 12,
        B: 10,
        C: 4,
        D: 1,
        F: 1,
      },
    },
    assignments: 15,
    semester: "Spring",
    year: 2026,
  },
  {
    class: {
      id: "C002",
      name: "Machine Learning",
      code: "CS-450",
      teacher: "Dr. Alex Kumar",
    },
    stats: {
      totalStudents: 35,
      averageGrade: 87.2,
      highestGrade: 96,
      lowestGrade: 75,
      passRate: 94,
      gradeDistribution: {
        A: 15,
        B: 12,
        C: 5,
        D: 2,
        F: 1,
      },
    },
    assignments: 12,
    semester: "Spring",
    year: 2026,
  },
  {
    class: {
      id: "C003",
      name: "Web Development",
      code: "CS-301",
      teacher: "Dr. Sarah Johnson",
    },
    stats: {
      totalStudents: 42,
      averageGrade: 82.1,
      highestGrade: 95,
      lowestGrade: 68,
      passRate: 88,
      gradeDistribution: {
        A: 8,
        B: 18,
        C: 10,
        D: 4,
        F: 2,
      },
    },
    assignments: 14,
    semester: "Spring",
    year: 2026,
  },
  {
    class: {
      id: "C004",
      name: "Database Systems",
      code: "CS-350",
      teacher: "Prof. Michael Chen",
    },
    stats: {
      totalStudents: 30,
      averageGrade: 79.8,
      highestGrade: 92,
      lowestGrade: 65,
      passRate: 83,
      gradeDistribution: {
        A: 4,
        B: 12,
        C: 8,
        D: 4,
        F: 2,
      },
    },
    assignments: 10,
    semester: "Spring",
    year: 2026,
  },
];

// --- Components ---

function GradeDistributionChart({ distribution }: { distribution: GradeReport["stats"]["gradeDistribution"] }) {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-2">
      {Object.entries(distribution).map(([grade, count]) => {
        const percentage = Math.round((count / total) * 100);
        const colorClass = {
          A: "bg-emerald-500",
          B: "bg-blue-500",
          C: "bg-amber-500",
          D: "bg-orange-500",
          F: "bg-red-500",
        }[grade as keyof typeof distribution] || "bg-gray-500";

        return (
          <div key={grade} className="flex items-center gap-3">
            <div className="w-8 text-sm font-medium">{grade}</div>
            <div className="flex-1 bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full ${colorClass}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="w-12 text-right text-sm">{count} ({percentage}%)</div>
          </div>
        );
      })}
    </div>
  );
}

function ClassGradeCard({ report }: { report: GradeReport }) {
  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-emerald-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-amber-600";
    if (grade >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getPassRateColor = (rate: number) => {
    if (rate >= 90) return "text-emerald-600";
    if (rate >= 80) return "text-blue-600";
    return "text-amber-600";
  };

  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{report.class.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="secondary">{report.class.code}</Badge>
              <span>{report.class.teacher}</span>
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getGradeColor(report.stats.averageGrade)}`}>
              {report.stats.averageGrade}%
            </div>
            <div className="text-xs text-muted-foreground">Average Grade</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-semibold">{report.stats.totalStudents}</div>
            <div className="text-xs text-muted-foreground">Students</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-semibold ${getPassRateColor(report.stats.passRate)}`}>
              {report.stats.passRate}%
            </div>
            <div className="text-xs text-muted-foreground">Pass Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{report.stats.highestGrade}%</div>
            <div className="text-xs text-muted-foreground">Highest</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{report.stats.lowestGrade}%</div>
            <div className="text-xs text-muted-foreground">Lowest</div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Grade Distribution</h4>
          <GradeDistributionChart distribution={report.stats.gradeDistribution} />
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {report.assignments} assignments • {report.semester} {report.year}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Mail className="h-3.5 w-3.5 mr-1" />
              Email
            </Button>
            <Button size="sm" variant="outline">
              <Printer className="h-3.5 w-3.5 mr-1" />
              Print
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main Page ---

export default function GradeReportPage() {
  const [reports, setReports] = React.useState<GradeReport[]>(mockGradeReports);
  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState("average");
  const [semesterFilter, setSemesterFilter] = React.useState("all");

  const filteredReports = reports.filter((report) => {
    const matchSearch =
      !search ||
      report.class.name.toLowerCase().includes(search.toLowerCase()) ||
      report.class.code.toLowerCase().includes(search.toLowerCase()) ||
      report.class.teacher.toLowerCase().includes(search.toLowerCase());
    const matchSemester = semesterFilter === "all" || report.semester === semesterFilter;
    return matchSearch && matchSemester;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case "average":
        return b.stats.averageGrade - a.stats.averageGrade;
      case "passRate":
        return b.stats.passRate - a.stats.passRate;
      case "students":
        return b.stats.totalStudents - a.stats.totalStudents;
      case "assignments":
        return b.assignments - a.assignments;
      default:
        return 0;
    }
  });

  const overallStats = {
    totalClasses: reports.length,
    totalStudents: reports.reduce((sum, r) => sum + r.stats.totalStudents, 0),
    overallAverage: Math.round(
      reports.reduce((sum, r) => sum + r.stats.averageGrade * r.stats.totalStudents, 0) /
        reports.reduce((sum, r) => sum + r.stats.totalStudents, 0)
    ),
    overallPassRate: Math.round(
      reports.reduce((sum, r) => sum + r.stats.passRate * r.stats.totalStudents, 0) /
        reports.reduce((sum, r) => sum + r.stats.totalStudents, 0)
    ),
    totalAssignments: reports.reduce((sum, r) => sum + r.assignments, 0),
  };

  const handleExport = (format: "pdf" | "csv" | "excel") => {
    // Mock export functionality
    console.log(`Exporting grade reports as ${format}`);
  };

  const handleBulkEmail = () => {
    // Mock bulk email functionality
    console.log("Sending bulk email with grade reports");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Grade Reports</h1>
          <p className="text-sm text-muted-foreground">
            Generate and manage comprehensive grade reports for all classes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBulkEmail}>
            <Mail className="mr-2 h-4 w-4" />
            Email All
          </Button>
          <Select onValueChange={(value: "pdf" | "csv" | "excel") => handleExport(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">Export PDF</SelectItem>
              <SelectItem value="csv">Export CSV</SelectItem>
              <SelectItem value="excel">Export Excel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-500/10 p-3">
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overallStats.totalClasses}</p>
              <p className="text-sm text-muted-foreground">Classes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-emerald-500/10 p-3">
              <Users className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overallStats.totalStudents}</p>
              <p className="text-sm text-muted-foreground">Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-purple-500/10 p-3">
              <Award className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overallStats.overallAverage}%</p>
              <p className="text-sm text-muted-foreground">Avg Grade</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-amber-500/10 p-3">
              <TrendingUp className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overallStats.overallPassRate}%</p>
              <p className="text-sm text-muted-foreground">Pass Rate</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-orange-500/10 p-3">
              <FileText className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overallStats.totalAssignments}</p>
              <p className="text-sm text-muted-foreground">Assignments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Class Grade Reports</CardTitle>
          <CardDescription>{sortedReports.length} reports found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search classes..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="average">Average Grade</SelectItem>
                <SelectItem value="passRate">Pass Rate</SelectItem>
                <SelectItem value="students">Students</SelectItem>
                <SelectItem value="assignments">Assignments</SelectItem>
              </SelectContent>
            </Select>
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                <SelectItem value="Spring">Spring</SelectItem>
                <SelectItem value="Fall">Fall</SelectItem>
                <SelectItem value="Summer">Summer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {sortedReports.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No grade reports found</p>
              <p className="text-xs mt-1">Try adjusting your filters</p>
            </CardContent>
          </Card>
        ) : (
          sortedReports.map((report) => (
            <ClassGradeCard key={report.class.id} report={report} />
          ))
        )}
      </div>
    </div>
  );
}