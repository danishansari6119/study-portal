// components/dashboard/upcoming-quizzes.tsx
"use client";

import Link from "next/link";
import { Award, ChevronRight } from "lucide-react";

export function UpcomingQuizzes() {
  // In a real app this fetches active quizzes
  const quizzes = [
    { id: "1", title: "Mid-sem Physics", subject: "Physics", duration: 30 },
    { id: "2", title: "Chapter 5 Math", subject: "Mathematics", duration: 20 },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Upcoming Quizzes</h3>
        <Link href="/dashboard/student/quizzes" className="text-xs text-primary">
          View all
        </Link>
      </div>
      <div className="space-y-2">
        {quizzes.map((q) => (
          <div key={q.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent transition-colors">
            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Award size={13} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{q.title}</p>
              <p className="text-xs text-muted-foreground">{q.subject} · {q.duration}min</p>
            </div>
            <ChevronRight size={12} className="text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}
