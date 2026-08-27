"use client";

import Link from "next/link";
import { Check, Sparkles, Zap, Building2, X, ArrowRight } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for getting started — browse, bid, and post with zero cost.",
    icon: Zap,
    iconColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    ctaText: "Get Started Free",
    ctaHref: "/signup",
    ctaStyle: "border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text)] hover:border-amber-400 hover:text-amber-400",
    popular: false,
    features: [
      { text: "Browse unlimited tasks", included: true },
      { text: "Submit up to 5 proposals/month", included: true },
      { text: "Basic freelancer profile", included: true },
      { text: "Stripe escrow protection", included: true },
      { text: "Verified badge", included: false },
      { text: "Priority bid placement", included: false },
      { text: "Analytics dashboard", included: false },
      { text: "Dedicated support", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For serious freelancers who want more visibility and unlimited bids.",
    icon: Sparkles,
    iconColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    ctaText: "Start Pro Trial",
    ctaHref: "/signup?plan=pro",
    ctaStyle: "amber-gradient amber-glow text-white",
    popular: true,
    features: [
      { text: "Browse unlimited tasks", included: true },
      { text: "Unlimited proposals", included: true },
      { text: "Enhanced freelancer profile", included: true },
      { text: "Stripe escrow protection", included: true },
      { text: "Verified badge", included: true },
      { text: "Priority bid placement", included: true },
      { text: "Analytics dashboard", included: false },
      { text: "Dedicated support", included: false },
    ],
  },
  {
    id: "team",
    name: "Team",
    price: "$29",
    period: "/month",
    description: "For agencies and startups managing multiple projects and talent.",
    icon: Building2,
    iconColor: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    ctaText: "Start Team Trial",
    ctaHref: "/signup?plan=team",
    ctaStyle: "border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20",
    popular: false,
    features: [
      { text: "Browse unlimited tasks", included: true },
      { text: "Unlimited proposals", included: true },
      { text: "Enhanced freelancer profile", included: true },
      { text: "Stripe escrow protection", included: true },
      { text: "Verified badge", included: true },
      { text: "Priority bid placement", included: true },
      { text: "Analytics dashboard", included: true },
      { text: "Dedicated support", included: true },
    ],
  },
];

export default function Pricing() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden" id="pricing">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-1/4 top-0 h-96 w-96 rounded-full bg-amber-500/10 blur-[130px]" />
        <div className="absolute left-1/4 bottom-0 h-80 w-80 rounded-full bg-indigo-500/8 blur-[100px]" />
      </div>

      <div className="relative mx-auto w-[95%] lg:w-[78%]">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" /> Simple, Transparent Pricing
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text)]">
            Plans Built for{" "}
            <span className="amber-text-gradient">Campus Creators</span>
          </h2>
          <p className="text-sm md:text-base text-[var(--muted)] font-medium max-w-xl mx-auto">
            No hidden fees. No platform cuts on freelancer earnings. Pick the plan that fits your workflow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-start">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative glass-panel rounded-[2.5rem] p-6 md:p-8 flex flex-col gap-6 border transition-all duration-300 hover:scale-[1.02] ${
                  plan.popular
                    ? "border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.12)]"
                    : "border-[var(--border)] hover:border-amber-500/30"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="amber-gradient text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                      ✦ Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="space-y-3">
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${plan.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[var(--text)]">{plan.name}</h3>
                    <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">{plan.description}</p>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black tracking-tight text-[var(--text)]">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm font-semibold text-[var(--muted)] mb-1">{plan.period}</span>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[var(--border)]" />

                {/* Features List */}
                <ul className="space-y-3 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className={`flex items-center gap-3 text-xs font-semibold ${f.included ? "text-[var(--text)]" : "text-[var(--muted)] line-through opacity-50"}`}>
                      {f.included ? (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-[var(--muted)] shrink-0" />
                      )}
                      {f.text}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={plan.ctaHref}
                  className={`w-full py-3.5 rounded-full text-xs font-extrabold uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${plan.ctaStyle}`}
                >
                  {plan.ctaText} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Trust Row */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-[var(--muted)]">
          {[
            "✓ No credit card required",
            "✓ Cancel anytime",
            "✓ 0% platform fees on earnings",
            "✓ Stripe escrow on all plans",
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
