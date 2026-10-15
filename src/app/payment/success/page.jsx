import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  User,
  Briefcase,
  DollarSign,
  AlertTriangle,
  Receipt,
  FileCheck,
  ChevronRight,
} from "lucide-react";
import { payment } from "@/lib/actions/payment";
import { getProposalDetails } from "@/lib/actions/actions";
import ThemeToggle from "@/components/minor/ThemeToggle";

export default async function PaymentSuccessPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const session_id = resolvedSearchParams?.session_id;

  // Handle missing or invalid session ID gracefully without crashing
  if (!session_id) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex items-center justify-center p-4 antialiased font-sans relative">
        <div className="glass-panel w-full max-w-md rounded-[2.5rem] p-8 text-center space-y-5 shadow-2xl border border-[var(--border)] relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[var(--text)]">Missing Session ID</h2>
            <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed">
              No active payment session was found. If your card was charged, check your transaction ledger in your dashboard.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/dashboard/client/payments" className="block w-full">
              <button className="w-full py-3.5 px-6 amber-gradient amber-glow text-white font-extrabold text-xs uppercase tracking-widest rounded-full hover:opacity-90 transition shadow-lg cursor-pointer">
                View Payment Ledger
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let session = null;
  let isDemoSession = session_id.startsWith("demo_");

  if (!isDemoSession) {
    try {
      session = await stripe.checkout.sessions.retrieve(session_id);
    } catch (err) {
      console.error("Stripe Session Retrieval Warning:", err.message);
    }
  }

  // Fallback data if Stripe session was retrieved or if simulated demo payment
  const metadata = session?.metadata || {};
  const taskId = metadata.taskId || resolvedSearchParams?.taskId;
  const proposalId = metadata.proposalId || resolvedSearchParams?.proposalId;
  const price = metadata.price || (session?.amount_total ? session.amount_total / 100 : resolvedSearchParams?.price || 150);
  const workerEmail = metadata.freelancerEmail || resolvedSearchParams?.workerEmail || "Assigned Freelancer";

  // Sync with database if valid
  if (session?.status === "complete" || isDemoSession) {
    try {
      await payment({
        sessionId: session?.id || session_id,
        userId: metadata.userId || "client-escrow",
        userEmail: session?.customer_email || metadata.userEmail || "client@skillswap.edu",
        taskId,
        proposalId,
        price,
      });
    } catch (dbErr) {
      console.error("Database sync warning:", dbErr.message);
    }
  }

  let proposalDetails = null;
  if (proposalId) {
    try {
      proposalDetails = await getProposalDetails(proposalId);
    } catch (err) {
      console.error("Proposal lookup warning:", err.message);
    }
  }

  const taskTitle = proposalDetails?.taskTitle || metadata.title || "Campus Freelance Task Contract";
  const amountPaid = price || proposalDetails?.proposedBudget || 150;
  const finalWorkerEmail = proposalDetails?.freelancerEmail || workerEmail;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center p-4 antialiased font-sans relative selection:bg-amber-500/20 selection:text-amber-500">
      
      {/* Dynamic Ambient Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[130px]" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-amber-500/5 dark:bg-amber-500/10 blur-[140px]" />
      </div>

      {/* Top Header Row with Theme Toggle */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between z-10">
        <Link href="/">
          <span className="text-xs font-bold text-[var(--muted)] hover:text-amber-400 transition cursor-pointer">
            ← Return to SkillSwap Home
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Success Card */}
      <div className="glass-panel w-full max-w-lg rounded-[2.5rem] p-6 md:p-9 text-center shadow-2xl relative overflow-hidden space-y-6 z-10 border border-[var(--border)] animate-in fade-in duration-300">
        
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 amber-gradient rounded-3xl flex items-center justify-center text-white shadow-[0_8px_25px_rgba(245,158,11,0.35)]">
          <CheckCircle2 className="w-8 h-8 stroke-[2.3]" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20 mb-2">
            <ShieldCheck size={13} /> Escrow Vault Secured
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text)] tracking-tight">
            Escrow Payment Authorized!
          </h1>
          <p className="text-xs text-[var(--muted)] font-medium max-w-xs mx-auto leading-relaxed mt-1">
            Your transaction has been confirmed. Funds are securely locked in Stripe Escrow until milestone delivery is approved.
          </p>
        </div>

        {/* Contract & Financial Summary */}
        <div className="p-5 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-left space-y-3.5 text-xs">
          
          <div className="flex items-center gap-3 border-b border-[var(--border)] pb-3">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] uppercase font-bold text-[var(--muted)] block">Contract Task</span>
              <span className="text-sm font-bold text-[var(--text)] truncate block">{taskTitle}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[var(--surface)] text-[var(--muted)] shrink-0 border border-[var(--border)]">
                <User className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--muted)] block">Assigned Talent</span>
                <span className="text-xs font-semibold text-[var(--text)] truncate max-w-40 block">{finalWorkerEmail}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[var(--muted)] block">Escrow Amount</span>
              <span className="text-base font-black text-amber-400">${amountPaid} USD</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-1 text-[11px] font-mono">
            <span className="text-[var(--muted)]">Session Reference:</span>
            <span className="text-[var(--text)] truncate max-w-[200px]" title={session?.id || session_id}>
              {session?.id || session_id}
            </span>
          </div>
        </div>

        {/* Escrow Guarantee Pill */}
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/6 p-3 flex items-center gap-3 text-left">
          <FileCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-[11px] text-[var(--muted)] leading-tight">
            <strong className="text-[var(--text)]">100% Escrow Protection:</strong> The freelancer cannot withdraw funds until you inspect and accept the completed deliverable.
          </p>
        </div>

        {/* Navigation Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Link href="/dashboard/client/tasks" className="block w-full">
            <button className="w-full py-3.5 px-6 amber-gradient amber-glow text-white font-extrabold text-xs uppercase tracking-widest rounded-full hover:scale-[1.02] active:scale-95 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer">
              <span>View Active Tasks & Deliverables</span>
              <ChevronRight size={15} />
            </button>
          </Link>

          <Link href="/dashboard/client/payments" className="block w-full">
            <button className="w-full py-3 px-6 border border-[var(--border)] bg-[var(--surface-strong)] rounded-full text-xs font-bold text-[var(--muted)] hover:text-amber-400 hover:border-amber-400/40 transition cursor-pointer flex items-center justify-center gap-2">
              <Receipt size={14} />
              Open Payment Ledger
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
