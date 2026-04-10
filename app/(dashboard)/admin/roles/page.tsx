"use client";

import * as React from "react";
import {
  Shield,
  Users,
  Plus,
  Pencil,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Copy,
  Key,
  LayoutGrid,
  List,
  Lock,
  Unlock,
  BarChart3,
  BookOpen,
  Settings,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  DialogTrigger,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// --- Types ---

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  userCount: number;
  permissions: Permission[];
  isActive: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: PermissionCategory;
  enabled: boolean;
}

type PermissionCategory = "user_management" | "academic" | "analytics" | "system" | "submissions" | "reports";
type ViewMode = "table" | "matrix";

// --- Constants ---

const permissionCategories: { key: PermissionCategory; label: string; icon: typeof Key; color: string }[] = [
  { key: "user_management", label: "User Management", icon: Users, color: "text-blue-500" },
  { key: "academic", label: "Academic", icon: BookOpen, color: "text-emerald-500" },
  { key: "submissions", label: "Submissions", icon: BarChart3, color: "text-violet-500" },
  { key: "analytics", label: "Analytics", icon: BarChart3, color: "text-cyan-500" },
  { key: "reports", label: "Reports", icon: LayoutGrid, color: "text-amber-500" },
  { key: "system", label: "System", icon: Settings, color: "text-slate-500" },
];

const roleColors: Record<string, string> = {
  admin: "from-red-500 to-orange-600",
  teacher: "from-emerald-500 to-teal-600",
  student: "from-blue-500 to-sky-600",
  teaching_assistant: "from-purple-500 to-indigo-600",
  department_head: "from-amber-500 to-orange-600",
  default: "from-slate-500 to-gray-600",
};

const allPermissions: Permission[] = [
  { id: "p1", name: "manage_users", description: "Create, edit, and delete users", category: "user_management", enabled: false },
  { id: "p2", name: "manage_roles", description: "Create and modify role definitions", category: "user_management", enabled: false },
  { id: "p3", name: "view_students", description: "View student profiles and performance", category: "user_management", enabled: false },
  { id: "p4", name: "view_teachers", description: "View teacher profiles", category: "user_management", enabled: false },
  { id: "p5", name: "manage_classes", description: "Create and manage classes", category: "academic", enabled: false },
  { id: "p6", name: "manage_own_classes", description: "Manage assigned classes", category: "academic", enabled: false },
  { id: "p7", name: "manage_courses", description: "Manage course catalog and curriculum", category: "academic", enabled: false },
  { id: "p8", name: "create_assignments", description: "Create and publish assignments", category: "academic", enabled: false },
  { id: "p9", name: "view_classes", description: "View enrolled classes", category: "academic", enabled: false },
  { id: "p10", name: "submit_assignments", description: "Submit assignments", category: "submissions", enabled: false },
  { id: "p11", name: "grade_submissions", description: "Review and grade student submissions", category: "submissions", enabled: false },
  { id: "p12", name: "view_own_grades", description: "View own grades and feedback", category: "submissions", enabled: false },
  { id: "p13", name: "view_analytics", description: "Access platform analytics", category: "analytics", enabled: false },
  { id: "p14", name: "view_class_analytics", description: "Access class analytics", category: "analytics", enabled: false },
  { id: "p15", name: "generate_reports", description: "Generate platform reports", category: "reports", enabled: false },
  { id: "p16", name: "view_own_reports", description: "View personal reports", category: "reports", enabled: false },
  { id: "p17", name: "view_logs", description: "View audit and activity logs", category: "system", enabled: false },
  { id: "p18", name: "manage_settings", description: "Manage platform settings", category: "system", enabled: false },
];

// --- Mock Data ---

