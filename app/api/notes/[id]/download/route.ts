// app/api/notes/[id]/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.note.update({
    where: { id: params.id },
    data: { downloads: { increment: 1 } },
  });

  return NextResponse.json({ success: true });
}
