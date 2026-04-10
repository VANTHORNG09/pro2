"use client";

import * as React from "react";
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Eye,
  BarChart3,
  Clock,
  FileText,
  CheckCircle2,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Calendar,
  Download,
  Activity,
  User,
} from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// --- Types ---

type ActivityType = "assignment_created" | "assignment_graded" | "class_created" | "class_modified" | "announcement" | "grade_posted" | "login" | "feedback_given";

interface TeacherActivity {
  id: string;
  teacher: string;
  email: string;
  department: string;
  activityType: ActivityType;
  description: string;
  target?: string;
  timestamp: string;
  classesManaged: number;
  studentsEnrolled: number;
  assignmentsCreated: number;
  submissionsGraded: number;
  avgGradeGiven: number;
  lastLogin: string;
  weeklyHours: number;
}

interface TeacherSummary {
  id: string;
  teacher: string;
  email: string;
  department: string;
  classesManaged: number;
  studentsEnrolled: number;
  assignmentsCreated: number;
  submissionsGraded: number;
  avgGradeGiven: number;
  lastLogin: string;
  weeklyHours: number;
  activityScore: number;
}

// --- Mock Data ---

const mockActivities: TeacherActivity[] = [
  {
    id: "TA001",
    teacher: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    department: "Computer Science",
    activityType: "assignment_graded",
    description: "Graded 15 submissions for Database Design Project",
    target: "CS-350",
    timestamp: "2026-04-10 14:30",
    classesManaged: 4,
    studentsEnrolled: 180,
    assignmentsCreated: 12,
    submissionsGraded: 145,
    avgGradeGiven: 84,
    lastLogin: "2026-04-10 09:00",
    weeklyHours: 18,
  },
  {
    id: "TA002",
    teacher: "Prof. Michael Chen",
    email: "michael.chen@university.edu",
    department: "Computer Science",
    activityType: "assignment_created",
    description: "Created new assignment: Advanced React Patterns",
    target: "CS-301",
    timestamp: "2026-04-10 13:15",
    classesManaged: 3,
    studentsEnrolled: 145,
    assignmentsCreated: 8,
    submissionsGraded: 98,
    avgGradeGiven: 87,
    lastLogin: "2026-04-10 08:30",
    weeklyHours: 15,
  },
  {
    id: "TA003",
    teacher: "Dr. Alex Kumar",
    email: "alex.kumar@university.edu",
    department: "Physics",
    activityType: "grade_posted",
    description: "Posted final grades for Physics Lab Report",
    target: "PHY-201",
    timestamp: "2026-04-10 12:00",
    classesManaged: 2,
    studentsEnrolled: 95,
    assignmentsCreated: 6,
    submissionsGraded: 82,
    avgGradeGiven: 78,
    lastLogin: "2026-04-09 16:00",
    weeklyHours: 12,
  },
  {
    id: "TA004",
    teacher: "Prof. Emily Davis",
    email: "emily.davis@university.edu",
    department: "Mathematics",
    activityType: "class_modified",
    description: "Updated course materials for Calculus II",
    target: "MATH-202",
    timestamp: "2026-04-10 11:30",
    classesManaged: 3,
    studentsEnrolled: 210,
    assignmentsCreated: 10,
    submissionsGraded: 167,
    avgGradeGiven: 82,
    lastLogin: "2026-04-10 07:45",
    weeklyHours: 20,
  },
  {
    id: "TA005",
    teacher: "Dr. Robert Lee",
    email: "robert.lee@university.edu",
    department: "Chemistry",
    activityType: "announcement",
    description: "Posted announcement about midterm schedule change",
    target: "CHEM-301",
    timestamp: "2026-04-10 10:00",
    classesManaged: 2,
    studentsEnrolled: 78,
    assignmentsCreated: 5,
    submissionsGraded: 45,
    avgGradeGiven: 88,
    lastLogin: "2026-04-08 14:00",
    weeklyHours: 8,
  },
  {
    id: "TA006",
    teacher: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    department: "Computer Science",
    activityType: "assignment_created",
    description: "Created assignment: SQL Query Optimization",
    target: "CS-350",
    timestamp: "2026-04-10 09:45",
    classesManaged: 4,
    studentsEnrolled: 180,
    assignmentsCreated: 12,
    submissionsGraded: 145,
    avgGradeGiven: 84,
    lastLogin: "2026-04-10 09:00",
    weeklyHours: 18,
  },
  {
    id: "TA007",
    teacher: "Prof. Michael Chen",
    email: "michael.chen@university.edu",
    department: "Computer Science",
    activityType: "feedback_given",
    description: "Provided detailed feedback on 8 portfolio submissions",
    target: "CS-301",
    timestamp: "2026-04-09 16:30",
    classesManaged: 3,
    studentsEnrolled: 145,
    assignmentsCreated: 8,
    submissionsGraded: 98,
    avgGradeGiven: 87,
    lastLogin: "2026-04-10 08:30",
    weeklyHours: 15,
  },
  {
    id: "TA008",
    teacher: "Dr. Lisa Wang",
    email: "lisa.wang@university.edu",
    department: "Engineering",
    activityType: "class_created",
    description: "Created new class: Advanced Robotics",
    target: "ENG-450",
    timestamp: "2026-04-09 14:00",
    classesManaged: 2,
    studentsEnrolled: 65,
    assignmentsCreated: 4,
    submissionsGraded: 32,
    avgGradeGiven: 91,
    lastLogin: "2026-04-07 10:00",
    weeklyHours: 10,
  },
];

