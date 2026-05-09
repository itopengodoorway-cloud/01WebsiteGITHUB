"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";

export default function SidebarLink({ 
  href, 
  icon, 
  children, 
  disabled = false 
}: { 
  href: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
  disabled?: boolean 
}) {
  const pathname = usePathname();
  const active = pathname === href;

  if (disabled) {
    return (
      <div 
        className="flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-bold text-[color:var(--muted)] opacity-50 cursor-not-allowed"
      >
        {icon}
        {children}
        <Lock className="h-3 w-3 ml-auto" />
      </div>
    );
  }

  return (
    <Link 
      href={href} 
      className={`flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
        active 
          ? "bg-[color:var(--primary)] text-white shadow-lg shadow-[color:var(--primary)]/20" 
          : "text-[color:var(--muted)] hover:bg-[color:var(--primary)]/5 hover:text-[color:var(--primary)]"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}
