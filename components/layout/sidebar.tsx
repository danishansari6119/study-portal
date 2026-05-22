// components/layout/sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, FileText, Award, Calendar,
  BarChart3, Users, Bell, Settings, ChevronLeft, ChevronRight,
  GraduationCap, ClipboardList, Megaphone, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

// Navigation items per role
const studentNav = [
  { href: "/dashboard/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/student/notes", label: "Notes", icon: BookOpen },
  { href: "/dashboard/student/assignments", label: "Assignments", icon: FileText },
  { href: "/dashboard/student/quizzes", label: "Quizzes", icon: Award },
  { href: "/dashboard/student/attendance", label: "Attendance", icon: Calendar },
  { href: "/dashboard/student/timetable", label: "Timetable", icon: Clock },
  { href: "/dashboard/student/profile", label: "Profile", icon: Settings },
];

const adminNav = [
  { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/admin/students", label: "Students", icon: Users },
  { href: "/dashboard/admin/notes", label: "Notes", icon: BookOpen },
  { href: "/dashboard/admin/assignments", label: "Assignments", icon: FileText },
  { href: "/dashboard/admin/quizzes", label: "Quizzes", icon: Award },
  { href: "/dashboard/admin/attendance", label: "Attendance", icon: ClipboardList },
  { href: "/dashboard/admin/announcements", label: "Announcements", icon: Megaphone },
];

interface SidebarProps {
  role: string;
}

export function Sidebar({ role }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = role === "ADMIN" || role === "SUPER_ADMIN" ? adminNav : studentNav;

  return (
    <motion.aside
      animate={{ width: collapsed ? 70 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col h-full bg-card border-r border-border relative shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
        <div className="w-8 h-8 shrink-0 rounded-lg gradient-primary flex items-center justify-center">
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-foreground whitespace-nowrap"
            >
              StudyPortal
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/dashboard/student" && href !== "/dashboard/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn("sidebar-link", isActive && "active")}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Role badge */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-3 mb-3 p-3 bg-primary/10 rounded-xl"
          >
            <p className="text-xs font-medium text-primary capitalize">
              {role.toLowerCase()} account
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Full access enabled</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center hover:bg-accent transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
