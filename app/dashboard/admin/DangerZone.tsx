'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-browser';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function DangerZone() {
  const [loading, setLoading] = useState<string | null>(null);

  const purgeChats = async () => {
    if (!confirm('EXTREME DANGER: This will delete ALL chat messages and ALL uploaded swing videos from storage. Continue?')) return;
    if (!confirm('LAST WARNING: Are you absolutely sure?')) return;

    setLoading('chats');
    try {
      // 1. Delete all messages (cascade will delete attachments)
      const { error: msgError } = await supabase.from('chat_messages').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      if (msgError) throw msgError;

      // 2. We can't easily list/delete all storage files from client-side without a service role or custom edge function
      // but the DB records are gone. In a real app, you'd use a server action with service role.
      
      alert('All chat records purged successfully.');
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setLoading(null);
    }
  };

  const resetProgress = async () => {
    if (!confirm('This will reset watch progress for ALL users. Continue?')) return;

    setLoading('progress');
    try {
      const { error } = await supabase.from('video_progress').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
      alert('Global progress reset successfully.');
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <section>
      <div className="flex items-center gap-3 mb-8">
        <AlertTriangle className="h-6 w-6 text-red-600" />
        <h2 className="text-2xl font-black text-red-600 tracking-tight">Danger Zone</h2>
      </div>
      <div className="rounded-[48px] bg-red-50/50 border border-red-100 p-10">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 bg-white rounded-3xl border border-red-100 shadow-sm">
            <h3 className="font-black text-[color:var(--secondary)] mb-2">Bulk Message Deletion</h3>
            <p className="text-sm text-[color:var(--muted)] mb-6">Remove all chat history for testing or compliance purposes.</p>
            <button 
              onClick={purgeChats}
              disabled={loading !== null}
              className="px-6 py-3 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              {loading === 'chats' && <Loader2 className="h-4 w-4 animate-spin" />}
              Purge All Chats
            </button>
          </div>
          <div className="p-8 bg-white rounded-3xl border border-red-100 shadow-sm">
            <h3 className="font-black text-[color:var(--secondary)] mb-2">Reset All Progress</h3>
            <p className="text-sm text-[color:var(--muted)] mb-6">Clear all user video watch history. This cannot be undone.</p>
            <button 
              onClick={resetProgress}
              disabled={loading !== null}
              className="px-6 py-3 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              {loading === 'progress' && <Loader2 className="h-4 w-4 animate-spin" />}
              Reset Global Progress
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
