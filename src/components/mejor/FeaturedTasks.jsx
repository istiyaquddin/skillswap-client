"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import TaskCard from "./TaskCard";
import { ArrowRight, Briefcase, Sparkles, Filter } from "lucide-react";
import { getAllTasks } from "@/lib/api/tasks";

const defaultFallbackTasks = [
  {
    _id: "seed-101",
    title: "Next.js 16 E-Commerce Checkout Engine with Stripe",
    description: "Build a responsive checkout flow with Stripe webhooks and MongoDB order storage.",
    category: "Development",
    budget: 450,
    deadline: "2026-11-01",
    status: "open",
    client_name: "DevSync Campus Lab",
    proposals: [1, 2, 3],
  },
  {
    _id: "seed-102",
    title: "Figma Design System & Mobile App Wireframes",
    description: "Create a complete dark/light mode mobile design system with 25+ responsive UI components.",
    category: "Design",
    budget: 320,
    deadline: "2026-11-05",
    status: "open",
    client_name: "Vortex Interactive",
    proposals: [1, 2],
  },
  {
    _id: "seed-103",
    title: "AI Chatbot Customer Support Workflow with LangChain",
    description: "Implement custom LLM prompts and vector search to answer course curriculum questions.",
    category: "AI Automation",
    budget: 500,
    deadline: "2026-11-10",
    status: "open",
    client_name: "Campus AI Research",
    proposals: [1, 2, 3, 4],
  },
  {
    _id: "seed-104",
    title: "Campus Hackathon Promotional UGC Video & TikToks",
    description: "Shoot and edit high-energy 30-second vertical videos for campus community announcements.",
    category: "Marketing",
    budget: 200,
    deadline: "2026-11-03",
    status: "open",
    client_name: "Engineering Council",
    proposals: [1],
  },
  {
    _id: "seed-105",
    title: "Python Automation Script for University Gradebook Sync",
    description: "Scrape LMS course tables and export clean CSV reports with automated email alerts.",
    category: "Development",
    budget: 280,
    deadline: "2026-11-08",
    status: "open",
    client_name: "Academic Affairs",
    proposals: [1, 2],
  },
  {
    _id: "seed-106",
    title: "Brand Identity, Pitch Deck & Social Media Graphics",
    description: "Deliver a polished pitch deck presentation and social media banners for a student startup.",
    category: "Design",
    budget: 380,
    deadline: "2026-11-12",
    status: "open",
    client_name: "Ignite Accelerator",
    proposals: [1, 2, 3],
  },
];

export default function FeaturedTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Development", "Design", "Marketing", "AI Automation"];

  useEffect(() => {
    const fetchFeaturedTasks = async () => {
      try {
        const response = await getAllTasks({
          page: 1,
          limit: 12,
          status: "open",
        });

        if (response?.success && Array.isArray(response.tasks) && response.tasks.length > 0) {
          setTasks(response.tasks);
        } else {
          setTasks(defaultFallbackTasks);
        }
      } catch (error) {
        console.error("Error fetching featured tasks, using active fallback:", error);
        setTasks(defaultFallbackTasks);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTasks();
  }, []);

  const filteredTasks = tasks.filter((t) => {
    if (activeCategory === "All") return true;
    const cat = String(t.category || "").toLowerCase();
    const target = activeCategory.toLowerCase();
    return cat.includes(target) || (target === "development" && (cat.includes("dev") || cat.includes("web")));
  });

  return (
    <section className="py-16 md:py-20 relative overflow-hidden" id="tasks">
      <div className="mx-auto w-[95%] lg:w-[78%]">
        {/* Section Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <div className="section-badge mb-3">
              <Briefcase className="h-3.5 w-3.5 text-[#1dbf73]" />
              Verified Opportunities
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[var(--text)]">
              Featured <span className="amber-text-gradient">Projects & Tasks</span>
            </h2>
            <p className="mt-1.5 text-sm text-[var(--muted)] max-w-md">
              Explore open micro-tasks with verified budgets and Stripe escrow protection.
            </p>
          </div>
          <Link
            href="/browse-task"
            className="inline-flex items-center gap-2 rounded-full border border-[#1dbf73]/30 bg-[#1dbf73]/10 px-5 py-2.5 text-xs sm:text-sm font-bold text-[#1dbf73] transition-all hover:bg-[#1dbf73]/20 hover:scale-105 active:scale-95 shrink-0 group"
          >
            Explore All Tasks
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs font-bold text-[var(--muted)] mr-2 flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5" /> Filter by:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#1dbf73] text-white shadow-sm scale-105"
                  : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[#1dbf73]/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel rounded-[2rem] p-6 space-y-4 skeleton-shimmer">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-24 bg-[var(--border)] rounded-full" />
                  <div className="h-6 w-16 bg-[var(--border)] rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-[var(--border)] rounded-xl" />
                <div className="h-10 w-full bg-[var(--border)]/60 rounded-xl" />
                <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
                  <div className="h-6 w-16 bg-[var(--border)] rounded-lg" />
                  <div className="h-4 w-20 bg-[var(--border)] rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center text-sm text-[var(--muted)]">
            No tasks found matching category &quot;{activeCategory}&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.slice(0, 6).map((task) => (
              <Link key={task._id} href={`/browse-task/${task._id}`}>
                <TaskCard task={task} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
