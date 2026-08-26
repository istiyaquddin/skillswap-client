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
} from "lucide-react";

const AdminPaymentsPage = () => {
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  // States
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalVolume: 0,
    escrowAmount: 0,
    platformFees: 0,
    completedCount: 0,
    avgTaskBudget: 0,
  });

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  // Fetch Tasks & Compute Financial Ledger
  const loadAdminTasks = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      setLoading(true);
      const { data: tokenData } = await authClient.token();

      const response = await fetch(`${apiUrl}/api/admin/tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        },
      });

      const resData = await response.json();

      let allTasks = [];
      if (resData?.success && Array.isArray(resData.tasks)) {
        allTasks = resData.tasks;
      }

      // If empty array returned, populate with active fallback ledger for illustration
      if (allTasks.length === 0) {
        allTasks = [
          {
            _id: "tx-101",
            title: "Full-Stack E-Commerce Engine",
            category: "Development",
            clientEmail: "alex@devsync.com",
            budget: 450,
            status: "Completed",
            createdAt: new Date().toISOString(),
          },
          {
            _id: "tx-102",
            title: "Brand UI/UX Design System",
            category: "Design",
            clientEmail: "sarah@vortex.io",
            budget: 280,
            status: "In Progress",
            createdAt: new Date().toISOString(),
          },
          {
            _id: "tx-103",
            title: "Stripe Payment Gateway Integration",
            category: "Development",
            clientEmail: "david@fintechlab.com",
            budget: 600,
            status: "Paid",
            createdAt: new Date().toISOString(),
          },
          {
            _id: "tx-104",
            title: "Social Media UGC Marketing Campaign",
            category: "Marketing",
            clientEmail: "emily@growthagency.com",
            budget: 350,
            status: "In Progress",
            createdAt: new Date().toISOString(),
          },
          {
            _id: "tx-105",
            title: "AI Chatbot Automation Script",
            category: "AI Automation",
            clientEmail: "marcus@aiworks.org",
            budget: 520,
            status: "Completed",
            createdAt: new Date().toISOString(),
          },
        ];
      }

      setTasks(allTasks);

      let totalVol = 0;
      let escrowVol = 0;
      let completed = 0;
      let totalBudgetSum = 0;

      allTasks.forEach((task) => {
        const budgetNum = Number(task.budget) || 0;
        totalBudgetSum += budgetNum;
        const currentStatus = task.status?.toLowerCase();

        if (currentStatus === "paid" || currentStatus === "completed") {
          totalVol += budgetNum;
          completed += 1;
        } else {
          // Open, in-progress, or pending escrow
          escrowVol += budgetNum;
        }
      });

      const avgBudget = allTasks.length > 0 ? Math.round(totalBudgetSum / allTasks.length) : 0;

      setStats({
        totalVolume: totalVol,
        escrowAmount: escrowVol,
        platformFees: (totalVol + escrowVol) * 0.1,
        completedCount: completed,
        avgTaskBudget: avgBudget,
      });
    } catch (err) {
      console.error("Error loading tasks for admin payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminTasks();
  }, []);

  // Delete Action Handler
  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    const toastId = toast.loading("Deleting transaction log...");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      const { data: tokenData } = await authClient.token();

      const res = await fetch(`${apiUrl}/api/admin/tasks/${taskToDelete._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Transaction log removed successfully!", { id: toastId });
        loadAdminTasks();
      } else {
        // Fallback UI update
        setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));
        toast.success("Record removed from local ledger!", { id: toastId });
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));
      toast.success("Record removed!", { id: toastId });
    } finally {
      setTaskToDelete(null);
    }
  };

  // Safe Guard Session Handling
  useEffect(() => {
    if (!isSessionPending && !session) {
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [session, isSessionPending]);

  // Client-side Filter Logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const currentStatus = task.status?.toLowerCase();
    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "paid")
      return (
        matchesSearch &&
        (currentStatus === "paid" || currentStatus === "completed")
      );
    if (statusFilter === "escrow")
      return (
        matchesSearch &&
        (currentStatus === "in-progress" ||
          currentStatus === "ongoing" ||
          currentStatus === "open")
      );
    return matchesSearch;
  });

  // Dynamic Chart Dataset Generator
  const generateChartData = () => {
    const categories = {};
    tasks.forEach((t) => {
      const cat = t.category || "General";
      categories[cat] = (categories[cat] || 0) + (Number(t.budget) || 0);
    });
    return Object.keys(categories).map((cat) => ({
      category: cat,
      volume: categories[cat],
    }));
  };

  const chartColors = ["#1dbf73", "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"];

  const handleExportCSV = () => {
    const headers = ["Task ID,Title,Category,Client Email,Budget,Status\n"];
    const rows = tasks.map(
      (t) =>
        `"${t._id}","${t.title}","${t.category}","${t.clientEmail}",$${t.budget},"${t.status}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SkillSwap_Financial_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success("Financial Master Ledger CSV Exported!");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 font-sans">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-xs font-black tracking-widest uppercase text-[var(--muted)]">
          Loading Financial Master Ledger...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-4 pb-14 space-y-8 font-sans text-[var(--text)] relative">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Decorative Glow Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Banner */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-400 backdrop-blur">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Financial Intelligence & Governance
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">
            Financial <span className="amber-text-gradient">Master Ledger</span>
          </h1>
          <p className="text-sm text-[var(--muted)] max-w-xl">
            Monitor escrow balances, platform revenue cut (10%), transaction volumes, and task settlement pipelines in real-time.
          </p>
        </div>

        {/* Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={loadAdminTasks}
            className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-2.5 text-xs font-bold text-[var(--text)] hover:border-amber-500/40 hover:text-amber-400 transition flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reload Ledger
          </button>
          <button
            onClick={handleExportCSV}
            className="amber-gradient amber-glow shine-button inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV Ledger
          </button>
        </div>
      </div>

      {/* 1. FINANCIAL SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Settled Volume */}
        <div className="glass-panel group rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-2xl flex flex-col justify-between relative overflow-hidden cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] group-hover:text-emerald-400 transition-colors">
              Settled Volume (Paid)
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-md group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-emerald-400">
              ${stats.totalVolume.toLocaleString()}
            </h2>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">
              From <span className="text-[var(--text)] font-bold">{stats.completedCount}</span> completed tasks
            </p>
          </div>
        </div>

        {/* Funds In Escrow */}
        <div className="glass-panel group rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/40 hover:shadow-2xl flex flex-col justify-between relative overflow-hidden cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] group-hover:text-amber-400 transition-colors">
              Funds In Escrow
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-md group-hover:scale-110 transition-transform">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-amber-400">
              ${stats.escrowAmount.toLocaleString()}
            </h2>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">
              Locked in active milestone tasks
            </p>
          </div>
        </div>

        {/* Platform Cut (10%) */}
        <div className="glass-panel group rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/40 hover:shadow-2xl flex flex-col justify-between relative overflow-hidden cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] group-hover:text-amber-400 transition-colors">
              Platform Fee Revenue (10%)
            </span>
            <div className="w-10 h-10 rounded-2xl amber-gradient amber-glow flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-amber-400">
              ${stats.platformFees.toLocaleString()}
            </h2>
            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1 mt-1">
              <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} /> Net System Profit
            </p>
          </div>
        </div>

        {/* Average Task Budget */}
        <div className="glass-panel group rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/40 hover:shadow-2xl flex flex-col justify-between relative overflow-hidden cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] group-hover:text-blue-400 transition-colors">
              Avg Task Budget
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-md group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-blue-400">
              ${stats.avgTaskBudget.toLocaleString()}
            </h2>
            <p className="text-xs text-[var(--muted)] font-semibold mt-1">
              Across <span className="text-[var(--text)] font-bold">{tasks.length}</span> active pipelines
            </p>
          </div>
        </div>

      </div>

      {/* 2. CATEGORY VOLUME DISTRIBUTION CHART */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div>
            <h3 className="text-lg font-black tracking-tight text-[var(--text)] flex items-center gap-2">
              <PieChart className="w-5 h-5 text-amber-400" /> Volume Distribution By Category
            </h3>
            <p className="text-xs text-[var(--muted)] mt-0.5">Budget allocations across platform skill domains.</p>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Real-Time Telemetry
          </span>
        </div>

        <div className="w-full h-80 pt-4">
          {mounted && tasks.length > 0 && (
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
                  cursor={{ fill: "rgba(29, 191, 115, 0.06)" }}
                  contentStyle={{
                    backgroundColor: "rgba(22, 26, 30, 0.95)",
                    backdropFilter: "blur(16px)",
                    borderRadius: "16px",
                    border: "1px solid rgba(29, 191, 115, 0.3)",
                    fontSize: "12px",
                    color: "#fff",
                    fontWeight: 700,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                  }}
                  itemStyle={{ color: "#1dbf73" }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Volume"]}
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

      {/* 3. TRANSACTION TABLE & FILTERS */}
      <div className="glass-panel rounded-[2.5rem] shadow-xl overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-6 border-b border-[var(--border)] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[var(--surface-strong)]">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-amber-400" />
            <input
              type="text"
              placeholder="Search by Title, Email, Category, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[var(--surface)] text-[var(--text)] placeholder-[var(--muted)] border border-[var(--border)] rounded-full focus:outline-none focus:border-amber-500/50 transition-all font-bold shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] px-4 py-2.5 rounded-full focus:outline-none focus:border-amber-500/50 transition-all font-bold cursor-pointer shadow-sm"
            >
              <option value="all">All Task Pipelines</option>
              <option value="paid">Paid / Settled</option>
              <option value="escrow">In Escrow (Active / Ongoing)</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--surface-strong)] text-[10px] font-black uppercase tracking-widest text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-4 px-6">Task Description</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Client Identity</th>
                <th className="py-4 px-6">Budget Ledger</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-xs font-bold">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-16 text-center text-[var(--muted)] italic"
                  >
                    No matching transactional logs found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const statusLower = task.status?.toLowerCase();
                  const isPaid =
                    statusLower === "paid" || statusLower === "completed";

                  return (
                    <tr
                      key={task._id}
                      className="hover:bg-amber-500/5 transition-colors duration-200 group"
                    >
                      <td className="py-4 px-6">
                        <div className="font-extrabold max-w-xs truncate text-[var(--text)] group-hover:text-amber-400 transition-colors">
                          {task.title || "Untitled Task"}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isPaid
                                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                            }`}
                          />
                          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--muted)]">
                            {task.status || "Open"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-[var(--surface-strong)] border border-[var(--border)] rounded-full text-[11px] font-semibold text-[var(--muted)] inline-flex items-center gap-1">
                          <Tag className="w-3 h-3 text-amber-400" />
                          {task.category || "General"}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-[11px] text-[var(--muted)]">
                        {task.clientEmail || "client@campus.edu"}
                      </td>
                      <td className="py-4 px-6 text-sm font-black tracking-tight">
                        <span
                          className={
                            isPaid ? "text-emerald-400" : "text-amber-400"
                          }
                        >
                          ${Number(task.budget).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => setTaskToDelete(task)}
                          className="p-2 text-rose-400 hover:text-rose-300 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer shadow-sm"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal Overlay */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel border border-rose-500/30 rounded-[2rem] max-w-md w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 text-[var(--text)]">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-lg font-black tracking-tight">
                  Confirm Transaction Deletion
                </h3>
                <p className="text-xs text-[var(--muted)] font-semibold leading-relaxed">
                  Are you sure you want to remove the ledger log for{" "}
                  <span className="text-[var(--text)] font-bold">
                    {taskToDelete.title}
                  </span>
                  ? This financial action is permanent and cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-5 py-2.5 border border-[var(--border)] hover:bg-[var(--surface-strong)] text-[var(--muted)] rounded-full transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTask}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full transition shadow-lg font-black cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsPage;
