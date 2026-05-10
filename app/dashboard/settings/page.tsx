'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  CreditCard, 
  Trophy, 
  Shield, 
  ChevronRight, 
  Loader2, 
  Save, 
  Trash2, 
  History,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Download
} from 'lucide-react';
import { format } from 'date-fns';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'account' | 'membership' | 'handicap'>('account');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [handicapHistory, setHandicapHistory] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/auth/login');
      return;
    }

    setUser(session.user);

    // Fetch Profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    setProfile(profileData);

    // Fetch Subscription
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle();
    
    setSubscription(subData);

    // Fetch Handicap History
    const { data: historyData } = await supabase
      .from('handicap_history')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    
    setHandicapHistory(historyData || []);
    
    setLoading(false);
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: profile.full_name })
      .eq('id', user.id);

    if (error) setError(error.message);
    else setMessage("Profile updated successfully!");
    setSaving(false);
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/checkout/portal', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert("Error opening billing portal. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This will permanently remove all your data, including swing recordings and progress. This cannot be undone.")) return;
    
    setSaving(true);
    // Delete profile (cascades to everything else)
    const { error } = await supabase.from('profiles').delete().eq('id', user.id);
    
    if (error) {
      alert("Error deleting account: " + error.message);
      setSaving(false);
    } else {
      await supabase.auth.signOut();
      router.push('/');
    }
  };

  const exportData = () => {
    const data = {
      profile,
      subscription,
      handicapHistory,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iog-data-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[color:var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="px-4 py-12 md:px-10 md:py-16 max-w-5xl mx-auto">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-[color:var(--accent)]" />
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[color:var(--muted)]">Member Preferences</span>
        </div>
        <h1 className="text-4xl font-black text-[color:var(--secondary)]">Account Settings</h1>
      </header>

      <div className="grid lg:grid-cols-[280px_1fr] gap-12">
        {/* Navigation Sidebar */}
        <aside className="space-y-2">
          <TabButton active={activeTab === 'account'} onClick={() => setActiveTab('account')} icon={<User className="h-5 w-5" />} label="Account Details" />
          <TabButton active={activeTab === 'membership'} onClick={() => setActiveTab('membership')} icon={<CreditCard className="h-5 w-5" />} label="Membership & Billing" />
          <TabButton active={activeTab === 'handicap'} onClick={() => setActiveTab('handicap')} icon={<Trophy className="h-5 w-5" />} label="Handicap History" />
        </aside>

        {/* Content Area */}
        <div className="bg-white rounded-[48px] border border-[color:var(--border)] p-10 shadow-sm min-h-[600px]">
          {activeTab === 'account' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section>
                <h2 className="text-xl font-black text-[color:var(--secondary)] mb-6">Profile Information</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-[color:var(--muted)] ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[color:var(--primary)]" />
                        <input 
                          value={profile.full_name || ""} 
                          onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] outline-none focus:ring-2 focus:ring-[color:var(--primary)]/10 font-bold text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-[color:var(--muted)] ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[color:var(--muted)]" />
                        <input 
                          value={user.email} 
                          disabled 
                          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] opacity-60 cursor-not-allowed font-bold text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {message && <div className="p-4 rounded-2xl bg-green-50 text-green-700 text-xs font-bold border border-green-100 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> {message}
                  </div>}
                  {error && <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-bold border border-red-100 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> {error}
                  </div>}

                  <button 
                    type="submit" 
                    disabled={saving}
                    className="flex items-center gap-2 bg-[color:var(--primary)] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                  </button>
                </form>
              </section>

              <div className="h-px bg-[color:var(--border)]/50"></div>

              <section>
                <h2 className="text-xl font-black text-[color:var(--secondary)] mb-2">Data & Privacy</h2>
                <p className="text-sm text-[color:var(--muted)] font-medium mb-6">Manage your information and account visibility.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <button 
                    onClick={exportData}
                    className="flex items-center justify-between p-6 rounded-3xl border border-[color:var(--border)] bg-[color:var(--background)]/50 hover:bg-white hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Download className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-[color:var(--secondary)] text-sm">Export Data</p>
                        <p className="text-[10px] text-[color:var(--muted)] font-black uppercase">Download your history</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-[color:var(--muted)] group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button 
                    onClick={handleDeleteAccount}
                    className="flex items-center justify-between p-6 rounded-3xl border border-red-100 bg-red-50/10 hover:bg-red-50 transition-all group"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className="h-10 w-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                        <Trash2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-red-600 text-sm">Delete Account</p>
                        <p className="text-[10px] text-red-400 font-black uppercase">Permanent action</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-red-300 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'membership' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-[color:var(--secondary)]">Current Plan</h2>
                  <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${subscription?.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                    {subscription?.status === 'active' ? 'Premium Coach' : 'Free Tier'}
                  </div>
                </div>

                <div className="p-8 rounded-[40px] bg-[color:var(--surface)] border border-[color:var(--border)] relative overflow-hidden">
                  {subscription?.status === 'active' && (
                    <div className="absolute top-0 right-0 p-4">
                       <CheckCircle2 className="h-12 w-12 text-[color:var(--primary)]/10" />
                    </div>
                  )}
                  <div className="flex items-start gap-6 mb-8">
                    <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                      <CreditCard className="h-8 w-8 text-[color:var(--primary)]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-[color:var(--secondary)]">
                        {subscription?.status === 'active' ? 'Premium Membership' : 'Free Limited Access'}
                      </h3>
                      <p className="text-sm text-[color:var(--muted)] font-medium mt-1">
                        {subscription?.status === 'active' 
                          ? `Next billing date: ${format(new Date(subscription.current_period_end), 'MMMM d, yyyy')}`
                          : 'Upgrade to unlock CO-CHAT and video analysis.'}
                      </p>
                    </div>
                  </div>

                  {subscription?.status === 'active' ? (
                    <button 
                      onClick={handleManageBilling}
                      className="flex items-center gap-2 bg-white border border-[color:var(--border)] text-[color:var(--secondary)] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[color:var(--background)] transition-all"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Manage Subscription
                    </button>
                  ) : (
                    <button 
                      onClick={() => router.push('/dashboard/upgrade')}
                      className="flex items-center gap-2 bg-[color:var(--primary)] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[color:var(--primary)]/20"
                    >
                      <Trophy className="h-4 w-4" />
                      Upgrade Now
                    </button>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-black uppercase tracking-widest text-[color:var(--muted)] mb-4 ml-1">Plan Features</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FeatureItem active={true} label="Standard Video Libraries" />
                  <FeatureItem active={subscription?.status === 'active'} label="Premium Advanced Content" />
                  <FeatureItem active={subscription?.status === 'active'} label="CO-CHAT Interaction" />
                  <FeatureItem active={subscription?.status === 'active'} label="Mechanical Swing Analysis" />
                </div>
              </section>
            </div>
          )}

          {activeTab === 'handicap' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-black text-[color:var(--secondary)]">Handicap Performance</h2>
                  <button 
                    onClick={() => router.push('/dashboard/handicap')}
                    className="text-xs font-black uppercase tracking-widest text-[color:var(--primary)] hover:underline"
                  >
                    Update Current Index
                  </button>
               </div>

               <div className="overflow-hidden rounded-3xl border border-[color:var(--border)]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[color:var(--background)]/50 border-b border-[color:var(--border)]">
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[color:var(--muted)]">Date</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[color:var(--muted)]">Index</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[color:var(--muted)] text-right">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[color:var(--border)]/30">
                      {handicapHistory.map((item, idx) => {
                        const prev = handicapHistory[idx + 1];
                        const diff = prev ? item.handicap - prev.handicap : 0;
                        return (
                          <tr key={item.id} className="hover:bg-[color:var(--background)]/30 transition-colors">
                            <td className="px-6 py-5 text-sm font-bold text-[color:var(--secondary)]">
                              {format(new Date(item.created_at), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-5">
                              <span className="font-mono font-black text-[color:var(--primary)]">{item.handicap.toFixed(1)}</span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              {idx < handicapHistory.length - 1 && (
                                <span className={`text-xs font-black ${diff <= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                  {diff <= 0 ? '↓' : '↑'} {Math.abs(diff).toFixed(1)}
                                </span>
                              )}
                              {idx === handicapHistory.length - 1 && (
                                <span className="text-[10px] font-black uppercase text-[color:var(--muted)]">Base</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {handicapHistory.length === 0 && (
                    <div className="p-12 text-center">
                       <History className="h-10 w-10 text-[color:var(--border)] mx-auto mb-4" />
                       <p className="text-sm font-medium text-[color:var(--muted)]">No handicap history recorded yet.</p>
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${active ? 'bg-[color:var(--secondary)] text-white shadow-xl shadow-[color:var(--secondary)]/10' : 'text-[color:var(--muted)] hover:bg-white hover:text-[color:var(--secondary)]'}`}
    >
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${active ? 'bg-white/10' : 'bg-[color:var(--background)]'}`}>
        {icon}
      </div>
      {label}
    </button>
  );
}

function FeatureItem({ active, label }: { active: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${active ? 'border-green-100 bg-green-50/50' : 'border-[color:var(--border)] bg-[color:var(--background)]/30 opacity-50'}`}>
      <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-green-500 text-white' : 'bg-gray-300 text-white'}`}>
        <CheckCircle2 className="h-3 w-3" />
      </div>
      <span className="text-xs font-bold text-[color:var(--secondary)]">{label}</span>
    </div>
  );
}
