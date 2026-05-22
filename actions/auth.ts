// actions/auth.ts — Server Actions for auth operations
"use server";
import { signIn, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(email: string, password: string) {
  await signIn("credentials", { email, password, redirectTo: "/dashboard/student" });
}

export async function logoutAction() {
  await signOut({ redirectTo: "/auth/login" });
}
