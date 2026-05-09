import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { data: profileData, error } = await supabase
    .from("profiles")
    .select("full_name, current_handicap")
    .eq("id", session.user.id)
    .single();

  const name = profileData?.full_name || session.user.email;
  const handicap = profileData?.current_handicap ?? "not set";

  return (
    <div className="min-h-screen bg-[color:var(--background)] px-4 py-12 text-[color:var(--foreground)]">
      <div className="mx-auto max-w-5xl rounded-[40px] border border-[color:var(--border)] bg-[color:var(--surface)] p-10 shadow-[0_30px_90px_rgba(10,61,43,0.1)]">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[color:var(--muted)]">Dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold text-[color:var(--secondary)]">Welcome back, {name}</h1>
          </div>
          <div className="rounded-3xl bg-[color:var(--primary)]/5 px-5 py-3 text-sm font-semibold text-[color:var(--secondary)]">
            Handicap: {handicap}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[32px] border border-[color:var(--border)] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Quick links</p>
            <ul className="mt-4 space-y-3 text-[color:var(--foreground)]">
              <li className="rounded-3xl bg-[color:var(--background)] p-4">Library access</li>
              <li className="rounded-3xl bg-[color:var(--background)] p-4">Chat with coach</li>
              <li className="rounded-3xl bg-[color:var(--background)] p-4">Progress tracking</li>
            </ul>
          </div>
          <div className="rounded-[32px] border border-[color:var(--border)] bg-white p-6 shadow-sm lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Overview</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-[color:var(--background)] p-6">
                <p className="text-sm text-[color:var(--muted)]">Membership</p>
                <p className="mt-3 text-2xl font-semibold text-[color:var(--secondary)]">Free</p>
              </div>
              <div className="rounded-3xl bg-[color:var(--background)] p-6">
                <p className="text-sm text-[color:var(--muted)]">Next step</p>
                <p className="mt-3 text-2xl font-semibold text-[color:var(--secondary)]">Complete onboarding</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
