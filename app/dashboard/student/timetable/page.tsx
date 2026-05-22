// app/dashboard/student/timetable/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { TimetableGrid } from "@/components/dashboard/timetable-grid";

export const metadata = { title: "Timetable" };

export default async function TimetablePage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const student = await prisma.student.findFirst({ where: { userId: session.user.id } });
  const timetable = await prisma.timetable.findMany({
    where: { isActive: true, semester: student?.semester || 1 },
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Weekly Timetable" subtitle={`Semester ${student?.semester || 1} schedule`} />
      <TimetableGrid entries={timetable as any} />
    </div>
  );
}
