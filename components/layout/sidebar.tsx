"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Users,
  BookOpen,
  ClipboardList,
  FileText,
  CheckCircle2,
  School,
  GraduationCap,
  Shield,
  Settings,
  HelpCircle,
  LogOut,
  BarChart3,
  CalendarDays,
  Bell,
  History,
  Award,
  Clock,
  Inbox,
  TrendingUp,
  Target,
  Search,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarMenuAction,
  SidebarMenuSkeleton,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/hooks/useAuth";
import { ta } from "zod/v4/locales";
import { table } from "console";

// ============= Types =============

type UserRole = "admin" | "teacher" | "student";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  disabled?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface RoleConfig {
  label: string;
  icon: LucideIcon;
  dashboardHref: string;
  accentColor: string;
}

// ============= Role Config =============

const roleConfig: Record<UserRole, RoleConfig> = {
  admin: {
    label: "Administrator",
    icon: Shield,
    dashboardHref: "/admin",
    accentColor: "from-blue-500 to-indigo-600",
  },
  teacher: {
    label: "Teacher",
    icon: GraduationCap,
    dashboardHref: "/teacher",
    accentColor: "from-emerald-500 to-teal-600",
  },
  student: {
    label: "Student",
    icon: School,
    dashboardHref: "/student",
    accentColor: "from-cyan-500 to-sky-600",
  },
};

// ============= Navigation Data =============

const adminNavGroups: NavGroup[] = [
  {
    label: "Management",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { title: "User Management", href: "/admin/users", icon: Users, badge: 3 },
      { title: "Class Management", href: "/admin/classes", icon: BookOpen },
      { title: "Course Management", href: "/admin/courses", icon: FileText },
      { title: "Assignments", href: "/admin/assignments", icon: ClipboardList },
    ],
  },
  {
    label: "Submissions",
    items: [
      { title: "All Submissions", href: "/admin/submissions", icon: Inbox, badge: 14 },
      { title: "Pending Review", href: "/admin/pending", icon: Clock, badge: 8 },
      { title: "Flagged Submissions", href: "/admin/flagged", icon: Bell, badge: 2 },
      { title: "Resubmissions", href: "/admin/resubmissions", icon: Search, badge: 5 },
      { title: "Grading Queue", href: "/admin/grading-queue", icon: CheckCircle2, badge: 12 },
      { title: "Submission Analytics", href: "/admin/submission-analytics", icon: BarChart3 },
      { title: "Late Submissions", href: "/admin/late-submissions", icon: History, badge: 4 },
      { title: "Plagiarism Cases", href: "/admin/plagiarism", icon: Target, badge: 1 },
      { title: "Submission Trends", href: "/admin/submission-trends", icon: TrendingUp },
      { title: "Top Performers", href: "/admin/top-performers", icon: Award },
      { title: "Activity Logs", href: "/admin/activity-logs", icon: History},
      { title: "Teacher Activity", href: "/admin/teacher-activity", icon: Users},
    ],
  },
  {
    label: "Panding",
    items: [
      { title: "Pending Submissions", href: "/admin/pending-submissions", icon: Clock, badge: 8 },
      { title: "Pending Reviews", href: "/admin/pending-reviews", icon: CheckCircle2, badge: 12 },
      { title: "Pending Approvals", href: "/admin/pending-approvals", icon: Bell, badge: 3 },
      { title: "Pending User Requests", href: "/admin/pending-users", icon: Users, badge: 5 },
      { title: "Pending Class Approvals", href: "/admin/pending-classes", icon: BookOpen, badge: 2 },
      { title: "Pending Course Approvals", href: "/admin/pending-courses", icon: FileText, badge: 4 },
      { title: "Pending Assignment Approvals", href: "/admin/pending-assignments", icon: ClipboardList, badge: 6 },{ title: "Pending Reports", href: "/admin/pending-submissions", icon: BarChart3, badge: 7 },
    ],
  },
  {
    label: "Analytics",
    items: [
      { title: "Dashboard Analytics", href: "/admin/analytics", icon: LayoutDashboard },
      { title: "User Analytics", href: "/admin/user-analytics", icon: Users },
      { title: "Class Analytics", href: "/admin/class-analytics", icon: BookOpen },
      { title: "Course Analytics", href: "/admin/course-analytics", icon: FileText },
      { title: "Assignment Analytics", href: "/admin/assignment-analytics", icon: ClipboardList },
      { title: "Engagement Metrics", href: "/admin/engagement-metrics", icon: BarChart3 },
      { title: "Performance Metrics", href: "/admin/performance-metrics", icon: Award },
      { title: "Activity Logs", href: "/admin/logs", icon: History },

    ],
  },
  {
    label: "Reports",
    items: [
      { title: "Reports", href: "/admin/reports", icon: BarChart3 },
      { title: "student-reports", href: "/admin/student-reports", icon: BarChart3 },
      {title: "Class Performance", href: "/admin/class-performance", icon: BarChart3 },
      {
        title: "Course Performance",
        href: "/admin/course-performance",
        icon: BarChart3,
      },
      {title: "User Engagement", href: "/admin/engagement", icon: Users },
      { title: "Class-wise Summary", href: "/admin/class-report", icon: Target },
      { title: "Grade Report", href: "/admin/gradereport", icon: Award },
      { title: "Student Performance", href: "/admin/student-performance", icon: Users },
      { title: "Activity Logs", href: "/admin/logs", icon: History },
     
    ],
  },
];

