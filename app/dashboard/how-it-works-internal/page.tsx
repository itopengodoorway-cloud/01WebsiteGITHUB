"use client";

import { HelpCircle, Play, ChevronRight, CheckCircle2 } from "lucide-react";

export default function HowItWorksInternal() {
  return (
    <div className="px-4 py-8 md:px-10 md:py-12 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-[color:var(--secondary)] mb-4">How It Works</h1>
        <p className="text-[color:var(--muted)] font-medium">Mastering the IOG.doorway coaching system.</p>
      </header>

      <div className="space-y-12">
        <div className="aspect-video rounded-[48px] bg-[color:var(--secondary)] flex items-center justify-center relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000" />
          <button className="relative h-20 w-20 rounded-full bg-[color:var(--accent)] flex items-center justify-center text-[color:var(--secondary)] shadow-2xl active:scale-95 transition-all hover:bg-white group/btn">
            <Play className="h-8 w-8 fill-current ml-1 group-hover/btn:scale-110 transition-transform" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
             <p className="text-white font-bold">Watch Onboarding Guide</p>
             <p className="text-white/70 text-sm">Everything you need to know in 3 minutes.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <StepCard 
            number="01" 
            title="Update Status" 
            desc="Keep your handicap index current to get the best drill recommendations." 
          />
          <StepCard 
            number="02" 
            title="Upload Swing" 
            desc="Use CO-CHAT to send videos of your driver and irons for frame-by-frame review." 
          />
          <StepCard 
            number="03" 
            title="Master Drills" 
            desc="Complete the pro drills assigned by your coach to lock in mechanical changes." 
          />
        </div>

        <div className="rounded-[48px] bg-[color:var(--surface)] p-10 border border-[color:var(--border)]">
          <h3 className="text-2xl font-black text-[color:var(--secondary)] mb-8">System Requirements</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-[color:var(--primary)] shrink-0" />
              <div>
                <p className="font-bold text-[color:var(--secondary)]">Video Format</p>
                <p className="text-sm text-[color:var(--muted)]">MP4 or MOV preferred. Maximum 100MB per clip.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-[color:var(--primary)] shrink-0" />
              <div>
                <p className="font-bold text-[color:var(--secondary)]">Angles</p>
                <p className="text-sm text-[color:var(--muted)]">Face-on and Down-the-line at chest height for best analysis.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCard({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="p-8 rounded-[40px] border border-[color:var(--border)] bg-white">
      <p className="text-4xl font-black text-[color:var(--accent)] mb-6 opacity-20">{number}</p>
      <h3 className="text-xl font-bold text-[color:var(--secondary)] mb-4">{title}</h3>
      <p className="text-sm text-[color:var(--muted)] leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
