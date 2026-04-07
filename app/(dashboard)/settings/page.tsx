// app/(dashboard)/settings/page.tsx
"use client";

import { useState } from "react";
import {
  Moon,
  Sun,
  Bell,
  Shield,
  Globe,
  Monitor,
  Loader2,
  Check,
  UserCircle,
  Palette,
} from "lucide-react";
import { useTheme } from "next-themes";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";

interface NotificationSettings {
  emailNotifications: boolean;
  assignmentReminders: boolean;
  submissionAlerts: boolean;
  systemUpdates: boolean;
  gradingAlerts: boolean;
}

interface PrivacySettings {
  profileVisibility: boolean;
  showEmail: boolean;
  showGrade: boolean;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    assignmentReminders: true,
    submissionAlerts: true,
    systemUpdates: false,
    gradingAlerts: true,
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: true,
    showEmail: false,
    showGrade: false,
  });

  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: API call — await api.updateSettings({...})
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
  };

  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePrivacy = (key: keyof PrivacySettings) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <PageShell>
      <PageHeader
        title="Settings"
        description="Customize your AssignBridge experience, notifications, and privacy preferences."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Quick Settings */}
        <div className="space-y-6 lg:col-span-1">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize how AssignBridge looks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Theme Selector */}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <Moon className="h-5 w-5 text-amber-400" />
                  ) : (
                    <Sun className="h-5 w-5 text-blue-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium">Theme</p>
                    <p className="text-xs text-muted-foreground capitalize">{theme ?? "system"} mode</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("system")}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Font Size */}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Font Size</p>
                  <p className="text-xs text-muted-foreground">Default text size</p>
                </div>
                <Badge variant="secondary">Default</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language & Region
              </CardTitle>
              <CardDescription>Set your preferred language and timezone.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">English (US)</option>
                  <option value="en-uk">English (UK)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="UTC">UTC</option>
                  <option value="IST">IST (India Standard Time)</option>
                  <option value="EST">EST (Eastern)</option>
                  <option value="PST">PST (Pacific)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Detailed Settings */}
        <div className="space-y-6 lg:col-span-2">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Choose what notifications you receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(Object.entries(notifications) as [keyof NotificationSettings, boolean][]).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {key === "emailNotifications" && "Receive notifications via email"}
                      {key === "assignmentReminders" && "Reminders about upcoming assignment deadlines"}
                      {key === "submissionAlerts" && "Alerts when your submissions are reviewed"}
                      {key === "systemUpdates" && "Updates about system maintenance and new features"}
                      {key === "gradingAlerts" && "Notifications when new grades are posted"}
                    </p>
                  </div>
                  <Switch checked={value} onCheckedChange={() => toggleNotification(key)} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy
              </CardTitle>
              <CardDescription>Control who can see your information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(Object.entries(privacy) as [keyof PrivacySettings, boolean][]).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {key === "profileVisibility" && "Allow others to see your profile"}
                      {key === "showEmail" && "Display your email on your public profile"}
                      {key === "showGrade" && "Show your grades on the class leaderboard"}
                    </p>
                  </div>
                  <Switch checked={value} onCheckedChange={() => togglePrivacy(key)} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Account */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Account
              </CardTitle>
              <CardDescription>Manage your account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium">Email Address</p>
                <p className="text-sm text-muted-foreground">{user?.email ?? "—"}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium">Role</p>
                <p className="text-sm capitalize text-muted-foreground">{user?.role ?? "—"}</p>
              </div>
              <Button variant="outline" className="w-full">Change Password</Button>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
