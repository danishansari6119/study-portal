// components/dashboard/note-card.tsx
"use client";

import { motion } from "framer-motion";
import { FileText, Download, Tag, Calendar } from "lucide-react";
import { formatDate, formatFileSize, getSubjectColor, cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  description?: string | null;
  subject: string;
  semester: number;
  fileUrl: string;
  fileSize?: number | null;
  downloads: number;
  tags: string[];
  createdAt: Date;
}

export function NoteCard({ note }: { note: Note }) {
  async function handleDownload() {
    // Increment download count via API
    await fetch(`/api/notes/${note.id}/download`, { method: "POST" });
    window.open(note.fileUrl, "_blank");
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 group"
    >
      {/* Icon + title */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
          <FileText size={18} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm leading-snug line-clamp-2">{note.title}</h4>
          {note.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{note.description}</p>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", getSubjectColor(note.subject))}>
          {note.subject}
        </span>
        <span className="text-xs text-muted-foreground">Sem {note.semester}</span>
      </div>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Tag size={10} className="text-muted-foreground" />
          {note.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar size={10} /> {formatDate(note.createdAt, "MMM d")}
          </span>
          <span>{note.downloads} downloads</span>
          {note.fileSize && <span>{formatFileSize(note.fileSize)}</span>}
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium transition-colors"
        >
          <Download size={12} /> Download
        </button>
      </div>
    </motion.div>
  );
}
