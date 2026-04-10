"use client";

import * as React from "react";
import {
  Search,
  Download,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserPen,
  BookOpen,
  ClipboardList,
  Users,
  GraduationCap,
  Filter,
  UserCheck,
  UserX,
  BarChart3,
  TrendingUp,
  Activity,
  Clock,
  Mail,
  Building2,
  Calendar,
  Award,
  Loader2,
  CheckCircle2,
  XCircle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// --- Types ---

type TeacherStatus = "active" | "inactive" | "on_leave";
type Department = "Computer Science" | "Mathematics" | "Physics" | "Chemistry" | "Engineering" | "Biology" | "General";

interface TeacherData {
  id: string;
  name: string;
  email: string;
  teacherId: string;
  department: Department;
  classes: number;
  students: number;
  assignments: number;
  submissionsGraded: number;
  avgGrade: number;
  status: TeacherStatus;
  lastLogin: string;
  joinedAt: string;
  loginCount: number;
  specialization: string;
  phone: string;
  officeHours: string;
  completionRate: number;
}

// --- Mock Data ---

const departments: Department[] = ["Computer Science", "Mathematics", "Physics", "Chemistry", "Engineering", "Biology", "General"];

const mockTeachers: TeacherData[] = [
  { id: "1", name: "Dr. Sarah Johnson", email: "sarah@assignbridge.com", teacherId: "TCH-001", department: "Computer Science", classes: 4, students: 180, assignments: 12, submissionsGraded: 145, avgGrade: 84, status: "active", lastLogin: "2026-04-10", joinedAt: "2025-01-15", loginCount: 342, specialization: "Database Systems, Web Development", phone: "+1-555-0101", officeHours: "Mon/Wed 2-4 PM", completionRate: 92 },
  { id: "2", name: "Prof. Michael Chen", email: "michael@assignbridge.com", teacherId: "TCH-002", department: "Computer Science", classes: 3, students: 145, assignments: 8, submissionsGraded: 98, avgGrade: 87, status: "active", lastLogin: "2026-04-09", joinedAt: "2025-01-15", loginCount: 234, specialization: "Algorithms, Data Structures", phone: "+1-555-0102", officeHours: "Tue/Thu 10-12 PM", completionRate: 85 },
  { id: "3", name: "Dr. Alex Kumar", email: "alex@assignbridge.com", teacherId: "TCH-003", department: "Physics", classes: 2, students: 95, assignments: 6, submissionsGraded: 82, avgGrade: 78, status: "active", lastLogin: "2026-04-10", joinedAt: "2025-03-01", loginCount: 156, specialization: "Quantum Mechanics, Thermodynamics", phone: "+1-555-0103", officeHours: "Mon/Wed 3-5 PM", completionRate: 78 },
  { id: "4", name: "Prof. James Miller", email: "james@assignbridge.com", teacherId: "TCH-004", department: "Mathematics", classes: 3, students: 210, assignments: 10, submissionsGraded: 167, avgGrade: 82, status: "on_leave", lastLogin: "2026-03-20", joinedAt: "2025-02-01", loginCount: 189, specialization: "Calculus, Linear Algebra", phone: "+1-555-0104", officeHours: "N/A (On Leave)", completionRate: 88 },
  { id: "5", name: "Dr. Emily White", email: "emily@assignbridge.com", teacherId: "TCH-005", department: "Chemistry", classes: 2, students: 78, assignments: 5, submissionsGraded: 45, avgGrade: 88, status: "active", lastLogin: "2026-04-08", joinedAt: "2025-03-10", loginCount: 134, specialization: "Organic Chemistry, Biochemistry", phone: "+1-555-0105", officeHours: "Tue/Fri 1-3 PM", completionRate: 91 },
  { id: "6", name: "Prof. David Brown", email: "david@assignbridge.com", teacherId: "TCH-006", department: "Engineering", classes: 2, students: 65, assignments: 4, submissionsGraded: 32, avgGrade: 91, status: "active", lastLogin: "2026-02-28", joinedAt: "2025-03-15", loginCount: 89, specialization: "Robotics, Control Systems", phone: "+1-555-0106", officeHours: "Wed/Fri 2-4 PM", completionRate: 72 },
  { id: "7", name: "Dr. Lisa Wang", email: "lisa@assignbridge.com", teacherId: "TCH-007", department: "Biology", classes: 2, students: 88, assignments: 5, submissionsGraded: 67, avgGrade: 85, status: "active", lastLogin: "2026-04-10", joinedAt: "2025-04-01", loginCount: 112, specialization: "Molecular Biology, Genetics", phone: "+1-555-0107", officeHours: "Mon/Thu 11-1 PM", completionRate: 86 },
  { id: "8", name: "Prof. Robert Lee", email: "robert@assignbridge.com", teacherId: "TCH-008", department: "Computer Science", classes: 1, students: 45, assignments: 3, submissionsGraded: 12, avgGrade: 80, status: "inactive", lastLogin: "2026-01-15", joinedAt: "2025-05-01", loginCount: 45, specialization: "Machine Learning", phone: "+1-555-0108", officeHours: "N/A", completionRate: 55 },
];

// --- Config ---

const statusConfig: Record<TeacherStatus, { label: string; color: string; dot: string }> = {
  active: { label: "Active", color: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  inactive: { label: "Inactive", color: "text-slate-500", dot: "bg-slate-400" },
  on_leave: { label: "On Leave", color: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
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
  icon: typeof UserPen;
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

// --- Teacher Detail Dialog ---
function TeacherDetailDialog({
  teacher,
  open,
  onOpenChange,
}: {
  teacher: TeacherData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!teacher) return null;
  const status = statusConfig[teacher.status];
  const daysSince = daysSinceLogin(teacher.lastLogin);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                {getInitials(teacher.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-lg font-semibold">{teacher.name}</p>
              <p className="text-sm text-muted-foreground">{teacher.teacherId}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-blue-600 dark:text-blue-400">
              <UserPen className="mr-1 h-3 w-3" />
              Teacher
            </Badge>
            <div className="flex items-center gap-1.5 rounded-full border px-2.5 py-0.5">
              <span className={`h-2 w-2 rounded-full ${status.dot}`} />
              <span className={`text-sm ${status.color}`}>{status.label}</span>
            </div>
            <Badge variant="outline">{teacher.department}</Badge>
          </div>

          <Separator />

          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                Classes
              </div>
              <p className="mt-1 text-lg font-bold">{teacher.classes}</p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                Students
              </div>
              <p className="mt-1 text-lg font-bold">{teacher.students}</p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ClipboardList className="h-3.5 w-3.5" />
                Assignments
              </div>
              <p className="mt-1 text-lg font-bold">{teacher.assignments}</p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Graded
              </div>
              <p className="mt-1 text-lg font-bold">{teacher.submissionsGraded}</p>
            </div>
          </div>

          {/* Grading Performance */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Grading Performance</p>
              <Badge variant="outline" className="text-emerald-600">{teacher.avgGrade}%</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Completion Rate</span>
                <span>{teacher.completionRate}%</span>
              </div>
              <Progress value={teacher.completionRate} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Avg Grade Given</span>
                <span>{teacher.avgGrade}%</span>
              </div>
              <Progress value={teacher.avgGrade} className="h-2" />
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Contact & Schedule</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="truncate">{teacher.email}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="mt-0.5">{teacher.phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Specialization</p>
                <p className="mt-0.5">{teacher.specialization}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Office Hours</p>
                <p className="mt-0.5">{teacher.officeHours}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" />
              <span>{teacher.loginCount} logins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Last: {daysSince === 0 ? "Today" : `${daysSince}d ago`}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Joined {new Date(teacher.joinedAt).toLocaleDateString()}</span>
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

// --- Add Teacher Dialog ---
function AddTeacherDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (teacher: Omit<TeacherData, "id" | "loginCount" | "submissionsGraded" | "avgGrade" | "completionRate">) => void;
}) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [department, setDepartment] = React.useState<Department>("General");
  const [specialization, setSpecialization] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [officeHours, setOfficeHours] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      onSave({
        name, email, department, specialization, phone, officeHours,
        teacherId: `TCH-${String(Date.now()).slice(-3)}`,
        classes: 0, students: 0, assignments: 0,
        status: "active",
        lastLogin: new Date().toISOString().split("T")[0],
        joinedAt: new Date().toISOString().split("T")[0],
      });
      setIsSaving(false);
      setName(""); setEmail(""); setDepartment("General");
      setSpecialization(""); setPhone(""); setOfficeHours("");
      onOpenChange(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Teacher
          </DialogTitle>
          <DialogDescription>
            Create a new teacher account and assign to a department.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="teacher-name">Full Name</Label>
              <Input id="teacher-name" placeholder="e.g., Dr. Jane Smith" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="teacher-email">Email</Label>
              <Input id="teacher-email" type="email" placeholder="e.g., jane@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
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
            <Label htmlFor="teacher-spec">Specialization</Label>
            <Input id="teacher-spec" placeholder="e.g., Database Systems, Machine Learning" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="teacher-phone">Phone</Label>
              <Input id="teacher-phone" placeholder="e.g., +1-555-0101" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="teacher-hours">Office Hours</Label>
              <Input id="teacher-hours" placeholder="e.g., Mon/Wed 2-4 PM" value={officeHours} onChange={(e) => setOfficeHours(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Teacher
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Table Component ---
function TeachersTable({
  teachers,
  selectedIds,
  toggleSelect,
  toggleSelectAll,
  onView,
  onStatusToggle,
  isAllSelected,
}: {
  teachers: TeacherData[];
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  onView: (teacher: TeacherData) => void;
  onStatusToggle: (id: string) => void;
  isAllSelected: boolean;
}) {
  if (teachers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <UserPen className="h-12 w-12 mb-3 opacity-50" />
        <p className="text-sm font-medium">No teachers found</p>
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
          <TableHead>Teacher</TableHead>
          <TableHead className="hidden md:table-cell">Department</TableHead>
          <TableHead className="text-center hidden sm:table-cell">Classes</TableHead>
          <TableHead className="text-center hidden lg:table-cell">Students</TableHead>
          <TableHead className="text-center hidden xl:table-cell">Graded</TableHead>
          <TableHead className="hidden xl:table-cell">Avg Grade</TableHead>
          <TableHead className="hidden lg:table-cell">Last Login</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px] text-right pr-6">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teachers.map((teacher) => {
          const status = statusConfig[teacher.status];
          const daysSince = daysSinceLogin(teacher.lastLogin);

          return (
            <TableRow key={teacher.id} className="hover:bg-muted/50">
              <TableCell className="pl-6">
                <Checkbox
                  checked={selectedIds.has(teacher.id)}
                  onCheckedChange={() => toggleSelect(teacher.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold">
                      {getInitials(teacher.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{teacher.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{teacher.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-1.5 text-sm">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{teacher.department}</span>
                </div>
              </TableCell>
              <TableCell className="text-center hidden sm:table-cell">
                <div className="flex items-center justify-center gap-1 text-sm">
                  <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                  {teacher.classes}
                </div>
              </TableCell>
              <TableCell className="text-center hidden lg:table-cell">
                <div className="flex items-center justify-center gap-1 text-sm">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  {teacher.students}
                </div>
              </TableCell>
              <TableCell className="text-center hidden xl:table-cell">
                <div className="flex items-center justify-center gap-1 text-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                  {teacher.submissionsGraded}
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                <Badge variant={teacher.avgGrade >= 85 ? "default" : "secondary"} className="font-mono text-xs">
                  {teacher.avgGrade}%
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
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
                      <DropdownMenuItem onClick={() => onView(teacher)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusToggle(teacher.id)}>
                        {teacher.status === "active" ? (
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
export default function TeachersManagementPage() {
  const [teachers, setTeachers] = React.useState<TeacherData[]>(mockTeachers);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = React.useState<string>("all");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [detailTeacher, setDetailTeacher] = React.useState<TeacherData | null>(null);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [deleteTeacherId, setDeleteTeacherId] = React.useState<string | null>(null);

  const filtered = teachers.filter((t) => {
    const matchSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.teacherId.toLowerCase().includes(search.toLowerCase()) ||
      t.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchDept = departmentFilter === "all" || t.department === departmentFilter;
    return matchSearch && matchStatus && matchDept;
  });

  const counts = {
    total: teachers.length,
    active: teachers.filter((t) => t.status === "active").length,
    inactive: teachers.filter((t) => t.status === "inactive").length,
    onLeave: teachers.filter((t) => t.status === "on_leave").length,
    totalStudents: teachers.reduce((s, t) => s + t.students, 0),
    totalGraded: teachers.reduce((s, t) => s + t.submissionsGraded, 0),
    avgCompletion: Math.round(teachers.reduce((s, t) => s + t.completionRate, 0) / teachers.length),
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
      setSelectedIds(new Set(filtered.map((t) => t.id)));
    }
  };

  const handleStatusToggle = (id: string) => {
    setTeachers((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "active" ? ("inactive" as TeacherStatus) : ("active" as TeacherStatus) }
          : t
      )
    );
    const teacher = teachers.find((t) => t.id === id);
    toast.success(`${teacher?.name} ${teacher?.status === "active" ? "deactivated" : "activated"}`);
  };

  const handleBulkActivate = () => {
    setTeachers((prev) =>
      prev.map((t) => (selectedIds.has(t.id) ? { ...t, status: "active" as TeacherStatus } : t))
    );
    toast.success(`${selectedIds.size} teacher(s) activated`);
    setSelectedIds(new Set());
  };

  const handleBulkDeactivate = () => {
    setTeachers((prev) =>
      prev.map((t) => (selectedIds.has(t.id) ? { ...t, status: "inactive" as TeacherStatus } : t))
    );
    toast.success(`${selectedIds.size} teacher(s) deactivated`);
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    setTeachers((prev) => prev.filter((t) => !selectedIds.has(t.id)));
    toast.success(`${selectedIds.size} teacher(s) deleted`);
    setSelectedIds(new Set());
  };

  const handleDelete = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    toast.success("Teacher deleted successfully");
  };

  const handleAddTeacher = (data: Omit<TeacherData, "id" | "loginCount" | "submissionsGraded" | "avgGrade" | "completionRate">) => {
    const newTeacher: TeacherData = {
      ...data,
      id: String(Date.now()),
      loginCount: 0,
      submissionsGraded: 0,
      avgGrade: 0,
      completionRate: 0,
    };
    setTeachers((prev) => [...prev, newTeacher]);
    toast.success(`${data.name} created successfully`);
  };

  const handleExport = () => {
    const headers = ["Name", "Email", "Teacher ID", "Department", "Classes", "Students", "Assignments", "Graded", "Avg Grade", "Status"];
    const rows = filtered.map((t) => [t.name, t.email, t.teacherId, t.department, String(t.classes), String(t.students), String(t.assignments), String(t.submissionsGraded), `${t.avgGrade}%`, t.status]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `teachers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Teachers exported successfully");
  };

  const isAllSelected = filtered.length > 0 && selectedIds.size === filtered.length;

  // Top performers
  const topPerformers = [...teachers]
    .filter((t) => t.status === "active")
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teacher Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage teaching staff, monitor performance, and track activity.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Teacher
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          title="Total Teachers"
          value={counts.total}
          subtitle={`${counts.active} active`}
          icon={UserPen}
          color="bg-blue-500/10 text-blue-500"
        />
        <DashboardStat
          title="Total Students"
          value={counts.totalStudents.toLocaleString()}
          subtitle="across all teachers"
          icon={GraduationCap}
          color="bg-emerald-500/10 text-emerald-500"
        />
        <DashboardStat
          title="Submissions Graded"
          value={counts.totalGraded.toLocaleString()}
          subtitle={`${counts.avgCompletion}% avg completion`}
          icon={CheckCircle2}
          color="bg-violet-500/10 text-violet-500"
        />
        <DashboardStat
          title="Status Overview"
          value={`${counts.inactive} / ${counts.onLeave}`}
          subtitle="inactive / on leave"
          icon={Activity}
          color="bg-amber-500/10 text-amber-500"
        />
      </div>

      {/* Performance & Top Performers */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Department Breakdown</CardTitle>
            <CardDescription>Teachers and students by department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {departments.filter((d) => teachers.some((t) => t.department === d)).map((dept) => {
              const deptTeachers = teachers.filter((t) => t.department === dept);
              const totalStudents = deptTeachers.reduce((s, t) => s + t.students, 0);
              const avgCompletion = Math.round(deptTeachers.reduce((s, t) => s + t.completionRate, 0) / deptTeachers.length);
              return (
                <div key={dept} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{dept}</p>
                    <p className="text-xs text-muted-foreground">{deptTeachers.length} teacher(s) · {totalStudents} student(s)</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20">
                      <Progress value={avgCompletion} className="h-2" />
                    </div>
                    <Badge variant="secondary" className="text-xs">{avgCompletion}%</Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Performers</CardTitle>
            <CardDescription>By grading completion rate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPerformers.map((teacher) => (
              <div key={teacher.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold">
                      {getInitials(teacher.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{teacher.name}</p>
                    <p className="text-xs text-muted-foreground">{teacher.submissionsGraded} graded</p>
                  </div>
                </div>
                <Badge variant="default" className="text-xs">{teacher.completionRate}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <span className="text-sm font-medium">
            {selectedIds.size} teacher(s) selected
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
              <CardTitle>All Teachers</CardTitle>
              <CardDescription>{filtered.length} teacher(s) found</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-44">
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
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <TeachersTable
            teachers={filtered}
            selectedIds={selectedIds}
            toggleSelect={toggleSelect}
            toggleSelectAll={toggleSelectAll}
            onView={setDetailTeacher}
            onStatusToggle={handleStatusToggle}
            isAllSelected={isAllSelected}
          />
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <TeacherDetailDialog teacher={detailTeacher} open={!!detailTeacher} onOpenChange={() => setDetailTeacher(null)} />

      {/* Add Teacher Dialog */}
      <AddTeacherDialog open={isAddOpen} onOpenChange={setIsAddOpen} onSave={handleAddTeacher} />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTeacherId} onOpenChange={() => setDeleteTeacherId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Delete Teacher
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this teacher? All associated class data will be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTeacherId) handleDelete(deleteTeacherId);
                setDeleteTeacherId(null);
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
