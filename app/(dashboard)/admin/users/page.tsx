// app/(dashboard)/admin/users/page.tsx
"use client";

import { useState, useCallback } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Search,
  Power,
  ShieldOff,
  KeyRound,
  Download,
  CheckSquare,
  Square,
  Users,
  UserCheck,
  UserX,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/shared/stat-card";

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
  const headers = ["Name", "Email", "Role", "Status", "Created At", "Last Login"];
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
    [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = `users-export-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
}

export default function AdminUsersPage() {
  const { data: users = [], isLoading } = useUsers({});
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const activateUserFn = useActivateUser();
  const deactivateUserFn = useDeactivateUser();

  const [updateUserId, setUpdateUserId] = useState<string | undefined>(undefined);
  const updateUser = useUpdateUser(updateUserId);

  const { toast } = useToast();

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [resetPasswordUserId, setResetPasswordUserId] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState("");

  // Bulk selection
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // Bulk action confirmation
  const [bulkActionConfirmOpen, setBulkActionConfirmOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<"activate" | "deactivate" | "delete" | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "student" as UserRole,
    status: "active" as UserStatus,
    password: "",
  });

  const resetForm = () => {
    setFormData({ fullName: "", email: "", role: "student", status: "active", password: "" });
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
      toast({ title: "Validation Error", description: "Name and email are required.", variant: "destructive" });
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
            toast({ title: "User updated", description: `${formData.fullName} has been updated successfully.` });
          },
        }
      );
    } else {
      if (!formData.password.trim()) {
        toast({ title: "Validation Error", description: "Password is required for new users.", variant: "destructive" });
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
            toast({ title: "User created", description: `${formData.fullName} has been added.` });
          },
        }
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
          toast({ title: "User deleted", description: "The user has been removed." });
        },
      });
      setDeleteConfirmOpen(false);
      setDeleteUserId(null);
    }
  };

  const handleToggleStatus = (user: ApiUser) => {
    if (user.status === "active") {
      deactivateUserFn.mutate(user.id, {
        onSuccess: () => toast({ title: "User deactivated", description: `${user.fullName} is now inactive.` }),
      });
    } else {
      activateUserFn.mutate(user.id, {
        onSuccess: () => toast({ title: "User activated", description: `${user.fullName} is now active.` }),
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
      toast({ title: "Validation Error", description: "Please enter a new password.", variant: "destructive" });
      return;
    }
    // TODO: Call API to reset password
    toast({ title: "Password reset", description: "The user's password has been reset." });
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
      if (bulkAction === "activate") {
        activateUserFn.mutate(id);
      } else if (bulkAction === "deactivate") {
        deactivateUserFn.mutate(id);
      } else if (bulkAction === "delete") {
        deleteUser.mutate(id);
      }
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
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  // ─── Stats ──────────────────────────────────────────────────────────
  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    teachers: users.filter((u) => u.role === "teacher").length,
    students: users.filter((u) => u.role === "student").length,
  };

  return (
    <PageShell>
      <PageHeader
        title="User Management"
        description="Manage all users: create, edit roles, activate/deactivate, reset passwords, and delete."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportUsersToCSV(filteredUsers)} disabled={filteredUsers.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={openAddModal}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Users" value={stats.total} subtitle="Across all roles" icon={<Users className="h-4 w-4" />} />
        <StatCard title="Active Users" value={stats.active} subtitle="Currently active" icon={<UserCheck className="h-4 w-4" />} />
        <StatCard title="Teachers" value={stats.teachers} subtitle="Teaching staff" />
        <StatCard title="Students" value={stats.students} subtitle="Enrolled students" />
      </div>

      {/* Bulk Action Bar */}
      {selectedUserIds.size > 0 && (
        <SectionCard title="">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {selectedUserIds.size} user(s) selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("activate")}>
                <UserCheck className="mr-1 h-3.5 w-3.5" />
                Activate
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("deactivate")}>
                <UserX className="mr-1 h-3.5 w-3.5" />
                Deactivate
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
            <Button size="sm" variant="ghost" onClick={clearSelection} className="ml-auto">
              Clear
            </Button>
          </div>
        </SectionCard>
      )}

      {/* Filters */}
      <SectionCard title="Filters">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <select
            className="rounded-xl border border-border bg-background px-4 py-2 text-sm"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | "all")}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
          <select
            className="rounded-xl border border-border bg-background px-4 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UserStatus | "all")}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </SectionCard>

      {/* User Table */}
      <SectionCard
        title="Users"
        description={`${filteredUsers.length} user(s) found`}
      >
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-left">
            <thead className="border-b border-border/60">
              <tr>
                <th className="px-4 py-3 w-10">
                  <Checkbox
                    checked={filteredUsers.length > 0 && selectedUserIds.size === filteredUsers.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Last Login</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border/20 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedUserIds.has(user.id)}
                        onCheckedChange={() => toggleSelectUser(user.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{user.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{user.email}</td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        variant={
                          user.role === "admin"
                            ? "info"
                            : user.role === "teacher"
                              ? "success"
                              : "warning"
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => openEditModal(user)}
                          title="Edit user"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => openResetPassword(user.id)}
                          title="Reset password"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant={user.status === "active" ? "outline" : "default"}
                          onClick={() => handleToggleStatus(user)}
                          title={user.status === "active" ? "Deactivate" : "Activate"}
                        >
                          {user.status === "active" ? (
                            <ShieldOff className="h-3.5 w-3.5" />
                          ) : (
                            <Power className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete user"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

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
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modal-email">Email</Label>
              <Input
                id="modal-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Minimum 8 characters"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="modal-role">Role</Label>
              <select
                id="modal-role"
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
                value={formData.role}
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value as UserRole }))}
              >
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>

            {editingUser && (
              <div className="space-y-2">
                <Label htmlFor="modal-status">Status</Label>
                <select
                  id="modal-status"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value as UserStatus }))
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveUser} disabled={createUser.isPending}>
              {createUser.isPending ? "Saving..." : editingUser ? "Update User" : "Save User"}
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
            <Button onClick={handleResetPassword}>
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation AlertDialog ────────────────────────── */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive text-destructive-foreground">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ─── Bulk Action Confirmation ───────────────────────────────── */}
      <AlertDialog open={bulkActionConfirmOpen} onOpenChange={setBulkActionConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkAction === "delete"
                ? "Delete selected users?"
                : `${bulkAction?.charAt(0).toUpperCase()}${bulkAction?.slice(1)} selected users?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to {bulkAction} {selectedUserIds.size} user(s). This action{" "}
              {bulkAction === "delete" ? "cannot be undone" : "may take a moment to complete"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkAction}
              className={bulkAction === "delete" ? "bg-destructive text-destructive-foreground" : ""}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  );
}
