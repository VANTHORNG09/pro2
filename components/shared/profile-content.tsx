"use client";

import { useState, useRef } from "react";
import {
  Mail,
  Shield,
  UserCircle,
  Moon,
  Sun,
  Bell,
  Globe,
  Eye,
  EyeOff,
  Camera,
  Laptop,
  Smartphone,
  MapPin,
  Clock,
  Check,
  X,
  Loader2,
  AlertTriangle,
  Pencil,
  KeyRound,
  Settings,
  Monitor,
  Trash2,
} from "lucide-react";
import { useTheme } from "next-themes";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// ============ Types ============
interface ProfileForm {
  fullName: string;
  email: string;
  bio: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Notifications {
  emailNotifications: boolean;
  assignmentReminders: boolean;
  submissionAlerts: boolean;
  systemUpdates: boolean;
  gradingAlerts: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
}

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

// ============ Static Data ============
const sessions: ActiveSession[] = [
  {
    id: "1",
    device: "desktop",
    browser: "Chrome on Windows",
    location: "Mumbai, India",
    lastActive: "Active now",
    isCurrent: true,
  },
  {
    id: "2",
    device: "mobile",
    browser: "Safari on iPhone",
    location: "Delhi, India",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
  {
    id: "3",
    device: "desktop",
    browser: "Firefox on macOS",
    location: "Bangalore, India",
    lastActive: "3 days ago",
    isCurrent: false,
  },
];

export function ProfileContent() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    fullName: user?.name ?? "",
    email: user?.email ?? "",
    bio: "Passionate educator using AssignBridge to streamline assignments.",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState<Notifications>({
    emailNotifications: true,
    assignmentReminders: true,
    submissionAlerts: true,
    systemUpdates: false,
    gradingAlerts: true,
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginAlerts: true,
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dialog state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "User";

  const initials = profileForm.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Avatar upload handler
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be under 5MB.",
        variant: "destructive",
      });
      return;
    }

    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    toast({ title: "Avatar updated", description: "Your profile picture has been changed." });
  };

  // Validate profile form
  const validateProfile = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!profileForm.fullName.trim()) newErrors.fullName = "Name is required.";
    if (!profileForm.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email))
      newErrors.email = "Invalid email format.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate password form
  const validatePassword = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!passwordForm.currentPassword)
      newErrors.currentPassword = "Current password is required.";
    if (passwordForm.newPassword.length < 6)
      newErrors.newPassword = "At least 6 characters.";
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setIsSaving(true);
    // TODO: API call — await api.updateProfile(profileForm)
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    toast({
      title: "Profile updated",
      description: "Your account information has been saved.",
    });
  };

  // Handle password update
  const handlePasswordUpdate = async () => {
    if (!validatePassword()) return;

    setIsSaving(true);
    // TODO: API call — await api.updatePassword(passwordForm)
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setErrors({});
    setPasswordDialogOpen(false);
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
  };

  // Revoke session
  const handleRevokeSession = (id: string) => {
    toast({
      title: "Session revoked",
      description: "The session has been terminated.",
    });
  };

  // Notification toggle handler
  const toggleNotification = (key: keyof Notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    const label = key.replace(/([A-Z])/g, " $1").trim();
    toast({
      title: `${label}`,
      description: `Notifications ${notifications[key] ? "disabled" : "enabled"}.`,
    });
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;

    // TODO: API call — await api.deleteAccount()
    await new Promise((r) => setTimeout(r, 1000));
    setDeleteDialogOpen(false);
    toast({
      title: "Account deleted",
      description: "Your account has been permanently deleted.",
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information, account settings, and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="profile" className="gap-2">
            <Pencil className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <KeyRound className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="gap-2">
            <Monitor className="h-4 w-4" />
            <span className="hidden sm:inline">Sessions</span>
          </TabsTrigger>
        </TabsList>

        {/* ============ PROFILE TAB ============ */}
        <TabsContent value="profile">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: Avatar & Overview */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Profile Overview</CardTitle>
                <CardDescription className="text-sm">
                  Your basic account information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Avatar */}
                <div className="relative mx-auto flex flex-col items-center gap-3 text-center">
                  <div className="group relative">
                    <Avatar size="lg" className="h-24 w-24">
                      <AvatarImage src={avatarUrl ?? undefined} alt={profileForm.fullName} />
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                        {initials || <UserCircle className="h-10 w-10" />}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background shadow-md transition-transform hover:scale-110"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{user?.name ?? "User"}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{roleLabel}</p>
                  </div>
                </div>

                <Separator />

                {/* Contact Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate text-sm">{user?.email ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <StatusBadge
                      label={roleLabel}
                      variant={
                        user?.role === "admin"
                          ? "info"
                          : user?.role === "teacher"
                            ? "success"
                            : "warning"
                      }
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-medium text-muted-foreground">Bio</p>
                  <p className="mt-1 text-sm">{profileForm.bio}</p>
                </div>
              </CardContent>
            </Card>

            {/* Right: Personal Information Form */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Personal Information</CardTitle>
                <CardDescription className="text-sm">
                  Update your account details.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleProfileUpdate}>
                <CardContent className="grid gap-5 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      value={profileForm.fullName}
                      onChange={(e) =>
                        setProfileForm((p) => ({ ...p, fullName: e.target.value }))
                      }
                      className={errors.fullName ? "border-destructive" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-destructive">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm((p) => ({ ...p, email: e.target.value }))
                      }
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) =>
                        setProfileForm((p) => ({ ...p, bio: e.target.value }))
                      }
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>

                  {/* Role (read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">
                      Role
                    </Label>
                    <Input id="role" defaultValue={roleLabel} disabled />
                  </div>

                  {/* Submit */}
                  <div className="sm:col-span-2 flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          </div>
        </TabsContent>

        {/* ============ SECURITY TAB ============ */}
        <TabsContent value="security" className="space-y-6">
          {/* Change Password */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Change Password</CardTitle>
              <CardDescription className="text-sm">
                Keep your account secure by updating your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <KeyRound className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and choose a new one.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <PasswordField
                      id="currentPassword"
                      label="Current Password"
                      value={passwordForm.currentPassword}
                      onChange={(v) =>
                        setPasswordForm((p) => ({ ...p, currentPassword: v }))
                      }
                      error={errors.currentPassword}
                    />
                    <PasswordField
                      id="newPassword"
                      label="New Password"
                      value={passwordForm.newPassword}
                      onChange={(v) =>
                        setPasswordForm((p) => ({ ...p, newPassword: v }))
                      }
                      error={errors.newPassword}
                    />
                    <PasswordField
                      id="confirmPassword"
                      label="Confirm New Password"
                      value={passwordForm.confirmPassword}
                      onChange={(v) =>
                        setPasswordForm((p) => ({ ...p, confirmPassword: v }))
                      }
                      error={errors.confirmPassword}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handlePasswordUpdate} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-sm">
                Manage your account security preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 2FA */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Enable 2FA</p>
                  <p className="text-xs text-muted-foreground">
                    Protect your account with two-factor authentication
                  </p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorEnabled}
                  onCheckedChange={(checked: boolean) =>
                    setSecuritySettings((p) => ({ ...p, twoFactorEnabled: checked }))
                  }
                />
              </div>
              <Separator />
              {/* Login Alerts */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Login Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Get notified when someone logs into your account
                  </p>
                </div>
                <Switch
                  checked={securitySettings.loginAlerts}
                  onCheckedChange={(checked: boolean) =>
                    setSecuritySettings((p) => ({ ...p, loginAlerts: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-sm">
                Irreversible actions. Please proceed with caution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      Delete Account
                    </DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. All your data will be permanently
                      deleted.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p className="text-sm">
                      Type <strong>DELETE</strong> to confirm:
                    </p>
                    <Input
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type DELETE here"
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmText !== "DELETE"}
                    >
                      Permanently Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ PREFERENCES TAB ============ */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Preferences</CardTitle>
              <CardDescription className="text-sm">
                Customize your experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Theme */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <Moon className="h-5 w-5 text-amber-400" />
                  ) : (
                    <Sun className="h-5 w-5 text-blue-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium">Theme</p>
                    <p className="text-xs text-muted-foreground">
                      Currently using {theme === "dark" ? "dark" : "light"} mode
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  Switch to {theme === "dark" ? "Light" : "Dark"}
                </Button>
              </div>

              <Separator />

              {/* Notifications */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-semibold">Notifications</p>
                </div>
                <div className="space-y-3">
                  {(Object.entries(notifications) as [keyof Notifications, boolean][]).map(
                    ([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={() => toggleNotification(key)}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>

              <Separator />

              {/* Language (static) */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Language</p>
                    <p className="text-xs text-muted-foreground">English (US)</p>
                  </div>
                </div>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ SESSIONS TAB ============ */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Active Sessions</CardTitle>
              <CardDescription className="text-sm">
                Manage your recent login sessions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-start gap-3">
                    {session.device === "mobile" ? (
                      <Smartphone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Laptop className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{session.browser}</p>
                        {session.isCurrent && (
                          <Badge
                            variant="default"
                            className="h-5 px-1.5 text-[10px] font-medium"
                          >
                            <Check className="mr-0.5 h-3 w-3" />
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {session.lastActive}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeSession(session.id)}
                    >
                      <X className="mr-1 h-3.5 w-3.5" />
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============ Reusable Password Field ============
function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={error ? "border-destructive" : ""}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => setShow((v) => !v)}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
