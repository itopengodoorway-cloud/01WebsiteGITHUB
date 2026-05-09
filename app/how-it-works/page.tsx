export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[color:var(--background)] px-4 py-16 text-[color:var(--foreground)]">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="rounded-[40px] border border-[color:var(--border)] bg-[color:var(--surface)] p-10 shadow-[0_30px_90px_rgba(10,61,43,0.1)]">
          <p className="mb-4 inline-flex rounded-full bg-[color:var(--accent-soft)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--secondary)]">
            How It Works
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[color:var(--secondary)] sm:text-5xl">
            A premium golf coaching experience designed for steady improvement.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[color:var(--muted)]">
            From signup and onboarding to personalized libraries and real-time coach feedback, IOG.doorway gives you a refined training path with expert support.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-[32px] border border-[color:var(--border)] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[color:var(--secondary)]">1. Signup & onboarding</h2>
            <p className="mt-4 text-base leading-7 text-[color:var(--muted)]">
              Create your account with email, password, or magic link. Then complete the onboarding screen with an optional handicap so your coach can tailor guidance immediately.
            </p>
          </article>

          <article className="rounded-[32px] border border-[color:var(--border)] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[color:var(--secondary)]">2. Personalized golf dashboard</h2>
            <p className="mt-4 text-base leading-7 text-[color:var(--muted)]">
              Access the coaching dashboard as soon as you log in. View your progress, library access, and chat with your coach from one elegant interface.
            </p>
          </article>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-[32px] border border-[color:var(--border)] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[color:var(--secondary)]">3. Video coaching library</h2>
            <p className="mt-4 text-base leading-7 text-[color:var(--muted)]">
              Explore free and paid lessons in a curated library. Paid members unlock premium technique videos and advanced course content.
            </p>
          </article>

          <article className="rounded-[32px] border border-[color:var(--border)] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[color:var(--secondary)]">4. Real-time coach feedback</h2>
            <p className="mt-4 text-base leading-7 text-[color:var(--muted)]">
              Send swing videos, receive coaching replies, and track the conversation in one place. The coach experience is built for clarity and speed.
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}
