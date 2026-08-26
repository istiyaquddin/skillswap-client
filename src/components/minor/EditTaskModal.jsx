"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { X, Loader2, Edit3, DollarSign, Calendar, Tag, FileText, CheckCircle2 } from "lucide-react";
import { updateTask } from "@/lib/actions/actions";

const EditTaskModal = ({ task, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    budget: task?.budget || "",
    deadline: task?.deadline ? task.deadline.split("T")[0] : "",
    category: task?.category || "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const result = await updateTask(task._id, formData);

      if (result.success) {
        toast.success("Task updated successfully");
        onSuccess({
          ...task,
          ...formData,
        });
      } else {
        toast.error(result.message || "Update failed");
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 font-sans text-[var(--text)]">
      <div className="glass-panel w-full max-w-2xl rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 md:p-8 shadow-2xl backdrop-blur-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="amber-gradient amber-glow flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-md">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-[var(--text)]">
                Edit <span className="amber-text-gradient">Task Opportunity</span>
              </h2>
              <p className="text-xs text-[var(--muted)] font-medium">Update title, budget, and project requirements</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-[var(--muted)] hover:bg-amber-500/10 hover:text-amber-400 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" /> Task Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Build a Full-Stack E-Commerce App"
              className="w-full px-4 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-sm font-bold text-[var(--text)] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition placeholder:text-[var(--muted)]"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)] flex items-center gap-1.5">
              Description & Scope
            </label>
            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a clear description of deliverables..."
              className="w-full px-4 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-sm font-medium leading-relaxed text-[var(--text)] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition placeholder:text-[var(--muted)] resize-none"
              required
            />
          </div>

          {/* Grid Metadata Inputs */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)] flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Budget (USD)
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="450"
                className="w-full px-4 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-sm font-bold text-[var(--text)] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-sm font-bold text-[var(--text)] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" /> Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Web Development"
                className="w-full px-4 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-sm font-bold text-[var(--text)] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full border border-[var(--border)] text-xs font-black uppercase tracking-widest text-[var(--muted)] hover:bg-[var(--surface-strong)] transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              type="submit"
              className="px-6 py-2.5 rounded-full amber-gradient amber-glow shine-button text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-md transition hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
