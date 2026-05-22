// app/dashboard/student/notes/page.tsx
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NoteCard } from "@/components/dashboard/note-card";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Notes" };

interface PageProps {
  searchParams: { q?: string; subject?: string; semester?: string };
}

export default async function NotesPage({ searchParams }: PageProps) {
  const session = await auth();

  const notes = await prisma.note.findMany({
    where: {
      isPublished: true,
      ...(searchParams.q && {
        OR: [
          { title: { contains: searchParams.q, mode: "insensitive" } },
          { subject: { contains: searchParams.q, mode: "insensitive" } },
        ],
      }),
      ...(searchParams.subject && { subject: searchParams.subject }),
      ...(searchParams.semester && { semester: parseInt(searchParams.semester) }),
    },
    orderBy: { createdAt: "desc" },
  });

  const subjects = await prisma.note.groupBy({
    by: ["subject"],
    where: { isPublished: true },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Study Notes" subtitle={`${notes.length} notes available`} />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <SearchInput placeholder="Search notes..." defaultValue={searchParams.q} />
        <select
          name="semester"
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(s => (
            <option key={s} value={s}>Semester {s}</option>
          ))}
        </select>
      </div>

      {/* Subject filter pills */}
      <div className="flex flex-wrap gap-2">
        {subjects.map(({ subject }) => (
          <span
            key={subject}
            className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full font-medium cursor-pointer hover:bg-primary/20 transition-colors"
          >
            {subject}
          </span>
        ))}
      </div>

      {/* Notes grid */}
      {notes.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-medium mb-2">No notes found</p>
          <p className="text-sm">Try a different search or check back later</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note as any} />
          ))}
        </div>
      )}
    </div>
  );
}
