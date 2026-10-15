"use client";

import { useState } from "react";
import {
  Code,
  Palette,
  Bot,
  Video,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";
import Link from "next/link";

const categories = [
  {
    id: "dev",
    label: "Web & Software",
    icon: Code,
    title: "Full-Stack Development & Bug Fixes",
    description:
      "Hire top CS majors for Next.js, React, Node.js, Python scripts, API integrations, and database tuning with full code reviews.",
    skills: ["Next.js", "React 19", "Express.js", "MongoDB", "PostgreSQL", "Tailwind CSS"],
    deliverable: "Production-ready Git repo + live deployed URL",
    startingFrom: "$35",
    accent: "#1dbf73",
  },
  {
    id: "design",
    label: "UI/UX & Branding",
    icon: Palette,
    title: "Figma UI/UX Systems & Visual Identities",
    description:
      "Collaborate with talented design students to create stunning design systems, mobile app wireframes, and conversion-focused landing pages.",
    skills: ["Figma", "UI/UX", "Brand Guidelines", "Illustrations", "Design Tokens"],
    deliverable: "Interactive Figma prototype + asset exports",
    startingFrom: "$30",
    accent: "#3b82f6",
  },
  {
    id: "ai",
    label: "AI Automation",
    icon: Bot,
    title: "AI Workflows & LLM Integrations",
    description:
      "Automate repetitive workflows, build AI chatbots, custom OpenAI/Claude prompts, and scraping scripts built to campus standards.",
    skills: ["OpenAI API", "LangChain", "Python", "Automation Scripts", "Data Extraction"],
    deliverable: "Tested automation script with documentation",
    startingFrom: "$45",
    accent: "#8b5cf6",
  },
  {
    id: "content",
    label: "Content & UGC",
    icon: Video,
    title: "Campus UGC Videos, Marketing & Copy",
    description:
      "Engage fellow students with relatable TikTok/Reels content, tech documentation, academic-grade research summaries, and ad copy.",
    skills: ["UGC Video", "Video Editing", "Content Writing", "Social Growth", "SEO"],
    deliverable: "High-resolution edited video with subtitles",
    startingFrom: "$25",
    accent: "#f59e0b",
  },
];

export default function FeaturesServices() {
  const [activeTab, setActiveTab] = useState("dev");
  const current = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" id="features">
      <div className="relative mx-auto w-[95%] lg:w-[78%]">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 space-y-3">
          <div className="section-badge mb-3">
            <Zap className="h-3.5 w-3.5 text-[#1dbf73]" />
            What We Offer
          </div>
          <h2 className="section-title">
            Explore Essential <span className="amber-text-gradient">Features & Services</span>
          </h2>
          <p className="section-desc">
            Everything you need to get work done, learn new technologies, and get paid securely.
          </p>
        </div>

        {/* Interactive Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#1dbf73] text-white shadow-[0_8px_20px_rgba(29,191,115,0.35)] scale-105"
                    : "glass-panel text-[var(--muted)] hover:text-[var(--text)] hover:border-[#1dbf73]/30"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Detail & Interactive Showcase Card */}
        <div className="glass-panel rounded-[2.5rem] p-6 sm:p-10 border border-[var(--border)] shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#1dbf73]/10 text-[#1dbf73] border border-[#1dbf73]/25">
                <Sparkles className="h-3.5 w-3.5" />
                Specialized Campus Service
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[var(--text)] tracking-tight">
                {current.title}
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[var(--muted)]">
                {current.description}
              </p>

              {/* Skills Tags */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Core Technologies & Tools
                </p>
                <div className="flex flex-wrap gap-2">
                  {current.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deliverable & Escrow Protection */}
              <div className="pt-4 border-t border-[var(--border)] flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text)]">
                  <ShieldCheck className="h-4 w-4 text-[#1dbf73]" />
                  <span>Stripe Escrow Milestone Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text)]">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  <span>Starting at {current.startingFrom}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/browse-task?category=${encodeURIComponent(current.label)}`}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-1.5 transition-all duration-300 focus-visible:outline-none cursor-pointer bg-gradient-to-r from-[#1dbf73] to-[#10b981] text-white shadow-[0_4px_20px_rgba(29,191,115,0.35)] hover:shadow-[0_8px_28px_rgba(29,191,115,0.5)] hover:scale-105 active:scale-95 pl-5 pr-1.5 py-2 text-xs sm:text-sm font-bold"
                >
                  <span className="pr-2">Browse {current.label} Tasks</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#1dbf73] transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Right Dynamic Live Preview Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-6 space-y-5 shadow-xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-mono text-[var(--muted)] ml-2">
                      skillswap-{current.id}.spec
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Live Verified
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                      Deliverable Requirement
                    </p>
                    <p className="text-xs font-semibold text-[var(--text)] mt-1">
                      {current.deliverable}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                        Campus Pricing Index
                      </p>
                      <p className="text-base font-black text-[#1dbf73]">
                        {current.startingFrom}{" "}
                        <span className="text-xs font-medium text-[var(--muted)]">
                          / task avg
                        </span>
                      </p>
                    </div>
                    <CheckCircle2 className="h-6 w-6 text-[#1dbf73]" />
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <Link
                    href="/dashboard/client/tasks/post-task"
                    className="block w-full py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--text)] hover:border-[#1dbf73]/40 hover:text-[#1dbf73] transition-all bg-[var(--surface)]"
                  >
                    Post a Project in {current.label}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
