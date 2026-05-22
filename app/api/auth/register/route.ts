// app/api/auth/register/route.ts
// Handles user registration — hashes password, creates user + student profile

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password, role, rollNumber, branch, semester } = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user + profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role as any,
        },
      });

      // Create student profile if registering as student
      if (role === "STUDENT" && rollNumber) {
        await tx.student.create({
          data: {
            userId: newUser.id,
            rollNumber,
            branch: branch || "General",
            semester: semester || 1,
          },
        });
      }

      // Create admin profile
      if (role === "ADMIN") {
        await tx.admin.create({
          data: {
            userId: newUser.id,
            department: "General",
          },
        });
      }

      return newUser;
    });

    return NextResponse.json(
      { message: "Account created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
