"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import TaskCard from "./TaskCard";
import { ArrowRight, Briefcase } from "lucide-react";
import { getAllTasks } from "@/lib/api/tasks";

const FeaturedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedTasks = async () => {
      try {
        const response = await getAllTasks({
          page: 1,
          limit: 6,
          status: "open",
        });
        if (response?.success) {
          setTasks(response.tasks || []);
        }
      } catch (error) {
        console.error("Error fetching featured tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTasks();
  }, []);

  return (
    <section className="py-14">
      <div className="mx-auto w-[95%] lg:w-[78%]">
        {/* Section Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <div className="section-badge mb-4">
              <Briefcase className="h-3.5 w-3.5" />
              Latest Opportunities
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text)]">
              Featured Tasks
            </h2>
            <p className="mt-1.5 text-sm text-[var(--muted)] max-w-md">
              Explore open projects posted by clients and submit your proposal today.
            </p>
          </div>
          <Link
            href="/browse-task"
            className="inline-flex items-center gap-2 rounded-full border border-[#1dbf73]/30 bg-[#1dbf73]/10 px-4 py-2 text-sm font-bold text-[#1dbf73] transition-all hover:bg-[#1dbf73]/18 hover:scale-105 active:scale-95 shrink-0 group"
          >
            Explore All Tasks
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
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
        ) : tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center text-sm text-[var(--muted)]">
            No open featured tasks found at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <Link key={task._id} href={`/browse-task/${task._id}`}>
                <TaskCard task={task} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedTasks;
