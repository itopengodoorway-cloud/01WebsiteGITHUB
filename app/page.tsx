export default function Home() {
  return (
    <div className="min-h-screen bg-[color:var(--background)] px-4 py-16 text-[color:var(--secondary)]">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[40px] border border-[color:var(--border)] bg-[color:var(--surface)] p-10 shadow-[0_30px_90px_rgba(10,61,43,0.1)]">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-[color:var(--accent-soft)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--secondary)]">
                Premium golf coaching
              </p>
              <h1 className="text-5xl font-semibold tracking-tight text-[color:var(--secondary)] sm:text-6xl">
                IOG.doorway
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
                Elevate your golf game with thoughtful coaching, video feedback, and progress tracking made for serious players.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="/auth/signup"
                  className="inline-flex items-center justify-center rounded-3xl bg-[color:var(--primary)] px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-[color:var(--primary-light)]"
                >
                  Start free trial
                </a>
                <a
                  href="/how-it-works"
                  className="inline-flex items-center justify-center rounded-3xl border border-[color:var(--primary)] bg-transparent px-8 py-3 text-base font-semibold text-[color:var(--secondary)] transition hover:bg-[color:var(--primary)]/10"
                >
                  How it works
                </a>
              </div>
            </div>
            <div className="rounded-[36px] bg-[color:var(--primary)]/5 p-8 shadow-sm">
              <div className="rounded-[32px] border border-[color:var(--border)] bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">Featured benefits</p>
                <ul className="mt-6 space-y-4 text-[color:var(--foreground)]">
                  <li className="rounded-3xl bg-[color:var(--accent-soft)] p-4">Personalized handicap onboarding</li>
                  <li className="rounded-3xl bg-[color:var(--accent-soft)] p-4">Golf library access for free and paid members</li>
                  <li className="rounded-3xl bg-[color:var(--accent-soft)] p-4">Coach video feedback and chat</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
