// components/dashboard/quiz-taker.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronRight, ChevronLeft, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question { id: string; questionText: string; options: string[]; correctAnswer: number; marks: number; order: number; }
interface Quiz { id: string; title: string; subject: string; duration: number; totalMarks: number; passingMarks: number; questions: Question[]; }

export function QuizTaker({ quiz, userId }: { quiz: Quiz; userId: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(quiz.questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);

  const handleSubmit = useCallback(async (timedOut = false) => {
    setSubmitting(true);
    const timeTaken = quiz.duration * 60 - timeLeft;
    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, timeTaken }),
      });
      if (res.ok) router.refresh();
    } catch { setSubmitting(false); }
  }, [answers, quiz, timeLeft, router]);

  useEffect(() => {
    if (!started) return;
    if (timeLeft <= 0) { handleSubmit(true); return; }
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [started, timeLeft, handleSubmit]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const q = quiz.questions[current];
  const answered = answers.filter((a) => a !== null).length;

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto py-8 text-center">
        <div className="bg-card border border-border rounded-3xl p-10">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📝</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-muted-foreground mb-8">{quiz.subject}</p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Questions", value: quiz.questions.length },
              { label: "Duration", value: `${quiz.duration} min` },
              { label: "Pass marks", value: `${quiz.passingMarks}/${quiz.totalMarks}` },
            ].map((s) => (
              <div key={s.label} className="bg-muted/50 rounded-xl p-4">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mb-6">Once started, the timer cannot be paused. Answer all questions before time runs out.</p>
          <button onClick={() => setStarted(true)} className="gradient-primary text-white font-semibold px-10 py-3 rounded-xl hover:opacity-90 transition-opacity">
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-card border border-border rounded-2xl px-6 py-4">
        <div>
          <h2 className="font-semibold">{quiz.title}</h2>
          <p className="text-sm text-muted-foreground">{answered}/{quiz.questions.length} answered</p>
        </div>
        <div className={cn("flex items-center gap-2 text-lg font-mono font-bold px-4 py-2 rounded-xl", timeLeft < 60 ? "text-red-600 bg-red-100 dark:bg-red-900/30 animate-pulse" : "text-foreground bg-muted")}>
          <Clock size={18} />
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((current + 1) / quiz.questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <div className="flex items-start gap-3">
            <span className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">{current + 1}</span>
            <p className="text-base font-medium leading-relaxed pt-1">{q.questionText}</p>
          </div>
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => setAnswers((prev) => { const n = [...prev]; n[current] = i; return n; })}
                className={cn("quiz-option w-full text-left", answers[current] === i && "selected")}>
                <span className={cn("w-8 h-8 rounded-lg border-2 flex items-center justify-center text-sm font-bold shrink-0 transition-colors",
                  answers[current] === i ? "border-primary bg-primary text-white" : "border-border")}>
                  {["A", "B", "C", "D"][i]}
                </span>
                <span className="text-sm">{opt}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm hover:bg-accent transition-colors disabled:opacity-40">
          <ChevronLeft size={16} /> Previous
        </button>
        <div className="flex gap-1.5">
          {quiz.questions.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={cn("w-7 h-7 rounded-lg text-xs font-medium transition-colors",
                i === current ? "bg-primary text-white" : answers[i] !== null ? "bg-green-500/20 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground hover:bg-accent")}>
              {i + 1}
            </button>
          ))}
        </div>
        {current < quiz.questions.length - 1 ? (
          <button onClick={() => setCurrent((c) => Math.min(quiz.questions.length - 1, c + 1))}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm hover:bg-accent transition-colors">
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={() => handleSubmit(false)} disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
            <Send size={14} /> {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </div>
    </div>
  );
}
