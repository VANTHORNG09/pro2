"use client";

import { useState, useMemo } from "react";
import { Search, Download, Users, TrendingUp, Award, FileText, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useClasses } from "@/lib/hooks/queries/useClasses";
import { useClassStudents } from "@/lib/hooks/queries/useClasses";

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  class: string;
  classCode: string;
  submissions: number;
  graded: number;
  pending: number;
  avgGrade: number;
  trend: "up" | "down" | "stable";
}

const mockStudents: StudentRecord[] = [
  { id: "1", name: "Alice Johnson", email: "alice@assignbridge.com", class: "Web Development A", classCode: "CS301", submissions: 10, graded: 9, pending: 1, avgGrade: 95, trend: "up" },
  { id: "2", name: "Bob Smith", email: "bob@assignbridge.com", class: "OOP Programming B", classCode: "CS202", submissions: 8, graded: 8, pending: 0, avgGrade: 88, trend: "up" },
  { id: "3", name: "Charlie Brown", email: "charlie@assignbridge.com", class: "Database Systems C", classCode: "CS305", submissions: 6, graded: 5, pending: 1, avgGrade: 76, trend: "stable" },
  { id: "4", name: "Diana Prince", email: "diana@assignbridge.com", class: "Machine Learning", classCode: "CS450", submissions: 7, graded: 7, pending: 0, avgGrade: 92, trend: "up" },
  { id: "5", name: "Eve Wilson", email: "eve@assignbridge.com", class: "Data Structures", classCode: "CS201", submissions: 12, graded: 10, pending: 2, avgGrade: 82, trend: "down" },
  { id: "6", name: "Frank Miller", email: "frank@assignbridge.com", class: "Organic Chemistry", classCode: "CHEM202", submissions: 9, graded: 8, pending: 1, avgGrade: 79, trend: "stable" },
  { id: "7", name: "Grace Lee", email: "grace@assignbridge.com", class: "Web Development A", classCode: "CS301", submissions: 10, graded: 10, pending: 0, avgGrade: 97, trend: "up" },
  { id: "8", name: "Henry Davis", email: "henry@assignbridge.com", class: "Calculus I", classCode: "MATH101", submissions: 14, graded: 12, pending: 2, avgGrade: 74, trend: "down" },
];

const gradeDistribution = [
  { range: "90-100", count: 2, label: "A" },
  { range: "80-89", count: 3, label: "B" },
  { range: "70-79", count: 2, label: "C" },
  { range: "60-69", count: 1, label: "D" },
  { range: "0-59", count: 0, label: "F" },
];

const performanceTrend = [
  { month: "Jan", avgGrade: 78, submissionRate: 85 },
  { month: "Feb", avgGrade: 80, submissionRate: 87 },
  { month: "Mar", avgGrade: 79, submissionRate: 86 },
  { month: "Apr", avgGrade: 83, submissionRate: 90 },
  { month: "May", avgGrade: 82, submissionRate: 88 },
  { month: "Jun", avgGrade: 85, submissionRate: 92 },
];

function StatCard({ title, value, subtitle, icon: Icon, color }: { title: string; value: number | string; subtitle: string; icon: typeof Users; color: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`rounded-xl p-3 ${color}`}><Icon className="h-5 w-5" /></div>
        <div><p className="text-2xl font-bold">{value}</p><p className="text-sm text-muted-foreground">{title}</p><p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p></div>
      </CardContent>
    </Card>
  );
}

