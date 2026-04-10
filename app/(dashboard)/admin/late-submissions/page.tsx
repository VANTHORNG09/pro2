"use client";

import { useState } from "react";
import { Search, Download, Clock, AlertTriangle, FileText, MoreHorizontal, Eye, Edit, Trash2, Send, Archive, Mail, Award, Filter, Calendar, Users } from "lucide-react";
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

type LateSubmissionStatus = "late" | "overdue" | "extension_requested" | "extension_granted";
type UrgencyLevel = "low" | "medium" | "high" | "critical";

interface LateSubmissionItem {
  id: string;
  student: string;
  email: string;
  assignment: string;
  class: string;
  status: LateSubmissionStatus;
  submittedDate: string;
  dueDate: string;
  daysLate: number;
  urgency: UrgencyLevel;
  grade?: number;
  maxPoints?: number;
  files: { name: string; size: string }[];
  feedback: string;
  extensionReason?: string;
  extensionDays?: number;
  notified: boolean;
}

const mockLateSubmissions: LateSubmissionItem[] = [
  {
    id: "LS001",
    student: "Charlie Brown",
    email: "charlie@assignbridge.com",
    assignment: "Sorting Algorithms",
    class: "CS-401",
    status: "late",
    submittedDate: "2026-04-16",
    dueDate: "2026-04-10",
    daysLate: 6,
    urgency: "high",
    maxPoints: 100,
    files: [{ name: "sorting.java", size: "8.5 KB" }],
    feedback: "",
    extensionReason: "",
    notified: true
  },
  {
    id: "LS002",
    student: "Jake Thompson",
    email: "jake@assignbridge.com",
    assignment: "Data Structures Quiz",
    class: "CS-201",
    status: "overdue",
    submittedDate: "—",
    dueDate: "2026-04-09",
    daysLate: 1,
    urgency: "critical",
    maxPoints: 25,
    files: [],
    feedback: "",
    extensionReason: "Medical emergency",
    extensionDays: 3,
    notified: false
  },
  {
    id: "LS003",
    student: "Frank Garcia",
    email: "frank.g@assignbridge.com",
    assignment: "Machine Learning Lab",
    class: "CS-450",
    status: "extension_requested",
    submittedDate: "—",
    dueDate: "2026-04-12",
    daysLate: 0,
    urgency: "medium",
    maxPoints: 75,
    files: [],
    feedback: "",
    extensionReason: "Family commitment",
    extensionDays: 2,
    notified: true
  },
  {
    id: "LS004",
    student: "Diana Prince",
    email: "diana@assignbridge.com",
    assignment: "Web Security Project",
    class: "CS-320",
    status: "late",
    submittedDate: "2026-04-14",
    dueDate: "2026-04-08",
    daysLate: 6,
    urgency: "high",
    maxPoints: 100,
    files: [{ name: "security_report.pdf", size: "2.1 MB" }],
    feedback: "",
    extensionReason: "",
    notified: true
  },
  {
    id: "LS005",
    student: "Bruce Wayne",
    email: "bruce@assignbridge.com",
    assignment: "Database Design",
    class: "CS-350",
    status: "extension_granted",
    submittedDate: "—",
    dueDate: "2026-04-15",
    daysLate: 0,
    urgency: "low",
    maxPoints: 100,
    files: [],
    feedback: "",
    extensionReason: "Conference attendance",
    extensionDays: 5,
    notified: true
  }
];

