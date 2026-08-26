"use client";

import { createTask } from "@/lib/actions/tasks";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { PlusCircle, Sparkles, Calendar, DollarSign, Tag, FileText, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

const TaskPostingPage = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.target);

    const selectedDate = new Date(formData.get("deadline"));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Deadline cannot be in the past");
      setSubmitting(false);
      return;
    }

    const taskData = {
      title: formData.get("title"),
      category: formData.get("category"),
      description: formData.get("description"),
      budget: Number(formData.get("budget")),
      deadline: formData.get("deadline"),
      clientId: session?.user?.id,
      client_email: session?.user?.email,
      client_name: session?.user?.name,

      status: "open",
      proposals: [],
      deliverable_url: "",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await createTask(taskData);

      if (res.success && res.insertedId) {
        toast.success("Task posted successfully!");
        e.target.reset();
        router.push("/dashboard/client/tasks");
      } else {
        toast.error(res.message || "Failed to post task");
      }
    } catch (error) {
      console.error(error);
      toast.error("Task posting failed, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl mt-8 md:mt-4 px-4 md:px-0 font-sans text-[var(--text)] pb-14">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <div className="mb-8 space-y-3">
        <Link
          href="/dashboard/client/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--muted)] hover:text-amber-400 transition mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Tasks
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Client Marketplace
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">
          Post a <span className="amber-text-gradient">New Task</span>
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Define project scope, allocate budget, and connect with top talent across campus.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" /> Task Title
            </label>
            <input
              name="title"
              type="text"
              placeholder="e.g., Build a Full-Stack Next.js E-Commerce Engine"
              className="w-full px-4 py-3.5 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-sm font-bold text-[var(--text)] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition placeholder:text-[var(--muted)]"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" /> Domain Category
            </label>
            <select
              name="category"
              className="w-full px-4 py-3.5 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-sm font-bold text-[var(--text)] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition cursor-pointer"
              required
            >
              <option value="" className="bg-zinc-950 text-white">Select a domain category</option>
              <option value="Web Development" className="bg-zinc-950 text-white">Web Development</option>
              <option value="UI/UX Design" className="bg-zinc-950 text-white">UI/UX Design</option>
              <option value="Graphic Design" className="bg-zinc-950 text-white">Graphic Design</option>
              <option value="Content Writing" className="bg-zinc-950 text-white">Content Writing</option>
              <option value="Digital Marketing" className="bg-zinc-950 text-white">Digital Marketing</option>
              <option value="AI Automation" className="bg-zinc-950 text-white">AI Automation</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">
              Task Description & Requirements
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Detail your project goals, required skills, and deliverables..."
              className="w-full px-4 py-3.5 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-sm font-medium leading-relaxed text-[var(--text)] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition placeholder:text-[var(--muted)] resize-none"
              required
            />
          </div>

          {/* Budget + Deadline */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)] flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Budget (USD)
              </label>
              <input
                name="budget"
                type="number"
                placeholder="e.g. 450"
                className="w-full px-4 py-3.5 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-sm font-bold text-[var(--text)] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition placeholder:text-[var(--muted)]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Target Deadline
              </label>
              <input
                name="deadline"
                type="date"
                min={tomorrow.toISOString().split("T")[0]}
                className="w-full px-4 py-3.5 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-sm font-bold text-[var(--text)] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition"
                required
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[var(--border)]">
            <button
              type="reset"
              className="px-6 py-3.5 border border-[var(--border)] rounded-full text-xs font-black uppercase tracking-widest text-[var(--muted)] hover:bg-[var(--surface-strong)] transition cursor-pointer"
            >
              Reset Form
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 amber-gradient amber-glow shine-button text-white font-black text-xs uppercase tracking-widest rounded-full py-3.5 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Posting Opportunity...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  Publish Task Opportunity
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskPostingPage;
