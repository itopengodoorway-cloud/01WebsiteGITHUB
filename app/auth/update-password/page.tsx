"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated successfully. Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--background)] px-4 py-10">
      <div className="w-full max-w-md rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-[0_24px_80px_rgba(10,61,43,0.12)]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--primary)] text-white shadow-lg">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-semibold text-[color:var(--secondary)]">New password</h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
            Create a new secure password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-medium text-[color:var(--secondary)]">
            New Password
            <div className="mt-2 flex items-center rounded-2xl border border-[color:var(--border)] bg-white px-3 py-2 shadow-sm">
              <Lock className="mr-2 h-4 w-4 text-[color:var(--primary)]" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                className="w-full border-0 bg-transparent text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--muted)]"
                placeholder="••••••••"
              />
            </div>
          </label>

          <label className="block text-sm font-medium text-[color:var(--secondary)]">
            Confirm Password
            <div className="mt-2 flex items-center rounded-2xl border border-[color:var(--border)] bg-white px-3 py-2 shadow-sm">
              <Lock className="mr-2 h-4 w-4 text-[color:var(--primary)]" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={6}
                className="w-full border-0 bg-transparent text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--muted)]"
                placeholder="••••••••"
              />
            </div>
          </label>

          {error ? <p className="rounded-2xl bg-[#fee2e2] px-4 py-3 text-sm text-[#991b1b]">{error}</p> : null}
          {message ? <p className="rounded-2xl bg-[#f7f2d7] px-4 py-3 text-sm text-[#5c470d]">{message}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-2xl bg-[color:var(--primary)] px-5 py-3 text-base font-semibold text-white transition hover:bg-[color:var(--primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
