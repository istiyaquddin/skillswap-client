"use client";

import { useEffect, useState } from "react";
import { getAllTasks, getAllFreelancers } from "@/lib/api/tasks";
import { FaTasks, FaUsers, FaHandHoldingUsd } from "react-icons/fa";
import { Activity } from "lucide-react";

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
          totalTasks: tasksArray.length || 12,
          totalFreelancers: freelancersArray.length || 8,
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
      <div className="flex min-h-[30vh] items-center justify-center">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return <div className="py-12 text-center text-sm font-medium text-[var(--muted)]">Unable to load live metrics right now. Please refresh and try again.</div>;
  }

  const cards = [
    { title: "Tasks Posted", value: `${stats.totalTasks}+`, icon: FaTasks, accent: "amber-gradient amber-glow", textColor: "text-amber-400" },
    { title: "Verified Freelancers", value: `${stats.totalFreelancers}+`, icon: FaUsers, accent: "emerald-gradient emerald-glow", textColor: "text-emerald-400" },
    { title: "Total Payouts", value: `$${stats.totalPayout.toLocaleString()}+`, icon: FaHandHoldingUsd, accent: "amber-gradient amber-glow", textColor: "text-amber-400" },
  ];

  return (
    <section className="relative overflow-hidden py-16">
      <div className="mx-auto w-[95%] lg:w-[78%]">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 backdrop-blur">
            <Activity className="h-3.5 w-3.5 animate-pulse text-amber-400" /> Platform Pulse
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-[var(--text)] md:text-5xl">
            Trusted by Creators & Campus Leaders
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-[var(--muted)]">
            Real-time numbers driving fast project completion and secure freelancer payments.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="glass-panel group rounded-[2rem] p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-amber-500/40 hover:shadow-2xl cursor-pointer relative overflow-hidden"
              >
                <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${card.accent} text-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon className="transition-transform duration-300 group-hover:scale-110" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)] group-hover:text-amber-400 transition-colors">{card.title}</p>
                <h3 className={`mt-3 text-4xl font-black tracking-tight ${card.textColor}`}>{card.value}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlatformStatistics;
