// app/dashboard/error.tsx
"use client";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <AlertCircle size={28} className="text-red-500" />
      </div>
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground text-sm text-center max-w-sm">{error.message}</p>
      <button onClick={reset} className="px-6 py-2 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90">
        Try Again
      </button>
    </div>
  );
}
