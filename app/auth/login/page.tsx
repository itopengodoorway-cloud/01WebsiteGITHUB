"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-browser";
import { Mail, Lock, ArrowRight, Zap } from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (mode === "magic") {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Magic link sent. Check your inbox to continue.");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else if (data.session) {
        window.location.href = "/dashboard";
      } else {
        setMessage("Sign-in link sent. Check your inbox.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--background)] px-4 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-[0_24px_80px_rgba(10,61,43,0.12)]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--accent)] text-[color:var(--secondary)] shadow-lg">
            <Zap className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-semibold text-[color:var(--secondary)]">Welcome back</h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
            Sign in to access your coaching dashboard and progress tools.
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between rounded-2xl bg-[color:var(--background)] p-2 text-sm text-[color:var(--muted)] shadow-inner">
          <button
            type="button"
            onClick={() => setMode("password")}
            className={`w-1/2 rounded-2xl px-3 py-2 transition ${mode === "password" ? "bg-[color:var(--primary)] text-white" : "hover:bg-[color:var(--primary-light)]/10"}`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => setMode("magic")}
            className={`w-1/2 rounded-2xl px-3 py-2 transition ${mode === "magic" ? "bg-[color:var(--primary)] text-white" : "hover:bg-[color:var(--primary-light)]/10"}`}
          >
            Magic Link
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-medium text-[color:var(--secondary)]">
            Email
            <div className="mt-2 flex items-center rounded-2xl border border-[color:var(--border)] bg-white px-3 py-2 shadow-sm">
              <Mail className="mr-2 h-4 w-4 text-[color:var(--primary)]" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full border-0 bg-transparent text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--muted)]"
                placeholder="you@example.com"
              />
            </div>
          </label>

          {mode === "password" ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-[color:var(--secondary)]">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold text-[color:var(--primary)] hover:text-[color:var(--primary-light)]"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="mt-2 flex items-center rounded-2xl border border-[color:var(--border)] bg-white px-3 py-2 shadow-sm">
                <Lock className="mr-2 h-4 w-4 text-[color:var(--primary)]" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full border-0 bg-transparent text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--muted)]"
                  placeholder="Your password"
                />
              </div>
            </div>
          ) : null}

          {error ? <p className="rounded-2xl bg-[#fee2e2] px-4 py-3 text-sm text-[#991b1b]">{error}</p> : null}
          {message ? <p className="rounded-2xl bg-[#f7f2d7] px-4 py-3 text-sm text-[#5c470d]">{message}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-2xl bg-[color:var(--primary)] px-5 py-3 text-base font-semibold text-white transition hover:bg-[color:var(--primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Processing..." : mode === "magic" ? "Send Magic Link" : "Sign In"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[color:var(--muted)]">
          New to IOG.doorway?{' '}
          <Link href="/auth/signup" className="font-semibold text-[color:var(--secondary)] hover:text-[color:var(--primary)]">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
