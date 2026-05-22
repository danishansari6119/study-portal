// app/not-found.tsx
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-8xl font-bold text-white/20 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-2">Page not found</h2>
      <p className="text-white/50 mb-8">The page you're looking for doesn't exist.</p>
      <Link href="/" className="gradient-primary text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity">
        Go Home
      </Link>
    </div>
  );
}
