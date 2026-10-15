"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import FreelancerCard from "./FreelancerCard";
import { ArrowRight, Users, Sparkles } from "lucide-react";
import { getAllFreelancers } from "@/lib/api/tasks";

const defaultMentors = [
  {
    _id: "mentor-101",
    name: "Tariqul Islam",
    title: "Senior Full-Stack CS Major",
    bio: "Next.js 16, TypeScript, MongoDB & Stripe integration specialist with 30+ completed projects.",
    skills: ["Next.js", "React 19", "Node.js", "Stripe"],
    rating: "4.98",
  },
  {
    _id: "mentor-102",
    name: "Nabila Farhan",
    title: "UI/UX Design Lead",
    bio: "Figma design systems, mobile app wireframes, and high-conversion landing page creator.",
    skills: ["Figma", "UI/UX", "Tailwind CSS", "Prototyping"],
    rating: "5.0",
  },
  {
    _id: "mentor-103",
    name: "Ayman Chowdhury",
    title: "AI Engineer & Data Analyst",
    bio: "LangChain workflows, LLM fine-tuning, Python scraping, and automated pipeline engineering.",
    skills: ["Python", "OpenAI", "LangChain", "FastAPI"],
    rating: "4.95",
  },
];

export default function TopFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopFreelancers = async () => {
      try {
        const response = await getAllFreelancers({
          page: 1,
          limit: 6,
        });
        if (response?.success && Array.isArray(response.freelancers) && response.freelancers.length > 0) {
          setFreelancers(response.freelancers);
        } else if (Array.isArray(response) && response.length > 0) {
          setFreelancers(response.slice(0, 6));
        } else {
          setFreelancers(defaultMentors);
        }
      } catch (error) {
        console.error("Error fetching top freelancers, using active fallback:", error);
        setFreelancers(defaultMentors);
      } finally {
        setLoading(false);
      }
    };

    fetchTopFreelancers();
  }, []);

  return (
    <section className="py-16 md:py-20 relative overflow-hidden" id="freelancers">
      <div className="mx-auto w-[95%] lg:w-[78%]">
        {/* Section Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <div className="section-badge mb-3">
              <Users className="h-3.5 w-3.5 text-[#1dbf73]" />
              Verified Campus Talent
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[var(--text)]">
              Top Student <span className="amber-text-gradient">Freelancers</span>
            </h2>
            <p className="mt-1.5 text-sm text-[var(--muted)] max-w-md">
              Connect with vetted student developers, designers, and marketers across universities.
            </p>
          </div>
          <Link
            href="/browse-freelancer"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-1.5 transition-all duration-300 focus-visible:outline-none cursor-pointer bg-gradient-to-r from-[#1dbf73] to-[#10b981] text-white shadow-[0_4px_20px_rgba(29,191,115,0.35)] hover:shadow-[0_8px_28px_rgba(29,191,115,0.5)] hover:scale-105 active:scale-95 pl-5 pr-1.5 py-2 text-xs sm:text-sm font-bold shrink-0"
          >
            <span className="pr-2">Browse All Freelancers</span>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#1dbf73] transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel rounded-[2rem] p-6 space-y-4 skeleton-shimmer">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-[var(--border)]" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-1/2 bg-[var(--border)] rounded-md" />
                    <div className="h-3 w-1/3 bg-[var(--border)] rounded-md" />
                  </div>
                </div>
                <div className="h-8 w-full bg-[var(--border)]/60 rounded-xl" />
                <div className="flex gap-2">
                  <div className="h-5 w-14 bg-[var(--border)] rounded-full" />
                  <div className="h-5 w-14 bg-[var(--border)] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancers.map((freelancer) => (
              <FreelancerCard key={freelancer._id || freelancer.id} freelancer={freelancer} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
