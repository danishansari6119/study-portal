// components/dashboard/timetable-grid.tsx
"use client";
import { cn, DAYS, getSubjectColor } from "@/lib/utils";

const TIME_SLOTS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];

interface Entry { day: string; startTime: string; endTime: string; subject: string; teacher: string; room?: string | null; }

export function TimetableGrid({ entries }: { entries: Entry[] }) {
  function getEntry(day: string, time: string) {
    return entries.find((e) => e.day === day.toUpperCase() && e.startTime === time);
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Header row */}
          <div className="grid grid-cols-7 border-b border-border bg-muted/50">
            <div className="p-3 text-xs font-semibold text-muted-foreground">Time</div>
            {DAYS.map((day) => (
              <div key={day} className="p-3 text-xs font-semibold text-center">{day.slice(0, 3)}</div>
            ))}
          </div>
          {/* Time rows */}
          {TIME_SLOTS.map((time, ti) => (
            <div key={time} className={cn("grid grid-cols-7 border-b border-border last:border-0", ti % 2 === 0 ? "" : "bg-muted/20")}>
              <div className="p-3 text-xs text-muted-foreground font-mono border-r border-border">{time}</div>
              {DAYS.map((day) => {
                const entry = getEntry(day, time);
                return (
                  <div key={day} className="p-1.5 border-r border-border last:border-0 min-h-[64px]">
                    {entry && (
                      <div className={cn("rounded-lg p-2 h-full text-xs", getSubjectColor(entry.subject))}>
                        <p className="font-semibold leading-tight">{entry.subject}</p>
                        <p className="opacity-75 mt-0.5">{entry.teacher}</p>
                        {entry.room && <p className="opacity-60">{entry.room}</p>}
                        <p className="opacity-60">{entry.startTime}–{entry.endTime}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
