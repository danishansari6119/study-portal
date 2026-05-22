// app/dashboard/admin/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { AdminRecentActivity } from "@/components/dashboard/admin-recent-activity";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session || !["ADMIN","SUPER_ADMIN"].includes(session.user.role as string)) redirect("/dashboard/student");

  const [studentCount, noteCount, assignmentCount, quizCount] = await Promise.all([
    prisma.student.count(),
    prisma.note.count({ where: { isPublished: true } }),
    prisma.assignment.count({ where: { isActive: true } }),
    prisma.quiz.count({ where: { isActive: true } }),
  ]);

  const stats = [
    { label: "Students", value: studentCount.toString(), change: "Active", trend: "neutral" as const, color: "blue" as const },
    { label: "Notes", value: noteCount.toString(), change: "Published", trend: "up" as const, color: "green" as const },
    { label: "Assignments", value: assignmentCount.toString(), change: "Active", trend: "neutral" as const, color: "purple" as const },
    { label: "Quizzes", value: quizCount.toString(), change: "Live", trend: "up" as const, color: "orange" as const },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader title="Admin Dashboard" subtitle="Manage students, content, and academic activities" />
      <StatsGrid stats={stats} />
      <AdminRecentActivity />
    </div>
  );
}
