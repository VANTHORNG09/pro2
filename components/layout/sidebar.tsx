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
  ChevronsLeft,
  ChevronsRight,
  Search,
  Zap,
  Database,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";

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
  badgeBg: string;
  badgeText: string;
  dashboardHref: string;
  accentColor: string;
}

// ============= Role Config =============

const roleConfig: Record<UserRole, RoleConfig> = {
  admin: {
    label: "Administrator",
    icon: Shield,
    badgeBg: "bg-blue-50 dark:bg-blue-500/10",
    badgeText: "text-blue-600 dark:text-blue-400",
    dashboardHref: "/admin",
    accentColor: "from-blue-500 to-indigo-600",
  },
  teacher: {
    label: "Teacher",
    icon: GraduationCap,
    badgeBg: "bg-emerald-50 dark:bg-emerald-500/10",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    dashboardHref: "/teacher",
    accentColor: "from-emerald-500 to-teal-600",
  },
  student: {
    label: "Student",
    icon: School,
    badgeBg: "bg-cyan-50 dark:bg-cyan-500/10",
    badgeText: "text-cyan-600 dark:text-cyan-400",
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
      { title: "Pending Review", href: "/admin/viewpanding", icon: Clock, badge: 8 },
    ],
  },
  {
    label: "Analytics & Reports",
    items: [
      { title: "Reports", href: "/admin/reports", icon: BarChart3 },
      { title: "Assignment Analytics", href: "/admin/assignmentanalytics", icon: TrendingUp },
      { title: "Class-wise Summary", href: "/admin/class-wisesummary", icon: Target },
      { title: "Grade Report", href: "/admin/gradereport", icon: Award },
      { title: "Student Performance", href: "/admin/studentperformance", icon: Users },
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
  { title: "Logout", href: "#logout", icon: LogOut },
];

// ============= Sidebar Context =============

const SIDEBAR_COOKIE_NAME = "sidebar_collapsed";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  isMobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextType | null>(null);

export function useSidebar() {
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

export function SidebarProvider({
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

  // Keyboard shortcut: Ctrl/Cmd + B
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (e.metaKey || e.ctrlKey)
      ) {
        e.preventDefault();
        toggleSidebar();
      }
      if (e.key === "Escape" && isMobile && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, mobileOpen, toggleSidebar]);

  // Prevent body scroll when mobile sidebar is open
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

interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("size-9", className)}
        onClick={(e) => {
          onClick?.(e);
          toggleSidebar();
        }}
        aria-label="Toggle sidebar"
        {...props}
      >
        <PanelLeft className="size-5" />
      </Button>
    );
  },
);
SidebarTrigger.displayName = "SidebarTrigger";

// ============= Sidebar Components =============

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  side?: "left" | "right";
  variant?: "sidebar" | "floating";
}

