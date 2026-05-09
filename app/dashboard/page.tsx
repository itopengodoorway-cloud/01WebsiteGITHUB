import { createServerSupabase } from "@/lib/supabase-server";
import { 
  Trophy, 
  Video, 
  MessageSquare, 
  TrendingUp, 
  ChevronRight, 
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return null; // Should be handled by middleware/layout

  const { data: profileData } = await supabase
    .from("profiles")
    .select("full_name, current_handicap")
    .eq("id", session.user.id)
    .single();

  const name = profileData?.full_name ?? "Player";
  const handicap = profileData?.current_handicap ?? "N/A";
  const isEmailVerified = session.user.email_confirmed_at;

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", session.user.id)
    .eq("status", "active")
    .maybeSingle();

  const isPremium = !!subscription;

  return (
    <div className="px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-5xl">
        {!isEmailVerified && (
          <div className="mb-8 rounded-2xl bg-red-50 px-6 py-4 text-sm text-red-800 border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-medium">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              Please verify your email to unlock all features.
            </div>
            <button className="text-sm font-bold underline hover:no-underline underline-offset-4">Resend Verification</button>
          </div>
        )}

        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[color:var(--muted)] mb-3">Player Statistics</p>
            <h1 className="text-4xl md:text-5xl font-bold text-[color:var(--secondary)]">Welcome, {name}</h1>
          </div>
          
          <Link href="/dashboard/handicap" className="group flex items-center gap-4 rounded-[32px] bg-white border border-[color:var(--border)] p-2 pr-6 shadow-sm hover:border-[color:var(--primary)] transition-all">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--primary)] text-white font-black text-xl">
              {handicap}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[color:var(--muted)]">Handicap Index</p>
              <div className="flex items-center gap-1 text-sm font-bold text-[color:var(--secondary)]">
                Track Progress <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Stats */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <DashboardCard 
                title="Next Lesson" 
                value="Correcting Slice" 
                subtitle="Premium Drills" 
                icon={<Video className="h-5 w-5 text-[color:var(--primary)]" />}
              />
              <DashboardCard 
                title="Messages" 
                value="2 Pending" 
                subtitle="From Head Coach" 
                icon={<MessageSquare className="h-5 w-5 text-[color:var(--primary)]" />}
              />
            </div>

            <div className="rounded-[40px] border border-[color:var(--border)] bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-[color:var(--secondary)]">Recent Coaching Content</h3>
                <button className="text-sm font-bold text-[color:var(--primary)] hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between rounded-3xl bg-[color:var(--background)] p-4 hover:scale-[1.01] transition-transform cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-[color:var(--border)]/30">
                        <Video className="h-5 w-5 text-[color:var(--primary)]" />
                      </div>
                      <div>
                        <p className="font-bold text-[color:var(--secondary)] text-sm">Pro Drill #{i + 14}</p>
                        <p className="text-xs text-[color:var(--muted)] font-medium">Swing Mechanics • 8 mins</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[color:var(--muted)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Cards */}
          <div className="space-y-8">
            <div className={`rounded-[40px] p-8 text-white shadow-xl relative overflow-hidden group ${isPremium ? 'bg-[color:var(--secondary)]' : 'bg-[color:var(--primary)]'}`}>
              <div className="absolute -right-4 -bottom-4 h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
              <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-4">Membership</p>
              <h3 className="text-2xl font-bold mb-2">{isPremium ? "Premium Coach" : "Free Plan"}</h3>
              <p className="text-sm opacity-80 leading-relaxed mb-6">
                {isPremium 
                  ? "You have full access to all video libraries and coaching tools." 
                  : "Upgrade to Premium for full video access and direct 1-on-1 coaching."}
              </p>
              <Link 
                href="/dashboard/upgrade"
                className={`block w-full text-center rounded-2xl py-3 text-sm font-black transition active:scale-[0.98] ${
                  isPremium 
                    ? "bg-white/10 text-white hover:bg-white/20" 
                    : "bg-[color:var(--accent)] text-[color:var(--secondary)] hover:bg-white"
                }`}
              >
                {isPremium ? "Manage Subscription" : "Upgrade Now"}
              </Link>
            </div>

            <div className="rounded-[40px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-[color:var(--primary)]" />
                <h3 className="font-bold text-[color:var(--secondary)]">Improvement Tip</h3>
              </div>
              <p className="text-sm leading-7 text-[color:var(--muted)]">
                Consistent practice of the "T-Drill" from your library could lower your handicap by up to 2.4 strokes in the next month.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, subtitle, icon }: { title: string; value: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-[32px] border border-[color:var(--border)] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="h-10 w-10 rounded-2xl bg-[color:var(--background)] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[color:var(--muted)]">{title}</p>
        <p className="mt-1 text-xl font-bold text-[color:var(--secondary)]">{value}</p>
        <p className="text-xs font-medium text-[color:var(--muted)]">{subtitle}</p>
      </div>
    </div>
  );
}
