import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import { 
  Trophy, 
  Video, 
  MessageSquare, 
  Settings,
  LayoutDashboard,
  Lock,
  Crown
} from "lucide-react";
import Link from "next/link";
import SidebarLink from "./SidebarLink";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", session.user.id)
    .eq("status", "active")
    .maybeSingle();

  const isPremium = !!subscription;

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex text-[color:var(--foreground)]">
      {/* Sidebar - Desktop */}
      <aside className="w-72 hidden lg:flex flex-col border-r border-[color:var(--border)] bg-[color:var(--surface)] p-6 shrink-0 h-screen sticky top-0">
        <div className="mb-10 px-4 pt-4">
          <Link href="/dashboard" className="text-2xl font-black tracking-tighter text-[color:var(--secondary)]">
            IOG.<span className="text-[color:var(--accent)]">doorway</span>
          </Link>
        </div>
        
        <nav className="flex-1 space-y-2">
          <SidebarLink href="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />}>Dashboard</SidebarLink>
          <SidebarLink href="/dashboard/handicap" icon={<Trophy className="h-5 w-5" />}>Handicap Tracker</SidebarLink>
          <SidebarLink href="#" icon={<Video className="h-5 w-5" />} disabled={!isPremium}>Video Library</SidebarLink>
          <SidebarLink href="#" icon={<MessageSquare className="h-5 w-5" />} disabled={!isPremium}>Coaching Chat</SidebarLink>
        </nav>

        <div className="mt-auto pt-6 border-t border-[color:var(--border)] space-y-2">
          <SidebarLink href="/dashboard/upgrade" icon={<Crown className="h-5 w-5 text-[color:var(--accent)]" />}>
            {isPremium ? "Membership" : "Upgrade to Premium"}
          </SidebarLink>
          <SidebarLink href="/dashboard/profile" icon={<Settings className="h-5 w-5" />}>Settings</SidebarLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
