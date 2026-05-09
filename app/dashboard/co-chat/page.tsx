"use client";

import { MessageSquare, Video, Send, Mic, Paperclip, MoreVertical } from "lucide-react";

export default function CoChatPage() {
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Chat Header */}
      <header className="px-8 py-6 border-b border-[color:var(--border)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[color:var(--primary)] flex items-center justify-center text-[color:var(--accent)] shadow-lg shadow-[color:var(--primary)]/20">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[color:var(--secondary)]">CO-CHAT Console</h1>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-[color:var(--muted)] uppercase tracking-widest">Head Coach Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 px-4 rounded-xl border border-[color:var(--border)] text-sm font-bold text-[color:var(--secondary)] hover:bg-[color:var(--background)] transition-all">Session History</button>
          <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-[color:var(--border)] text-[color:var(--muted)] hover:bg-[color:var(--background)] transition-all">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[color:var(--background)]">
        <div className="flex justify-center">
          <span className="px-4 py-1.5 rounded-full bg-white border border-[color:var(--border)] text-[10px] font-black text-[color:var(--muted)] uppercase tracking-[0.2em] shadow-sm">Today</span>
        </div>

        {/* Coach Message */}
        <div className="flex gap-4 max-w-3xl">
          <div className="h-10 w-10 rounded-xl bg-[color:var(--secondary)] flex items-center justify-center shrink-0 text-white font-black text-xs shadow-md">HC</div>
          <div className="space-y-2">
            <div className="rounded-[24px] rounded-tl-none bg-white p-6 shadow-sm border border-[color:var(--border)]/30 text-sm leading-relaxed font-medium text-[color:var(--secondary)]">
              Welcome to CO-CHAT. I've reviewed your latest handicap update. To help you break 85, I need to see your current driver setup. 
              <br/><br/>
              Please upload a face-on and down-the-line video when you're at the range today.
            </div>
            <span className="text-[10px] font-bold text-[color:var(--muted)] uppercase ml-2">Head Coach • 9:41 AM</span>
          </div>
        </div>

        {/* User Message Placeholder */}
        <div className="flex flex-row-reverse gap-4 max-w-3xl ml-auto">
          <div className="h-10 w-10 rounded-xl bg-[color:var(--accent)] flex items-center justify-center shrink-0 text-[color:var(--secondary)] font-black text-xs shadow-md uppercase">JD</div>
          <div className="space-y-2 text-right">
            <div className="rounded-[24px] rounded-tr-none bg-[color:var(--primary)] p-6 shadow-xl text-sm leading-relaxed font-medium text-white text-left">
              Thanks Coach! I'll head to the range this afternoon and get those clips uploaded. Really struggling with the late release.
            </div>
            <span className="text-[10px] font-bold text-[color:var(--muted)] uppercase mr-2">You • 10:05 AM</span>
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <footer className="p-6 bg-white border-t border-[color:var(--border)] shrink-0">
        <div className="max-w-4xl mx-auto flex items-end gap-4">
          <div className="flex-1 relative">
            <textarea 
              placeholder="Message your coach..." 
              rows={1}
              className="w-full rounded-[24px] border border-[color:var(--border)] bg-[color:var(--background)] px-6 py-4 pr-32 outline-none focus:border-[color:var(--primary)] focus:ring-4 focus:ring-[color:var(--primary)]/5 transition-all text-sm font-medium resize-none"
            />
            <div className="absolute right-4 bottom-3 flex items-center gap-2">
              <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[color:var(--primary)]/5 text-[color:var(--muted)] hover:text-[color:var(--primary)] transition-all">
                <Paperclip className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[color:var(--primary)]/5 text-[color:var(--muted)] hover:text-[color:var(--primary)] transition-all">
                <Mic className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 flex items-center justify-center rounded-full bg-[color:var(--primary)] text-white shadow-lg active:scale-90 transition-all">
                <Video className="h-4 w-4" />
              </button>
            </div>
          </div>
          <button className="h-14 w-14 rounded-full bg-[color:var(--accent)] flex items-center justify-center text-[color:var(--secondary)] shadow-xl active:scale-95 transition-all hover:bg-[color:var(--primary)] hover:text-white group">
            <Send className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
        <p className="text-center mt-4 text-[10px] font-bold text-[color:var(--muted)] uppercase tracking-widest">Premium Coaching Session Active</p>
      </footer>
    </div>
  );
}