const teacherNavGroups: NavGroup[] = [
  {
    label: "Teaching",
    items: [
      { title: "Dashboard", href: "/teacher", icon: LayoutDashboard },
      { title: "My Classes", href: "/teacher/classes", icon: BookOpen },
      { title: "Assignments", href: "/teacher/assignments", icon: ClipboardList },
      { title: "Submission Review", href: "/teacher/submissions", icon: CheckCircle2, badge: 12 },
    ],
  },
  {
    label: "Students",
    items: [
      { title: "Student List", href: "/teacher/students", icon: Users },
      { title: "Grades", href: "/teacher/grades", icon: BarChart3 },
    ],
  },
  {
    label: "Communication",
    items: [
      { title: "Announcements", href: "/teacher/announcements", icon: Bell },
      { title: "Schedule", href: "/teacher/schedule", icon: CalendarDays },
    ],
  },
];

const studentNavGroups: NavGroup[] = [
  {
    label: "Academic",
    items: [
      { title: "Dashboard", href: "/student", icon: LayoutDashboard },
      { title: "My Classes", href: "/student/classes", icon: BookOpen },
      { title: "Assignments", href: "/student/assignments", icon: ClipboardList },
      { title: "My Submissions", href: "/student/submissions", icon: FileText },
    ],
  },
  {
    label: "Progress",
    items: [
      { title: "Grades", href: "/student/grades", icon: Award },
      { title: "Calendar", href: "/student/calendar", icon: CalendarDays },
    ],
  },
];

const generalNavItems: NavItem[] = [
  { title: "Profile", href: "/profile", icon: User },
  { title: "Notifications", href: "/notifications", icon: Bell, badge: 4 },
];

const bottomNavItems: NavItem[] = [
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Help", href: "/help", icon: HelpCircle },
];

// ============= Helper Components =============

function SidebarSearchInput() {
  return (
    <div className="px-2 py-2">
      <SidebarInput placeholder="Search..." />
    </div>
  );
}

function NavGroupItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const isAction = item.href.startsWith("#");

  if (isAction) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
          <button type="button">
            <item.icon />
            <span>{item.title}</span>
          </button>
        </SidebarMenuButton>
        {item.badge !== undefined && item.badge > 0 && (
          <SidebarMenuBadge>{item.badge > 99 ? "99+" : item.badge}</SidebarMenuBadge>
        )}
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <Link href={item.href}>
          <item.icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
      {item.badge !== undefined && item.badge > 0 && (
        <SidebarMenuBadge>{item.badge > 99 ? "99+" : item.badge}</SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  );
}

function RoleMenu({ currentRole }: { currentRole: UserRole }) {
  const config = roleConfig[currentRole];
  const RoleIcon = config.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className={cn("flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br text-white", config.accentColor)}>
            <RoleIcon className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{config.label}</span>
          </div>
          <ChevronDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <div className={cn("flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br text-white", config.accentColor)}>
              <RoleIcon className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{config.label}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.entries(roleConfig) as [UserRole, RoleConfig][]).map(([key, value]) => {
          const Icon = value.icon;
          return (
            <DropdownMenuItem key={key} asChild>
              <Link href={value.dashboardHref}>
                <Icon />
                {value.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavUser({ user }: { user: { name: string; email: string; role: UserRole } }) {
  const config = roleConfig[user.role];
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className={cn("rounded-lg bg-gradient-to-br text-white text-xs font-semibold", config.accentColor)}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className={cn("rounded-lg bg-gradient-to-br text-white text-xs font-semibold", config.accentColor)}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// ============= App Sidebar =============

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role?: UserRole;
}

export function AppSidebar({ role = "student", ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navGroups =
    role === "admin"
      ? adminNavGroups
      : role === "teacher"
        ? teacherNavGroups
        : studentNavGroups;

  const currentRole = roleConfig[role];
  const displayName = user?.name ?? "Demo User";
  const displayEmail = user?.email ?? `demo.${role}@assignbridge.com`;

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin" || pathname === "/dashboard";
    if (href === "/teacher") return pathname === "/teacher" || pathname === "/dashboard";
    if (href === "/student") return pathname === "/student" || pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const handleLogout = React.useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    window.location.href = "/login";
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header: Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={currentRole.dashboardHref}>
                <div className={cn("flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br text-white", currentRole.accentColor)}>
                  <GraduationCap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AssignBridge</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Role Switcher */}
        <SidebarGroup>
          <RoleMenu currentRole={role} />
        </SidebarGroup>

        <SidebarSeparator className="mx-0" />

        {/* Search */}
        <SidebarSearchInput />

        {/* General Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalNavItems.map((item) => (
                <NavGroupItem key={item.href} item={item} isActive={isActive(item.href)} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Role-Specific Navigation */}
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <Collapsible
              defaultOpen
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger>
                    {group.label}
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <NavGroupItem key={item.href} item={item} isActive={isActive(item.href)} />
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          </SidebarGroup>
        ))}

        <SidebarSeparator className="mx-0" />

        {/* Bottom Navigation */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <NavUser user={{ name: displayName, email: displayEmail, role }} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

// ============= Re-exports from shadcn/ui =============
// Re-export sidebar primitives so they can be used directly from this module

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarMenuAction,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
