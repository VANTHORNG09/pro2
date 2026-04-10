"use client";

import * as React from "react";
import {
  Shield,
  Search,
  Filter,
  AlertTriangle,
  Eye,
  CheckCircle2,
  XCircle,
  Users,
  FileText,
  BarChart3,
  Download,
  TrendingUp,
  Copy,
  ExternalLink,
  Percent,
  Clock,
  User,
  BookOpen,
  Gavel,
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

type PlagiarismType = "code_similarity" | "text_similarity" | "copy_paste" | "ai_generated" | "external_source";
type PlagiarismStatus = "flagged" | "under_review" | "confirmed" | "dismissed" | "escalated";

interface PlagiarismCase {
  id: string;
  student: string;
  email: string;
  assignment: string;
  class: string;
  detectedDate: string;
  submittedDate: string;
  similarityScore: number;
  plagiarismType: PlagiarismType;
  matchedWith?: string; // other student or external source
  affectedFiles: { name: string; similarity: number }[];
  status: PlagiarismStatus;
  evidence?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  actionTaken?: string;
}

// --- Mock Data ---

const mockPlagiarismCases: PlagiarismCase[] = [
  {
    id: "PLAG001",
    student: "Alex Thompson",
    email: "alex@assignbridge.com",
    assignment: "Database Design Project",
    class: "CS-350",
    detectedDate: "2026-04-10",
    submittedDate: "2026-04-09",
    similarityScore: 92,
    plagiarismType: "code_similarity",
    matchedWith: "Jordan Rivera",
    affectedFiles: [{ name: "schema.sql", similarity: 92 }, { name: "queries.sql", similarity: 88 }],
    status: "flagged",
    evidence: "Identical table structures, column names, and query patterns found in both submissions.",
  },
  {
    id: "PLAG002",
    student: "Casey Morgan",
    email: "casey@assignbridge.com",
    assignment: "React Portfolio",
    class: "CS-301",
    detectedDate: "2026-04-09",
    submittedDate: "2026-04-08",
    similarityScore: 78,
    plagiarismType: "ai_generated",
    affectedFiles: [{ name: "portfolio.zip", similarity: 78 }],
    status: "under_review",
    evidence: "AI detection tools indicate 78% probability of AI-generated code. Unusual patterns for a student at this level.",
  },
  {
    id: "PLAG003",
    student: "Sam Kim",
    email: "sam@assignbridge.com",
    assignment: "Sorting Algorithms",
    class: "CS-401",
    detectedDate: "2026-04-08",
    submittedDate: "2026-04-07",
    similarityScore: 95,
    plagiarismType: "code_similarity",
    matchedWith: "Taylor Chen",
    affectedFiles: [{ name: "sorting.java", similarity: 95 }, { name: "tests.java", similarity: 91 }],
    status: "confirmed",
    reviewedBy: "Dr. Sarah Johnson",
    reviewNotes: "Both students confirmed to have collaborated inappropriately. Case referred to academic integrity committee.",
    actionTaken: "Zero grade assigned. Academic integrity hearing scheduled.",
  },
  {
    id: "PLAG004",
    student: "Riley Patel",
    email: "riley@assignbridge.com",
    assignment: "OOP Design Patterns",
    class: "CS-202",
    detectedDate: "2026-04-06",
    submittedDate: "2026-04-05",
    similarityScore: 65,
    plagiarismType: "external_source",
    affectedFiles: [{ name: "patterns.java", similarity: 65 }],
    status: "dismissed",
    reviewedBy: "Prof. Michael Chen",
    reviewNotes: "Similarity traced to public GitHub repository with MIT license. Student cited the source in comments. Fair use confirmed.",
    actionTaken: "No action required. Student properly attributed source.",
  },
  {
    id: "PLAG005",
    student: "Morgan Lee",
    email: "morgan@assignbridge.com",
    assignment: "ML Model Training",
    class: "CS-450",
    detectedDate: "2026-04-05",
    submittedDate: "2026-04-04",
    similarityScore: 85,
    plagiarismType: "copy_paste",
    matchedWith: "Blake Anderson",
    affectedFiles: [{ name: "model.ipynb", similarity: 85 }, { name: "report.pdf", similarity: 90 }],
    status: "escalated",
    evidence: "Report sections copied verbatim. Model architecture identical including unique bugs.",
    reviewedBy: "Admin User",
    reviewNotes: "Escalated to department head. Both students notified.",
  },
  {
    id: "PLAG006",
    student: "Quinn Taylor",
    email: "quinn@assignbridge.com",
    assignment: "Calculus Problem Set 5",
    class: "MATH-101",
    detectedDate: "2026-04-03",
    submittedDate: "2026-04-02",
    similarityScore: 72,
    plagiarismType: "text_similarity",
    affectedFiles: [{ name: "solutions.pdf", similarity: 72 }],
    status: "under_review",
    evidence: "Solution steps match another student's work. Unusual notation patterns match exactly.",
  },
];

// --- Config ---

const plagiarismTypeConfig: Record<PlagiarismType, { label: string; icon: typeof Copy; color: string }> = {
  code_similarity: { label: "Code Similarity", icon: Copy, color: "text-red-500" },
  text_similarity: { label: "Text Similarity", icon: FileText, color: "text-orange-500" },
  copy_paste: { label: "Copy-Paste", icon: Copy, color: "text-red-600" },
  ai_generated: { label: "AI Generated", icon: Shield, color: "text-purple-500" },
  external_source: { label: "External Source", icon: ExternalLink, color: "text-blue-500" },
};

const statusConfig: Record<PlagiarismStatus, { label: string; color: string }> = {
  flagged: { label: "Flagged", color: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  under_review: { label: "Under Review", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  confirmed: { label: "Confirmed", color: "bg-red-500/10 text-red-700 dark:text-red-400" },
  dismissed: { label: "Dismissed", color: "bg-slate-500/10 text-slate-700 dark:text-slate-400" },
  escalated: { label: "Escalated", color: "bg-purple-500/10 text-purple-700 dark:text-purple-400" },
};

// --- Helper Components ---

function SimilarityBadge({ score }: { score: number }) {
  const color = score >= 90 ? "text-red-500" : score >= 70 ? "text-orange-500" : "text-amber-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16">
        <Progress value={score} className="h-2" />
      </div>
      <span className={`text-sm font-medium ${color}`}>{score}%</span>
    </div>
  );
}

// --- Main Page ---

export default function PlagiarismCasesPage() {
  const [cases, setCases] = React.useState<PlagiarismCase[]>(mockPlagiarismCases);
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<PlagiarismType | "all">("all");
  const [statusFilter, setStatusFilter] = React.useState<PlagiarismStatus | "all">("all");
  const [selectedCase, setSelectedCase] = React.useState<PlagiarismCase | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = React.useState(false);
  const [reviewAction, setReviewAction] = React.useState<PlagiarismStatus>("confirmed");
  const [reviewNotes, setReviewNotes] = React.useState("");
  const [actionTaken, setActionTaken] = React.useState("");

  const filteredCases = cases.filter((c) => {
    if (typeFilter !== "all" && c.plagiarismType !== typeFilter) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.student.toLowerCase().includes(q) ||
        c.assignment.toLowerCase().includes(q) ||
        c.class.toLowerCase().includes(q) ||
        c.matchedWith?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: cases.length,
    flagged: cases.filter((c) => c.status === "flagged").length,
    underReview: cases.filter((c) => c.status === "under_review").length,
    confirmed: cases.filter((c) => c.status === "confirmed").length,
    dismissed: cases.filter((c) => c.status === "dismissed").length,
    escalated: cases.filter((c) => c.status === "escalated").length,
    avgSimilarity: cases.length > 0
      ? Math.round(cases.reduce((sum, c) => sum + c.similarityScore, 0) / cases.length)
      : 0,
  };

  const handleReview = (plagiarismCase: PlagiarismCase) => {
    setSelectedCase(plagiarismCase);
    setReviewAction(plagiarismCase.status === "flagged" ? "confirmed" : plagiarismCase.status);
    setReviewNotes(plagiarismCase.reviewNotes || "");
    setActionTaken(plagiarismCase.actionTaken || "");
    setIsReviewDialogOpen(true);
  };

  const handleReviewSubmit = () => {
    if (!selectedCase) return;
    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCase.id
          ? { ...c, status: reviewAction, reviewedBy: "Admin User", reviewNotes, actionTaken }
          : c
      )
    );
    toast.success(`Case ${selectedCase.id} marked as ${statusConfig[reviewAction].label.toLowerCase()}`);
    setIsReviewDialogOpen(false);
    setSelectedCase(null);
    setReviewNotes("");
    setActionTaken("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Plagiarism Cases</h1>
          <p className="text-sm text-muted-foreground">
            Monitor and manage plagiarism detection results across all submissions.
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
            <div className="rounded-xl bg-red-500/10 p-3">
              <Shield className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Cases</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-amber-500/10 p-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.flagged}</p>
              <p className="text-sm text-muted-foreground">Flagged</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-emerald-500/10 p-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.confirmed}</p>
              <p className="text-sm text-muted-foreground">Confirmed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-purple-500/10 p-3">
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.avgSimilarity}%</p>
              <p className="text-sm text-muted-foreground">Avg Similarity</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(["flagged", "under_review", "confirmed", "dismissed", "escalated"] as PlagiarismStatus[]).map((status) => {
              const count = cases.filter((c) => c.status === status).length;
              const percentage = cases.length > 0 ? (count / cases.length) * 100 : 0;
              const config = statusConfig[status];
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{config.label}</span>
                    <span className="text-muted-foreground">{count} ({Math.round(percentage)}%)</span>
                  </div>
                  <Progress value={percentage} className="mt-1.5 h-1.5" />
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plagiarism Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(Object.entries(plagiarismTypeConfig) as [PlagiarismType, typeof plagiarismTypeConfig[PlagiarismType]][]).map(
              ([type, config]) => {
                const count = cases.filter((c) => c.plagiarismType === type).length;
                const TypeIcon = config.icon;
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TypeIcon className={`h-4 w-4 ${config.color}`} />
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
            <CardTitle className="text-base">Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "High (80%+)", range: [80, 100], color: "text-red-500" },
              { label: "Medium (60-79%)", range: [60, 79], color: "text-orange-500" },
              { label: "Low (40-59%)", range: [40, 59], color: "text-amber-500" },
            ].map(({ label, range, color }) => {
              const count = cases.filter((c) => c.similarityScore >= range[0] && c.similarityScore < range[1]).length;
              return (
                <div key={label} className="flex items-center justify-between">
                  <span className={`text-sm ${color}`}>{label}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              );
            })}
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
              <Input placeholder="Search cases..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as PlagiarismType | "all")}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="code_similarity">Code Similarity</SelectItem>
                <SelectItem value="text_similarity">Text Similarity</SelectItem>
                <SelectItem value="copy_paste">Copy-Paste</SelectItem>
                <SelectItem value="ai_generated">AI Generated</SelectItem>
                <SelectItem value="external_source">External Source</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as PlagiarismStatus | "all")}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
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
              <TabsTrigger value="flagged">Flagged ({stats.flagged})</TabsTrigger>
              <TabsTrigger value="under_review">Under Review ({stats.underReview})</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed ({stats.confirmed})</TabsTrigger>
              <TabsTrigger value="escalated">Escalated ({stats.escalated})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <PlagiarismTable cases={filteredCases} onReview={handleReview} />
            </TabsContent>
            <TabsContent value="flagged" className="mt-0">
              <PlagiarismTable cases={filteredCases.filter((c) => c.status === "flagged")} onReview={handleReview} />
            </TabsContent>
            <TabsContent value="under_review" className="mt-0">
              <PlagiarismTable cases={filteredCases.filter((c) => c.status === "under_review")} onReview={handleReview} />
            </TabsContent>
            <TabsContent value="confirmed" className="mt-0">
              <PlagiarismTable cases={filteredCases.filter((c) => c.status === "confirmed")} onReview={handleReview} />
            </TabsContent>
            <TabsContent value="escalated" className="mt-0">
              <PlagiarismTable cases={filteredCases.filter((c) => c.status === "escalated")} onReview={handleReview} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        {selectedCase && (
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Review Plagiarism Case
              </DialogTitle>
              <DialogDescription>
                Review case {selectedCase.id} for {selectedCase.student}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Case Info */}
              <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Student</p>
                  <p className="text-sm font-medium">{selectedCase.student}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assignment</p>
                  <p className="text-sm font-medium">{selectedCase.assignment}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Class</p>
                  <p className="text-sm font-medium">{selectedCase.class}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Similarity Score</p>
                  <SimilarityBadge score={selectedCase.similarityScore} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-sm font-medium">
                    {plagiarismTypeConfig[selectedCase.plagiarismType].label}
                  </p>
                </div>
                {selectedCase.matchedWith && (
                  <div>
                    <p className="text-xs text-muted-foreground">Matched With</p>
                    <p className="text-sm font-medium">{selectedCase.matchedWith}</p>
                  </div>
                )}
              </div>

              {/* Evidence */}
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-400">Evidence</p>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-500">{selectedCase.evidence}</p>
                  </div>
                </div>
              </div>

              {/* Affected Files */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Affected Files</h4>
                <div className="space-y-1">
                  {selectedCase.affectedFiles.map((file) => (
                    <div key={file.name} className="flex items-center justify-between rounded-md border p-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <span className="text-sm font-medium">{file.similarity}% similarity</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Action */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Review Decision</label>
                <Select value={reviewAction} onValueChange={(v) => setReviewAction(v as PlagiarismStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirm Plagiarism</SelectItem>
                    <SelectItem value="dismissed">Dismiss Case</SelectItem>
                    <SelectItem value="escalated">Escalate to Committee</SelectItem>
                    <SelectItem value="under_review">Keep Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Review Notes */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Review Notes</label>
                <Textarea
                  placeholder="Add notes about this case..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Action Taken */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Action Taken</label>
                <Textarea
                  placeholder="Describe the action taken (e.g., grade penalty, hearing scheduled)..."
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReviewSubmit}>
                Submit Review
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

// --- Table Component ---

function PlagiarismTable({
  cases,
  onReview,
}: {
  cases: PlagiarismCase[];
  onReview: (plagiarismCase: PlagiarismCase) => void;
}) {
  if (!cases.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Filter className="mb-3 h-10 w-10 opacity-50" />
        <p className="text-sm">No plagiarism cases match the current filters.</p>
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
          <TableHead>Type</TableHead>
          <TableHead>Similarity</TableHead>
          <TableHead>Detected</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cases.map((c) => {
          const typeCfg = plagiarismTypeConfig[c.plagiarismType];
          const TypeIcon = typeCfg.icon;
          const statusCfg = statusConfig[c.status];

          return (
            <TableRow key={c.id}>
              <TableCell className="font-mono text-sm">{c.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.student}</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm font-medium">{c.assignment}</p>
                  <p className="text-xs text-muted-foreground">{c.class}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <TypeIcon className={`h-4 w-4 ${typeCfg.color}`} />
                  <span className="text-sm">{typeCfg.label}</span>
                </div>
              </TableCell>
              <TableCell>
                <SimilarityBadge score={c.similarityScore} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{c.detectedDate}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusCfg.color}>
                  {statusCfg.label}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onReview(c)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
