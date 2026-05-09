import { createServerSupabase } from "@/lib/supabase-server";
import { Video, Lock, Play, Crown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LibrariesPage() {
  const supabase = await createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect("/auth/login");

  // Get user subscription status
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", session.user.id)
    .eq("status", "active")
    .maybeSingle();

  const isPremium = !!subscription;

  // Fetch libraries from Supabase
  const { data: libraries, error } = await supabase
    .from("libraries")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="px-4 py-8 md:px-10 md:py-12 max-w-7xl mx-auto">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
           <Video className="h-8 w-8 text-[color:var(--primary)]" />
           <h1 className="text-4xl font-black text-[color:var(--secondary)]">Video Libraries</h1>
        </div>
        <p className="text-[color:var(--muted)] font-medium max-w-2xl">
          Unlock the secrets of the pros. Browse our curated collection of mechanical drills, 
          mental strategies, and course management guides.
        </p>
      </header>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 mb-8">
          Error loading libraries: {error.message}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {libraries?.map((lib) => {
          const isLocked = lib.is_paid && !isPremium;
          
          return (
            <div 
              key={lib.id} 
              className={`group relative rounded-[40px] bg-white border border-[color:var(--border)] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[color:var(--primary)]/10 ${isLocked ? 'grayscale-[0.5] opacity-90' : 'hover:border-[color:var(--primary)]'}`}
            >
              {/* Library Thumbnail / Header */}
              <div className="aspect-video bg-[color:var(--background)] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[color:var(--primary)]/5 group-hover:bg-transparent transition-colors"></div>
                <Video className={`h-12 w-12 text-[color:var(--primary)] transition-transform duration-700 group-hover:scale-110 ${isLocked ? 'opacity-20' : 'opacity-40'}`} />
                
                {lib.is_paid && (
                  <div className={`absolute top-6 right-6 h-12 w-12 rounded-2xl backdrop-blur-md flex items-center justify-center shadow-xl border border-white/20 transition-transform group-hover:scale-110 ${isPremium ? 'bg-green-500/90 text-white' : 'bg-white/90 text-[color:var(--accent)]'}`}>
                    {isPremium ? <Play className="h-5 w-5 fill-current" /> : <Lock className="h-5 w-5" />}
                  </div>
                )}
                
                {isLocked && (
                  <div className="absolute inset-0 bg-[color:var(--secondary)]/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Link href="/dashboard/upgrade" className="bg-[color:var(--accent)] text-[color:var(--secondary)] px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
                        Unlock Library
                     </Link>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${lib.is_paid ? 'text-[color:var(--accent)]' : 'text-green-600'}`}>
                    {lib.is_paid ? 'Premium Library' : 'Free Access'}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[color:var(--secondary)] mb-3 leading-tight">{lib.name}</h3>
                <p className="text-sm text-[color:var(--muted)] font-medium mb-8 line-clamp-2 leading-relaxed">
                  {lib.description || "Master these specific techniques with our certified coaching staff."}
                </p>
                
                {isLocked ? (
                  <Link 
                    href="/dashboard/upgrade"
                    className="flex items-center justify-between w-full p-4 rounded-2xl bg-[color:var(--background)] text-[color:var(--muted)] font-bold text-sm"
                  >
                    <span>Premium Content</span>
                    <Crown className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link 
                    href={`/dashboard/libraries/${lib.id}`}
                    className="flex items-center justify-between w-full p-4 rounded-2xl bg-[color:var(--primary)] text-white font-bold text-sm hover:bg-[color:var(--primary-light)] transition-all group/btn"
                  >
                    <span>Browse Lessons</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}

        {/* Teaser for Library 3 (Future Content) */}
        {!libraries?.find(l => l.name.includes("Library 3")) && (
           <div className="rounded-[40px] border-2 border-dashed border-[color:var(--border)] p-10 flex flex-col items-center justify-center text-center group bg-white/50">
              <div className="h-16 w-16 rounded-3xl bg-[color:var(--background)] flex items-center justify-center text-[color:var(--muted)] mb-6 group-hover:bg-[color:var(--primary)]/5 transition-all">
                <Crown className="h-8 w-8 opacity-20" />
              </div>
              <h3 className="text-xl font-bold text-[color:var(--secondary)]/40 mb-2">Short Game Pro</h3>
              <p className="text-sm text-[color:var(--muted)] font-medium mb-6">Coming next month for Premium members.</p>
              <span className="text-[10px] font-black uppercase tracking-widest text-[color:var(--muted)]">Library 3 Preview</span>
           </div>
        )}
      </div>
    </div>
  );
}
