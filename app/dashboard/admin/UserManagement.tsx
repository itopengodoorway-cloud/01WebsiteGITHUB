'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import { Trash2, ShieldCheck, ShieldAlert, Loader2, Users } from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string | null;
  current_handicap: number | null;
  created_at: string;
  subscription?: {
    status: string;
    current_period_end: string | null;
  } | null;
}

export default function UserManagement({ initialUsers }: { initialUsers: UserProfile[] }) {
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const toggleSubscription = async (userId: string, currentStatus: string) => {
    setLoading(userId);
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    // In a real app, we'd probably also want to set current_period_end
    // For manual override, we'll just flip the status
    const { error } = await supabase
      .from('subscriptions')
      .upsert({ 
        user_id: userId, 
        status: newStatus,
        current_period_end: newStatus === 'active' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
      }, { onConflict: 'user_id' });

    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, subscription: { status: newStatus, current_period_end: u.subscription?.current_period_end || null } } : u));
    }
    setLoading(null);
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action is irreversible.')) return;
    
    setLoading(userId);
    // Note: Due to CASCADE, deleting from profiles should clean up everything
    // But we need to handle auth.users deletion too which usually requires admin API
    // For now, we'll delete the profile
    const { error } = await supabase.from('profiles').delete().eq('id', userId);
    
    if (!error) {
      setUsers(users.filter(u => u.id !== userId));
    } else {
      alert('Error deleting user: ' + error.message);
    }
    setLoading(null);
  };

  return (
    <div className="rounded-[48px] bg-white border border-[color:var(--border)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--border)] bg-[color:var(--background)]">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[color:var(--muted)]">User</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[color:var(--muted)]">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[color:var(--muted)]">Handicap</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[color:var(--muted)]">Joined</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[color:var(--muted)] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--border)]">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[color:var(--background)]/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-[color:var(--primary)]/10 flex items-center justify-center font-black text-[color:var(--primary)]">
                      {user.full_name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-[color:var(--secondary)]">{user.full_name || 'Anonymous User'}</p>
                      <p className="text-xs text-[color:var(--muted)]">{user.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    user.subscription?.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.subscription?.status === 'active' ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                    {user.subscription?.status === 'active' ? 'Premium' : 'Free Tier'}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="font-mono font-bold text-[color:var(--secondary)]">
                    {user.current_handicap !== null ? user.current_handicap.toFixed(1) : 'N/A'}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm text-[color:var(--muted)] font-medium">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => toggleSubscription(user.id, user.subscription?.status || 'inactive')}
                      disabled={loading === user.id}
                      className="p-2 rounded-xl hover:bg-white border border-transparent hover:border-[color:var(--border)] transition-all text-[color:var(--muted)] hover:text-[color:var(--primary)]"
                      title={user.subscription?.status === 'active' ? 'Downgrade to Free' : 'Upgrade to Premium'}
                    >
                      {loading === user.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      disabled={loading === user.id}
                      className="p-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100 transition-all text-[color:var(--muted)] hover:text-red-600"
                      title="Delete User"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="p-20 text-center">
          <Users className="h-12 w-12 text-[color:var(--border)] mx-auto mb-4" />
          <p className="text-[color:var(--muted)] font-medium">No users found</p>
        </div>
      )}
    </div>
  );
}
