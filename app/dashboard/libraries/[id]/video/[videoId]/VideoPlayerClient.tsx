"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { Loader2 } from "lucide-react";

export default function VideoPlayerClient({ 
  videoId, 
  youtubeId, 
  initialProgress 
}: { 
  videoId: string; 
  youtubeId: string; 
  initialProgress: number 
}) {
  const [loading, setLoading] = useState(true);
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          modestbranding: 1,
          rel: 0,
          start: Math.floor((initialProgress / 100) * 0) // We'll need duration for real resume, keeping it simple for now
        },
        events: {
          onReady: () => setLoading(false),
          onStateChange: handlePlayerStateChange
        }
      });
    };

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (playerRef.current) playerRef.current.destroy();
    };
  }, [youtubeId]);

  const handlePlayerStateChange = (event: any) => {
    // YT.PlayerState.PLAYING is 1
    if (event.data === 1) {
      startProgressTracking();
    } else {
      stopProgressTracking();
    }
  };

  const startProgressTracking = () => {
    if (progressIntervalRef.current) return;
    
    progressIntervalRef.current = setInterval(async () => {
      if (playerRef.current && playerRef.current.getDuration) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        const percentage = Math.floor((currentTime / duration) * 100);

        if (percentage > 0) {
          saveProgress(percentage);
        }
      }
    }, 5000); // Save every 5 seconds
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const saveProgress = async (percentage: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    await supabase
      .from("video_progress")
      .upsert({
        user_id: session.user.id,
        video_id: videoId,
        progress_percentage: percentage,
        last_watched_at: new Date().toISOString()
      }, { onConflict: 'user_id, video_id' });
  };

  return (
    <div className="relative w-full aspect-video rounded-[32px] overflow-hidden bg-black shadow-2xl">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--secondary)]">
          <Loader2 className="h-10 w-10 animate-spin text-[color:var(--accent)]" />
        </div>
      )}
      <div id="youtube-player" className="w-full h-full"></div>
    </div>
  );
}
