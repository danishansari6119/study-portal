// components/dashboard/leaderboard.tsx
import prisma from "@/lib/prisma";
import { Trophy } from "lucide-react";

export async function Leaderboard() {
  // Aggregate top students by average quiz score
  const results = await prisma.quizResult.groupBy({
    by: ["studentId"],
    _avg: { percentage: true },
    _count: { quizId: true },
    orderBy: { _avg: { percentage: "desc" } },
    take: 10,
  });

  const students = await Promise.all(
    results.map(async (r) => {
      const student = await prisma.student.findUnique({
        where: { id: r.studentId },
        include: { user: { select: { name: true } } },
      });
      return {
        name: student?.user.name || "Unknown",
        rollNumber: student?.rollNumber,
        avg: Math.round(r._avg.percentage || 0),
        quizzes: r._count.quizId,
      };
    })
  );

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <Trophy size={16} className="text-amber-500" />
        <h3 className="font-semibold">Leaderboard</h3>
      </div>

      {students.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No results yet</p>
      ) : (
        <div className="space-y-2">
          {students.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent transition-colors">
              <span className="text-lg w-6 text-center">{medals[i] || `#${i + 1}`}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.quizzes} quizzes</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">{s.avg}%</p>
                <p className="text-xs text-muted-foreground">avg</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