const mockRoles: Role[] = [
  {
    id: "1",
    name: "admin",
    displayName: "Administrator",
    description: "Full system access with all management capabilities",
    userCount: 82,
    color: "admin",
    permissions: [
      { ...allPermissions[0], enabled: true },
      { ...allPermissions[1], enabled: true },
      { ...allPermissions[2], enabled: true },
      { ...allPermissions[3], enabled: true },
      { ...allPermissions[4], enabled: true },
      { ...allPermissions[5], enabled: true },
      { ...allPermissions[6], enabled: true },
      { ...allPermissions[7], enabled: true },
      { ...allPermissions[10], enabled: true },
      { ...allPermissions[12], enabled: true },
      { ...allPermissions[13], enabled: true },
      { ...allPermissions[14], enabled: true },
      { ...allPermissions[15], enabled: true },
      { ...allPermissions[16], enabled: true },
    ],
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-06-15",
  },
  {
    id: "2",
    name: "teacher",
    displayName: "Teacher",
    description: "Manage classes, create assignments, and grade submissions",
    userCount: 186,
    color: "teacher",
    permissions: [
      { ...allPermissions[2], enabled: true },
      { ...allPermissions[5], enabled: true },
      { ...allPermissions[7], enabled: true },
      { ...allPermissions[8], enabled: true },
      { ...allPermissions[10], enabled: true },
      { ...allPermissions[13], enabled: true },
      { ...allPermissions[15], enabled: true },
    ],
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-05-20",
  },
  {
    id: "3",
    name: "student",
    displayName: "Student",
    description: "View classes, submit assignments, and track grades",
    userCount: 980,
    color: "student",
    permissions: [
      { ...allPermissions[8], enabled: true },
      { ...allPermissions[9], enabled: true },
      { ...allPermissions[11], enabled: true },
      { ...allPermissions[15], enabled: true },
    ],
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-04-10",
  },
  {
    id: "4",
    name: "teaching_assistant",
    displayName: "Teaching Assistant",
    description: "Assist teachers with grading and class management",
    userCount: 45,
    color: "teaching_assistant",
    permissions: [
      { ...allPermissions[2], enabled: true },
      { ...allPermissions[5], enabled: true },
      { ...allPermissions[8], enabled: true },
      { ...allPermissions[10], enabled: true },
      { ...allPermissions[13], enabled: true },
      { ...allPermissions[15], enabled: true },
    ],
    isActive: true,
    createdAt: "2024-03-15",
    updatedAt: "2024-06-01",
  },
];

// --- Helper Components ---

