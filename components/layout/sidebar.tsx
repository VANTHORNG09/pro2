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
  ChevronLeft,
  Settings,
  HelpCircle,
  LogOut,
  BarChart3,
  CalendarDays,
  MessageSquare,
  FolderKanban,
  PanelLeft,
} from "lucide-react";

// ============= Types =============

/** User role types for the application */
type UserRole = "admin" | "teacher" | "student";

/** Represents a single navigation item with optional badge count */
interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  /** Number of pending items (e.g., unread assignments) */
  badge?: number;
}

/** Groups navigation items under a labeled section */
interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Configuration for role-specific display properties */
interface RoleConfig {
  label: string;
  icon: React.ElementType;
  color: string;
}

// ============= Navigation Config =============
/** Maps user roles to their display configuration */
const roleConfig: Record<UserRole, RoleConfig> = {
  admin: {
    label: "Administrator",
    icon: Shield,
    color: "from-slate-600 to-blue-600",
  },
  teacher: {
    label: "Teacher",
    icon: GraduationCap,
    color: "from-sky-500 to-cyan-600",
  },
  student: {
    label: "Student",
    icon: School,
    color: "from-emerald-500 to-teal-600",
  },
};

const adminNavGroups: NavGroup[] = [
  {
    label: "Management",
    items: [
      { title: "User Management", href: "/admin/users", icon: Users },
      { title: "Class Management", href: "/admin/classes", icon: BookOpen },
      { title: "Course Management", href: "/admin/courses", icon: FolderKanban },
    ],
  },
  {
    label: "Analytics",
    items: [
      { title: "Reports", href: "/admin/reports", icon: BarChart3 },
      { title: "Activity Logs", href: "/admin/logs", icon: FileText },
    ],
  },
];

const teacherNavGroups: NavGroup[] = [
  {
    label: "Teaching",
    items: [
      { title: "My Classes", href: "/teacher/classes", icon: BookOpen },
      { title: "Assignments", href: "/teacher/assignments", icon: ClipboardList },
      { title: "Submission Review", href: "/teacher/submissions", icon: CheckCircle2 },
    ],
  },
  {
    label: "Communication",
    items: [
      { title: "Announcements", href: "/teacher/announcements", icon: MessageSquare },
      { title: "Schedule", href: "/teacher/schedule", icon: CalendarDays },
    ],
  },
];

const studentNavGroups: NavGroup[] = [
  {
    label: "Academic",
    items: [
      { title: "My Classes", href: "/student/classes", icon: BookOpen },
      { title: "Assignments", href: "/student/assignments", icon: ClipboardList },
      { title: "My Submissions", href: "/student/submissions", icon: FileText },
    ],
  },
  {
    label: "Progress",
    items: [
      { title: "Grades", href: "/student/grades", icon: BarChart3 },
      { title: "Calendar", href: "/student/calendar", icon: CalendarDays },
    ],
  },
];

const generalNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Profile", href: "/profile", icon: User },
];

// Bottom nav items - Settings, Help are links; Logout is an action
const bottomNavItems: NavItem[] = [
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Help", href: "/help", icon: HelpCircle },
  { title: "Logout", href: "#logout", icon: LogOut },
];

// ============= Sidebar Context =============
const SIDEBAR_COOKIE_NAME = "sidebar_collapsed";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/** Shape of the sidebar context value */
interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  isMobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextType | null>(null);

/**
 * Custom hook to access sidebar state and actions.
 * Must be used within a SidebarProvider.
 * @throws Error if used outside SidebarProvider
 */
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

/**
 * Provides sidebar state management including collapse, mobile behavior,
 * and cookie persistence.
 */
function SidebarProvider({ children, defaultCollapsed = false }: SidebarProviderProps) {
  const [isMobile, setIsMobile] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  // Check mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load collapsed state from cookie on mount
  React.useEffect(() => {
    const cookies = document.cookie.split("; ");
    const sidebarCookie = cookies.find((row) => row.startsWith(`${SIDEBAR_COOKIE_NAME}=`));
    if (sidebarCookie) {
      const value = sidebarCookie.split("=")[1];
      if (value === "true" || value === "false") {
        setCollapsed(value === "true");
      }
    }
  }, []);

  // Save collapsed state to cookie
  const handleSetCollapsed = React.useCallback((newCollapsed: boolean) => {
    setCollapsed(newCollapsed);
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${newCollapsed}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  }, []);

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      handleSetCollapsed(!collapsed);
    }
  }, [isMobile, collapsed, handleSetCollapsed]);

  // Close mobile sidebar on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobile && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
    [collapsed, handleSetCollapsed, toggleSidebar, isMobile, mobileOpen]
  );

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

// ============= Sidebar Trigger =============
interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

/**
 * Button component to toggle the sidebar visibility.
 * Supports custom styling and passes through button props.
 */
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
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
          "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          "h-9 w-9",
          className
        )}
        {...props}
      >
        <PanelLeft className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Toggle Sidebar</span>
      </button>
    );
  }
);

