"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { User, Mail, FileText, Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/auth/login");
        return;
      }

      setEmail(session.user.email ?? "");

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setFullName(data.full_name ?? "");
      }
      setLoading(false);
    }

    loadProfile();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", session.user.id);

    if (error) {
      setError(error.message);
    } else {
      setMessage("Profile updated successfully!");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--background)]">
        <Loader2 className="h-8 w-8 animate-spin text-[color:var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[40px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 md:p-10 shadow-[color:var(--shadow)]">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-[color:var(--primary)] text-white shadow-lg">
              <User className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-bold text-[color:var(--secondary)]">Your Profile</h1>
            <p className="mt-2 text-[color:var(--muted)]">Manage your account information</p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[color:var(--secondary)]">Email Address</label>
              <div className="flex items-center rounded-2xl border border-[color:var(--border)] bg-white/50 px-4 py-3 text-[color:var(--muted)] shadow-sm">
                <Mail className="mr-3 h-4 w-4" />
                <input type="text" value={email} disabled className="w-full bg-transparent outline-none cursor-not-allowed" />
              </div>
              <p className="text-[10px] text-[color:var(--muted)] px-2">Email cannot be changed here.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[color:var(--secondary)]">Full Name</label>
              <div className="flex items-center rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 text-[color:var(--foreground)] shadow-sm focus-within:ring-2 focus-within:ring-[color:var(--primary)]/20 transition-all">
                <User className="mr-3 h-4 w-4 text-[color:var(--primary)]" />
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  required
                  className="w-full bg-transparent outline-none" 
                  placeholder="John Doe"
                />
              </div>
            </div>

            {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800 border border-red-100">{error}</p>}
            {message && <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-800 border border-green-100">{message}</p>}

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--primary)] px-6 py-4 text-lg font-bold text-white transition hover:bg-[color:var(--primary-light)] active:scale-[0.98] disabled:opacity-60 shadow-lg shadow-[color:var(--primary)]/20"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
