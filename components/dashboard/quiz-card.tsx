// components/dashboard/quiz-card.tsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Award, Clock, Users, CheckCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  quiz: {
    id: string;
    title: string;
    subject: string;
    duration: number;
    totalMarks: number;
    passingMarks: number;
    _count: { questions: number; results: number };
  };
  completed: boolean;
  myResult?: { score: number; percentage: number; passed: boolean };
}

export function QuizCard({ quiz, completed, myResult }: QuizCardProps) {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ y: -1 }}
      className={cn(
        "bg-card border rounded-2xl p-5 flex items-center gap-4 cursor-pointer group transition-all",
        completed
          ? "border-green-200 dark:border-green-800"
          : "border-border hover:border-primary/50"
      )}
      onClick={() => router.push(`/dashboard/student/quizzes/${quiz.id}`)}
    >
      {/* Icon */}
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
        completed
          ? "bg-green-100 dark:bg-green-900/30"
          : "bg-purple-100 dark:bg-purple-900/30"
      )}>
        {completed
          ? <CheckCircle size={22} className="text-green-600 dark:text-green-400" />
          : <Award size={22} className="text-purple-600 dark:text-purple-400" />
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold truncate">{quiz.title}</h4>
          {completed && myResult && (
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
              myResult.passed
                ? "text-green-700 bg-green-100 dark:bg-green-900/30"
                : "text-red-700 bg-red-100 dark:bg-red-900/30"
            )}>
              {myResult.passed ? "Passed" : "Failed"} · {Math.round(myResult.percentage)}%
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{quiz.subject}</p>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock size={11} /> {quiz.duration} min
          </span>
          <span>{quiz._count.questions} questions</span>
          <span className="flex items-center gap-1">
            <Users size={11} /> {quiz._count.results} attempts
          </span>
          <span>Pass: {quiz.passingMarks}/{quiz.totalMarks}</span>
        </div>
      </div>

      <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
    </motion.div>
  );
}
