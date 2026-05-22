// app/dashboard/admin/assignments/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { AdminAssignmentsClient } from "@/components/dashboard/admin-assignments-client";

export const metadata = { title: "Manage Assignments" };

export default async function AdminAssignmentsPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");
  const assignments = await prisma.assignment.findMany({
    include: { _count: { select: { submissions: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Assignments" subtitle="Create and manage assignments" />
      <AdminAssignmentsClient assignments={assignments as any} adminId={session.user.id} />
    </div>
  );
}
