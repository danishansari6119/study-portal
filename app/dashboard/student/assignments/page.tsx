// app/dashboard/student/assignments/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { AssignmentCard } from "@/components/dashboard/assignment-card";

export const metadata = { title: "Assignments" };

export default async function AssignmentsPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const student = await prisma.student.findFirst({ where: { userId: session.user.id } });

  const [assignments, submissions] = await Promise.all([
    prisma.assignment.findMany({ where: { isActive: true }, orderBy: { dueDate: "asc" } }),
    student ? prisma.submission.findMany({ where: { studentId: student.id }, select: { assignmentId: true, status: true, marksObtained: true } }) : [],
  ]);

  const submissionMap = Object.fromEntries(submissions.map((s) => [s.assignmentId, s]));

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Assignments" subtitle={`${assignments.length} total assignments`} />
      <div className="grid sm:grid-cols-2 gap-4">
        {assignments.map((a) => (
          <AssignmentCard key={a.id} assignment={a as any} submission={submissionMap[a.id]} studentId={student?.id} />
        ))}
      </div>
      {assignments.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">No assignments posted yet.</div>
      )}
    </div>
  );
}
