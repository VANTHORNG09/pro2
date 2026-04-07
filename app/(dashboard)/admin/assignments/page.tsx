"use client";

import * as React from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FileText,
  Download,
  Send,
  Archive,
  Copy,
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

const assignments = [
  {
    id: "ASG-001",
    title: "Data Structures Final Project",
    class: "CS-301",
    className: "Data Structures & Algorithms",
    teacher: "Dr. Sarah Chen",
    teacherId: "T-001",
    dueDate: "2026-04-15",
    createdAt: "2026-03-28",
    status: "published",
    submissions: 42,
    totalStudents: 58,
    maxPoints: 100,
    fileType: "PDF, ZIP",
  },
  {
    id: "ASG-002",
    title: "Organic Chemistry Lab Report",
    class: "CHEM-202",
    className: "Organic Chemistry",
    teacher: "Prof. James Miller",
    teacherId: "T-002",
    dueDate: "2026-04-12",
    createdAt: "2026-03-25",
    status: "closed",
    submissions: 35,
    totalStudents: 35,
    maxPoints: 50,
    fileType: "PDF",
  },
  {
    id: "ASG-003",
    title: "Calculus Problem Set 7",
    class: "MATH-201",
    className: "Calculus II",
    teacher: "Dr. Emily Rodriguez",
    teacherId: "T-003",
    dueDate: "2026-04-20",
    createdAt: "2026-04-01",
    status: "published",
    submissions: 12,
    totalStudents: 65,
    maxPoints: 75,
    fileType: "PDF, DOCX",
  },
  {
    id: "ASG-004",
    title: "Modern History Essay",
    class: "HIST-101",
    className: "Modern History",
    teacher: "Prof. Michael Brown",
    teacherId: "T-004",
    dueDate: "2026-04-25",
    createdAt: "2026-04-03",
    status: "draft",
    submissions: 0,
    totalStudents: 72,
    maxPoints: 100,
    fileType: "DOCX, PDF",
  },
  {
    id: "ASG-005",
    title: "Machine Learning Assignment 3",
    class: "CS-450",
    className: "Machine Learning Fundamentals",
    teacher: "Dr. Alex Kumar",
    teacherId: "T-005",
    dueDate: "2026-04-18",
    createdAt: "2026-03-30",
    status: "published",
    submissions: 28,
    totalStudents: 45,
    maxPoints: 120,
    fileType: "ZIP, PDF",
  },
  {
    id: "ASG-006",
    title: "English Literature Review",
    class: "ENG-205",
    className: "English Literature",
    teacher: "Prof. Lisa Wang",
    teacherId: "T-006",
    dueDate: "2026-04-10",
    createdAt: "2026-03-20",
    status: "closed",
    submissions: 50,
    totalStudents: 50,
    maxPoints: 80,
    fileType: "PDF",
  },
  {
    id: "ASG-007",
    title: "Database Schema Design",
    class: "CS-350",
    className: "Database Management Systems",
    teacher: "Prof. Alex Kumar",
    teacherId: "T-005",
    dueDate: "2026-04-22",
    createdAt: "2026-04-05",
    status: "published",
    submissions: 18,
    totalStudents: 45,
    maxPoints: 90,
    fileType: "PDF, SQL",
  },
  {
    id: "ASG-008",
    title: "Operating Systems Lab 5",
    class: "CS-301",
    className: "Data Structures & Algorithms",
    teacher: "Dr. Sarah Chen",
    teacherId: "T-001",
    dueDate: "2026-04-28",
    createdAt: "2026-04-04",
    status: "draft",
    submissions: 0,
    totalStudents: 58,
    maxPoints: 60,
    fileType: "ZIP",
  },
];

const statsData = [
  { label: "Total Assignments", value: assignments.length, icon: FileText, color: "text-blue-500" },
  {
    label: "Published",
    value: assignments.filter((a) => a.status === "published").length,
    icon: Send,
    color: "text-green-500",
  },
  {
    label: "Drafts",
    value: assignments.filter((a) => a.status === "draft").length,
    icon: Edit,
    color: "text-yellow-500",
  },
  {
    label: "Closed",
    value: assignments.filter((a) => a.status === "closed").length,
    icon: Archive,
    color: "text-slate-500",
  },
];

// --- Helper Components ---

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

function CompletionBar({ submitted, total }: { submitted: number; total: number }) {
  const pct = total > 0 ? Math.round((submitted / total) * 100) : 0;
  const color =
    pct >= 80
      ? "bg-green-500"
      : pct >= 50
        ? "bg-yellow-500"
        : pct > 0
          ? "bg-orange-500"
          : "bg-slate-300 dark:bg-slate-600";

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
        {submitted}/{total} ({pct}%)
      </span>
    </div>
  );
}

// --- Main Page ---

export default function AdminAssignmentPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [classFilter, setClassFilter] = React.useState("all");

  const uniqueClasses = Array.from(new Map(assignments.map((a) => [a.class, a.className])).entries());

  const filtered = assignments.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.teacher.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const matchClass = classFilter === "all" || a.class === classFilter;
    return matchSearch && matchStatus && matchClass;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
            Assignment Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create, manage, and monitor assignments across all classes.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Assignment
        </Button>
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
              <Input
                placeholder="Search assignments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="mr-2 h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
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
            <Button variant="outline" size="icon" className="shrink-0">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Assignments</CardTitle>
              <CardDescription>
                {filtered.length} assignment{filtered.length !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <MoreHorizontal className="h-4 w-4" />
              Bulk Actions
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[90px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-slate-500">
                    No assignments found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs text-slate-500">{a.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm text-slate-800 dark:text-white">
                          {a.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{a.className}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {a.class}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                      {a.teacher}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {a.dueDate}
                    </TableCell>
                    <TableCell>
                      <CompletionBar submitted={a.submissions} total={a.totalStudents} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={a.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="View">
                          <Eye className="h-3.5 w-3.5 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit">
                          <Edit className="h-3.5 w-3.5 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Duplicate">
                          <Copy className="h-3.5 w-3.5 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10" title="Delete">
                          <Trash2 className="h-3.5 w-3.5" />
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
