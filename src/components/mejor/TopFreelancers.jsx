"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import FreelancerCard from "./FreelancerCard";
import { ArrowRight, Users } from "lucide-react";
import { getAllFreelancers } from "@/lib/api/tasks";

const TopFreelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopFreelancers = async () => {
      try {
        const response = await getAllFreelancers({
          page: 1,
          limit: 6,
        });
        if (response?.success) {
          setFreelancers(response.freelancers || []);
        } else if (Array.isArray(response)) {
          setFreelancers(response.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching top freelancers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopFreelancers();
  }, []);

  return (
    <section className="py-14">
      <div className="mx-auto w-[95%] lg:w-[78%]">
        {/* Section Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <div className="section-badge mb-4">
              <Users className="h-3.5 w-3.5" />
              Top Performers
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text)]">
              Top Freelancers
            </h2>
            <p className="mt-1.5 text-sm text-[var(--muted)] max-w-md">
              Connect with verified experts and talented professionals for your next project.
            </p>
          </div>
          <Link
            href="/browse-freelancer"
            className="inline-flex items-center gap-2 rounded-full border border-[#1dbf73]/30 bg-[#1dbf73]/10 px-4 py-2 text-sm font-bold text-[#1dbf73] transition-all hover:bg-[#1dbf73]/18 hover:scale-105 active:scale-95 shrink-0 group"
          >
            Browse All Freelancers
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
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
        ) : freelancers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center text-sm text-[var(--muted)]">
            No freelancers listed at the moment.
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
};

export default TopFreelancers;
