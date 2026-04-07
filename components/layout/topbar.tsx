"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
  HelpCircle,
  Bell,
  Search,
  ChevronDown,
  Sparkles,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar";

interface TopbarProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export function Topbar({
  userName = "Alex Johnson",
  userEmail = "alex@assignbridge.com",
  userAvatar,
}: TopbarProps) {
  const { theme, toggleTheme } = useAppTheme();
  const { toggleSidebar } = useSidebar();
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const notificationsRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdowns on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Page title from pathname
  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";

    const first = segments[0];
    const second = segments[1];

    if (first === "dashboard") return "Dashboard";
    if (first === "admin") {
      if (second === "users") return "User Management";
      if (second === "classes") return "Class Management";
      if (second === "courses") return "Course Management";
      if (second === "assignments") return "Assignments";
      if (second === "reports") return "Reports";
      if (second === "logs") return "Activity Logs";
      return "Admin Panel";
    }
    if (first === "teacher") {
      if (second === "classes") return "My Classes";
      if (second === "assignments") return "Assignments";
      if (second === "submissions") return "Submission Review";
      if (second === "announcements") return "Announcements";
      if (second === "schedule") return "Schedule";
      return "Teacher Workspace";
    }
    if (first === "student") {
      if (second === "classes") return "My Classes";
      if (second === "assignments") return "Assignments";
      if (second === "submissions") return "My Submissions";
      if (second === "grades") return "Grades";
      if (second === "calendar") return "Calendar";
      return "Student Portal";
    }
    if (first === "profile") return "My Profile";
    if (first === "settings") return "Settings";
    if (first === "help") return "Help Center";

    return first.charAt(0).toUpperCase() + first.slice(1);
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "New assignment uploaded",
      description: "Math 101 - Week 5 Quiz",
      time: "5 min ago",
      read: false,
      icon: "📝",
    },
    {
      id: 2,
      title: "Submission graded",
      description: "Your essay received 92/100",
      time: "1 hour ago",
      read: false,
      icon: "✅",
    },
    {
      id: 3,
      title: "Class reminder",
      description: "Physics lab starts in 30 min",
      time: "2 hours ago",
      read: false,
      icon: "🔔",
    },
    {
      id: 4,
      title: "New announcement",
      description: "Holiday schedule update",
      time: "Yesterday",
      read: true,
      icon: "📢",
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950"
      )}
    >
      {/* ===== LEFT: Toggle + Page Title ===== */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
        <h1 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {getPageTitle()}
        </h1>
      </div>

      {/* ===== CENTER: Search Bar ===== */}
      <div className="hidden md:flex flex-1 max-w-lg mx-8">
        <div className="relative flex w-full items-center">
          <Search className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search assignments, classes, students..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-16 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:ring-slate-700"
          />
          <kbd className="absolute right-3 hidden items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 lg:flex">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </div>
      </div>

      {/* ===== RIGHT: Actions ===== */}
      <div className="flex items-center gap-1">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="h-8 w-8 rounded-md text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Notifications */}
        <div ref={notificationsRef} className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setNotificationsOpen((p) => !p);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
            className="relative h-8 w-8 rounded-md text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>

          {/* Notifications Panel */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
                  Notifications
                </h3>
                <button className="text-[11px] text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "flex gap-3 border-b border-slate-50 px-4 py-3 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700/50",
                      !n.read && "bg-emerald-50/40 dark:bg-emerald-500/5"
                    )}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-base dark:bg-slate-700">
                      {n.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800 dark:text-white">
                        {n.title}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {n.description}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                        {n.time}
                      </p>
                    </div>
                    {!n.read && (
                      <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                    )}
                  </div>
                ))}
              </div>
              <Link
                href="/notifications"
                className="block border-t border-slate-100 px-4 py-2.5 text-center text-xs text-emerald-600 hover:bg-slate-50 dark:border-slate-700 dark:text-emerald-400 dark:hover:bg-slate-700"
                onClick={() => setNotificationsOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <Button
            variant="ghost"
            onClick={() => {
              setProfileOpen((p) => !p);
              setNotificationsOpen(false);
            }}
            aria-label="User menu"
            className={cn(
              "gap-2 rounded-md px-2 py-1 h-8",
              "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
              profileOpen && "bg-slate-100 dark:bg-slate-800"
            )}
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {initials}
              </div>
            )}
            <div className="hidden lg:flex flex-col items-start">
              <span className="text-xs font-medium leading-tight">
                {userName}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">
                {userEmail}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "hidden lg:block h-3.5 w-3.5 text-slate-400 transition-transform",
                profileOpen && "rotate-180"
              )}
            />
          </Button>

          {/* Profile Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800 z-50">
              <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-800 dark:text-white">
                  {userName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {userEmail}
                </p>
              </div>
              <div className="py-1.5">
                <Link
                  href="/profile"
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                  onClick={() => setProfileOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <Link
                  href="/help"
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                  onClick={() => setProfileOpen(false)}
                >
                  <HelpCircle className="h-4 w-4" />
                  Help Center
                </Link>
              </div>
              <div className="border-t border-slate-100 py-1.5 dark:border-slate-700">
                <button
                  onClick={() => {
                    localStorage.removeItem("auth_token");
                    localStorage.removeItem("user");
                    document.cookie =
                      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
                    window.location.href = "/login";
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pro Badge */}
        <div className="hidden lg:flex ml-1">
          <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 px-2.5 py-1 dark:border-amber-500/20 dark:from-amber-500/10 dark:to-amber-500/5">
            <Sparkles className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400">
              Pro
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
