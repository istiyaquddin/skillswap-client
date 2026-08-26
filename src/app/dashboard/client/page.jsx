"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getMyTasks } from "@/lib/api/tasks";
import {
  BriefcaseBusiness,
  Clock3,
  CheckCircle2,
  Wallet,
  PlusCircle,
  ArrowUpRight,
  Orbit,
  Loader2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  FileText,
} from "lucide-react";

export default function ClientDashboard() {
  const { data: session } = authClient.useSession();
  const [tasks, setTasks] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!session?.user?.id || !session?.user?.email) return;

      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const { data: tokenData } = await authClient.token();
        const headers = {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        };

        const [tasksData, paymentRes] = await Promise.all([
          getMyTasks(session.user.id),
          fetch(`${apiUrl}/api/payment-history?email=${session.user.email}`, {
            headers,
          }).then((res) => res.json()).catch(() => ({ success: false })),
        ]);

        setTasks(tasksData || []);

        if (paymentRes?.success) {
          const total =
            typeof paymentRes.totalSpend === "object"
              ? paymentRes.totalSpend?.total
              : paymentRes.totalSpend;
          setTotalSpent(Number(total) || 0);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      setLoading(true);
      loadDashboardData();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [session]);

  const allTasksCount = tasks.length;
  const openTasksCount = tasks.filter(
    (t) => t.status?.toLowerCase() === "open",
  ).length;
  const completedTasksCount = tasks.filter(
    (t) => t.status?.toLowerCase() === "completed",
  ).length;

  const totalProposalsCount = tasks.reduce(
    (acc, t) => acc + (t.proposals?.length || 0),
    0
  );

  const recentProjects = [...tasks]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  const statCards = [
    {
      title: "Total Posted Tasks",
      value: allTasksCount,
      description: "All time task listings",
      icon: BriefcaseBusiness,
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
    {
      title: "Open for Proposals",
      value: openTasksCount,
      description: "Receiving freelancer bids",
      icon: Clock3,
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      title: "Proposals Received",
      value: totalProposalsCount,
      description: "Applicant submissions",
      icon: FileText,
      color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    },
    {
      title: "Total Escrow Spent",
      value: `$${totalSpent.toLocaleString()}`,
      description: "Secured milestone payouts",
      icon: Wallet,
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col h-96 items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Loading Client Workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6 font-sans">
      
      {/* Header & Quick Action Banner */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Client Workspace
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">
            Welcome Back, <span className="amber-text-gradient">{session?.user?.name || "Client"}</span>
          </h1>
          <p className="text-sm text-[var(--muted)] max-w-lg">
            Manage your project listings, evaluate freelancer proposals, and fund secure escrow milestones.
          </p>
        </div>

        <Link
          href="/dashboard/client/tasks/post-task"
          className="amber-gradient amber-glow inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-extrabold text-white transition-all duration-300 hover:scale-105 active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Post New Task
        </Link>
      </div>

      {/* Stats Cards Grid */}
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

      {/* Recent Projects Management Table */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-[var(--text)]">
              Your Posted Tasks
            </h2>
            <p className="text-xs text-[var(--muted)]">Review active tasks, incoming proposals, and project milestones.</p>
          </div>
          
          <Link
            href="/dashboard/client/tasks"
            className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-xs font-bold text-amber-400 hover:border-amber-400 inline-flex items-center gap-1.5 transition"
          >
            View All Tasks <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-strong)] space-y-3">
            <BriefcaseBusiness className="w-10 h-10 mx-auto text-amber-400 opacity-60" />
            <p className="text-sm font-bold text-[var(--text)]">No tasks posted yet.</p>
            <p className="text-xs text-[var(--muted)]">Post your first task to start receiving bids from verified freelancers.</p>
            <Link
              href="/dashboard/client/tasks/post-task"
              className="amber-gradient amber-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white mt-2"
            >
              <PlusCircle className="w-4 h-4" /> Post a Task Now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs font-bold uppercase tracking-wider bg-[var(--surface)] text-[var(--muted)]">
                  <th className="p-4">Project Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Budget</th>
                  <th className="p-4">Bids</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-sm font-medium">
                {recentProjects.map((project) => {
                  const isOpen = project.status?.toLowerCase() === "open";
                  const isComp = project.status?.toLowerCase() === "completed";
                  return (
                    <tr
                      key={project._id}
                      className="hover:bg-[var(--surface)] transition-colors"
                    >
                      <td className="p-4 font-bold text-[var(--text)] max-w-60 truncate">
                        {project.title}
                      </td>
                      <td className="p-4">
                        <span className="bg-[var(--surface)] px-3 py-1 rounded-full text-xs font-bold text-amber-400 border border-amber-500/20">
                          {project.category || "General"}
                        </span>
                      </td>
                      <td className="p-4 font-black text-amber-400">
                        ${project.budget}
                      </td>
                      <td className="p-4">
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                          {project.proposals?.length || 0} Proposals
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border inline-flex items-center gap-1.5 ${
                            isOpen
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : isComp
                              ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                              : "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)]"
                          }`}
                        >
                          ● {project.status || "open"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/dashboard/client/tasks/${project._id}`}
                          className="amber-gradient amber-glow inline-flex items-center gap-1.5 text-xs text-white px-4 py-2 rounded-full font-bold transition hover:scale-105"
                        >
                          Review Bids <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

