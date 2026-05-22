// app/dashboard/student/attendance/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { AttendanceSubjectCard } from "@/components/dashboard/attendance-subject-card";
import { AttendanceMonthChart } from "@/components/charts/attendance-month-chart";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Attendance" };

export default async function AttendancePage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const attendances = await prisma.attendance.findMany({
    where: { student: { userId: session.user.id } },
    orderBy: { date: "desc" },
  });

  // Group by subject
  const subjectMap: Record<string, { total: number; present: number; absent: number; late: number }> = {};
  attendances.forEach((a) => {
    if (!subjectMap[a.subject]) subjectMap[a.subject] = { total: 0, present: 0, absent: 0, late: 0 };
    subjectMap[a.subject].total++;
    if (a.status === "PRESENT") subjectMap[a.subject].present++;
    else if (a.status === "ABSENT") subjectMap[a.subject].absent++;
    else if (a.status === "LATE") subjectMap[a.subject].late++;
  });

  const overallPercent = attendances.length
    ? Math.round((attendances.filter(a => a.status === "PRESENT").length / attendances.length) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Attendance"
        subtitle={`Overall: ${overallPercent}% attendance`}
      />

      {/* Overall stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Present", count: attendances.filter(a => a.status === "PRESENT").length, color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
          { label: "Absent", count: attendances.filter(a => a.status === "ABSENT").length, color: "text-red-600 bg-red-100 dark:bg-red-900/30" },
          { label: "Late", count: attendances.filter(a => a.status === "LATE").length, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
        ].map(s => (
          <div key={s.label} className={`p-4 rounded-2xl ${s.color} text-center`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-sm font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Monthly chart */}
      <AttendanceMonthChart attendances={attendances as any} />

      {/* Subject-wise breakdown */}
      <div>
        <h3 className="font-semibold mb-4">Subject-wise Attendance</h3>
        {Object.keys(subjectMap).length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>No attendance records yet</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(subjectMap).map(([subject, data]) => (
              <AttendanceSubjectCard key={subject} subject={subject} data={data} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