export default function StudentPerformancePage() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  const { data: classes = [], isLoading: loadingClasses } = useClasses({});
  const uniqueClasses = [...new Set(mockStudents.map((s) => s.class))];

  const filtered = mockStudents.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !search || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.class.toLowerCase().includes(q);
    const matchClass = classFilter === "all" || s.class === classFilter;
    return matchSearch && matchClass;
  });

  const totalStudents = mockStudents.length;
  const avgGradeAll = Math.round(mockStudents.reduce((s, st) => s + st.avgGrade, 0) / totalStudents);
  const totalSubmissions = mockStudents.reduce((s, st) => s + st.submissions, 0);
  const totalGraded = mockStudents.reduce((s, st) => s + st.graded, 0);
  const topPerformers = [...mockStudents].sort((a, b) => b.avgGrade - a.avgGrade).slice(0, 5);

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Performance</h1>
          <p className="text-sm text-muted-foreground">View and analyze student performance metrics across all classes.</p>
        </div>
        <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export Report</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={totalStudents} subtitle="tracked" icon={Users} color="bg-blue-500/10 text-blue-500" />
        <StatCard title="Avg Grade" value={`${avgGradeAll}%`} subtitle="all students" icon={Award} color="bg-violet-500/10 text-violet-500" />
        <StatCard title="Total Submissions" value={totalSubmissions} subtitle="this term" icon={FileText} color="bg-emerald-500/10 text-emerald-500" />
        <StatCard title="Grading Rate" value={`${Math.round((totalGraded / totalSubmissions) * 100)}%`} subtitle="completed" icon={BarChart3} color="bg-amber-500/10 text-amber-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Grade Distribution</CardTitle><CardDescription>Breakdown of grades across all students</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                <XAxis dataKey="label" className="text-xs" /><YAxis className="text-xs" /><Tooltip />
                <Bar dataKey="count" name="Students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Performance Trend</CardTitle><CardDescription>Monthly average grade and submission rate</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                <XAxis dataKey="month" className="text-xs" /><YAxis domain={[0, 100]} className="text-xs" /><Tooltip /><Legend />
                <Line type="monotone" dataKey="avgGrade" name="Avg Grade" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="submissionRate" name="Submission Rate" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><CardTitle>Student Rankings</CardTitle><CardDescription>{filtered.length} student(s) found</CardDescription></div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-9 w-56" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-44"><SelectValue placeholder="Class" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <Tabs defaultValue="all">
            <div className="px-6 pt-4"><TabsList><TabsTrigger value="all">All Students</TabsTrigger><TabsTrigger value="top">Top Performers</TabsTrigger></TabsList></div>
            <TabsContent value="all" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Rank</TableHead><TableHead>Student</TableHead><TableHead>Class</TableHead><TableHead className="text-center">Submissions</TableHead><TableHead className="text-center">Graded</TableHead><TableHead className="text-center">Pending</TableHead><TableHead className="text-center">Avg Grade</TableHead><TableHead className="text-center">Trend</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s, i) => (
                    <TableRow key={s.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-sm">{i + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{getInitials(s.name)}</AvatarFallback></Avatar>
                          <div><p className="font-medium text-sm">{s.name}</p><p className="text-xs text-muted-foreground">{s.email}</p></div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="secondary" className="font-mono text-xs">{s.classCode}</Badge></TableCell>
                      <TableCell className="text-center text-sm">{s.submissions}</TableCell>
                      <TableCell className="text-center text-sm text-emerald-500">{s.graded}</TableCell>
                      <TableCell className="text-center text-sm text-amber-500">{s.pending}</TableCell>
                      <TableCell className="text-center"><Badge variant={s.avgGrade >= 90 ? "default" : s.avgGrade >= 80 ? "secondary" : "outline"}>{s.avgGrade}%</Badge></TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${s.trend === "up" ? "text-emerald-600" : s.trend === "down" ? "text-red-600" : "text-muted-foreground"}`}>
                          <TrendingUp className={`h-3 w-3 ${s.trend === "down" ? "rotate-180" : s.trend === "stable" ? "opacity-30" : ""}`} />
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="top" className="mt-0">
              <div className="p-6">
                <div className="space-y-3">
                  {topPerformers.map((s, i) => (
                    <div key={s.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${i === 0 ? "bg-amber-500/10 text-amber-500" : i === 1 ? "bg-slate-500/10 text-slate-500" : i === 2 ? "bg-orange-500/10 text-orange-500" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
                        <div><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.class}</p></div>
                      </div>
                      <Badge variant={s.avgGrade >= 95 ? "default" : "secondary"}>{s.avgGrade}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