export function Sidebar({
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
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
        <aside
          role="navigation"
          aria-label="Mobile navigation"
          aria-hidden={!mobileOpen}
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
          {...props}
        >
          <div className="absolute right-3 top-3 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="size-4" />
            </Button>
          </div>
          <div className="h-full flex flex-col">{children}</div>
        </aside>
      </>
    );
  }

  return (
    <aside
      role="navigation"
      aria-label="Main navigation"
      data-collapsed={collapsed}
      className={cn(
        "group relative hidden shrink-0 flex-col border-r bg-white dark:bg-slate-950 transition-all duration-300 ease-in-out lg:flex",
        collapsed
          ? "w-[72px]"
          : "w-[260px]",
        variant === "floating" && "m-2 rounded-xl border shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center border-b border-slate-200/80 dark:border-slate-800",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-auto shrink-0 border-t border-slate-200/80 dark:border-slate-800",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative flex-1 overflow-y-auto py-3", className)}
      style={{ scrollbarWidth: "thin", scrollbarColor: "hsl(var(--muted)) transparent" }}
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

export function SidebarGroup({
  label,
  className,
  children,
  ...props
}: SidebarGroupProps) {
  const { collapsed } = useSidebar();

  return (
    <div className={cn("mb-3", className)} {...props}>
      {label && (
        <div className={cn(
          "mb-1.5 flex items-center px-3",
          collapsed && "justify-center",
        )}>
          <p
            className={cn(
              "text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500",
              collapsed && "text-[8px]",
            )}
          >
            {collapsed ? "\u00B7\u00B7\u00B7" : label}
          </p>
        </div>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

// ============= Sidebar Search =============

export function SidebarSearch({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { collapsed } = useSidebar();

  if (collapsed) return null;

  return (
    <div className={cn("px-3 py-2", className)} {...props}>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search..."
          className="h-8 w-full pl-8 text-sm border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus-visible:ring-1"
        />
      </div>
    </div>
  );
}

// ============= Sidebar Menu Item =============

interface SidebarMenuItemProps {
  icon: LucideIcon;
  href: string;
  badge?: number;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export const SidebarMenuItem = React.memo(function SidebarMenuItem({
  icon: Icon,
  href,
  badge,
  active,
  disabled,
  children,
  className,
  onClick,
}: SidebarMenuItemProps) {
  const { collapsed } = useSidebar();
  const isAction = href.startsWith("#");

  const baseClasses = cn(
    "group relative flex items-center rounded-lg text-sm font-medium transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    disabled && "pointer-events-none opacity-50",
    active
      ? "bg-slate-200/80 text-slate-900 dark:bg-slate-700/60 dark:text-white"
      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200",
    collapsed ? "mx-auto size-10 justify-center" : "gap-3 px-3 py-2",
  );

  const iconClasses = cn(
    "shrink-0 transition-colors",
    collapsed ? "size-5" : "size-4",
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
            <span className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-900 px-1.5 text-[10px] font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
              {badge > 99 ? "99+" : badge}
            </span>
          )}
        </>
      )}
      {collapsed && badge !== undefined && badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-slate-900 text-[8px] font-bold text-white dark:bg-slate-100 dark:text-slate-900">
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

  // Wrap collapsed items in tooltip
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(baseClasses, className)}
            aria-current={active ? "page" : undefined}
          >
            {renderContent}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {children}
          {badge !== undefined && badge > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-slate-900 px-1.5 text-[10px] font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
              {badge > 99 ? "99+" : badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
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

// ============= Sidebar Separator =============

export function SidebarSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { collapsed } = useSidebar();

  if (collapsed) return null;

  return (
    <div
      className={cn("mx-3 my-2 h-px bg-slate-200 dark:bg-slate-800", className)}
      {...props}
    />
  );
}

// ============= Role Badge =============

interface RoleBadgeProps {
  currentRole: UserRole;
}

function RoleBadge({ currentRole }: RoleBadgeProps) {
  const { collapsed } = useSidebar();
  const config = roleConfig[currentRole];
  const RoleIcon = config.icon;

  const badgeContent = (
    <div
      className={cn(
        "flex items-center rounded-lg px-3 py-2.5",
        config.badgeBg,
        collapsed ? "justify-center p-2" : "gap-3",
      )}
    >
      <div className={cn("flex items-center justify-center rounded-md", config.badgeText)}>
        <RoleIcon className={cn("size-4", collapsed && "size-5")} />
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

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{badgeContent}</TooltipTrigger>
        <TooltipContent side="right">{config.label}</TooltipContent>
      </Tooltip>
    );
  }

  return badgeContent;
}

// ============= User Profile =============

interface UserProfileProps {
  name: string;
  email: string;
  role: UserRole;
}

export function UserProfile({ name, email, role }: UserProfileProps) {
  const { collapsed } = useSidebar();
  const config = roleConfig[role];
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="mx-auto size-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{initials}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="flex flex-col">
            <span className="font-medium">{name}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className={cn(
        "size-10 rounded-full bg-gradient-to-br flex items-center justify-center",
        config.accentColor
      )}>
        <span className="text-sm font-semibold text-white">{initials}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{email}</p>
      </div>
    </div>
  );
}

// ============= Collapse Toggle =============

function SidebarCollapseToggle() {
  const { collapsed, toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="absolute -right-3 top-5 z-10 flex size-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? (
        <ChevronsRight className="size-3" />
      ) : (
        <ChevronsLeft className="size-3" />
      )}
    </button>
  );
}

// ============= Main App Sidebar =============

interface AppSidebarProps {
  role?: UserRole;
}

export function AppSidebar({ role = "student" }: AppSidebarProps) {
  const pathname = usePathname();
  const { collapsed } = useSidebar();
  const { user } = useAuth();

  const navGroups =
    role === "admin"
      ? adminNavGroups
      : role === "teacher"
        ? teacherNavGroups
        : studentNavGroups;

  const currentRole = roleConfig[role];

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

  const handleBottomNavClick = React.useCallback(
    (href: string) => {
      if (href === "#logout") handleLogout();
    },
    [handleLogout],
  );

  const displayName = user?.name ?? "Demo User";
  const displayEmail = user?.email ?? `demo.${role}@assignbridge.com`;

  return (
    <Sidebar>
      {/* Logo / Branding */}
      <SidebarHeader className="h-14 justify-between px-4">
        <Link
          href={currentRole.dashboardHref}
          className={cn(
            "flex items-center transition-all",
            collapsed ? "justify-center w-full" : "gap-2.5",
          )}
        >
          <div className={cn(
            "flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
            currentRole.accentColor,
            collapsed ? "size-9" : "size-8"
          )}>
            <GraduationCap className="size-4 text-white" />
          </div>
          {!collapsed && (
            <span className="text-sm font-bold tracking-tight">
              AssignBridge
            </span>
          )}
        </Link>
      </SidebarHeader>

      {/* Collapse Toggle */}
      <SidebarCollapseToggle />

      {/* User Profile */}
      <div className="px-3 py-3">
        <UserProfile name={displayName} email={displayEmail} role={role} />
      </div>

      {/* Role Badge */}
      <div className="px-3 pb-2">
        <RoleBadge currentRole={role} />
      </div>

      {/* Search */}
      <SidebarSearch />

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
              badge={item.badge}
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
                disabled={item.disabled}
              >
                {item.title}
              </SidebarMenuItem>
            ))}
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer / Bottom Navigation */}
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
