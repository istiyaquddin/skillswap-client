"use client";

import { getTaskDetails } from "@/lib/api/tasks";
import { authClient } from "@/lib/auth-client";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  Loader2,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const TaskDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();

  // States
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Proposal Form States
  const [proposedBudget, setProposedBudget] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const userRole = session?.user?.role || "guest";

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getTaskDetails(id);
        setTask(data);

        if (data) {
          if (data.budget) setProposedBudget(String(data.budget));
          if (session?.user?.email) {
            const hasAlreadySubmitted = data.proposals?.some(
              (proposal) => proposal.freelancerEmail === session.user.email,
            );
            if (hasAlreadySubmitted) {
              setIsSubmitted(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
        toast.error("Failed to load task details.");
      } finally {
        setLoading(false);
      }
    };

    if (id && !authLoading) fetchDetails();
  }, [id, session?.user?.email, authLoading]);

  // Handle Proposal Submission
  const handleSubmitProposal = async (e) => {
    e.preventDefault();

    if (!session?.user?.email) {
      toast.error("You must be logged in to submit a proposal.");
      router.push("/login");
      return;
    }

    if (isSubmitted) {
      toast.error("You have already submitted a proposal for this task.");
      return;
    }

    if (!proposedBudget || !estimatedDays || !coverNote) {
      toast.error("Please fill out all proposal fields.");
      return;
    }

    setIsSubmitting(true);

    const proposalData = {
      taskId: id,
      proposedBudget: Number(proposedBudget),
      estimatedDays: Number(estimatedDays),
      coverNote,
      freelancerEmail: session.user.email,
    };

    try {
      const { data: tokenData } = await authClient.token();
      const apiUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      ).replace(/\/$/, "");
      const response = await fetch(`${apiUrl}/api/proposals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify(proposalData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);
        toast.success("Proposal submitted successfully!");

        setTask((prev) => ({
          ...prev,
          proposals: [
            ...(prev?.proposals || []),
            { freelancerEmail: session.user.email },
          ],
        }));
      } else {
        toast.error(result.message || "Failed to submit proposal");
      }
    } catch (error) {
      console.error("Failed to submit proposal:", error);
      toast.error("Network error, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col h-96 w-full items-center justify-center gap-3">
        <Loader2 className="animate-spin text-amber-500" size={38} />
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
          Loading Task Details...
        </p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="glass-panel max-w-lg mx-auto p-8 rounded-[2rem] text-center mt-12 space-y-4">
        <h2 className="text-xl font-bold text-rose-400">Task Not Found</h2>
        <p className="text-sm text-[var(--muted)]">
          The requested task does not exist or has been removed.
        </p>
        <button
          onClick={() => router.push("/browse-task")}
          className="amber-gradient amber-glow px-6 py-2.5 rounded-full text-xs font-bold text-white uppercase tracking-wider"
        >
          Back to Task Directory
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 font-sans">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/browse-task")}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-xs font-bold text-[var(--text)] transition hover:text-amber-400 hover:border-amber-400"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tasks
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Task Header, Description & Proposal Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-400">
                {task.category || "Development"}
              </span>

              <span
                className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                  task.status === "open"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)]"
                }`}
              >
                ● {task.status || "open"}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)] leading-tight">
              {task.title}
            </h1>

            <div className="border-t border-[var(--border)] pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
                Project Brief
              </h3>
              <p className="text-[var(--text)] text-sm md:text-base leading-relaxed whitespace-pre-line">
                {task.description}
              </p>
            </div>

            {userRole === "client" &&
              session?.user?.email === task.clientEmail && (
                <div className="border-t border-[var(--border)] pt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/dashboard/client/tasks/${task._id}`)
                    }
                    className="amber-gradient amber-glow inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Manage Task
                  </button>
                </div>
              )}
          </div>

          {/* Proposal Section */}
          <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden">
            {isSubmitted ? (
              <div className="py-10 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="p-4 bg-emerald-500/15 rounded-full border border-emerald-500/30 text-emerald-400 emerald-glow">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-emerald-400">
                  Proposal Submitted Successfully
                </h3>
                <p className="text-sm text-[var(--muted)] max-w-md">
                  You have applied for this task. The client will review your
                  proposed rate and cover note on their dashboard.
                </p>
                <button
                  onClick={() =>
                    router.push("/dashboard/freelancer/my-proposals")
                  }
                  className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-6 py-2 text-xs font-bold text-amber-400 hover:border-amber-400"
                >
                  Track My Proposals
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitProposal} className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2.5">
                    <div className="amber-gradient p-2 rounded-xl text-white">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold tracking-tight text-[var(--text)]">
                        Submit Your Proposal
                      </h3>
                      <p className="text-xs text-[var(--muted)]">
                        Specify your rate and delivery estimate for this task.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                    {task.proposals?.length || 0} Bids
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                      Proposed Budget (USD)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-amber-400 font-bold text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        required
                        value={proposedBudget}
                        onChange={(e) => setProposedBudget(e.target.value)}
                        placeholder="e.g. 150"
                        className="w-full pl-8 pr-4 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-full text-sm text-[var(--text)] focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                      Estimated Days
                    </label>
                    <input
                      type="number"
                      required
                      value={estimatedDays}
                      onChange={(e) => setEstimatedDays(e.target.value)}
                      placeholder="e.g. 3"
                      className="w-full px-4 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-full text-sm text-[var(--text)] focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                      Cover Note
                    </label>
                    <span className="text-[10px] text-[var(--muted)]">
                      {coverNote.length}/1000 chars
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    maxLength={1000}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder={
                      userRole === "guest"
                        ? "Please sign in to submit your proposal..."
                        : "Explain your experience and why you are the best fit for this task..."
                    }
                    disabled={userRole === "guest"}
                    className="w-full px-4 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-sm text-[var(--text)] focus:outline-none focus:border-amber-400 placeholder:[var(--muted)] resize-none disabled:opacity-50"
                  />
                </div>

                {userRole === "guest" ? (
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="w-full amber-gradient amber-glow py-3.5 px-6 text-white font-bold text-sm rounded-full transition-all duration-300 hover:scale-[1.02]"
                  >
                    Sign In to Submit Proposal
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full amber-gradient amber-glow py-3.5 px-6 text-white font-bold text-sm rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        Submitting Proposal...
                      </>
                    ) : (
                      "Submit Proposal"
                    )}
                  </button>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Right Sidebar: Task Overview & Client Info */}
        <div className="space-y-6 sticky top-6">
          <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] pb-3 border-b border-[var(--border)]">
              Task Overview
            </h2>

            {/* Budget Highlight */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-center">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-1">
                Project Budget
              </span>
              <span className="text-4xl font-black text-amber-400">
                ${task.budget || "0"}
              </span>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Stripe Milestone Escrow
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-[var(--surface-strong)] border border-[var(--border)] text-amber-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">Deadline Date</p>
                  <p className="text-sm font-bold text-[var(--text)]">
                    {formatDate(task.deadline)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-[var(--surface-strong)] border border-[var(--border)] text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">Posted Date</p>
                  <p className="text-sm font-bold text-[var(--text)]">
                    {task.createdAt
                      ? formatDate(task.createdAt)
                      : "Date unavailable"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pt-3 border-t border-[var(--border)]">
                <div className="p-2.5 rounded-xl bg-[var(--surface-strong)] border border-[var(--border)] text-amber-400">
                  <User className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-[var(--muted)]">Client Contact</p>
                  <p
                    className="text-sm font-bold text-[var(--text)] truncate"
                    title={task.clientEmail}
                  >
                    {task.clientEmail || "client@example.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;
