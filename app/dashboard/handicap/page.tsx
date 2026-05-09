"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { 
  TrendingDown, 
  History, 
  Plus, 
  Loader2, 
  ArrowLeft, 
  Trophy, 
  ChevronRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { format } from "date-fns";

export default function HandicapPage() {
  const [currentHandicap, setCurrentHandicap] = useState<string>("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchHandicapData();
  }, []);

  async function fetchHandicapData() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    // Get current handicap from profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("current_handicap")
      .eq("id", session.user.id)
      .single();

    if (profile) {
      setCurrentHandicap(profile.current_handicap?.toString() ?? "");
    }

    // Get handicap history
    const { data: historyData } = await supabase
      .from("handicap_history")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: true });

    if (historyData) {
      const formattedHistory = historyData.map(item => ({
        ...item,
        displayDate: format(new Date(item.created_at), "MMM d"),
        timestamp: new Date(item.created_at).getTime()
      }));
      setHistory(formattedHistory);
    }
    setLoading(false);
  }

  const handleUpdateHandicap = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    setMessage("");

    const handicapNum = parseFloat(currentHandicap);
    if (isNaN(handicapNum)) {
      setError("Please enter a valid number");
      setUpdating(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    // 1. Update profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ current_handicap: handicapNum })
      .eq("id", session.user.id);

    if (profileError) {
      setError(profileError.message);
      setUpdating(false);
      return;
    }

    // 2. Add to history
    const { error: historyError } = await supabase
      .from("handicap_history")
      .insert({
        user_id: session.user.id,
        handicap: handicapNum,
        created_at: new Date().toISOString()
      });

    if (historyError) {
      setError(historyError.message);
    } else {
      setMessage("Handicap updated successfully!");
      fetchHandicapData(); // Refresh history
    }
    setUpdating(false);
  };

  const calculateTrend = () => {
    if (history.length < 2) return null;
    const latest = history[history.length - 1].handicap;
    const previous = history[history.length - 2].handicap;
    const diff = latest - previous;
    return {
      value: Math.abs(diff).toFixed(1),
      improving: diff < 0
    };
  };

  const trend = calculateTrend();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--background)]">
        <Loader2 className="h-8 w-8 animate-spin text-[color:var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          {/* Update Section */}
          <div className="space-y-8">
            <div className="rounded-[40px] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 shadow-[color:var(--shadow)]">
              <div className="mb-6 flex items-center gap-3 text-[color:var(--secondary)]">
                <Trophy className="h-6 w-6 text-[color:var(--accent)]" />
                <h2 className="text-xl font-bold">Current Status</h2>
              </div>
              
              <div className="mb-8 rounded-3xl bg-white p-6 text-center shadow-sm border border-[color:var(--border)]/30">
                <p className="text-sm font-semibold uppercase tracking-wider text-[color:var(--muted)]">Handicap Index</p>
                <p className="mt-2 text-5xl font-black text-[color:var(--primary)]">
                  {currentHandicap || "N/A"}
                </p>
                {trend && (
                  <div className={`mt-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${trend.improving ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {trend.improving ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                    {trend.improving ? "Improving" : "Trending up"} by {trend.value}
                  </div>
                )}
              </div>

              <form onSubmit={handleUpdateHandicap} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[color:var(--secondary)] px-1">Update Handicap</label>
                  <div className="flex items-center rounded-2xl border border-[color:var(--border)] bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[color:var(--primary)]/20 transition-all">
                    <Plus className="mr-3 h-4 w-4 text-[color:var(--primary)]" />
                    <input 
                      type="number" 
                      step="0.1"
                      value={currentHandicap} 
                      onChange={(e) => setCurrentHandicap(e.target.value)} 
                      required
                      className="w-full bg-transparent outline-none font-bold text-lg" 
                      placeholder="e.g. 14.5"
                    />
                  </div>
                </div>

                {error && <p className="rounded-2xl bg-red-50 p-3 text-xs text-red-800 border border-red-100">{error}</p>}
                {message && <p className="rounded-2xl bg-green-50 p-3 text-xs text-green-800 border border-green-100">{message}</p>}

                <button
                  type="submit"
                  disabled={updating}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--primary)] px-5 py-3 text-base font-bold text-white transition hover:bg-[color:var(--primary-light)] active:scale-[0.98] disabled:opacity-60"
                >
                  {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Record Update
                </button>
              </form>
            </div>

            {history.length > 0 && trend?.improving && (
              <div className="rounded-[32px] bg-[color:var(--primary)] p-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingDown className="h-5 w-5 text-[color:var(--accent)]" />
                  <h3 className="font-bold">Great Progress!</h3>
                </div>
                <p className="text-sm leading-relaxed opacity-90">
                  You're trending in the right direction. Keep focusing on your drills to reach single digits.
                </p>
              </div>
            )}
          </div>

          {/* Chart & History Section */}
          <div className="space-y-8">
            <div className="rounded-[40px] border border-[color:var(--border)] bg-white p-8 shadow-[color:var(--shadow)]">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[color:var(--secondary)]">
                  <TrendingDown className="h-6 w-6 text-[color:var(--primary)]" />
                  <h2 className="text-xl font-bold">Progress Chart</h2>
                </div>
                <div className="text-xs font-bold text-[color:var(--muted)] bg-[color:var(--background)] px-3 py-1 rounded-full">
                  All Time
                </div>
              </div>

              {history.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorHandicap" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="displayDate" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#5f6f61', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#5f6f61', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                          padding: '12px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="handicap" 
                        stroke="var(--primary)" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorHandicap)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center rounded-[32px] bg-[color:var(--background)] border-2 border-dashed border-[color:var(--border)] text-[color:var(--muted)]">
                  <AlertCircle className="mb-2 h-8 w-8 opacity-20" />
                  <p>Not enough data to generate chart</p>
                </div>
              )}
            </div>

            <div className="rounded-[40px] border border-[color:var(--border)] bg-white p-8 shadow-[color:var(--shadow)]">
              <div className="mb-6 flex items-center gap-3 text-[color:var(--secondary)]">
                <History className="h-6 w-6 text-[color:var(--primary)]" />
                <h2 className="text-xl font-bold">Update History</h2>
              </div>

              <div className="overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[color:var(--border)]/30 text-xs font-black uppercase tracking-widest text-[color:var(--muted)]">
                      <th className="pb-4 pt-0">Date</th>
                      <th className="pb-4 pt-0 text-right">Handicap</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--border)]/10">
                    {history.slice().reverse().map((item, i) => (
                      <tr key={item.id} className="group">
                        <td className="py-4 text-sm font-medium text-[color:var(--muted)]">
                          {format(new Date(item.created_at), "MMMM d, yyyy")}
                        </td>
                        <td className="py-4 text-right">
                          <span className="inline-flex h-8 w-12 items-center justify-center rounded-lg bg-[color:var(--primary)]/5 font-bold text-[color:var(--primary)]">
                            {item.handicap}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {history.length === 0 && (
                      <tr>
                        <td colSpan={2} className="py-10 text-center text-sm text-[color:var(--muted)] italic">
                          No history recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
