// app/api/quizzes/[id]/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { answers, timeTaken } = await req.json();

  const quiz = await prisma.quiz.findUnique({
    where: { id: params.id },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  const student = await prisma.student.findFirst({ where: { userId: session.user.id } });
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  // Auto-evaluate
  let score = 0;
  quiz.questions.forEach((q, i) => {
    if (answers[i] === q.correctAnswer) score += q.marks;
  });

  const percentage = (score / quiz.totalMarks) * 100;
  const passed = score >= quiz.passingMarks;

  const result = await prisma.quizResult.create({
    data: {
      quizId: quiz.id,
      studentId: student.id,
      answers,
      score,
      percentage,
      timeTaken,
      passed,
    },
  });

  return NextResponse.json({ result, score, percentage, passed });
}
