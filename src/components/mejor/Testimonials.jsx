"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Star,
  ThumbsUp,
  CheckCircle2,
  Quote,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Alex Rivera",
    role: "Product Manager",
    company: "DevSync Global",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    comment:
      "SkillSwap completely changed how we build MVPs. Finding elite Full-Stack talent took under 48 hours — with escrow protection so we never had to worry about funds.",
    rating: 5,
    helpfulCount: 24,
    voted: false,
    tag: "Client",
    tagColor: "text-[#1dbf73] border-[#1dbf73]/30 bg-[#1dbf73]/10",
  },
  {
    id: 2,
    name: "Mahima Hasan",
    role: "UI/UX Specialist",
    company: "Freelancer",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    comment:
      "The milestone payment system is a game-changer. I get paid the moment a client approves my deliverable — no chasing invoices, no delays. This is how freelancing should work.",
    rating: 5,
    helpfulCount: 42,
    voted: false,
    tag: "Freelancer",
    tagColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
  {
    id: 3,
    name: "Marcus Sterling",
    role: "Brand Operations Lead",
    company: "Vortex Media",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    comment:
      "Portfolio credentials are verified, bids come in fast, and the platform feels premium. We completed our 4K video sprint 3 days ahead of schedule.",
    rating: 5,
    helpfulCount: 18,
    voted: false,
    tag: "Client",
    tagColor: "text-[#1dbf73] border-[#1dbf73]/30 bg-[#1dbf73]/10",
  },
  {
    id: 4,
    name: "Sajid Ahmed",
    role: "Full-Stack Developer",
    company: "Freelancer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    comment:
      "As a student dev, I've earned more through SkillSwap in 3 months than in a full year of other platforms. Zero platform fees means I keep everything I bid.",
    rating: 5,
    helpfulCount: 31,
    voted: false,
    tag: "Freelancer",
    tagColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
  {
    id: 5,
    name: "Emily Watson",
    role: "Technical Director",
    company: "Fintech Lab Inc.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    comment:
      "Outsourcing database audits here removed 60% of our admin overhead. The escrow dispute resolution team resolved our one edge case in under 24 hours.",
    rating: 5,
    helpfulCount: 56,
    voted: false,
    tag: "Client",
    tagColor: "text-[#1dbf73] border-[#1dbf73]/30 bg-[#1dbf73]/10",
  },
];

export default function Testimonials() {
  const [reviews, setReviews] = useState(testimonials);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const [animKey, setAnimKey] = useState(0);

  const handleVote = (id) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              helpfulCount: r.voted ? r.helpfulCount - 1 : r.helpfulCount + 1,
              voted: !r.voted,
            }
          : r
      )
    );
  };

  const navigate = (dir) => {
    setDirection(dir);
    setAnimKey((k) => k + 1);
    if (dir === "prev") {
      setActiveIndex((i) => (i === 0 ? reviews.length - 1 : i - 1));
    } else {
      setActiveIndex((i) => (i === reviews.length - 1 ? 0 : i + 1));
    }
  };

  const jumpTo = (idx) => {
    setDirection(idx > activeIndex ? "right" : "left");
    setAnimKey((k) => k + 1);
    setActiveIndex(idx);
  };

  const card = reviews[activeIndex];
  const animClass = direction === "right" ? "slide-in-right" : "slide-in-left";

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/3 top-0 h-96 w-96 rounded-full bg-[#1dbf73]/8 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-blue-500/6 blur-[100px]" />
      </div>

      <div className="relative mx-auto w-[95%] lg:w-[78%]">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14 space-y-3">
          <div className="section-badge">
            <Sparkles className="w-3.5 h-3.5" /> Trusted by 3,800+ Campus Creators
          </div>
          <h2 className="section-title">
            Real Stories,{" "}
            <span className="amber-text-gradient">Real Results</span>
          </h2>
          <p className="section-desc">
            Discover how clients and freelancers are building the future of campus commerce with SkillSwap.
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="glass-panel rounded-[2.5rem] p-6 sm:p-8 md:p-10 border border-[var(--border)] relative overflow-hidden">
          {/* Decorative Quote Icon */}
          <div className="absolute top-6 right-8 opacity-[0.07] pointer-events-none">
            <Quote className="w-24 h-24 text-[#1dbf73]" />
          </div>

          <div
            key={animKey}
            className={`flex flex-col md:flex-row gap-6 md:gap-10 items-start ${animClass}`}
          >
            {/* Avatar & Identity */}
            <div className="flex flex-row md:flex-col items-center md:items-center gap-4 md:gap-3 shrink-0 md:w-36 text-center">
              <div className="relative">
                <Image
                  src={card.avatar}
                  alt={card.name}
                  width={80}
                  height={80}
                  className="h-16 w-16 md:h-20 md:w-20 rounded-2xl object-cover border-2 border-[#1dbf73]/30 shadow-lg"
                />
                <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[var(--surface-strong)] border border-[var(--border)] flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1dbf73]" />
                </span>
              </div>
              <div className="text-left md:text-center">
                <h4 className="font-extrabold text-sm text-[var(--text)]">{card.name}</h4>
                <p className="text-xs text-[var(--muted)] mt-0.5">{card.role}</p>
                <span
                  className={`mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${card.tagColor}`}
                >
                  {card.tag}
                </span>
              </div>
            </div>

            {/* Review Body */}
            <div className="flex-1 flex flex-col justify-between gap-5">
              {/* Stars */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 transition-transform hover:scale-110 ${
                      i < card.rating
                        ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]"
                        : "text-[var(--border)]"
                    }`}
                  />
                ))}
                <span className="ml-2 text-xs font-bold text-amber-400">{card.rating}.0</span>
              </div>

              {/* Comment */}
              <p className="text-base md:text-lg font-medium text-[var(--text)] leading-relaxed italic">
                &ldquo;{card.comment}&rdquo;
              </p>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--muted)] font-semibold">{card.company}</p>
                <button
                  onClick={() => handleVote(card.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95 ${
                    card.voted
                      ? "bg-[#1dbf73]/10 border-[#1dbf73]/30 text-[#1dbf73]"
                      : "bg-[var(--surface-strong)] border-[var(--border)] text-[var(--muted)] hover:border-[#1dbf73]/30 hover:text-[#1dbf73]"
                  }`}
                >
                  <ThumbsUp
                    className={`w-3.5 h-3.5 ${card.voted ? "fill-[#1dbf73]" : ""}`}
                  />
                  Helpful ({card.helpfulCount})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Row */}
        <div className="mt-6 flex items-center justify-between">
          {/* Dot Indicators */}
          <div className="flex items-center gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => jumpTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-7 h-2.5 bg-[#1dbf73] shadow-[0_0_8px_rgba(29,191,115,0.5)]"
                    : "w-2.5 h-2.5 bg-[var(--border)] hover:bg-[#1dbf73]/40"
                }`}
              />
            ))}
          </div>

          {/* Arrow Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("prev")}
              className="w-10 h-10 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] flex items-center justify-center text-[var(--muted)] hover:border-[#1dbf73] hover:text-[#1dbf73] hover:bg-[#1dbf73]/8 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("next")}
              className="w-10 h-10 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] flex items-center justify-center text-[var(--muted)] hover:border-[#1dbf73] hover:text-[#1dbf73] hover:bg-[#1dbf73]/8 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mini Testimonial Strip */}
        <div className="mt-5 grid-cols-2 md:grid-cols-4 gap-3 hidden sm:grid">
          {reviews
            .filter((_, i) => i !== activeIndex)
            .slice(0, 4)
            .map((r) => (
              <button
                key={r.id}
                onClick={() =>
                  jumpTo(reviews.findIndex((rv) => rv.id === r.id))
                }
                className="glass-panel rounded-2xl p-3 text-left border border-[var(--border)] hover:border-[#1dbf73]/40 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Image
                    src={r.avatar}
                    alt={r.name}
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full object-cover border border-[#1dbf73]/20"
                  />
                  <span className="text-xs font-bold text-[var(--text)] group-hover:text-[#1dbf73] transition-colors truncate">
                    {r.name}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--muted)] line-clamp-2 leading-relaxed">
                  {r.comment}
                </p>
              </button>
            ))}
        </div>
      </div>
    </section>
  );
}