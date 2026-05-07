import Link from "next/link";

const lastUpdated = "May 7, 2026";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-12 text-zinc-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand">Legal</p>
        <h1 className="text-3xl font-black text-white sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-zinc-400">Last updated: {lastUpdated}</p>

        <div className="mt-8 space-y-8 rounded-2xl border border-white/10 bg-[#0b1118] p-6 sm:p-8">
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
            <p className="text-sm leading-7">
              We collect information you provide (such as name, email, and purchase details) and technical usage data
              needed to operate, secure, and improve the comics platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">2. How We Use Information</h2>
            <p className="text-sm leading-7">
              Data is used for authentication, order processing, library access, customer support, fraud prevention,
              analytics, and service quality improvements.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">3. Sharing and Processors</h2>
            <p className="text-sm leading-7">
              We may share limited data with payment processors, infrastructure providers, and support tools only as
              necessary to deliver platform functionality.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">4. Data Retention and Security</h2>
            <p className="text-sm leading-7">
              We retain data for legal, operational, and security reasons, and apply reasonable technical and
              organizational safeguards.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">5. Your Rights</h2>
            <p className="text-sm leading-7">
              Depending on your region, you may have rights to access, correct, or delete personal data. Contact us to
              submit requests.
            </p>
          </section>
        </div>

        <div className="mt-6">
          <Link href="/terms" className="text-sm font-bold text-brand transition-colors hover:text-brand/80">
            View Terms of Service
          </Link>
        </div>
      </div>
    </main>
  );
}
