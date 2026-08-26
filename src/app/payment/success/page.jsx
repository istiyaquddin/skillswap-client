import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, User, Briefcase, DollarSign } from "lucide-react";
import { payment } from "@/lib/actions/payment";
import { getProposalDetails } from "@/lib/actions/actions";

export default async function PaymentSuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Missing valid Stripe checkout session ID.");
  }

  // 1. Retrieve session from Stripe
  const session = await stripe.checkout.sessions.retrieve(session_id);

  if (session.status === "open") {
    return redirect("/");
  }

  let proposalDetails = null;

  if (session.status === "complete") {
    const { taskId, proposalId, userId, userEmail, price } = session.metadata || {};

    // 2. Sync Database
    const dbSync = await payment({
      sessionId: session.id,
      userId,
      userEmail,
      taskId,
      proposalId,
      price,
    });

    if (dbSync?.success === false) {
      console.error("Database sync failed:", dbSync.error);
    }

    if (proposalId) {
      try {
        proposalDetails = await getProposalDetails(proposalId);
      } catch (err) {
        console.error("Error fetching proposal details:", err);
      }
    }

    const taskTitle = proposalDetails?.taskTitle || "Freelance Task Contract";
    const workerEmail = proposalDetails?.freelancerEmail || "Assigned Freelancer";
    const amountPaid = price || proposalDetails?.proposedBudget || (session.amount_total / 100);

    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.10),_transparent_40%),linear-gradient(135deg,_#080b10,_#0c0e14)] flex items-center justify-center p-4 antialiased text-[var(--text)] font-sans">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-b from-amber-500/10 to-transparent blur-3xl pointer-events-none" />
        
        <div className="glass-panel w-full max-w-lg rounded-[2.5rem] p-6 md:p-8 text-center shadow-2xl relative overflow-hidden space-y-6">
          
          {/* Success Animation Icon */}
          <div className="mx-auto w-16 h-16 amber-gradient rounded-2xl flex items-center justify-center text-white shadow-[0_0_30px_rgba(245,158,11,0.3)]">
            <CheckCircle2 className="w-8 h-8 stroke-[2.3]" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-[var(--text)] tracking-tight mb-1">
              Payment Successful!
            </h1>
            <p className="text-xs text-[var(--muted)] font-medium max-w-xs mx-auto leading-relaxed">
              Your transaction has been confirmed and funds are securely held in escrow.
            </p>
          </div>

          {/* Details Card */}
          <div className="p-5 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-left space-y-3 text-xs">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
              <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-[var(--muted)] block">Task Title</span>
                <span className="text-sm font-bold text-[var(--text)] truncate block">{taskTitle}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--muted)] block">Freelancer</span>
                  <span className="text-xs font-semibold text-[var(--text)]">{workerEmail}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[var(--muted)] block">Amount Paid</span>
                <span className="text-base font-black text-amber-400">${amountPaid} USD</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1 text-[11px]">
              <span className="text-[var(--muted)]">Stripe Ref ID</span>
              <span className="text-[var(--muted)] font-mono text-[10px] truncate max-w-[180px]">{session.id}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl justify-center font-semibold">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Task status updated to In Progress & Freelancer notified.</span>
          </div>

          {/* Navigation Button */}
          <Link
            href="/dashboard/client"
            className="w-full amber-gradient amber-glow text-white font-bold py-3.5 px-4 rounded-full text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 group cursor-pointer hover:opacity-90"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }
}
