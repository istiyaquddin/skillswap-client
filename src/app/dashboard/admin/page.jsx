"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  ShieldAlert,
  Loader2,
  TrendingUp,
  Activity,
  ArrowUpRight,
  PieChart as PieIcon,
  BarChart3,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { authClient } from "@/lib/auth-client";

export default function AdminDashboardOverview() {
  const [loading, setLoading] = useState(true);

  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    blocked: 0,
    client: 0,
    freelancer: 0,
  });
  const [taskStats, setTaskStats] = useState({
    total: 0,
    open: 0,
    completed: 0,
    ongoing: 0,
    totalBudget: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      try {
        const { data: tokenData } = await authClient.token();

        const requestHeaders = {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        };

        const [userRes, taskRes] = await Promise.all([
          fetch(`${apiUrl}/api/admin/users`, {
            method: "GET",
            headers: requestHeaders,
          }).then((res) => res.json()).catch(() => ({ success: false })),
          fetch(`${apiUrl}/api/admin/tasks`, {
            method: "GET",
            headers: requestHeaders,
          }).then((res) => res.json()).catch(() => ({ success: false })),
        ]);

        if (userRes.success && taskRes.success) {
          const users = userRes.users || [];
          const activeUsers = users.filter(
            (u) => u.status !== "Blocked",
          ).length;
          const blockedUsers = users.filter(
            (u) => u.status === "Blocked",
          ).length;

          const clientCount = users.filter(
            (u) => u.role?.toLowerCase() === "client",
          ).length;
          const freelancerCount = users.filter(
            (u) => u.role?.toLowerCase() === "freelancer",
          ).length;

          setUserStats({
            total: users.length,
            active: activeUsers,
            blocked: blockedUsers,
            client: clientCount,
            freelancer: freelancerCount || users.length - clientCount,
          });

          const tasks = taskRes.tasks || [];
          let completed = 0;
          let open = 0;
          let ongoing = 0;
          let budgetSum = 0;

          tasks.forEach((t) => {
            const status = t.status?.toLowerCase();
            budgetSum += Number(t.budget) || 0;

            if (status === "completed" || status === "paid") completed++;
            else if (status === "open") open++;
            else ongoing++;
          });

          setTaskStats({
            total: tasks.length,
            open,
            completed,
            ongoing,
            totalBudget: budgetSum,
          });
          setRecentActivity(tasks.slice(0, 5));
        }
      } catch (err) {
        console.error("Error loading dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-96 w-full items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Loading Admin Control Center...</p>
      </div>
    );
  }

  const moderationPieData = [
    { name: "Active Users", value: userStats.active, color: "#f59e0b" },
    { name: "Blocked", value: userStats.blocked, color: "#f43f5e" },
  ];

  const rolePieData = [
    { name: "Clients", value: userStats.client, color: "#f59e0b" },
    { name: "Freelancers", value: userStats.freelancer, color: "#10b981" },
  ];

  const taskStatusData = [
    { name: "Open", count: taskStats.open, fill: "#f59e0b" },
    { name: "Ongoing", count: taskStats.ongoing, fill: "#10b981" },
    { name: "Completed", count: taskStats.completed, fill: "#6366f1" },
  ];

  const statCards = [
    {
      title: "Total Platform Users",
      value: userStats.total,
      description: `${userStats.active} Active Profiles`,
      icon: Users,
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
    {
      title: "Market Task Listings",
      value: taskStats.total,
      description: `${taskStats.ongoing} Active In-Progress`,
      icon: Briefcase,
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      title: "Gross Budget Volume",
      value: `$${taskStats.totalBudget.toLocaleString()}`,
      description: "Across posted project budgets",
      icon: TrendingUp,
      color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    },
    {
      title: "Restricted Accounts",
      value: userStats.blocked,
      description: "Accounts flagged or blocked",
      icon: ShieldAlert,
      color: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6 font-sans">
      {/* Header Banner */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Admin Control Center
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">
            Platform <span className="amber-text-gradient">Governance</span> Portal
          </h1>
          <p className="text-sm text-[var(--muted)] max-w-lg">
            Real-time platform oversight, user moderation, transaction metrics, and ecosystem health.
          </p>
        </div>

        <div className="flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-4 py-2 rounded-full text-xs font-bold text-amber-400 shrink-0">
          <Activity className="w-4 h-4 animate-pulse text-amber-400" />
          Live Ecosystem Feed
        </div>
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

      {/* Main Chart Section: Market Activity */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
          Market Activity & Budget Projection
        </h3>
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={recentActivity.slice().reverse()}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="amberChartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                opacity={0.08}
                vertical={false}
              />
              <XAxis
                dataKey="category"
                tick={{ fill: "currentColor", opacity: 0.5, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "currentColor", opacity: 0.5, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "16px",
                  fontSize: "12px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="budget"
                stroke="#f59e0b"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#amberChartGlow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📊 3 Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Chart 1: Tasks by Status */}
        <div className="glass-panel rounded-[2rem] p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              Tasks by Status
            </h3>
          </div>

          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={taskStatusData}
                margin={{ top: 10, right: 10, left: -30, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  opacity={0.05}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "currentColor", opacity: 0.6, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "currentColor", opacity: 0.6, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(245, 158, 11, 0.05)" }}
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-[var(--muted)] text-center">
            Current lifecycle distribution of ecosystem tasks.
          </p>
        </div>

        {/* Chart 2: Users by Role */}
        <div className="glass-panel rounded-[2rem] p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              Users by Role
            </h3>
          </div>

          <div className="w-full h-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rolePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {rolePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-xl font-black tracking-tight text-[var(--text)]">
                {userStats.client + userStats.freelancer}
              </span>
              <p className="text-[9px] uppercase font-bold text-[var(--muted)] tracking-wider">
                Total Roles
              </p>
            </div>
          </div>

          <div className="space-y-1.5 font-bold">
            <div className="flex justify-between text-xs border-b border-[var(--border)] pb-1">
              <span className="text-[var(--muted)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Clients
              </span>
              <span className="text-[var(--text)]">{userStats.client}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--muted)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Freelancers
              </span>
              <span className="text-[var(--text)]">{userStats.freelancer}</span>
            </div>
          </div>
        </div>

        {/* Chart 3: User Moderation */}
        <div className="glass-panel rounded-[2rem] p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              User Moderation Ratio
            </h3>
          </div>

          <div className="w-full h-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moderationPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {moderationPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-xl font-black tracking-tight text-[var(--text)]">
                {userStats.total}
              </span>
              <p className="text-[9px] uppercase font-bold text-[var(--muted)] tracking-wider">
                Total Accounts
              </p>
            </div>
          </div>

          <div className="space-y-1.5 font-bold">
            <div className="flex justify-between text-xs border-b border-[var(--border)] pb-1">
              <span className="text-[var(--muted)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Active Users
              </span>
              <span className="text-[var(--text)]">{userStats.active}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[var(--muted)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Restricted
              </span>
              <span className="text-[var(--text)]">{userStats.blocked}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Live Deployments Table */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-[var(--text)]">
              Recent Market Tasks
            </h2>
            <p className="text-xs text-[var(--muted)]">Global task postings across the platform.</p>
          </div>
          {taskStats.total > 0 && (
            <Link
              href="/dashboard/admin/tasks"
              className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-xs font-bold text-amber-400 hover:border-amber-400 inline-flex items-center gap-1.5 transition"
            >
              View All Tasks <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-strong)] text-xs text-[var(--muted)] italic">
            No live market task logs found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs font-bold uppercase tracking-wider bg-[var(--surface)] text-[var(--muted)]">
                  <th className="p-4">Task Title</th>
                  <th className="p-4">Client Email</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-sm font-medium">
                {recentActivity.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-[var(--surface)] transition-colors"
                  >
                    <td className="p-4 font-bold text-[var(--text)] max-w-60 truncate">
                      {task.title}
                    </td>
                    <td className="p-4 font-mono text-xs text-[var(--muted)]">
                      {task.clientEmail}
                    </td>
                    <td className="p-4">
                      <span className="bg-[var(--surface)] px-3 py-1 rounded-full text-xs font-bold text-amber-400 border border-amber-500/20">
                        {task.category || "General"}
                      </span>
                    </td>
                    <td className="p-4 text-right font-black text-amber-400">
                      ${Number(task.budget).toLocaleString()} USD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

