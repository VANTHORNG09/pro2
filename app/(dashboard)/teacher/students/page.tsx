"use client";

import * as React from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  UserPlus,
  Download,
  Eye,
  MessageSquare,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
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

// --- Mock Data ---

const students = [
  { id: "ST-001", name: "Alice Johnson", email: "alice.johnson@university.edu", class: "CS-301", className: "Data Structures & Algorithms", avatar: "AJ", status: "active", avgGrade: 92, assignments: 12, completed: 11, lastActive: "2 min ago", attendance: 96 },
  { id: "ST-002", name: "Bob Smith", email: "bob.smith@university.edu", class: "CS-301", className: "Data Structures & Algorithms", avatar: "BS", status: "active", avgGrade: 78, assignments: 12, completed: 9, lastActive: "15 min ago", attendance: 88 },
  { id: "ST-003", name: "Carol Davis", email: "carol.davis@university.edu", class: "CS-350", className: "Database Management Systems", avatar: "CD", status: "active", avgGrade: 85, assignments: 8, completed: 8, lastActive: "1 hour ago", attendance: 94 },
  { id: "ST-004", name: "David Lee", email: "david.lee@university.edu", class: "CS-301", className: "Data Structures & Algorithms", avatar: "DL", status: "active", avgGrade: 88, assignments: 12, completed: 10, lastActive: "30 min ago", attendance: 91 },
  { id: "ST-005", name: "Emma Wilson", email: "emma.wilson@university.edu", class: "CS-420", className: "Network Security", avatar: "EW", status: "active", avgGrade: 95, assignments: 6, completed: 6, lastActive: "5 min ago", attendance: 98 },
  { id: "ST-006", name: "Frank Martinez", email: "frank.martinez@university.edu", class: "CS-350", className: "Database Management Systems", avatar: "FM", status: "inactive", avgGrade: 62, assignments: 8, completed: 4, lastActive: "2 days ago", attendance: 65 },
  { id: "ST-007", name: "Grace Chen", email: "grace.chen@university.edu", class: "CS-450", className: "Machine Learning Fundamentals", avatar: "GC", status: "active", avgGrade: 90, assignments: 10, completed: 9, lastActive: "20 min ago", attendance: 93 },
  { id: "ST-008", name: "Henry Brown", email: "henry.brown@university.edu", class: "CS-301", className: "Data Structures & Algorithms", avatar: "HB", status: "active", avgGrade: 72, assignments: 12, completed: 8, lastActive: "3 hours ago", attendance: 82 },
  { id: "ST-009", name: "Ivy Patel", email: "ivy.patel@university.edu", class: "CS-420", className: "Network Security", avatar: "IP", status: "active", avgGrade: 87, assignments: 6, completed: 6, lastActive: "45 min ago", attendance: 95 },
  { id: "ST-010", name: "Jack Taylor", email: "jack.taylor@university.edu", class: "CS-450", className: "Machine Learning Fundamentals", avatar: "JT", status: "active", avgGrade: 76, assignments: 10, completed: 7, lastActive: "1 hour ago", attendance: 87 },
  { id: "ST-011", name: "Karen White", email: "karen.white@university.edu", class: "CS-350", className: "Database Management Systems", avatar: "KW", status: "active", avgGrade: 81, assignments: 8, completed: 7, lastActive: "10 min ago", attendance: 90 },
  { id: "ST-012", name: "Leo Garcia", email: "leo.garcia@university.edu", class: "CS-420", className: "Network Security", avatar: "LG", status: "active", avgGrade: 93, assignments: 6, completed: 6, lastActive: "1 hour ago", attendance: 97 },
];

const statsData = [
  { label: "Total Students", value: students.length, icon: UserPlus, color: "text-blue-500" },
  { label: "Active", value: students.filter((s) => s.status === "active").length, icon: CheckCircle2, color: "text-green-500" },
  { label: "Inactive", value: students.filter((s) => s.status === "inactive").length, icon: AlertCircle, color: "text-red-500" },
  { label: "Avg Grade", value: Math.round(students.reduce((a, b) => a + b.avgGrade, 0) / students.length) + "%", icon: BarChart3, color: "text-amber-500" },
];

// --- Helper Components ---

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    active: "bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30",
    inactive: "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
  };
  return <Badge className={`capitalize ${variants[status] || variants.active}`}>{status}</Badge>;
}

function GradeIndicator({ grade }: { grade: number }) {
  const color = grade >= 90 ? "text-green-500" : grade >= 80 ? "text-blue-500" : grade >= 70 ? "text-amber-500" : "text-red-500";
  return <span className={`font-semibold tabular-nums ${color}`}>{grade}%</span>;
}

// --- Main Page ---

export default function TeacherStudentListPage() {
  const [search, setSearch] = React.useState("");
  const [classFilter, setClassFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const uniqueClasses = Array.from(new Map(students.map((s) => [s.class, s.className])).entries());

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchClass = classFilter === "all" || s.class === classFilter;
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchClass && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Student List</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            View and manage students across all your classes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-lg p-2.5 bg-slate-50 dark:bg-slate-800 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {uniqueClasses.map(([code, name]) => (
                  <SelectItem key={code} value={code}>{code} — {name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Students</CardTitle>
              <CardDescription>{filtered.length} student{filtered.length !== 1 ? "s" : ""} found</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Avg Grade</TableHead>
                <TableHead>Assignments</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-slate-500">No students found.</TableCell>
                </TableRow>
              ) : (
                filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs text-slate-500">{s.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
                          {s.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-slate-800 dark:text-white truncate">{s.name}</p>
                          <p className="text-xs text-slate-400 truncate">{s.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="secondary" className="font-mono text-xs">{s.class}</Badge>
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[160px]">{s.className}</p>
                      </div>
                    </TableCell>
                    <TableCell><GradeIndicator grade={s.avgGrade} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-slate-600 dark:text-slate-300">{s.completed}/{s.assignments}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${s.attendance >= 90 ? "bg-green-500" : s.attendance >= 75 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${s.attendance}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{s.attendance}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 whitespace-nowrap">{s.lastActive}</TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="View Profile">
                          <Eye className="h-3.5 w-3.5 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Send Message">
                          <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="View Grades">
                          <BarChart3 className="h-3.5 w-3.5 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="More">
                          <MoreHorizontal className="h-3.5 w-3.5 text-slate-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
