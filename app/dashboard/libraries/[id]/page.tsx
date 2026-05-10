import { createServerSupabase } from "@/lib/supabase-server";
import { Play, ArrowLeft, Clock, Video, Lock, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LibraryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect("/auth/login");

  // Get library details
  const { data: library } = await supabase
    .from("libraries")
    .select("*")
    .eq("id", id)
    .single();

  if (!library) redirect("/dashboard/libraries");

  // Check access
  if (library.is_paid) {
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", session.user.id)
      .eq("status", "active")
      .maybeSingle();

    if (!subscription) redirect("/dashboard/upgrade");
  }

  // Fetch videos with progress
  const { data: videos } = await supabase
    .from("videos")
    .select(`
      *,
      video_progress(progress_percentage)
    `)
    .eq("library_id", id)
    .order("created_at", { ascending: true });

  return (
    <div className="px-4 py-8 md:px-10 md:py-12 max-w-7xl mx-auto">
      <Link href="/dashboard/libraries" className="inline-flex items-center gap-2 text-sm font-bold text-[color:var(--muted)] hover:text-[color:var(--primary)] transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back to Libraries
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${library.is_paid ? 'bg-[color:var(--accent)] text-[color:var(--secondary)]' : 'bg-green-100 text-green-700'}`}>
             {library.is_paid ? 'Premium Library' : 'Free Access'}
           </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[color:var(--secondary)] mb-4">{library.name}</h1>
        <p className="text-[color:var(--muted)] font-medium max-w-3xl text-lg leading-relaxed">{library.description}</p>
      </header>

      <div className="grid gap-6">
        {videos?.map((video: any, i: number) => {
          const progress = video.video_progress?.[0]?.progress_percentage || 0;
          
          return (
            <Link 
              key={video.id}
              href={`/dashboard/libraries/${id}/video/${video.id}`}
              className="group rounded-[32px] bg-white border border-[color:var(--border)] p-6 md:p-8 hover:border-[color:var(--primary)] transition-all flex flex-col md:flex-row gap-8 items-center text-left"
            >
              {/* Thumbnail Area */}
              <div className="w-full md:w-72 shrink-0 aspect-video rounded-[24px] bg-[color:var(--background)] overflow-hidden relative shadow-lg">
                {video.thumbnail_url ? (
                  <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-10">
                    <Video className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                   <div className="h-14 w-14 rounded-full bg-[color:var(--accent)] flex items-center justify-center text-[color:var(--secondary)] shadow-xl scale-90 group-hover:scale-100 transition-transform">
                      <Play className="h-6 w-6 fill-current ml-1" />
                   </div>
                </div>
                
                {progress > 0 && (
                   <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">
                      <div className="h-full bg-[color:var(--accent)]" style={{ width: `${progress}%` }}></div>
                   </div>
                )}

                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-black/60 text-white text-[10px] font-black tracking-widest backdrop-blur-sm">
                  {video.duration || "8:45"}
                </div>
              </div>

              {/* Video Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                   <span className="text-[10px] font-black text-[color:var(--accent)] uppercase tracking-widest">Lesson {String(i + 1).padStart(2, '0')}</span>
                   {progress === 100 && (
                      <span className="flex items-center gap-1 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3" /> Completed
                      </span>
                   )}
                   {progress > 0 && progress < 100 && (
                      <span className="text-[10px] font-black text-[color:var(--primary)] uppercase tracking-widest bg-[color:var(--primary)]/5 px-2 py-0.5 rounded-full">
                        {progress}% Watched
                      </span>
                   )}
                </div>
                <h3 className="text-2xl font-bold text-[color:var(--secondary)] mb-3">{video.title}</h3>
                <p className="text-sm text-[color:var(--muted)] font-medium mb-6 line-clamp-2 max-w-2xl leading-relaxed">
                  {video.description || "Master the specific mechanics and drills required to take your game to the next level."}
                </p>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[color:var(--primary)] group-hover:underline">
                    {progress > 0 ? 'Resume Lesson' : 'Start Watching'} <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {(!videos || videos.length === 0) && (
          <div className="py-20 text-center rounded-[48px] bg-[color:var(--background)] border-2 border-dashed border-[color:var(--border)]">
             <Video className="h-12 w-12 text-[color:var(--muted)] mx-auto mb-4 opacity-20" />
             <h3 className="text-xl font-bold text-[color:var(--secondary)] opacity-50">Lessons coming soon</h3>
             <p className="text-sm text-[color:var(--muted)] mt-2">The coaching staff is currently preparing this library.</p>
          </div>
        )}
      </div>
    </div>
  );
}