SidebarTrigger.displayName = "SidebarTrigger";

// ============= Sidebar Components =============
interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  side?: "left" | "right";
  variant?: "sidebar" | "floating";
}

/**
 * Main sidebar container with responsive behavior.
 * Renders as a sheet on mobile and collapsible sidebar on desktop.
 */
function Sidebar({ side = "left", variant = "sidebar", className, children, ...props }: SidebarProps) {
  const { collapsed, isMobile, mobileOpen, setMobileOpen } = useSidebar();

  // Mobile sidebar via sheet
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
            "fixed top-0 z-50 h-full w-72 transform bg-white shadow-xl transition-transform duration-300 dark:bg-slate-900",
            side === "left" ? "left-0" : "right-0",
            mobileOpen ? "translate-x-0" : side === "left" ? "-translate-x-full" : "translate-x-full",
            className
          )}
          {...props}
        >
          {children}
        </aside>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside
      role="navigation"
      aria-label="Main navigation"
      className={cn(
        "relative hidden shrink-0 flex-col border-r bg-slate-50/95 text-slate-900 backdrop-blur-md transition-all duration-300 lg:flex",
        "bg-[radial-gradient(140%_120%_at_0%_0%,rgba(59,130,246,0.08),transparent_60%)]",
        "dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100",
        "dark:bg-[radial-gradient(120%_120%_at_0%_0%,rgba(59,130,246,0.14),transparent_60%)]",
        collapsed ? "w-20" : "w-72",
        variant === "floating" && "m-2 rounded-xl border shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

// ============= Sidebar Header =============
/** Header container for sidebar branding and logo */
function SidebarHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col border-b border-slate-200 dark:border-slate-800", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ============= Sidebar Footer =============
/** Footer container for bottom navigation items */
function SidebarFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-auto border-t border-slate-200 dark:border-slate-800", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ============= Sidebar Content =============
/** Scrollable content area for navigation items with custom scrollbar */
function SidebarContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex-1 overflow-y-auto py-4 pr-3",
        "[--sidebar-scrollbar-thumb:#3b82f6]",
        "[--sidebar-scrollbar-track:rgba(226,232,240,0.7)]",
        "dark:[--sidebar-scrollbar-thumb:rgba(59,130,246,0.8)]",
        "dark:[--sidebar-scrollbar-track:rgba(30,41,59,0.6)]",
        // Smooth scrolling
        "scroll-smooth",
        // Decorative arrow tips to echo the slim-scroll indicator
        "before:pointer-events-none before:absolute before:right-1 before:top-2 before:h-0 before:w-0",
        "before:border-x-[4px] before:border-x-transparent before:border-b-[6px] before:border-b-slate-400/80",
        "dark:before:border-b-slate-500/80",
        "after:pointer-events-none after:absolute after:right-1 after:bottom-2 after:h-0 after:w-0",
        "after:border-x-[4px] after:border-x-transparent after:border-t-[6px] after:border-t-slate-400/80",
        "dark:after:border-t-slate-500/80",
        // Custom scrollbar styling for WebKit browsers (Chrome, Safari, Edge)
        "[&::-webkit-scrollbar]:w-2.5",
        "[&::-webkit-scrollbar-track]:rounded-full",
        "[&::-webkit-scrollbar-track]:bg-slate-200/70",
        "[&::-webkit-scrollbar-track]:dark:bg-slate-800/60",
        "[&::-webkit-scrollbar-thumb]:rounded-full",
        "[&::-webkit-scrollbar-thumb]:min-h-[48px]",
        "[&::-webkit-scrollbar-thumb]:bg-blue-500",
        "[&::-webkit-scrollbar-thumb]:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)]",
        "hover:[&::-webkit-scrollbar-thumb]:bg-blue-600",
        "dark:[&::-webkit-scrollbar-thumb]:bg-blue-500/80",
        "dark:hover:[&::-webkit-scrollbar-thumb]:bg-blue-400",
        className
      )}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor:
          "var(--sidebar-scrollbar-thumb) var(--sidebar-scrollbar-track)",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// ============= Sidebar Group =============
interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

/** Groups navigation items under an optional section label */
function SidebarGroup({ label, className, children, ...props }: SidebarGroupProps) {
  const { collapsed } = useSidebar();

  return (
    <div className={cn("mb-6", className)} {...props}>
      {label && !collapsed && (
        <p
          id={`sidebar-group-${label.toLowerCase().replace(/\s+/g, "-")}`}
          className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
        >
          {label}
        </p>
      )}
      <div
        {...(label && !collapsed ? { role: "group", "aria-labelledby": `sidebar-group-${label.toLowerCase().replace(/\s+/g, "-")}` } : {})}
        className="space-y-1"
      >
        {children}
      </div>
    </div>
  );
}

// ============= Sidebar Menu Item =============
interface SidebarMenuItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: React.ElementType;
  href: string;
  badge?: number;
  active?: boolean;
}

