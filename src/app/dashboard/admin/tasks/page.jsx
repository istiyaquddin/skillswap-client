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
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const CATEGORY_FILTERS = ["all", "design", "writing", "development", "marketing", "other"];
const STATUS_FILTERS = ["all", "open", "in progress", "completed"];

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    let isMounted = true;
    async function loadTasks() {
      try {
        const { data: tokenData } = await authClient.token();
        const res = await fetch(`${API_URL}/api/admin/tasks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${tokenData?.token}`,
          },
        });
        const data = await res.json();
        if (data.success && isMounted) setTasks(data.tasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadTasks();
    return () => { isMounted = false; };
  }, [API_URL]);

  const openDeleteModal = (task) => {
    setTaskToDelete(task);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setDeleteLoading(true);
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
        setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));
        setIsModalOpen(false);
        setTaskToDelete(null);
      } else {
        alert(data.message || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all"
        ? true
        : task?.category?.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "all"
        ? true
        : task?.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col h-96 w-full items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
          Loading Task Registry...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6 font-sans">
      {/* Header Banner */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Task Moderation
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">
            Task <span className="amber-text-gradient">Management</span>
          </h1>
          <p className="text-sm text-[var(--muted)] max-w-lg">
            Monitor, filter, and moderate all platform task postings across every category.
          </p>
        </div>
        <div className="flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-4 py-2 rounded-full text-xs font-bold text-amber-400 shrink-0">
          <Briefcase className="w-4 h-4" />
          {tasks.length} Total Tasks
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel rounded-[2rem] p-5 space-y-4">
        {/* Row 1: Search */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            <input
              type="text"
              id="task-search-input"
              placeholder="Search tasks by title..."
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
            {filteredTasks.length} / {tasks.length} results
          </span>
        </div>

        {/* Row 2: Category pills */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-3.5 h-3.5 text-[var(--muted)]" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted)]">Category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`capitalize rounded-full px-3 py-1.5 text-xs font-bold border transition-all ${
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

        {/* Row 3: Status pills */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-3.5 h-3.5 text-[var(--muted)]" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted)]">Status</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`capitalize rounded-full px-3 py-1.5 text-xs font-bold border transition-all ${
                  statusFilter === s
                    ? "amber-gradient amber-glow text-white border-transparent"
                    : "border-[var(--border)] text-[var(--muted)] bg-[var(--surface-strong)] hover:border-amber-400 hover:text-amber-400"
                }`}
              >
                {s === "all" ? "All Status" : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="glass-panel rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-strong)] text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                <th className="px-6 py-4">Task Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Proposals</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-sm font-medium">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center">
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
                  const currentStatus = task.status?.toLowerCase() || "open";
                  let statusStyles = "bg-sky-500/10 text-sky-400 border-sky-500/20";
                  if (currentStatus === "in progress")
                    statusStyles = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                  else if (currentStatus === "completed")
                    statusStyles = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

                  const createdDate = task.createdAt
                    ? new Date(task.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—";

                  return (
                    <tr
                      key={task._id}
                      className="hover:bg-[var(--surface)] transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-[var(--text)] max-w-52 truncate">
                        {task.title || "Untitled Task"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 capitalize">
                          {task.category || "General"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-[var(--muted)]">
                        {task.clientEmail || "N/A"}
                      </td>
                      <td className="px-6 py-4 font-black text-amber-400">
                        ${task.budget ? Number(task.budget).toLocaleString() : "0"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${statusStyles}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {task.status || "Open"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[var(--muted)]">
                        {Array.isArray(task.proposals)
                          ? task.proposals.length
                          : task.proposalsCount ?? 0}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-[var(--muted)]">
                        {createdDate}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openDeleteModal(task)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-400 transition-all hover:bg-rose-500/20 hover:scale-105"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
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

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel rounded-[2rem] p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10">
                <AlertTriangle className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[var(--text)]">Confirm Delete</h3>
                <p className="text-xs text-[var(--muted)]">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-sm text-[var(--muted)]">
              You are about to permanently remove{" "}
              <span className="font-bold text-[var(--text)]">
                &ldquo;{taskToDelete?.title}&rdquo;
              </span>{" "}
              from the platform. This will also remove all associated proposals.
            </p>

            <div className="flex justify-end gap-3 text-sm font-bold">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setTaskToDelete(null);
                }}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-2.5 text-[var(--muted)] hover:border-amber-400 hover:text-amber-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="rounded-full border border-rose-500/30 bg-rose-500/10 px-5 py-2.5 text-rose-400 hover:bg-rose-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
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
