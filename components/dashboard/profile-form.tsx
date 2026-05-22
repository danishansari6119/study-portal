// components/dashboard/profile-form.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, User } from "lucide-react";
import { profileSchema, type ProfileInput } from "@/lib/validations";
import { getInitials } from "@/lib/utils";

interface ProfileFormProps {
  user: { id: string; name?: string | null; email?: string | null; image?: string | null; student?: { rollNumber: string; branch: string; semester: number; phone?: string | null; address?: string | null; } | null };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      phone: user.student?.phone || "",
      address: user.student?.address || "",
      branch: user.student?.branch || "",
    },
  });

  async function onSubmit(data: ProfileInput) {
    setSaving(true);
    await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold">
          {getInitials(user.name || user.email || "U")}
        </div>
        <div>
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <p className="text-muted-foreground text-sm">{user.email}</p>
          {user.student && <p className="text-xs text-muted-foreground mt-1">Roll: {user.student.rollNumber} · Sem {user.student.semester} · {user.student.branch}</p>}
        </div>
      </div>

      {/* Form */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold mb-5">Personal Information</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <input {...register("name")} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Phone</label>
              <input {...register("phone")} placeholder="+91 XXXXXXXXXX" className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Branch</label>
              <input {...register("branch")} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Address</label>
              <textarea {...register("address")} rows={3} className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 gradient-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
