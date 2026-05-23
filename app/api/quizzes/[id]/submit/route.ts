// app/api/quizzes/[id]/submit/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check authentication
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Next.js 15 dynamic params fix
    const { id } = await params;

    // Get request body
    const { answers, timeTaken } = await req.json();

    // Find quiz
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Find student
    const student = await prisma.student.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Check if already submitted
    const existingResult = await prisma.quizResult.findFirst({
      where: {
        quizId: quiz.id,
        studentId: student.id,
      },
    });

    if (existingResult) {
      return NextResponse.json(
        { error: "Quiz already submitted" },
        { status: 400 },
      );
    }

    // Auto evaluate quiz
    let score = 0;

    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score += question.marks;
      }
    });

    // Calculate percentage
    const percentage = (score / quiz.totalMarks) * 100;

    // Pass or fail
    const passed = score >= quiz.passingMarks;

    // Save result
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

    // Return response
    return NextResponse.json(
      {
        success: true,
        result,
        score,
        percentage,
        passed,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Quiz submit error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
