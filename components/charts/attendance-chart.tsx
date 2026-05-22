// components/charts/attendance-chart.tsx
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, startOfWeek, eachDayOfInterval, endOfWeek, subWeeks } from "date-fns";

interface AttendanceChartProps {
  attendances: Array<{
    date: Date;
    status: string;
    subject: string;
  }>;
}

// Generate last 4 weeks of attendance data
function buildChartData(attendances: AttendanceChartProps["attendances"]) {
  const weeks = [];
  for (let i = 3; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(new Date(), i));
    const weekEnd = endOfWeek(weekStart);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd }).slice(0, 5); // Mon-Fri

    const weekAttendances = attendances.filter((a) => {
      const d = new Date(a.date);
      return d >= weekStart && d <= weekEnd;
    });

    const present = weekAttendances.filter((a) => a.status === "PRESENT").length;
    const absent = weekAttendances.filter((a) => a.status === "ABSENT").length;

    weeks.push({
      week: `Week ${4 - i}`,
      label: format(weekStart, "MMM d"),
      present,
      absent,
      late: weekAttendances.filter((a) => a.status === "LATE").length,
    });
  }
  return weeks;
}

export function AttendanceChart({ attendances }: AttendanceChartProps) {
  const data = buildChartData(attendances);

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-foreground">Attendance Overview</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Last 4 weeks</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Present
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-400" /> Absent
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Late
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barGap={4} barSize={24}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Bar dataKey="present" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Present" />
          <Bar dataKey="absent" fill="#f87171" radius={[4, 4, 0, 0]} name="Absent" />
          <Bar dataKey="late" fill="#fbbf24" radius={[4, 4, 0, 0]} name="Late" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
