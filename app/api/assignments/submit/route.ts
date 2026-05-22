import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { assignmentId, fileUrl, remarks } = await req.json();
  const student = await prisma.student.findFirst({ where: { userId: session.user.id } });
  if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });
  const submission = await prisma.submission.upsert({
    where: { assignmentId_studentId: { assignmentId, studentId: student.id } },
    create: { assignmentId, studentId: student.id, fileUrl, remarks, status: "SUBMITTED" },
    update: { fileUrl, remarks, status: "SUBMITTED", gradedAt: null, marksObtained: null },
  });
  return NextResponse.json({ submission });
}
