"use client";

import React from "react";
import { AlertCircle, Loader2 } from "lucide-react";

const RejectTaskModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 font-sans text-[var(--text)]">
      <div className="glass-panel w-full max-w-sm rounded-[2.5rem] border border-rose-500/30 bg-[var(--surface-strong)] p-6 space-y-4 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-[var(--text)]">Reject Proposal?</h3>
            <p className="text-[11px] font-bold text-[var(--muted)]">Status will be updated</p>
          </div>
        </div>

        <p className="text-xs text-[var(--muted)] leading-relaxed">
          Are you sure you want to decline this pitch? The freelancer will be notified and the proposal status will change to rejected.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-black uppercase tracking-wider border border-[var(--border)] rounded-full text-[var(--muted)] hover:bg-[var(--surface-strong)] transition cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 text-xs font-black uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white rounded-full transition flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Rejecting...
              </>
            ) : (
              "Yes, Reject"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectTaskModal;