"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Shield,
  User,
  Calendar,
  Power,
  KeyRound,
  Edit,
  Trash2,
  Activity,
  BookOpen,
  Clock,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";

import { useUser, useActivateUser, useDeactivateUser, useDeleteUser } from "@/lib/hooks/queries/useUsers";
import { useToast } from "@/hooks/use-toast";

// Mock activity data
const mockActivity = [
  { id: 1, action: "Logged in", timestamp: "2026-04-07T10:00:00Z", ip: "192.168.1.1" },
  { id: 2, action: "Updated profile", timestamp: "2026-04-06T14:30:00Z", ip: "192.168.1.1" },
  { id: 3, action: "Created assignment", timestamp: "2026-04-05T09:15:00Z", ip: "192.168.1.2" },
  { id: 4, action: "Graded submission", timestamp: "2026-04-04T16:45:00Z", ip: "192.168.1.2" },
  { id: 5, action: "Logged in", timestamp: "2026-04-03T08:00:00Z", ip: "192.168.1.3" },
];

// Mock class enrollments
const mockClasses = [
  { id: 1, name: "Introduction to Computer Science", code: "CS101", role: "student", enrolledAt: "2025-09-01" },
  { id: 2, name: "Data Structures and Algorithms", code: "CS201", role: "student", enrolledAt: "2025-09-01" },
  { id: 3, name: "Database Management Systems", code: "CS301", role: "student", enrolledAt: "2026-01-15" },
];

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const userId = params.id;

  const { data: user, isLoading } = useUser(userId);
  const activateUserFn = useActivateUser();
  const deactivateUserFn = useDeactivateUser();
  const deleteUserFn = useDeleteUser();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleToggleStatus = () => {
    if (!user) return;
    if (user.status === "active") {
      deactivateUserFn.mutate(userId, {
        onSuccess: () => toast({ title: "User deactivated", description: `${user.fullName} is now inactive.` }),
      });
    } else {
      activateUserFn.mutate(userId, {
        onSuccess: () => toast({ title: "User activated", description: `${user.fullName} is now active.` }),
      });
    }
  };

  const handleDelete = () => {
    deleteUserFn.mutate(userId, {
      onSuccess: () => {
        toast({ title: "User deleted", description: `${user?.fullName} has been removed.` });
        router.push("/admin/users");
      },
    });
  };

  const handleResetPassword = () => {
    if (!newPassword.trim()) {
      toast({ title: "Validation Error", description: "Please enter a new password.", variant: "destructive" });
      return;
    }
    // TODO: Call API to reset password
    toast({ title: "Password reset", description: `${user?.fullName}'s password has been reset.` });
    setShowResetPasswordDialog(false);
    setNewPassword("");
  };

  if (isLoading) {
    return (
      <PageShell>
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </PageShell>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">User not found</h3>
          <Link href="/admin/users">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <Avatar size="lg">
              <AvatarFallback className="text-lg font-semibold">
                {user.fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold">{user.fullName}</h1>
                <StatusBadge status={user.status} />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span>{user.email}</span>
                <span>•</span>
                <Badge variant="secondary">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => router.push(`/admin/users`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" onClick={() => setShowResetPasswordDialog(true)}>
              <KeyRound className="mr-2 h-4 w-4" />
              Reset Password
            </Button>
            <Button
              variant={user.status === "active" ? "destructive" : "default"}
              onClick={handleToggleStatus}
              disabled={activateUserFn.isPending || deactivateUserFn.isPending}
            >
              <Power className="mr-2 h-4 w-4" />
              {user.status === "active" ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Role"
          value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          subtitle="User role"
          icon={<Shield className="h-4 w-4" />}
        />
        <StatCard
          title="Status"
          value={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          subtitle="Account status"
          icon={<Power className="h-4 w-4" />}
        />
        <StatCard
          title="Created"
          value={new Date(user.createdAt).toLocaleDateString()}
          subtitle="Account created"
          icon={<Calendar className="h-4 w-4" />}
        />
        <StatCard
          title="Last Login"
          value={user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
          subtitle="Last activity"
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <SectionCard title="User Information" description="Personal details and account information">
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="font-medium mt-1">{user.fullName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email Address</Label>
                  <p className="font-medium mt-1">{user.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Role</Label>
                  <div className="mt-1">
                    <Badge
                      variant={user.role === "admin" ? "default" : user.role === "teacher" ? "outline" : "secondary"}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Account Status</Label>
                  <div className="mt-1">
                    <StatusBadge status={user.status} />
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created At</Label>
                  <p className="font-medium mt-1">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Login</Label>
                  <p className="font-medium mt-1">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Never"}
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes">
          <SectionCard
            title="Enrolled Classes"
            description={`Classes this user is enrolled in (${mockClasses.length} classes)`}
          >
            {mockClasses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="mx-auto h-8 w-8 mb-2" />
                <p>No classes enrolled</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Enrolled At</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockClasses.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell className="font-medium">{cls.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{cls.code}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              cls.role === "admin"
                                ? "default"
                                : cls.role === "teacher"
                                  ? "outline"
                                  : "secondary"
                            }
                          >
                            {cls.role.charAt(0).toUpperCase() + cls.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(cls.enrolledAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/classes/${cls.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <SectionCard
            title="Recent Activity"
            description={`Recent actions performed by this user (${mockActivity.length} entries)`}
          >
            {mockActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="mx-auto h-8 w-8 mb-2" />
                <p>No activity recorded</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockActivity.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.action}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {activity.ip}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        {/* Danger Zone Tab */}
        <TabsContent value="danger">
          <SectionCard title="Danger Zone" description="Irreversible and destructive actions">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
                <div>
                  <p className="font-semibold">Deactivate Account</p>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable this user's account. They won't be able to log in.
                  </p>
                </div>
                <Button
                  variant={user.status === "active" ? "destructive" : "outline"}
                  onClick={handleToggleStatus}
                  disabled={activateUserFn.isPending || deactivateUserFn.isPending}
                >
                  <Power className="mr-2 h-4 w-4" />
                  {user.status === "active" ? "Deactivate" : "Activate"}
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between rounded-lg border border-destructive p-4">
                <div>
                  <p className="font-semibold text-destructive">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete this user and all associated data. This action cannot be undone.
                  </p>
                </div>
                <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User
                </Button>
              </div>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              for <strong>{user.fullName}</strong> and remove all associated data including
              submissions, grades, and enrollments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Dialog */}
      <Dialog open={showResetPasswordDialog} onOpenChange={setShowResetPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Reset Password
            </DialogTitle>
            <DialogDescription>
              Set a new password for <strong>{user.fullName}</strong>. They will need to use this password for their next login.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
