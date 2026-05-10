import { 
  UserPlus, 
  PlayCircle, 
  MessageSquare, 
  Target, 
  ChevronRight, 
  CheckCircle2, 
  Trophy,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <UserPlus className="h-8 w-8 text-[color:var(--accent)]" />,
      title: "1. Join the Club",
      description: "Create your account and set your initial handicap. This helps us tailor your coaching experience from day one.",
      color: "bg-blue-50"
    },
    {
      icon: <PlayCircle className="h-8 w-8 text-[color:var(--accent)]" />,
      title: "2. Master the Basics",
      description: "Explore our curated video libraries. From driving to putting, learn the mechanics of a professional swing through high-definition tutorials.",
      color: "bg-green-50"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-[color:var(--accent)]" />,
      title: "3. Live CO-CHAT Feedback",
      description: "Premium members can record and upload their swing. Our AI and professional coaches analyze your mechanics and provide annotated video feedback.",
      color: "bg-orange-50"
    },
    {
      icon: <Target className="h-8 w-8 text-[color:var(--accent)]" />,
      title: "4. Track Your Progress",
      description: "Watch your handicap drop. Log your improvements and see your growth visualized through interactive charts and historical tracking.",
      color: "bg-purple-50"
    }
  ];

  return (
    <div className="px-4 py-12 md:px-10 md:py-20 max-w-6xl mx-auto">
      <header className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--primary)]/5 text-[color:var(--primary)] text-xs font-black uppercase tracking-[0.3em] mb-6">
          <Trophy className="h-4 w-4" />
          The IOG Path to Success
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-[color:var(--secondary)] mb-6 tracking-tight">
          How <span className="text-[color:var(--accent)]">IOG.doorway</span> Works
        </h1>
        <p className="text-xl text-[color:var(--muted)] font-medium max-w-2xl mx-auto leading-relaxed">
          Our methodology combines professional mechanical analysis with real-time feedback to transform your game from the ground up.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 mb-24">
        {steps.map((step, index) => (
          <div key={index} className="group relative p-10 rounded-[48px] bg-white border border-[color:var(--border)] hover:border-[color:var(--primary)]/30 transition-all hover:shadow-2xl hover:shadow-[color:var(--primary)]/5">
            <div className={`h-16 w-16 rounded-2xl ${step.color} flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
              {step.icon}
            </div>
            <h3 className="text-2xl font-black text-[color:var(--secondary)] mb-4">{step.title}</h3>
            <p className="text-[color:var(--muted)] font-medium leading-relaxed">
              {step.description}
            </p>
            <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-100 transition-opacity">
               <CheckCircle2 className="h-8 w-8 text-[color:var(--primary)]" />
            </div>
          </div>
        ))}
      </div>

      <section className="bg-[color:var(--secondary)] rounded-[60px] p-12 md:p-20 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 h-64 w-64 bg-[color:var(--primary)]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-64 w-64 bg-[color:var(--accent)]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Ready to lower your handicap?</h2>
            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-6 w-6 rounded-full bg-[color:var(--accent)] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-[color:var(--secondary)]" />
                </div>
                <p className="font-bold opacity-90">Unlimited access to professional video libraries.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 h-6 w-6 rounded-full bg-[color:var(--accent)] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-[color:var(--secondary)]" />
                </div>
                <p className="font-bold opacity-90">Personalized swing analysis from expert coaches.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 h-6 w-6 rounded-full bg-[color:var(--accent)] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-[color:var(--secondary)]" />
                </div>
                <p className="font-bold opacity-90">Real-time chat and video annotation tools.</p>
              </div>
            </div>
            <Link 
              href="/dashboard/upgrade" 
              className="inline-flex items-center gap-3 bg-[color:var(--accent)] text-[color:var(--secondary)] px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Unlock Premium Access
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="hidden lg:block">
             <div className="aspect-square bg-gradient-to-br from-white/10 to-transparent rounded-[80px] border border-white/10 flex items-center justify-center p-12">
                <div className="relative w-full h-full">
                   <div className="absolute inset-0 bg-[color:var(--primary)]/20 rounded-[60px] animate-pulse"></div>
                   <div className="absolute inset-4 bg-white/5 rounded-[40px] backdrop-blur-sm flex items-center justify-center">
                      <Trophy className="h-24 w-24 text-[color:var(--accent)] opacity-40" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