const teacherSummaries: TeacherSummary[] = [
  { id: "T001", teacher: "Dr. Sarah Johnson", email: "sarah.johnson@university.edu", department: "Computer Science", classesManaged: 4, studentsEnrolled: 180, assignmentsCreated: 12, submissionsGraded: 145, avgGradeGiven: 84, lastLogin: "2026-04-10", weeklyHours: 18, activityScore: 92 },
  { id: "T002", teacher: "Prof. Michael Chen", email: "michael.chen@university.edu", department: "Computer Science", classesManaged: 3, studentsEnrolled: 145, assignmentsCreated: 8, submissionsGraded: 98, avgGradeGiven: 87, lastLogin: "2026-04-10", weeklyHours: 15, activityScore: 85 },
  { id: "T003", teacher: "Dr. Alex Kumar", email: "alex.kumar@university.edu", department: "Physics", classesManaged: 2, studentsEnrolled: 95, assignmentsCreated: 6, submissionsGraded: 82, avgGradeGiven: 78, lastLogin: "2026-04-09", weeklyHours: 12, activityScore: 72 },
  { id: "T004", teacher: "Prof. Emily Davis", email: "emily.davis@university.edu", department: "Mathematics", classesManaged: 3, studentsEnrolled: 210, assignmentsCreated: 10, submissionsGraded: 167, avgGradeGiven: 82, lastLogin: "2026-04-10", weeklyHours: 20, activityScore: 95 },
  { id: "T005", teacher: "Dr. Robert Lee", email: "robert.lee@university.edu", department: "Chemistry", classesManaged: 2, studentsEnrolled: 78, assignmentsCreated: 5, submissionsGraded: 45, avgGradeGiven: 88, lastLogin: "2026-04-08", weeklyHours: 8, activityScore: 58 },
  { id: "T006", teacher: "Dr. Lisa Wang", email: "lisa.wang@university.edu", department: "Engineering", classesManaged: 2, studentsEnrolled: 65, assignmentsCreated: 4, submissionsGraded: 32, avgGradeGiven: 91, lastLogin: "2026-04-07", weeklyHours: 10, activityScore: 64 },
];

// --- Config ---

const activityTypeConfig: Record<ActivityType, { label: string; icon: typeof FileText; color: string }> = {
  assignment_created: { label: "Assignment Created", icon: FileText, color: "text-blue-500" },
  assignment_graded: { label: "Assignment Graded", icon: CheckCircle2, color: "text-emerald-500" },
  class_created: { label: "Class Created", icon: BookOpen, color: "text-purple-500" },
  class_modified: { label: "Class Modified", icon: BookOpen, color: "text-amber-500" },
  announcement: { label: "Announcement", icon: Users, color: "text-cyan-500" },
  grade_posted: { label: "Grade Posted", icon: BarChart3, color: "text-violet-500" },
  login: { label: "Login", icon: Activity, color: "text-slate-500" },
  feedback_given: { label: "Feedback Given", icon: ClipboardList, color: "text-pink-500" },
};

// --- Main Page ---

export default function TeacherActivityPage() {
  const [search, setSearch] = React.useState("");
  const [departmentFilter, setDepartmentFilter] = React.useState<string>("all");
  const [activityTypeFilter, setActivityTypeFilter] = React.useState<ActivityType | "all">("all");
  const [selectedTeacher, setSelectedTeacher] = React.useState<TeacherSummary | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);

  const departments = [...new Set(mockActivities.map((a) => a.department))];

  const filteredActivities = mockActivities.filter((a) => {
    if (departmentFilter !== "all" && a.department !== departmentFilter) return false;
    if (activityTypeFilter !== "all" && a.activityType !== activityTypeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.teacher.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.target?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    totalTeachers: teacherSummaries.length,
    activeThisWeek: teacherSummaries.filter((t) => t.weeklyHours > 10).length,
    totalClasses: teacherSummaries.reduce((sum, t) => sum + t.classesManaged, 0),
    totalStudents: teacherSummaries.reduce((sum, t) => sum + t.studentsEnrolled, 0),
    totalAssignments: teacherSummaries.reduce((sum, t) => sum + t.assignmentsCreated, 0),
    totalGraded: teacherSummaries.reduce((sum, t) => sum + t.submissionsGraded, 0),
    avgActivityScore: Math.round(teacherSummaries.reduce((sum, t) => sum + t.activityScore, 0) / teacherSummaries.length),
  };

  const handleViewTeacher = (teacher: TeacherSummary) => {
    setSelectedTeacher(teacher);
    setIsDetailDialogOpen(true);
  };

  const teacherActivities = (teacherName: string) =>
    mockActivities.filter((a) => a.teacher === teacherName);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teacher Activity</h1>
          <p className="text-sm text-muted-foreground">
            Monitor teacher engagement, class management, and grading activity.
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-500/10 p-3">
              <GraduationCap className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalTeachers}</p>
              <p className="text-sm text-muted-foreground">Total Teachers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-emerald-500/10 p-3">
              <Activity className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.activeThisWeek}</p>
              <p className="text-sm text-muted-foreground">Active This Week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-violet-500/10 p-3">
              <BookOpen className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalClasses}</p>
              <p className="text-sm text-muted-foreground">Classes Managed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-amber-500/10 p-3">
              <TrendingUp className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.avgActivityScore}%</p>
              <p className="text-sm text-muted-foreground">Avg Activity Score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Engagement Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Students Enrolled</span>
              <span className="font-medium">{stats.totalStudents.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Assignments Created</span>
              <span className="font-medium">{stats.totalAssignments}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Submissions Graded</span>
              <span className="font-medium">{stats.totalGraded}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(Object.entries(activityTypeConfig) as [ActivityType, typeof activityTypeConfig[ActivityType]][]).map(
              ([type, config]) => {
                const count = mockActivities.filter((a) => a.activityType === type).length;
                const Icon = config.icon;
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${config.color}`} />
                      <span className="text-sm">{config.label}</span>
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                );
              }
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Performers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {teacherSummaries
              .sort((a, b) => b.activityScore - a.activityScore)
              .slice(0, 4)
              .map((teacher) => (
                <div key={teacher.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{teacher.teacher}</p>
                    <p className="text-xs text-muted-foreground">{teacher.weeklyHours} hrs/week</p>
                  </div>
                  <Badge variant="default">{teacher.activityScore}%</Badge>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search activities..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={activityTypeFilter} onValueChange={(v) => setActivityTypeFilter(v as ActivityType | "all")}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="assignment_created">Assignment Created</SelectItem>
                <SelectItem value="assignment_graded">Assignment Graded</SelectItem>
                <SelectItem value="class_created">Class Created</SelectItem>
                <SelectItem value="class_modified">Class Modified</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="grade_posted">Grade Posted</SelectItem>
                <SelectItem value="feedback_given">Feedback Given</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="activity" className="flex flex-col gap-6">
        <TabsList className="w-fit">
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="teachers">Teacher Summary</TabsTrigger>
        </TabsList>

        {/* Recent Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.map((activity) => {
                    const cfg = activityTypeConfig[activity.activityType];
                    const Icon = cfg.icon;
                    return (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                              <GraduationCap className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{activity.teacher}</p>
                              <p className="text-xs text-muted-foreground">{activity.department}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Icon className={`h-4 w-4 ${cfg.color}`} />
                            <span className="text-sm">{cfg.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {activity.target}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {activity.timestamp}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewTeacher(teacherSummaries.find((t) => t.teacher === activity.teacher)!)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teacher Summary Tab */}
        <TabsContent value="teachers">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Classes</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Assignments</TableHead>
                    <TableHead>Graded</TableHead>
                    <TableHead>Avg Grade</TableHead>
                    <TableHead>Hours/Wk</TableHead>
                    <TableHead>Activity Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teacherSummaries.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <GraduationCap className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{teacher.teacher}</p>
                            <p className="text-xs text-muted-foreground">{teacher.department}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{teacher.classesManaged}</TableCell>
                      <TableCell className="text-sm">{teacher.studentsEnrolled}</TableCell>
                      <TableCell className="text-sm">{teacher.assignmentsCreated}</TableCell>
                      <TableCell className="text-sm">{teacher.submissionsGraded}</TableCell>
                      <TableCell className="text-sm">{teacher.avgGradeGiven}%</TableCell>
                      <TableCell className="text-sm">{teacher.weeklyHours}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-12">
                            <Progress value={teacher.activityScore} className="h-2" />
                          </div>
                          <span className="text-sm font-medium">{teacher.activityScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleViewTeacher(teacher)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Teacher Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        {selectedTeacher && (
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                {selectedTeacher.teacher}
              </DialogTitle>
              <DialogDescription>
                {selectedTeacher.department} · {selectedTeacher.email}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Classes Managed</p>
                  <p className="text-2xl font-bold">{selectedTeacher.classesManaged}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Students Enrolled</p>
                  <p className="text-2xl font-bold">{selectedTeacher.studentsEnrolled}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Assignments Created</p>
                  <p className="text-2xl font-bold">{selectedTeacher.assignmentsCreated}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Submissions Graded</p>
                  <p className="text-2xl font-bold">{selectedTeacher.submissionsGraded}</p>
                </div>
              </div>

              {/* Activity Score */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Activity Score</p>
                  <Badge variant="default">{selectedTeacher.activityScore}%</Badge>
                </div>
                <Progress value={selectedTeacher.activityScore} className="mt-2" />
              </div>

              {/* Recent Activities */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recent Activities</h4>
                {teacherActivities(selectedTeacher.teacher).map((activity) => {
                  const cfg = activityTypeConfig[activity.activityType];
                  const Icon = cfg.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-3 rounded-md border p-3">
                      <Icon className={`mt-0.5 h-4 w-4 ${cfg.color}`} />
                      <div className="flex-1">
                        <p className="text-sm">{cfg.label}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                    </div>
                  );
                })}
              </div>

              {/* Engagement */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Last Login</p>
                  <p className="text-sm font-medium">{selectedTeacher.lastLogin}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Weekly Hours</p>
                  <p className="text-sm font-medium">{selectedTeacher.weeklyHours} hrs</p>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
