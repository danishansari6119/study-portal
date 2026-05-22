// app/dashboard/student/profile/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = { title: "Profile Settings" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { student: true },
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <PageHeader title="Profile Settings" subtitle="Manage your account details" />
      <ProfileForm user={user as any} />
    </div>
  );
}
