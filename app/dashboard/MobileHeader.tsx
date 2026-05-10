'use client';

import { useState } from "react";
import { 
  Menu, 
  X, 
  Trophy, 
  Video, 
  MessageSquare, 
  Settings,
  LayoutDashboard,
  Crown,
  UserCircle,
  HelpCircle,
  ShieldAlert,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileHeader({ 
  isPremium, 
  isAdmin 
}: { 
  isPremium: boolean; 
  isAdmin: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/dashboard/libraries", label: "Video Libraries", icon: <Video className="h-5 w-5" /> },
    { href: "/dashboard/co-chat", label: "CO-CHAT", icon: <MessageSquare className="h-5 w-5" />, disabled: !isPremium },
    { href: "/dashboard/handicap", label: "Handicap Tracker", icon: <Trophy className="h-5 w-5" /> },
    { href: "/dashboard/profile", label: "My Profile", icon: <UserCircle className="h-5 w-5" /> },
    { href: "/dashboard/upgrade", label: "Membership", icon: <Crown className="h-5 w-5" /> },
    { href: "/dashboard/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
    { href: "/dashboard/how-it-works", label: "How It Works", icon: <HelpCircle className="h-5 w-5" /> },
  ];

  if (isAdmin) {
    links.push({ href: "/dashboard/admin", label: "Admin Panel", icon: <ShieldAlert className="h-5 w-5" />, color: "text-red-600" });
  }

  return (
    <>
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[color:var(--surface)] border-b border-[color:var(--border)] sticky top-0 z-40">
        <Link href="/dashboard" className="text-xl font-black tracking-tighter text-[color:var(--secondary)]">
          IOG.<span className="text-[color:var(--accent)]">doorway</span>
        </Link>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl bg-[color:var(--background)] border border-[color:var(--border)]"
        >
          <Menu className="h-6 w-6 text-[color:var(--secondary)]" />
        </button>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-[color:var(--surface)] z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-[color:var(--border)] flex items-center justify-between">
                <span className="text-xl font-black text-[color:var(--secondary)]">IOG.<span className="text-[color:var(--accent)]">doorway</span></span>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl bg-[color:var(--background)]">
                  <X className="h-5 w-5 text-[color:var(--muted)]" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.disabled ? "#" : link.href}
                      onClick={() => !link.disabled && setIsOpen(false)}
                      className={`
                        flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all
                        ${isActive ? 'bg-[color:var(--primary)] text-white shadow-lg' : 'text-[color:var(--muted)] hover:bg-[color:var(--background)]'}
                        ${link.disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                        ${link.color || ''}
                      `}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-[color:var(--border)]">
                <form action="/auth/signout" method="post">
                  <button 
                    type="submit"
                    className="flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </form>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
