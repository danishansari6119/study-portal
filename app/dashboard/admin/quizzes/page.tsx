// app/dashboard/admin/quizzes/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";
import { Plus, Award, Users, Clock } from "lucide-react";

export const metadata = { title: "Manage Quizzes" };

export default async function AdminQuizzesPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");
  const quizzes = await prisma.quiz.findMany({
    include: { _count: { select: { questions: true, results: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Quizzes" subtitle="Create and manage quizzes" actions={
        <Link href="/dashboard/admin/quizzes/create" className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90">
          <Plus size={16} /> Create Quiz
        </Link>
      } />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map(q => (
          <div key={q.id} className="bg-card border border-border rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
              <Award size={18} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-semibold mb-1">{q.title}</h4>
            <p className="text-sm text-muted-foreground mb-3">{q.subject}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock size={11} /> {q.duration}m</span>
              <span>{q._count.questions} questions</span>
              <span className="flex items-center gap-1"><Users size={11} /> {q._count.results}</span>
            </div>
          </div>
        ))}
        {quizzes.length === 0 && <div className="col-span-3 text-center py-16 text-muted-foreground">No quizzes created yet.</div>}
      </div>
    </div>
  );
}
