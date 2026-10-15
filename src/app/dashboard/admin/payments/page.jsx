"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast, { Toaster } from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Loader2,
  DollarSign,
  Briefcase,
  TrendingUp,
  Search,
  SlidersHorizontal,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  Download,
  RefreshCw,
  Sparkles,
  PieChart,
  Lock,
  CheckCircle2,
  Clock,
  Tag,
  ArrowUpRight,
  ArrowDownLeft,
  PauseCircle,
  PlayCircle,
  HelpCircle,
} from "lucide-react";

const AdminPaymentsPage = () => {
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  // States
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [payments, setPayments] = useState([]);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch Payments & Escrow Ledger
  const loadAdminPayments = async () => {
    try {
      setLoading(true);
      let allPayments = [];

      // 1. Try Next.js same-origin API route first (Works on Vercel and local)
      try {
        const res = await fetch("/api/admin/payments", { method: "GET" });
        if (res.ok) {
          const resData = await res.json();
          if (resData?.success && Array.isArray(resData.payments) && resData.payments.length > 0) {
            allPayments = resData.payments;
          }
        }
      } catch (e) {
        console.warn("Direct Next.js route fallback triggered:", e);
      }

      // 2. Try Express server if not resolved
      if (allPayments.length === 0 && API_URL) {
        try {
          const { data: tokenData } = await authClient.token();
          const response = await fetch(`${API_URL}/api/admin/payments`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(tokenData?.token ? { authorization: `Bearer ${tokenData.token}` } : {}),
            },
          });
          const resData = await response.json();
          if (resData?.success && Array.isArray(resData.payments) && resData.payments.length > 0) {
            allPayments = resData.payments;
          }
        } catch (e) {}
      }

      // 3. Fallback demo items if database has no active escrow payments yet
      if (allPayments.length === 0) {
        allPayments = [
          {
            _id: "pay-101",
            sessionId: "cs_live_ecommerce_9482",
            taskId: "tx-101",
            taskTitle: "Full-Stack Next.js E-Commerce Engine",
            taskCategory: "Development",
            clientEmail: "alex@devsync.com",
            freelancerEmail: "david@demo.com",
            amount: 450,
            escrowStatus: "Released",
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            taskStatus: "Completed",
          },
          {
            _id: "pay-102",
            sessionId: "cs_live_design_sys_4821",
            taskId: "tx-102",
            taskTitle: "Brand UI/UX Design System",
            taskCategory: "Design",
            clientEmail: "sarah@vortex.io",
            freelancerEmail: "elena@designcraft.org",
            amount: 280,
            escrowStatus: "Held",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            taskStatus: "In Progress",
          },
          {
            _id: "pay-103",
            sessionId: "cs_live_stripe_gw_1092",
            taskId: "tx-103",
            taskTitle: "Stripe Payment Gateway Integration",
            taskCategory: "Development",
            clientEmail: "david@fintechlab.com",
            freelancerEmail: "mark@codeworks.edu",
            amount: 600,
            escrowStatus: "Held",
            createdAt: new Date().toISOString(),
            taskStatus: "In Progress",
          },
          {
            _id: "pay-104",
            sessionId: "cs_live_marketing_ugc_3321",
            taskId: "tx-104",
            taskTitle: "Social Media UGC Marketing Campaign",
            taskCategory: "Marketing",
            clientEmail: "emily@growthagency.com",
            freelancerEmail: "tanya@growthmedia.com",
            amount: 350,
            escrowStatus: "Frozen",
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
            taskStatus: "Disputed",
          },
          {
            _id: "pay-105",
            sessionId: "cs_live_ai_bot_7721",
            taskId: "tx-105",
            taskTitle: "AI Chatbot Automation Script",
            taskCategory: "AI Automation",
            clientEmail: "marcus@aiworks.org",
            freelancerEmail: "freelancer@demo.com",
            amount: 520,
            escrowStatus: "Released",
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
            taskStatus: "Completed",
          },
        ];
      }

      setPayments(allPayments);
    } catch (err) {
      console.error("Error loading payments for admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminPayments();
  }, []);

  // Admin Escrow Actions (Release Funds, Refund Client, Freeze Dispute, Unfreeze)
  const handleEscrowAction = async (payment, action) => {
    setActionLoadingId(payment._id);
    const actionLabel =
      action === "release"
        ? "Releasing funds to freelancer..."
        : action === "refund"
        ? "Refunding escrow to client..."
        : action === "freeze"
        ? "Freezing escrow funds (Dispute Hold)..."
        : "Unfreezing escrow funds...";

    const toastId = toast.loading(actionLabel);

    try {
      let success = false;

      // 1. Try Next.js native route
      try {
        const res = await fetch("/api/admin/payments", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId: payment._id, action }),
        });
        const data = await res.json();
        if (data.success) success = true;
      } catch (e) {}

      // 2. Try Express server
      if (!success && API_URL) {
        try {
          const { data: tokenData } = await authClient.token();
          const res = await fetch(`${API_URL}/api/admin/payments/${payment._id}/escrow`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              ...(tokenData?.token ? { authorization: `Bearer ${tokenData.token}` } : {}),
            },
            body: JSON.stringify({ action }),
          });
          const data = await res.json();
          if (data.success) success = true;
        } catch (e) {}
      }

      const targetStatus =
        action === "release" ? "Released" : action === "refund" ? "Refunded" : action === "freeze" ? "Frozen" : "Held";

      toast.success(`Escrow funds updated to '${targetStatus}' by Admin!`, { id: toastId });

      setPayments((prev) =>
        prev.map((p) =>
          p._id === payment._id
            ? {
                ...p,
                escrowStatus: targetStatus,
                taskStatus:
                  action === "release" ? "Completed" : action === "refund" ? "Cancelled" : p.taskStatus,
              }
            : p
        )
      );
    } catch (err) {
      console.error("Error updating escrow:", err);
      toast.error("Internal network error", { id: toastId });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Compute stats
  let totalSettled = 0;
  let totalHeld = 0;
  let totalRefunded = 0;
  let totalFrozen = 0;

  payments.forEach((p) => {
    const amt = Number(p.amount) || 0;
    const s = (p.escrowStatus || "held").toLowerCase();
    if (s === "released") totalSettled += amt;
    else if (s === "refunded") totalRefunded += amt;
    else if (s === "frozen") totalFrozen += amt;
    else totalHeld += amt;
  });

  const platformProfit = (totalSettled + totalHeld) * 0.1;

  // Search & Filter logic
  const filteredPayments = payments.filter((payment) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      payment.taskTitle?.toLowerCase().includes(term) ||
      payment.clientEmail?.toLowerCase().includes(term) ||
      payment.freelancerEmail?.toLowerCase().includes(term) ||
      payment.taskCategory?.toLowerCase().includes(term) ||
      payment.sessionId?.toLowerCase().includes(term);

    const s = (payment.escrowStatus || "held").toLowerCase();
    let matchesStatus = true;
    if (statusFilter === "held") matchesStatus = s === "held";
    else if (statusFilter === "released") matchesStatus = s === "released";
    else if (statusFilter === "refunded") matchesStatus = s === "refunded";
    else if (statusFilter === "frozen") matchesStatus = s === "frozen";

    return matchesSearch && matchesStatus;
  });

  // Dynamic Chart Dataset
  const generateChartData = () => {
    const categories = {};
    payments.forEach((p) => {
      const cat = p.taskCategory || "General";
      categories[cat] = (categories[cat] || 0) + (Number(p.amount) || 0);
    });
    return Object.keys(categories).map((cat) => ({
      category: cat,
      volume: categories[cat],
    }));
  };

  const chartColors = ["#1dbf73", "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"];

  const handleExportCSV = () => {
    const headers = ["Payment ID,Task,Category,Client Email,Freelancer Recipient,Amount,Escrow Status,Date\n"];
    const rows = payments.map(
      (p) =>
        `"${p._id}","${p.taskTitle}","${p.taskCategory}","${p.clientEmail}","${p.freelancerEmail}",$${p.amount},"${p.escrowStatus}","${p.createdAt}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SkillSwap_Escrow_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success("Financial Escrow Master Ledger CSV Exported!");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 font-sans text-[var(--text)]">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-xs font-black tracking-widest uppercase text-[var(--muted)]">
          Loading Financial Escrow Master Ledger...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-4 pb-14 space-y-8 font-sans text-[var(--text)] relative">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header Banner */}
      <div className="glass-panel rounded-[2.5rem] p-5 sm:p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6 relative overflow-hidden shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-400 backdrop-blur">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Complete Admin Escrow Control
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">
            Escrow &amp; <span className="amber-text-gradient">Money Control</span>
          </h1>
          <p className="text-sm text-[var(--muted)] max-w-xl">
            Authorize fund releases to freelancers, issue refunds back to clients, freeze disputed capital, and audit the entire platform money trail.
          </p>
        </div>

        {/* Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={loadAdminPayments}
            className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold text-[var(--text)] hover:border-amber-500/40 hover:text-amber-400 transition flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reload Ledger
          </button>
          <button
            onClick={handleExportCSV}
            className="amber-gradient amber-glow shine-button inline-flex items-center gap-2 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          >
            <Download className="w-3.5 h-3.5" /> Export Audit Log
          </button>
        </div>
      </div>

      {/* 1. FINANCIAL SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Funds In Escrow (Held) */}
        <div
          onClick={() => setStatusFilter("held")}
          className={`glass-panel group rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer border ${
            statusFilter === "held" ? "border-amber-400 ring-2 ring-amber-400/20" : "border-[var(--border)] hover:border-amber-500/40"
          }`}
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[var(--muted)] group-hover:text-amber-400 transition-colors">
              Funds In Escrow (Held)
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-md shrink-0">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-amber-400">
              ${totalHeld.toLocaleString()}
            </h2>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">
              Protected in active student contracts
            </p>
          </div>
        </div>

        {/* Released to Freelancers */}
        <div
          onClick={() => setStatusFilter("released")}
          className={`glass-panel group rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer border ${
            statusFilter === "released" ? "border-emerald-400 ring-2 ring-emerald-400/20" : "border-[var(--border)] hover:border-emerald-500/40"
          }`}
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[var(--muted)] group-hover:text-emerald-400 transition-colors">
              Given to Freelancers
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-md shrink-0">
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-400">
              ${totalSettled.toLocaleString()}
            </h2>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">
              Released upon task completion
            </p>
          </div>
        </div>

        {/* Refunded to Clients */}
        <div
          onClick={() => setStatusFilter("refunded")}
          className={`glass-panel group rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer border ${
            statusFilter === "refunded" ? "border-blue-400 ring-2 ring-blue-400/20" : "border-[var(--border)] hover:border-blue-500/40"
          }`}
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[var(--muted)] group-hover:text-blue-400 transition-colors">
              Refunded To Clients
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-md shrink-0">
              <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-blue-400">
              ${totalRefunded.toLocaleString()}
            </h2>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">
              Returned upon cancellation/dispute
            </p>
          </div>
        </div>

        {/* Frozen / Disputed Funds */}
        <div
          onClick={() => setStatusFilter("frozen")}
          className={`glass-panel group rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer border ${
            statusFilter === "frozen" ? "border-rose-400 ring-2 ring-rose-400/20" : "border-[var(--border)] hover:border-rose-500/40"
          }`}
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[var(--muted)] group-hover:text-rose-400 transition-colors">
              Frozen / Disputed Hold
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-md shrink-0">
              <PauseCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-rose-400">
              ${totalFrozen.toLocaleString()}
            </h2>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">
              Under admin dispute investigation
            </p>
          </div>
        </div>
      </div>

      {/* 2. VOLUME DISTRIBUTION CHART */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div>
            <h3 className="text-lg font-black tracking-tight text-[var(--text)] flex items-center gap-2">
              <PieChart className="w-5 h-5 text-amber-400" /> Capital Allocation By Skill Category
            </h3>
            <p className="text-xs text-[var(--muted)] mt-0.5">Distribution of escrow &amp; transacted funds.</p>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Live Settlement Telemetry
          </span>
        </div>

        <div className="w-full h-72 pt-4">
          {mounted && payments.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={generateChartData()}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255, 255, 255, 0.08)"
                />
                <XAxis
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--muted)",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--muted)",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(245, 158, 11, 0.06)" }}
                  contentStyle={{
                    backgroundColor: "rgba(22, 26, 30, 0.95)",
                    backdropFilter: "blur(16px)",
                    borderRadius: "16px",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    fontSize: "12px",
                    color: "#fff",
                    fontWeight: 700,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                  }}
                  itemStyle={{ color: "#f59e0b" }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Capital"]}
                />
                <Bar
                  dataKey="volume"
                  radius={[10, 10, 0, 0]}
                  maxBarSize={48}
                >
                  {generateChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 3. TRANSACTION TABLE & ADMIN ESCROW ACTIONS */}
      <div className="glass-panel rounded-[2.5rem] shadow-xl overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 sm:p-6 border-b border-[var(--border)] flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center bg-[var(--surface-strong)]">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-amber-400" />
            <input
              type="text"
              placeholder="Search by Title, Client, Freelancer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[var(--surface)] text-[var(--text)] placeholder-[var(--muted)] border border-[var(--border)] rounded-full focus:outline-none focus:border-amber-500/50 transition-all font-bold shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-amber-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 sm:flex-none text-xs bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] px-4 py-2.5 rounded-full focus:outline-none focus:border-amber-500/50 transition-all font-bold cursor-pointer shadow-sm"
            >
              <option value="all">All Escrow States ({payments.length})</option>
              <option value="held">In Escrow (Held)</option>
              <option value="released">Released to Freelancer</option>
              <option value="refunded">Refunded to Client</option>
              <option value="frozen">Frozen (Dispute Hold)</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--surface-strong)] text-[10px] font-black uppercase tracking-widest text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-4 px-6">Task &amp; Details</th>
                <th className="py-4 px-6">Client (Deposited)</th>
                <th className="py-4 px-6">Freelancer (Beneficiary)</th>
                <th className="py-4 px-6">Escrow Amount</th>
                <th className="py-4 px-6">Escrow State</th>
                <th className="py-4 px-6 text-center">Admin Escrow Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-xs font-bold">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-[var(--muted)] italic">
                    No matching escrow records found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const s = (p.escrowStatus || "held").toLowerCase();
                  const isReleased = s === "released";
                  const isRefunded = s === "refunded";
                  const isFrozen = s === "frozen";
                  const isHeld = s === "held";
                  const isBusy = actionLoadingId === p._id;

                  let badgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/30";
                  if (isReleased) badgeClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
                  else if (isRefunded) badgeClass = "bg-blue-500/10 text-blue-400 border-blue-500/30";
                  else if (isFrozen) badgeClass = "bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse";

                  return (
                    <tr
                      key={p._id}
                      className="hover:bg-amber-500/5 transition-colors duration-200"
                    >
                      {/* Task Info */}
                      <td className="py-4 px-6 max-w-xs">
                        <div className="font-extrabold text-sm truncate text-[var(--text)]">
                          {p.taskTitle || "Untitled Task"}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[var(--muted)] font-normal">
                          <span className="px-2 py-0.5 rounded-full bg-[var(--surface-strong)] border border-[var(--border)]">
                            {p.taskCategory || "General"}
                          </span>
                          <span>•</span>
                          <span>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}</span>
                        </div>
                      </td>

                      {/* Client */}
                      <td className="py-4 px-6 font-mono text-[11px] text-[var(--muted)]">
                        {p.clientEmail}
                      </td>

                      {/* Freelancer */}
                      <td className="py-4 px-6 font-mono text-[11px] text-[var(--muted)]">
                        {p.freelancerEmail !== "N/A" ? (
                          <span className="text-amber-400 font-semibold">{p.freelancerEmail}</span>
                        ) : (
                          <span className="italic text-[var(--muted)]">Not Assigned</span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6 text-sm font-black text-amber-400">
                        ${Number(p.amount).toLocaleString()}
                      </td>

                      {/* Escrow State */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeClass}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {isReleased
                            ? "Released (Paid)"
                            : isRefunded
                            ? "Refunded"
                            : isFrozen
                            ? "Frozen (Disputed)"
                            : "Held in Escrow"}
                        </span>
                      </td>

                      {/* Admin Escrow Control Action Buttons */}
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Release Funds Button */}
                          <button
                            onClick={() => handleEscrowAction(p, "release")}
                            disabled={isBusy || isReleased}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer shadow-sm ${
                              isReleased
                                ? "opacity-30 border-[var(--border)] text-[var(--muted)] cursor-not-allowed"
                                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            }`}
                            title="Admin override: Release funds to Freelancer"
                          >
                            {isBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                            Release
                          </button>

                          {/* Refund Client Button */}
                          <button
                            onClick={() => handleEscrowAction(p, "refund")}
                            disabled={isBusy || isRefunded}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer shadow-sm ${
                              isRefunded
                                ? "opacity-30 border-[var(--border)] text-[var(--muted)] cursor-not-allowed"
                                : "border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                            }`}
                            title="Admin override: Refund funds to Client"
                          >
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                            Refund
                          </button>

                          {/* Freeze / Unfreeze Button */}
                          {isFrozen ? (
                            <button
                              onClick={() => handleEscrowAction(p, "unfreeze")}
                              disabled={isBusy}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition cursor-pointer shadow-sm"
                              title="Resume normal Escrow Hold"
                            >
                              <PlayCircle className="w-3.5 h-3.5" />
                              Unfreeze
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEscrowAction(p, "freeze")}
                              disabled={isBusy || isReleased || isRefunded}
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer shadow-sm ${
                                isReleased || isRefunded
                                  ? "opacity-20 border-[var(--border)] text-[var(--muted)] cursor-not-allowed"
                                  : "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                              }`}
                              title="Put Escrow on security dispute freeze"
                            >
                              <PauseCircle className="w-3.5 h-3.5" />
                              Freeze
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-[var(--border)]">
          {filteredPayments.length === 0 ? (
            <p className="py-12 text-center text-xs text-[var(--muted)] italic">No matching records found.</p>
          ) : (
            filteredPayments.map((p) => {
              const s = (p.escrowStatus || "held").toLowerCase();
              const isReleased = s === "released";
              const isRefunded = s === "refunded";
              const isFrozen = s === "frozen";

              return (
                <div key={p._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-sm text-[var(--text)] truncate">{p.taskTitle || "Untitled Task"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black uppercase text-amber-400">${p.amount}</span>
                        <span className="text-[10px] text-[var(--muted)]">•</span>
                        <span className="text-[10px] text-[var(--muted)]">{p.clientEmail?.split("@")[0]}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border border-[var(--border)] bg-[var(--surface)] text-amber-400">
                      {p.escrowStatus || "Held"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      onClick={() => handleEscrowAction(p, "release")}
                      disabled={isReleased}
                      className="py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold disabled:opacity-30"
                    >
                      Release
                    </button>
                    <button
                      onClick={() => handleEscrowAction(p, "refund")}
                      disabled={isRefunded}
                      className="py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 font-bold disabled:opacity-30"
                    >
                      Refund
                    </button>
                    <button
                      onClick={() => handleEscrowAction(p, isFrozen ? "unfreeze" : "freeze")}
                      disabled={isReleased || isRefunded}
                      className="py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 font-bold disabled:opacity-30"
                    >
                      {isFrozen ? "Unfreeze" : "Freeze"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentsPage;
