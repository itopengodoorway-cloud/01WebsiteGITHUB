"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase-browser";
import { 
  MessageSquare, 
  Video, 
  Send, 
  Loader2, 
  ChevronRight,
  User,
  Search,
  CheckCircle2,
  Play
} from "lucide-react";
import { format } from "date-fns";
import VideoAnnotationTool from "./VideoAnnotationTool";

export default function AdminChatConsole() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Annotation State
  const [annotationOpen, setAnnotationOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const handleOpenAnnotation = async (msgId: string) => {
    const { data: attachment } = await supabase
      .from("message_attachments")
      .select("file_path")
      .eq("message_id", msgId)
      .single();
    
    if (attachment) {
      const { data: { publicUrl } } = supabase.storage
        .from('chat-videos')
        .getPublicUrl(attachment.file_path);
      
      setActiveVideoUrl(publicUrl);
      setAnnotationOpen(true);
    }
  };

  const handleSaveAnnotation = async (dataUrl: string) => {
    // In a real app, you'd convert dataUrl to a file and upload it
    // For now, we'll simulate saving and send a text confirmation
    setAnnotationOpen(false);
    setInputText("I've analyzed your swing. See the notes in my drawing.");
  };

  useEffect(() => {
    fetchConversations();
    
    // Subscribe to all new messages
    const channel = supabase
      .channel('admin-chats')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          if (payload.new.user_id === selectedUserId) {
            setMessages((prev) => [...prev, payload.new]);
          }
          fetchConversations(); // Refresh list to show latest message/unread
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUserId]);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchConversations() {
    // Get unique user IDs from messages
    const { data: recentMessages } = await supabase
      .from("chat_messages")
      .select("user_id, content, created_at")
      .order("created_at", { ascending: false });

    if (!recentMessages) return;

    // Deduplicate and get profiles
    const uniqueUserIds = Array.from(new Set(recentMessages.map(m => m.user_id)));
    
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", uniqueUserIds);

    const convos = uniqueUserIds.map(uid => {
      const profile = profiles?.find(p => p.id === uid);
      const latestMsg = recentMessages.find(m => m.user_id === uid);
      return {
        user_id: uid,
        name: profile?.full_name || "Unknown Player",
        latest_message: latestMsg?.content,
        time: latestMsg?.created_at
      };
    });

    setConversations(convos);
    setLoading(false);
  }

  async function fetchMessages(uid: string) {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: true });

    if (data) setMessages(data);
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedUserId) return;

    setSending(true);
    const { error } = await supabase
      .from("chat_messages")
      .insert({
        user_id: selectedUserId,
        content: inputText,
        message_type: "text",
        is_from_coach: true
      });

    if (error) alert(error.message);
    setInputText("");
    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[color:var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="flex h-[700px] bg-white rounded-[48px] border border-[color:var(--border)] overflow-hidden shadow-2xl">
      {/* Sidebar - Conversation List */}
      <aside className="w-80 border-r border-[color:var(--border)] flex flex-col bg-[color:var(--surface)]/30">
        <div className="p-6 border-b border-[color:var(--border)]/50 bg-white">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[color:var(--muted)]" />
              <input 
                placeholder="Search players..." 
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[color:var(--background)] text-xs font-bold outline-none focus:ring-2 focus:ring-[color:var(--primary)]/10"
              />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
           {conversations.map((convo) => (
              <button 
                key={convo.user_id}
                onClick={() => setSelectedUserId(convo.user_id)}
                className={`w-full p-6 text-left flex items-start gap-4 transition-all border-b border-[color:var(--border)]/10 ${selectedUserId === convo.user_id ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
              >
                 <div className="h-12 w-12 rounded-2xl bg-[color:var(--primary)]/5 flex items-center justify-center text-[color:var(--primary)] shrink-0 font-black text-xs">
                    {convo.name[0]}
                 </div>
                 <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start mb-1">
                       <h4 className="font-bold text-[color:var(--secondary)] text-sm truncate">{convo.name}</h4>
                       <span className="text-[9px] font-black text-[color:var(--muted)] uppercase whitespace-nowrap">{format(new Date(convo.time), "h:mm aa")}</span>
                    </div>
                    <p className="text-xs text-[color:var(--muted)] font-medium truncate">{convo.latest_message}</p>
                 </div>
              </button>
           ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      {selectedUserId ? (
        <div className="flex-1 flex flex-col bg-white">
           <header className="p-6 border-b border-[color:var(--border)]/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-[color:var(--primary)]/5 flex items-center justify-center text-[color:var(--primary)] font-black text-xs">
                    {conversations.find(c => c.user_id === selectedUserId)?.name[0]}
                 </div>
                 <div>
                    <h3 className="font-black text-[color:var(--secondary)]">{conversations.find(c => c.user_id === selectedUserId)?.name}</h3>
                    <p className="text-[9px] font-black text-green-600 uppercase tracking-widest">Player Online</p>
                 </div>
              </div>
              <button className="h-10 px-6 rounded-xl bg-[color:var(--background)] text-xs font-black uppercase tracking-widest text-[color:var(--secondary)] hover:bg-[color:var(--border)]/20 transition-all">Review Swing Files</button>
           </header>

           <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[color:var(--background)]/30 custom-scrollbar">
              {messages.map((msg) => (
                 <div key={msg.id} className={`flex gap-4 ${msg.is_from_coach ? 'flex-row-reverse' : ''}`}>
                    <div className={`space-y-2 max-w-lg ${msg.is_from_coach ? 'text-right' : ''}`}>
                       <div className={`rounded-[24px] p-5 shadow-sm text-sm font-medium ${msg.is_from_coach ? 'rounded-tr-none bg-[color:var(--secondary)] text-white text-left' : 'rounded-tl-none bg-white border border-[color:var(--border)]/30 text-[color:var(--secondary)]'}`}>
                          {msg.message_type === 'video' ? (
                             <div className="space-y-4">
                                <div 
                                  onClick={() => handleOpenAnnotation(msg.id)}
                                  className="aspect-video bg-black rounded-xl overflow-hidden relative group cursor-pointer border border-white/10 shadow-lg"
                                >
                                   <Play className="h-10 w-10 text-white fill-current absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80" />
                                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                      <p className="text-[10px] font-black uppercase tracking-widest text-white">Click to open Annotation Tool</p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-2">
                                   <CheckCircle2 className="h-4 w-4 text-[color:var(--accent)]" />
                                   <p className="text-xs font-bold text-white/70 uppercase tracking-widest">New Swing Recording</p>
                                </div>
                             </div>
                          ) : (
                             msg.content
                          )}
                       </div>
                       <span className="text-[9px] font-black text-[color:var(--muted)] uppercase px-2">{format(new Date(msg.created_at), "h:mm aa")}</span>
                    </div>
                 </div>
              ))}
              <div ref={messagesEndRef} />
           </div>

           {annotationOpen && activeVideoUrl && (
              <VideoAnnotationTool 
                videoUrl={activeVideoUrl} 
                onClose={() => setAnnotationOpen(false)}
                onSave={handleSaveAnnotation}
              />
           )}

           <footer className="p-6 border-t border-[color:var(--border)]/50">
              <form onSubmit={handleSendMessage} className="flex gap-4">
                 <input 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your coaching advice..."
                    className="flex-1 rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] px-6 py-4 outline-none focus:ring-4 focus:ring-[color:var(--primary)]/5 transition-all text-sm font-medium"
                 />
                 <button 
                    disabled={sending || !inputText.trim()}
                    className="h-14 w-14 rounded-full bg-[color:var(--primary)] flex items-center justify-center text-[color:var(--accent)] shadow-xl active:scale-95 transition-all disabled:opacity-50"
                 >
                    {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                 </button>
              </form>
           </footer>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
           <div className="h-20 w-20 rounded-[32px] bg-[color:var(--background)] flex items-center justify-center text-[color:var(--muted)] mb-8 border border-[color:var(--border)]/30 shadow-inner">
              <MessageSquare className="h-10 w-10 opacity-20" />
           </div>
           <h2 className="text-2xl font-black text-[color:var(--secondary)] mb-4">No Conversation Selected</h2>
           <p className="text-sm text-[color:var(--muted)] font-medium max-w-xs leading-relaxed">
              Select a player from the left panel to begin a professional coaching session or review swing mechanics.
           </p>
        </div>
      )}
    </div>
  );
}