function PermissionToggle({
  permission,
  onToggle,
}: {
  permission: Permission;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50">
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 rounded-md p-1 ${permission.enabled ? "bg-emerald-500/10" : "bg-muted"}`}>
          {permission.enabled ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium">{permission.name.replace(/_/g, " ")}</p>
          <p className="text-xs text-muted-foreground">{permission.description}</p>
        </div>
      </div>
      <Switch checked={permission.enabled} onCheckedChange={onToggle} />
    </div>
  );
}

function getPermissionScore(role: Role): number {
  if (role.permissions.length === 0) return 0;
  return Math.round((role.permissions.filter((p) => p.enabled).length / allPermissions.length) * 100);
}

// --- Main Page ---

export default function RoleManagementPage() {
  const [roles, setRoles] = React.useState<Role[]>(mockRoles);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "inactive">("all");
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<Role | null>(null);
  const [editingPermissions, setEditingPermissions] = React.useState<Permission[]>([]);
  const [viewMode, setViewMode] = React.useState<ViewMode>("table");

  // Create/Edit form state
  const [formName, setFormName] = React.useState("");
  const [formDisplayName, setFormDisplayName] = React.useState("");
  const [formDescription, setFormDescription] = React.useState("");
  const [formPermissions, setFormPermissions] = React.useState<Permission[]>(allPermissions.map((p) => ({ ...p })));

  const filteredRoles = roles.filter((role) => {
    if (statusFilter === "active" && !role.isActive) return false;
    if (statusFilter === "inactive" && role.isActive) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        role.displayName.toLowerCase().includes(q) ||
        role.name.toLowerCase().includes(q) ||
        role.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: roles.length,
    active: roles.filter((r) => r.isActive).length,
    inactive: roles.filter((r) => !r.isActive).length,
    totalUsers: roles.reduce((sum, r) => sum + r.userCount, 0),
  };

  const openCreateDialog = () => {
    setEditingRole(null);
    setFormName("");
    setFormDisplayName("");
    setFormDescription("");
    setFormPermissions(allPermissions.map((p) => ({ ...p })));
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (role: Role) => {
    setEditingRole(role);
    setFormName(role.name);
    setFormDisplayName(role.displayName);
    setFormDescription(role.description);
    setFormPermissions(
      allPermissions.map((p) => {
        const existing = role.permissions.find((rp) => rp.id === p.id);
        return { ...p, enabled: existing?.enabled ?? false };
      })
    );
    setIsCreateDialogOpen(true);
  };

  const handleSaveRole = () => {
    if (editingRole) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRole.id
            ? {
                ...r,
                name: formName,
                displayName: formDisplayName,
                description: formDescription,
                permissions: formPermissions.filter((p) => p.enabled),
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : r
        )
      );
      toast.success(`Role "${formDisplayName}" updated`);
    } else {
      const newRole: Role = {
        id: String(Date.now()),
        name: formName,
        displayName: formDisplayName,
        description: formDescription,
        userCount: 0,
        permissions: formPermissions.filter((p) => p.enabled),
        isActive: true,
        color: "default",
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setRoles((prev) => [...prev, newRole]);
      toast.success(`Role "${formDisplayName}" created`);
    }
    setIsCreateDialogOpen(false);
  };

  const handleViewRole = (role: Role) => {
    setSelectedRole(role);
    setIsViewDialogOpen(true);
  };

  const handleDeleteRole = (role: Role) => {
    setEditingRole(role);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!editingRole) return;
    if (editingRole.userCount > 0) {
      toast.error(`Cannot delete "${editingRole.displayName}" — ${editingRole.userCount} users have this role`);
      setIsDeleteDialogOpen(false);
      return;
    }
    setRoles((prev) => prev.filter((r) => r.id !== editingRole.id));
    toast.success(`Role "${editingRole.displayName}" deleted`);
    setIsDeleteDialogOpen(false);
    setEditingRole(null);
  };

  const handleDuplicateRole = (role: Role) => {
    const newRole: Role = {
      ...role,
      id: String(Date.now()),
      name: `${role.name}_copy`,
      displayName: `${role.displayName} (Copy)`,
      userCount: 0,
      permissions: role.permissions.map((p) => ({ ...p })),
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setRoles((prev) => [...prev, newRole]);
    toast.success(`Role "${role.displayName}" duplicated`);
  };

  const handleToggleRoleStatus = (roleId: string) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === roleId ? { ...r, isActive: !r.isActive } : r
      )
    );
    const role = roles.find((r) => r.id === roleId);
    if (role) {
      toast.success(
        `Role "${role.displayName}" ${role.isActive ? "deactivated" : "activated"}`
      );
    }
  };

  const toggleFormPermission = (permId: string) => {
    setFormPermissions((prev) =>
      prev.map((p) => (p.id === permId ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const toggleCategoryPermissions = (category: PermissionCategory) => {
    setFormPermissions((prev) => {
      const categoryPerms = prev.filter((p) => p.category === category);
      const allEnabled = categoryPerms.every((p) => p.enabled);
      return prev.map((p) =>
        p.category === category ? { ...p, enabled: !allEnabled } : p
      );
    });
  };

  const formEnabledCount = formPermissions.filter((p) => p.enabled).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Role Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage user roles, permissions, and access control across the platform.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openCreateDialog}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate Role
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-500/10 p-3">
              <Shield className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Roles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-emerald-500/10 p-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Active Roles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-violet-500/10 p-3">
              <Users className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-amber-500/10 p-3">
              <Key className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{allPermissions.length}</p>
              <p className="text-sm text-muted-foreground">Total Permissions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 pt-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search roles..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex items-center gap-1 border rounded-md p-1">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2.5"
              onClick={() => setViewMode("table")}
            >
              <List className="mr-1 h-3.5 w-3.5" />
              Table
            </Button>
            <Button
              variant={viewMode === "matrix" ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2.5"
              onClick={() => setViewMode("matrix")}
            >
              <LayoutGrid className="mr-1 h-3.5 w-3.5" />
              Matrix
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
        {/* Table View */}
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>
                Overview of all roles and their access levels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Permission Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <Filter className="mx-auto mb-3 h-10 w-10 opacity-50" />
                        <p className="text-sm text-muted-foreground">No roles match the current filters.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRoles.map((role) => {
                      const score = getPermissionScore(role);
                      const gradient = roleColors[role.color] || roleColors.default;
                      return (
                        <TableRow key={role.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white ${gradient}`}>
                                <Shield className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">{role.displayName}</p>
                                <p className="text-xs text-muted-foreground font-mono">{role.name}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-sm text-muted-foreground line-clamp-2">{role.description}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{role.userCount.toLocaleString()}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16">
                                <Progress value={score} className="h-2" />
                              </div>
                              <span className="text-sm font-medium">{score}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={
                                role.isActive
                                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                  : "bg-red-500/10 text-red-700 dark:text-red-400"
                              }
                            >
                              {role.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => handleViewRole(role)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openEditDialog(role)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDuplicateRole(role)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleToggleRoleStatus(role.id)}>
                                {role.isActive ? (
                                  <Lock className="h-4 w-4 text-amber-500" />
                                ) : (
                                  <Unlock className="h-4 w-4 text-emerald-500" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteRole(role)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Matrix View */}
        <TabsContent value="matrix">
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>
                Visual overview of which roles have which permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-3 pr-4 text-left text-sm font-medium">Permission</th>
                      {filteredRoles.map((role) => {
                        const gradient = roleColors[role.color] || roleColors.default;
                        return (
                          <th key={role.id} className="pb-3 px-2 text-center">
                            <div className={`mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br text-white ${gradient}`}>
                              <Shield className="h-4 w-4" />
                            </div>
                            <p className="mt-1 text-xs font-medium">{role.displayName}</p>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {permissionCategories.map((cat) => {
                      const catPerms = allPermissions.filter((p) => p.category === cat.key);
                      const CatIcon = cat.icon;
                      return (
                        <React.Fragment key={cat.key}>
                          <tr className="border-b/50">
                            <td colSpan={filteredRoles.length + 1} className="py-3 text-sm font-semibold text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <CatIcon className={`h-4 w-4 ${cat.color}`} />
                                {cat.label}
                              </div>
                            </td>
                          </tr>
                          {catPerms.map((perm) => (
                            <tr key={perm.id} className="border-b/50">
                              <td className="py-2 pr-4 text-sm">
                                <p className="font-medium">{perm.name.replace(/_/g, " ")}</p>
                                <p className="text-xs text-muted-foreground">{perm.description}</p>
                              </td>
                              {filteredRoles.map((role) => {
                                const hasPerm = role.permissions.some((rp) => rp.id === perm.id);
                                return (
                                  <td key={`${role.id}-${perm.id}`} className="px-2 text-center">
                                    {hasPerm ? (
                                      <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-500" />
                                    ) : (
                                      <XCircle className="mx-auto h-5 w-5 text-muted-foreground/30" />
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Role Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {editingRole ? "Edit Role" : "Create New Role"}
            </DialogTitle>
            <DialogDescription>
              {editingRole
                ? `Edit permissions for "${editingRole.displayName}".`
                : "Define a new role with custom permissions."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role-name">Role Name</Label>
                <Input
                  id="role-name"
                  placeholder="e.g., department_head"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  placeholder="e.g., Department Head"
                  value={formDisplayName}
                  onChange={(e) => setFormDisplayName(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role-description">Description</Label>
              <Textarea
                id="role-description"
                placeholder="Describe the role's responsibilities and access level..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>

            {/* Permission Summary */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Permissions Enabled</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24">
                  <Progress value={(formEnabledCount / allPermissions.length) * 100} className="h-2" />
                </div>
                <span className="text-sm font-medium">
                  {formEnabledCount} / {allPermissions.length}
                </span>
              </div>
            </div>

            {/* Permissions by Category */}
            {permissionCategories.map((cat) => {
              const catPerms = formPermissions.filter((p) => p.category === cat.key);
              if (catPerms.length === 0) return null;
              const allEnabled = catPerms.every((p) => p.enabled);
              const CatIcon = cat.icon;
              return (
                <div key={cat.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CatIcon className={`h-4 w-4 ${cat.color}`} />
                      <h4 className="text-sm font-medium">{cat.label}</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => toggleCategoryPermissions(cat.key)}
                    >
                      {allEnabled ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                  <div className="space-y-1.5">
                    {catPerms.map((permission) => (
                      <PermissionToggle
                        key={permission.id}
                        permission={permission}
                        onToggle={() => toggleFormPermission(permission.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole}>
              {editingRole ? "Save Changes" : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Role Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        {selectedRole && (
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br text-white ${roleColors[selectedRole.color] || roleColors.default}`}>
                  <Shield className="h-4 w-4" />
                </div>
                {selectedRole.displayName}
              </DialogTitle>
              <DialogDescription>
                {selectedRole.description}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Users</p>
                  <p className="text-lg font-bold">{selectedRole.userCount.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Permissions</p>
                  <p className="text-lg font-bold">
                    {selectedRole.permissions.filter((p) => p.enabled).length}/{allPermissions.length}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Score</p>
                  <p className="text-lg font-bold">{getPermissionScore(selectedRole)}%</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge
                    variant="secondary"
                    className={
                      selectedRole.isActive
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "bg-red-500/10 text-red-700 dark:text-red-400"
                    }
                  >
                    {selectedRole.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Permissions</h4>
                {permissionCategories.map((cat) => {
                  const categoryPermissions = selectedRole.permissions.filter(
                    (p) => p.category === cat.key
                  );
                  if (categoryPermissions.length === 0) return null;
                  const CatIcon = cat.icon;
                  return (
                    <div key={cat.key} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CatIcon className={`h-3.5 w-3.5 ${cat.color}`} />
                        <h5 className="text-xs font-semibold">{cat.label}</h5>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {categoryPermissions.map((permission) => (
                          <Badge
                            key={permission.id}
                            variant="secondary"
                            className={
                              permission.enabled
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                : ""
                            }
                          >
                            {permission.enabled ? (
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                            ) : (
                              <XCircle className="mr-1 h-3 w-3" />
                            )}
                            {permission.name.replace(/_/g, " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <p>Created: {selectedRole.createdAt}</p>
                </div>
                <div>
                  <p>Updated: {selectedRole.updatedAt}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => openEditDialog(selectedRole)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Role
              </Button>
              <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Role
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the role &quot;{editingRole?.displayName}&quot;? This action cannot be undone.
              {editingRole && editingRole.userCount > 0 && (
                <span className="mt-2 block text-red-500">
                  Warning: {editingRole.userCount} users currently have this role assigned.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
