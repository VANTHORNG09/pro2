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
  PanelLeft,
  X,
  Clock,
  Inbox,
  TrendingUp,
  Target,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// ============= Types =============

type UserRole = "admin" | "teacher" | "student";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface RoleConfig {
  label: string;
  icon: React.ElementType;
  badgeBg: string;
  badgeText: string;
  dashboardHref: string;
}

// ============= Role Config =============

const roleConfig: Record<UserRole, RoleConfig> = {
  admin: {
    label: "Administrator",
    icon: Shield,
    badgeBg: "bg-blue-50 dark:bg-blue-500/10",
    badgeText: "text-blue-600 dark:text-blue-400",
    dashboardHref: "/admin",
  },
  teacher: {
    label: "Teacher",
    icon: GraduationCap,
    badgeBg: "bg-emerald-50 dark:bg-emerald-500/10",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    dashboardHref: "/teacher",
  },
  student: {
    label: "Student",
    icon: School,
    badgeBg: "bg-cyan-50 dark:bg-cyan-500/10",
    badgeText: "text-cyan-600 dark:text-cyan-400",
    dashboardHref: "/student",
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
      {
        title: "All Submissions",
        href: "/admin/submissions",
        icon: Inbox,
        badge: 14,
      },
      {
        title: "Pending Review",
        href: "/admin/viewpanding",
        icon: Clock,
        badge: 8,
      },
    ],
  },
  {
    label: "Analytics & Reports",
    items: [
      { title: "Reports", href: "/admin/reports", icon: BarChart3 },
      {
        title: "Assignment Analytics",
        href: "/admin/assignmentanalytics",
        icon: TrendingUp,
      },
      {
        title: "Class-wise Summary",
        href: "/admin/class-wisesummary",
        icon: Target,
      },
      { title: "Grade Report", href: "/admin/gradereport", icon: Award },
      {
        title: "Student Performance",
        href: "/admin/studentperformance",
        icon: Users,
      },
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
      {
        title: "Assignments",
        href: "/teacher/assignments",
        icon: ClipboardList,
      },
      {
        title: "Submission Review",
        href: "/teacher/submissions",
        icon: CheckCircle2,
        badge: 12,
      },
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
      {
        title: "Assignments",
        href: "/student/assignments",
        icon: ClipboardList,
      },
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
  { title: "Logout", href: "#logout", icon: LogOut },
];

// ============= Sidebar Context =============

const SIDEBAR_COOKIE_NAME = "sidebar_collapsed";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  isMobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextType | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

// ============= Sidebar Provider =============

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

function SidebarProvider({
  children,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const [isMobile, setIsMobile] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    try {
      const cookies = document.cookie.split("; ");
      const sidebarCookie = cookies.find((row) =>
        row.startsWith(`${SIDEBAR_COOKIE_NAME}=`),
      );
      if (sidebarCookie) {
        const value = sidebarCookie.split("=")[1];
        if (value === "true" || value === "false") {
          setCollapsed(value === "true");
        }
      }
    } catch {
      // Cookie access denied
    }
  }, []);

  const handleSetCollapsed = React.useCallback((newCollapsed: boolean) => {
    setCollapsed(newCollapsed);
    try {
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${newCollapsed}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    } catch {
      // Cookie access denied
    }
  }, []);

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      handleSetCollapsed(!collapsed);
    }
  }, [isMobile, collapsed, handleSetCollapsed]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobile && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, mobileOpen]);

  React.useEffect(() => {
    if (isMobile && mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, mobileOpen]);

  const value = React.useMemo(
    () => ({
      collapsed,
      setCollapsed: handleSetCollapsed,
      toggleSidebar,
      isMobile,
      mobileOpen,
      setMobileOpen,
    }),
    [collapsed, handleSetCollapsed, toggleSidebar, isMobile, mobileOpen],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

// ============= Sidebar Trigger =============

interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar, isMobile, mobileOpen, collapsed } = useSidebar();
    const expanded = isMobile ? mobileOpen : !collapsed;

    return (
      <button
        ref={ref}
        onClick={(e) => {
          onClick?.(e);
          toggleSidebar();
        }}
        aria-label="Toggle sidebar"
        aria-expanded={expanded}
        data-state={expanded ? "open" : "closed"}
        className={cn(
          "inline-flex items-center justify-center rounded-md p-2 transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <PanelLeft className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Toggle Sidebar</span>
      </button>
    );
  },
);
SidebarTrigger.displayName = "SidebarTrigger";

// ============= Sidebar Components =============

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  side?: "left" | "right";
  variant?: "sidebar" | "floating";
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  className,
  children,
  ...props
}: SidebarProps) {
  const { collapsed, isMobile, mobileOpen, setMobileOpen } = useSidebar();

  if (isMobile) {
    return (
      <>
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
        <aside
          role="navigation"
          aria-label="Mobile navigation"
          aria-hidden={!mobileOpen}
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-950 shadow-xl transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
          {...props}
        >
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute right-3 top-3 z-10 rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
          <div className="h-full flex flex-col">{children}</div>
        </aside>
      </>
    );
  }

  return (
    <aside
      role="navigation"
      aria-label="Main navigation"
      className={cn(
        "relative hidden shrink-0 flex-col border-r bg-white dark:bg-slate-950 transition-[width] duration-300 ease-in-out lg:flex",
        collapsed ? "w-[72px]" : "w-[260px]",
        variant === "floating" && "m-2 rounded-xl border shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

function SidebarHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center border-b border-slate-200 dark:border-slate-800",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-auto shrink-0 border-t border-slate-200 dark:border-slate-800",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative flex-1 overflow-y-auto py-3", className)}
      style={{ scrollbarWidth: "thin" }}
      {...props}
    >
      <div className="space-y-1 px-3">{children}</div>
    </div>
  );
}

// ============= Sidebar Group =============

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

function SidebarGroup({
  label,
  className,
  children,
  ...props
}: SidebarGroupProps) {
  const { collapsed } = useSidebar();

  return (
    <div className={cn("mb-3", className)} {...props}>
      {label && (
        <p
          className={cn(
            "mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500",
            collapsed && "text-center text-[8px]",
          )}
        >
          {collapsed ? "···" : label}
        </p>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

// ============= Sidebar Menu Item =============

interface SidebarMenuItemProps {
  icon: React.ElementType;
  href: string;
  badge?: number;
  active?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const SidebarMenuItem = React.memo(function SidebarMenuItem({
  icon: Icon,
  href,
  badge,
  active,
  children,
  className,
  onClick,
}: SidebarMenuItemProps) {
  const { collapsed } = useSidebar();
  const isAction = href.startsWith("#");

  const baseClasses = cn(
    "group relative flex items-center rounded-lg text-sm font-medium transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    active
      ? "bg-slate-200/80 text-slate-900 dark:bg-slate-700/60 dark:text-white"
      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200",
    collapsed ? "mx-auto justify-center h-10 w-10" : "gap-3 px-3 py-2",
  );

  const iconClasses = cn(
    "shrink-0",
    collapsed ? "h-5 w-5" : "h-4 w-4",
    active
      ? "text-slate-700 dark:text-white"
      : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300",
  );

  const renderContent = (
    <>
      <Icon className={iconClasses} aria-hidden="true" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{children}</span>
          {badge !== undefined && badge > 0 && (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1.5 text-[10px] font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
              {badge > 99 ? "99+" : badge}
            </span>
          )}
        </>
      )}
      {collapsed && badge !== undefined && badge > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[9px] font-bold text-white dark:bg-slate-100 dark:text-slate-900">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </>
  );

  if (isAction) {
    return (
      <button
        type="button"
        className={cn("w-full", baseClasses, className)}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      >
        {renderContent}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={cn(baseClasses, className)}
      aria-current={active ? "page" : undefined}
    >
      {renderContent}
    </Link>
  );
});

// ============= Role Badge =============

interface RoleBadgeProps {
  currentRole: UserRole;
}

function RoleBadge({ currentRole }: RoleBadgeProps) {
  const { collapsed } = useSidebar();
  const config = roleConfig[currentRole];
  const RoleIcon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center rounded-lg px-3 py-2.5",
        config.badgeBg,
        collapsed ? "justify-center p-2" : "gap-3",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-md",
          config.badgeText,
        )}
      >
        <RoleIcon
          className={cn("h-4 w-4", collapsed ? "h-5 w-5" : "h-4 w-4")}
        />
      </div>
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Role
          </p>
          <p className={cn("truncate text-sm font-semibold", config.badgeText)}>
            {config.label}
          </p>
        </div>
      )}
    </div>
  );
}

// ============= Main App Sidebar =============

interface AppSidebarProps {
  role?: UserRole;
}

export function AppSidebar({ role = "student" }: AppSidebarProps) {
  const pathname = usePathname();
  const { collapsed, isMobile } = useSidebar();

  const navGroups =
    role === "admin"
      ? adminNavGroups
      : role === "teacher"
        ? teacherNavGroups
        : studentNavGroups;

  const currentRole = roleConfig[role];

  const isActive = (href: string) => {
    if (href === "/admin")
      return pathname === "/admin" || pathname === "/dashboard";
    if (href === "/teacher")
      return pathname === "/teacher" || pathname === "/dashboard";
    if (href === "/student")
      return pathname === "/student" || pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const handleLogout = React.useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    window.location.href = "/login";
  }, []);

  const handleBottomNavClick = React.useCallback(
    (href: string) => {
      if (href === "#logout") {
        handleLogout();
      }
    },
    [handleLogout],
  );

  return (
    <Sidebar>
      {/* Logo / Branding */}
      <SidebarHeader className="h-14 justify-between px-4">
        <Link
          href={currentRole.dashboardHref}
          className={cn(
            "flex items-center",
            collapsed ? "justify-center w-full" : "gap-2.5",
          )}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 dark:bg-white">
            <GraduationCap className="h-4 w-4 text-white dark:text-slate-900" />
          </div>
          {!collapsed && (
            <span className="text-sm font-bold tracking-tight text-slate-800 dark:text-white">
              AssignBridge
            </span>
          )}
        </Link>
      </SidebarHeader>

      {/* Role Badge */}
      <div className="px-3 py-3">
        <RoleBadge currentRole={role} />
      </div>

      {/* Navigation */}
      <SidebarContent>
        {/* General */}
        <SidebarGroup label="General">
          {generalNavItems.map((item) => (
            <SidebarMenuItem
              key={item.href}
              icon={item.icon}
              href={item.href}
              active={isActive(item.href)}
            >
              {item.title}
            </SidebarMenuItem>
          ))}
        </SidebarGroup>

        {/* Role-Specific */}
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} label={group.label}>
            {group.items.map((item) => (
              <SidebarMenuItem
                key={item.href}
                icon={item.icon}
                href={item.href}
                badge={item.badge}
                active={isActive(item.href)}
              >
                {item.title}
              </SidebarMenuItem>
            ))}
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Bottom Navigation */}
      <SidebarFooter className="px-3 py-3">
        <div className="space-y-0.5">
          {bottomNavItems.map((item) => (
            <SidebarMenuItem
              key={item.href}
              icon={item.icon}
              href={item.href}
              active={isActive(item.href)}
              onClick={() => handleBottomNavClick(item.href)}
            >
              {item.title}
            </SidebarMenuItem>
          ))}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
// ============= Exports =============
export {
  SidebarProvider,
  useSidebar,
  SidebarTrigger,
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarMenuItem,
};
