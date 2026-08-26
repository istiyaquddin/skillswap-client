"use client";

import { authClient } from "@/lib/auth-client";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Loader2,
  DollarSign,
  TrendingUp,
  Sparkles,
  Receipt,
  BarChart3,
} from "lucide-react";

const FreelancerEarningsPage = () => {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const freelancerEmail = session?.user?.email;

  const [data, setData] = useState({
    totalEarned: 0,
    avgEarned: 0,
    paymentCount: 0,
    monthlyChartData: [],
    history: [],
  });

  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  useEffect(() => {
    if (!freelancerEmail) return;

    const loadEarnings = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      try {
        const { data: tokenData } = await authClient.token();
        const res = await fetch(
          `${apiUrl}/api/freelancer-earnings?email=${freelancerEmail}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${tokenData?.token}`,
            },
          }
        );
        const resData = await res.json();
        if (resData.success) setData(resData);
      } catch (err) {
        console.error("Error loading earnings:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      setLoading(true);
      loadEarnings();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [freelancerEmail]);

  useEffect(() => {
    if (!isSessionPending && !session) {
      const timeoutId = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timeoutId);
    }
  }, [session, isSessionPending]);

  if (loading) {
    return (
      <div className="flex flex-col h-96 w-full items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
          Loading Earnings...
        </p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Earned",
      value: `$${(data.totalEarned || 0).toLocaleString()}`,
      sub: `From ${data.paymentCount || 0} payments`,
      icon: DollarSign,
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
    {
      label: "Average Per Task",
      value: `$${(data.avgEarned || 0).toLocaleString()}`,
      sub: "Average earning per completed task",
      icon: TrendingUp,
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      label: "Total Payouts",
      value: data.paymentCount || 0,
      sub: "Completed payment milestones",
      icon: Receipt,
      color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6 font-sans">
      {/* Header Banner */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Earnings Analytics
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">
            My <span className="amber-text-gradient">Earnings</span>
          </h1>
          <p className="text-sm text-[var(--muted)] max-w-lg">
            Monitor your payouts, track average milestone metrics, and view monthly earning analytics.
          </p>
        </div>
        <div className="flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-4 py-2 rounded-full text-xs font-bold text-amber-400 shrink-0">
          <BarChart3 className="w-4 h-4" />
          {data.paymentCount || 0} Payouts
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="glass-panel rounded-[2rem] p-6 transition-all duration-300 hover:border-amber-500/40 hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    {card.label}
                  </h3>
                  <h2 className="text-3xl font-black tracking-tight text-[var(--text)]">
                    {card.value}
                  </h2>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${card.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="mt-4 text-xs font-medium text-[var(--muted)]">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Monthly Earnings Chart */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            Monthly Earnings
          </h3>
        </div>
        <div className="w-full h-72">
          {mounted && data.monthlyChartData?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.monthlyChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  opacity={0.06}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "currentColor", opacity: 0.4, fontSize: 11, fontWeight: 600 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "currentColor", opacity: 0.4, fontSize: 11, fontWeight: 600 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(245, 158, 11, 0.05)" }}
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    borderRadius: "16px",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                  formatter={(value) => [`$${value}`, "Earnings"]}
                />
                <Bar dataKey="earnings" fill="#f59e0b" radius={[8, 8, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-[var(--muted)] italic">No monthly data available yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="glass-panel rounded-[2rem] overflow-hidden">
        <div className="px-6 py-5 border-b border-[var(--border)] flex items-center gap-3">
          <Receipt className="w-4 h-4 text-amber-400" />
          <h2 className="text-xl font-extrabold tracking-tight text-[var(--text)]">
            Transaction History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-strong)] text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                <th className="py-4 px-6">Task</th>
                <th className="py-4 px-6">Client</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-sm font-medium">
              {!data.history || data.history.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Receipt className="w-10 h-10 text-[var(--muted)] opacity-40" />
                      <p className="text-sm text-[var(--muted)] italic">No transactions found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.history.map((tx, index) => (
                  <tr
                    key={`${tx._id}-${index}`}
                    className="hover:bg-[var(--surface)] transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-[var(--text)] max-w-xs truncate">
                      {tx.taskTitle || "Untitled Task"}
                    </td>
                    <td className="py-4 px-6 text-xs font-mono text-[var(--muted)]">
                      {tx.clientEmail || "N/A"}
                    </td>
                    <td className="py-4 px-6 font-black text-emerald-400">
                      +${tx.amount || 0}
                    </td>
                    <td className="py-4 px-6 text-xs font-mono text-[var(--muted)]">
                      {tx.createdAt
                        ? new Date(tx.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td
                      className="py-4 px-6 font-mono text-xs text-[var(--muted)] max-w-36 truncate"
                      title={tx.sessionId}
                    >
                      {tx.sessionId || "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FreelancerEarningsPage;
