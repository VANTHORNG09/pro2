// app/(dashboard)/profile/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
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

type DeviceType = "desktop" | "mobile";

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

export default function ProfilePage() {
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

  const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User";

  // Avatar upload handler
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file.", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Image must be under 5MB.", variant: "destructive" });
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
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) newErrors.email = "Invalid email format.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate password form
  const validatePassword = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!passwordForm.currentPassword) newErrors.currentPassword = "Current password is required.";
    if (passwordForm.newPassword.length < 6) newErrors.newPassword = "At least 6 characters.";
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
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsSaving(true);
    // TODO: API call — await api.updatePassword(passwordForm)
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    toast({ title: "Password updated", description: "Your password has been changed successfully." });
  };

  // Revoke session
  const handleRevokeSession = (id: string) => {
    toast({ title: "Session revoked", description: "The session has been terminated." });
  };

  // Notification toggle handler
  const toggleNotification = (key: keyof Notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    const label = key.replace(/([A-Z])/g, " $1").trim();
    toast({ title: `${label}`, description: `Notifications ${notifications[key] ? "disabled" : "enabled"}.` });
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ============ LEFT: Avatar & Overview ============ */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
            <CardDescription>Your basic account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Avatar */}
            <div className="relative mx-auto flex flex-col items-center gap-3 text-center">
              <div className="group relative">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Avatar"
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-full object-cover ring-2 ring-primary/20"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary ring-2 ring-primary/20">
                    <UserCircle className="h-14 w-14" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110"
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
                <Mail className="h-4 w-4 text-primary" />
                <span className="truncate">{user?.email ?? "—"}</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Shield className="h-4 w-4 text-primary" />
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

        {/* ============ RIGHT: Forms & Settings ============ */}
        <div className="space-y-6 lg:col-span-2">
          {/* ---------- Personal Information ---------- */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your account details.</CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
                    className={errors.fullName ? "border-destructive" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-destructive">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>

                {/* Bio */}
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Role (read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
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

          {/* ---------- Change Password ---------- */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Keep your account secure by updating your password.</CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordUpdate}>
              <CardContent className="grid gap-4">
                {/* Current */}
                <PasswordField
                  id="currentPassword"
                  label="Current Password"
                  value={passwordForm.currentPassword}
                  onChange={(v) => setPasswordForm((p) => ({ ...p, currentPassword: v }))}
                  error={errors.currentPassword}
                />
                {/* New */}
                <PasswordField
                  id="newPassword"
                  label="New Password"
                  value={passwordForm.newPassword}
                  onChange={(v) => setPasswordForm((p) => ({ ...p, newPassword: v }))}
                  error={errors.newPassword}
                />
                {/* Confirm */}
                <PasswordField
                  id="confirmPassword"
                  label="Confirm New Password"
                  value={passwordForm.confirmPassword}
                  onChange={(v) => setPasswordForm((p) => ({ ...p, confirmPassword: v }))}
                  error={errors.confirmPassword}
                />

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>

          {/* ---------- Preferences ---------- */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your experience.</CardDescription>
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
                  <Bell className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold">Notifications</p>
                </div>
                <div className="space-y-3">
                  {(Object.entries(notifications) as [keyof Notifications, boolean][]).map(
                    ([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <p className="text-sm capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
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

              {/* Security */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold">Security</p>
                </div>
                <div className="space-y-3">
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
                </div>
              </div>

              <Separator />

              {/* Language (static) */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Language</p>
                    <p className="text-xs text-muted-foreground">English (US)</p>
                  </div>
                </div>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>

          {/* ---------- Active Sessions ---------- */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Manage your recent login sessions.</CardDescription>
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

          {/* ---------- Danger Zone ---------- */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions. Please proceed with caution.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Delete Account</p>
                <p className="text-xs text-muted-foreground">
                  Once deleted, your account cannot be recovered.
                </p>
              </div>
              <Button variant="destructive" disabled>
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
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
      <Label htmlFor={id}>{label}</Label>
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
