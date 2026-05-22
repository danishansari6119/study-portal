import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const announcements = await prisma.announcement.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(announcements);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const ann = await prisma.announcement.create({ data: { ...data, postedBy: session.user.id } });
  return NextResponse.json(ann, { status: 201 });
}
