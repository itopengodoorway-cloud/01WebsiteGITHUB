import { createServerSupabase } from "@/lib/supabase-server";
import { 
  Trophy, 
  Video, 
  MessageSquare, 
  TrendingUp, 
  ChevronRight,
  Target,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Calendar,
  Play
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return null;

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

  // Fetch recent handicap history for the teaser
  const { data: history } = await supabase
    .from("handicap_history")
    .select("handicap, created_at")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  // Fetch in-progress videos
  const { data: continueWatching } = await supabase
    .from("video_progress")
    .select(`
      progress_percentage,
      videos (
        id,
        title,
        thumbnail_url,
        library_id,
        duration
      )
    `)
    .eq("user_id", session.user.id)
    .lt("progress_percentage", 100)
    .order("last_watched_at", { ascending: false })
    .limit(4);

  return (
    <div className="px-4 py-8 md:px-10 md:py-12 max-w-7xl mx-auto">
      {!isEmailVerified && (
        <div className="mb-8 rounded-3xl bg-red-50 px-6 py-4 text-sm text-red-800 border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            Please verify your email to unlock all coaching features.
          </div>
          <button className="text-sm font-black underline hover:no-underline underline-offset-4">Resend Link</button>
        </div>
      )}

      {/* Header Section */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isPremium ? 'bg-[color:var(--accent)] text-[color:var(--secondary)]' : 'bg-[color:var(--primary)] text-white'}`}>
                {isPremium ? 'Premium Member' : 'Free Account'}
              </span>
              <span className="text-[10px] font-bold text-[color:var(--muted)] uppercase tracking-widest flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {format(new Date(), "MMMM yyyy")}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[color:var(--secondary)] tracking-tight">
              Good morning, <span className="text-[color:var(--primary)]">{name.split(' ')[0]}</span>.
            </h1>
            <p className="mt-4 text-[color:var(--muted)] max-w-xl font-medium leading-relaxed">
              Your next goal is to break <span className="text-[color:var(--secondary)] font-bold">85</span>. 
              Certified coaches are ready to review your latest swing.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard/handicap" className="hidden sm:flex flex-col items-end group">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--muted)] mb-1">Current Handicap</span>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-[color:var(--secondary)]">{handicap}</span>
                <div className="h-10 w-10 rounded-2xl bg-[color:var(--primary)]/5 flex items-center justify-center group-hover:bg-[color:var(--primary)] group-hover:text-white transition-all">
                  <TrendingDown className="h-5 w-5" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Featured CO-CHAT Section */}
          <section className="relative rounded-[48px] bg-[color:var(--secondary)] p-10 text-white overflow-hidden group shadow-2xl shadow-[color:var(--secondary)]/20">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <MessageSquare className="h-40 w-40" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-[color:var(--accent)]" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-[color:var(--accent)]">Priority Access</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4">Start Your <span className="text-[color:var(--accent)]">CO-CHAT</span> Session</h2>
              <p className="text-white/70 max-w-md mb-8 font-medium leading-relaxed">
                Upload your swing video now for a frame-by-frame professional analysis by our pro coaches.
              </p>
              <Link 
                href={isPremium ? "/dashboard/co-chat" : "/dashboard/upgrade"} 
                className="inline-flex items-center gap-3 rounded-2xl bg-[color:var(--accent)] px-8 py-4 text-sm font-black text-[color:var(--secondary)] hover:bg-white transition-all active:scale-95"
              >
                {isPremium ? "Open Chat Console" : "Upgrade to Unlock"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Continue Watching Section */}
          {continueWatching && continueWatching.length > 0 && (
             <section>
                <div className="flex items-center justify-between mb-6 px-2">
                   <h3 className="text-sm font-black uppercase tracking-widest text-[color:var(--secondary)]">Continue Watching</h3>
                   <Link href="/dashboard/libraries" className="text-[10px] font-black uppercase tracking-widest text-[color:var(--primary)] hover:underline">View All</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {continueWatching.map((item: any) => (
                      <Link 
                        key={item.videos.id} 
                        href={`/dashboard/libraries/${item.videos.library_id}/video/${item.videos.id}`}
                        className="group flex items-center gap-4 p-3 rounded-[28px] bg-white border border-[color:var(--border)] hover:border-[color:var(--primary)] transition-all shadow-sm"
                      >
                         <div className="h-16 w-24 rounded-2xl bg-[color:var(--background)] overflow-hidden shrink-0 relative">
                            {item.videos.thumbnail_url && <img src={item.videos.thumbnail_url} className="w-full h-full object-cover" />}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/0 transition-colors">
                               <Play className="h-4 w-4 text-white fill-current opacity-80" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                               <div className="h-full bg-[color:var(--accent)]" style={{ width: `${item.progress_percentage}%` }}></div>
                            </div>
                         </div>
                         <div className="min-w-0 flex-1 pr-2">
                            <p className="text-xs font-bold text-[color:var(--secondary)] truncate mb-1">{item.videos.title}</p>
                            <p className="text-[10px] font-medium text-[color:var(--muted)] uppercase tracking-widest">{item.progress_percentage}% Complete</p>
                         </div>
                         <ChevronRight className="h-4 w-4 text-[color:var(--muted)] mr-2" />
                      </Link>
                   ))}
                </div>
             </section>
          )}

          {/* Quick Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Link href="/dashboard/handicap" className="group p-8 rounded-[40px] border border-[color:var(--border)] bg-white hover:border-[color:var(--primary)] transition-all text-left">
              <div className="flex items-center justify-between mb-8">
                <div className="h-12 w-12 rounded-2xl bg-[color:var(--primary)]/5 flex items-center justify-center text-[color:var(--primary)]">
                  <TrendingDown className="h-6 w-6" />
                </div>
                <ChevronRight className="h-5 w-5 text-[color:var(--muted)] group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[color:var(--muted)] mb-2">Handicap Trend</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-black text-[color:var(--secondary)]">-1.2</span>
                <span className="text-xs font-bold text-green-600 mb-1.5">v Last Month</span>
              </div>
              {/* Mini history teaser */}
              <div className="mt-6 flex items-center gap-1">
                {history?.map((h, i) => (
                   <div key={i} className="flex-1 h-1 bg-[color:var(--background)] rounded-full overflow-hidden">
                      <div className="h-full bg-[color:var(--primary)]" style={{ width: `${(1 / (h.handicap || 1)) * 500}%` }}></div>
                   </div>
                ))}
              </div>
            </Link>

            <Link href="/dashboard/libraries" className="group p-8 rounded-[40px] border border-[color:var(--border)] bg-white hover:border-[color:var(--primary)] transition-all text-left">
              <div className="flex items-center justify-between mb-8">
                <div className="h-12 w-12 rounded-2xl bg-[color:var(--primary)]/5 flex items-center justify-center text-[color:var(--primary)]">
                  <Video className="h-6 w-6" />
                </div>
                <ChevronRight className="h-5 w-5 text-[color:var(--muted)] group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[color:var(--muted)] mb-2">Video Progress</h3>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-black text-[color:var(--secondary)]">14</span>
                <span className="text-xs font-bold text-[color:var(--muted)] mb-1.5">Drills Completed</span>
              </div>
              <div className="mt-6 h-1 w-full bg-[color:var(--background)] rounded-full">
                <div className="h-full bg-[color:var(--accent)] w-2/3 rounded-full"></div>
              </div>
            </Link>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Subscription Status Card */}
          <div className={`rounded-[40px] p-8 text-white shadow-xl relative overflow-hidden group ${isPremium ? 'bg-[color:var(--primary)]' : 'bg-gradient-to-br from-[color:var(--primary)] to-[color:var(--secondary)]'}`}>
            <div className="absolute -right-4 -bottom-4 h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-4">Membership Tier</p>
            <h3 className="text-2xl font-black mb-2">{isPremium ? "Premium Coach" : "Free Starter"}</h3>
            <p className="text-sm opacity-80 font-medium leading-relaxed mb-8">
              {isPremium 
                ? "Your full access to all professional coaching materials is active until the end of the month." 
                : "Unlock 1-on-1 video feedback and 200+ exclusive pro drills today."}
            </p>
            <Link 
              href="/dashboard/upgrade"
              className={`block w-full text-center rounded-2xl py-4 text-xs font-black uppercase tracking-widest transition active:scale-[0.98] ${
                isPremium 
                  ? "bg-white/10 text-white hover:bg-white/20 border border-white/20" 
                  : "bg-[color:var(--accent)] text-[color:var(--secondary)] hover:bg-white shadow-lg shadow-black/20"
              }`}
            >
              {isPremium ? "Manage Subscription" : "Upgrade to Premium"}
            </Link>
          </div>

          {/* Quick Links / Tips */}
          <div className="rounded-[40px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-[color:var(--secondary)] mb-6 flex items-center gap-2">
              <Target className="h-4 w-4" /> Focus Drills
            </h3>
            <div className="space-y-4">
              <QuickLinkItem title="The 3-Foot Circle" icon={<Target className="h-4 w-4" />} />
              <QuickLinkItem title="Weight Shift Reset" icon={<TrendingUp className="h-4 w-4" />} />
              <QuickLinkItem title="Tempo Timing" icon={<Video className="h-4 w-4" />} />
            </div>
            <div className="mt-8 pt-8 border-t border-[color:var(--border)]/50">
              <p className="text-[11px] font-bold text-[color:var(--muted)] leading-relaxed italic">
                "Golf is a game of misses. The player who misses the best wins."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLinkItem({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-white border border-[color:var(--border)]/30 flex items-center justify-center text-[color:var(--primary)] shadow-sm">
          {icon}
        </div>
        <span className="text-sm font-bold text-[color:var(--secondary)] group-hover:text-[color:var(--primary)] transition-colors">{title}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-[color:var(--muted)] opacity-0 group-hover:opacity-100 transition-all" />
    </div>
  );
}
