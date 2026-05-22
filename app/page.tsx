// app/page.tsx
// Public landing page

import Link from "next/link";
import { BookOpen, BarChart3, Calendar, FileText, Award, Users } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Smart Notes", desc: "Upload and organize study materials by subject and semester" },
  { icon: FileText, title: "Assignments", desc: "Submit assignments and track due dates effortlessly" },
  { icon: Award, title: "Quizzes", desc: "Test your knowledge with timed MCQ quizzes and leaderboards" },
  { icon: Calendar, title: "Attendance", desc: "Track attendance subject-wise with detailed reports" },
  { icon: BarChart3, title: "Analytics", desc: "Visualize your academic performance with beautiful charts" },
  { icon: Users, title: "Admin Tools", desc: "Powerful admin panel for managing students and content" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg">StudyPortal</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-white/70 hover:text-white text-sm transition-colors">
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="bg-white text-slate-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 py-24 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-white/20">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Built for modern students
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Your Academic
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {" "}Hub
          </span>
        </h1>
        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Manage notes, assignments, quizzes, and attendance in one beautiful platform.
          Built for students, designed for success.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/auth/register"
            className="gradient-primary text-white font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
          >
            Start for Free
          </Link>
          <Link
            href="/auth/login"
            className="border border-white/20 text-white px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 pb-24 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group backdrop-blur-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Icon className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-6 text-center text-white/40 text-sm">
        © {new Date().getFullYear()} StudyPortal. Built with Next.js 15.
      </footer>
    </div>
  );
}
