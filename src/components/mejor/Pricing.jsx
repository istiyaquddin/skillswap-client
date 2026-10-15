"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Zap, Building2, ArrowRight } from "lucide-react";

export default function Pricing() {
  const [annualBilling, setAnnualBilling] = useState(false);

  const plans = [
    {
      id: "free",
      name: "Student Starter",
      monthlyPrice: "$0",
      annualPrice: "$0",
      period: "/forever",
      description: "Ideal for freshmen & casual learners — browse, bid, and learn with zero cost.",
      icon: Zap,
      iconColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      ctaText: "Get Started Free",
      ctaHref: "/signup",
      ctaStyle:
        "border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text)] hover:border-[#1dbf73] hover:text-[#1dbf73]",
      popular: false,
      features: [
        { text: "Browse unlimited campus tasks", included: true },
        { text: "Submit up to 5 proposals/month", included: true },
        { text: "Campus student profile", included: true },
        { text: "Stripe escrow milestone security", included: true },
        { text: "Verified talent badge", included: false },
        { text: "Priority proposal placement", included: false },
        { text: "Portfolio analytics dashboard", included: false },
      ],
    },
    {
      id: "pro",
      name: "Creator Pro",
      monthlyPrice: "$9",
      annualPrice: "$7",
      period: "/month",
      description: "For active student freelancers looking for high bid priority and unlimited work.",
      icon: Sparkles,
      iconColor: "text-[#1dbf73] border-[#1dbf73]/30 bg-[#1dbf73]/10",
      ctaText: "Start Pro Trial",
      ctaHref: "/signup?plan=pro",
      ctaStyle: "amber-gradient amber-glow text-white shadow-lg",
      popular: true,
      features: [
        { text: "Browse unlimited campus tasks", included: true },
        { text: "Unlimited monthly proposals", included: true },
        { text: "Featured student badge & portfolio", included: true },
        { text: "Stripe escrow milestone security", included: true },
        { text: "Top-ranked proposal placement", included: true },
        { text: "Direct client messaging chat", included: true },
        { text: "Priority payout processing", included: true },
      ],
    },
    {
      id: "team",
      name: "Startup & Club",
      monthlyPrice: "$29",
      annualPrice: "$23",
      period: "/month",
      description: "For student startups, labs, and campus organizations managing multiple hires.",
      icon: Building2,
      iconColor: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
      ctaText: "Start Club Plan",
      ctaHref: "/signup?plan=team",
      ctaStyle:
        "border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20",
      popular: false,
      features: [
        { text: "Post unlimited tasks & bounties", included: true },
        { text: "Multiple team member seats (up to 5)", included: true },
        { text: "Dedicated student manager support", included: true },
        { text: "Custom invoice billing & receipts", included: true },
        { text: "Private task boards for campus clubs", included: true },
        { text: "Full candidate analytics & review logs", included: true },
        { text: "Early access to top graduating talent", included: true },
      ],
    },
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" id="pricing">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-1/4 top-0 h-96 w-96 rounded-full bg-[#1dbf73]/10 blur-[130px]" />
        <div className="absolute left-1/4 bottom-0 h-80 w-80 rounded-full bg-blue-500/8 blur-[100px]" />
      </div>

      <div className="relative mx-auto w-[95%] lg:w-[78%]">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14 space-y-3">
          <div className="section-badge mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#1dbf73]" />
            Simple, Transparent Pricing
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text)]">
            Plans Built for <span className="amber-text-gradient">Campus Creators</span>
          </h2>
          <p className="text-sm md:text-base text-[var(--muted)] font-medium max-w-xl mx-auto">
            Zero hidden fees. Zero commission on freelancer earnings. Pick the plan that fits your campus journey.
          </p>

          {/* Dynamic Annual vs Monthly Billing Switch */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span
              className={`text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                !annualBilling ? "text-[#1dbf73]" : "text-[var(--muted)]"
              }`}
              onClick={() => setAnnualBilling(false)}
            >
              Monthly Billing
            </span>
            <button
              type="button"
              onClick={() => setAnnualBilling(!annualBilling)}
              className="relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-[var(--border)] focus:outline-hidden"
              style={{
                backgroundColor: annualBilling ? "#1dbf73" : "var(--border)",
              }}
              aria-label="Toggle annual billing"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  annualBilling ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                annualBilling ? "text-[#1dbf73]" : "text-[var(--muted)]"
              }`}
              onClick={() => setAnnualBilling(true)}
            >
              Annual Billing
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#1dbf73]/15 text-[#1dbf73] border border-[#1dbf73]/30">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = annualBilling ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.id}
                className={`relative glass-panel rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between border transition-all duration-300 hover:scale-[1.02] ${
                  plan.popular
                    ? "border-[#1dbf73] shadow-[0_0_40px_rgba(29,191,115,0.15)] ring-1 ring-[#1dbf73]/30"
                    : "border-[var(--border)] hover:border-[#1dbf73]/40"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="amber-gradient text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                      ✦ Most Popular on Campus
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text)]">{plan.name}</h3>
                      <p className="text-xs text-[var(--muted)] mt-1">{plan.description}</p>
                    </div>
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${plan.iconColor}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="pt-2">
                    <span className="text-4xl font-black text-[var(--text)] font-mono">{price}</span>
                    <span className="text-xs font-semibold text-[var(--muted)] ml-1">
                      {plan.period}
                    </span>
                    {annualBilling && plan.id !== "free" && (
                      <p className="text-[11px] font-bold text-[#1dbf73] mt-1">
                        Billed annually (Includes 20% discount)
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 pt-2 border-t border-[var(--border)] text-xs font-medium text-[var(--muted)]">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                            feat.included
                              ? "bg-[#1dbf73]/20 text-[#1dbf73]"
                              : "bg-[var(--border)]/40 text-[var(--muted)]/40"
                          }`}
                        >
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        <span className={feat.included ? "text-[var(--text)] font-semibold" : ""}>
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="pt-6">
                  <Link
                    href={plan.ctaHref}
                    className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 ${plan.ctaStyle}`}
                  >
                    {plan.ctaText}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