/**
 * Navigation link component with icon, optional badge, and active state.
 * Renders as a Next.js Link for client-side navigation, or as a button
 * when the href starts with "#" (for actions like logout).
 */
const SidebarMenuItem = React.memo(function SidebarMenuItem({
  icon: Icon,
  href,
  badge,
  active,
  children,
  className,
  onClick,
  ...props
}: SidebarMenuItemProps & { onClick?: React.MouseEventHandler }) {
  const { collapsed } = useSidebar();
  const isAction = href.startsWith("#");

  const containerClasses = cn(
    "group flex items-center rounded-xl text-sm font-medium transition-all duration-200",
    collapsed ? "mx-auto h-10 w-10 justify-center" : "gap-3 px-3 py-2.5",
    active
      ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-500/10 dark:bg-blue-500/10 dark:text-blue-300"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
    className
  );

  const iconClasses = cn(
    "shrink-0 transition-colors",
    collapsed ? "h-5 w-5" : "h-4 w-4",
    active
      ? "text-blue-600 dark:text-blue-400"
      : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
  );

  const renderContent = (
    <>
      <Icon className={iconClasses} aria-hidden="true" />
      {!collapsed && (
        <>
          <span className="flex-1 whitespace-nowrap">{children}</span>
          {badge !== undefined && badge > 0 && (
            <span
              className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              aria-label={`${badge} items`}
            >
              {badge}
            </span>
          )}
        </>
      )}
      {collapsed && badge !== undefined && badge > 0 && (
        <span
          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white"
          aria-label={`${badge} items`}
        >
          {badge}
        </span>
      )}
    </>
  );

  // Render as button for action hrefs (e.g., #logout, #help)
  if (isAction) {
    return (
      <button
        type="button"
        className={cn("relative w-full", containerClasses)}
        aria-current={active ? "page" : undefined}
        onClick={onClick}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {renderContent}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={containerClasses}
      aria-current={active ? "page" : undefined}
      {...props}
    >
      {renderContent}
    </Link>
  );
});

// ============= Sidebar Collapse Button =============
/**
 * Floating button to toggle sidebar collapse state on desktop.
 * Positioned at the edge of the sidebar.
 */
function SidebarCollapseButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { collapsed, toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-expanded={!collapsed}
      className={cn(
        "absolute -right-3 top-8 z-20 flex h-6 w-6 items-center justify-center rounded-full",
        "border bg-white text-slate-500 shadow-sm hover:bg-slate-100 hover:text-slate-700",
        "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700",
        "transition-all duration-300",
        className
      )}
      {...props}
    >
      <ChevronLeft
        className={cn("h-3.5 w-3.5 transition-transform duration-300", collapsed && "rotate-180")}
        aria-hidden="true"
      />
    </button>
  );
}

// ============= Main Sidebar Component =============
interface AppSidebarProps {
  role?: UserRole;
}

export function AppSidebar({ role = "student" }: AppSidebarProps) {
  const pathname = usePathname();
  const { collapsed, isMobile } = useSidebar();

  const navGroups =
    role === "admin" ? adminNavGroups : role === "teacher" ? teacherNavGroups : studentNavGroups;

  const currentRole = roleConfig[role];
  const RoleIcon = currentRole.icon;

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
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
    [handleLogout]
  );

  return (
    <Sidebar>
      {/* Logo Section */}
      <SidebarHeader className="border-b border-slate-200 dark:border-slate-800">
        <div className={cn("py-5", collapsed ? "px-3" : "px-5")}>
          <Link href="/dashboard" className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
            <div
              className={cn(
                "flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600",
                "shadow-md shadow-emerald-200/50 dark:shadow-emerald-900/30",
                collapsed ? "h-10 w-10" : "h-9 w-9"
              )}
            >
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden whitespace-nowrap">
                <p className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">
                  AssignBridge
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Smart Assignment Platform
                </p>
              </div>
            )}
          </Link>
        </div>
      </SidebarHeader>

      {/* Role Badge */}
      <div className={cn("border-b border-slate-200 py-4 dark:border-slate-800", collapsed ? "px-3" : "px-5")}>
        <div
          className={cn(
            "flex items-center rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/50",
            collapsed && "justify-center"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm",
              currentRole.color,
              collapsed ? "h-9 w-9" : "h-8 w-8"
            )}
          >
            <RoleIcon className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">Current Role</p>
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                {currentRole.label}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Content */}
      <SidebarContent>
        {/* General Section */}
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

        {/* Role-Specific Sections */}
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

      {/* Bottom Section */}
      <SidebarFooter className="border-t border-slate-200 dark:border-slate-800">
        <div className={cn("py-3", collapsed ? "px-3" : "px-4")}>
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

      {/* Collapse Button - only show on desktop */}
      {!isMobile && <SidebarCollapseButton />}
    </Sidebar>
  );
}

// ============= Export all components =============
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
  SidebarCollapseButton,
};
