// components/dashboard/admin-assignments-client.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, FileText } from "lucide-react";
import { assignmentSchema, type AssignmentInput } from "@/lib/validations";
import { formatDate } from "@/lib/utils";

interface Assignment { id: string; title: string; subject: string; dueDate: Date; totalMarks: number; _count: { submissions: number }; }

export function AdminAssignmentsClient({ assignments: initial, adminId }: { assignments: Assignment[]; adminId: string }) {
  const [assignments, setAssignments] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AssignmentInput>({ resolver: zodResolver(assignmentSchema) });

  async function onSubmit(data: AssignmentInput) {
    setSubmitting(true);
    const res = await fetch("/api/assignments", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, createdBy: adminId }),
    });
    if (res.ok) { const newA = await res.json(); setAssignments(prev => [newA, ...prev]); reset(); setShowForm(false); }
    setSubmitting(false);
  }

  async function deleteAssignment(id: string) {
    await fetch(`/api/assignments/${id}`, { method: "DELETE" });
    setAssignments(prev => prev.filter(a => a.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90">
          <Plus size={16} /> Create Assignment
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-semibold mb-4">New Assignment</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Title *</label>
              <input {...register("title")} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Description *</label>
              <textarea {...register("description")} rows={3} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Subject *</label>
              <input {...register("subject")} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Semester</label>
              <select {...register("semester")} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none">
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Due Date *</label>
              <input {...register("dueDate")} type="datetime-local" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Total Marks</label>
              <input {...register("totalMarks")} type="number" defaultValue={100} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none" />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-border rounded-xl hover:bg-accent">Cancel</button>
              <button type="submit" disabled={submitting} className="px-6 py-2 gradient-primary text-white text-sm font-medium rounded-xl disabled:opacity-60">
                {submitting ? "Creating..." : "Create Assignment"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>{["Title","Subject","Due Date","Marks","Submissions","Actions"].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {assignments.map(a => (
              <tr key={a.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{a.title}</td>
                <td className="px-4 py-3">{a.subject}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(a.dueDate)}</td>
                <td className="px-4 py-3">{a.totalMarks}</td>
                <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full">{a._count.submissions}</span></td>
                <td className="px-4 py-3">
                  <button onClick={() => deleteAssignment(a.id)} className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {assignments.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No assignments yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
