// app/dashboard/admin/notes/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { AdminNotesList } from "@/components/dashboard/admin-notes-list";

export const metadata = { title: "Manage Notes" };

export default async function AdminNotesPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const notes = await prisma.note.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Notes" subtitle={`${notes.length} notes uploaded`} />
      <AdminNotesList notes={notes as any} adminId={session.user.id} />
    </div>
  );
}
