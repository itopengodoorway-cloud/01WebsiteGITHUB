import { createServerSupabase } from "@/lib/supabase-server";
import { ArrowLeft, Clock, Info, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import VideoPlayerClient from "./VideoPlayerClient";

export default async function VideoPage({ 
  params 
}: { 
  params: Promise<{ id: string; videoId: string }> 
}) {
  const { id: libraryId, videoId } = await params;
  const supabase = await createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect("/auth/login");

  // Fetch video details
  const { data: video } = await supabase
    .from("videos")
    .select("*, libraries(id, name, is_paid)")
    .eq("id", videoId)
    .single();

  if (!video) redirect(`/dashboard/libraries/${libraryId}`);

  // Check tier access
  if (video.libraries.is_paid) {
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", session.user.id)
      .eq("status", "active")
      .maybeSingle();

    if (!subscription) redirect("/dashboard/upgrade");
  }

  // Fetch current progress
  const { data: progress } = await supabase
    .from("video_progress")
    .select("progress_percentage")
    .eq("user_id", session.user.id)
    .eq("video_id", videoId)
    .maybeSingle();

  return (
    <div className="px-4 py-8 md:px-10 md:py-12 max-w-7xl mx-auto">
      <Link 
        href={`/dashboard/libraries/${libraryId}`} 
        className="inline-flex items-center gap-2 text-sm font-bold text-[color:var(--muted)] hover:text-[color:var(--primary)] transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Library
      </Link>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Video Player Column */}
        <div className="lg:col-span-2 space-y-8">
          <VideoPlayerClient 
            videoId={videoId} 
            youtubeId={video.youtube_id} 
            initialProgress={progress?.progress_percentage ?? 0} 
          />
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                   <span className="text-[10px] font-black text-[color:var(--accent)] uppercase tracking-widest">
                     {video.libraries.name}
                   </span>
                   {progress?.progress_percentage === 100 && (
                     <span className="flex items-center gap-1 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-full">
                       <CheckCircle2 className="h-3 w-3" /> Completed
                     </span>
                   )}
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-[color:var(--secondary)]">{video.title}</h1>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[color:var(--background)] border border-[color:var(--border)]/30 text-[color:var(--muted)]">
                   <Clock className="h-4 w-4" />
                   <span className="text-xs font-bold">{video.duration || "8:45"}</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[40px] bg-white border border-[color:var(--border)]">
              <h3 className="text-lg font-bold text-[color:var(--secondary)] mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-[color:var(--primary)]" />
                Lesson Overview
              </h3>
              <p className="text-[color:var(--muted)] font-medium leading-relaxed">
                {video.description || "Master the mechanical nuances of this drill to stabilize your release point and generate more compression through impact."}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar / Recommended Column */}
        <div className="space-y-8">
           <div className="rounded-[40px] bg-[color:var(--primary)] p-8 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-4">Coaching Note</h3>
              <p className="text-sm opacity-80 leading-relaxed mb-6">
                Pay close attention to the hip rotation at the 3:45 mark. This is where most amateurs lose power.
              </p>
              <Link href="/dashboard/co-chat" className="block w-full text-center py-3 rounded-2xl bg-[color:var(--accent)] text-[color:var(--secondary)] font-black text-xs uppercase tracking-widest hover:bg-white transition-all">
                 Ask Coach about this
              </Link>
           </div>

           <div className="rounded-[40px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-[color:var(--secondary)] mb-6">Next in Library</h3>
              <div className="space-y-4">
                 {/* This would ideally be dynamic next videos */}
                 <div className="p-4 rounded-2xl bg-white border border-[color:var(--border)]/30 flex items-center gap-4 group cursor-pointer hover:border-[color:var(--primary)] transition-all">
                    <div className="h-12 w-20 rounded-lg bg-[color:var(--background)] flex items-center justify-center shrink-0">
                       <Clock className="h-4 w-4 opacity-20" />
                    </div>
                    <div className="min-w-0">
                       <p className="text-xs font-bold text-[color:var(--secondary)] line-clamp-1">Stabilizing the Lead Leg</p>
                       <p className="text-[10px] font-medium text-[color:var(--muted)] uppercase">Lesson 02</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
