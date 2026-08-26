"use client";

import { authClient } from "@/lib/auth-client";
import { Loader2, X, Send, AlertCircle, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

export default function SubmitDeliverableModal({
  isOpen,
  onClose,
  task,
  onSubmissionSuccess,
}) {
  const [deliverableUrl, setDeliverableUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !task) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deliverableUrl.trim()) {
      setError("Please provide a deliverable submission.");
      return;
    }

    setLoading(true);
    setError("");

    const apiUrl = (
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    ).replace(/\/$/, "");

    const { data: tokenData } = await authClient.token();

    try {
      const response = await fetch(`${apiUrl}/api/tasks/complete/${task._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify({ deliverableUrl }),
      });

      const data = await response.json();

      if (data.success) {
        setDeliverableUrl("");
        onSubmissionSuccess();
        onClose();
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 font-sans text-[var(--text)]">
      <div className="glass-panel w-full max-w-lg rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 md:p-8 shadow-2xl backdrop-blur-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 rounded-full p-2 text-[var(--muted)] hover:bg-amber-500/10 hover:text-amber-400 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
          <div className="amber-gradient amber-glow flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-md">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-[var(--text)]">
              Submit <span className="amber-text-gradient">Deliverable</span>
            </h2>
            <p className="text-xs text-[var(--muted)] font-medium">Deliver completed work for client review</p>
          </div>
        </div>

        <p className="text-xs text-[var(--muted)] leading-relaxed mb-4">
          Provide submission links or details for task: <span className="font-bold text-amber-400">{task.title}</span>.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)] flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-amber-400" /> Deliverable Link / Text Details
            </label>
            <input
              type="text"
              placeholder="Paste Google Drive, GitHub, Figma URL, or text notes..."
              value={deliverableUrl}
              onChange={(e) => setDeliverableUrl(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-sm font-bold text-[var(--text)] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition placeholder:text-[var(--muted)]"
              required
            />
            <p className="text-[11px] text-[var(--muted)]">
              Support links: GitHub repositories, Google Docs, Figma designs, or hosted demo URLs.
            </p>
          </div>

          {/* Warning Note */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              <strong className="text-amber-400 uppercase font-black tracking-wider">Note:</strong> Marking task completed initiates escrow settlement. Verify deliverables before submitting.
            </p>
          </div>

          {error && <p className="text-xs text-rose-400 font-bold">{error}</p>}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 rounded-full border border-[var(--border)] text-xs font-black uppercase tracking-widest text-[var(--muted)] hover:bg-[var(--surface-strong)] transition cursor-pointer disabled:opacity-40"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full amber-gradient amber-glow shine-button text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Submitting...
                </>
              ) : (
                "Mark as Completed"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
