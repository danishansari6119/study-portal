// app/dashboard/admin/announcements/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { AdminAnnouncementsClient } from "@/components/dashboard/admin-announcements-client";

export const metadata = { title: "Announcements" };

export default async function AdminAnnouncementsPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");
  const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Announcements" subtitle="Post and manage announcements" />
      <AdminAnnouncementsClient announcements={announcements as any} adminId={session.user.id} />
    </div>
  );
}
