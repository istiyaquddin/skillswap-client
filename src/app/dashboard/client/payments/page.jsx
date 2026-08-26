"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Loader2,
  DollarSign,
  Receipt,
  CheckCircle2,
  Wallet,
  Sparkles,
  Calendar,
  Hash,
} from "lucide-react";

const PaymentHistoryPage = () => {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const userEmail = session?.user?.email;

  const [payments, setPayments] = useState([]);
  const [totalSpend, setTotalSpend] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) return;

    const loadPaymentHistory = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      try {
        const { data: tokenData } = await authClient.token();
        const res = await fetch(`${apiUrl}/api/payment-history?email=${userEmail}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${tokenData?.token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setPayments(data.history || []);
          const total = typeof data.totalSpend === "object" ? data.totalSpend?.total : data.totalSpend;
          setTotalSpend(Number(total) || 0);
        }
      } catch (err) {
        console.error("Error loading payments:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      setLoading(true);
      loadPaymentHistory();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [userEmail]);

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
          Loading Payments...
        </p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Invested",
      value: `$${totalSpend.toLocaleString()}`,
      sub: "Lifetime platform spending",
      icon: DollarSign,
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
    {
      label: "Total Payments",
      value: payments.length,
      sub: "Completed payment sessions",
      icon: Receipt,
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      label: "Avg Per Task",
      value: payments.length > 0 ? `$${Math.round(totalSpend / payments.length)}` : "$0",
      sub: "Average per hired task",
      icon: Wallet,
      color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-6 font-sans">
      {/* Header Banner */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Payment History
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">
            My <span className="amber-text-gradient">Payments</span>
          </h1>
          <p className="text-sm text-[var(--muted)] max-w-lg">
            Manage and track all your talent investments and hiring transactions.
          </p>
        </div>
        <div className="flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-4 py-2 rounded-full text-xs font-bold text-amber-400 shrink-0">
          <Receipt className="w-4 h-4" />
          {payments.length} Transactions
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
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="mt-4 text-xs font-medium text-[var(--muted)]">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Payment Cards or Empty State */}
      {payments.length === 0 ? (
        <div className="glass-panel rounded-[2rem] py-16 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-center">
            <Receipt className="w-7 h-7 text-amber-400" />
          </div>
          <h3 className="text-lg font-extrabold text-[var(--text)]">No payment history yet</h3>
          <p className="text-sm text-[var(--muted)] max-w-sm mx-auto">
            Once you hire a freelancer and complete a payment session, your invoices will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="glass-panel rounded-[2rem] p-6 transition-all duration-300 hover:border-amber-500/40 hover:scale-[1.01] relative overflow-hidden group"
            >
              {/* Amber top shimmer on hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />

              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Paid Successfully
                </span>
                <span className="text-2xl font-black text-amber-400">
                  ${payment.amount || 0}
                </span>
              </div>

              {/* Task Title */}
              <h4 className="font-extrabold text-base text-[var(--text)] line-clamp-2 mb-5 group-hover:text-amber-400 transition-colors">
                {payment.taskTitle || "Untitled Task"}
              </h4>

              {/* Metadata */}
              <div className="pt-4 border-t border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-[var(--muted)]">
                  <span className="flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" /> Session ID
                  </span>
                  <span className="font-mono truncate max-w-32" title={payment.sessionId}>
                    {payment.sessionId}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium text-[var(--muted)]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Date
                  </span>
                  <span>
                    {payment.createdAt
                      ? new Date(payment.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryPage;
