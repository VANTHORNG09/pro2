"use client";

import { useState } from "react";
import { Search, Download, BookOpen, FileText, MoreHorizontal, Eye, Edit, Trash2, Send, Archive, Users, Clock, AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type SubmissionStatus = "pending" | "submitted" | "graded" | "returned" | "late";

interface SubmissionRow {
  id: string;
  student: string;
  email: string;
  assignment: string;
  class: string;
  status: SubmissionStatus;
  submittedDate: string;
  grade?: number;
  maxPoints?: number;
  files: { name: string; size: string }[];
  isLate: boolean;
  feedback: string;
}

const mockData: SubmissionRow[] = [
  { id: "S001", student: "Alice Johnson", email: "alice@assignbridge.com", assignment: "Database Design Project", class: "CS-350", status: "graded", submittedDate: "2026-04-10", grade: 92, maxPoints: 100, files: [{ name: "schema.sql", size: "2.3 KB" }], isLate: false, feedback: "Excellent schema design." },
  { id: "S002", student: "Bob Smith", email: "bob@assignbridge.com", assignment: "React Portfolio", class: "CS-301", status: "submitted", submittedDate: "2026-04-09", files: [{ name: "portfolio.zip", size: "4.1 MB" }], isLate: false, feedback: "" },
  { id: "S003", student: "Charlie Brown", email: "charlie@assignbridge.com", assignment: "Sorting Algorithms", class: "CS-401", status: "late", submittedDate: "2026-04-16", files: [{ name: "sorting.java", size: "8.5 KB" }], isLate: true, feedback: "" },
  { id: "S004", student: "Diana Prince", email: "diana@assignbridge.com", assignment: "ML Model Training", class: "CS-450", status: "graded", submittedDate: "2026-04-08", grade: 88, maxPoints: 100, files: [{ name: "model.ipynb", size: "256 KB" }], isLate: false, feedback: "Good model accuracy." },
  { id: "S005", student: "Eve Wilson", email: "eve@assignbridge.com", assignment: "OOP Patterns", class: "CS-202", status: "returned", submittedDate: "2026-04-07", grade: 65, maxPoints: 100, files: [{ name: "patterns.java", size: "12 KB" }], isLate: false, feedback: "Missing responsive design. Please resubmit." },
  { id: "S006", student: "Frank Miller", email: "frank@assignbridge.com", assignment: "Database Design", class: "CS-350", status: "submitted", submittedDate: "2026-04-10", files: [{ name: "database.sql", size: "5.1 KB" }], isLate: false, feedback: "" },
  { id: "S007", student: "Grace Lee", email: "grace@assignbridge.com", assignment: "Calculus Set 5", class: "MATH-101", status: "pending", submittedDate: "—", files: [], isLate: false, feedback: "" },
  { id: "S008", student: "Henry Davis", email: "henry@assignbridge.com", assignment: "Physics Lab", class: "PHY-201", status: "graded", submittedDate: "2026-04-05", grade: 78, maxPoints: 50, files: [{ name: "lab.pdf", size: "1.2 MB" }], isLate: false, feedback: "Good work on calculations." },
];

const statusConfig: Record<SubmissionStatus, { label: string; color: string; dot: string }> = {
  submitted: { label: "Submitted", color: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400", dot: "bg-blue-500" },
  graded: { label: "Graded", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400", dot: "bg-emerald-500" },
  late: { label: "Late", color: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400", dot: "bg-red-500" },
  pending: { label: "Pending", color: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400", dot: "bg-amber-500" },
  returned: { label: "Returned", color: "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400", dot: "bg-violet-500" },
};

function StatCard({ title, value, subtitle, icon: Icon, color, trend }: { title: string; value: number | string; subtitle: string; icon: typeof FileText; color: string; trend?: { value: string; positive: boolean } }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`rounded-xl p-3 ${color}`}><Icon className="h-5 w-5" /></div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            {trend && (trend.positive ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 text-red-500" />)}
            {trend && <span className={trend.positive ? "text-emerald-500" : "text-red-500"}>{trend.value}</span>}
            <span>{subtitle}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GradeDialog({ submission, open, onOpenChange, onGrade }: {
  submission: SubmissionRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGrade: (id: string, grade: number, feedback: string) => void;
}) {
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  if (!submission) return null;

  const handleSubmit = () => {
    const g = parseInt(grade);
    if (isNaN(g) || g < 0 || g > (submission.maxPoints || 100)) return;
    onGrade(submission.id, g, feedback);
    setGrade("");
    setFeedback("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2"><CheckCircle2 className="h-5 w-5 text-blue-500" /></div>
            <div className="text-left">
              <p className="text-lg font-semibold">Grade Submission</p>
              <p className="text-sm text-muted-foreground">{submission.student} — {submission.assignment}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="text-xs text-muted-foreground">Submitted Files</Label>
            <div className="mt-1 space-y-1">
              {submission.files.map((f, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                  <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /><span>{f.name}</span></div>
                  <span className="text-xs text-muted-foreground">{f.size}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="grade-input">Grade (0-{submission.maxPoints || 100})</Label><Input id="grade-input" type="number" min={0} max={submission.maxPoints || 100} value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="0" /></div>
            <div className="space-y-2"><Label>Max Points</Label><p className="mt-1 text-sm font-medium">{submission.maxPoints || 100}</p></div>
          </div>
          <div className="space-y-2"><Label htmlFor="feedback-input">Feedback</Label><Textarea id="feedback-input" placeholder="Provide feedback..." value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={3} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit Grade</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<SubmissionRow[]>(mockData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [gradeDialog, setGradeDialog] = useState<SubmissionRow | null>(null);

  const classes = [...new Set(submissions.map((s) => s.class))];

  const filtered = submissions.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !search || s.student.toLowerCase().includes(q) || s.assignment.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchClass = classFilter === "all" || s.class === classFilter;
    return matchSearch && matchStatus && matchClass;
  });

  const counts = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    submitted: submissions.filter((s) => s.status === "submitted").length,
    graded: submissions.filter((s) => s.status === "graded").length,
    late: submissions.filter((s) => s.isLate || s.status === "late").length,
    returned: submissions.filter((s) => s.status === "returned").length,
  };

  const gradedSubmissions = submissions.filter((s) => s.grade != null);
  const avgGrade = gradedSubmissions.length ? Math.round(gradedSubmissions.reduce((a, s) => a + (s.grade || 0), 0) / gradedSubmissions.length) : 0;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };
  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((s) => s.id)));
  };

  const handleGrade = (id: string, grade: number, feedback: string) => {
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, grade, feedback, status: "graded" as SubmissionStatus } : s));
  };

  const handleReturn = (id: string) => {
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status: "returned" as SubmissionStatus } : s));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Submissions</h1>
          <p className="text-sm text-muted-foreground">Monitor, review, and grade student submissions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {
            const headers = ["Student", "Assignment", "Class", "Status", "Grade", "Submitted", "Late"];
            const rows = filtered.map((s) => [s.student, s.assignment, s.class, s.status, s.grade ? `${s.grade}/${s.maxPoints}` : "—", s.submittedDate, s.isLate ? "Yes" : "No"]);
            const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a"); link.href = url; link.download = "submissions.csv"; link.click();
            URL.revokeObjectURL(url);
          }}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Submissions" value={counts.total} subtitle="all statuses" icon={FileText} color="bg-blue-500/10 text-blue-500" />
        <StatCard title="Graded" value={counts.graded} subtitle="completed reviews" icon={CheckCircle2} color="bg-emerald-500/10 text-emerald-500" trend={{ value: `${Math.round((counts.graded / counts.total) * 100)}% graded`, positive: true }} />
        <StatCard title="Pending" value={counts.pending + counts.submitted} subtitle="awaiting review" icon={Clock} color="bg-amber-500/10 text-amber-500" />
        <StatCard title="Late" value={counts.late} subtitle="past due date" icon={AlertTriangle} color="bg-red-500/10 text-red-500" trend={{ value: `${counts.late} late`, positive: false }} />
        <StatCard title="Avg Grade" value={`${avgGrade}%`} subtitle="across graded" icon={RotateCcw} color="bg-violet-500/10 text-violet-500" />
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <span className="text-sm font-medium">{selectedIds.size} submission(s) selected</span>
          <Button size="sm" variant="outline" className="ml-auto" onClick={() => { selectedIds.forEach(() => {}); setSelectedIds(new Set()); }}><Download className="mr-1 h-3.5 w-3.5" />Download Files</Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>Clear</Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><CardTitle>Submissions</CardTitle><CardDescription>{filtered.length} submission(s) found</CardDescription></div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search students or assignments..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="graded">Graded</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Class" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <Tabs defaultValue="all">
            <div className="px-6 pt-4">
              <TabsList>
                <TabsTrigger value="all">All ({counts.total})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
                <TabsTrigger value="submitted">Submitted ({counts.submitted})</TabsTrigger>
                <TabsTrigger value="graded">Graded ({counts.graded})</TabsTrigger>
                <TabsTrigger value="late">Late ({counts.late})</TabsTrigger>
                <TabsTrigger value="returned">Returned ({counts.returned})</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="all" className="mt-0">
              <SubmissionTable data={filtered} selectedIds={selectedIds} toggleSelect={toggleSelect} toggleSelectAll={toggleSelectAll} isAllSelected={filtered.length > 0 && selectedIds.size === filtered.length} onGrade={(s) => setGradeDialog(s)} onReturn={handleReturn} />
            </TabsContent>
            {(["pending", "submitted", "graded", "late", "returned"] as SubmissionStatus[]).map((status) => (
              <TabsContent key={status} value={status} className="mt-0">
                <SubmissionTable data={filtered.filter((s) => s.status === status)} selectedIds={selectedIds} toggleSelect={toggleSelect} toggleSelectAll={toggleSelectAll} isAllSelected={false} onGrade={(s) => setGradeDialog(s)} onReturn={handleReturn} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <GradeDialog submission={gradeDialog} open={!!gradeDialog} onOpenChange={() => setGradeDialog(null)} onGrade={handleGrade} />
    </div>
  );
}

function SubmissionTable({ data, selectedIds, toggleSelect, toggleSelectAll, isAllSelected, onGrade, onReturn }: {
  data: SubmissionRow[];
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  isAllSelected: boolean;
  onGrade: (s: SubmissionRow) => void;
  onReturn: (id: string) => void;
}) {
  if (!data.length) {
    return <div className="flex flex-col items-center justify-center py-16 text-muted-foreground"><FileText className="h-12 w-12 mb-3 opacity-50" /><p className="text-sm font-medium">No submissions found</p><p className="text-xs mt-1">Try adjusting your filters</p></div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10 pl-6"><Checkbox checked={isAllSelected} onCheckedChange={toggleSelectAll} /></TableHead>
          <TableHead>Student</TableHead>
          <TableHead>Assignment</TableHead>
          <TableHead className="hidden md:table-cell">Submitted</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px] text-right pr-6">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((s) => {
          const status = statusConfig[s.status];
          const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
          return (
            <TableRow key={s.id} className="hover:bg-muted/50">
              <TableCell className="pl-6"><Checkbox checked={selectedIds.has(s.id)} onCheckedChange={() => toggleSelect(s.id)} /></TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{getInitials(s.student)}</AvatarFallback></Avatar>
                  <div className="min-w-0"><p className="truncate font-medium">{s.student}</p><p className="truncate text-xs text-muted-foreground">{s.email}</p></div>
                </div>
              </TableCell>
              <TableCell><p className="text-sm truncate max-w-[200px]">{s.assignment}</p><p className="text-xs text-muted-foreground">{s.class}</p></TableCell>
              <TableCell className="hidden text-sm text-muted-foreground md:table-cell whitespace-nowrap">{s.submittedDate}</TableCell>
              <TableCell>{s.grade !== null ? <span className="text-sm font-medium">{s.grade} / {s.maxPoints}</span> : <span className="text-sm text-muted-foreground">—</span>}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                  <span className="text-sm">{status.label}</span>
                  {s.isLate && s.status !== "late" && <Badge variant="outline" className="text-[10px] border-red-500/30 text-red-500">Late</Badge>}
                </div>
              </TableCell>
              <TableCell className="text-right pr-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon-sm"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(s.status === "submitted" || s.status === "late") && <DropdownMenuItem onClick={() => onGrade(s)}><Eye className="mr-2 h-4 w-4" />View & Grade</DropdownMenuItem>}
                    {s.status === "graded" && <DropdownMenuItem onClick={() => onReturn(s.id)}><RotateCcw className="mr-2 h-4 w-4" />Return</DropdownMenuItem>}
                    <DropdownMenuItem onClick={() => onGrade(s)}><CheckCircle2 className="mr-2 h-4 w-4" />Grade</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
