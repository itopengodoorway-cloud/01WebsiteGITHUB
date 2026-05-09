"use client";

import { Video, Lock, Play } from "lucide-react";

export default function LibrariesPage() {
  return (
    <div className="px-4 py-8 md:px-10 md:py-12 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-[color:var(--secondary)] mb-4">Video Libraries</h1>
        <p className="text-[color:var(--muted)] font-medium">Professional drills and mechanics broken down by category.</p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Swing Fundamentals", count: 12, premium: false },
          { title: "Short Game Mastery", count: 24, premium: true },
          { title: "Putting Precision", count: 18, premium: true },
          { title: "Mental Game", count: 8, premium: false },
          { title: "Golf Fitness", count: 15, premium: true },
          { title: "Trouble Shots", count: 20, premium: true },
        ].map((lib, i) => (
          <div key={i} className="group relative rounded-[40px] bg-white border border-[color:var(--border)] overflow-hidden hover:border-[color:var(--primary)] transition-all">
            <div className="aspect-video bg-[color:var(--background)] flex items-center justify-center">
              <Video className="h-12 w-12 text-[color:var(--primary)] opacity-20" />
              {lib.premium && (
                <div className="absolute top-4 right-4 h-10 w-10 rounded-2xl bg-white/90 backdrop-blur flex items-center justify-center text-[color:var(--accent)] shadow-lg">
                  <Lock className="h-5 w-5" />
                </div>
              )}
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold text-[color:var(--secondary)] mb-2">{lib.title}</h3>
              <p className="text-sm text-[color:var(--muted)] font-medium mb-6">{lib.count} Lessons</p>
              <button className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[color:var(--primary)] group-hover:gap-3 transition-all">
                Browse Library <Play className="h-3 w-3 fill-current" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
