"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { CheckCircle2, Info, HeartHandshake } from "lucide-react";

export default function OnboardingPage() {
  const [fullName, setFullName] = useState("");
  const [handicap, setHandicap] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, current_handicap")
        .eq("id", session.user.id)
        .single();

      if (error) {
        setError(error.message);
      } else if (data) {
        setFullName(data.full_name ?? "");
        setHandicap(data.current_handicap?.toString() ?? "");
      }

      setLoading(false);
    }

    loadProfile();
  }, [router]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      setError("Please sign in to continue.");
      setSaving(false);
      return;
    }

    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert({
        id: session.user.id,
        full_name: fullName,
        current_handicap: handicap ? Number(handicap) : null,
        updated_at: new Date().toISOString(),
      });

    if (upsertError) {
      setError(upsertError.message);
    } else {
      setMessage("Profile updated successfully. Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[color:var(--background)] px-4 py-10 text-[color:var(--foreground)]">
      <div className="mx-auto max-w-4xl rounded-[40px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-[0_28px_100px_rgba(10,61,43,0.15)]">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[32px] bg-[color:var(--background)] p-8 shadow-sm">
            <div className="flex items-center gap-3 text-[color:var(--secondary)]">
              <CheckCircle2 className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Complete your onboarding</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
              Finish your profile to get tailored golf coaching recommendations and unlock the full IOG.doorway experience.
            </p>

            <form onSubmit={handleSave} className="mt-8 space-y-6">
              <label className="block text-sm font-medium text-[color:var(--secondary)]">
                Full name
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-[color:var(--border)] bg-white px-4 py-3 text-[color:var(--foreground)] outline-none shadow-sm"
                  placeholder="Your name"
                />
              </label>

              <label className="block text-sm font-medium text-[color:var(--secondary)]">
                Current handicap
                <input
                  type="number"
                  value={handicap}
                  onChange={(event) => setHandicap(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-[color:var(--border)] bg-white px-4 py-3 text-[color:var(--foreground)] outline-none shadow-sm"
                  placeholder="Optional, but strongly encouraged"
                  min="0"
                />
              </label>

              {error ? <p className="rounded-2xl bg-[#fee2e2] px-4 py-3 text-sm text-[#991b1b]">{error}</p> : null}
              {message ? <p className="rounded-2xl bg-[#f7f2d7] px-4 py-3 text-sm text-[#5c470d]">{message}</p> : null}

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center rounded-3xl bg-[color:var(--primary)] px-5 py-3 text-base font-semibold text-white transition hover:bg-[color:var(--primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save and Continue"}
              </button>
            </form>
          </section>

          <aside className="rounded-[32px] bg-[color:var(--primary)]/5 p-8 text-[color:var(--secondary)]">
            <div className="flex items-center gap-3 text-[color:var(--secondary)]">
              <Info className="h-5 w-5" />
              <h3 className="text-xl font-semibold">How it works</h3>
            </div>
            <div className="mt-6 space-y-5 text-sm leading-7 text-[color:var(--muted)]">
              <p>
                Your initial handicap helps us tailor video coaching and progress tracking to your current game.
              </p>
              <p>
                After saving, you’ll be taken to your dashboard where you can view your library access, chat with your coach, and track improvement.
              </p>
              <p className="rounded-3xl border border-[color:var(--border)] bg-white p-4 shadow-sm">
                <span className="font-semibold text-[color:var(--secondary)]">Tip:</span> Keep the handicap value optional if you’re not sure yet, but it makes coaching far more effective.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
