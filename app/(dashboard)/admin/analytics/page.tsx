"use client";

import { useState } from "react";
import {
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Award,
  Activity,
  Download,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Section Helper ───────────────────────────────────────────────────
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border/60 bg-background p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

// ─── Analytics Link Card ──────────────────────────────────────────────
function AnalyticsLink({
  title,
  description,
  icon: Icon,
  color,
  href,
}: {
  title: string;
  description: string;
  icon: typeof Activity;
  color: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-start gap-3 rounded-lg border border-border/60 bg-background p-4 hover:bg-muted/50 hover:border-border transition-all"
    >
      <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color} text-white`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium group-hover:text-foreground transition-colors">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </a>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────
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
          {trend && (
            trend.positive ? (
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            ) : (
              <TrendingUp className="h-3 w-3 rotate-180 text-red-500" />
            )
          )}
          {trend && (
            <span className={trend.positive ? "text-emerald-500" : "text-red-500"}>
              {trend.value}
            </span>
          )}
          <span>{subtitle}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Quick Analytics Card ─────────────────────────────────────────────
function QuickAnalyticsCard({
  title,
  description,
  metric,
  metricLabel,
  icon: Icon,
  color,
}: {
  title: string;
  description: string;
  metric: string | number;
  metricLabel: string;
  icon: typeof Activity;
  color: string;
}) {
  return (
    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className={`rounded-lg p-2 ${color}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="text-xs">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{metric}</span>
          <span className="text-xs text-muted-foreground">{metricLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Recent Activity Item ─────────────────────────────────────────────
function ActivityItem({
  icon: Icon,
  color,
  title,
  description,
  time,
}: {
  icon: typeof Activity;
  color: string;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
        <p className="text-[11px] text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
}

// ─── Mock Data ────────────────────────────────────────────────────────
const analyticsOverview = {
  totalUsers: 1234,
  totalAssignments: 456,
  totalSubmissions: 3892,
  totalClasses: 48,
  completionRate: 87,
  avgGrade: 82,
  activeStudents: 1102,
  pendingGrading: 87,
};

const recentActivity = [
  { icon: Users, color: "bg-blue-500/10 text-blue-500", title: "New enrollment", description: "25 students added to CS301", time: "2 min ago" },
  { icon: FileText, color: "bg-emerald-500/10 text-emerald-500", title: "Assignment published", description: "Database Design — CS301", time: "15 min ago" },
  { icon: Award, color: "bg-amber-500/10 text-amber-500", title: "Grading completed", description: "28 submissions graded for CS202", time: "1 hour ago" },
  { icon: TrendingUp, color: "bg-purple-500/10 text-purple-500", title: "Performance spike", description: "CS450 avg grade up 5%", time: "3 hours ago" },
  { icon: Activity, color: "bg-cyan-500/10 text-cyan-500", title: "System alert", description: "Submission rate dropped 8%", time: "5 hours ago" },
];

const topPerformers = [
  { rank: 1, name: "Alice Johnson", class: "CS401", grade: 98, trend: "up" as const },
  { rank: 2, name: "Bob Smith", class: "CS202", grade: 96, trend: "up" as const },
  { rank: 3, name: "Charlie Brown", class: "CS301", grade: 94, trend: "stable" as const },
  { rank: 4, name: "Diana Prince", class: "CS450", grade: 93, trend: "up" as const },
  { rank: 5, name: "Eve Wilson", class: "CS201", grade: 91, trend: "down" as const },
];

// ─── Main Page ────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const handleExport = () => {
    const headers = ["Category", "Metric", "Value"];
    const rows = [
      ["Users", "Total", analyticsOverview.totalUsers.toString()],
      ["Users", "Active", analyticsOverview.activeStudents.toString()],
      ["Assignments", "Total", analyticsOverview.totalAssignments.toString()],
      ["Submissions", "Total", analyticsOverview.totalSubmissions.toString()],
      ["Classes", "Total", analyticsOverview.totalClasses.toString()],
      ["Completion", "Rate", `${analyticsOverview.completionRate}%`],
      ["Grades", "Average", `${analyticsOverview.avgGrade}%`],
      ["Grading", "Pending", analyticsOverview.pendingGrading.toString()],
    ];
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-overview-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Overview</h1>
          <p className="text-sm text-muted-foreground">
            Platform-wide analytics, performance metrics, and activity insights.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          title="Total Users"
          value={analyticsOverview.totalUsers.toLocaleString()}
          subtitle={`${analyticsOverview.activeStudents} active`}
          icon={<Users className="h-4 w-4" />}
          trend={{ value: "+12.5%", positive: true }}
        />
        <DashboardStat
          title="Total Assignments"
          value={analyticsOverview.totalAssignments}
          subtitle="this semester"
          icon={<FileText className="h-4 w-4" />}
          trend={{ value: "+8.2%", positive: true }}
        />
        <DashboardStat
          title="Completion Rate"
          value={`${analyticsOverview.completionRate}%`}
          subtitle="on-time submissions"
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: "+3.1%", positive: true }}
        />
        <DashboardStat
          title="Pending Grading"
          value={analyticsOverview.pendingGrading}
          subtitle="awaiting review"
          icon={<Award className="h-4 w-4" />}
          trend={{ value: "-4.1%", positive: true }}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-6">
        <TabsList className="w-fit">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* ── Overview Tab ─────────────────────────────────────── */}
        <TabsContent value="overview" className="flex flex-col gap-6">
          {/* Quick Analytics Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickAnalyticsCard
              title="Active Students"
              description="Currently enrolled"
              metric={analyticsOverview.activeStudents.toLocaleString()}
              metricLabel="students"
              icon={Users}
              color="bg-blue-50 dark:bg-blue-950/30 text-blue-500"
            />
            <QuickAnalyticsCard
              title="Total Classes"
              description="Active courses"
              metric={analyticsOverview.totalClasses}
              metricLabel="classes"
              icon={FileText}
              color="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500"
            />
            <QuickAnalyticsCard
              title="Avg Grade"
              description="Across all classes"
              metric={`${analyticsOverview.avgGrade}%`}
              metricLabel="average"
              icon={Award}
              color="bg-amber-50 dark:bg-amber-950/30 text-amber-500"
            />
            <QuickAnalyticsCard
              title="Total Submissions"
              description="All time"
              metric={analyticsOverview.totalSubmissions.toLocaleString()}
              metricLabel="submissions"
              icon={TrendingUp}
              color="bg-purple-50 dark:bg-purple-950/30 text-purple-500"
            />
          </div>

          {/* Activity Feed + Top Performers */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Activity Feed */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform events.</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <div className="flex flex-col gap-4">
                  {recentActivity.map((item, i) => (
                    <ActivityItem key={i} {...item} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Students with highest grades across all classes.</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {topPerformers.map((p) => (
                    <div
                      key={p.rank}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                          p.rank === 1 ? "bg-amber-500/10 text-amber-500" :
                          p.rank === 2 ? "bg-slate-500/10 text-slate-500" :
                          p.rank === 3 ? "bg-orange-500/10 text-orange-500" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {p.rank}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.class}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={p.grade >= 95 ? "default" : p.grade >= 90 ? "secondary" : "outline"}>
                          {p.grade}%
                        </Badge>
                        {p.trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                        {p.trend === "down" && <TrendingUp className="h-3 w-3 rotate-180 text-red-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Components Links */}
          <Section title="Detailed Analytics" description="Deep-dive into specific analytics categories">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnalyticsLink
                title="User Analytics"
                description="User growth, engagement, and retention metrics."
                icon={Users}
                color="bg-blue-500"
                href="/admin/analytics?tab=users"
              />
              <AnalyticsLink
                title="Assignment Analytics"
                description="Submission rates, completion trends, and grading stats."
                icon={FileText}
                color="bg-emerald-500"
                href="/admin/analytics?tab=assignments"
              />
              <AnalyticsLink
                title="Class Analytics"
                description="Per-class performance and enrollment data."
                icon={BarChart3}
                color="bg-purple-500"
                href="/admin/analytics?tab=classes"
              />
              <AnalyticsLink
                title="Course Analytics"
                description="Course-level metrics and curriculum insights."
                icon={Activity}
                color="bg-amber-500"
                href="/admin/analytics?tab=courses"
              />
              <AnalyticsLink
                title="Engagement Metrics"
                description="Platform engagement and interaction patterns."
                icon={TrendingUp}
                color="bg-cyan-500"
                href="/admin/analytics?tab=engagement"
              />
              <AnalyticsLink
                title="Performance Metrics"
                description="System performance and response times."
                icon={Award}
                color="bg-rose-500"
                href="/admin/analytics?tab=performance"
              />
            </div>
          </Section>
        </TabsContent>

        {/* ── Users Tab ────────────────────────────────────────── */}
        <TabsContent value="users" className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardStat
              title="Total Users"
              value={analyticsOverview.totalUsers.toLocaleString()}
              subtitle="all roles"
              icon={<Users className="h-4 w-4" />}
            />
            <DashboardStat
              title="Active Students"
              value={analyticsOverview.activeStudents.toLocaleString()}
              subtitle="enrolled this term"
              icon={<Users className="h-4 w-4" />}
              trend={{ value: "+5.2%", positive: true }}
            />
            <DashboardStat
              title="New This Month"
              value="48"
              subtitle="new registrations"
              icon={<Users className="h-4 w-4" />}
              trend={{ value: "+12.0%", positive: true }}
            />
            <DashboardStat
              title="Retention Rate"
              value="94%"
              subtitle="monthly retention"
              icon={<TrendingUp className="h-4 w-4" />}
              trend={{ value: "+1.5%", positive: true }}
            />
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Monthly user registration and active user trends.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-9 w-64"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-sm font-medium">User Analytics Component</p>
                  <p className="text-xs mt-1">Connect to analytics backend for live data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Assignments Tab ──────────────────────────────────── */}
        <TabsContent value="assignments" className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardStat
              title="Total Assignments"
              value={analyticsOverview.totalAssignments}
              subtitle="all classes"
              icon={<FileText className="h-4 w-4" />}
            />
            <DashboardStat
              title="Published"
              value="312"
              subtitle="currently active"
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <DashboardStat
              title="Avg Completion"
              value={`${analyticsOverview.completionRate}%`}
              subtitle="on-time rate"
              icon={<Award className="h-4 w-4" />}
              trend={{ value: "+2.3%", positive: true }}
            />
            <DashboardStat
              title="Avg Grade"
              value={`${analyticsOverview.avgGrade}%`}
              subtitle="all submissions"
              icon={<Award className="h-4 w-4" />}
              trend={{ value: "+1.8%", positive: true }}
            />
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Assignment Analytics</CardTitle>
                  <CardDescription>Detailed breakdown of assignment performance.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search assignments..." className="pl-9 w-64" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="cs301">CS301</SelectItem>
                      <SelectItem value="cs202">CS202</SelectItem>
                      <SelectItem value="cs450">CS450</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-sm font-medium">Assignment Analytics Component</p>
                  <p className="text-xs mt-1">Connect to analytics backend for live data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Performance Tab ──────────────────────────────────── */}
        <TabsContent value="performance" className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardStat
              title="System Uptime"
              value="99.9%"
              subtitle="last 30 days"
              icon={<Activity className="h-4 w-4" />}
              trend={{ value: "stable", positive: true }}
            />
            <DashboardStat
              title="Avg Response"
              value="142ms"
              subtitle="API response time"
              icon={<TrendingUp className="h-4 w-4" />}
              trend={{ value: "-8ms", positive: true }}
            />
            <DashboardStat
              title="Error Rate"
              value="0.3%"
              subtitle="failed requests"
              icon={<Award className="h-4 w-4" />}
              trend={{ value: "-0.1%", positive: true }}
            />
            <DashboardStat
              title="Peak Usage"
              value="847"
              subtitle="concurrent users"
              icon={<Users className="h-4 w-4" />}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>System performance, resource usage, and reliability metrics.</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <div className="text-center">
                  <Activity className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-sm font-medium">Performance Metrics Component</p>
                  <p className="text-xs mt-1">Connect to monitoring backend for live data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
