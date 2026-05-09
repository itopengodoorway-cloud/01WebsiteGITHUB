"use client";

import { Settings as SettingsIcon, Bell, Shield, Smartphone, Globe, CreditCard } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="px-4 py-8 md:px-10 md:py-12 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-[color:var(--secondary)] mb-4">Settings</h1>
        <p className="text-[color:var(--muted)] font-medium">Manage your account preferences and coaching configuration.</p>
      </header>

      <div className="space-y-6">
        <SettingGroup title="General">
          <SettingItem icon={<Globe className="h-5 w-5" />} title="Language" description="English (UK)" />
          <SettingItem icon={<Smartphone className="h-5 w-5" />} title="Device Sync" description="Last synced 2 hours ago" />
        </SettingGroup>

        <SettingGroup title="Security & Billing">
          <Link href="/dashboard/profile" className="block">
            <SettingItem icon={<Shield className="h-5 w-5" />} title="Account Security" description="Password and two-factor authentication" />
          </Link>
          <Link href="/dashboard/upgrade" className="block">
            <SettingItem icon={<CreditCard className="h-5 w-5" />} title="Subscription & Billing" description="Manage your Premium Coach membership" />
          </Link>
        </SettingGroup>

        <SettingGroup title="Notifications">
          <SettingItem icon={<Bell className="h-5 w-5" />} title="Push Notifications" description="Coach replies and new library content" toggle />
          <SettingItem icon={<Bell className="h-5 w-5" />} title="Email Updates" description="Weekly progress reports and tips" toggle active />
        </SettingGroup>
      </div>
    </div>
  );
}

function SettingGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="px-4 text-xs font-black uppercase tracking-[0.2em] text-[color:var(--muted)]">{title}</h3>
      <div className="rounded-[32px] border border-[color:var(--border)] bg-white overflow-hidden divide-y divide-[color:var(--border)]/30">
        {children}
      </div>
    </div>
  );
}

function SettingItem({ icon, title, description, toggle = false, active = false }: { icon: React.ReactNode; title: string; description: string; toggle?: boolean; active?: boolean }) {
  return (
    <div className="flex items-center justify-between p-6 hover:bg-[color:var(--background)] transition-all group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-[color:var(--primary)]/5 flex items-center justify-center text-[color:var(--primary)] group-hover:bg-[color:var(--primary)] group-hover:text-white transition-all">
          {icon}
        </div>
        <div>
          <p className="font-bold text-[color:var(--secondary)] text-sm">{title}</p>
          <p className="text-xs text-[color:var(--muted)] font-medium">{description}</p>
        </div>
      </div>
      {toggle ? (
        <div className={`h-6 w-11 rounded-full p-1 transition-all ${active ? 'bg-[color:var(--primary)]' : 'bg-gray-200'}`}>
          <div className={`h-4 w-4 rounded-full bg-white transition-all ${active ? 'translate-x-5' : ''}`}></div>
        </div>
      ) : (
        <div className="h-8 w-8 rounded-full flex items-center justify-center text-[color:var(--muted)] hover:text-[color:var(--secondary)]">
          <Globe className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
        </div>
      )}
    </div>
  );
}
