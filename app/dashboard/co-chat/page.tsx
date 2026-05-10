"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase-browser";
import { 
  MessageSquare, 
  Video, 
  Send, 
  Mic, 
  Paperclip, 
  MoreVertical,
  Loader2,
  Camera,
  Play,
  X,
  Clock,
  ChevronLeft
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CoChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Video Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setRecordedUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    async function initChat() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUser(session.user);

      // Initial fetch
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: true });

      if (data) setMessages(data);
      setLoading(false);

      // Subscribe to real-time changes
      const channel = supabase
        .channel(`chat:${session.user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `user_id=eq.${session.user.id}`
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    initChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !recordedBlob) return;

    setSending(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    let messageType = "text";
    let messageContent = inputText;
    let attachmentPath = null;

    // Handle video upload if recorded
    if (recordedBlob) {
      const fileName = `${session.user.id}/${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-videos')
        .upload(fileName, recordedBlob);

      if (uploadError) {
        toast.error("Upload failed: " + uploadError.message);
        setSending(false);
        return;
      }
      messageType = "video";
      attachmentPath = uploadData.path;
      messageContent = "Uploaded a swing video";
    }

    const { data: message, error } = await supabase
      .from("chat_messages")
      .insert({
        user_id: session.user.id,
        content: messageContent,
        message_type: messageType,
        is_from_coach: false
      })
      .select()
      .single();

    if (error) {
      toast.error(error.message);
    } else if (attachmentPath) {
      toast.success("Swing video sent for analysis!");
      await supabase.from("message_attachments").insert({
        message_id: message.id,
        file_path: attachmentPath,
        file_name: "swing_video.webm",
        file_size: recordedBlob?.size
      });
    }

    setInputText("");
    setRecordedBlob(null);
    setRecordedUrl(null);
    setSending(false);
  };

  // Video Recording Logic
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
      setIsRecording(true);
      setRecordingTime(0);

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedBlob(blob);
        setRecordedUrl(URL.createObjectURL(blob));
        stopStream();
      };

      recorder.start();

      // Timer for 9 seconds limit
      const interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 9) {
            stopRecording();
            clearInterval(interval);
            return 9;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      console.error(err);
      alert("Could not access camera");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  };

  const cancelRecording = () => {
    stopRecording();
    setRecordedBlob(null);
    setRecordedUrl(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[color:var(--background)]">
        <Loader2 className="h-10 w-10 animate-spin text-[color:var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Chat Header */}
      <header className="px-6 py-4 border-b border-[color:var(--border)] flex items-center justify-between shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-[color:var(--primary)] flex items-center justify-center text-[color:var(--accent)] shadow-lg">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-[color:var(--secondary)] leading-none mb-1">CO-CHAT Console</h1>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[9px] font-bold text-[color:var(--muted)] uppercase tracking-widest">Head Coach Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="h-10 w-10 flex md:hidden items-center justify-center rounded-xl border border-[color:var(--border)] text-[color:var(--muted)]">
             <ChevronLeft className="h-5 w-5" />
           </button>
           <button className="hidden sm:block h-10 px-4 rounded-xl border border-[color:var(--border)] text-xs font-bold text-[color:var(--secondary)] hover:bg-[color:var(--background)] transition-all">Session History</button>
        </div>
      </header>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-[color:var(--background)] custom-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto">
             <div className="h-16 w-16 rounded-3xl bg-white border border-[color:var(--border)] flex items-center justify-center text-[color:var(--primary)] mb-6 shadow-sm">
                <Video className="h-8 w-8" />
             </div>
             <h3 className="text-xl font-bold text-[color:var(--secondary)] mb-2">Record Your Swing</h3>
             <p className="text-sm text-[color:var(--muted)] font-medium leading-relaxed">
               Welcome to CO-CHAT! To begin your session, please upload or record a video of your current swing.
             </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex gap-3 md:gap-4 ${msg.is_from_coach ? '' : 'flex-row-reverse'}`}
          >
            <div className={`h-8 w-8 md:h-10 md:w-10 rounded-xl flex items-center justify-center shrink-0 text-[10px] font-black shadow-md uppercase ${msg.is_from_coach ? 'bg-[color:var(--secondary)] text-white' : 'bg-[color:var(--accent)] text-[color:var(--secondary)]'}`}>
              {msg.is_from_coach ? 'HC' : 'You'}
            </div>
            <div className={`space-y-2 max-w-[85%] md:max-w-xl ${msg.is_from_coach ? '' : 'text-right'}`}>
              <div className={`rounded-[24px] p-4 md:p-6 shadow-sm text-sm leading-relaxed font-medium ${msg.is_from_coach ? 'rounded-tl-none bg-white border border-[color:var(--border)]/30 text-[color:var(--secondary)]' : 'rounded-tr-none bg-[color:var(--primary)] text-white text-left'}`}>
                {msg.message_type === 'video' ? (
                   <div className="space-y-3">
                      <div className="aspect-video bg-black/20 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden relative group cursor-pointer">
                         <Play className="h-8 w-8 text-white fill-current" />
                         <p className="absolute bottom-3 left-3 text-[10px] font-black uppercase tracking-widest bg-black/40 px-2 py-1 rounded">Swing Analysis Pending</p>
                      </div>
                      <p className={msg.is_from_coach ? "text-[color:var(--muted)]" : "text-white/70"}>{msg.content}</p>
                   </div>
                ) : (
                  msg.content
                )}
              </div>
              <span className="text-[9px] font-bold text-[color:var(--muted)] uppercase block px-1">
                {format(new Date(msg.created_at), "h:mm aa")}
              </span>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Recording Overlay */}
      {isRecording && (
        <div className="absolute inset-0 z-50 bg-[color:var(--secondary)]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-white">
           <div className="w-full max-w-xl space-y-8 text-center">
              <div className="relative aspect-[9/16] md:aspect-video bg-black rounded-[40px] overflow-hidden shadow-2xl border border-white/10 mx-auto">
                 <video ref={videoPreviewRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                 <div className="absolute top-8 left-8 flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest">REC 00:0{recordingTime}</span>
                 </div>
                 <div className="absolute inset-0 border-[16px] border-white/5 pointer-events-none rounded-[40px]" />
              </div>
              
              <div className="space-y-4">
                 <h2 className="text-2xl font-black">Record Your Swing</h2>
                 <p className="text-white/60 text-sm font-medium">Keep it between 3 and 9 seconds. Center yourself in the frame.</p>
              </div>

              <div className="flex items-center justify-center gap-6">
                 <button onClick={stopStream} className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                    <X className="h-6 w-6" />
                 </button>
                 <button onClick={stopRecording} className="h-24 w-24 rounded-full bg-red-500 flex items-center justify-center shadow-2xl shadow-red-500/40 active:scale-90 transition-all border-[8px] border-white/20">
                    <div className="h-8 w-8 bg-white rounded-sm" />
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Preview Overlay */}
      {previewUrl && !isRecording && (
         <div className="absolute inset-0 z-50 bg-[color:var(--secondary)]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-white">
            <div className="w-full max-w-xl space-y-8 text-center">
               <div className="relative aspect-[9/16] md:aspect-video bg-black rounded-[40px] overflow-hidden shadow-2xl border border-white/10 mx-auto">
                  <video src={previewUrl} autoPlay loop controls className="w-full h-full object-cover" />
               </div>
               
               <div className="space-y-4">
                  <h2 className="text-2xl font-black">Ready to send?</h2>
                  <p className="text-white/60 text-sm font-medium">Your coach will receive this video for analysis.</p>
               </div>

               <div className="flex items-center justify-center gap-4">
                  <button onClick={() => { setRecordedBlob(null); setRecordedUrl(null); }} className="px-8 py-4 rounded-2xl border border-white/20 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                     Discard
                  </button>
                  <button 
                    onClick={handleSendMessage} 
                    disabled={sending}
                    className="flex-1 bg-[color:var(--accent)] text-[color:var(--secondary)] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                     {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                     Send for Analysis
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Chat Input */}
      <footer className="p-4 md:p-6 bg-white border-t border-[color:var(--border)] shrink-0">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-end gap-3 md:gap-4">
          <div className="flex-1 relative">
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask your coach anything..." 
              rows={1}
              className="w-full rounded-[24px] border border-[color:var(--border)] bg-[color:var(--background)] px-4 md:px-6 py-3 md:py-4 pr-24 md:pr-32 outline-none focus:border-[color:var(--primary)] focus:ring-4 focus:ring-[color:var(--primary)]/5 transition-all text-sm font-medium resize-none overflow-hidden"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="absolute right-2 md:right-4 bottom-2 md:bottom-3 flex items-center gap-1 md:gap-2">
              <button type="button" className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[color:var(--primary)]/5 text-[color:var(--muted)] hover:text-[color:var(--primary)] transition-all">
                <Paperclip className="h-4 w-4" />
              </button>
              <button 
                type="button" 
                onClick={startCamera}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-[color:var(--primary)] text-white shadow-lg active:scale-90 transition-all"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
          </div>
          <button 
            type="submit"
            disabled={(!inputText.trim() && !recordedBlob) || sending}
            className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-[color:var(--accent)] flex items-center justify-center text-[color:var(--secondary)] shadow-xl active:scale-95 transition-all hover:bg-[color:var(--primary)] hover:text-white group disabled:opacity-50 disabled:grayscale"
          >
            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
          </button>
        </form>
        <p className="text-center mt-3 md:mt-4 text-[8px] md:text-[9px] font-bold text-[color:var(--muted)] uppercase tracking-[0.2em]">Premium Coaching Session Active</p>
      </footer>
    </div>
  );
}
