// app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/validations";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const role = watch("role");

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Registration failed");
      router.push("/auth/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-8"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
        <p className="text-white/50 text-sm">Join StudyPortal today</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl">
          {(["STUDENT", "ADMIN"] as const).map((r) => (
            <label
              key={r}
              className={`flex items-center justify-center py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all ${
                role === r
                  ? "bg-purple-600 text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              <input {...register("role")} type="radio" value={r} className="hidden" />
              {r.charAt(0) + r.slice(1).toLowerCase()}
            </label>
          ))}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm text-white/70 mb-1.5">Full Name</label>
          <input
            {...register("name")}
            placeholder="John Doe"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400 transition-colors text-sm"
          />
          {errors.name && <p className="mt-1 text-red-400 text-xs">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-white/70 mb-1.5">Email address</label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400 transition-colors text-sm"
          />
          {errors.email && <p className="mt-1 text-red-400 text-xs">{errors.email.message}</p>}
        </div>

        {/* Student-specific fields */}
        {role === "STUDENT" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-white/70 mb-1.5">Roll Number</label>
              <input
                {...register("rollNumber")}
                placeholder="CS2024001"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1.5">Semester</label>
              <select
                {...register("semester")}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400 transition-colors text-sm"
              >
                {[1,2,3,4,5,6,7,8].map(s => (
                  <option key={s} value={s} className="bg-slate-900">{s}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Password */}
        <div>
          <label className="block text-sm text-white/70 mb-1.5">Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400 transition-colors text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-red-400 text-xs">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm text-white/70 mb-1.5">Confirm Password</label>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirm your password"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400 transition-colors text-sm"
          />
          {errors.confirmPassword && <p className="mt-1 text-red-400 text-xs">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full gradient-primary text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <><Loader2 size={16} className="animate-spin" /> Creating account...</>
          ) : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-white/40 mt-6">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 font-medium">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
