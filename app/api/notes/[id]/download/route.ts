// app/api/notes/[id]/download/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Next.js 15 fix
  const { id } = await params;

  await prisma.note.update({
    where: { id },

    data: {
      downloads: {
        increment: 1,
      },
    },
  });

  return NextResponse.json({
    success: true,
  });
}
