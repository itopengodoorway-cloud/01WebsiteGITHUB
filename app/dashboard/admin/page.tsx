import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { ShieldAlert, Users, Video, CreditCard, MessageSquare, Plus, Library } from "lucide-react";
import ContentManagement from "./ContentManagement";

const ADMIN_EMAILS = ["itopengodoorway@gmail.com", "admin@iogdoorway.com"];

export default async function AdminPage() {
  const supabase = await createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session || !ADMIN_EMAILS.includes(session.user.email ?? "")) {
    redirect("/dashboard");
  }

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
        <AdminStatCard title="Total Players" value="1,284" icon={<Users className="h-5 w-5" />} color="bg-blue-50 text-blue-600" />
        <AdminStatCard title="Active Subscriptions" value="412" icon={<CreditCard className="h-5 w-5" />} color="bg-green-50 text-green-600" />
        <AdminStatCard title="Total Videos" value="84" icon={<Video className="h-5 w-5" />} color="bg-orange-50 text-orange-600" />
        <AdminStatCard title="Support Tickets" value="5" icon={<MessageSquare className="h-5 w-5" />} color="bg-purple-50 text-purple-600" />
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Library className="h-6 w-6 text-[color:var(--primary)]" />
            <h2 className="text-2xl font-black text-[color:var(--secondary)] tracking-tight">Content Management</h2>
          </div>
          <div className="rounded-[48px] bg-white border border-[color:var(--border)] p-1 md:p-8">
            <ContentManagement />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="h-6 w-6 text-[color:var(--primary)]" />
            <h2 className="text-2xl font-black text-[color:var(--secondary)] tracking-tight">Recent Activity</h2>
          </div>
          <div className="rounded-[48px] bg-white border border-[color:var(--border)] p-10">
            <div className="space-y-4">
              {[
                { user: "Marcus T.", action: "Updated Handicap to 12.4", time: "2 mins ago" },
                { user: "Sarah L.", action: "Purchased Premium Coach", time: "15 mins ago" },
                { user: "David R.", action: "Uploaded Swing Video", time: "1 hour ago" },
                { user: "John D.", action: "Completed 'T-Drill' Tutorial", time: "3 hours ago" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-3xl bg-[color:var(--background)]">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-white border border-[color:var(--border)]/30 flex items-center justify-center font-bold text-xs">
                        {item.user[0]}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[color:var(--secondary)]">{item.user}</p>
                        <p className="text-xs text-[color:var(--muted)] font-medium">{item.action}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase text-[color:var(--muted)]">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
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
