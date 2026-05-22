// components/dashboard/attendance-subject-card.tsx
"use client";

import { cn } from "@/lib/utils";

interface AttendanceSubjectCardProps {
  subject: string;
  data: { total: number; present: number; absent: number; late: number };
}

export function AttendanceSubjectCard({ subject, data }: AttendanceSubjectCardProps) {
  const percent = data.total > 0 ? Math.round((data.present / data.total) * 100) : 0;
  const status =
    percent >= 75 ? "Safe"
    : percent >= 60 ? "Warning"
    : "Danger";

  const statusColor = {
    Safe: "text-green-600",
    Warning: "text-amber-600",
    Danger: "text-red-600",
  }[status];

  const barColor = {
    Safe: "bg-green-500",
    Warning: "bg-amber-500",
    Danger: "bg-red-500",
  }[status];

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-sm">{subject}</h4>
        <span className={cn("text-sm font-bold", statusColor)}>{percent}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <p className="font-semibold text-green-600">{data.present}</p>
          <p className="text-muted-foreground">Present</p>
        </div>
        <div>
          <p className="font-semibold text-red-600">{data.absent}</p>
          <p className="text-muted-foreground">Absent</p>
        </div>
        <div>
          <p className="font-semibold text-amber-600">{data.late}</p>
          <p className="text-muted-foreground">Late</p>
        </div>
      </div>

      {/* Min-attendance warning */}
      {percent < 75 && (
        <p className="mt-3 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg p-2">
          ⚠️ Minimum 75% required. You need{" "}
          {Math.ceil((0.75 * data.total - data.present) / 0.25)} more classes.
        </p>
      )}
    </div>
  );
}
