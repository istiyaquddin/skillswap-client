"use client";

import React from "react";
import { BookOpen, Calendar, Clock, ArrowRight, User } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "How to Land Your First $1,000 Campus Freelance Contract",
      excerpt: "Proven strategies for positioning your GitHub projects, writing high-converting pitch notes, and securing milestone payments.",
      category: "Freelance Guide",
      date: "Aug 24, 2026",
      readTime: "5 min read",
      author: "Sarah Jenkins",
      tag: "Career",
    },
    {
      id: 2,
      title: "Understanding Escrow: How SkillSwap Protects Client & Freelancer Funds",
      excerpt: "A deep dive into automated milestone locking, instant payout settlement, and campus dispute resolution.",
      category: "Platform Updates",
      date: "Aug 20, 2026",
      readTime: "4 min read",
      author: "David Chen",
      tag: "Security",
    },
    {
      id: 3,
      title: "Top 5 In-Demand Tech Skills Companies Are Hiring Students For",
      excerpt: "From Next.js 16 Turbopack development to AI prompt engineering — discover which technical skills yield the highest hourly rates.",
      category: "Market Insights",
      date: "Aug 15, 2026",
      readTime: "6 min read",
      author: "Maya Patel",
      tag: "Trends",
    },
    {
      id: 4,
      title: "Balancing Coursework and Client Projects: Time Management Secrets",
      excerpt: "Tips from top-rated student creators on managing assignment deadlines while delivering production-ready freelance work.",
      category: "Student Life",
      date: "Aug 10, 2026",
      readTime: "4 min read",
      author: "Marcus Vance",
      tag: "Productivity",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16 space-y-12 font-sans text-[var(--text)]">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-400">
          <BookOpen className="w-4 h-4" /> SkillSwap Campus Journal
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text)]">
          Insights, Stories & <span className="amber-text-gradient">Career Guides</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--muted)] font-medium">
          Expert articles on campus freelancing, escrow protection, skill monetization, and tech career growth.
        </p>
      </div>

      {/* Featured Post */}
      <div className="glass-panel rounded-[3rem] p-8 md:p-10 space-y-4 border border-[var(--border)] relative overflow-hidden group hover:border-amber-500/40 transition">
        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Featured Story
        </span>
        <h2 className="text-2xl md:text-4xl font-black text-[var(--text)] group-hover:text-amber-400 transition leading-tight">
          {posts[0].title}
        </h2>
        <p className="text-sm text-[var(--muted)] leading-relaxed font-medium max-w-3xl">
          {posts[0].excerpt}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--muted)] font-bold">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-amber-400" /> {posts[0].author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {posts[0].date}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {posts[0].readTime}</span>
          </div>
          <button className="amber-gradient text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1">
            Read Article <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid Posts */}
      <div className="grid md:grid-cols-3 gap-6">
        {posts.slice(1).map((post) => (
          <div
            key={post.id}
            className="glass-panel rounded-[2.5rem] p-6 space-y-4 border border-[var(--border)] flex flex-col justify-between hover:border-amber-500/40 transition group"
          >
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-block">
                {post.category}
              </span>
              <h3 className="text-lg font-bold text-[var(--text)] group-hover:text-amber-400 transition leading-snug">
                {post.title}
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed font-medium line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--muted)] font-bold">
              <span>{post.date}</span>
              <span className="text-amber-400">{post.readTime}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
