// app/dashboard/student/page.tsx
// Student dashboard — server component fetches all data in parallel

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { AttendanceChart } from "@/components/charts/attendance-chart";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { RecentAssignments } from "@/components/dashboard/recent-assignments";
import { UpcomingQuizzes } from "@/components/dashboard/upcoming-quizzes";
import { AnnouncementsList } from "@/components/dashboard/announcements-list";
import { PageHeader } from "@/components/ui/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Student Dashboard" };

export default async function StudentDashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  // Fetch student profile + related data in parallel
  const [student, assignments, quizResults, attendances, announcements] =
    await Promise.all([
      prisma.student.findFirst({
        where: { userId: session.user.id },
        include: { user: true },
      }),
      prisma.assignment.findMany({
        where: { isActive: true },
        orderBy: { dueDate: "asc" },
        take: 5,
      }),
      prisma.quizResult.findMany({
        where: { student: { userId: session.user.id } },
        include: { quiz: true },
        orderBy: { submittedAt: "desc" },
        take: 5,
      }),
      prisma.attendance.findMany({
        where: { student: { userId: session.user.id } },
        orderBy: { date: "desc" },
        take: 30,
      }),
      prisma.announcement.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
    ]);

  // Calculate stats
  const totalAttendance = attendances.length;
  const presentCount = attendances.filter((a) => a.status === "PRESENT").length;
  const attendancePercent = totalAttendance
    ? Math.round((presentCount / totalAttendance) * 100)
    : 0;

  const avgScore = quizResults.length
    ? Math.round(quizResults.reduce((acc, r) => acc + r.percentage, 0) / quizResults.length)
    : 0;

  const stats = [
    {
      label: "Attendance",
      value: `${attendancePercent}%`,
      change: "+2.5%",
      trend: "up" as const,
      color: "blue",
    },
    {
      label: "Assignments",
      value: assignments.length.toString(),
      change: `${assignments.filter(a => new Date(a.dueDate) > new Date()).length} pending`,
      trend: "neutral" as const,
      color: "purple",
    },
    {
      label: "Quiz Score",
      value: `${avgScore}%`,
      change: "+5%",
      trend: "up" as const,
      color: "green",
    },
    {
      label: "CGPA",
      value: student?.cgpa?.toFixed(2) || "N/A",
      change: "Semester 1",
      trend: "neutral" as const,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title={`Good morning, ${session.user.name?.split(" ")[0]} 👋`}
        subtitle="Here's your academic overview for today"
      />

      {/* Stats */}
      <StatsGrid stats={stats} />

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceChart attendances={attendances as any} />
        </div>
        <PerformanceChart quizResults={quizResults as any} />
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentAssignments assignments={assignments as any} />
        </div>
        <div className="space-y-6">
          <UpcomingQuizzes />
          <AnnouncementsList announcements={announcements as any} />
        </div>
      </div>
    </div>
  );
}
