// components/dashboard/admin-attendance-client.tsx
"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Student { id: string; rollNumber: string; user: { name: string | null }; }

const STATUS_OPTIONS = ["PRESENT","ABSENT","LATE","EXCUSED"] as const;
const STATUS_COLORS = { PRESENT: "bg-green-500", ABSENT: "bg-red-500", LATE: "bg-amber-500", EXCUSED: "bg-blue-500" };

export function AdminAttendanceClient({ students, adminId }: { students: Student[]; adminId: string }) {
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  function mark(studentId: string, status: string) {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  }

  function markAll(status: string) {
    const all: Record<string, string> = {};
    students.forEach(s => { all[s.id] = status; });
    setAttendance(all);
  }

  async function handleSave() {
    if (!subject) return alert("Please enter a subject");
    setSubmitting(true);
    const records = students.map(s => ({ studentId: s.id, subject, date, status: attendance[s.id] || "ABSENT", markedBy: adminId }));
    await fetch("/api/attendance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ records }) });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setSubmitting(false);
  }

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Subject</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Mathematics" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none" />
          </div>
          <div className="flex items-end gap-2">
            <button onClick={() => markAll("PRESENT")} className="flex-1 py-2.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 rounded-xl hover:bg-green-200 transition-colors">All Present</button>
            <button onClick={() => markAll("ABSENT")} className="flex-1 py-2.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 rounded-xl hover:bg-red-200 transition-colors">All Absent</button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Student</th>
              {STATUS_OPTIONS.map(s => <th key={s} className="text-center px-2 py-3 text-xs font-semibold text-muted-foreground uppercase">{s}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map(s => (
              <tr key={s.id} className="hover:bg-muted/20">
                <td className="px-4 py-3">
                  <p className="font-medium">{s.user.name}</p>
                  <p className="text-xs text-muted-foreground">{s.rollNumber}</p>
                </td>
                {STATUS_OPTIONS.map(status => (
                  <td key={status} className="text-center px-2 py-3">
                    <button onClick={() => mark(s.id, status)} className={cn("w-6 h-6 rounded-full border-2 transition-all mx-auto block",
                      attendance[s.id] === status ? `${STATUS_COLORS[status]} border-transparent` : "border-border hover:border-muted-foreground")} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={submitting} className="px-8 py-3 gradient-primary text-white rounded-xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-60">
          {saved ? "✓ Saved!" : submitting ? "Saving..." : "Save Attendance"}
        </button>
      </div>
    </div>
  );
}
