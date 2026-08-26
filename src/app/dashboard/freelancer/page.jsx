"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getFreelancerProposals } from "@/lib/actions/actions";
import {
  FileText,
  Clock3,
  CheckCircle2,
  DollarSign,
  Search,
  ArrowUpRight,
  Orbit,
  Loader2,
  Sparkles,
  ChevronRight,
  Briefcase,
} from "lucide-react";

export default function FreelancerDashboard() {
  const { data: session } = authClient.useSession();
  const freelancerEmail = session?.user?.email;

  const [proposals, setProposals] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [earningsData, setEarningsData] = useState({ totalEarned: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!freelancerEmail) return;

    const loadDashboardData = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const { data: tokenData } = await authClient.token();
        const headers = {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        };

        const [proposalsData, projectsRes, earningsRes] = await Promise.all([
          getFreelancerProposals(freelancerEmail),
          fetch(`${apiUrl}/api/freelancer-projects?email=${freelancerEmail}`, {
            headers,
          }).then((res) => res.json()).catch(() => ({ success: false })),
          fetch(`${apiUrl}/api/freelancer-earnings?email=${freelancerEmail}`, {
            headers,
          }).then((res) => res.json()).catch(() => ({ success: false })),
        ]);

        setProposals(proposalsData || []);

        if (projectsRes?.success) {
          setActiveProjects(projectsRes.activeProjects || []);
          setCompletedProjects(projectsRes.completedProjects || []);
        }

        if (earningsRes?.success) {
          setEarningsData(earningsRes);
        }
      } catch (error) {
        console.error("Error loading freelancer dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      setLoading(true);
      loadDashboardData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [freelancerEmail]);

  const totalProposalsCount = proposals.length;
  const acceptedCount = activeProjects.length;
  const completedCount = completedProjects.length;
  const totalEarned = earningsData.totalEarned || 0;

  const statCards = [
    {
      title: "Submitted Bids",
      value: totalProposalsCount,
      description: "Proposals submitted so far",
      icon: FileText,
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
    {
      title: "Active Contracts",
      value: acceptedCount,
      description: "Tasks currently running",
      icon: Clock3,
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      title: "Completed Projects",
      value: completedCount,
      description: "Fully delivered & paid",
      icon: CheckCircle2,
      color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    },
    {
      title: "Total Net Earnings",
      value: `$${totalEarned.toLocaleString()}`,
      description: "Released from Escrow",
      icon: DollarSign,
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
  ];

  const pendingProposals = proposals
    .filter((p) => p.status?.toLowerCase() === "pending")
    .slice(0, 5);

  const recentActiveProjects = [...activeProjects].slice(0, 5);

  if (loading) {
    return (
      <div className="flex flex-col h-96 items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Loading Freelancer Workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6 font-sans">
      {/* Header Banner */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Freelancer Workspace
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">
            Welcome Back, <span className="amber-text-gradient">{session?.user?.name || "Freelancer"}</span>
          </h1>
          <p className="text-sm text-[var(--muted)] max-w-lg">
            Track active client contracts, evaluate pending bids, and monitor your earnings.
          </p>
        </div>

        <Link
          href="/browse-task"
          className="amber-gradient amber-glow inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-extrabold text-white transition-all duration-300 hover:scale-105 active:scale-95 shrink-0"
        >
          <Search className="w-4 h-4" /> Browse Open Tasks
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="glass-panel rounded-[2rem] p-6 transition-all duration-300 hover:border-amber-500/40 hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    {item.title}
                  </h3>
                  <h2 className="text-3xl font-black tracking-tight text-[var(--text)]">
                    {item.value}
                  </h2>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="mt-4 text-xs font-medium text-[var(--muted)]">{item.description}</p>
            </div>
          );
        })}
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Table 1: Active Contracts */}
        <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-[var(--text)]">
                In-Progress Contracts
              </h2>
              <p className="text-xs text-[var(--muted)]">Active projects you are working on.</p>
            </div>
            {activeProjects.length > 5 && (
              <Link
                href="/dashboard/freelancer/active-projects"
                className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3.5 py-1.5 text-xs font-bold text-amber-400 hover:border-amber-400 inline-flex items-center gap-1 transition"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {recentActiveProjects.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-strong)] text-xs text-[var(--muted)] italic">
              No active contracts running right now.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)]">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs font-bold uppercase tracking-wider bg-[var(--surface)] text-[var(--muted)]">
                    <th className="p-3.5">Project</th>
                    <th className="p-3.5">Budget</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-xs font-semibold">
                  {recentActiveProjects.map((project) => (
                    <tr
                      key={project._id}
                      className="hover:bg-[var(--surface)] transition-colors"
                    >
                      <td className="p-3.5 font-bold text-[var(--text)] max-w-45 truncate">
                        {project.title}
                      </td>
                      <td className="p-3.5 font-black text-amber-400">
                        ${project.budget}
                      </td>
                      <td className="p-3.5">
                        <span className="px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 inline-flex items-center gap-1.5">
                          <Orbit className="w-3 h-3 animate-spin text-emerald-400" /> Running
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Table 2: Pending Bids */}
        <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-[var(--text)]">
                Submitted Proposals
              </h2>
              <p className="text-xs text-[var(--muted)]">Recent bids pending client review.</p>
            </div>
            {proposals.length > 5 && (
              <Link
                href="/dashboard/freelancer/my-proposals"
                className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3.5 py-1.5 text-xs font-bold text-amber-400 hover:border-amber-400 inline-flex items-center gap-1 transition"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {pendingProposals.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-strong)] text-xs text-[var(--muted)] italic">
              No pending bids submitted.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)]">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs font-bold uppercase tracking-wider bg-[var(--surface)] text-[var(--muted)]">
                    <th className="p-3.5">Task Title</th>
                    <th className="p-3.5">Your Bid</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-xs font-semibold">
                  {pendingProposals.map((item) => (
                    <tr
                      key={item.proposalId}
                      className="hover:bg-[var(--surface)] transition-colors"
                    >
                      <td className="p-3.5 font-bold text-[var(--text)] max-w-45 truncate">
                        {item.taskTitle}
                      </td>
                      <td className="p-3.5 font-black text-amber-400">
                        ${item.proposedBudget}
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          href={`/dashboard/freelancer/my-proposals/${item.proposalId}`}
                          className="amber-gradient amber-glow inline-flex items-center gap-1 text-[11px] text-white px-3 py-1 rounded-full font-bold transition hover:scale-105"
                        >
                          Review <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

