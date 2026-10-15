"use client";

import { useState, useEffect } from "react";
import {
  Trash2,
  Loader2,
  AlertTriangle,
  Search,
  Briefcase,
  Sparkles,
  X,
  Filter,
  CheckCircle2,
  XCircle,
  Users,
  ShieldCheck,
  Clock,
  ArrowRight,
  DollarSign,
  FileText,
  Calendar,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const CATEGORY_FILTERS = ["all", "design", "writing", "development", "marketing", "other"];
const STATUS_FILTERS = ["all", "pending", "open", "in progress", "completed", "rejected"];

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Proposal moderation modal state ("get the job or not")
  const [selectedTaskForProposals, setSelectedTaskForProposals] = useState(null);
  const [moderatingProposalId, setModeratingProposalId] = useState(null);

  // Quick action loading state
  const [actionLoadingTaskId, setActionLoadingTaskId] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const loadTasks = async () => {
    try {
      setLoading(true);
      const { data: tokenData } = await authClient.token();
      const res = await fetch(`${API_URL}/api/admin/tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to load task registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [API_URL]);

  // Admin approves or rejects task post
  const handleApproveOrRejectTask = async (task, action) => {
    setActionLoadingTaskId(task._id);
    const toastId = toast.loading(`${action === "approve" ? "Approving" : "Rejecting"} task...`);

    try {
      const { data: tokenData } = await authClient.token();
      const res = await fetch(`${API_URL}/api/admin/tasks/${task._id}/approval`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(
          action === "approve"
            ? "Task approved and published live!"
            : "Task post rejected.",
          { id: toastId }
        );
        // Update local state
        setTasks((prev) =>
          prev.map((t) =>
            t._id === task._id
              ? {
                  ...t,
                  status: action === "approve" ? "open" : "rejected",
                  approvalStatus: action === "approve" ? "approved" : "rejected",
                }
              : t
          )
        );
      } else {
        toast.error(data.message || "Action failed", { id: toastId });
      }
    } catch (error) {
      console.error("Error in task approval:", error);
      toast.error("Internal network error", { id: toastId });
    } finally {
      setActionLoadingTaskId(null);
    }
  };

  // Admin moderates proposals ("get the job or not")
  const handleModerateProposal = async (proposalId, action) => {
    if (!selectedTaskForProposals) return;
    setModeratingProposalId(proposalId);
    const toastId = toast.loading(
      action === "award"
        ? "Awarding job contract to freelancer..."
        : action === "reject"
        ? "Rejecting applicant..."
        : "Revoking assignment..."
    );

    try {
      const { data: tokenData } = await authClient.token();
      const res = await fetch(
        `${API_URL}/api/admin/tasks/${selectedTaskForProposals._id}/proposals/${proposalId}/moderate`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${tokenData?.token}`,
          },
          body: JSON.stringify({ action }),
        }
      );
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Proposal updated!", { id: toastId });

        // Update selected task proposals locally
        setSelectedTaskForProposals((prev) => {
          if (!prev) return null;
          const updatedProps = (prev.proposals || []).map((p) => {
            const pIdStr = String(p.proposalId || p._id);
            if (pIdStr === String(proposalId)) {
              return {
                ...p,
                status: action === "award" ? "Accepted" : action === "reject" ? "Rejected" : "Pending",
              };
            }
            if (action === "award") {
              return { ...p, status: "Rejected" };
            }
            return p;
          });

          return {
            ...prev,
            status: action === "award" ? "Accepted" : action === "revoke" ? "open" : prev.status,
            proposals: updatedProps,
          };
        });

        // Also update main tasks list
        setTasks((prev) =>
          prev.map((t) => {
            if (t._id === selectedTaskForProposals._id) {
              const updatedProps = (t.proposals || []).map((p) => {
                const pIdStr = String(p.proposalId || p._id);
                if (pIdStr === String(proposalId)) {
                  return {
                    ...p,
                    status: action === "award" ? "Accepted" : action === "reject" ? "Rejected" : "Pending",
                  };
                }
                if (action === "award") {
                  return { ...p, status: "Rejected" };
                }
                return p;
              });

              return {
                ...t,
                status: action === "award" ? "Accepted" : action === "revoke" ? "open" : t.status,
                proposals: updatedProps,
              };
            }
            return t;
          })
        );
      } else {
        toast.error(data.message || "Moderation failed", { id: toastId });
      }
    } catch (error) {
      console.error("Error moderating proposal:", error);
      toast.error("Internal network error", { id: toastId });
    } finally {
      setModeratingProposalId(null);
    }
  };

  const openDeleteModal = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setDeleteLoading(true);
    const toastId = toast.loading("Deleting task from system...");
    try {
      const { data: tokenData } = await authClient.token();
      const res = await fetch(`${API_URL}/api/admin/tasks/${taskToDelete._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Task deleted permanently!", { id: toastId });
        setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));
        setIsDeleteModalOpen(false);
        setTaskToDelete(null);
      } else {
        toast.error(data.message || "Failed to delete task", { id: toastId });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Network error while deleting task", { id: toastId });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filter computation
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task?.clientEmail?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all"
        ? true
        : task?.category?.toLowerCase() === categoryFilter.toLowerCase();

    const taskStatus = (task?.status || "open").toLowerCase();
    let matchesStatus = true;
    if (statusFilter !== "all") {
      if (statusFilter === "pending") {
        matchesStatus = taskStatus === "pending" || taskStatus === "pending approval";
      } else {
        matchesStatus = taskStatus === statusFilter.toLowerCase();
      }
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Telemetry counts
  const pendingCount = tasks.filter((t) => {
    const s = (t.status || "open").toLowerCase();
    return s === "pending" || s === "pending approval";
  }).length;

  const openCount = tasks.filter((t) => (t.status || "").toLowerCase() === "open").length;
  const inProgressCount = tasks.filter((t) => {
    const s = (t.status || "").toLowerCase();
    return s === "in progress" || s === "accepted";
  }).length;
  const completedCount = tasks.filter((t) => (t.status || "").toLowerCase() === "completed").length;

  if (loading) {
    return (
      <div className="flex flex-col h-96 w-full items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
          Loading Task Registry &amp; Moderation Telemetry...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6 font-sans text-[var(--text)]">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header Banner */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative overflow-hidden shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Total Admin Governance
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">
            Job Posts &amp; <span className="amber-text-gradient">Moderation</span>
          </h1>
          <p className="text-sm text-[var(--muted)] max-w-xl">
            Control job posting permissions, review unapproved tasks, award or revoke freelancer contracts, and oversee all platform assignments.
          </p>
        </div>
        <div className="flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-4 py-2 rounded-full text-xs font-bold text-amber-400 shrink-0">
          <Briefcase className="w-4 h-4" />
          {tasks.length} Platform Tasks
        </div>
      </div>

      {/* Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Pending Review */}
        <div
          onClick={() => setStatusFilter("pending")}
          className={`glass-panel p-4 rounded-2xl cursor-pointer transition-all border ${
            statusFilter === "pending"
              ? "border-amber-400 ring-2 ring-amber-400/20 shadow-lg"
              : "border-[var(--border)] hover:border-amber-400/40"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">
              Awaiting Approval
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{pendingCount}</div>
          <p className="text-[11px] text-[var(--muted)] mt-1">Requires admin permission</p>
        </div>

        {/* Live / Open */}
        <div
          onClick={() => setStatusFilter("open")}
          className={`glass-panel p-4 rounded-2xl cursor-pointer transition-all border ${
            statusFilter === "open"
              ? "border-emerald-400 ring-2 ring-emerald-400/20 shadow-lg"
              : "border-[var(--border)] hover:border-emerald-400/40"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">
              Live On Campus
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{openCount}</div>
          <p className="text-[11px] text-[var(--muted)] mt-1">Accepting student proposals</p>
        </div>

        {/* In Progress */}
        <div
          onClick={() => setStatusFilter("in progress")}
          className={`glass-panel p-4 rounded-2xl cursor-pointer transition-all border ${
            statusFilter === "in progress"
              ? "border-sky-400 ring-2 ring-sky-400/20 shadow-lg"
              : "border-[var(--border)] hover:border-sky-400/40"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-sky-400">
              Active Contracts
            </span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400">{inProgressCount}</div>
          <p className="text-[11px] text-[var(--muted)] mt-1">Freelancers working now</p>
        </div>

        {/* Completed */}
        <div
          onClick={() => setStatusFilter("completed")}
          className={`glass-panel p-4 rounded-2xl cursor-pointer transition-all border ${
            statusFilter === "completed"
              ? "border-violet-400 ring-2 ring-violet-400/20 shadow-lg"
              : "border-[var(--border)] hover:border-violet-400/40"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-violet-400">
              Completed
            </span>
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-black text-violet-400">{completedCount}</div>
          <p className="text-[11px] text-[var(--muted)] mt-1">Ready for escrow release</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel rounded-[2rem] p-5 space-y-4 shadow-md">
        {/* Row 1: Search */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            <input
              type="text"
              id="task-search-input"
              placeholder="Search tasks by title or client email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[var(--border)] bg-[var(--surface-strong)] py-2.5 pl-11 pr-10 text-sm text-[var(--text)] outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 placeholder:text-[var(--muted)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-amber-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <span className="text-xs font-semibold text-[var(--muted)] shrink-0 md:ml-auto">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </span>
        </div>

        {/* Row 2: Status pills */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-3.5 h-3.5 text-[var(--muted)]" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted)]">Status Filter</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`capitalize rounded-full px-3.5 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
                  statusFilter === s
                    ? "amber-gradient amber-glow text-white border-transparent"
                    : "border-[var(--border)] text-[var(--muted)] bg-[var(--surface-strong)] hover:border-amber-400 hover:text-amber-400"
                }`}
              >
                {s === "all" ? "All Statuses" : s === "pending" ? "Pending Approval ⚠️" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Category pills */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-3.5 h-3.5 text-[var(--muted)]" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted)]">Category Filter</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`capitalize rounded-full px-3 py-1.5 text-xs font-bold border transition-all cursor-pointer ${
                  categoryFilter === c
                    ? "amber-gradient amber-glow text-white border-transparent"
                    : "border-[var(--border)] text-[var(--muted)] bg-[var(--surface-strong)] hover:border-amber-400 hover:text-amber-400"
                }`}
              >
                {c === "all" ? "All Categories" : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="glass-panel rounded-[2rem] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-strong)] text-[11px] font-black uppercase tracking-wider text-[var(--muted)]">
                <th className="px-5 py-4">Task Details</th>
                <th className="px-5 py-4">Client</th>
                <th className="px-5 py-4">Budget</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Proposals / Candidates</th>
                <th className="px-5 py-4">Post Approval Actions</th>
                <th className="px-5 py-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-xs font-medium">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Briefcase className="w-10 h-10 text-[var(--muted)] opacity-40" />
                      <p className="text-sm text-[var(--muted)] italic">
                        No tasks found matching current filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const rawStatus = (task.status || "open").toLowerCase();
                  const isPending = rawStatus === "pending" || rawStatus === "pending approval";
                  const isRejected = rawStatus === "rejected";
                  const isOpen = rawStatus === "open";
                  const isAccepted = rawStatus === "accepted" || rawStatus === "in progress";
                  const isCompleted = rawStatus === "completed";

                  let badgeStyles = "bg-sky-500/10 text-sky-400 border-sky-500/20";
                  if (isPending) badgeStyles = "bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse";
                  else if (isRejected) badgeStyles = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                  else if (isOpen) badgeStyles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                  else if (isAccepted) badgeStyles = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                  else if (isCompleted) badgeStyles = "bg-violet-500/10 text-violet-400 border-violet-500/20";

                  const proposalsCount = Array.isArray(task.proposals) ? task.proposals.length : 0;
                  const acceptedProposal = Array.isArray(task.proposals)
                    ? task.proposals.find((p) => String(p.status).toLowerCase() === "accepted")
                    : null;

                  const isBusy = actionLoadingTaskId === task._id;

                  return (
                    <tr
                      key={task._id}
                      className="hover:bg-[var(--surface)] transition-colors duration-150"
                    >
                      {/* Task Info */}
                      <td className="px-5 py-4 max-w-xs">
                        <div className="font-extrabold text-sm text-[var(--text)] line-clamp-1">
                          {task.title || "Untitled Task"}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 capitalize">
                            {task.category || "General"}
                          </span>
                          <span className="text-[10px] text-[var(--muted)]">
                            {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : ""}
                          </span>
                        </div>
                      </td>

                      {/* Client */}
                      <td className="px-5 py-4 font-mono text-[11px] text-[var(--muted)]">
                        {task.clientEmail}
                      </td>

                      {/* Budget */}
                      <td className="px-5 py-4 font-black text-amber-400 text-sm">
                        ${task.budget ? Number(task.budget).toLocaleString() : "0"}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${badgeStyles}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {isPending ? "Pending Admin Approval" : task.status}
                        </span>
                      </td>

                      {/* Proposals Moderation */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedTaskForProposals(task)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] text-xs font-bold text-[var(--text)] hover:border-amber-400 hover:text-amber-400 transition cursor-pointer shadow-sm group"
                        >
                          <Users className="w-3.5 h-3.5 text-amber-400" />
                          <span>{proposalsCount} Applicant{proposalsCount !== 1 ? "s" : ""}</span>
                          {acceptedProposal && (
                            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">
                              Awarded
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Moderation Approval Controls */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          {isPending ? (
                            <>
                              <button
                                onClick={() => handleApproveOrRejectTask(task, "approve")}
                                disabled={isBusy}
                                className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition cursor-pointer shadow-sm disabled:opacity-50"
                                title="Approve Post & Make Live to Freelancers"
                              >
                                {isBusy ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                                Approve Post
                              </button>
                              <button
                                onClick={() => handleApproveOrRejectTask(task, "reject")}
                                disabled={isBusy}
                                className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition cursor-pointer shadow-sm disabled:opacity-50"
                                title="Reject Post"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Reject
                              </button>
                            </>
                          ) : isRejected ? (
                            <button
                              onClick={() => handleApproveOrRejectTask(task, "approve")}
                              disabled={isBusy}
                              className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition cursor-pointer shadow-sm disabled:opacity-50"
                              title="Re-Approve Post"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Re-Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => handleApproveOrRejectTask(task, "reject")}
                              disabled={isBusy}
                              className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-[var(--surface-strong)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)] hover:text-rose-400 hover:border-rose-500/40 transition cursor-pointer shadow-sm"
                              title="Revoke and mark as rejected"
                            >
                              <XCircle className="w-3 h-3" />
                              Revoke Post
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Action: Delete */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => openDeleteModal(task)}
                          className="inline-flex items-center gap-1 p-2 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer shadow-sm"
                          title="Delete Task Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* PROPOSAL MODERATION MODAL ("Get the job or not") */}
      {selectedTaskForProposals && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-3xl glass-panel rounded-[2.5rem] p-6 md:p-8 space-y-6 max-h-[85vh] flex flex-col shadow-2xl border border-amber-500/30 text-[var(--text)]">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[var(--border)] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Contract Governance
                  </span>
                  <span className="text-xs text-[var(--muted)]">Task ID: {selectedTaskForProposals._id}</span>
                </div>
                <h3 className="text-xl font-black text-[var(--text)] line-clamp-1">
                  Candidate Moderation: {selectedTaskForProposals.title}
                </h3>
                <p className="text-xs text-[var(--muted)]">
                  Admin authority: Decide which student candidate gets the job or revoke previous assignments.
                </p>
              </div>
              <button
                onClick={() => setSelectedTaskForProposals(null)}
                className="p-2 rounded-full border border-[var(--border)] hover:bg-[var(--surface-strong)] text-[var(--muted)] hover:text-amber-400 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Task Info Bar */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-[var(--surface-strong)] border border-[var(--border)] text-xs">
              <div>
                <span className="text-[10px] uppercase font-black text-[var(--muted)]">Client Email</span>
                <p className="font-bold truncate text-[var(--text)]">{selectedTaskForProposals.clientEmail}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-[var(--muted)]">Project Budget</span>
                <p className="font-black text-amber-400">${selectedTaskForProposals.budget}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-[var(--muted)]">Current Status</span>
                <p className="font-bold capitalize text-[var(--text)]">{selectedTaskForProposals.status}</p>
              </div>
            </div>

            {/* Proposals List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {!selectedTaskForProposals.proposals || selectedTaskForProposals.proposals.length === 0 ? (
                <div className="py-12 text-center text-xs text-[var(--muted)] italic border border-dashed border-[var(--border)] rounded-2xl">
                  No freelancers have submitted proposals for this task yet.
                </div>
              ) : (
                selectedTaskForProposals.proposals.map((proposal, idx) => {
                  const pId = proposal.proposalId || proposal._id || `prop-${idx}`;
                  const pStatus = (proposal.status || "Pending").toLowerCase();
                  const isAccepted = pStatus === "accepted";
                  const isRejected = pStatus === "rejected";
                  const isPending = pStatus === "pending";
                  const isBusy = moderatingProposalId === pId;

                  return (
                    <div
                      key={pId}
                      className={`p-4 rounded-2xl border transition-all duration-200 ${
                        isAccepted
                          ? "border-emerald-500/40 bg-emerald-500/5 shadow-md"
                          : isRejected
                          ? "border-rose-500/20 bg-rose-500/5 opacity-70"
                          : "border-[var(--border)] bg-[var(--surface)] hover:border-amber-400/30"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[var(--text)]">
                              {proposal.freelancerEmail || proposal.email || "Freelancer"}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                isAccepted
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                  : isRejected
                                  ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                                  : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                              }`}
                            >
                              {proposal.status || "Pending"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-[var(--muted)] font-semibold">
                            <span className="flex items-center gap-1 text-amber-400 font-bold">
                              <DollarSign className="w-3.5 h-3.5" /> Bid: ${proposal.proposedBudget || selectedTaskForProposals.budget}
                            </span>
                            <span>•</span>
                            <span>Est: {proposal.estimatedDays || 5} days</span>
                            {proposal.createdAt && (
                              <>
                                <span>•</span>
                                <span>{new Date(proposal.createdAt).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Actions: Admin decides if they get the job */}
                        <div className="flex items-center gap-2 shrink-0">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleModerateProposal(pId, "award")}
                                disabled={isBusy}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/20 text-xs font-bold text-emerald-400 hover:bg-emerald-500/30 transition cursor-pointer shadow-sm disabled:opacity-50"
                                title="Admin Awards Job to this Freelancer"
                              >
                                {isBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                Award Job
                              </button>
                              <button
                                onClick={() => handleModerateProposal(pId, "reject")}
                                disabled={isBusy}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/20 text-xs font-bold text-rose-400 hover:bg-rose-500/30 transition cursor-pointer shadow-sm disabled:opacity-50"
                                title="Reject Candidate"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Reject
                              </button>
                            </>
                          )}

                          {isAccepted && (
                            <button
                              onClick={() => handleModerateProposal(pId, "revoke")}
                              disabled={isBusy}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/20 text-xs font-bold text-amber-400 hover:bg-amber-500/30 transition cursor-pointer shadow-sm disabled:opacity-50"
                              title="Revoke award and reopen task"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Revoke Award
                            </button>
                          )}

                          {isRejected && (
                            <button
                              onClick={() => handleModerateProposal(pId, "award")}
                              disabled={isBusy}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition cursor-pointer shadow-sm disabled:opacity-50"
                              title="Override and Award Job"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Override &amp; Award
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Cover Note */}
                      {proposal.coverNote && (
                        <div className="mt-2.5 pt-2 border-t border-[var(--border)] text-xs text-[var(--muted)] leading-relaxed italic bg-[var(--surface-strong)] p-2.5 rounded-xl">
                          &ldquo;{proposal.coverNote}&rdquo;
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-3 border-t border-[var(--border)]">
              <button
                onClick={() => setSelectedTaskForProposals(null)}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-6 py-2.5 text-xs font-bold text-[var(--muted)] hover:text-amber-400 transition cursor-pointer"
              >
                Close Moderation View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel rounded-[2rem] p-8 space-y-6 shadow-2xl border border-rose-500/30 text-[var(--text)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10">
                <AlertTriangle className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[var(--text)]">Confirm Delete</h3>
                <p className="text-xs text-[var(--muted)]">Admin action: permanent deletion</p>
              </div>
            </div>

            <p className="text-sm text-[var(--muted)]">
              You are about to permanently remove{" "}
              <span className="font-bold text-[var(--text)]">
                &ldquo;{taskToDelete?.title}&rdquo;
              </span>{" "}
              from the platform. This will delete the task and all associated candidate proposals.
            </p>

            <div className="flex justify-end gap-3 text-sm font-bold">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setTaskToDelete(null);
                }}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-2.5 text-[var(--muted)] hover:border-amber-400 hover:text-amber-400 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="rounded-full border border-rose-500/30 bg-rose-500/20 px-5 py-2.5 text-rose-400 hover:bg-rose-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 cursor-pointer"
              >
                {deleteLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
