// app/(dashboard)/help/page.tsx
"use client";

import { useState } from "react";
import {
  Search,
  BookOpen,
  CircleHelp,
  Mail,
  MessageSquare,
  FileText,
  ChevronDown,
  ChevronUp,
  Shield,
  UserCircle,
  GraduationCap,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageShell } from "@/components/shared/page-shell";
import { PageHeader } from "@/components/shared/page-header";

interface FAQ {
  question: string;
  answer: string;
  category: "general" | "student" | "teacher" | "admin";
}

const faqs: FAQ[] = [
  // General
  { question: "How do I reset my password?", answer: "Go to the login page and click 'Forgot Password'. Enter your registered email address and you'll receive a password reset link. If you don't receive the email, check your spam folder.", category: "general" },
  { question: "What browsers are supported?", answer: "AssignBridge works best on the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, keep your browser updated.", category: "general" },
  { question: "Can I use AssignBridge on mobile?", answer: "Yes! AssignBridge is fully responsive and works on tablets and smartphones. You can also add it to your home screen for quick access.", category: "general" },

  // Student
  { question: "How do I submit an assignment?", answer: "Navigate to the assignment page, click on the assignment you want to submit, and click the 'Submit' button. Upload your files and add any optional comments before submitting.", category: "student" },
  { question: "Can I submit an assignment late?", answer: "Late submissions depend on your teacher's settings. If late submissions are allowed, you'll see a 'Submit Late' option. Otherwise, contact your teacher directly.", category: "student" },
  { question: "How do I check my grades?", answer: "Go to the 'Grades' section from the sidebar to view all your graded assignments, feedback, and overall performance analytics.", category: "student" },
  { question: "What if I can't see an assignment?", answer: "Assignments are only visible when they are published by your teacher. If you think an assignment should be visible, contact your teacher.", category: "student" },

  // Teacher
  { question: "How do I create an assignment?", answer: "Go to 'Assignments' in the sidebar, click 'New Assignment', fill in the details including title, description, due date, and allowed file types, then publish it.", category: "teacher" },
  { question: "How do I grade submissions?", answer: "Navigate to 'Submission Review' from the sidebar, select the assignment, and review each student's submission. Enter the grade and feedback, then save.", category: "teacher" },
  { question: "Can I extend an assignment deadline?", answer: "Yes. Go to the assignment details, click 'Edit', update the due date, and save. All students will be notified of the change.", category: "teacher" },

  // Admin
  { question: "How do I add a new user?", answer: "Go to 'User Management' in the admin sidebar, click 'Add User', fill in the details (name, email, role, password), and save.", category: "admin" },
  { question: "How do I manage classes?", answer: "Navigate to 'Class Management' from the admin sidebar. You can create new classes, assign teachers, and enroll students from there.", category: "admin" },
  { question: "How do I view platform analytics?", answer: "Go to 'Reports' in the admin sidebar for a comprehensive view of platform statistics, user distribution, and engagement metrics.", category: "admin" },
];

const categoryConfig = {
  general: { icon: CircleHelp, label: "General", color: "text-blue-500" },
  student: { icon: UserCircle, label: "Student", color: "text-emerald-500" },
  teacher: { icon: GraduationCap, label: "Teacher", color: "text-purple-500" },
  admin: { icon: Shield, label: "Admin", color: "text-amber-500" },
};

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs = faqs.filter((faq) => {
    if (categoryFilter !== "all" && faq.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <PageShell>
      <PageHeader
        title="Help & Support"
        description="Find answers to common questions, guides, and support resources."
      />

      {/* Quick Links */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLinkCard
          icon={<BookOpen className="h-6 w-6 text-blue-500" />}
          title="Documentation"
          description="Detailed guides and tutorials"
          href="#"
        />
        <QuickLinkCard
          icon={<MessageSquare className="h-6 w-6 text-emerald-500" />}
          title="Community"
          description="Ask questions and share tips"
          href="#"
        />
        <QuickLinkCard
          icon={<Mail className="h-6 w-6 text-purple-500" />}
          title="Contact Support"
          description="Get help from our team"
          href="mailto:support@assignbridge.com"
        />
        <QuickLinkCard
          icon={<FileText className="h-6 w-6 text-amber-500" />}
          title="Release Notes"
          description="What's new in AssignBridge"
          href="#"
        />
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Help</CardTitle>
          <CardDescription>Find answers to your questions quickly.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for help topics..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          variant={categoryFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setCategoryFilter("all")}
        >
          All
        </Button>
        {(Object.entries(categoryConfig) as [string, typeof categoryConfig.general][]).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <Button
              key={key}
              variant={categoryFilter === key ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(key)}
            >
              <Icon className={`mr-1.5 h-3.5 w-3.5 ${config.color}`} />
              {config.label}
            </Button>
          );
        })}
      </div>

      {/* FAQ Accordion */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            {filteredFaqs.length} result{filteredFaqs.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFaqs.length > 0 ? (
            <div className="space-y-2">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openIndex === index;
                const catConfig = categoryConfig[faq.category];
                const CatIcon = catConfig.icon;
                return (
                  <div
                    key={index}
                    className="rounded-lg border transition-colors hover:bg-muted/50"
                  >
                    <button
                      className="flex w-full items-center justify-between gap-3 p-4 text-left"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                    >
                      <div className="flex items-center gap-3">
                        <CatIcon className={`h-4 w-4 ${catConfig.color}`} />
                        <span className="text-sm font-medium">{faq.question}</span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="border-t px-4 py-3">
                        <p className="text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Search className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No results found for &ldquo;{search}&rdquo;. Try a different search term.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Still Need Help */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Still Need Help?</CardTitle>
          <CardDescription>We&apos;re here to assist you with any issues.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href="mailto:support@assignbridge.com">
                <Mail className="mr-2 h-4 w-4" />
                Email Support
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#">
                <MessageSquare className="mr-2 h-4 w-4" />
                Live Chat
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Guides
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}

function QuickLinkCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block rounded-2xl border border-border/60 bg-background p-5 shadow-sm transition-all hover:border-border hover:shadow-md"
    >
      <div className="mb-3">{icon}</div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </a>
  );
}
