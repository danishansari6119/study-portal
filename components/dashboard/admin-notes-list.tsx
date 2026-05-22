// components/dashboard/admin-notes-list.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, FileText } from "lucide-react";
import { noteSchema, type NoteInput } from "@/lib/validations";
import { formatDate } from "@/lib/utils";

interface Note { id: string; title: string; subject: string; semester: number; downloads: number; createdAt: Date; isPublished: boolean; }

export function AdminNotesList({ notes: initialNotes, adminId }: { notes: Note[]; adminId: string }) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NoteInput>({ resolver: zodResolver(noteSchema) });

  async function onSubmit(data: NoteInput) {
    setSubmitting(true);
    const tags = data.tags ? data.tags.split(",").map(t => t.trim()) : [];
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, tags, uploadedBy: adminId }),
    });
    if (res.ok) { reset(); setShowForm(false); router.refresh(); }
    setSubmitting(false);
  }

  async function deleteNote(id: string) {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    setNotes(prev => prev.filter(n => n.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add Note
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Upload New Note</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Title *</label>
              <input {...register("title")} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Subject *</label>
              <input {...register("subject")} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Semester *</label>
              <select {...register("semester")} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none">
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5">File URL (Google Drive / PDF URL) *</label>
              <input {...register("fileUrl")} placeholder="https://..." className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              {errors.fileUrl && <p className="text-red-500 text-xs mt-1">{errors.fileUrl.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Tags (comma-separated)</label>
              <input {...register("tags")} placeholder="algebra, chapter1, important" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <input {...register("description")} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none" />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-border rounded-xl hover:bg-accent">Cancel</button>
              <button type="submit" disabled={submitting} className="px-6 py-2 gradient-primary text-white text-sm font-medium rounded-xl disabled:opacity-60">
                {submitting ? "Uploading..." : "Upload Note"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>{["Title","Subject","Semester","Downloads","Date","Actions"].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {notes.map((n) => (
              <tr key={n.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 flex items-center gap-2"><FileText size={14} className="text-muted-foreground" />{n.title}</td>
                <td className="px-4 py-3">{n.subject}</td>
                <td className="px-4 py-3">{n.semester}</td>
                <td className="px-4 py-3">{n.downloads}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(n.createdAt)}</td>
                <td className="px-4 py-3">
                  <button onClick={() => deleteNote(n.id)} className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {notes.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No notes yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
