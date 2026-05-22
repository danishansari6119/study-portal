// app/dashboard/admin/students/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Manage Students" };

export default async function AdminStudentsPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const students = await prisma.student.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Students" subtitle={`${students.length} registered students`} />
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                {["Name","Roll No","Branch","Semester","CGPA","Joined"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-xs text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{s.user.name}</p>
                      <p className="text-xs text-muted-foreground">{s.user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{s.rollNumber}</td>
                  <td className="px-4 py-3">{s.branch}</td>
                  <td className="px-4 py-3">{s.semester}</td>
                  <td className="px-4 py-3 font-semibold">{s.cgpa.toFixed(2)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(s.createdAt)}</td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No students yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
