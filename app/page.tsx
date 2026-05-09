export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-4">
      <main className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4">
          IOG.doorway
        </h1>
        <p className="text-xl md:text-2xl text-foreground mb-8">
          Professional Golf Coaching Platform
        </p>
        <p className="text-lg text-muted mb-12 max-w-xl mx-auto">
          Get personalized video feedback, track your handicap, and improve your golf game with our expert coaching system.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/auth/login"
            className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition"
          >
            Sign In
          </a>
          <a
            href="/auth/signup"
            className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition"
          >
            Sign Up
          </a>
        </div>
      </main>
    </div>
  );
}
