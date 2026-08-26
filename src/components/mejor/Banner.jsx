"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { FaGoogle, FaPaypal, FaArrowRight } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { SiMeta, SiNetflix, SiPayoneer } from "react-icons/si";

const Banner = () => {
  const { data: session } = authClient.useSession();

  const categories = [
    "Website Development",
    "Product Design",
    "UGC & Video",
    "Marketing",
    "Brand Strategy",
    "AI Automation",
  ];

  return (
    <section className="relative overflow-hidden py-10 md:py-16">
      <div className="absolute inset-0">
        <div className="bg-grid-pattern absolute inset-0 opacity-40" />
        <div className="absolute left-1/4 top-10 h-[28rem] w-[28rem] rounded-full bg-amber-500/15 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 h-[24rem] w-[24rem] rounded-full bg-emerald-500/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto w-[95%] lg:w-[78%]">
        <div className="glass-panel overflow-hidden rounded-[2.5rem] p-6 md:p-12 lg:p-16 transition-all duration-300">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="text-center lg:text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 backdrop-blur">
                <span>✨</span> The modern freelance platform
              </div>

              <h1 className="text-4xl font-black tracking-tight leading-[1.15] text-[var(--text)] md:text-5xl lg:text-6xl">
                Get your tasks done by{" "}
                <span className="amber-text-gradient">skilled freelancers</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
                SkillSwap connects clients with skilled specialists for micro-tasks and full-scale engineering. Post, propose, pay — all in one seamless platform.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                {session?.user && session.user.role === "client" && (
                  <>
                    <Link
                      href="/dashboard/client/tasks/post-task"
                      className="amber-gradient amber-glow inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Post a Task <FaArrowRight className="h-3.5 w-3.5" />
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
                      className="amber-gradient amber-glow inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Browse Tasks <FaArrowRight className="h-3.5 w-3.5" />
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
                      className="amber-gradient amber-glow inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Post a Task <FaArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href="/browse-task"
                      className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-6 py-3.5 text-sm font-semibold text-[var(--text)] transition hover:border-amber-500/40 hover:text-amber-400"
                    >
                      Browse Tasks <FaArrowRight className="inline-block ml-1 h-3 w-3" />
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-2.5 lg:justify-start">
                {categories.map((item) => {
                  const categoryQuery = item.includes("Development")
                    ? "Development"
                    : item.includes("Design")
                    ? "Design"
                    : item.includes("Marketing")
                    ? "Marketing"
                    : "Other";
                  return (
                    <Link
                      key={item}
                      href={`/browse-task?category=${encodeURIComponent(categoryQuery)}`}
                      className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-xs font-semibold text-[var(--muted)] transition-all duration-200 hover:border-amber-500/40 hover:text-amber-400 cursor-pointer"
                    >
                      {item}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 shadow-2xl">
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-amber-400 font-bold">
                      Live Workspace
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-[var(--text)]">
                      Project Delivery Metrics
                    </h2>
                  </div>
                  <div className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                    ● Active Now
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    ["Software Development", "Full-Stack Task", "$450 Budget", "Open"],
                    ["Brand Design Sprint", "UI/UX Identity", "$280 Budget", "In Review"],
                    ["Stripe Payment Engine", "Milestone Released", "$600 Secured", "Completed"],
                  ].map(([title, desc, budget, status]) => (
                    <Link
                      key={title}
                      href="/browse-task"
                      className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-3.5 transition hover:border-amber-500/30 block cursor-pointer"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
                        <p className="text-xs text-[var(--muted)]">{desc}</p>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-bold text-amber-400">{budget}</span>
                        <span className="text-[10px] text-emerald-400 font-semibold">{status}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-sm text-[var(--muted)]">
                <div className="flex items-center gap-1.5 hover:text-[var(--text)] transition">
                  <FaGoogle className="text-base" /> <span className="font-semibold">Google</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-[var(--text)] transition">
                  <SiMeta className="text-base" /> <span className="font-semibold">Meta</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-[var(--text)] transition">
                  <SiNetflix className="text-base" /> <span className="font-semibold">Netflix</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-[var(--text)] transition">
                  <FaPaypal className="text-base" /> <span className="font-semibold">PayPal</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-[var(--text)] transition">
                  <SiPayoneer className="text-base" /> <span className="font-semibold">Payoneer</span>
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