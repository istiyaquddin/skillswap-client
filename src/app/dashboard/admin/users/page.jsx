"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import avatar from "@/assets/user.png";
import {
  Search,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  Users,
  UserCheck,
  UserX,
  Sparkles,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const ROLE_FILTERS = ["all", "client", "freelancer", "admin"];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const { data: tokenData } = await authClient.token();
        const res = await fetch(`${API_URL}/api/admin/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${tokenData?.token}`,
          },
        });
        const data = await res.json();
        if (data.success && isMounted) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [API_URL]);

  const handleToggleStatus = async (userId, currentStatus) => {
    const updatedStatus = currentStatus === "Blocked" ? "Active" : "Blocked";
    setActionLoading(userId);

    try {
      const { data: tokenData } = await authClient.token();
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify({ status: updatedStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: updatedStatus } : u))
        );
      }
    } catch (error) {
      console.error("Failed to update user status:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      roleFilter === "all"
        ? true
        : user.role?.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const totalActive = users.filter((u) => u.status !== "Blocked").length;
  const totalBlocked = users.filter((u) => u.status === "Blocked").length;

  if (loading) {
    return (
      <div className="flex flex-col h-96 w-full items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
          Loading User Registry...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6 font-sans">
      {/* Header Banner */}
      <div className="glass-panel rounded-[2.5rem] p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> User Governance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">
            User <span className="amber-text-gradient">Management</span>
          </h1>
          <p className="text-sm text-[var(--muted)] max-w-lg">
            Manage platform users, control access, block or restore accounts across the ecosystem.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className="flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-3 sm:px-4 py-2 rounded-full text-xs font-bold text-amber-400">
            <Users className="w-4 h-4" />
            {users.length} Total
          </div>
          <div className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 px-3 sm:px-4 py-2 rounded-full text-xs font-bold text-emerald-400">
            <UserCheck className="w-4 h-4" />
            {totalActive} Active
          </div>
          <div className="flex items-center gap-2 border border-rose-500/30 bg-rose-500/10 px-3 sm:px-4 py-2 rounded-full text-xs font-bold text-rose-400">
            <UserX className="w-4 h-4" />
            {totalBlocked} Blocked
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel rounded-[2rem] p-4 sm:p-5 flex flex-col md:flex-row gap-3 sm:gap-4 items-start md:items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80 max-w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input
            type="text"
            id="user-search-input"
            placeholder="Search by name or email..."
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

        {/* Role Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {ROLE_FILTERS.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`capitalize rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold border transition-all ${
                roleFilter === r
                  ? "amber-gradient amber-glow text-white border-transparent"
                  : "border-[var(--border)] text-[var(--muted)] bg-[var(--surface-strong)] hover:border-amber-400 hover:text-amber-400"
              }`}
            >
              {r === "all" ? "All" : r}
            </button>
          ))}
        </div>

        {/* Count Indicator */}
        <span className="text-xs font-semibold text-[var(--muted)] shrink-0">
          {filteredUsers.length} / {users.length} users
        </span>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-[2rem] overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-strong)] text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-sm font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="w-10 h-10 text-[var(--muted)] opacity-40" />
                      <p className="text-sm text-[var(--muted)] italic">No users found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const userStatus = user.status || "Active";
                  const isBlocked = userStatus === "Blocked";
                  const joinedDate = user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "—";
                  const isActing = actionLoading === user._id;
                  const roleColor =
                    user.role?.toLowerCase() === "admin" ? "text-indigo-400 border-indigo-500/30 bg-indigo-500/10"
                    : user.role?.toLowerCase() === "freelancer" ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                    : "text-amber-400 border-amber-500/30 bg-amber-500/10";

                  return (
                    <tr key={user._id} className="hover:bg-[var(--surface)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Image src={user.image && user.image.startsWith("http") ? user.image : avatar}
                              alt={user.name || "user"} width={40} height={40}
                              className="h-10 w-10 rounded-full border border-[var(--border)] object-cover"
                            />
                            {!isBlocked && (<span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[var(--surface)]" />)}
                          </div>
                          <div>
                            <div className="font-bold text-[var(--text)]">{user.name || "Unknown"}</div>
                            <div className="text-xs font-mono text-[var(--muted)]">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold capitalize ${roleColor}`}>
                          {user.role || "Client"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${
                          isBlocked ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isBlocked ? "bg-rose-500" : "bg-emerald-500 animate-pulse"}`} />
                          {userStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-[var(--muted)]">{joinedDate}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(user._id, userStatus)}
                          disabled={isActing}
                          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                            isBlocked ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            : "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          }`}
                        >
                          {isActing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isBlocked ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                          {isBlocked ? "Unblock" : "Block"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden divide-y divide-[var(--border)]">
          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="w-8 h-8 mx-auto text-[var(--muted)] opacity-40 mb-2" />
              <p className="text-sm text-[var(--muted)] italic">No users found.</p>
            </div>
          ) : (
            filteredUsers.map((user) => {
              const userStatus = user.status || "Active";
              const isBlocked = userStatus === "Blocked";
              const isActing = actionLoading === user._id;
              const roleColor =
                user.role?.toLowerCase() === "admin" ? "text-indigo-400 border-indigo-500/30 bg-indigo-500/10"
                : user.role?.toLowerCase() === "freelancer" ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                : "text-amber-400 border-amber-500/30 bg-amber-500/10";

              return (
                <div key={user._id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative shrink-0">
                      <Image src={user.image && user.image.startsWith("http") ? user.image : avatar}
                        alt={user.name || "user"} width={36} height={36}
                        className="h-9 w-9 rounded-full border border-[var(--border)] object-cover"
                      />
                      {!isBlocked && (<span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[var(--surface)]" />)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-[var(--text)] truncate">{user.name || "Unknown"}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize ${roleColor}`}>{user.role || "Client"}</span>
                        <span className={`text-[10px] font-bold ${isBlocked ? "text-rose-400" : "text-emerald-400"}`}>{userStatus}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(user._id, userStatus)}
                    disabled={isActing}
                    className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all disabled:opacity-50 ${
                      isBlocked ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-rose-500/30 bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {isActing ? <Loader2 className="w-3 h-3 animate-spin" /> : isBlocked ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                    {isBlocked ? "Unblock" : "Block"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
