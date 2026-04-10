"use client";

import * as React from "react";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  Eye,
  User,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  Download,
  Search,
  Filter,
  Users,
  ClipboardList,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// --- Types ---

interface PendingClass {
  id: string;
  name: string;
  code: string;
  teacher: string;
  teacherEmail: string;
  subject: string;
  requestedDate: string;
  schedule: string;
  room: string;
  semester: string;
  year: number;
  description: string;
  estimatedStudents: number;
  reason: string;
}

// --- Mock Data ---

const mockPendingClasses: PendingClass[] = [
  {
    id: "P1",
    name: "Advanced React Development",
    code: "CS-501",
    teacher: "Prof. Lisa Chen",
    teacherEmail: "lisa@assignbridge.com",
    subject: "Computer Science",
    requestedDate: "2026-04-08",
    schedule: "Mon/Wed 15:00-16:30",
    room: "Lab 105",
    semester: "Spring",
    year: 2026,
    description: "Advanced React concepts including hooks, context, and performance optimization",
    estimatedStudents: 25,
    reason: "Growing demand for React skills in industry",
  },
  {
    id: "P2",
    name: "Cybersecurity Fundamentals",
    code: "CS-480",
    teacher: "Dr. Robert Taylor",
    teacherEmail: "robert@assignbridge.com",
    subject: "Computer Science",
    requestedDate: "2026-04-07",
    schedule: "Tue/Thu 11:00-12:30",
    room: "Room 312",
    semester: "Spring",
    year: 2026,
    description: "Introduction to cybersecurity principles, threats, and defense strategies",
    estimatedStudents: 30,
    reason: "Increasing importance of cybersecurity education",
  },
  {
    id: "P3",
    name: "Quantum Computing Basics",
    code: "CS-550",
    teacher: "Prof. Sarah Johnson",
    teacherEmail: "sarah@assignbridge.com",
    subject: "Computer Science",
    requestedDate: "2026-04-06",
    schedule: "Wed/Fri 13:00-14:30",
    room: "Lab 203",
    semester: "Spring",
    year: 2026,
    description: "Fundamentals of quantum computing and quantum algorithms",
    estimatedStudents: 20,
    reason: "Emerging field with high industry demand",
  },
  {
    id: "P4",
    name: "Environmental Science",
    code: "SCI-201",
    teacher: "Dr. Michael Green",
    teacherEmail: "michael.green@assignbridge.com",
    subject: "Science",
    requestedDate: "2026-04-05",
    schedule: "Mon/Tue/Thu 09:00-10:00",
    room: "Hall C",
    semester: "Spring",
    year: 2026,
    description: "Study of environmental systems, climate change, and sustainability",
    estimatedStudents: 45,
    reason: "Growing awareness of environmental issues",
  },
];

// --- Components ---

