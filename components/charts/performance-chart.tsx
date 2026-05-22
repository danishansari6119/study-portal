// components/charts/performance-chart.tsx
"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, PolarAngleAxis } from "recharts";

interface PerformanceChartProps {
  quizResults: Array<{
    percentage: number;
    quiz: { subject: string };
  }>;
}

export function PerformanceChart({ quizResults }: PerformanceChartProps) {
  // Group by subject and average
  const subjectMap: Record<string, number[]> = {};
  quizResults.forEach((r) => {
    const s = r.quiz.subject;
    if (!subjectMap[s]) subjectMap[s] = [];
    subjectMap[s].push(r.percentage);
  });

  const data = Object.entries(subjectMap)
    .slice(0, 4)
    .map(([subject, scores], i) => ({
      name: subject.slice(0, 8),
      value: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      fill: ["#4f62f7", "#7c3aed", "#10b981", "#f59e0b"][i],
    }));

  const average =
    data.length > 0
      ? Math.round(data.reduce((a, b) => a + b.value, 0) / data.length)
      : 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-foreground">Quiz Performance</h3>
        <p className="text-sm text-muted-foreground mt-0.5">By subject</p>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
          No quiz data yet
        </div>
      ) : (
        <>
          <div className="relative">
            <ResponsiveContainer width="100%" height={180}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="90%" data={data}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar dataKey="value" angleAxisId={0} background cornerRadius={4} />
                <Tooltip
                  formatter={(val) => [`${val}%`, "Score"]}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold">{average}%</span>
              <span className="text-xs text-muted-foreground">Average</span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 mt-2">
            {data.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="font-medium">{d.value}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
