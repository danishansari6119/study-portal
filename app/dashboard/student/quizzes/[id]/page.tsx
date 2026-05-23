// app/dashboard/student/quizzes/[id]/page.tsx

import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { QuizTaker } from "@/components/dashboard/quiz-taker";

export default async function TakeQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  // ✅ Correct way in Next.js 15
  const { id } = await params;

  const [quiz, existingResult] = await Promise.all([
    prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    }),

    prisma.quizResult.findFirst({
      where: {
        quizId: id,
        student: {
          userId: session.user.id,
        },
      },
    }),
  ]);

  if (!quiz) {
    notFound();
  }

  // Already attempted quiz
  if (existingResult) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-6xl mb-4">
          {existingResult.passed ? "🎉" : "😔"}
        </div>

        <h2 className="text-2xl font-bold mb-2">
          {existingResult.passed
            ? "Congratulations!"
            : "Better luck next time!"}
        </h2>

        <p className="text-muted-foreground mb-6">
          You scored {existingResult.score} / {quiz.totalMarks} (
          {Math.round(existingResult.percentage)}%)
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-bold text-primary">
              {existingResult.score}
            </p>
            <p className="text-xs text-muted-foreground">Score</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-bold">
              {Math.round(existingResult.percentage)}%
            </p>
            <p className="text-xs text-muted-foreground">Percentage</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-bold">
              {Math.floor(existingResult.timeTaken / 60)}m{" "}
              {existingResult.timeTaken % 60}s
            </p>

            <p className="text-xs text-muted-foreground">Time Taken</p>
          </div>
        </div>

        <a
          href="/dashboard/student/quizzes"
          className="text-primary hover:underline text-sm"
        >
          ← Back to quizzes
        </a>
      </div>
    );
  }

  return <QuizTaker quiz={quiz as any} userId={session.user.id} />;
}
