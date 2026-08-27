import Pricing from "@/components/mejor/Pricing";
import Navbar from "@/components/mejor/Navbar";
import Footer from "@/components/mejor/Footer";
import Link from "next/link";
import { ShieldCheck, Zap, HeadphonesIcon, ArrowRight, Star } from "lucide-react";

export const metadata = {
  title: "Pricing — SkillSwap | Simple, Transparent Plans for Campus Creators",
  description:
    "Choose your SkillSwap plan. Start free with 5 bids/month or go Pro for unlimited proposals and a verified badge. No platform fees on earnings. Cancel anytime.",
};

const faqs = [
  {
    q: "Is the free plan really free forever?",
    a: "Yes. The Starter plan has no time limit. You can browse tasks, submit up to 5 proposals per month, and receive escrow payments at zero cost.",
  },
  {
    q: "Do you take a percentage of my earnings?",
    a: "Never. SkillSwap charges zero platform fees on freelancer earnings — on all plans. You keep 100% of what you bid.",
  },
  {
    q: "Can I cancel my Pro or Team plan at any time?",
    a: "Yes. Cancel anytime from your account settings. Your Pro features remain active until the end of your billing period.",
  },
  {
    q: "What is a 'Verified Badge'?",
    a: "Verified badges are awarded to freelancers on Pro and Team plans whose profiles have been reviewed and confirmed as authentic by our campus moderation team.",
  },
  {
    q: "Does escrow protection require a paid plan?",
    a: "No. Stripe escrow protection is included on every plan, including the free Starter tier.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />

      <main className="font-sans text-[var(--text)]">
        {/* Hero */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-12 md:pt-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-400">
            <Zap className="w-3.5 h-3.5" /> No Hidden Fees. No Commission Cuts.
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--text)] leading-tight">
            Pick Your Plan.<br />
            <span className="amber-text-gradient">Start Building Today.</span>
          </h1>
          <p className="text-sm md:text-lg text-[var(--muted)] font-medium max-w-2xl mx-auto">
            Whether you&apos;re a student freelancer or a startup client, SkillSwap has a plan designed for your workflow — with escrow protection on every tier.
          </p>
        </div>

        {/* Pricing Grid */}
        <Pricing />

        {/* Trust Strip */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 border-y border-[var(--border)]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", title: "Stripe Escrow on All Plans", desc: "Client funds are held securely and released only on milestone approval." },
              { icon: Zap, color: "text-amber-400 border-amber-500/30 bg-amber-500/10", title: "Zero Commission on Earnings", desc: "We never take a cut. Your bid is your full payout — always." },
              { icon: HeadphonesIcon, color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10", title: "24/7 Campus Support", desc: "Dispute arbitration, payment help, and account queries — answered fast." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass-panel rounded-[2rem] p-6 space-y-3 border border-[var(--border)] hover:border-amber-500/30 transition">
                  <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-sm text-[var(--text)]">{item.title}</h3>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-14 md:py-20 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-4xl font-black text-[var(--text)]">
              Pricing <span className="amber-text-gradient">FAQ</span>
            </h2>
            <p className="text-xs text-[var(--muted)] font-medium">Common questions about plans, fees, and billing.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-panel rounded-[2rem] p-6 border border-[var(--border)] space-y-2 hover:border-amber-500/30 transition">
                <h3 className="font-bold text-sm text-[var(--text)]">{faq.q}</h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
          <div className="glass-panel rounded-[3rem] p-8 md:p-12 text-center space-y-5 border border-amber-500/30 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-1/4 top-0 h-60 w-60 rounded-full bg-amber-500/10 blur-[80px]" />
            </div>
            <div className="relative space-y-2">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                <span className="ml-2 text-xs font-bold text-amber-400">4.95 / 5 from 8,200+ reviews</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-[var(--text)]">
                Ready to Launch Your First Campus Project?
              </h2>
              <p className="text-sm text-[var(--muted)] max-w-lg mx-auto font-medium">
                Join 3,800+ verified campus creators already building and earning on SkillSwap.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 relative">
              <Link
                href="/signup"
                className="amber-gradient amber-glow px-8 py-3.5 rounded-full text-white font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/browse-task"
                className="px-8 py-3.5 rounded-full border border-[var(--border)] text-xs font-bold uppercase tracking-widest text-[var(--text)] hover:border-amber-400 hover:text-amber-400 transition"
              >
                Browse Open Tasks
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
