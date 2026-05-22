import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const student = await prisma.student.findFirst({ where: { userId: session.user.id } });
  if (!student) return NextResponse.json([]);
  const attendances = await prisma.attendance.findMany({ where: { studentId: student.id }, orderBy: { date: "desc" } });
  return NextResponse.json(attendances);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { records } = await req.json();
  const created = await prisma.attendance.createMany({ data: records.map((r: any) => ({ ...r, date: new Date(r.date) })) });
  return NextResponse.json({ created: created.count }, { status: 201 });
}
