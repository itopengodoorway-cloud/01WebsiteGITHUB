import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { ShieldAlert, Users, Video, CreditCard, MessageSquare, Library, AlertTriangle } from "lucide-react";
import ContentManagement from "./ContentManagement";
import AdminChatConsole from "./AdminChatConsole";
import UserManagement from "./UserManagement";
import DangerZone from "./DangerZone";

const ADMIN_EMAILS = ["itopengodoorway@gmail.com", "admin@iogdoorway.com", "user@example.com"];

export default async function AdminPage() {
  const supabase = await createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session || !ADMIN_EMAILS.includes(session.user.email ?? "")) {
    redirect("/dashboard");
  }

  // Fetch Real Stats
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: subCount } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active');
  const { count: videoCount } = await supabase.from('videos').select('*', { count: 'exact', head: true });
  const { count: progressCount } = await supabase.from('video_progress').select('*', { count: 'exact', head: true });

  // Fetch Users for Management
  const { data: usersData } = await supabase
    .from('profiles')
    .select(`
      *,
      subscription:subscriptions(status, current_period_end)
    `)
    .order('created_at', { ascending: false });

  // Flatten the subscription data because it comes as an array from the join
  const users = (usersData || []).map(u => ({
    ...u,
    subscription: Array.isArray(u.subscription) ? u.subscription[0] : u.subscription
  })) as any[];

  return (
    <div className="px-4 py-8 md:px-10 md:py-12 max-w-7xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="h-5 w-5 text-red-600" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-red-600">Administrative Console</span>
          </div>
          <h1 className="text-4xl font-black text-[color:var(--secondary)]">Platform Overview</h1>
        </div>
        <div className="h-12 px-6 rounded-2xl bg-red-50 border border-red-100 flex items-center text-red-600 font-bold text-sm">
          Master Admin Active
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
        <AdminStatCard title="Total Players" value={(userCount || 0).toString()} icon={<Users className="h-5 w-5" />} color="bg-blue-50 text-blue-600" />
        <AdminStatCard title="Active Subscriptions" value={(subCount || 0).toString()} icon={<CreditCard className="h-5 w-5" />} color="bg-green-50 text-green-600" />
        <AdminStatCard title="Total Lessons" value={(videoCount || 0).toString()} icon={<Video className="h-5 w-5" />} color="bg-orange-50 text-orange-600" />
        <AdminStatCard title="Videos Watched" value={(progressCount || 0).toString()} icon={<MessageSquare className="h-5 w-5" />} color="bg-purple-50 text-purple-600" />
      </div>

      <div className="space-y-16">
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Users className="h-6 w-6 text-[color:var(--primary)]" />
            <h2 className="text-2xl font-black text-[color:var(--secondary)] tracking-tight">User Management</h2>
          </div>
          <UserManagement initialUsers={users} />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="h-6 w-6 text-[color:var(--primary)]" />
            <h2 className="text-2xl font-black text-[color:var(--secondary)] tracking-tight">Active Coaching Chats</h2>
          </div>
          <AdminChatConsole />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <Library className="h-6 w-6 text-[color:var(--primary)]" />
            <h2 className="text-2xl font-black text-[color:var(--secondary)] tracking-tight">Content Management</h2>
          </div>
          <div className="rounded-[48px] bg-white border border-[color:var(--border)] p-1 md:p-8">
            <ContentManagement />
          </div>
        </section>

        <DangerZone />
      </div>
    </div>
  );
}

function AdminStatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="p-8 rounded-[40px] border border-[color:var(--border)] bg-white shadow-sm">
      <div className={`h-12 w-12 rounded-2xl ${color} flex items-center justify-center mb-6 shadow-sm`}>
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-[color:var(--muted)] mb-1">{title}</p>
      <p className="text-3xl font-black text-[color:var(--secondary)]">{value}</p>
    </div>
  );
}
