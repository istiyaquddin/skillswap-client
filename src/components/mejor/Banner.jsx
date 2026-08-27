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
  Users,
  Star,
  Zap,
} from "lucide-react";

const avatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=64&q=80",
];

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

  const taskRows = [
    ["Software Development", "Full-Stack Task", "$450 Budget", "Open"],
    ["Brand Design Sprint", "UI/UX Identity", "$280 Budget", "In Review"],
    ["Stripe Payment Engine", "Milestone Released", "$600 Secured", "Completed"],
  ];

  const statusStyles = {
    Open: "bg-[#1dbf73]/12 text-[#1dbf73] border-[#1dbf73]/25",
    "In Review": "bg-amber-500/12 text-amber-400 border-amber-400/25",
    Completed: "bg-blue-500/12 text-blue-400 border-blue-400/25",
  };

  return (
    <section className="relative overflow-hidden py-8 md:py-16">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="bg-grid-pattern absolute inset-0 opacity-50" />
        <div className="absolute left-1/4 top-10 h-[30rem] w-[30rem] rounded-full bg-[#1dbf73]/12 blur-[140px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 h-[26rem] w-[26rem] rounded-full bg-blue-500/8 blur-[140px] animate-float-slow" />
      </div>

      <div className="relative mx-auto w-[95%] lg:w-[78%]">
        <div className="glass-panel overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 lg:p-16 transition-all duration-300 relative">

          {/* Floating Badges */}
          <div className="hidden xl:flex items-center gap-2 absolute top-8 right-12 bg-[var(--surface-strong)]/90 backdrop-blur border border-[#1dbf73]/30 px-3.5 py-1.5 rounded-2xl shadow-lg animate-float text-xs font-bold text-[var(--text)]">
            <ShieldCheck className="h-4 w-4 text-[#1dbf73]" />
            <span>100% Peer Verified</span>
          </div>

          <div className="hidden xl:flex items-center gap-2 absolute bottom-8 left-12 bg-[var(--surface-strong)]/90 backdrop-blur border border-emerald-500/30 px-3.5 py-1.5 rounded-2xl shadow-lg animate-float-slow text-xs font-bold text-[var(--text)]">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span>98.4% Completion Rate</span>
          </div>

          <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Left: Hero Copy */}
            <div className="text-center lg:text-left fade-in-up">
              {/* Pill badge */}
              <div className="mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full border border-[#1dbf73]/30 bg-[#1dbf73]/10 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#1dbf73] backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1dbf73] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1dbf73]"></span>
                </span>
                Campus-powered learning
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-[1.15] text-[var(--text)] md:text-5xl lg:text-6xl">
                Trade skills.{" "}
                <span className="amber-text-gradient inline-flex items-center gap-2">
                  Learn together.
                  <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-[#1dbf73] animate-float hidden md:inline-block" />
                </span>
              </h1>

              <p className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base leading-7 text-[var(--muted)] md:text-lg">
                SkillSwap helps students teach what they know, learn from their
                peers, and grow through a simple token-based campus community.
              </p>

              {/* CTAs */}
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
                      className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-6 py-3.5 text-sm font-semibold text-[var(--text)] transition-all hover:border-[#1dbf73]/40 hover:text-[#1dbf73] hover:shadow-md"
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
                      className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-6 py-3.5 text-sm font-semibold text-[var(--text)] transition-all hover:border-[#1dbf73]/40 hover:text-[#1dbf73] hover:shadow-md"
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
                      className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-6 py-3.5 text-sm font-semibold text-[var(--text)] transition-all hover:border-[#1dbf73]/40 hover:text-[#1dbf73] hover:shadow-md group"
                    >
                      Browse Tasks{" "}
                      <FaArrowRight className="inline-block ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </>
                )}
              </div>

              {/* Social Proof Avatar Strip */}
              <div className="mt-6 sm:mt-7 flex flex-wrap justify-center gap-4 lg:justify-start items-center">
                <div className="flex items-center -space-x-2.5">
                  {avatars.map((src, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-[var(--surface-strong)] overflow-hidden ring-1 ring-[#1dbf73]/20 bg-[#1dbf73]/10"
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                  <div className="h-8 w-8 rounded-full border-2 border-[var(--surface-strong)] bg-[#1dbf73] text-white flex items-center justify-center text-[10px] font-black ring-1 ring-[#1dbf73]/20">
                    +
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span><strong className="text-[var(--text)]">3,800+</strong> campus learners</span>
                </div>
              </div>

              {/* Category Pills */}
              <div className="mt-6 sm:mt-7 flex flex-wrap justify-center gap-2 sm:gap-2.5 lg:justify-start">
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
                      className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold text-[var(--muted)] transition-all duration-200 hover:border-[#1dbf73]/40 hover:text-[#1dbf73] hover:scale-105 hover:shadow-sm cursor-pointer group"
                    >
                      <CategoryIcon className="h-3.5 w-3.5 text-[#1dbf73] group-hover:rotate-12 transition-transform" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right: Live Workspace Card */}
            <div className="rounded-[1.5rem] sm:rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-4 sm:p-5 shadow-2xl transition-all duration-300 hover:border-[#1dbf73]/30 fade-in-up-2">
              <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#1dbf73] font-bold flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 animate-spin" style={{ animationDuration: "6s" }} />
                      Live Workspace
                    </p>
                    <h2 className="mt-1 text-base font-bold text-[var(--text)]">
                      Project Delivery Metrics
                    </h2>
                  </div>
                  <div className="rounded-full bg-emerald-500/12 border border-emerald-500/25 px-2.5 py-1 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Active
                  </div>
                </div>

                {/* Task Rows */}
                <div className="space-y-2.5">
                  {taskRows.map(([title, desc, budget, status]) => (
                    <Link
                      key={title}
                      href="/browse-task"
                      className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-3 transition-all duration-200 hover:border-[#1dbf73]/35 hover:-translate-y-0.5 cursor-pointer group"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--text)] group-hover:text-[#1dbf73] transition-colors truncate">
                          {title}
                        </p>
                        <p className="text-xs text-[var(--muted)] truncate">{desc}</p>
                      </div>
                      <div className="text-right ml-3 shrink-0">
                        <span className="block text-xs font-bold text-[#1dbf73]">
                          {budget}
                        </span>
                        <span
                          className={`text-[10px] font-bold inline-flex items-center gap-1 rounded-full border px-2 py-0.5 mt-0.5 ${statusStyles[status]}`}
                        >
                          {status === "Completed" && <CheckCircle2 className="h-2.5 w-2.5" />}
                          {status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trust Signals */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--muted)]">
                <div className="flex items-center gap-1.5 hover:text-[var(--text)] transition hover:scale-105 cursor-pointer">
                  <FaGoogle className="text-sm text-[#1dbf73]" />{" "}
                  <span className="font-semibold">Google</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-[var(--text)] transition hover:scale-105 cursor-pointer">
                  <SiMeta className="text-sm text-blue-500" />{" "}
                  <span className="font-semibold">Meta</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-[var(--text)] transition hover:scale-105 cursor-pointer">
                  <SiNetflix className="text-sm text-red-500" />{" "}
                  <span className="font-semibold">Netflix</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-[var(--text)] transition hover:scale-105 cursor-pointer">
                  <FaPaypal className="text-sm text-blue-400" />{" "}
                  <span className="font-semibold">PayPal</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-[var(--text)] transition hover:scale-105 cursor-pointer">
                  <SiPayoneer className="text-sm text-amber-500" />{" "}
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
