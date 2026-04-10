"use client";

import * as React from "react";
import {
  Search,
  Plus,
  Download,
  Users,
  Shield,
  GraduationCap,
  UserPen,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Filter,
  UserCheck,
  UserX,
  KeyRound,
  Activity,
  Calendar,
  Clock,
  Building2,
  BarChart3,
  TrendingUp,
  Loader2,
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
import { toast } from "sonner";

// --- Types ---

type UserRole = "admin" | "teacher" | "student";
type UserStatus = "active" | "inactive" | "suspended";
type Department = "Computer Science" | "Mathematics" | "Physics" | "Chemistry" | "Engineering" | "Biology" | "General";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  avatar?: string;
  createdAt: string;
  lastLogin: string;
  status: UserStatus;
  loginCount: number;
  assignmentsCount: number;
  submissionsCount: number;
  classesCount: number;
}

// --- Mock Data ---

const departments: Department[] = ["Computer Science", "Mathematics", "Physics", "Chemistry", "Engineering", "Biology", "General"];

const mockUsers: UserData[] = [
  { id: "1", name: "Admin User", email: "admin@assignbridge.com", role: "admin", department: "General", createdAt: "2025-01-15", lastLogin: "2026-04-10", status: "active", loginCount: 342, assignmentsCount: 0, submissionsCount: 0, classesCount: 0 },
  { id: "2", name: "Dr. Sarah Johnson", email: "sarah@assignbridge.com", role: "teacher", department: "Computer Science", createdAt: "2025-02-10", lastLogin: "2026-04-10", status: "active", loginCount: 156, assignmentsCount: 12, submissionsCount: 145, classesCount: 4 },
  { id: "3", name: "Prof. Michael Chen", email: "michael@assignbridge.com", role: "teacher", department: "Computer Science", createdAt: "2025-02-12", lastLogin: "2026-04-09", status: "active", loginCount: 134, assignmentsCount: 8, submissionsCount: 98, classesCount: 3 },
  { id: "4", name: "Dr. Alex Kumar", email: "alex@assignbridge.com", role: "teacher", department: "Physics", createdAt: "2025-03-01", lastLogin: "2026-04-10", status: "active", loginCount: 112, assignmentsCount: 6, submissionsCount: 82, classesCount: 2 },
  { id: "5", name: "Prof. James Miller", email: "james@assignbridge.com", role: "teacher", department: "Mathematics", createdAt: "2025-03-05", lastLogin: "2026-03-20", status: "inactive", loginCount: 89, assignmentsCount: 10, submissionsCount: 167, classesCount: 3 },
  { id: "6", name: "Dr. Emily White", email: "emily@assignbridge.com", role: "teacher", department: "Chemistry", createdAt: "2025-03-10", lastLogin: "2026-04-08", status: "active", loginCount: 98, assignmentsCount: 5, submissionsCount: 45, classesCount: 2 },
  { id: "7", name: "Prof. David Brown", email: "david@assignbridge.com", role: "teacher", department: "Engineering", createdAt: "2025-03-15", lastLogin: "2026-02-28", status: "inactive", loginCount: 67, assignmentsCount: 4, submissionsCount: 32, classesCount: 2 },
  { id: "8", name: "John Smith", email: "john@assignbridge.com", role: "student", department: "Computer Science", createdAt: "2025-06-01", lastLogin: "2026-04-10", status: "active", loginCount: 245, assignmentsCount: 0, submissionsCount: 28, classesCount: 4 },
  { id: "9", name: "Alice Williams", email: "alice@assignbridge.com", role: "student", department: "Computer Science", createdAt: "2025-06-02", lastLogin: "2026-04-09", status: "active", loginCount: 198, assignmentsCount: 0, submissionsCount: 24, classesCount: 3 },
  { id: "10", name: "Bob Davis", email: "bob@assignbridge.com", role: "student", department: "Mathematics", createdAt: "2025-06-03", lastLogin: "2026-04-07", status: "active", loginCount: 167, assignmentsCount: 0, submissionsCount: 22, classesCount: 3 },
  { id: "11", name: "Carol Martinez", email: "carol@assignbridge.com", role: "student", department: "Physics", createdAt: "2025-06-04", lastLogin: "2026-04-10", status: "active", loginCount: 213, assignmentsCount: 0, submissionsCount: 30, classesCount: 4 },
  { id: "12", name: "Daniel Garcia", email: "daniel@assignbridge.com", role: "student", department: "Chemistry", createdAt: "2025-06-05", lastLogin: "2026-03-15", status: "suspended", loginCount: 45, assignmentsCount: 0, submissionsCount: 8, classesCount: 2 },
  { id: "13", name: "Emma Wilson", email: "emma@assignbridge.com", role: "student", department: "Biology", createdAt: "2025-06-10", lastLogin: "2026-04-09", status: "active", loginCount: 178, assignmentsCount: 0, submissionsCount: 19, classesCount: 3 },
  { id: "14", name: "Liam Taylor", email: "liam@assignbridge.com", role: "student", department: "Engineering", createdAt: "2025-06-12", lastLogin: "2026-04-08", status: "active", loginCount: 156, assignmentsCount: 0, submissionsCount: 15, classesCount: 2 },
];

