"use client";

import { useState, useEffect, useRef } from "react";
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
  Menu,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

interface TopbarProps {
  onMenuClick?: () => void;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  unreadNotifications?: number;
}

export function Topbar({
  onMenuClick,
  userName = "Alex Johnson",
  userEmail = "alex@assignbridge.com",
  userAvatar,
  unreadNotifications = 3,
}: TopbarProps) {
  const { theme, toggleTheme } = useAppTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get page title from pathname
  const getPageTitle = () => {
    const path = pathname.split("/")[1];
    const titles: Record<string, string> = {
      dashboard: "Dashboard",
      admin: "Admin Panel",
      teacher: "Teacher Workspace",
      student: "Student Portal",
      profile: "My Profile",
      settings: "Settings",
    };
    return titles[path] || "AssignBridge";
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

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 w-full items-center justify-between",
        "border-b bg-white/95 backdrop-blur-sm px-4 md:px-6",
        "dark:border-slate-800 dark:bg-slate-900/95",
        "transition-all duration-300"
      )}
    >
      {/* Left Section: Logo and Page Title */}
      <div className="flex items-center gap-2">

        {/* Logo - Visible on mobile, hidden on desktop when sidebar is present? Keep for consistency */}
        {/* <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl",
              "bg-gradient-to-br from-emerald-600 to-teal-600",
              "shadow-md shadow-emerald-200/50 dark:shadow-emerald-900/30",
              "transition-all duration-300 group-hover:scale-105"
            )}
          >
            <span className="text-lg font-bold text-white">A</span>
          </div>
        </Link> */}

        {/* Page Title Divider */}
        <div className="hidden md:block h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

        {/* Dynamic Page Title */}
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Center Section: Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
        <div
          className={cn(
            "relative flex w-full items-center transition-all duration-200",
            searchFocused && "scale-[1.02]"
          )}
        >
          <Search
            className={cn(
              "absolute left-3 h-4 w-4 transition-colors",
              searchFocused
                ? "text-emerald-500 dark:text-emerald-400"
                : "text-slate-400 dark:text-slate-500"
            )}
          />
          <input
            type="text"
            placeholder="Search assignments, classes, students..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={cn(
              "w-full rounded-xl border bg-slate-50 py-2 pl-9 pr-4 text-sm",
              "placeholder:text-slate-400 dark:placeholder:text-slate-500",
              "focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
              "dark:border-slate-700 dark:bg-slate-800/50 dark:text-white",
              "transition-all duration-200",
              searchFocused
                ? "border-emerald-300 dark:border-emerald-500/50 shadow-sm"
                : "border-slate-200 dark:border-slate-700"
            )}
          />
          <kbd className="absolute right-3 hidden items-center gap-0.5 rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-400 lg:flex">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className={cn(
            "rounded-full transition-all duration-300",
            "text-slate-600 hover:bg-slate-100",
            "dark:text-slate-300 dark:hover:bg-slate-800"
          )}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-slate-600" />
          )}
        </Button>

        {/* Notifications Dropdown */}
        <div ref={notificationsRef} className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setNotificationsOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
            className="relative rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>

          {/* Notifications Panel */}
          {notificationsOpen && (
            <div
              className={cn(
                "absolute right-0 mt-2 w-80 sm:w-96 rounded-xl",
                "bg-white shadow-xl ring-1 ring-black/5",
                "dark:bg-slate-800 dark:ring-white/10",
                "z-50 overflow-hidden"
              )}
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  Notifications
                </h3>
                <button className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                  Mark all as read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex gap-3 border-b border-slate-50 px-4 py-3 transition-colors hover:bg-slate-50",
                      "dark:border-slate-700/50 dark:hover:bg-slate-700/50",
                      !notification.read && "bg-emerald-50/30 dark:bg-emerald-500/5"
                    )}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-lg dark:bg-slate-700">
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {notification.description}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                ))}
              </div>
              <Link
                href="/notifications"
                className="block border-t border-slate-100 px-4 py-3 text-center text-sm text-emerald-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-emerald-400 dark:hover:bg-slate-700"
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
              setProfileOpen((prev) => !prev);
              setNotificationsOpen(false);
            }}
            aria-label="User menu"
            className={cn(
              "gap-2 rounded-full px-2 py-1.5",
              "text-slate-700 hover:bg-slate-100",
              "dark:text-slate-200 dark:hover:bg-slate-800",
              profileOpen && "bg-slate-100 dark:bg-slate-800"
            )}
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full",
                  "bg-gradient-to-br from-emerald-500 to-teal-600",
                  "text-xs font-bold text-white"
                )}
              >
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium">{userName}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {userEmail}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "hidden sm:block h-4 w-4 text-slate-500 transition-transform duration-200",
                profileOpen && "rotate-180"
              )}
            />
          </Button>

          {/* Profile Menu */}
          {profileOpen && (
            <div
              className={cn(
                "absolute right-0 mt-2 w-56 rounded-xl",
                "bg-white shadow-xl ring-1 ring-black/5",
                "dark:bg-slate-800 dark:ring-white/10",
                "z-50 overflow-hidden"
              )}
            >
              <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-800 dark:text-white">
                  {userName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {userEmail}
                </p>
              </div>
              <div className="py-2">
                <Link
                  href="/profile"
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                  onClick={() => setProfileOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <Link
                  href="/help"
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                  onClick={() => setProfileOpen(false)}
                >
                  <HelpCircle className="h-4 w-4" />
                  Help Center
                </Link>
              </div>
              <div className="border-t border-slate-100 py-2 dark:border-slate-700">
                <button
                  onClick={() => {
                    // Handle logout
                    setProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Upgrade Badge - Optional */}
        <div className="hidden lg:block ml-1">
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2.5 py-1",
              "bg-gradient-to-r from-amber-50 to-amber-100",
              "dark:from-amber-500/10 dark:to-amber-500/5",
              "border border-amber-200 dark:border-amber-500/20"
            )}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
              Pro
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}