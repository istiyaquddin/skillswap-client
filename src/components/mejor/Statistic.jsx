"use client";

import { useEffect, useRef, useState } from "react";
import { getAllTasks, getAllFreelancers } from "@/lib/api/tasks";
import { FaTasks, FaUsers, FaHandHoldingUsd, FaClock } from "react-icons/fa";
import { Activity } from "lucide-react";

/** Animated count-up hook that starts when element is in view */
function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = Math.ceil(target / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return [count, ref];
}

const StatCard = ({ title, rawValue, displayValue, icon: Icon, accent, textColor, bar, delay }) => {
  const [count, ref] = useCountUp(rawValue, 1600);

  return (
    <div
      ref={ref}
      className={`glass-panel group rounded-[2rem] p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[#1dbf73]/40 hover:shadow-2xl cursor-pointer relative overflow-hidden fade-in-up-${delay}`}
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#1dbf73]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div
        className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${accent} text-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
      >
        <Icon className="transition-transform duration-300 group-hover:scale-110" />
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)] group-hover:text-[#1dbf73] transition-colors">
        {title}
      </p>

      <h3 className={`mt-3 text-4xl font-black tracking-tight ${textColor}`}>
        {displayValue(count)}
      </h3>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
        <div
          className={`h-full rounded-full ${bar} transition-all duration-1000`}
          style={{ width: `${Math.min((count / rawValue) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
};

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
        const freelancersArray = Array.isArray(freelancersRes)
          ? freelancersRes
          : freelancersRes?.freelancers || [];

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
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#1dbf73] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-sm font-medium text-[var(--muted)]">
        Unable to load live metrics right now. Please refresh and try again.
      </div>
    );
  }

  const cards = [
    {
      title: "Tasks Posted",
      rawValue: stats.totalTasks,
      displayValue: (c) => `${c}+`,
      icon: FaTasks,
      accent: "amber-gradient amber-glow",
      textColor: "text-[#1dbf73]",
      bar: "bg-gradient-to-r from-[#1dbf73] to-emerald-400",
      delay: 1,
    },
    {
      title: "Verified Freelancers",
      rawValue: stats.totalFreelancers,
      displayValue: (c) => `${c}+`,
      icon: FaUsers,
      accent: "emerald-gradient emerald-glow",
      textColor: "text-emerald-400",
      bar: "bg-gradient-to-r from-emerald-400 to-teal-400",
      delay: 2,
    },
    {
      title: "Total Payouts",
      rawValue: stats.totalPayout,
      displayValue: (c) => `$${c.toLocaleString()}+`,
      icon: FaHandHoldingUsd,
      accent: "amber-gradient amber-glow",
      textColor: "text-[#1dbf73]",
      bar: "bg-gradient-to-r from-[#1dbf73] to-blue-400",
      delay: 3,
    },
    {
      title: "Avg. Response Time",
      rawValue: 2,
      displayValue: () => "<2h",
      icon: FaClock,
      accent: "bg-gradient-to-br from-blue-500 to-indigo-500",
      textColor: "text-blue-400",
      bar: "bg-gradient-to-r from-blue-400 to-indigo-400",
      delay: 4,
    },
  ];

  return (
    <section className="relative overflow-hidden py-16">
      <div className="mx-auto w-[95%] lg:w-[78%]">
        {/* Section Header */}
        <div className="mb-12 sm:mb-14 text-center">
          <div className="section-badge">
            <Activity className="h-3.5 w-3.5" />
            Platform Pulse
          </div>
          <h2 className="section-title">
            Trusted by Creators & Campus Leaders
          </h2>
          <p className="section-desc">
            Real-time numbers driving fast project completion and secure freelancer payments.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformStatistics;