"use client";

import * as React from "react";
import {
  CheckCircle2,
  Search,
  Filter,
  Clock,
  User,
  FileText,
  BookOpen,
  Calendar,
  Eye,
  Play,
  SkipForward,
  Star,
  AlertTriangle,
  BarChart3,
  Download,
  TrendingUp,
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
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// --- Types ---

type Priority = "low" | "medium" | "high" | "urgent";
type GradingStatus = "pending" | "in_progress" | "completed" | "skipped";

interface GradingItem {
  id: string;
  student: string;
  email: string;
  assignment: string;
  class: string;
  submittedDate: string;
  priority: Priority;
  status: GradingStatus;
  files: { name: string; size: string }[];
  maxPoints: number;
  rubric?: { criterion: string; maxScore: number }[];
  late: boolean;
  assignedGrader?: string;
  grade?: number;
  feedback?: string;
}

// --- Mock Data ---

const mockGradingQueue: GradingItem[] = [
  {
    id: "GQ001",
    student: "Alice Johnson",
    email: "alice@assignbridge.com",
    assignment: "Database Design Project",
    class: "CS-350",
    submittedDate: "2026-04-10",
    priority: "high",
    status: "pending",
    files: [{ name: "schema.sql", size: "2.3 KB" }, { name: "documentation.pdf", size: "1.2 MB" }],
    maxPoints: 100,
    rubric: [
      { criterion: "Schema Design", maxScore: 30 },
      { criterion: "Normalization", maxScore: 25 },
      { criterion: "Documentation", maxScore: 20 },
      { criterion: "Query Performance", maxScore: 25 },
    ],
    late: false,
  },
  {
    id: "GQ002",
    student: "Bob Smith",
    email: "bob@assignbridge.com",
    assignment: "React Portfolio",
    class: "CS-301",
    submittedDate: "2026-04-09",
    priority: "medium",
    status: "pending",
    files: [{ name: "portfolio.zip", size: "4.1 MB" }],
    maxPoints: 100,
    rubric: [
      { criterion: "UI Design", maxScore: 25 },
      { criterion: "Component Architecture", maxScore: 30 },
      { criterion: "Responsiveness", maxScore: 25 },
      { criterion: "Code Quality", maxScore: 20 },
    ],
    late: false,
  },
  {
    id: "GQ003",
    student: "Charlie Brown",
    email: "charlie@assignbridge.com",
    assignment: "Sorting Algorithms",
    class: "CS-401",
    submittedDate: "2026-04-08",
    priority: "urgent",
    status: "in_progress",
    files: [{ name: "sorting.java", size: "8.5 KB" }],
    maxPoints: 100,
    rubric: [
      { criterion: "Correctness", maxScore: 40 },
      { criterion: "Time Complexity", maxScore: 30 },
      { criterion: "Code Style", maxScore: 15 },
      { criterion: "Testing", maxScore: 15 },
    ],
    late: true,
    assignedGrader: "Dr. Sarah Johnson",
  },
  {
    id: "GQ004",
    student: "Diana Prince",
    email: "diana@assignbridge.com",
    assignment: "ML Model Training",
    class: "CS-450",
    submittedDate: "2026-04-08",
    priority: "high",
    status: "pending",
    files: [{ name: "model.ipynb", size: "256 KB" }, { name: "results.csv", size: "1.5 MB" }],
    maxPoints: 100,
    rubric: [
      { criterion: "Model Accuracy", maxScore: 40 },
      { criterion: "Data Preprocessing", maxScore: 25 },
      { criterion: "Feature Engineering", maxScore: 20 },
      { criterion: "Report", maxScore: 15 },
    ],
    late: false,
  },
  {
    id: "GQ005",
    student: "Eve Wilson",
    email: "eve@assignbridge.com",
    assignment: "OOP Design Patterns",
    class: "CS-202",
    submittedDate: "2026-04-07",
    priority: "low",
    status: "completed",
    files: [{ name: "patterns.java", size: "12 KB" }],
    maxPoints: 100,
    grade: 78,
    feedback: "Good implementation of Observer and Factory patterns. Missing Strategy pattern implementation.",
    late: false,
    assignedGrader: "Prof. Michael Chen",
  },
  {
    id: "GQ006",
    student: "Frank Miller",
    email: "frank@assignbridge.com",
    assignment: "Database Design",
    class: "CS-350",
    submittedDate: "2026-04-10",
    priority: "medium",
    status: "pending",
    files: [{ name: "database.sql", size: "5.1 KB" }],
    maxPoints: 100,
    rubric: [
      { criterion: "Schema Design", maxScore: 30 },
      { criterion: "Normalization", maxScore: 25 },
      { criterion: "Documentation", maxScore: 20 },
      { criterion: "Query Performance", maxScore: 25 },
    ],
    late: false,
  },
  {
    id: "GQ007",
    student: "Grace Lee",
    email: "grace@assignbridge.com",
    assignment: "Calculus Set 5",
    class: "MATH-101",
    submittedDate: "2026-04-09",
    priority: "medium",
    status: "skipped",
    files: [{ name: "solutions.pdf", size: "3.2 MB" }],
    maxPoints: 50,
    late: false,
    feedback: "Needs clarification on Problem 3 before grading.",
  },
  {
    id: "GQ008",
    student: "Henry Davis",
    email: "henry@assignbridge.com",
    assignment: "Physics Lab Report",
    class: "PHY-201",
    submittedDate: "2026-04-05",
    priority: "low",
    status: "completed",
    files: [{ name: "lab.pdf", size: "1.2 MB" }],
    maxPoints: 50,
    grade: 42,
    feedback: "Excellent experimental setup. Minor calculation error in Section 4.",
    late: false,
    assignedGrader: "Dr. Alex Kumar",
  },
];

// --- Config ---

const priorityConfig: Record<Priority, { label: string; icon: typeof AlertTriangle; color: string; order: number }> = {
  urgent: { label: "Urgent", icon: AlertTriangle, color: "text-red-500", order: 1 },
  high: { label: "High", icon: Star, color: "text-orange-500", order: 2 },
  medium: { label: "Medium", icon: Clock, color: "text-amber-500", order: 3 },
  low: { label: "Low", icon: TrendingUp, color: "text-slate-500", order: 4 },
};

const statusConfig: Record<GradingStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  in_progress: { label: "In Progress", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  completed: { label: "Completed", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  skipped: { label: "Skipped", color: "bg-slate-500/10 text-slate-700 dark:text-slate-400" },
};

// --- Main Page ---

export default function GradingQueuePage() {
  const [gradingQueue, setGradingQueue] = React.useState<GradingItem[]>(mockGradingQueue);
  const [search, setSearch] = React.useState("");
  const [priorityFilter, setPriorityFilter] = React.useState<Priority | "all">("all");
  const [statusFilter, setStatusFilter] = React.useState<GradingStatus | "all">("all");
  const [selectedItem, setSelectedItem] = React.useState<GradingItem | null>(null);
  const [isGradeDialogOpen, setIsGradeDialogOpen] = React.useState(false);
  const [grade, setGrade] = React.useState("");
  const [feedback, setFeedback] = React.useState("");
  const [rubricScores, setRubricScores] = React.useState<Record<string, number>>({});

  const filteredItems = gradingQueue
    .filter((item) => {
      if (priorityFilter !== "all" && item.priority !== priorityFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          item.student.toLowerCase().includes(q) ||
          item.assignment.toLowerCase().includes(q) ||
          item.class.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by priority first, then by submission date
      const priorityOrder = priorityConfig[a.priority].order - priorityConfig[b.priority].order;
      if (priorityOrder !== 0) return priorityOrder;
      return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
    });

  const stats = {
    total: gradingQueue.length,
    pending: gradingQueue.filter((i) => i.status === "pending").length,
    inProgress: gradingQueue.filter((i) => i.status === "in_progress").length,
    completed: gradingQueue.filter((i) => i.status === "completed").length,
    skipped: gradingQueue.filter((i) => i.status === "skipped").length,
    urgent: gradingQueue.filter((i) => i.priority === "urgent" && i.status !== "completed").length,
    avgCompletionTime: "4.2 hrs",
    gradingProgress: gradingQueue.length > 0
      ? Math.round((gradingQueue.filter((i) => i.status === "completed").length / gradingQueue.length) * 100)
      : 0,
  };

  const handleGrade = (item: GradingItem) => {
    setSelectedItem(item);
    setGrade(item.grade?.toString() || "");
    setFeedback(item.feedback || "");
    setRubricScores({});
    if (item.rubric) {
      const initialScores: Record<string, number> = {};
      item.rubric.forEach((r) => (initialScores[r.criterion] = 0));
      setRubricScores(initialScores);
    }
    setIsGradeDialogOpen(true);
  };

  const handleGradeSubmit = () => {
    if (!selectedItem) return;
    setGradingQueue((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? { ...item, status: "completed" as GradingStatus, grade: parseInt(grade) || 0, feedback, assignedGrader: "Admin User" }
          : item
      )
    );
    toast.success(`Grading completed for ${selectedItem.student}`);
    setIsGradeDialogOpen(false);
    setSelectedItem(null);
    setGrade("");
    setFeedback("");
    setRubricScores({});
  };

  const handleSkip = (id: string) => {
    setGradingQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "skipped" as GradingStatus } : item))
    );
    toast.info(`Item ${id} skipped`);
  };

  const handleStartGrading = (id: string) => {
    setGradingQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "in_progress" as GradingStatus, assignedGrader: "Admin User" } : item
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Grading Queue</h1>
          <p className="text-sm text-muted-foreground">
            Manage and process submission grading efficiently.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Queue
          </Button>
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Grade Next
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-500/10 p-3">
              <CheckCircle2 className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Items</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-amber-500/10 p-3">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending + stats.inProgress}</p>
              <p className="text-sm text-muted-foreground">To Grade</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-emerald-500/10 p-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-red-500/10 p-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.urgent}</p>
              <p className="text-sm text-muted-foreground">Urgent</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Grading Progress</p>
              <p className="text-2xl font-bold">{stats.gradingProgress}%</p>
              <p className="text-xs text-muted-foreground">
                {stats.completed} of {stats.total} items graded
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-lg font-bold">{stats.avgCompletionTime}</p>
                <p className="text-xs text-muted-foreground">Avg. Time</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{stats.skipped}</p>
                <p className="text-xs text-muted-foreground">Skipped</p>
              </div>
            </div>
          </div>
          <Progress value={stats.gradingProgress} className="mt-4" />
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search queue..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as Priority | "all")}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as GradingStatus | "all")}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="skipped">Skipped</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs and Table */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress ({stats.inProgress})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <GradingTable items={filteredItems} onGrade={handleGrade} onSkip={handleSkip} onStart={handleStartGrading} />
            </TabsContent>
            <TabsContent value="pending" className="mt-0">
              <GradingTable items={filteredItems.filter((i) => i.status === "pending")} onGrade={handleGrade} onSkip={handleSkip} onStart={handleStartGrading} />
            </TabsContent>
            <TabsContent value="in_progress" className="mt-0">
              <GradingTable items={filteredItems.filter((i) => i.status === "in_progress")} onGrade={handleGrade} onSkip={handleSkip} onStart={handleStartGrading} />
            </TabsContent>
            <TabsContent value="completed" className="mt-0">
              <GradingTable items={filteredItems.filter((i) => i.status === "completed")} onGrade={handleGrade} onSkip={handleSkip} onStart={handleStartGrading} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Grade Dialog */}
      <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
        {selectedItem && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Grade Submission
              </DialogTitle>
              <DialogDescription>
                Grade {selectedItem.student}'s submission for {selectedItem.assignment}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Submission Info */}
              <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Student</p>
                  <p className="text-sm font-medium">{selectedItem.student}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assignment</p>
                  <p className="text-sm font-medium">{selectedItem.assignment}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Class</p>
                  <p className="text-sm font-medium">{selectedItem.class}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="text-sm font-medium">{selectedItem.submittedDate}</p>
                </div>
              </div>

              {/* Rubric */}
              {selectedItem.rubric && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Rubric Scoring</h4>
                  {selectedItem.rubric.map((r) => (
                    <div key={r.criterion} className="grid grid-cols-3 gap-2 items-center">
                      <p className="text-sm">{r.criterion}</p>
                      <Input
                        type="number"
                        min={0}
                        max={r.maxScore}
                        value={rubricScores[r.criterion] || 0}
                        onChange={(e) =>
                          setRubricScores((prev) => ({ ...prev, [r.criterion]: parseInt(e.target.value) || 0 }))
                        }
                        className="col-span-2"
                      />
                      <p className="text-xs text-muted-foreground col-span-3 text-right">
                        Max: {r.maxScore} points
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Grade */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Final Grade</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={selectedItem.maxPoints}
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder={`0-${selectedItem.maxPoints}`}
                  />
                  <span className="text-sm text-muted-foreground">/ {selectedItem.maxPoints}</span>
                </div>
              </div>

              {/* Feedback */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Feedback</label>
                <Textarea
                  placeholder="Provide feedback to the student..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGradeDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleGradeSubmit}>
                Submit Grade
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

// --- Table Component ---

function GradingTable({
  items,
  onGrade,
  onSkip,
  onStart,
}: {
  items: GradingItem[];
  onGrade: (item: GradingItem) => void;
  onSkip: (id: string) => void;
  onStart: (id: string) => void;
}) {
  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Filter className="mb-3 h-10 w-10 opacity-50" />
        <p className="text-sm">No items in the grading queue match the current filters.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Student</TableHead>
          <TableHead>Assignment</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const priorityCfg = priorityConfig[item.priority];
          const PriorityIcon = priorityCfg.icon;
          const statusCfg = statusConfig[item.status];

          return (
            <TableRow key={item.id}>
              <TableCell className="font-mono text-sm">{item.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.student}</p>
                    <p className="text-xs text-muted-foreground">{item.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm font-medium">{item.assignment}</p>
                  <p className="text-xs text-muted-foreground">{item.class}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <PriorityIcon className={`h-4 w-4 ${priorityCfg.color}`} />
                  <span className="text-sm">{priorityCfg.label}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{item.submittedDate}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusCfg.color}>
                  {statusCfg.label}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {item.status === "completed" ? (
                    <Button variant="ghost" size="icon" onClick={() => onGrade(item)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  ) : (
                    <>
                      {item.status === "pending" && (
                        <Button variant="ghost" size="icon" onClick={() => onStart(item.id)}>
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => onGrade(item)}>
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      {item.status === "pending" && (
                        <Button variant="ghost" size="icon" onClick={() => onSkip(item.id)}>
                          <SkipForward className="h-4 w-4 text-slate-500" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
