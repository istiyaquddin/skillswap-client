"use client";

import { ArrowRight, FileText, ShieldCheck, Users, Zap } from "lucide-react";
import Link from "next/link";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Join Campus",
      description:
        "Create your student profile and receive starter tokens to begin learning from your community.",
      icon: FileText,
      accent: "from-[#1dbf73] to-[#17a862]",
      shadowColor: "rgba(29,191,115,0.35)",
    },
    {
      number: "02",
      title: "Find a Skill",
      description:
        "Explore peer teachers, compare skills and availability, then request a session with one token.",
      icon: Users,
      accent: "from-[#1dbf73] to-emerald-400",
      shadowColor: "rgba(29,191,115,0.3)",
    },
    {
      number: "03",
      title: "Learn, Then Teach",
      description:
        "Complete your session, build momentum, and earn tokens by sharing your own skills with others.",
      icon: ShieldCheck,
      accent: "from-emerald-400 to-teal-500",
      shadowColor: "rgba(52,211,153,0.32)",
    },
  ];

  return (
    <section className="relative py-16 md:py-24">
      <div className="relative mx-auto w-[95%] lg:w-[78%]">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="section-badge">
            <Zap className="h-3.5 w-3.5" />
            Learn by exchange
          </div>
          <h2 className="section-title">
            How <span className="amber-text-gradient">SkillSwap</span> Works
          </h2>
          <p className="section-desc">
            A simple loop that keeps knowledge moving across campus.
          </p>
        </div>

        {/* Step Cards */}
        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connector Line (desktop) */}
          <div className="hidden md:block absolute top-[3.5rem] left-[calc(33.33%+1.5rem)] right-[calc(33.33%+1.5rem)] h-px bg-gradient-to-r from-[#1dbf73]/30 via-[#1dbf73]/60 to-[#1dbf73]/30" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const stepLinks = [
              "/dashboard/client/tasks/post-task",
              "/browse-task",
              "/browse-freelancer",
            ];
            return (
              <Link
                key={step.number}
                href={stepLinks[idx]}
                className={`glass-panel relative overflow-hidden rounded-[2rem] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#1dbf73]/40 hover:shadow-2xl group block cursor-pointer fade-in-up-${idx + 1}`}
              >
                {/* Top accent bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.accent} opacity-60 group-hover:opacity-100 transition-opacity`}
                />

                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.accent} text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    style={{ boxShadow: `0 8px 24px -8px ${step.shadowColor}` }}
                  >
                    <Icon className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="text-4xl font-black text-[var(--muted)]/20 group-hover:text-[#1dbf73]/30 transition-colors select-none">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[var(--text)] mb-3 group-hover:text-[#1dbf73] transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  {step.description}
                </p>

                <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-[#1dbf73]/60 group-hover:text-[#1dbf73] transition-colors">
                  Get started
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/signup"
            className="amber-gradient amber-glow shine-button inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 group"
          >
            Create Your Account{" "}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
