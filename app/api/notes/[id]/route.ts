import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Fix for Next.js 15
  const { id } = await params;

  await prisma.note.delete({
    where: { id },
  });

  return NextResponse.json({
    success: true,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Fix for Next.js 15
  const { id } = await params;

  const data = await req.json();

  const note = await prisma.note.update({
    where: { id },
    data,
  });

  return NextResponse.json(note);
}
