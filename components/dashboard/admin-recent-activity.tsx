// components/dashboard/admin-recent-activity.tsx
import prisma from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { FileText, BookOpen, Award, Users } from "lucide-react";

export async function AdminRecentActivity() {
  const [recentStudents, recentNotes, recentAssignments] = await Promise.all([
    prisma.student.findMany({ take: 3, orderBy: { createdAt: "desc" }, include: { user: true } }),
    prisma.note.findMany({ take: 3, orderBy: { createdAt: "desc" } }),
    prisma.assignment.findMany({ take: 3, orderBy: { createdAt: "desc" } }),
  ]);

  const sections = [
    { title: "Recent Students", icon: Users, href: "/dashboard/admin/students", items: recentStudents.map(s => ({ id: s.id, name: s.user.name || "Unknown", sub: s.rollNumber, date: s.createdAt })) },
    { title: "Recent Notes", icon: BookOpen, href: "/dashboard/admin/notes", items: recentNotes.map(n => ({ id: n.id, name: n.title, sub: n.subject, date: n.createdAt })) },
    { title: "Recent Assignments", icon: FileText, href: "/dashboard/admin/assignments", items: recentAssignments.map(a => ({ id: a.id, name: a.title, sub: a.subject, date: a.createdAt })) },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {sections.map(({ title, icon: Icon, href, items }) => (
        <div key={title} className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon size={16} className="text-muted-foreground" />
              <h3 className="font-semibold text-sm">{title}</h3>
            </div>
            <Link href={href} className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {items.length === 0 && <p className="text-xs text-muted-foreground">None yet</p>}
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
                <p className="text-xs text-muted-foreground shrink-0">{formatDistanceToNow(new Date(item.date), { addSuffix: true })}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
