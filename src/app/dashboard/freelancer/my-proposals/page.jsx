"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getFreelancerProposals } from "@/lib/actions/actions";
import {
  Calendar,
  DollarSign,
  Clock,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  Link2,
  Loader2,
} from "lucide-react";
import Link from "next/link";

const MyProposalsPage = () => {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const [proposals, setProposals] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (authLoading || !session?.user?.email) return;

    const fetchProposals = async () => {
      try {
        setDataLoading(true);
        const data = await getFreelancerProposals(session.user.email);
        setProposals(data);
      } catch (error) {
        console.error("Failed to fetch proposals:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchProposals();
  }, [session?.user?.email, authLoading]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };
      case "rejected":
        return {
          bg: "bg-rose-500/10 border-rose-500/20 text-rose-500",
          icon: <XCircle className="w-3.5 h-3.5" />,
        };
      default:
        return {
          bg: "bg-amber-500/10 border-amber-500/20 text-amber-500",
          icon: <Clock className="w-3.5 h-3.5" />,
        };
    }
  };

  if (authLoading || dataLoading) {
    return (
      <div className="flex flex-col h-96 w-full items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
          Loading Proposals...
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="glass-panel rounded-[2rem] max-w-md mx-auto mt-10 p-8 text-center space-y-4">
        <AlertCircle className="w-8 h-8 mx-auto text-amber-400" />
        <p className="text-sm text-[var(--muted)] font-medium">
          Please login to view your submitted proposals.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-6 font-sans">
      {/* Header Banner */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> My Proposals
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">
            Submitted <span className="amber-text-gradient">Proposals</span>
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Track your bids, monitor client responses, and review cover notes.
          </p>
        </div>
        <div className="flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-4 py-2 rounded-full text-xs font-bold text-amber-400 shrink-0">
          <FileText className="w-4 h-4" />
          {proposals.length} Proposals
        </div>
      </div>

      {proposals.length > 0 ? (
        <div className="grid grid-cols-1 gap-5">
          {proposals.map((item) => {
            const statusStyle = getStatusStyles(item.status);
            return (
              <div
                key={item.proposalId}
                className="group glass-panel relative rounded-[2rem] p-5 md:p-6 transition duration-300 hover:border-amber-500/40 hover:scale-[1.01] flex flex-col justify-between overflow-hidden"
              >
                {/* কার্ডের ক্লিকেবল লিংক */}
                <Link
                  href={`/dashboard/freelancer/my-proposals/${item.proposalId}`}
                  className="absolute inset-0 z-10"
                />


                <div className="absolute top-5 right-5 opacity-0 scale-75 group-hover:opacity-60 group-hover:scale-100 transition duration-300 pointer-events-none z-20 w-8 h-8 rounded-lg bg-current/5 border border-current/10 flex items-center justify-center">
                  <Link2 className="w-4 h-4 text-inherit" />
                </div>


                
                
                <div className="absolute -inset-px bg-gradient-to-r from-transparent via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />

                <div className="space-y-4 relative z-0">
                  {/* টপ কন্টেন্ট: টাইটেল ও স্ট্যাটাস ব্যাজ */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1 max-w-3xl">
                      <div className="text-base md:text-lg font-bold text-[var(--text)] group-hover:text-amber-400 transition flex items-center gap-1.5">
                        {item.taskTitle}
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition text-inherit" />
                      </div>
                      <div className="flex items-center gap-2 text-xs opacity-60">
                        <span>Original Task Budget:</span>
                        <span className="font-semibold text-inherit">
                          ${item.taskBudget}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`self-start flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider relative z-20 ${statusStyle.bg}`}
                    >
                      {statusStyle.icon}
                      {item.status || "Pending"}
                    </div>
                  </div>

                  {/* মেটা ইনফো গ্রিড: বিড বাজেট, টাইমলাইন ও ডেট */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-[var(--surface-strong)] border border-[var(--border)] rounded-xl p-3 text-xs md:text-sm relative z-20">
                    <div className="space-y-0.5">
                      <span className="text-[var(--muted)] text-[11px] block">
                        Your Bid Budget
                      </span>
                      <div className="flex items-center font-bold text-emerald-500">
                        <DollarSign className="w-4 h-4 shrink-0 -ml-1" />
                        {item.proposedBudget}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[var(--muted)] text-[11px] block">
                        Estimated Time
                      </span>
                      <div className="flex items-center gap-1.5 font-semibold text-[var(--text)]">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {item.estimatedDays}{" "}
                        {item.estimatedDays > 1 ? "Days" : "Day"}
                      </div>
                    </div>

                    <div className="space-y-0.5 col-span-2 sm:col-span-1">
                      <span className="text-[var(--muted)] text-[11px] block">
                        Submitted On
                      </span>
                      <div className="flex items-center gap-1.5 font-medium text-[var(--muted)]">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* কাভার নোট সেকশন */}
                  {item.coverNote && (
                    <div className="space-y-1.5 pt-1 relative z-20">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)]">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Your Cover Note</span>
                      </div>
                      <p className="text-sm text-[var(--text)] leading-relaxed bg-[var(--surface-strong)] border border-[var(--border)] rounded-xl p-3 italic">
                        {item.coverNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel rounded-[2rem] py-16 text-center">
          <FileText className="w-10 h-10 mx-auto text-[var(--muted)] opacity-40 mb-3" />
          <p className="text-sm text-[var(--muted)] italic">
            You have not submitted any proposals yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyProposalsPage;
