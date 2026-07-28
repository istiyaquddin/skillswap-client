"use client";

import { useEffect, useState } from "react";
import { getAllTasks, getAllFreelancers } from "@/lib/api/tasks";
import { FaTasks, FaUsers, FaHandHoldingUsd } from "react-icons/fa";

const PlatformStatistics = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalFreelancers: 0,
    totalPayout: 5580,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        setLoading(true);
        const [tasksRes, freelancersRes] = await Promise.all([
          getAllTasks({ limit: 1000, status: "open" }),
          getAllFreelancers({ limit: 1000 }),
        ]);

        const tasksArray = Array.isArray(tasksRes) ? tasksRes : tasksRes?.tasks || [];
        const freelancersArray = Array.isArray(freelancersRes) ? freelancersRes : freelancersRes?.freelancers || [];

        setStats((prev) => ({
          ...prev,
          totalTasks: tasksArray.length,
          totalFreelancers: freelancersArray.length,
        }));
        setError(false);
      } catch (err) {
        console.error("Error calculating metrics:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return <div className="py-12 text-center text-sm font-medium text-[var(--muted)]">Unable to load live metrics right now. Please refresh and try again.</div>;
  }

  const cards = [
    { title: "Open tasks", value: stats.totalTasks.toLocaleString(), icon: FaTasks, accent: "text-[var(--primary)]" },
    { title: "Verified freelancers", value: stats.totalFreelancers.toLocaleString(), icon: FaUsers, accent: "text-[var(--accent)]" },
    { title: "Total payout", value: `$${stats.totalPayout.toLocaleString()}`, icon: FaHandHoldingUsd, accent: "text-emerald-500" },
  ];

  return (
    <section className="relative overflow-hidden py-16">
      <div className="mx-auto w-[95%] lg:w-[76%]">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">Platform pulse</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[var(--text)] md:text-4xl">
            Trusted by a growing community of clients and creators.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--muted)]">
            Fast-moving teams use SkillSwap to find talent, ship work, and keep delivery healthy from kickoff to payment.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="glass-panel rounded-[1.5rem] p-7 text-center">
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-strong)] text-3xl ${card.accent}`}>
                  <Icon />
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--muted)]">{card.title}</p>
                <h3 className="mt-3 text-3xl font-black tracking-tight text-[var(--text)]">{card.value}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlatformStatistics;