"use client";

import * as React from "react";
import {
  Search,
  Download,
  Plus,
  UserPlus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  Filter,
  UserCheck,
  UserX,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
  Mail,
  Building2,
  Calendar,
  BarChart3,
  FileText,
  Loader2,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// --- Types ---

type StudentStatus = "active" | "inactive" | "suspended" | "graduated";
type Department = "Computer Science" | "Mathematics" | "Physics" | "Chemistry" | "Engineering" | "Biology" | "General";
type AcademicLevel = "Freshman" | "Sophomore" | "Junior" | "Senior" | "Graduate";

interface StudentData {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: Department;
  academicLevel: AcademicLevel;
  classes: number;
  assignments: number;
  submissionsOnTime: number;
  submissionsLate: number;
  avgGrade: number;
  status: StudentStatus;
  lastLogin: string;
  enrolledAt: string;
  loginCount: number;
  gpa: number;
  phone: string;
  advisor: string;
  attendanceRate: number;
  pendingSubmissions: number;
}

// --- Mock Data ---

const departments: Department[] = ["Computer Science", "Mathematics", "Physics", "Chemistry", "Engineering", "Biology", "General"];
const academicLevels: AcademicLevel[] = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];

const mockStudents: StudentData[] = [
  { id: "1", name: "John Smith", email: "john@assignbridge.com", studentId: "STU-001", department: "Computer Science", academicLevel: "Junior", classes: 4, assignments: 28, submissionsOnTime: 25, submissionsLate: 3, avgGrade: 88, status: "active", lastLogin: "2026-04-10", enrolledAt: "2025-01-15", loginCount: 245, gpa: 3.6, phone: "+1-555-1001", advisor: "Dr. Sarah Johnson", attendanceRate: 92, pendingSubmissions: 2 },
  { id: "2", name: "Alice Williams", email: "alice@assignbridge.com", studentId: "STU-002", department: "Computer Science", academicLevel: "Senior", classes: 5, assignments: 32, submissionsOnTime: 30, submissionsLate: 2, avgGrade: 92, status: "active", lastLogin: "2026-04-09", enrolledAt: "2025-01-15", loginCount: 198, gpa: 3.8, phone: "+1-555-1002", advisor: "Prof. Michael Chen", attendanceRate: 96, pendingSubmissions: 1 },
  { id: "3", name: "Bob Davis", email: "bob@assignbridge.com", studentId: "STU-003", department: "Mathematics", academicLevel: "Sophomore", classes: 3, assignments: 18, submissionsOnTime: 15, submissionsLate: 3, avgGrade: 76, status: "active", lastLogin: "2026-04-07", enrolledAt: "2025-02-01", loginCount: 167, gpa: 3.1, phone: "+1-555-1003", advisor: "Prof. James Miller", attendanceRate: 84, pendingSubmissions: 3 },
  { id: "4", name: "Carol Martinez", email: "carol@assignbridge.com", studentId: "STU-004", department: "Physics", academicLevel: "Junior", classes: 4, assignments: 25, submissionsOnTime: 24, submissionsLate: 1, avgGrade: 85, status: "active", lastLogin: "2026-04-10", enrolledAt: "2025-02-01", loginCount: 213, gpa: 3.5, phone: "+1-555-1004", advisor: "Dr. Alex Kumar", attendanceRate: 94, pendingSubmissions: 0 },
  { id: "5", name: "Daniel Garcia", email: "daniel@assignbridge.com", studentId: "STU-005", department: "Chemistry", academicLevel: "Freshman", classes: 2, assignments: 12, submissionsOnTime: 8, submissionsLate: 4, avgGrade: 62, status: "inactive", lastLogin: "2026-03-15", enrolledAt: "2025-03-01", loginCount: 45, gpa: 2.4, phone: "+1-555-1005", advisor: "Dr. Emily White", attendanceRate: 65, pendingSubmissions: 5 },
  { id: "6", name: "Emma Wilson", email: "emma@assignbridge.com", studentId: "STU-006", department: "Biology", academicLevel: "Senior", classes: 5, assignments: 30, submissionsOnTime: 28, submissionsLate: 2, avgGrade: 90, status: "active", lastLogin: "2026-04-09", enrolledAt: "2025-01-15", loginCount: 178, gpa: 3.7, phone: "+1-555-1006", advisor: "Dr. Lisa Wang", attendanceRate: 93, pendingSubmissions: 1 },
  { id: "7", name: "Frank Brown", email: "frank@assignbridge.com", studentId: "STU-007", department: "Engineering", academicLevel: "Sophomore", classes: 3, assignments: 20, submissionsOnTime: 18, submissionsLate: 2, avgGrade: 82, status: "active", lastLogin: "2026-04-08", enrolledAt: "2025-02-15", loginCount: 156, gpa: 3.3, phone: "+1-555-1007", advisor: "Prof. David Brown", attendanceRate: 88, pendingSubmissions: 2 },
  { id: "8", name: "Grace Lee", email: "grace@assignbridge.com", studentId: "STU-008", department: "Computer Science", academicLevel: "Graduate", classes: 4, assignments: 26, submissionsOnTime: 26, submissionsLate: 0, avgGrade: 95, status: "active", lastLogin: "2026-04-10", enrolledAt: "2025-01-15", loginCount: 312, gpa: 3.9, phone: "+1-555-1008", advisor: "Dr. Sarah Johnson", attendanceRate: 98, pendingSubmissions: 0 },
  { id: "9", name: "Henry Taylor", email: "henry@assignbridge.com", studentId: "STU-009", department: "Mathematics", academicLevel: "Freshman", classes: 3, assignments: 15, submissionsOnTime: 10, submissionsLate: 5, avgGrade: 70, status: "active", lastLogin: "2026-04-06", enrolledAt: "2025-03-01", loginCount: 89, gpa: 2.8, phone: "+1-555-1009", advisor: "Prof. James Miller", attendanceRate: 76, pendingSubmissions: 4 },
  { id: "10", name: "Ivy Chen", email: "ivy@assignbridge.com", studentId: "STU-010", department: "Physics", academicLevel: "Junior", classes: 4, assignments: 22, submissionsOnTime: 20, submissionsLate: 2, avgGrade: 87, status: "graduated", lastLogin: "2026-04-01", enrolledAt: "2024-09-01", loginCount: 267, gpa: 3.6, phone: "+1-555-1010", advisor: "Dr. Alex Kumar", attendanceRate: 91, pendingSubmissions: 0 },
  { id: "11", name: "Jack Wilson", email: "jack@assignbridge.com", studentId: "STU-011", department: "Engineering", academicLevel: "Senior", classes: 5, assignments: 28, submissionsOnTime: 22, submissionsLate: 6, avgGrade: 78, status: "active", lastLogin: "2026-04-09", enrolledAt: "2025-01-15", loginCount: 134, gpa: 3.2, phone: "+1-555-1011", advisor: "Prof. David Brown", attendanceRate: 82, pendingSubmissions: 3 },
  { id: "12", name: "Karen White", email: "karen@assignbridge.com", studentId: "STU-012", department: "Chemistry", academicLevel: "Sophomore", classes: 3, assignments: 16, submissionsOnTime: 14, submissionsLate: 2, avgGrade: 84, status: "suspended", lastLogin: "2026-02-20", enrolledAt: "2025-02-01", loginCount: 56, gpa: 3.4, phone: "+1-555-1012", advisor: "Dr. Emily White", attendanceRate: 58, pendingSubmissions: 8 },
];

// --- Config ---

const statusConfig: Record<StudentStatus, { label: string; color: string; dot: string }> = {
  active: { label: "Active", color: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  inactive: { label: "Inactive", color: "text-slate-500", dot: "bg-slate-400" },
  suspended: { label: "Suspended", color: "text-red-600 dark:text-red-400", dot: "bg-red-500" },
  graduated: { label: "Graduated", color: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
};

const gradeColor = (grade: number) => {
  if (grade >= 90) return "text-emerald-500";
  if (grade >= 80) return "text-blue-500";
  if (grade >= 70) return "text-amber-500";
  return "text-red-500";
};

// --- Helpers ---

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const daysSinceLogin = (dateStr: string): number => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

// --- Stat Card ---
function DashboardStat({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: number | string;
  subtitle: string;
  icon: typeof GraduationCap;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Student Detail Dialog ---
function StudentDetailDialog({
  student,
  open,
  onOpenChange,
}: {
  student: StudentData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!student) return null;
  const status = statusConfig[student.status];
  const daysSince = daysSinceLogin(student.lastLogin);
  const onTimeRate = student.assignments > 0 ? Math.round((student.submissionsOnTime / student.assignments) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm font-semibold">
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-lg font-semibold">{student.name}</p>
              <p className="text-sm text-muted-foreground">{student.studentId} · {student.academicLevel}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 rounded-full border px-2.5 py-0.5">
              <span className={`h-2 w-2 rounded-full ${status.dot}`} />
              <span className={`text-sm ${status.color}`}>{status.label}</span>
            </div>
            <Badge variant="outline">{student.department}</Badge>
            <Badge variant="outline" className="text-blue-600">
              <Award className="mr-1 h-3 w-3" />
              GPA: {student.gpa}
            </Badge>
          </div>

          <Separator />

          {/* Academic Performance */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                Classes
              </div>
              <p className="mt-1 text-lg font-bold">{student.classes}</p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                Assignments
              </div>
              <p className="mt-1 text-lg font-bold">{student.assignments}</p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5" />
                On Time
              </div>
              <p className="mt-1 text-lg font-bold">{student.submissionsOnTime}</p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Late
              </div>
              <p className="mt-1 text-lg font-bold">{student.submissionsLate}</p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Performance Metrics</p>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>On-Time Rate</span>
                  <span className={onTimeRate >= 80 ? "text-emerald-500" : onTimeRate >= 60 ? "text-amber-500" : "text-red-500"}>{onTimeRate}%</span>
                </div>
                <Progress value={onTimeRate} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Average Grade</span>
                  <span className={gradeColor(student.avgGrade)}>{student.avgGrade}%</span>
                </div>
                <Progress value={student.avgGrade} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Attendance Rate</span>
                  <span className={student.attendanceRate >= 85 ? "text-emerald-500" : student.attendanceRate >= 70 ? "text-amber-500" : "text-red-500"}>{student.attendanceRate}%</span>
                </div>
                <Progress value={student.attendanceRate} className="h-2" />
              </div>
            </div>
          </div>

          {student.pendingSubmissions > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                <span className="font-medium">{student.pendingSubmissions}</span> pending submission(s) awaiting review
              </p>
            </div>
          )}

          <Separator />

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Contact & Academic Info</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="truncate">{student.email}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="mt-0.5">{student.phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Advisor</p>
                <p className="mt-0.5">{student.advisor}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Department</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{student.department}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" />
              <span>{student.loginCount} logins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Last: {daysSince === 0 ? "Today" : `${daysSince}d ago`}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Since {new Date(student.enrolledAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Add Student Dialog ---
function AddStudentDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (student: Omit<StudentData, "id" | "loginCount" | "submissionsOnTime" | "submissionsLate" | "pendingSubmissions" | "attendanceRate">) => void;
}) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [department, setDepartment] = React.useState<Department>("General");
  const [academicLevel, setAcademicLevel] = React.useState<AcademicLevel>("Freshman");
  const [advisor, setAdvisor] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      onSave({
        name, email, department, academicLevel, advisor, phone,
        studentId: `STU-${String(Date.now()).slice(-3)}`,
        classes: 0, assignments: 0, avgGrade: 0,
        status: "active",
        lastLogin: new Date().toISOString().split("T")[0],
        enrolledAt: new Date().toISOString().split("T")[0],
        gpa: 0,
      });
      setIsSaving(false);
      setName(""); setEmail(""); setDepartment("General");
      setAcademicLevel("Freshman"); setAdvisor(""); setPhone("");
      onOpenChange(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Student
          </DialogTitle>
          <DialogDescription>
            Enroll a new student and assign to a department.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="student-name">Full Name</Label>
              <Input id="student-name" placeholder="e.g., Jane Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student-email">Email</Label>
              <Input id="student-email" type="email" placeholder="e.g., jane@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Department</Label>
              <Select value={department} onValueChange={(v) => setDepartment(v as Department)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Academic Level</Label>
              <Select value={academicLevel} onValueChange={(v) => setAcademicLevel(v as AcademicLevel)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {academicLevels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="student-advisor">Advisor</Label>
              <Input id="student-advisor" placeholder="e.g., Dr. Sarah Johnson" value={advisor} onChange={(e) => setAdvisor(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="student-phone">Phone</Label>
              <Input id="student-phone" placeholder="e.g., +1-555-1001" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enroll Student
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Table Component ---
function StudentsTable({
  students,
  selectedIds,
  toggleSelect,
  toggleSelectAll,
  onView,
  onStatusToggle,
  isAllSelected,
}: {
  students: StudentData[];
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  onView: (student: StudentData) => void;
  onStatusToggle: (id: string) => void;
  isAllSelected: boolean;
}) {
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <GraduationCap className="h-12 w-12 mb-3 opacity-50" />
        <p className="text-sm font-medium">No students found</p>
        <p className="text-xs mt-1">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10 pl-6">
            <Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} />
          </TableHead>
          <TableHead>Student</TableHead>
          <TableHead className="hidden md:table-cell">Department</TableHead>
          <TableHead className="hidden lg:table-cell">Level</TableHead>
          <TableHead className="text-center hidden sm:table-cell">Classes</TableHead>
          <TableHead className="text-center hidden lg:table-cell">Assignments</TableHead>
          <TableHead className="text-center hidden xl:table-cell">On-Time %</TableHead>
          <TableHead className="text-center">Avg Grade</TableHead>
          <TableHead className="hidden lg:table-cell">GPA</TableHead>
          <TableHead className="hidden xl:table-cell">Last Login</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px] text-right pr-6">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => {
          const status = statusConfig[student.status];
          const daysSince = daysSinceLogin(student.lastLogin);
          const onTimeRate = student.assignments > 0 ? Math.round((student.submissionsOnTime / student.assignments) * 100) : 0;

          return (
            <TableRow key={student.id} className="hover:bg-muted/50">
              <TableCell className="pl-6">
                <Checkbox
                  checked={selectedIds.has(student.id)}
                  onCheckedChange={() => toggleSelect(student.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-semibold">
                      {getInitials(student.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{student.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{student.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-1.5 text-sm">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{student.department}</span>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm">{student.academicLevel}</TableCell>
              <TableCell className="text-center hidden sm:table-cell">
                <div className="flex items-center justify-center gap-1 text-sm">
                  <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                  {student.classes}
                </div>
              </TableCell>
              <TableCell className="text-center hidden lg:table-cell text-sm text-muted-foreground">
                {student.assignments}
              </TableCell>
              <TableCell className="text-center hidden xl:table-cell">
                <div className="flex items-center justify-center gap-1 text-sm">
                  <CheckCircle2 className={`h-3.5 w-3.5 ${onTimeRate >= 80 ? "text-emerald-500" : onTimeRate >= 60 ? "text-amber-500" : "text-red-500"}`} />
                  <span className={gradeColor(onTimeRate)}>{onTimeRate}%</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Award className={`h-3.5 w-3.5 ${gradeColor(student.avgGrade)}`} />
                  <span className={`text-sm font-medium ${gradeColor(student.avgGrade)}`}>
                    {student.avgGrade}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <Badge variant={student.gpa >= 3.5 ? "default" : student.gpa >= 3.0 ? "secondary" : "outline"} className="font-mono text-xs">
                  {student.gpa}
                </Badge>
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock className={`h-3.5 w-3.5 ${daysSince > 30 ? "text-red-500" : "text-muted-foreground"}`} />
                  <span className="text-muted-foreground">
                    {daysSince === 0 ? "Today" : daysSince === 1 ? "Yesterday" : `${daysSince}d ago`}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                  <span className={`text-sm ${status.color}`}>{status.label}</span>
                </div>
              </TableCell>
              <TableCell className="text-right pr-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => onView(student)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusToggle(student.id)}>
                        {student.status === "active" ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

// --- Main Page ---
export default function StudentsManagementPage() {
  const [students, setStudents] = React.useState<StudentData[]>(mockStudents);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = React.useState<string>("all");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [detailStudent, setDetailStudent] = React.useState<StudentData | null>(null);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [deleteStudentId, setDeleteStudentId] = React.useState<string | null>(null);

  const filtered = students.filter((s) => {
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchDept = departmentFilter === "all" || s.department === departmentFilter;
    return matchSearch && matchStatus && matchDept;
  });

  const counts = {
    total: students.length,
    active: students.filter((s) => s.status === "active").length,
    inactive: students.filter((s) => s.status === "inactive").length,
    suspended: students.filter((s) => s.status === "suspended").length,
    graduated: students.filter((s) => s.status === "graduated").length,
    avgGrade: Math.round(students.reduce((sum, s) => sum + s.avgGrade, 0) / students.filter((s) => s.status === "active").length),
    totalAssignments: students.reduce((sum, s) => sum + s.assignments, 0),
    avgGpa: +(students.reduce((sum, s) => sum + s.gpa, 0) / students.filter((s) => s.status === "active").length).toFixed(2),
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((s) => s.id)));
    }
  };

  const handleStatusToggle = (id: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? ("inactive" as StudentStatus) : ("active" as StudentStatus) }
          : s
      )
    );
    const student = students.find((s) => s.id === id);
    toast.success(`${student?.name} ${student?.status === "active" ? "deactivated" : "activated"}`);
  };

  const handleBulkActivate = () => {
    setStudents((prev) =>
      prev.map((s) => (selectedIds.has(s.id) ? { ...s, status: "active" as StudentStatus } : s))
    );
    toast.success(`${selectedIds.size} student(s) activated`);
    setSelectedIds(new Set());
  };

  const handleBulkDeactivate = () => {
    setStudents((prev) =>
      prev.map((s) => (selectedIds.has(s.id) ? { ...s, status: "inactive" as StudentStatus } : s))
    );
    toast.success(`${selectedIds.size} student(s) deactivated`);
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    setStudents((prev) => prev.filter((s) => !selectedIds.has(s.id)));
    toast.success(`${selectedIds.size} student(s) deleted`);
    setSelectedIds(new Set());
  };

  const handleDelete = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    toast.success("Student deleted successfully");
  };

  const handleAddStudent = (data: Omit<StudentData, "id" | "loginCount" | "submissionsOnTime" | "submissionsLate" | "pendingSubmissions" | "attendanceRate">) => {
    const newStudent: StudentData = {
      ...data,
      id: String(Date.now()),
      loginCount: 0,
      submissionsOnTime: 0,
      submissionsLate: 0,
      pendingSubmissions: 0,
      attendanceRate: 0,
    };
    setStudents((prev) => [...prev, newStudent]);
    toast.success(`${data.name} enrolled successfully`);
  };

  const handleExport = () => {
    const headers = ["Name", "Email", "Student ID", "Department", "Level", "Classes", "Assignments", "Avg Grade", "GPA", "Status"];
    const rows = filtered.map((s) => [s.name, s.email, s.studentId, s.department, s.academicLevel, String(s.classes), String(s.assignments), `${s.avgGrade}%`, String(s.gpa), s.status]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Students exported successfully");
  };

  const isAllSelected = filtered.length > 0 && selectedIds.size === filtered.length;

  // Top performers & at-risk
  const topPerformers = [...students]
    .filter((s) => s.status === "active")
    .sort((a, b) => b.avgGrade - a.avgGrade)
    .slice(0, 5);

  const atRiskStudents = [...students]
    .filter((s) => s.status === "active" && (s.avgGrade < 75 || s.attendanceRate < 70))
    .sort((a, b) => a.avgGrade - b.avgGrade)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Management</h1>
          <p className="text-sm text-muted-foreground">
            Monitor student progress, enrollment, and academic performance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          title="Total Students"
          value={counts.total}
          subtitle={`${counts.active} active`}
          icon={GraduationCap}
          color="bg-blue-500/10 text-blue-500"
        />
        <DashboardStat
          title="Average Grade"
          value={`${counts.avgGrade}%`}
          subtitle={`Avg GPA: ${counts.avgGpa}`}
          icon={Award}
          color="bg-emerald-500/10 text-emerald-500"
        />
        <DashboardStat
          title="Total Submissions"
          value={counts.totalAssignments}
          subtitle="across all students"
          icon={FileText}
          color="bg-violet-500/10 text-violet-500"
        />
        <DashboardStat
          title="Needs Attention"
          value={`${counts.inactive + counts.suspended}`}
          subtitle={`${counts.suspended} suspended`}
          icon={AlertTriangle}
          color="bg-amber-500/10 text-amber-500"
        />
      </div>

      {/* Top Performers & At Risk */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Top Performers
            </CardTitle>
            <CardDescription>Highest average grades among active students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPerformers.map((student, i) => (
              <div key={student.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-semibold">
                      {getInitials(student.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{student.gpa} GPA</Badge>
                  <Badge variant="default" className="text-xs">{student.avgGrade}%</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              At-Risk Students
            </CardTitle>
            <CardDescription>Students with grades below 75% or attendance below 70%</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {atRiskStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-10 w-10 mb-2 text-emerald-500" />
                <p className="text-sm">All students are performing well!</p>
              </div>
            ) : (
              atRiskStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-semibold">
                        {getInitials(student.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{student.attendanceRate}% attend</Badge>
                    <Badge variant={student.avgGrade < 70 ? "destructive" : "secondary"} className="text-xs">{student.avgGrade}%</Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <span className="text-sm font-medium">
            {selectedIds.size} student(s) selected
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleBulkActivate}>
              <UserCheck className="mr-1 h-3.5 w-3.5" />
              Activate
            </Button>
            <Button size="sm" variant="outline" onClick={handleBulkDeactivate}>
              <UserX className="mr-1 h-3.5 w-3.5" />
              Deactivate
            </Button>
            <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
          <Button size="sm" variant="ghost" className="ml-auto" onClick={() => setSelectedIds(new Set())}>
            Clear
          </Button>
        </div>
      )}

      {/* Filters & Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Students</CardTitle>
              <CardDescription>{filtered.length} student(s) found</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <StudentsTable
            students={filtered}
            selectedIds={selectedIds}
            toggleSelect={toggleSelect}
            toggleSelectAll={toggleSelectAll}
            onView={setDetailStudent}
            onStatusToggle={handleStatusToggle}
            isAllSelected={isAllSelected}
          />
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <StudentDetailDialog student={detailStudent} open={!!detailStudent} onOpenChange={() => setDetailStudent(null)} />

      {/* Add Student Dialog */}
      <AddStudentDialog open={isAddOpen} onOpenChange={setIsAddOpen} onSave={handleAddStudent} />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteStudentId} onOpenChange={() => setDeleteStudentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Delete Student
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this student? All associated data including submissions and grades will be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteStudentId) handleDelete(deleteStudentId);
                setDeleteStudentId(null);
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
