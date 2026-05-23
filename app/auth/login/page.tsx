"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Chrome } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard/student";

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    await signIn("google", { callbackUrl });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-8"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>

        <p className="text-white/50 text-sm">
          Sign in to your account to continue
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm text-white/70 mb-1.5">
            Email address
          </label>

          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400 transition-colors text-sm"
          />

          {errors.email && (
            <p className="mt-1 text-red-400 text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-white/70 mb-1.5">Password</label>

          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
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

          {errors.password && (
            <p className="mt-1 text-red-400 text-xs">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-xs text-purple-400 hover:text-purple-300"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full gradient-primary text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="h-px bg-white/10 flex-1" />

        <span className="text-white/30 text-xs">or</span>

        <div className="h-px bg-white/10 flex-1" />
      </div>

      {/* Google */}
      <button
        onClick={handleGoogleSignIn}
        className="w-full border border-white/20 text-white py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm"
      >
        <Chrome size={16} />
        Continue with Google
      </button>

      {/* Register */}
      <p className="text-center text-sm text-white/40 mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="text-purple-400 hover:text-purple-300 font-medium"
        >
          Create account
        </Link>
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="text-white text-center py-10">Loading...</div>}
    >
      <LoginForm />
    </Suspense>
  );
}
