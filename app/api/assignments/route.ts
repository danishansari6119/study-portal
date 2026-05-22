import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const assignments = await prisma.assignment.findMany({ where: { isActive: true }, orderBy: { dueDate: "asc" } });
  return NextResponse.json(assignments);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const assignment = await prisma.assignment.create({ data: { ...data, dueDate: new Date(data.dueDate), createdBy: session.user.id } });
  return NextResponse.json(assignment, { status: 201 });
}
