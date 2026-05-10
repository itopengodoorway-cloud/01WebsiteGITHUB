import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import { 
  Trophy, 
  Video, 
  MessageSquare, 
  Settings,
  LayoutDashboard,
  Lock,
  Crown,
  UserCircle,
  HelpCircle,
  ShieldAlert,
  LogOut
} from "lucide-react";
import Link from "next/link";
import SidebarLink from "./SidebarLink";
import MobileHeader from "./MobileHeader";

// List of admin emails for the restricted "Admin Dashboard" link
const ADMIN_EMAILS = ["itopengodoorway@gmail.com", "admin@iogdoorway.com", "user@example.com"];

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
  const isAdmin = ADMIN_EMAILS.includes(session.user.email ?? "");

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col lg:flex-row text-[color:var(--foreground)]">
      <MobileHeader isPremium={isPremium} isAdmin={isAdmin} />
      
      {/* Sidebar - Desktop */}
      <aside className="w-72 hidden lg:flex flex-col border-r border-[color:var(--border)] bg-[color:var(--surface)] p-6 shrink-0 h-screen sticky top-0">
        <div className="mb-10 px-4 pt-4">
          <Link href="/dashboard" className="text-2xl font-black tracking-tighter text-[color:var(--secondary)]">
            IOG.<span className="text-[color:var(--accent)]">doorway</span>
          </Link>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--muted)] mb-2">Main Menu</p>
          <SidebarLink href="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />}>Dashboard</SidebarLink>
          <SidebarLink href="/dashboard/libraries" icon={<Video className="h-5 w-5" />}>Video Libraries</SidebarLink>
          <SidebarLink href="/dashboard/co-chat" icon={<MessageSquare className="h-5 w-5" />} disabled={!isPremium}>CO-CHAT</SidebarLink>
          <SidebarLink href="/dashboard/handicap" icon={<Trophy className="h-5 w-5" />}>Handicap Tracker</SidebarLink>
          
          <div className="pt-6">
            <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--muted)] mb-2">Account</p>
            <SidebarLink href="/dashboard/profile" icon={<UserCircle className="h-5 w-5" />}>My Profile</SidebarLink>
            <SidebarLink href="/dashboard/upgrade" icon={<Crown className="h-5 w-5 text-[color:var(--accent)]" />}>
              {isPremium ? "Membership" : "Upgrade to Premium"}
            </SidebarLink>
            <SidebarLink href="/dashboard/settings" icon={<Settings className="h-5 w-5" />}>Settings</SidebarLink>
          </div>

          <div className="pt-6">
            <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--muted)] mb-2">Support</p>
            <SidebarLink href="/dashboard/how-it-works" icon={<HelpCircle className="h-5 w-5" />}>How It Works</SidebarLink>
          </div>

          {isAdmin && (
            <div className="pt-6">
              <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-2">Staff Only</p>
              <SidebarLink href="/dashboard/admin" icon={<ShieldAlert className="h-5 w-5" />}>Admin Panel</SidebarLink>
            </div>
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-[color:var(--border)]">
          <form action="/auth/signout" method="post">
            <button 
              type="submit"
              className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-sm font-bold text-[color:var(--muted)] hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
