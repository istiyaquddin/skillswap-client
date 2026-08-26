"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import FreelancerCard from "./FreelancerCard";
import { Loader2, ArrowRight } from "lucide-react";
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
    <section className="py-12 bg-current/2">
      <div className="mx-auto w-[95%] lg:w-[76%]">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--accent)]">
              Top Performers
            </span>
            <h2 className="mt-1 text-3xl font-black text-[var(--text)]">
              Top Freelancers
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Connect with verified experts and talented professionals for your next project.
            </p>
          </div>
          <Link
            href="/browse-freelancer"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] hover:underline"
          >
            Browse All Freelancers <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
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
