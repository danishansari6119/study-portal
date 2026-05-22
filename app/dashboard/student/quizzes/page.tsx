// app/dashboard/student/quizzes/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { QuizCard } from "@/components/dashboard/quiz-card";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Quizzes" };

export default async function QuizzesPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const [quizzes, myResults] = await Promise.all([
    prisma.quiz.findMany({
      where: { isActive: true },
      include: { _count: { select: { questions: true, results: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.quizResult.findMany({
      where: { student: { userId: session.user.id } },
      select: { quizId: true, score: true, percentage: true, passed: true },
    }),
  ]);

  const completedQuizIds = new Set(myResults.map((r) => r.quizId));

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Quizzes" subtitle="Test your knowledge and compete on the leaderboard" />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Available Quizzes
            </h3>
            {quizzes.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p>No quizzes available right now</p>
              </div>
            ) : (
              quizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz as any}
                  completed={completedQuizIds.has(quiz.id)}
                  myResult={myResults.find((r) => r.quizId === quiz.id)}
                />
              ))
            )}
          </div>
        </div>

        <Leaderboard />
      </div>
    </div>
  );
}
