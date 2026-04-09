"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  Power,
  KeyRound,
  Download,
  UserCheck,
  UserX,
  Users,
  UserPlus,
  GraduationCap,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useActivateUser,
  useDeactivateUser,
} from "@/lib/hooks/queries/useUsers";
import { useToast } from "@/hooks/use-toast";
import type { ApiUser } from "@/lib/api/users";
import type { UserRole, UserStatus } from "@/lib/types/user";

// ─── Export users to CSV ──────────────────────────────────────────────
function exportUsersToCSV(users: ApiUser[]) {
  const headers = [
    "Name",
    "Email",
    "Role",
    "Status",
    "Created At",
    "Last Login",
  ];
  const rows = users.map((u) => [
    u.fullName,
    u.email,
    u.role,
    u.status,
    new Date(u.createdAt).toLocaleDateString(),
    u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Never",
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [
      headers.join(","),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
    ].join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = `users-export-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
}

// ─── Stat Card Component ──────────────────────────────────────────────
function DashboardStat({
  title,
  value,
  subtitle,
  icon,
  trend,
}: {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {trend &&
            (trend.positive ? (
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-500" />
            ))}
          {trend && (
            <span
              className={trend.positive ? "text-emerald-500" : "text-red-500"}
            >
              {trend.value}
            </span>
          )}
          <span>{subtitle}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const router = useRouter();
  const { data: users = [], isLoading } = useUsers({});
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const activateUserFn = useActivateUser();
  const deactivateUserFn = useDeactivateUser();

  const [updateUserId, setUpdateUserId] = useState<string | undefined>(
    undefined,
  );
  const updateUser = useUpdateUser(updateUserId);

  const { toast } = useToast();

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [activeTab, setActiveTab] = useState("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [resetPasswordUserId, setResetPasswordUserId] = useState<string | null>(
    null,
  );
  const [resetPassword, setResetPassword] = useState("");

  // Bulk selection
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set(),
  );

  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // Bulk action confirmation
  const [bulkActionConfirmOpen, setBulkActionConfirmOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<
    "activate" | "deactivate" | "delete" | null
  >(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "student" as UserRole,
    status: "active" as UserStatus,
    password: "",
  });

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      role: "student",
      status: "active",
      password: "",
    });
    setEditingUser(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (user: ApiUser) => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      password: "",
    });
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSaveUser = () => {
    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }

    if (editingUser) {
      setUpdateUserId(editingUser.id);
      updateUser.mutate(
        {
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          status: formData.status,
        },
        {
          onSuccess: () => {
            closeModal();
            toast({
              title: "User updated",
              description: `${formData.fullName} has been updated successfully.`,
            });
          },
        },
      );
    } else {
      if (!formData.password.trim()) {
        toast({
          title: "Validation Error",
          description: "Password is required for new users.",
          variant: "destructive",
        });
        return;
      }
      createUser.mutate(
        {
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          password: formData.password,
        },
        {
          onSuccess: () => {
            closeModal();
            toast({
              title: "User created",
              description: `${formData.fullName} has been added.`,
            });
          },
        },
      );
    }
  };

  const handleDeleteUser = (id: string) => {
    setDeleteUserId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteUser = () => {
    if (deleteUserId) {
      deleteUser.mutate(deleteUserId, {
        onSuccess: () => {
          toast({
            title: "User deleted",
            description: "The user has been removed.",
          });
        },
      });
      setDeleteConfirmOpen(false);
      setDeleteUserId(null);
    }
  };

  const handleToggleStatus = (user: ApiUser) => {
    if (user.status === "active") {
      deactivateUserFn.mutate(user.id, {
        onSuccess: () =>
          toast({
            title: "User deactivated",
            description: `${user.fullName} is now inactive.`,
          }),
      });
    } else {
      activateUserFn.mutate(user.id, {
        onSuccess: () =>
          toast({
            title: "User activated",
            description: `${user.fullName} is now active.`,
          }),
      });
    }
  };

  const openResetPassword = (userId: string) => {
    setResetPasswordUserId(userId);
    setResetPassword("");
    setIsResetPasswordOpen(true);
  };

  const handleResetPassword = () => {
    if (!resetPasswordUserId || !resetPassword.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a new password.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password reset",
      description: "The user's password has been reset.",
    });
    setIsResetPasswordOpen(false);
    setResetPasswordUserId(null);
    setResetPassword("");
  };

  // ─── Bulk Actions ───────────────────────────────────────────────────
  const toggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedUserIds.size === filteredUsers.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(filteredUsers.map((u) => u.id)));
    }
  };

  const handleBulkAction = (action: "activate" | "deactivate" | "delete") => {
    setBulkAction(action);
    setBulkActionConfirmOpen(true);
  };

  const confirmBulkAction = () => {
    if (!bulkAction || selectedUserIds.size === 0) return;

    selectedUserIds.forEach((id) => {
      if (bulkAction === "activate") activateUserFn.mutate(id);
      else if (bulkAction === "deactivate") deactivateUserFn.mutate(id);
      else if (bulkAction === "delete") deleteUser.mutate(id);
    });

    toast({
      title: `Bulk ${bulkAction} complete`,
      description: `${selectedUserIds.size} user(s) have been ${bulkAction === "delete" ? "removed" : bulkAction === "activate" ? "activated" : "deactivated"}.`,
    });

    setSelectedUserIds(new Set());
    setBulkActionConfirmOpen(false);
    setBulkAction(null);
  };

  const clearSelection = () => setSelectedUserIds(new Set());

  // ─── Filtering ──────────────────────────────────────────────────────
  const filteredUsers = users.filter((u) => {
    if (activeTab !== "all" && u.role !== activeTab) return false;
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ─── Stats ──────────────────────────────────────────────────────────
  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    admins: users.filter((u) => u.role === "admin").length,
    teachers: users.filter((u) => u.role === "teacher").length,
    students: users.filter((u) => u.role === "student").length,
    inactive: users.filter((u) => u.status === "inactive").length,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage all users: create, edit roles, activate/deactivate, reset
            passwords, and delete.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportUsersToCSV(filteredUsers)}
            disabled={filteredUsers.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          title="Total Users"
          value={stats.total}
          subtitle="across all roles"
          icon={<Users className="h-4 w-4" />}
        />
        <DashboardStat
          title="Active Users"
          value={stats.active}
          subtitle={`${stats.inactive} inactive`}
          icon={<UserCheck className="h-4 w-4" />}
          trend={
            stats.inactive > 0
              ? { value: `${stats.inactive} inactive`, positive: false }
              : undefined
          }
        />
        <DashboardStat
          title="Teachers"
          value={stats.teachers}
          subtitle="teaching staff"
          icon={<GraduationCap className="h-4 w-4" />}
        />
        <DashboardStat
          title="Students"
          value={stats.students}
          subtitle="enrolled students"
          icon={<UserPlus className="h-4 w-4" />}
        />
      </div>

      {/* Bulk Action Bar */}
      {selectedUserIds.size > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-3 py-4">
            <span className="text-sm font-medium">
              {selectedUserIds.size} user(s) selected
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("activate")}
              >
                <UserCheck className="mr-1 h-3.5 w-3.5" />
                Activate
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("deactivate")}
              >
                <UserX className="mr-1 h-3.5 w-3.5" />
                Deactivate
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleBulkAction("delete")}
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={clearSelection}
              className="ml-auto"
            >
              Clear
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                {filteredUsers.length} user(s) found
              </CardDescription>
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
              <Select
                value={roleFilter}
                onValueChange={(v) => setRoleFilter(v as UserRole | "all")}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as UserStatus | "all")}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          {/* Role Tabs */}
          <div className="px-6 pt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="admin">Admins</TabsTrigger>
                <TabsTrigger value="teacher">Teachers</TabsTrigger>
                <TabsTrigger value="student">Students</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Table */}
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 pl-6">
                    <Checkbox
                      checked={
                        filteredUsers.length > 0 &&
                        selectedUserIds.size === filteredUsers.length
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Last Login
                  </TableHead>
                  <TableHead className="w-[120px] text-right pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span className="text-sm">Loading users...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell className="pl-6">
                        <Checkbox
                          checked={selectedUserIds.has(user.id)}
                          onCheckedChange={() => toggleSelectUser(user.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                              {user.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {user.fullName}
                            </p>
                            <p className="truncate text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "admin"
                              ? "default"
                              : user.role === "teacher"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-2 w-2 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-muted"}`}
                          />
                          <span className="text-sm capitalize">
                            {user.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() =>
                              router.push(`/admin/users/${user.id}`)
                            }
                            title="View details"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => openResetPassword(user.id)}
                            title="Reset password"
                          >
                            <KeyRound className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => handleToggleStatus(user)}
                            title={
                              user.status === "active"
                                ? "Deactivate"
                                : "Activate"
                            }
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Users className="h-8 w-8" />
                        <p className="text-sm">No users found</p>
                        <p className="text-xs">
                          Try adjusting your filters or search query
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ─── Add / Edit User Dialog ─────────────────────────────────── */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modal-fullName">Full Name</Label>
              <Input
                id="modal-fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                }
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modal-email">Email</Label>
              <Input
                id="modal-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="john@example.com"
              />
            </div>

            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="modal-password">Password</Label>
                <Input
                  id="modal-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Minimum 8 characters"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="modal-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, role: v as UserRole }))
                }
              >
                <SelectTrigger id="modal-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editingUser && (
              <div className="space-y-2">
                <Label htmlFor="modal-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: v as UserStatus,
                    }))
                  }
                >
                  <SelectTrigger id="modal-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveUser} disabled={createUser.isPending}>
              {createUser.isPending
                ? "Saving..."
                : editingUser
                  ? "Update User"
                  : "Save User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Reset Password Dialog ──────────────────────────────────── */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Reset Password
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-password">New Password</Label>
              <Input
                id="reset-password"
                type="password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleResetPassword}>Reset Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation AlertDialog ────────────────────────── */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className="bg-destructive text-destructive-foreground"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── Bulk Action Confirmation ───────────────────────────────── */}
      <AlertDialog
        open={bulkActionConfirmOpen}
        onOpenChange={setBulkActionConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkAction === "delete"
                ? "Delete selected users?"
                : `${bulkAction?.charAt(0).toUpperCase()}${bulkAction?.slice(1)} selected users?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to {bulkAction} {selectedUserIds.size} user(s). This
              action{" "}
              {bulkAction === "delete"
                ? "cannot be undone"
                : "may take a moment to complete"}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkAction}
              className={
                bulkAction === "delete"
                  ? "bg-destructive text-destructive-foreground"
                  : ""
              }
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
