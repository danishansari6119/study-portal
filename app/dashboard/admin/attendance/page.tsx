// app/dashboard/admin/attendance/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { AdminAttendanceClient } from "@/components/dashboard/admin-attendance-client";

export const metadata = { title: "Manage Attendance" };

export default async function AdminAttendancePage() {
  const session = await auth();
  if (!session) redirect("/auth/login");
  const students = await prisma.student.findMany({ include: { user: true }, orderBy: { rollNumber: "asc" } });
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Attendance" subtitle="Mark and manage student attendance" />
      <AdminAttendanceClient students={students as any} adminId={session.user.id} />
    </div>
  );
}
