// components/dashboard/recent-assignments.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Clock, ChevronRight } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: Date;
  totalMarks: number;
}

function getDueBadge(dueDate: Date) {
  const now = new Date();
  const diff = Math.ceil((new Date(dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: "Overdue", cls: "text-red-600 bg-red-100 dark:bg-red-900/30" };
  if (diff === 0) return { label: "Today", cls: "text-orange-600 bg-orange-100 dark:bg-orange-900/30" };
  if (diff <= 3) return { label: `${diff}d left`, cls: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" };
  return { label: formatDate(dueDate, "MMM d"), cls: "text-muted-foreground bg-muted" };
}

export function RecentAssignments({ assignments }: { assignments: Assignment[] }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-foreground">Recent Assignments</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Upcoming deadlines</p>
        </div>
        <Link href="/dashboard/student/assignments" className="text-sm text-primary hover:underline flex items-center gap-1">
          View all <ChevronRight size={14} />
        </Link>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="mx-auto mb-3 opacity-40" size={32} />
          <p className="text-sm">No assignments yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a, i) => {
            const badge = getDueBadge(a.dueDate);
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.subject} · {a.totalMarks} marks</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", badge.cls)}>
                    {badge.label}
                  </span>
                  <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
