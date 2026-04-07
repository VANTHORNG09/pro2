"use client";

import * as React from "react";
import {
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Award,
  Users,
  FileText,
  BarChart3,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Mock Data ---

const gradeDistributionData = [
  { name: "A (90-100)", value: 45, color: "#22c55e", pct: 28 },
  { name: "B (80-89)", value: 58, color: "#3b82f6", pct: 36 },
  { name: "C (70-79)", value: 35, color: "#f59e0b", pct: 22 },
  { name: "D (60-69)", value: 14, color: "#f97316", pct: 9 },
  { name: "F (<60)", value: 8, color: "#ef4444", pct: 5 },
];

const classPerformance = [
  { class: "CS-301", name: "Data Structures", students: 58, avgGrade: 84, highest: 98, lowest: 52, passRate: 93 },
  { class: "CS-350", name: "Database Mgmt", students: 45, avgGrade: 79, highest: 95, lowest: 48, passRate: 89 },
  { class: "CS-420", name: "Network Security", students: 35, avgGrade: 88, highest: 99, lowest: 60, passRate: 97 },
  { class: "CS-450", name: "Machine Learning", students: 62, avgGrade: 81, highest: 96, lowest: 45, passRate: 90 },
];

const monthlyTrend = [
  { month: "Jan", avgGrade: 78, submissions: 180, graded: 165 },
  { month: "Feb", avgGrade: 80, submissions: 210, graded: 198 },
  { month: "Mar", avgGrade: 82, submissions: 245, graded: 238 },
  { month: "Apr", avgGrade: 85, submissions: 280, graded: 272 },
  { month: "May", avgGrade: 83, submissions: 265, graded: 258 },
  { month: "Jun", avgGrade: 87, submissions: 310, graded: 305 },
];

const topStudents = [
  { rank: 1, name: "Emma Wilson", class: "CS-420", avgGrade: 95, assignments: 6, completed: 6 },
  { rank: 2, name: "Leo Garcia", class: "CS-420", avgGrade: 93, assignments: 6, completed: 6 },
  { rank: 3, name: "Alice Johnson", class: "CS-301", avgGrade: 92, assignments: 12, completed: 11 },
  { rank: 4, name: "Grace Chen", class: "CS-450", avgGrade: 90, assignments: 10, completed: 9 },
  { rank: 5, name: "David Lee", class: "CS-301", avgGrade: 88, assignments: 12, completed: 10 },
];

const atRiskStudents = [
  { name: "Frank Martinez", class: "CS-350", avgGrade: 62, assignments: 8, completed: 4, attendance: 65, status: "critical" },
  { name: "Jack Taylor", class: "CS-450", avgGrade: 76, assignments: 10, completed: 7, attendance: 87, status: "warning" },
  { name: "Henry Brown", class: "CS-301", avgGrade: 72, assignments: 12, completed: 8, attendance: 82, status: "warning" },
];

const statsData = [
  { label: "Total Students", value: "160", change: "+12", trend: "up", icon: Users },
  { label: "Avg Grade", value: "85%", change: "+3.2%", trend: "up", icon: Award },
  { label: "Pass Rate", value: "92%", change: "+1.5%", trend: "up", icon: TrendingUp },
  { label: "Assignments Graded", value: "1,248", change: "+89", trend: "up", icon: FileText },
];

// --- Helper Components ---

function GradeIndicator({ grade }: { grade: number }) {
  const color = grade >= 90 ? "text-green-500" : grade >= 80 ? "text-blue-500" : grade >= 70 ? "text-amber-500" : "text-red-500";
  return <span className={`font-bold tabular-nums ${color}`}>{grade}%</span>;
}

// --- Main Page ---

export default function TeacherGradeReportPage() {
  const [selectedClass, setSelectedClass] = React.useState("all");
  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Grade Report</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive grading analytics across all your classes.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[200px]">
              <Filter className="mr-2 h-4 w-4 text-slate-400" />
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="CS-301">CS-301 — Data Structures</SelectItem>
              <SelectItem value="CS-350">CS-350 — Database Mgmt</SelectItem>
              <SelectItem value="CS-420">CS-420 — Network Security</SelectItem>
              <SelectItem value="CS-450">CS-450 — Machine Learning</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                <span className="text-green-500">{stat.change}</span>
                <span className="text-slate-500">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="classes">By Class</TabsTrigger>
          <TabsTrigger value="students">Student Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Grade Distribution */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Overall grade breakdown across all classes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={gradeDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {gradeDistributionData.map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {gradeDistributionData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-slate-600 dark:text-slate-300">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">{item.value} students</span>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300 w-8 text-right">{item.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trend */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Monthly Grade Trend</CardTitle>
                <CardDescription>Average grade and grading volume over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis yAxisId="left" domain={[60, 100]} stroke="#94a3b8" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="avgGrade" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: "#22c55e", r: 4 }} name="Avg Grade" />
                    <Line yAxisId="right" type="monotone" dataKey="graded" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 3 }} name="Graded" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers & At Risk */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Top Performers
                </CardTitle>
                <CardDescription>Students with the highest grades</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">#</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead className="text-right">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topStudents.map((s) => (
                      <TableRow key={s.rank}>
                        <TableCell className="font-mono text-xs text-slate-400">{s.rank}</TableCell>
                        <TableCell className="font-medium text-sm">{s.name}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-xs">{s.class}</Badge></TableCell>
                        <TableCell className="text-right"><GradeIndicator grade={s.avgGrade} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* At-Risk Students */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-red-500" />
                  At-Risk Students
                </CardTitle>
                <CardDescription>Students who may need additional support</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead className="text-right">Grade</TableHead>
                      <TableHead className="text-right">Risk</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {atRiskStudents.map((s) => (
                      <TableRow key={s.name}>
                        <TableCell className="font-medium text-sm">{s.name}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-xs">{s.class}</Badge></TableCell>
                        <TableCell className="text-right"><GradeIndicator grade={s.avgGrade} /></TableCell>
                        <TableCell className="text-right">
                          <Badge className={`text-xs ${s.status === "critical" ? "bg-red-500/10 text-red-600 border-red-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"}`}>
                            {s.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* By Class Tab */}
        <TabsContent value="classes" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {classPerformance.map((cls) => (
              <Card key={cls.class} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono">{cls.class}</Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <CardTitle className="text-sm mt-2">{cls.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 text-center">
                      <p className="text-lg font-bold text-slate-800 dark:text-white">{cls.avgGrade}%</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide">Avg</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 text-center">
                      <p className="text-lg font-bold text-green-500">{cls.passRate}%</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide">Pass</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Students: {cls.students}</span>
                    <span>High: <GradeIndicator grade={cls.highest} /></span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${cls.passRate}%` }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Class Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Class Grade Comparison</CardTitle>
              <CardDescription>Average grades across all classes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={classPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.95)",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="avgGrade" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Avg Grade" />
                  <Bar dataKey="passRate" fill="#22c55e" radius={[6, 6, 0, 0]} name="Pass Rate" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Student Performance Tab */}
        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Student Grades</CardTitle>
                  <CardDescription>Complete grade breakdown for every student</CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input placeholder="Search students..." className="pl-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Avg Grade</TableHead>
                    <TableHead>Assignments</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classPerformance.flatMap((cls) =>
                    Array.from({ length: Math.min(cls.students, 3) }).map((_, i) => {
                      const grade = Math.round(cls.avgGrade + (Math.random() - 0.5) * 20);
                      const clampedGrade = Math.max(45, Math.min(99, grade));
                      const assignments = Math.round(cls.students * 0.8 + Math.random() * 4);
                      const attendance = Math.round(75 + Math.random() * 23);
                      return (
                        <TableRow key={`${cls.class}-${i}`}>
                          <TableCell className="font-medium text-sm">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-semibold text-slate-600 dark:text-slate-300">
                                {String.fromCharCode(65 + i)}{String.fromCharCode(97 + i)}
                              </div>
                              Student {i + 1}
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="secondary" className="text-xs">{cls.class}</Badge></TableCell>
                          <TableCell><GradeIndicator grade={clampedGrade} /></TableCell>
                          <TableCell className="text-sm text-slate-600 dark:text-slate-300">{assignments}/{Math.round(cls.students)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${attendance >= 90 ? "bg-green-500" : attendance >= 75 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${attendance}%` }} />
                              </div>
                              <span className="text-xs text-slate-500">{attendance}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-slate-500">#{Math.floor(Math.random() * 50) + 1}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="View Details">
                              <Eye className="h-3.5 w-3.5 text-slate-500" />
                            </Button>
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
      </Tabs>
    </div>
  );
}
