// lib/data/landing-page-data.ts
import {
  Clock3, AlertCircle, MessageSquareWarning, BarChart3, BellRing, BookOpenCheck,
  ChartNoAxesCombined, FileCheck2, MessageSquareText, Users, GraduationCap, Layers3,
  CheckCircle2, ShieldCheck, CalendarCheck2, Workflow, School, ClipboardList,
} from "lucide-react";
import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export const painPoints = [
  { icon: Clock3, title: "Missed Deadlines", description: "Students often forget assignment due dates." },
  { icon: MessageSquareWarning, title: "Scattered Communication", description: "Important updates are difficult to track." },
  { icon: BarChart3, title: "Lack of Progress Visibility", description: "Students struggle to monitor submission status." },
  { icon: AlertCircle, title: "Manual Academic Management", description: "Handling assignments manually wastes time." },
];

export const stats = [
  { value: "1", label: "Centralized platform" },
  { value: "3", label: "User roles" },
  { value: "24/7", label: "Access to class workflow" },
];

export const chips = ["No more context switching", "Real-time updates", "Deadline clarity"];

export const features = [
  { icon: BookOpenCheck, title: "Assignment Tracking", description: "Keep every task organized by class, due date, and submission status." },
  { icon: BellRing, title: "Deadline Reminders", description: "Reduce missed work with clear due-date visibility." },
  { icon: Users, title: "Class-Based Organization", description: "Group assignments and updates by class." },
  { icon: ChartNoAxesCombined, title: "Progress Dashboard", description: "Monitor completion and performance in one place." },
  { icon: FileCheck2, title: "Submission Management", description: "Support assignment submission workflows." },
  { icon: MessageSquareText, title: "Announcements & Feedback", description: "Keep communication centralized." },
];

export const howItWorksSteps = [
  { number: "01", title: "Join Your Class Workspace", description: "Students and teachers enter a shared class space." },
  { number: "02", title: "Track Tasks and Deadlines", description: "View upcoming assignments and due dates clearly." },
  { number: "03", title: "Submit and Monitor Progress", description: "Send submissions and review completion status." },
];

export const userRoles = [
  { id: "01", title: "Students", icon: GraduationCap, description: "Stay on top of assignments and deadlines.", points: [{ icon: Clock3, text: "View tasks by class" }, { icon: CheckCircle2, text: "Track deadlines" }, { icon: MessageSquareText, text: "Monitor progress" }] },
  { id: "02", title: "Teachers", icon: BookOpenCheck, description: "Manage classroom assignments and submissions.", points: [{ icon: ClipboardList, text: "Create assignments" }, { icon: BellRing, text: "Set deadlines" }, { icon: BarChart3, text: "Review submissions" }] },
  { id: "03", title: "Shared Classroom Workflow", icon: Users, description: "Connect students and teachers in one workflow.", points: [{ icon: Workflow, text: "Centralized workspace" }, { icon: ShieldCheck, text: "Structured design" }] },
];

export const upcomingAssignments = [
  { title: "Database Design Report", course: "Database Systems", due: "Due in 2 days", status: "In Review" },
  { title: "UI Prototype Submission", course: "Web Design", due: "Due tomorrow", status: "Pending" },
  { title: "Network Security Quiz", course: "Cybersecurity", due: "Due in 4 days", status: "Published" },
];

export const classProgress = [
  { label: "Submitted", value: "86%" },
  { label: "Pending", value: "10%" },
  { label: "Late", value: "4%" },
];

export const recentActivities = [
  "Mr. Dara reviewed 8 student submissions",
  "New assignment added for Web Design",
  "Students in OOP class reached 92% completion",
];

export const quickStats = [
  { icon: Layers3, label: "Active Assignments", value: "12" },
  { icon: Users, label: "Classes Running", value: "3" },
  { icon: CheckCircle2, label: "Submission Rate", value: "86%" },
  { icon: Clock3, label: "Pending Reviews", value: "5" },
];

export const platformStats = [
  { value: "3", label: "User Roles", description: "Student, Teacher, and Admin." },
  { value: "1", label: "Unified Workspace", description: "Assignments and progress managed together." },
  { value: "24/7", label: "Platform Access", description: "Check academic activity anytime." },
  { value: "Real-Time", label: "Visibility", description: "Track submissions without delay." },
];

export const whyChooseItems = [
  { icon: Layers3, title: "Centralized Academic Workflow", description: "Assignments, updates, and progress in one system." },
  { icon: CalendarCheck2, title: "Better Deadline Awareness", description: "Students see upcoming work clearly." },
  { icon: BellRing, title: "Stronger Communication Flow", description: "Teachers and students stay aligned." },
  { icon: ChartNoAxesCombined, title: "Clear Progress Tracking", description: "Submission states and performance monitored." },
  { icon: Users, title: "Built for Multiple Roles", description: "Supports students, teachers, and admins." },
  { icon: ShieldCheck, title: "Structured and Scalable Design", description: "Grows with future school management needs." },
];

export const audienceGroups = [
  { title: "For Teachers", description: "Manage assignments and student submissions.", icon: GraduationCap, points: [{ icon: ClipboardList, text: "Create and organize assignments." }, { icon: BellRing, text: "Share updates and feedback." }, { icon: BarChart3, text: "Track progress." }] },
  { title: "For Students", description: "Stay focused on upcoming work.", icon: BookOpenCheck, points: [{ icon: Clock3, text: "View deadlines." }, { icon: CheckCircle2, text: "Know submission status." }, { icon: MessageSquareText, text: "Receive feedback." }] },
  { title: "For Classrooms", description: "Bring academic workflow together.", icon: School, points: [{ icon: Workflow, text: "Centralize tasks." }, { icon: Users, text: "Support collaboration." }, { icon: ShieldCheck, text: "Build structured foundation." }] },
];

export const trustStatements = [
  { title: "Designed around real academic workflow", description: "Reflects how assignments move in schools." },
  { title: "Built for clarity, not complexity", description: "Reduces confusion with organized views." },
  { title: "Made to support future growth", description: "Role-based structure for expansion." },
];

export const faqItems = [
  { question: "What is AssignBridge?", answer: "A classroom workflow platform for managing assignments and progress." },
  { question: "Who is it for?", answer: "Students, teachers, and classrooms." },
  { question: "Can students track deadlines?", answer: "Yes, view assignments and deadlines in one dashboard." },
  { question: "How does it help teachers?", answer: "Organize tasks and track student progress." },
  { question: "Is it suitable for collaboration?", answer: "Yes, keeps assignment details centralized." },
  { question: "Do I need multiple tools?", answer: "No, it reduces scattered workflows." },
];

export const productLinks = [
  { label: "Assignments", href: "#" },
  { label: "Classes", href: "#" },
  { label: "Progress Tracking", href: "#" },
  { label: "Announcements", href: "#" },
];

export const companyLinks = [
  { label: "About", href: "#" },
  { label: "FAQ", href: "#faq" },
  { label: "Login", href: "#" },
  { label: "Signup", href: "#" },
];

export const supportLinks = [
  { label: "Help Center", href: "#" },
  { label: "Contact Us", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

export const socialLinks = [
  { icon: FaFacebookF, href: "https://www.facebook.com/piseth.mao.2025", label: "Facebook" },
  { icon: FaGithub, href: "https://github.com/PisethMao", label: "GitHub" },
  { icon: FaLinkedinIn, href: "https://www.linkedin.com/in/piseth-mao-9223333bb/", label: "LinkedIn" },
  { icon: MdEmail, href: "https://mail.google.com/mail/?view=cm&fs=1&to=pisethmao2002@gmail.com", label: "Email" },
];
