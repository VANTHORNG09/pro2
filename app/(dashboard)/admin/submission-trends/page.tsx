"use client";

import * as React from "react";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Users,
  FileText,
  Download,
  Search,
  Filter,
  BarChart3,
  LineChart,
  Activity,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// --- Types ---

interface SubmissionTrend {
  date: string;
  totalSubmissions: number;
  onTime: number;
  late: number;
  averageGrade?: number;
  peakHour?: number;
}

interface ClassSubmissionStats {
  class: string;
  totalSubmissions: number;
  submissionRate: number;
  avgGrade: number;
  trend: "up" | "down" | "stable";
}

// --- Mock Data ---

const submissionTrends: SubmissionTrend[] = [
  { date: "2026-04-01", totalSubmissions: 45, onTime: 42, late: 3, averageGrade: 85, peakHour: 14 },
  { date: "2026-04-02", totalSubmissions: 38, onTime: 35, late: 3, averageGrade: 82, peakHour: 16 },
  { date: "2026-04-03", totalSubmissions: 52, onTime: 49, late: 3, averageGrade: 87, peakHour: 13 },
  { date: "2026-04-04", totalSubmissions: 29, onTime: 26, late: 3, averageGrade: 79, peakHour: 15 },
  { date: "2026-04-05", totalSubmissions: 67, onTime: 63, late: 4, averageGrade: 88, peakHour: 17 },
  { date: "2026-04-06", totalSubmissions: 41, onTime: 38, late: 3, averageGrade: 84, peakHour: 14 },
  { date: "2026-04-07", totalSubmissions: 55, onTime: 51, late: 4, averageGrade: 86, peakHour: 16 },
  { date: "2026-04-08", totalSubmissions: 33, onTime: 31, late: 2, averageGrade: 81, peakHour: 15 },
  { date: "2026-04-09", totalSubmissions: 48, onTime: 45, late: 3, averageGrade: 83, peakHour: 13 },
  { date: "2026-04-10", totalSubmissions: 61, onTime: 57, late: 4, averageGrade: 85, peakHour: 14 },
];

const classStats: ClassSubmissionStats[] = [
  { class: "CS-301", totalSubmissions: 234, submissionRate: 92, avgGrade: 87, trend: "up" },
  { class: "CS-202", totalSubmissions: 198, submissionRate: 89, avgGrade: 84, trend: "stable" },
  { class: "CS-401", totalSubmissions: 167, submissionRate: 95, avgGrade: 91, trend: "up" },
  { class: "CS-450", totalSubmissions: 145, submissionRate: 87, avgGrade: 82, trend: "down" },
  { class: "MATH-101", totalSubmissions: 312, submissionRate: 94, avgGrade: 78, trend: "stable" },
];

const hourlyPatterns = [
  { hour: "9:00", submissions: 12 },
  { hour: "10:00", submissions: 18 },
  { hour: "11:00", submissions: 25 },
  { hour: "12:00", submissions: 8 },
  { hour: "13:00", submissions: 15 },
  { hour: "14:00", submissions: 32 },
  { hour: "15:00", submissions: 28 },
  { hour: "16:00", submissions: 35 },
  { hour: "17:00", submissions: 22 },
  { hour: "18:00", submissions: 12 },
  { hour: "19:00", submissions: 5 },
  { hour: "20:00", submissions: 3 },
];

// --- Components ---

function TrendCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "stable";
  icon: typeof TrendingUp;
  color: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`rounded-lg p-2 ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center gap-1 text-xs">
            {changeType === "up" ? (
              <TrendingUp className="h-3 w-3 text-emerald-500" />
            ) : changeType === "down" ? (
              <TrendingDown className="h-3 w-3 text-red-500" />
            ) : changeType === "stable" ? (
              <Activity className="h-3 w-3 text-muted-foreground" />
            ) : null}
            <span className={changeType === "up" ? "text-emerald-500" : changeType === "down" ? "text-red-500" : "text-muted-foreground"}>
              {change}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// --- Main Page ---

export default function SubmissionTrendsPage() {
  const [timeRange, setTimeRange] = React.useState("7d");
  const [classFilter, setClassFilter] = React.useState("all");

  const totalSubmissions = submissionTrends.reduce((sum, day) => sum + day.totalSubmissions, 0);
  const totalOnTime = submissionTrends.reduce((sum, day) => sum + day.onTime, 0);
  const totalLate = submissionTrends.reduce((sum, day) => sum + day.late, 0);
  const onTimeRate = Math.round((totalOnTime / totalSubmissions) * 100);
  const avgSubmissionsPerDay = Math.round(totalSubmissions / submissionTrends.length);

  const recentTrend = submissionTrends.slice(-2);
  const trendChange = recentTrend[1] ? recentTrend[1].totalSubmissions - recentTrend[0].totalSubmissions : 0;
  const trendDirection = trendChange > 0 ? "up" : trendChange < 0 ? "down" : "stable";

  const handleExport = () => {
    const headers = ["Date", "Total Submissions", "On Time", "Late", "Average Grade", "Peak Hour"];
    const rows = submissionTrends.map(trend => [
      trend.date,
      trend.totalSubmissions.toString(),
      trend.onTime.toString(),
      trend.late.toString(),
      trend.averageGrade?.toString() || "",
      trend.peakHour?.toString() || ""
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `submission-trends-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Submission Trends</h1>
          <p className="text-sm text-muted-foreground">
            Analyze submission patterns, timeliness, and performance trends over time.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TrendCard
          title="Total Submissions"
          value={totalSubmissions}
          change={`${trendChange > 0 ? "+" : ""}${trendChange} from yesterday`}
          changeType={trendDirection}
          icon={FileText}
          color="bg-blue-50 dark:bg-blue-950/30 text-blue-500"
        />
        <TrendCard
          title="On-Time Rate"
          value={`${onTimeRate}%`}
          change="+2.1% from last week"
          changeType="up"
          icon={Clock}
          color="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500"
        />
        <TrendCard
          title="Daily Average"
          value={avgSubmissionsPerDay}
          change="+8.3% from last month"
          changeType="up"
          icon={TrendingUp}
          color="bg-purple-50 dark:bg-purple-950/30 text-purple-500"
        />
        <TrendCard
          title="Late Submissions"
          value={totalLate}
          change="-1.2% from last week"
          changeType="up"
          icon={Calendar}
          color="bg-amber-50 dark:bg-amber-950/30 text-amber-500"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="daily" className="flex flex-col gap-6">
        <TabsList className="w-fit">
          <TabsTrigger value="daily">Daily Trends</TabsTrigger>
          <TabsTrigger value="classes">By Class</TabsTrigger>
          <TabsTrigger value="patterns">Submission Patterns</TabsTrigger>
        </TabsList>

        {/* Daily Trends */}
        <TabsContent value="daily" className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Submission Volume</CardTitle>
              <CardDescription>Submission counts and timeliness over the selected period.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissionTrends.map((day) => (
                  <div key={day.date} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium">{new Date(day.date).toLocaleDateString()}</div>
                      <Badge variant="outline">{day.totalSubmissions} total</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-emerald-100 dark:bg-emerald-900/30 h-2 rounded-full">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${(day.onTime / day.totalSubmissions) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-emerald-600 dark:text-emerald-400">
                          {day.onTime} on-time
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {day.late} late
                      </div>
                      {day.averageGrade && (
                        <Badge variant={day.averageGrade >= 85 ? "default" : "secondary"}>
                          {day.averageGrade}%
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Class */}
        <TabsContent value="classes" className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Performance</CardTitle>
              <CardDescription>Submission rates and average grades by class.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classStats.map((classStat) => (
                  <div key={classStat.class} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium">{classStat.class}</div>
                      <Badge variant="outline">{classStat.totalSubmissions} submissions</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{classStat.submissionRate}% rate</span>
                        <div className="w-16 bg-blue-100 dark:bg-blue-900/30 h-2 rounded-full">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${classStat.submissionRate}%` }}
                          />
                        </div>
                      </div>
                      <Badge variant={classStat.avgGrade >= 85 ? "default" : "secondary"}>
                        {classStat.avgGrade}% avg
                      </Badge>
                      {classStat.trend === "up" && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                      {classStat.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Submission Patterns */}
        <TabsContent value="patterns" className="flex flex-col gap-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Submission Patterns</CardTitle>
                <CardDescription>Peak submission times throughout the day.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hourlyPatterns.map((pattern) => (
                    <div key={pattern.hour} className="flex items-center justify-between">
                      <span className="text-sm">{pattern.hour}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted h-2 rounded-full">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(pattern.submissions / 35) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{pattern.submissions}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Hours Analysis</CardTitle>
                <CardDescription>Most active submission periods.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium text-emerald-800 dark:text-emerald-400">Peak Hours</span>
                    </div>
                    <p className="text-sm text-emerald-700 dark:text-emerald-500">
                      Most submissions occur between 2:00 PM - 4:00 PM (35-32 submissions/hour)
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800 dark:text-blue-400">Low Activity</span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-500">
                      Minimal activity after 7:00 PM (3-5 submissions/hour)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}