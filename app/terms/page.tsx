import Link from "next/link";

const lastUpdated = "May 7, 2026";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-12 text-zinc-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand">Legal</p>
        <h1 className="text-3xl font-black text-white sm:text-4xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-zinc-400">Last updated: {lastUpdated}</p>

        <div className="mt-8 space-y-8 rounded-2xl border border-white/10 bg-[#0b1118] p-6 sm:p-8">
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
            <p className="text-sm leading-7">
              By using TagComics, you agree to these Terms of Service and our Privacy Policy. These are working
              drafts for client/legal approval and may be updated.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">2. Accounts and Access</h2>
            <p className="text-sm leading-7">
              You are responsible for account security and activity under your account. Purchased digital content is
              licensed to your account and may be access-restricted based on purchase validation and platform rules.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">3. Purchases and Digital Content</h2>
            <p className="text-sm leading-7">
              Prices, availability, and promotions may change. Unless required by law, digital comic purchases are
              generally non-refundable once access is granted.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">4. Acceptable Use</h2>
            <p className="text-sm leading-7">
              You agree not to copy, resell, scrape, reverse engineer, or redistribute protected content without
              explicit permission from rights holders.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-white">5. Contact</h2>
            <p className="text-sm leading-7">
              For legal or support requests, contact us through the design/support form on the website.
            </p>
          </section>
        </div>

        <div className="mt-6">
          <Link href="/privacy" className="text-sm font-bold text-brand transition-colors hover:text-brand/80">
            View Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  );
}