const statusConfig: Record<LateSubmissionStatus, { label: string; color: string; dot: string }> = {
  late: { label: "Late", color: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400", dot: "bg-amber-500" },
  overdue: { label: "Overdue", color: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400", dot: "bg-red-500" },
  extension_requested: { label: "Extension Requested", color: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400", dot: "bg-blue-500" },
  extension_granted: { label: "Extension Granted", color: "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400", dot: "bg-green-500" },
};

const urgencyConfig: Record<UrgencyLevel, { label: string; color: string; icon: typeof AlertTriangle }> = {
  low: { label: "Low", color: "bg-green-500/10 text-green-600 border-green-500/20", icon: Clock },
  medium: { label: "Medium", color: "bg-amber-500/10 text-amber-600 border-amber-500/20", icon: AlertTriangle },
  high: { label: "High", color: "bg-orange-500/10 text-orange-600 border-orange-500/20", icon: AlertTriangle },
  critical: { label: "Critical", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: AlertTriangle },
};

export default function LateSubmissionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LateSubmissionStatus | "all">("all");
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | "all">("all");
  const [selectedSubmission, setSelectedSubmission] = useState<LateSubmissionItem | null>(null);
  const [extensionDialogOpen, setExtensionDialogOpen] = useState(false);
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const filteredSubmissions = mockLateSubmissions.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (urgencyFilter !== "all" && item.urgency !== urgencyFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return item.student.toLowerCase().includes(q) ||
             item.assignment.toLowerCase().includes(q) ||
             item.class.toLowerCase().includes(q);
    }
    return true;
  });

  const stats = {
    total: mockLateSubmissions.length,
    overdue: mockLateSubmissions.filter((item) => item.status === "overdue").length,
    extensions: mockLateSubmissions.filter((item) => item.status === "extension_requested" || item.status === "extension_granted").length,
    late: mockLateSubmissions.filter((item) => item.status === "late").length,
    totalDaysLate: mockLateSubmissions.reduce((acc, item) => acc + (item.daysLate > 0 ? item.daysLate : 0), 0),
  };

  const handleExtension = (id: string, granted: boolean, days?: number, reason?: string) => {
    console.log(`Extension ${granted ? 'granted' : 'denied'} for submission ${id}: ${days} days, reason: ${reason}`);
    // Here you would typically update the backend
  };

  const handleGrade = (id: string, grade: number, feedback: string) => {
    console.log(`Grading submission ${id} with ${grade} points: ${feedback}`);
    // Here you would typically update the backend
  };

  const handleNotify = (submission: LateSubmissionItem) => {
    console.log(`Sending notification to ${submission.student} about late submission`);
    // Here you would typically send notification
  };

  const handleViewSubmission = (submission: LateSubmissionItem) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Late Submissions</h1>
          <p className="text-sm text-muted-foreground">Manage overdue assignments and extension requests.</p>
        </div>
        <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export Report</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-blue-500/10 p-3"><FileText className="h-5 w-5 text-blue-500" /></div>
            <div><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted-foreground">Total Late</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-red-500/10 p-3"><AlertTriangle className="h-5 w-5 text-red-500" /></div>
            <div><p className="text-2xl font-bold">{stats.overdue}</p><p className="text-sm text-muted-foreground">Overdue</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-amber-500/10 p-3"><Clock className="h-5 w-5 text-amber-500" /></div>
            <div><p className="text-2xl font-bold">{stats.late}</p><p className="text-sm text-muted-foreground">Late</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-green-500/10 p-3"><Calendar className="h-5 w-5 text-green-500" /></div>
            <div><p className="text-2xl font-bold">{stats.totalDaysLate}</p><p className="text-sm text-muted-foreground">Total Days Late</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><CardTitle>Submissions</CardTitle></div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search late submissions..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as LateSubmissionStatus | "all")}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="extension_requested">Extension Requested</SelectItem>
                  <SelectItem value="extension_granted">Extension Granted</SelectItem>
                </SelectContent>
              </Select>
              <Select value={urgencyFilter} onValueChange={(v) => setUrgencyFilter(v as UrgencyLevel | "all")}>
                <SelectTrigger className="w-32"><SelectValue placeholder="Urgency" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Days Late</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((item) => {
                const status = statusConfig[item.status];
                const urgency = urgencyConfig[item.urgency];
                const UrgencyIcon = urgency.icon;

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{item.student.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{item.student}</p>
                          <p className="text-xs text-muted-foreground">{item.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{item.assignment}</p>
                        <p className="text-xs text-muted-foreground">Due: {item.dueDate}</p>
                      </div>
                    </TableCell>
                    <TableCell>{item.class}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={status.color}>
                        <div className={`w-2 h-2 rounded-full ${status.dot} mr-1.5`} />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${item.daysLate > 5 ? 'text-red-600' : item.daysLate > 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                        {item.daysLate > 0 ? `${item.daysLate} days` : '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={urgency.color}>
                        <UrgencyIcon className="w-3 h-3 mr-1" />
                        {urgency.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewSubmission(item)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {item.status === "extension_requested" && (
                            <DropdownMenuItem onClick={() => {
                              setSelectedSubmission(item);
                              setExtensionDialogOpen(true);
                            }}>
                              <Calendar className="mr-2 h-4 w-4" />
                              Review Extension
                            </DropdownMenuItem>
                          )}
                          {item.files.length > 0 && (
                            <DropdownMenuItem onClick={() => {
                              setSelectedSubmission(item);
                              setGradeDialogOpen(true);
                            }}>
                              <Award className="mr-2 h-4 w-4" />
                              Grade Submission
                            </DropdownMenuItem>
                          )}
                          {!item.notified && (
                            <DropdownMenuItem onClick={() => handleNotify(item)}>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Reminder
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filteredSubmissions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Filter className="h-10 w-10 mb-3 opacity-50" />
              <p className="text-sm">No late submissions match the current filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Extension Dialog */}
      <ExtensionDialog
        submission={selectedSubmission}
        open={extensionDialogOpen}
        onOpenChange={setExtensionDialogOpen}
        onExtension={handleExtension}
      />

      {/* Grade Dialog */}
      <GradeDialog
        submission={selectedSubmission}
        open={gradeDialogOpen}
        onOpenChange={setGradeDialogOpen}
        onGrade={handleGrade}
      />

      {/* View Dialog */}
      <ViewDialog
        submission={selectedSubmission}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </div>
  );
}

function ExtensionDialog({ submission, open, onOpenChange, onExtension }: {
  submission: LateSubmissionItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExtension: (id: string, granted: boolean, days?: number, reason?: string) => void;
}) {
  const [granted, setGranted] = useState(false);
  const [days, setDays] = useState("");
  const [reason, setReason] = useState("");

  if (!submission) return null;

  const handleSubmit = () => {
    const d = granted ? parseInt(days) : undefined;
    onExtension(submission.id, granted, d, reason);
    setGranted(false);
    setDays("");
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2"><Calendar className="h-5 w-5 text-blue-500" /></div>
            Review Extension Request
          </DialogTitle>
          <DialogDescription>
            Review {submission.student}&apos;s extension request for {submission.assignment}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {submission.extensionReason && (
            <div>
              <Label>Student&apos;s Reason</Label>
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <p className="text-sm">{submission.extensionReason}</p>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox id="grant" checked={granted} onCheckedChange={setGranted} />
            <Label htmlFor="grant" className="text-sm">Grant extension</Label>
          </div>
          {granted && (
            <div>
              <Label htmlFor="days">Extension Days</Label>
              <Input
                id="days"
                type="number"
                placeholder="Number of days"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                min="1"
                max="30"
              />
            </div>
          )}
          <div>
            <Label htmlFor="admin-reason">Admin Notes</Label>
            <Textarea
              id="admin-reason"
              placeholder="Add notes about the decision..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {granted ? "Grant Extension" : "Deny Extension"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GradeDialog({ submission, open, onOpenChange, onGrade }: {
  submission: LateSubmissionItem | null;
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
            <div className="rounded-lg bg-blue-500/10 p-2"><Award className="h-5 w-5 text-blue-500" /></div>
            Grade Late Submission
          </DialogTitle>
          <DialogDescription>
            Review and grade {submission.student}&apos;s late submission for {submission.assignment}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                type="number"
                placeholder="0"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                max={submission.maxPoints}
              />
              <p className="text-xs text-muted-foreground mt-1">Out of {submission.maxPoints} points</p>
            </div>
            <div>
              <Label>Late Penalty</Label>
              <p className="text-sm font-medium mt-2 text-amber-600">
                {submission.daysLate > 0 ? `${Math.min(submission.daysLate * 5, 50)}% reduction` : 'None'}
              </p>
            </div>
          </div>
          <div>
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Provide constructive feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="return" />
            <Label htmlFor="return" className="text-sm">Return for revision</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!grade.trim()}>
            Submit Grade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ViewDialog({ submission, open, onOpenChange }: {
  submission: LateSubmissionItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!submission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2"><FileText className="h-5 w-5 text-blue-500" /></div>
            Late Submission Details
          </DialogTitle>
          <DialogDescription>
            Review {submission.student}&apos;s late submission information
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Student</Label>
              <p className="text-sm font-medium mt-1">{submission.student}</p>
              <p className="text-xs text-muted-foreground">{submission.email}</p>
            </div>
            <div>
              <Label>Assignment</Label>
              <p className="text-sm font-medium mt-1">{submission.assignment}</p>
              <p className="text-xs text-muted-foreground">{submission.class}</p>
            </div>
            <div>
              <Label>Due Date</Label>
              <p className="text-sm font-medium mt-1">{submission.dueDate}</p>
            </div>
            <div>
              <Label>Submitted</Label>
              <p className="text-sm font-medium mt-1">{submission.submittedDate}</p>
              {submission.daysLate > 0 && (
                <p className="text-xs text-red-500 font-medium">{submission.daysLate} days late</p>
              )}
            </div>
            <div>
              <Label>Status</Label>
              <Badge variant="outline" className={statusConfig[submission.status].color}>
                {statusConfig[submission.status].label}
              </Badge>
            </div>
            <div>
              <Label>Urgency</Label>
              <Badge variant="outline" className={urgencyConfig[submission.urgency].color}>
                {urgencyConfig[submission.urgency].label}
              </Badge>
            </div>
          </div>

          {submission.extensionReason && (
            <div>
              <Label>Extension Information</Label>
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <p className="text-sm"><strong>Reason:</strong> {submission.extensionReason}</p>
                {submission.extensionDays && (
                  <p className="text-sm mt-1"><strong>Requested Days:</strong> {submission.extensionDays}</p>
                )}
              </div>
            </div>
          )}

          {submission.files.length > 0 && (
            <div>
              <Label>Files</Label>
              <div className="mt-2 space-y-2">
                {submission.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.size}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {submission.feedback && (
            <div>
              <Label>Previous Feedback</Label>
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <p className="text-sm">{submission.feedback}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Label>Notification Status:</Label>
            <Badge variant={submission.notified ? "default" : "secondary"}>
              {submission.notified ? "Notified" : "Not Notified"}
            </Badge>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          {submission.files.length > 0 && (
            <Button onClick={() => {
              // Handle grading action
              onOpenChange(false);
            }}>
              Grade Submission
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}