// --- Config ---

const roleConfig: Record<UserRole, { label: string; icon: typeof Users; color: string; gradient: string }> = {
  admin: { label: "Admin", icon: Shield, color: "text-red-600 dark:text-red-400", gradient: "from-red-500 to-orange-600" },
  teacher: { label: "Teacher", icon: UserPen, color: "text-blue-600 dark:text-blue-400", gradient: "from-blue-500 to-indigo-600" },
  student: { label: "Student", icon: GraduationCap, color: "text-emerald-600 dark:text-emerald-400", gradient: "from-emerald-500 to-teal-600" },
};

const statusConfig: Record<UserStatus, { label: string; color: string; dot: string }> = {
  active: { label: "Active", color: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  inactive: { label: "Inactive", color: "text-slate-500", dot: "bg-slate-400" },
  suspended: { label: "Suspended", color: "text-red-600 dark:text-red-400", dot: "bg-red-500" },
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
  icon: typeof Users;
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

// --- User Detail Dialog ---
function UserDetailDialog({
  user,
  open,
  onOpenChange,
}: {
  user: UserData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!user) return null;
  const role = roleConfig[user.role];
  const status = statusConfig[user.status];
  const RoleIcon = role.icon;
  const daysSince = daysSinceLogin(user.lastLogin);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className={`bg-gradient-to-br text-white text-sm font-semibold ${role.gradient}`}>
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={role.color}>
              <RoleIcon className="mr-1 h-3 w-3" />
              {role.label}
            </Badge>
            <Badge variant="outline" className={status.color}>
              <span className={`mr-1.5 h-2 w-2 rounded-full ${status.dot}`} />
              {status.label}
            </Badge>
            <Badge variant="outline">{user.department}</Badge>
          </div>

          <Separator />

          {/* Activity Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <KeyRound className="h-3.5 w-3.5" />
                Total Logins
              </div>
              <p className="mt-1 text-lg font-bold">{user.loginCount}</p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Last Login
              </div>
              <p className="mt-1 text-lg font-bold">{daysSince === 0 ? "Today" : `${daysSince}d ago`}</p>
            </div>
          </div>

          {/* Role-specific Stats */}
          {(user.role === "teacher" || user.role === "admin") && (
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Classes</p>
                <p className="mt-1 text-lg font-bold">{user.classesCount}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Assignments</p>
                <p className="mt-1 text-lg font-bold">{user.assignmentsCount}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Graded</p>
                <p className="mt-1 text-lg font-bold">{user.submissionsCount}</p>
              </div>
            </div>
          )}

          {user.role === "student" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Classes</p>
                <p className="mt-1 text-lg font-bold">{user.classesCount}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Submissions</p>
                <p className="mt-1 text-lg font-bold">{user.submissionsCount}</p>
              </div>
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">User ID</p>
              <p className="font-mono mt-0.5">{user.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Department</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{user.department}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Joined</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Login</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{new Date(user.lastLogin).toLocaleDateString()}</span>
              </div>
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

// --- Create/Edit User Dialog ---
function CreateUserDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: Omit<UserData, "id" | "loginCount" | "assignmentsCount" | "submissionsCount" | "classesCount">) => void;
}) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<UserRole>("student");
  const [department, setDepartment] = React.useState<Department>("General");
  const [status, setStatus] = React.useState<UserStatus>("active");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      onSave({ name, email, role, department, status, createdAt: new Date().toISOString().split("T")[0], lastLogin: new Date().toISOString().split("T")[0] });
      setIsSaving(false);
      setName("");
      setEmail("");
      setRole("student");
      setDepartment("General");
      setStatus("active");
      onOpenChange(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New User
          </DialogTitle>
          <DialogDescription>
            Create a new user account and assign a role.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="user-name">Full Name</Label>
            <Input id="user-name" placeholder="e.g., John Smith" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="user-email">Email</Label>
            <Input id="user-email" type="email" placeholder="e.g., john@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as UserStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Table Component ---
function UsersTable({
  users,
  selectedIds,
  toggleSelect,
  toggleSelectAll,
  onStatusToggle,
  onDelete,
  onView,
  isAllSelected,
}: {
  users: UserData[];
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  onStatusToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (user: UserData) => void;
  isAllSelected: boolean;
}) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Users className="h-12 w-12 mb-3 opacity-50" />
        <p className="text-sm font-medium">No users found</p>
        <p className="text-xs mt-1">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10 pl-6">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={toggleSelectAll}
            />
          </TableHead>
          <TableHead>User</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="hidden md:table-cell">Joined</TableHead>
          <TableHead className="hidden lg:table-cell">Last Login</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px] text-right pr-6">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const role = roleConfig[user.role];
          const status = statusConfig[user.status];
          const RoleIcon = role.icon;
          const daysSince = daysSinceLogin(user.lastLogin);

          return (
            <TableRow key={user.id} className="hover:bg-muted/50">
              <TableCell className="pl-6">
                <Checkbox
                  checked={selectedIds.has(user.id)}
                  onCheckedChange={() => toggleSelect(user.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className={`bg-gradient-to-br text-white text-xs font-semibold ${role.gradient}`}>
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm hidden sm:table-cell">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{user.department}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={role.color}>
                  <RoleIcon className="mr-1 h-3 w-3" />
                  {role.label}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                {new Date(user.createdAt).toLocaleDateString()}
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
                      <DropdownMenuItem onClick={() => onView(user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatusToggle(user.id)}>
                        {user.status === "active" ? (
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
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(user.id)}
                    >
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
export default function UsersPage() {
  const [users, setUsers] = React.useState<UserData[]>(mockUsers);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = React.useState<string>("all");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [detailUser, setDetailUser] = React.useState<UserData | null>(null);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [deleteUserId, setDeleteUserId] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<"table" | "cards">("table");

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    const matchDept = departmentFilter === "all" || u.department === departmentFilter;
    return matchSearch && matchRole && matchStatus && matchDept;
  });

  const counts = {
    total: users.length,
    admin: users.filter((u) => u.role === "admin").length,
    teacher: users.filter((u) => u.role === "teacher").length,
    student: users.filter((u) => u.role === "student").length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    suspended: users.filter((u) => u.status === "suspended").length,
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
      setSelectedIds(new Set(filtered.map((u) => u.id)));
    }
  };

  const handleStatusToggle = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? ("inactive" as UserStatus) : ("active" as UserStatus) }
          : u
      )
    );
    const user = users.find((u) => u.id === id);
    toast.success(`${user?.name} ${user?.status === "active" ? "deactivated" : "activated"}`);
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    toast.success("User deleted successfully");
  };

  const handleBulkDelete = () => {
    setUsers((prev) => prev.filter((u) => !selectedIds.has(u.id)));
    toast.success(`${selectedIds.size} user(s) deleted`);
    setSelectedIds(new Set());
  };

  const handleBulkActivate = () => {
    setUsers((prev) =>
      prev.map((u) => (selectedIds.has(u.id) ? { ...u, status: "active" as UserStatus } : u))
    );
    toast.success(`${selectedIds.size} user(s) activated`);
    setSelectedIds(new Set());
  };

  const handleBulkDeactivate = () => {
    setUsers((prev) =>
      prev.map((u) => (selectedIds.has(u.id) ? { ...u, status: "inactive" as UserStatus } : u))
    );
    toast.success(`${selectedIds.size} user(s) deactivated`);
    setSelectedIds(new Set());
  };

  const handleAddUser = (userData: Omit<UserData, "id" | "loginCount" | "assignmentsCount" | "submissionsCount" | "classesCount">) => {
    const newUser: UserData = {
      ...userData,
      id: String(Date.now()),
      loginCount: 0,
      assignmentsCount: 0,
      submissionsCount: 0,
      classesCount: 0,
    };
    setUsers((prev) => [...prev, newUser]);
    toast.success(`${userData.name} created successfully`);
  };

  const handleExport = () => {
    const headers = ["Name", "Email", "Role", "Department", "Status", "Joined", "Last Login"];
    const rows = filtered.map((u) => [u.name, u.email, u.role, u.department, u.status, u.createdAt, u.lastLogin]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Users exported successfully");
  };

  const isAllSelected = filtered.length > 0 && selectedIds.size === filtered.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage all users, assign roles, and monitor activity.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          title="Total Users"
          value={counts.total}
          subtitle={`${counts.active} active`}
          icon={Users}
          color="bg-blue-500/10 text-blue-500"
        />
        <DashboardStat
          title="Teachers"
          value={counts.teacher}
          subtitle="teaching staff"
          icon={UserPen}
          color="bg-violet-500/10 text-violet-500"
        />
        <DashboardStat
          title="Students"
          value={counts.student}
          subtitle="enrolled students"
          icon={GraduationCap}
          color="bg-emerald-500/10 text-emerald-500"
        />
        <DashboardStat
          title="Inactive / Suspended"
          value={`${counts.inactive} / ${counts.suspended}`}
          subtitle="needs attention"
          icon={Shield}
          color="bg-amber-500/10 text-amber-500"
        />
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <span className="text-sm font-medium">
            {selectedIds.size} user(s) selected
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
              <CardTitle>All Users</CardTitle>
              <CardDescription>{filtered.length} user(s) found</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "table" | "cards")}>
            <TabsList className="ml-6 mt-4">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="cards">Card View</TabsTrigger>
            </TabsList>
            <TabsContent value="table" className="mt-4">
              <UsersTable
                users={filtered}
                selectedIds={selectedIds}
                toggleSelect={toggleSelect}
                toggleSelectAll={toggleSelectAll}
                onStatusToggle={handleStatusToggle}
                onDelete={setDeleteUserId}
                onView={setDetailUser}
                isAllSelected={isAllSelected}
              />
            </TabsContent>
            <TabsContent value="cards" className="mt-4">
              <div className="grid gap-4 p-6 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((user) => {
                  const role = roleConfig[user.role];
                  const status = statusConfig[user.status];
                  const RoleIcon = role.icon;
                  const daysSince = daysSinceLogin(user.lastLogin);
                  return (
                    <Card key={user.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className={`bg-gradient-to-br text-white text-sm font-semibold ${role.gradient}`}>
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setDetailUser(user)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusToggle(user.id)}>
                                {user.status === "active" ? <UserX className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
                                {user.status === "active" ? "Deactivate" : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteUserId(user.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          <Badge variant="outline" className={role.color}>
                            <RoleIcon className="mr-1 h-3 w-3" />
                            {role.label}
                          </Badge>
                          <div className="flex items-center gap-1.5 rounded-full border px-2 py-0.5">
                            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                            <span className={`text-xs ${status.color}`}>{status.label}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">{user.department}</Badge>
                        </div>
                        <Separator className="my-3" />
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div>
                            <p className="text-muted-foreground">Logins</p>
                            <p className="font-semibold">{user.loginCount}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Last Login</p>
                            <p className="font-semibold">{daysSince === 0 ? "Today" : `${daysSince}d`}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Classes</p>
                            <p className="font-semibold">{user.classesCount}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <UserDetailDialog user={detailUser} open={!!detailUser} onOpenChange={() => setDetailUser(null)} />

      {/* Create User Dialog */}
      <CreateUserDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onSave={handleAddUser} />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Delete User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone and all associated data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteUserId) handleDelete(deleteUserId);
                setDeleteUserId(null);
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