function PendingClassCard({
  classData,
  onApprove,
  onReject,
  onView,
}: {
  classData: PendingClass;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (classData: PendingClass) => void;
}) {
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-base">{classData.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  {classData.code}
                </Badge>
                <span className="text-xs">{classData.subject}</span>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => onView(classData)}>
              <Eye className="h-3.5 w-3.5 mr-1" />
              View
            </Button>
            <Button size="sm" variant="outline" onClick={() => onReject(classData.id)}>
              <XCircle className="h-3.5 w-3.5 mr-1 text-red-500" />
              Reject
            </Button>
            <Button size="sm" onClick={() => onApprove(classData.id)}>
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              Approve
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span>{classData.teacher}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>Est. {classData.estimatedStudents} students</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{classData.requestedDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{classData.schedule}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>{classData.room}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{classData.description}</p>
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 border border-amber-200 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-400">Request Reason</p>
              <p className="text-sm text-amber-700 dark:text-amber-500">{classData.reason}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ClassDetailDialog({
  classData,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: {
  classData: PendingClass | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  if (!classData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-semibold">{classData.name}</p>
              <p className="text-sm text-muted-foreground">{classData.code}</p>
            </div>
          </DialogTitle>
          <DialogDescription>Review and approve this class request</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Class Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subject:</span>
                  <Badge variant="secondary">{classData.subject}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Semester:</span>
                  <span>{classData.semester} {classData.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Schedule:</span>
                  <span>{classData.schedule}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Room:</span>
                  <span>{classData.room}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Students:</span>
                  <span>{classData.estimatedStudents}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Request Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teacher:</span>
                  <span>{classData.teacher}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requested:</span>
                  <span>{classData.requestedDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{classData.description}</p>
          </div>

          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-400">Request Reason</h4>
                <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">{classData.reason}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onReject(classData.id)}>
            <XCircle className="h-4 w-4 mr-2" />
            Reject Request
          </Button>
          <Button onClick={() => onApprove(classData.id)}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve Class
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RejectionDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = React.useState("");

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason);
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Class Request</DialogTitle>
          <DialogDescription>
            Provide a reason for rejecting this class request. This will be sent to the requesting teacher.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Rejection Reason</label>
            <Textarea
              placeholder="Please explain why this class request is being rejected..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Reject Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Main Page ---

export default function PendingClassesPage() {
  const [pendingClasses, setPendingClasses] = React.useState<PendingClass[]>(mockPendingClasses);
  const [search, setSearch] = React.useState("");
  const [subjectFilter, setSubjectFilter] = React.useState("all");
  const [selectedClass, setSelectedClass] = React.useState<PendingClass | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = React.useState(false);
  const [rejectionTarget, setRejectionTarget] = React.useState<string | null>(null);

  const subjects = [...new Set(pendingClasses.map((c) => c.subject))];

  const filteredClasses = pendingClasses.filter((cls) => {
    const matchSearch =
      !search ||
      cls.name.toLowerCase().includes(search.toLowerCase()) ||
      cls.code.toLowerCase().includes(search.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subjectFilter === "all" || cls.subject === subjectFilter;
    return matchSearch && matchSubject;
  });

  const stats = {
    total: pendingClasses.length,
    thisWeek: pendingClasses.filter((c) => {
      const requestDate = new Date(c.requestedDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return requestDate >= weekAgo;
    }).length,
    estimatedStudents: pendingClasses.reduce((sum, c) => sum + c.estimatedStudents, 0),
  };

  const handleApprove = (id: string) => {
    setPendingClasses((prev) => prev.filter((c) => c.id !== id));
    toast.success("Class request approved successfully");
  };

  const handleReject = (id: string) => {
    setRejectionTarget(id);
    setRejectionDialogOpen(true);
  };

  const handleRejectConfirm = (reason: string) => {
    if (rejectionTarget) {
      setPendingClasses((prev) => prev.filter((c) => c.id !== rejectionTarget));
      toast.success("Class request rejected");
      setRejectionTarget(null);
    }
  };

  const handleView = (classData: PendingClass) => {
    setSelectedClass(classData);
    setDetailDialogOpen(true);
  };

  const handleExport = () => {
    const headers = ["Name", "Code", "Teacher", "Subject", "Requested Date", "Schedule", "Room", "Est. Students", "Reason"];
    const rows = filteredClasses.map((c) => [
      c.name,
      c.code,
      c.teacher,
      c.subject,
      c.requestedDate,
      c.schedule,
      c.room,
      c.estimatedStudents.toString(),
      c.reason,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pending-classes-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pending Class Approvals</h1>
          <p className="text-sm text-muted-foreground">
            Review and approve class requests from teachers.
          </p>
        </div>
        <div className="flex gap-2">
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
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Pending Requests</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-amber-500/10 p-3">
              <Calendar className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.thisWeek}</p>
              <p className="text-sm text-muted-foreground">This Week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-emerald-500/10 p-3">
              <Users className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.estimatedStudents}</p>
              <p className="text-sm text-muted-foreground">Est. Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-purple-500/10 p-3">
              <ClipboardList className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{subjects.length}</p>
              <p className="text-sm text-muted-foreground">Subjects</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Class Requests</CardTitle>
          <CardDescription>{filteredClasses.length} pending request(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search class requests..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Class Requests List */}
      <div className="space-y-4">
        {filteredClasses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">No pending class requests</p>
              <p className="text-xs mt-1">All requests have been processed</p>
            </CardContent>
          </Card>
        ) : (
          filteredClasses.map((classData) => (
            <PendingClassCard
              key={classData.id}
              classData={classData}
              onApprove={handleApprove}
              onReject={handleReject}
              onView={handleView}
            />
          ))
        )}
      </div>

      {/* Dialogs */}
      <ClassDetailDialog
        classData={selectedClass}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onApprove={handleApprove}
        onReject={handleReject}
      />
      <RejectionDialog
        open={rejectionDialogOpen}
        onOpenChange={setRejectionDialogOpen}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
}