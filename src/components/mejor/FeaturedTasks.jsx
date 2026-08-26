"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import TaskCard from "./TaskCard";
import { Loader2, ArrowRight } from "lucide-react";
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
    <section className="py-12">
      <div className="mx-auto w-[95%] lg:w-[76%]">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--accent)]">
              Latest Opportunities
            </span>
            <h2 className="mt-1 text-3xl font-black text-[var(--text)]">
              Latest Featured Tasks
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Explore open projects posted by clients and submit your proposal today.
            </p>
          </div>
          <Link
            href="/browse-task"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] hover:underline"
          >
            Explore All Tasks <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel rounded-[2rem] p-6 space-y-4 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-24 bg-amber-500/20 rounded-full" />
                  <div className="h-6 w-16 bg-emerald-500/20 rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-[var(--border)] rounded-xl" />
                <div className="h-10 w-full bg-[var(--border)]/50 rounded-xl" />
                <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
                  <div className="h-6 w-16 bg-amber-500/30 rounded-lg" />
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
