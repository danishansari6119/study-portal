// components/dashboard/assignment-card.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

interface Assignment { id: string; title: string; description: string; subject: string; dueDate: Date; totalMarks: number; fileUrl?: string | null; }
interface Submission { status: string; marksObtained?: number | null; }

export function AssignmentCard({ assignment, submission, studentId }: { assignment: Assignment; submission?: Submission; studentId?: string; }) {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [submitted, setSubmitted] = useState(!!submission);

  const now = new Date();
  const due = new Date(assignment.dueDate);
  const overdue = due < now;
  const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  async function handleSubmit() {
    if (!fileUrl || !studentId) return;
    setUploading(true);
    await fetch("/api/assignments/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId: assignment.id, fileUrl }),
    });
    setSubmitted(true);
    setUploading(false);
  }

  return (
    <motion.div whileHover={{ y: -2 }} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          submitted ? "bg-green-100 dark:bg-green-900/30" : overdue ? "bg-red-100 dark:bg-red-900/30" : "bg-blue-100 dark:bg-blue-900/30")}>
          {submitted ? <CheckCircle size={18} className="text-green-600" /> : overdue ? <AlertCircle size={18} className="text-red-600" /> : <FileText size={18} className="text-blue-600" />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{assignment.title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{assignment.subject} · {assignment.totalMarks} marks</p>
        </div>
        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
          submitted ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : overdue ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400")}>
          {submitted ? `Submitted` : overdue ? "Overdue" : `${daysLeft}d left`}
        </span>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2">{assignment.description}</p>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock size={11} /> Due: {formatDate(assignment.dueDate, "MMM d, yyyy · hh:mm a")}
      </div>

      {submission?.marksObtained !== null && submission?.marksObtained !== undefined && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-sm">
          <span className="font-semibold text-green-700 dark:text-green-400">
            Marks: {submission.marksObtained}/{assignment.totalMarks}
          </span>
        </div>
      )}

      {!submitted && !overdue && studentId && (
        <div className="space-y-2 pt-2 border-t border-border">
          <input
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="Paste your file/drive URL here"
            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button onClick={handleSubmit} disabled={!fileUrl || uploading}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg gradient-primary text-white text-xs font-medium disabled:opacity-50">
            <Upload size={12} /> {uploading ? "Submitting..." : "Submit Assignment"}
          </button>
        </div>
      )}
    </motion.div>
  );
}
