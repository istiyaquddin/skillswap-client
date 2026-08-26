"use client";

import React from "react";
import { X, Trash2, Loader2, AlertTriangle } from "lucide-react";

const DeleteTaskModal = ({ task, onClose, onDelete, loading }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 font-sans text-[var(--text)]">
      <div className="glass-panel w-full max-w-md rounded-[2.5rem] border border-rose-500/30 bg-[var(--surface-strong)] p-6 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-2xl text-rose-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black tracking-tight text-rose-500">
              Delete Task
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-[var(--muted)] hover:bg-rose-500/10 hover:text-rose-500 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Warning: Irreversible Action
            </p>
            <p className="font-extrabold text-sm text-[var(--text)] line-clamp-2">
              {task?.title || "Selected Task"}
            </p>
          </div>

          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Are you sure you want to permanently delete this task opportunity? All proposals associated with this task will be removed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-[var(--border)] text-xs font-black uppercase tracking-widest text-[var(--muted)] hover:bg-[var(--surface-strong)] transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            disabled={loading}
            className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-md transition hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete Task
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteTaskModal;