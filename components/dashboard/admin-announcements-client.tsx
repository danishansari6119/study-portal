// components/dashboard/admin-announcements-client.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Megaphone } from "lucide-react";
import { announcementSchema, type AnnouncementInput } from "@/lib/validations";
import { formatDate, cn } from "@/lib/utils";

interface Announcement { id: string; title: string; content: string; priority: string; createdAt: Date; isActive: boolean; }

const priorityColor: Record<string, string> = {
  URGENT: "text-red-700 bg-red-100 dark:bg-red-900/30",
  HIGH: "text-orange-700 bg-orange-100 dark:bg-orange-900/30",
  NORMAL: "text-blue-700 bg-blue-100 dark:bg-blue-900/30",
  LOW: "text-gray-600 bg-gray-100 dark:bg-gray-800",
};

export function AdminAnnouncementsClient({ announcements: initial, adminId }: { announcements: Announcement[]; adminId: string }) {
  const [announcements, setAnnouncements] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AnnouncementInput>({ resolver: zodResolver(announcementSchema) });

  async function onSubmit(data: AnnouncementInput) {
    setSubmitting(true);
    const res = await fetch("/api/announcements", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, postedBy: adminId }),
    });
    if (res.ok) {
      const newAnn = await res.json();
      setAnnouncements(prev => [newAnn, ...prev]);
      reset(); setShowForm(false);
    }
    setSubmitting(false);
  }

  async function deleteAnn(id: string) {
    await fetch(`/api/announcements/${id}`, { method: "DELETE" });
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90">
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Post Announcement</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Title *</label>
              <input {...register("title")} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Content *</label>
              <textarea {...register("content")} rows={4} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Priority</label>
                <select {...register("priority")} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none">
                  {["LOW","NORMAL","HIGH","URGENT"].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Target</label>
                <select {...register("targetRole")} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none">
                  <option value="">All Users</option>
                  <option value="STUDENT">Students Only</option>
                  <option value="ADMIN">Admins Only</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-border rounded-xl hover:bg-accent">Cancel</button>
              <button type="submit" disabled={submitting} className="px-6 py-2 gradient-primary text-white text-sm font-medium rounded-xl disabled:opacity-60">
                {submitting ? "Posting..." : "Post Announcement"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a.id} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <Megaphone size={14} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="font-semibold text-sm">{a.title}</h4>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", priorityColor[a.priority] || priorityColor.NORMAL)}>
                      {a.priority.toLowerCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{a.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">{formatDate(a.createdAt)}</p>
                </div>
              </div>
              <button onClick={() => deleteAnn(a.id)} className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="text-center py-16 text-muted-foreground"><p>No announcements yet</p></div>
        )}
      </div>
    </div>
  );
}
