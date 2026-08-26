"use client";

import DeleteTaskModal from "@/components/minor/DeleteTaskModal";
import EditTaskModal from "@/components/minor/EditTaskModal";
import RejectTaskModal from "@/components/minor/RejectTaskModal";
import { deleteTask, rejectProposalAction } from "@/lib/actions/actions";
import { getTaskDetails } from "@/lib/api/tasks";
import {
  Briefcase,
  Calendar,
  DollarSign,
  Edit3,
  Loader2,
  Trash2,
  User,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SecureCheckoutView from "@/components/minor/SecureCheckoutView";

const MyTaskDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);

  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedProposalData, setSelectedProposalData] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getTaskDetails(id);
        setTask(data);
      } catch (error) {
        console.error("Error fetching task details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col h-96 items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Loading Task & Proposals...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="glass-panel max-w-lg mx-auto p-8 rounded-[2rem] text-center mt-12 space-y-4">
        <h2 className="text-xl font-bold text-rose-400">Task Not Found</h2>
        <p className="text-sm text-[var(--muted)]">The requested task does not exist or has been removed.</p>
        <button
          onClick={() => router.push("/dashboard/client/tasks")}
          className="amber-gradient amber-glow px-6 py-2.5 rounded-full text-xs font-bold text-white uppercase tracking-wider"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteTask = async () => {
    try {
      setDeleteLoading(true);
      const result = await deleteTask(task._id);
      if (result.success) {
        toast.success("Task deleted successfully");
        router.push("/dashboard/client/tasks");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRejectClick = (proposalId) => {
    setSelectedProposalId(proposalId);
    setShowRejectModal(true);
  };

  const confirmRejectProposal = async () => {
    try {
      setRejectLoading(true);
      const result = await rejectProposalAction(task._id, selectedProposalId);
      if (result.success) {
        toast.success("Proposal rejected");
        setTask((prevTask) => {
          const updatedProposals = prevTask.proposals.map((p) => {
            if (p.proposalId === selectedProposalId) {
              return { ...p, status: "Rejected" };
            }
            return p;
          });
          return { ...prevTask, proposals: updatedProposals };
        });
        setShowRejectModal(false);
        setSelectedProposalId(null);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject proposal");
    } finally {
      setRejectLoading(false);
    }
  };

  const handleAcceptPitchClick = (proposal) => {
    setSelectedProposalData({
      ...proposal,
      taskId: task._id,
      taskTitle: task.title,
    });
    setShowCheckout(true);
  };

  const handleAcceptSuccessSubmit = async (taskId, proposalId) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(
        `${apiUrl}/api/proposals/${taskId}/${proposalId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "Accept",
            status: "Accepted",
          }),
        },
      );

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message);

        setTask((prevTask) => {
          const updatedProposals = prevTask.proposals.map((p) => {
            if (p.proposalId !== proposalId) {
              return { ...p, status: "Rejected" };
            }
            return { ...p, status: "Accepted" };
          });

          return {
            ...prevTask,
            status: "assigned",
            proposals: updatedProposals,
          };
        });

        setShowCheckout(false);
        setSelectedProposalData(null);
        router.refresh();
      } else {
        toast.error(result.message || "Action failed");
      }
    } catch (error) {
      console.error("Failed to accept proposal:", error);
      toast.error("Something went wrong");
    }
  };

  if (showCheckout && selectedProposalData) {
    return (
      <SecureCheckoutView
        proposal={selectedProposalData}
        onBack={() => {
          setShowCheckout(false);
          setSelectedProposalData(null);
        }}
        onPaymentSuccess={async () => {
          await handleAcceptSuccessSubmit(
            selectedProposalData.taskId,
            selectedProposalData.proposalId,
          );
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6 font-sans space-y-8 min-h-screen">
      <div>
        <button
          onClick={() => router.push("/dashboard/client/tasks")}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-xs font-bold text-[var(--text)] transition hover:text-amber-400 hover:border-amber-400"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Tasks
        </button>
      </div>

      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-400">
            {task.category || "Development"}
          </span>

          <span
            className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
              task.status === "open"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
            }`}
          >
            ● {task.status || "open"}
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">{task.title}</h1>
          <p className="text-[var(--text)] text-sm md:text-base leading-relaxed whitespace-pre-line">
            {task.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-bold border-t border-[var(--border)] pt-5">
          <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3.5 py-1.5 rounded-full">
            <DollarSign className="w-4 h-4" /> Budget: ${task.budget} USD
          </div>

          <div className="flex items-center gap-1.5 bg-[var(--surface-strong)] border border-[var(--border)] px-3.5 py-1.5 rounded-full text-[var(--muted)]">
            <Calendar className="w-4 h-4 text-amber-400" /> Deadline: {formatDate(task.deadline)}
          </div>
        </div>

        {task.status === "open" && (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-2 text-xs font-bold text-[var(--text)] transition hover:border-amber-400 hover:text-amber-400 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Task
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-5 py-2 text-xs font-bold text-rose-400 transition hover:bg-rose-500/20 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Task
            </button>
          </div>
        )}
      </div>

      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="amber-gradient p-2.5 rounded-xl text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight text-[var(--text)]">
                Freelancer Applications ({task.proposals?.length || 0})
              </h3>
              <p className="text-xs text-[var(--muted)]">Evaluate applicant rates, cover notes, and hire instantly with Stripe Escrow.</p>
            </div>
          </div>
        </div>

        {task.proposals && task.proposals.length > 0 ? (
          <div className="space-y-4">
            {task.proposals.map((proposal) => {
              const isPending = proposal.status === "Pending" || !proposal.status;
              const isAccepted = proposal.status === "Accepted";
              const isRejected = proposal.status === "Rejected";

              return (
                <div
                  key={proposal.proposalId}
                  className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 space-y-4 transition duration-300 hover:border-amber-500/30"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full amber-gradient flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                        {proposal.freelancerEmail?.charAt(0).toUpperCase() || "F"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--text)]">{proposal.freelancerEmail}</p>
                        <p className="text-[11px] text-[var(--muted)]">Submitted {formatDate(proposal.createdAt)}</p>
                      </div>
                    </div>

                    <span
                      className={`px-3.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                        isAccepted
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : isRejected
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      ● {proposal.status || "Pending"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="text-lg font-black text-amber-400">
                      ${proposal.proposedBudget} USD
                    </span>
                    <span className="text-[var(--muted)]">•</span>
                    <span className="text-[var(--text)] bg-[var(--surface)] px-3 py-1 rounded-full border border-[var(--border)]">
                      {proposal.estimatedDays} {proposal.estimatedDays > 1 ? "Days" : "Day"} Delivery
                    </span>
                  </div>

                  <div className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)]">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">Cover Note</p>
                    <p className="text-sm text-[var(--text)] leading-relaxed">
                      {proposal.coverNote || "No cover note provided."}
                    </p>
                  </div>

                  {task.status === "open" && isPending && (
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleAcceptPitchClick(proposal)}
                        className="amber-gradient amber-glow px-6 py-2.5 text-white font-extrabold text-xs rounded-full transition hover:scale-105 cursor-pointer flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" /> Accept & Hire (Stripe Escrow)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectClick(proposal.proposalId)}
                        className="px-5 py-2.5 border border-rose-500/30 bg-rose-500/10 text-rose-400 font-bold text-xs rounded-full hover:bg-rose-500/20 transition cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-strong)] text-sm text-[var(--muted)] italic">
            No proposals received yet. Freelancers will apply soon!
          </div>
        )}
      </div>

      {showEditModal && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onSuccess={(updatedTask) => {
            setTask(updatedTask);
            setShowEditModal(false);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteTaskModal
          task={task}
          loading={deleteLoading}
          onClose={() => setShowDeleteModal(false)}
          onDelete={confirmDeleteTask}
        />
      )}

      <RejectTaskModal
        isOpen={showRejectModal}
        loading={rejectLoading}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedProposalId(null);
        }}
        onConfirm={confirmRejectProposal}
      />
    </div>
  );
};

export default MyTaskDetailsPage;
