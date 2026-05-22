// components/charts/attendance-month-chart.tsx
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, eachDayOfInterval } from "date-fns";

interface Props {
  attendances: Array<{ date: Date; status: string }>;
}

export function AttendanceMonthChart({ attendances }: Props) {
  // Build last 30 days running percentage
  const days = eachDayOfInterval({ start: subDays(new Date(), 29), end: new Date() });

  let cumulativePresent = 0;
  let cumulativeTotal = 0;

  const data = days.map((day) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const dayAttendances = attendances.filter(
      (a) => format(new Date(a.date), "yyyy-MM-dd") === dayStr
    );

    cumulativeTotal += dayAttendances.length;
    cumulativePresent += dayAttendances.filter((a) => a.status === "PRESENT").length;

    return {
      date: format(day, "MMM d"),
      percentage: cumulativeTotal > 0 ? Math.round((cumulativePresent / cumulativeTotal) * 100) : 0,
    };
  });

  // Only show every 5th label
  const filteredData = data.filter((_, i) => i % 5 === 0 || i === data.length - 1);

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-semibold mb-1">Monthly Trend</h3>
      <p className="text-sm text-muted-foreground mb-5">Running attendance percentage — last 30 days</p>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            interval={4}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            formatter={(v) => [`${v}%`, "Attendance"]}
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          {/* 75% warning line */}
          <Line
            type="monotone"
            dataKey={() => 75}
            stroke="#f87171"
            strokeWidth={1}
            strokeDasharray="4 4"
            dot={false}
            name="Min Required"
          />
          <Line
            type="monotone"
            dataKey="percentage"
            stroke="#4f62f7"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: "#4f62f7" }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
        <span className="inline-block w-6 h-px bg-red-400" />
        75% minimum attendance threshold
      </p>
    </div>
  );
}
