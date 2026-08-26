"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { FaArrowRight, FaGoogle, FaPaypal } from "react-icons/fa";
import { SiMeta, SiNetflix, SiPayoneer } from "react-icons/si";
import {
  Code,
  Palette,
  Video,
  Megaphone,
  Compass,
  Bot,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

const Banner = () => {
  const { data: session } = authClient.useSession();

  const categories = [
    { label: "Website Development", icon: Code },
    { label: "Product Design", icon: Palette },
    { label: "UGC & Video", icon: Video },
    { label: "Marketing", icon: Megaphone },
    { label: "Brand Strategy", icon: Compass },
    { label: "AI Automation", icon: Bot },
  ];

  return (
    <section className="relative overflow-hidden py-8 md:py-16">
      <div className="absolute inset-0">
        <div className="bg-grid-pattern absolute inset-0 opacity-40" />
        <div className="absolute left-1/4 top-10 h-[28rem] w-[28rem] rounded-full bg-amber-500/15 blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 h-[24rem] w-[24rem] rounded-full bg-emerald-500/10 blur-[150px] animate-float-slow" />
      </div>

      <div className="relative mx-auto w-[95%] lg:w-[78%]">
        <div className="glass-panel overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 lg:p-16 transition-all duration-300 relative">
          
          {/* Floating Badges for Visual Depth */}
          <div className="hidden xl:flex items-center gap-2 absolute top-8 right-12 bg-[var(--surface-strong)]/90 backdrop-blur border border-amber-500/30 px-3.5 py-1.5 rounded-2xl shadow-lg animate-float text-xs font-bold text-[var(--text)]">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            <span>100% Peer Verified</span>
          </div>

          <div className="hidden xl:flex items-center gap-2 absolute bottom-8 left-12 bg-[var(--surface-strong)]/90 backdrop-blur border border-emerald-500/30 px-3.5 py-1.5 rounded-2xl shadow-lg animate-float-slow text-xs font-bold text-[var(--text)]">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span>98.4% Completion Rate</span>
          </div>

          <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="text-center lg:text-left">
              <div className="mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Campus-powered learning
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-[1.15] text-[var(--text)] md:text-5xl lg:text-6xl">
                Trade skills.{" "}
                <span className="amber-text-gradient inline-flex items-center gap-2">
                  Learn together.
                  <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-amber-400 animate-float hidden md:inline-block" />
                </span>
              </h1>

              <p className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base leading-7 text-[var(--muted)] md:text-lg">
                SkillSwap helps students teach what they know, learn from their
                peers, and grow through a simple token-based campus community.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4 lg:justify-start">
                {session?.user && session.user.role === "client" && (
                  <>
                    <Link
                      href="/dashboard/client/tasks/post-task"
                      className="amber-gradient amber-glow shine-button inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 group"
                    >
                      Post a Task{" "}
                      <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/dashboard/client/tasks"
                      className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-6 py-3.5 text-sm font-semibold text-[var(--text)] transition hover:border-amber-500/40 hover:text-amber-400"
                    >
                      View My Tasks
                    </Link>
                  </>
                )}

                {session?.user && session.user.role === "freelancer" && (
                  <>
                    <Link
                      href="/browse-task"
                      className="amber-gradient amber-glow shine-button inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 group"
                    >
                      Browse Tasks{" "}
                      <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/dashboard/freelancer/profile"
                      className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-6 py-3.5 text-sm font-semibold text-[var(--text)] transition hover:border-amber-500/40 hover:text-amber-400"
                    >
                      Profile Preview
                    </Link>
                  </>
                )}

                {(!session?.user || session.user.role === "admin") && (
                  <>
                    <Link
                      href="/login"
                      className="amber-gradient amber-glow shine-button inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 group"
                    >
                      Post a Task{" "}
                      <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/browse-task"
                      className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-6 py-3.5 text-sm font-semibold text-[var(--text)] transition hover:border-amber-500/40 hover:text-amber-400 group"
                    >
                      Browse Tasks{" "}
                      <FaArrowRight className="inline-block ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-7 sm:mt-10 flex flex-wrap justify-center gap-2 sm:gap-2.5 lg:justify-start">
                {categories.map(({ label, icon: CategoryIcon }) => {
                  const categoryQuery = label.includes("Development")
                    ? "Development"
                    : label.includes("Design")
                      ? "Design"
                      : label.includes("Marketing")
                        ? "Marketing"
                        : "Other";
                  return (
                    <Link
                      key={label}
                      href={`/browse-task?category=${encodeURIComponent(categoryQuery)}`}
                      className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold text-[var(--muted)] transition-all duration-200 hover:border-amber-500/40 hover:text-amber-400 hover:scale-105 cursor-pointer group"
                    >
                      <CategoryIcon className="h-3.5 w-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-4 sm:p-6 shadow-2xl transition-all duration-300 hover:border-amber-500/30">
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-amber-400 font-bold flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 animate-spin" style={{ animationDuration: '6s' }} /> Live Workspace
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-[var(--text)]">
                      Project Delivery Metrics
                    </h2>
                  </div>
                  <div className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Active Now
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    [
                      "Software Development",
                      "Full-Stack Task",
                      "$450 Budget",
                      "Open",
                    ],
                    [
                      "Brand Design Sprint",
                      "UI/UX Identity",
                      "$280 Budget",
                      "In Review",
                    ],
                    [
                      "Stripe Payment Engine",
                      "Milestone Released",
                      "$600 Secured",
                      "Completed",
                    ],
                  ].map(([title, desc, budget, status]) => (
                    <Link
                      key={title}
                      href="/browse-task"
                      className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-3.5 transition-all duration-200 hover:border-amber-500/40 hover:-translate-y-0.5 block cursor-pointer group"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[var(--text)] group-hover:text-amber-400 transition-colors">
                          {title}
                        </p>
                        <p className="text-xs text-[var(--muted)]">{desc}</p>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-bold text-amber-400">
                          {budget}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold inline-flex items-center gap-1">
                          {status === "Completed" && <CheckCircle2 className="h-2.5 w-2.5" />}
                          {status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-sm text-[var(--muted)]">
                <div className="flex items-center gap-1.5 hover:text-[var(--text)] transition hover:scale-105 cursor-pointer">
                  <FaGoogle className="text-base text-amber-400" />{" "}
                  <span className="font-semibold">Google</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-[var(--text)] transition hover:scale-105 cursor-pointer">
                  <SiMeta className="text-base text-blue-500" />{" "}
                  <span className="font-semibold">Meta</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-[var(--text)] transition hover:scale-105 cursor-pointer">
                  <SiNetflix className="text-base text-red-500" />{" "}
                  <span className="font-semibold">Netflix</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-[var(--text)] transition hover:scale-105 cursor-pointer">
                  <FaPaypal className="text-base text-blue-400" />{" "}
                  <span className="font-semibold">PayPal</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-[var(--text)] transition hover:scale-105 cursor-pointer">
                  <SiPayoneer className="text-base text-amber-500" />{" "}
                  <span className="font-semibold">Payoneer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;

