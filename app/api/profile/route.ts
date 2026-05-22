import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  await prisma.user.update({ where: { id: session.user.id }, data: { name: data.name } });
  await prisma.student.updateMany({
    where: { userId: session.user.id },
    data: { phone: data.phone, address: data.address, branch: data.branch },
  });
  return NextResponse.json({ success: true });
}
