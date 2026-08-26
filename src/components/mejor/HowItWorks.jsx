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
      accent: "from-amber-500 to-amber-600",
      glow: "amber-glow",
    },
    {
      number: "02",
      title: "Find a Skill",
      description:
        "Explore peer teachers, compare skills and availability, then request a session with one token.",
      icon: Users,
      accent: "from-amber-400 to-emerald-500",
      glow: "emerald-glow",
    },
    {
      number: "03",
      title: "Learn, Then Teach",
      description:
        "Complete your session, build momentum, and earn tokens by sharing your own skills with others.",
      icon: ShieldCheck,
      accent: "from-emerald-500 to-teal-500",
      glow: "emerald-glow",
    },
  ];

  return (
    <section className="relative py-16 md:py-24">
      <div className="relative mx-auto w-[95%] lg:w-[78%]">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 backdrop-blur">
            <Zap className="h-3.5 w-3.5 animate-pulse text-amber-400" /> Learn by exchange
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)] md:text-5xl">
            How <span className="amber-text-gradient">SkillSwap</span> Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--muted)] max-w-xl mx-auto">
            A simple loop that keeps knowledge moving across campus.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
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
                className="glass-panel relative overflow-hidden rounded-[2rem] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-amber-500/40 hover:shadow-2xl group block cursor-pointer"
              >
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${step.accent} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <Icon className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <span className="text-3xl font-black text-[var(--muted)]/30 group-hover:text-amber-400 transition-colors">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[var(--text)] mb-3 group-hover:text-amber-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  {step.description}
                </p>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-amber-500/40 transition-transform duration-300 group-hover:translate-x-1.5">
                    <ArrowRight className="h-6 w-6 animate-pulse" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>

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

