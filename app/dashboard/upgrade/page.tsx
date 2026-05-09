"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { 
  Check, 
  Crown, 
  ShieldCheck, 
  Video, 
  MessageSquare, 
  TrendingDown, 
  ArrowLeft,
  Loader2
} from "lucide-react";
import Link from "next/link";

export default function UpgradePage() {
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkSubscription() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/auth/login");
        return;
      }

      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", session.user.id)
        .eq("status", "active")
        .maybeSingle();

      if (subscription) {
        setIsSubscribed(true);
      }
      setLoading(false);
    }

    checkSubscription();
  }, [router]);

  const handleUpgrade = async () => {
    setProcessing(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to initiate checkout");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setProcessing(false);
    }
  };

  const handlePortal = async () => {
    setProcessing(true);
    try {
      const response = await fetch("/api/portal", {
        method: "POST",
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

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
        <div className="text-center mb-16">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-[color:var(--muted)] mb-4">Membership Tiers</p>
          <h1 className="text-4xl md:text-6xl font-bold text-[color:var(--secondary)] mb-6">Choose Your <span className="text-[color:var(--accent)]">Level</span></h1>
          <p className="max-w-2xl mx-auto text-[color:var(--muted)] leading-relaxed">
            Unlock professional video libraries, direct coaching feedback, and advanced progress analytics.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-[40px] border border-[color:var(--border)] bg-[color:var(--surface)] p-10 flex flex-col">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-[color:var(--secondary)] mb-2">Free Starter</h3>
              <p className="text-sm text-[color:var(--muted)]">Explore the basics of IOG.doorway</p>
            </div>
            
            <div className="mb-8">
              <span className="text-4xl font-black text-[color:var(--secondary)]">€0</span>
              <span className="text-[color:var(--muted)] font-medium ml-2">/month</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              <PricingFeature text="Handicap Tracking" />
              <PricingFeature text="Basic Progress Graph" />
              <PricingFeature text="Sample Video Access" />
              <PricingFeature text="Community Support" dimmed />
              <PricingFeature text="Personalized Feedback" dimmed />
            </ul>

            <button 
              disabled 
              className="w-full rounded-2xl border-2 border-[color:var(--border)] py-4 text-sm font-black text-[color:var(--muted)]"
            >
              Current Plan
            </button>
          </div>

          {/* Premium Tier */}
          <div className="rounded-[40px] bg-[color:var(--primary)] p-10 flex flex-col text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
              <Crown className="h-12 w-12 text-[color:var(--accent)] opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Premium Coach</h3>
              <p className="text-sm opacity-70">Complete professional coaching experience</p>
            </div>
            
            <div className="mb-8">
              <span className="text-4xl font-black">€49</span>
              <span className="opacity-70 font-medium ml-2">/month</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              <PricingFeature text="Advanced Analytics" />
              <PricingFeature text="Unlimited Video Libraries" />
              <PricingFeature text="Direct Coaching Chat" />
              <PricingFeature text="Personalized Feedback" />
              <PricingFeature text="Priority Response" />
            </ul>

            {isSubscribed ? (
              <button 
                onClick={handlePortal}
                disabled={processing}
                className="w-full rounded-2xl bg-white/10 py-4 text-sm font-black text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                Manage Subscription
              </button>
            ) : (
              <button 
                onClick={handleUpgrade}
                disabled={processing}
                className="w-full rounded-2xl bg-[color:var(--accent)] py-4 text-sm font-black text-[color:var(--secondary)] hover:bg-white transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/20"
              >
                {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crown className="h-4 w-4" />}
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingFeature({ text, dimmed = false }: { text: string; dimmed?: boolean }) {
  return (
    <li className={`flex items-center gap-3 text-sm font-medium ${dimmed ? 'opacity-30' : ''}`}>
      <div className={`flex h-5 w-5 items-center justify-center rounded-full ${dimmed ? 'bg-gray-200 text-gray-400' : 'bg-[color:var(--accent)] text-[color:var(--secondary)]'}`}>
        <Check className="h-3 w-3" strokeWidth={4} />
      </div>
      {text}
    </li>
  );
}
