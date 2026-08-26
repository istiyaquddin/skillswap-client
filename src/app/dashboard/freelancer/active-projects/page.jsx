"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client"; 
import SubmitDeliverableModal from "@/components/minor/SubmitDeliverableModal";
import { Loader2, CheckCircle2, Circle } from "lucide-react";

export default function ActiveProjectsPage() {
  const { data: session, isPending } = authClient.useSession();
  const [activeProjects, setActiveProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [isFetching, setIsFetching] = useState(false); // শুধু ডাটা ফেচিং ট্র্যাক করার জন্য
  const [selectedTask, setSelectedTask] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
  if (!session?.user?.email) return;

  const fetchProjects = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      // Better Auth থেকে টোকেন নেওয়া হচ্ছে
      const { data: tokenData } = await authClient.token();

      const res = await fetch(`${apiUrl}/api/freelancer-projects?email=${session.user.email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization হেডারে Bearer টোকেন পাস করা হলো
          authorization: `Bearer ${tokenData?.token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setActiveProjects(data.activeProjects);
        setCompletedProjects(data.completedProjects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // ক্যাসকেডিং রেন্ডার ওয়ার্নিং এড়াতে ০ মিলিগ্রামের টাইমাউট ট্রিক
  const timeoutId = setTimeout(() => {
    setIsFetching(true);
    fetchProjects();
  }, 0);

  return () => clearTimeout(timeoutId);
}, [session, refreshTrigger]);

  // সেশন লোড হচ্ছে অথবা ডাটা ফেচ হচ্ছে—এমন অবস্থায় লোডার দেখাবে
  const showLoading = isPending || (session?.user?.email && activeProjects.length === 0 && completedProjects.length === 0 && isFetching);

  if (showLoading) {
    return (
      <div className="flex flex-col h-96 w-full items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
          Loading Projects...
        </p>
      </div>
    );
  }

  

  if (!session) {
    return (
      <div className="glass-panel rounded-[2rem] max-w-md mx-auto mt-10 p-8 text-center">
        <p className="text-sm text-[var(--muted)] font-medium">
          Please log in to view your active projects.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-6 font-sans">

      {/* Header Banner */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Circle className="w-3 h-3 fill-amber-400 text-amber-400" /> Active Projects
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">
            My <span className="amber-text-gradient">Contracts</span>
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Manage active project contracts, submit deliverables, and track completions.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <div className="flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-4 py-2 rounded-full text-xs font-bold text-amber-400">
            <Circle className="w-3 h-3 fill-amber-400" />
            {activeProjects.length} Active
          </div>
          <div className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 rounded-full text-xs font-bold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {completedProjects.length} Done
          </div>
        </div>
      </div>

      {/* ---------------- SECTION 1: ACTIVE PROJECTS ---------------- */}
      <section className="space-y-4">
        <h2 className="text-lg font-extrabold flex items-center gap-2 text-[var(--text)]">
          <Circle className="w-3 h-3 fill-amber-500 text-amber-500" />
          Active Projects ({activeProjects.length})
        </h2>
        
        {activeProjects.length === 0 ? (
          <div className="glass-panel rounded-[2rem] py-12 text-center">
            <p className="text-sm text-[var(--muted)] italic">
              No active projects found. After your proposals are accepted, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {activeProjects.map((task) => (
              <div key={task._id} className="glass-panel rounded-[2rem] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-amber-500/40 hover:scale-[1.01]">
                <div className="space-y-2">
                  <h3 className="font-bold text-base text-[var(--text)]">{task.title}</h3>
                  <p className="text-xs text-[var(--muted)] line-clamp-1 max-w-xl">{task.description}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">{task.category || "Development"}</span>
                    <span className="text-emerald-400 font-black">${task.budget}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setIsModalOpen(true);
                  }}
                  className="whitespace-nowrap amber-gradient amber-glow rounded-full px-5 py-2.5 text-white font-bold text-sm transition hover:opacity-90 shrink-0"
                >
                  Submit Deliverable
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---------------- SECTION 2: COMPLETED PROJECTS ---------------- */}
      <section className="space-y-4">
        <h2 className="text-lg font-extrabold flex items-center gap-2 text-[var(--text)]">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Completed ({completedProjects.length})
        </h2>

        {completedProjects.length === 0 ? (
          <div className="glass-panel rounded-[2rem] py-12 text-center">
            <p className="text-sm text-[var(--muted)] italic">No completed tasks yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {completedProjects.map((task) => (
              <div key={task._id} className="glass-panel rounded-[2rem] p-6 relative space-y-4 transition hover:border-emerald-500/30">
                
                <span className="absolute top-6 right-6 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Completed
                </span>

                <div className="space-y-1.5">
                  <h3 className="font-bold text-base pr-20 text-[var(--text)]">{task.title}</h3>
                  <p className="text-xs text-[var(--muted)] leading-relaxed max-w-2xl">{task.description}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">{task.category || "Development"}</span>
                    <span className="text-emerald-400 font-black">${task.budget}</span>
                  </div>
                </div>

                {task.deliverableUrl && (
                  <div className="pt-3 border-t border-current/10 flex items-center gap-2 text-xs">
                    <span className="opacity-50">Submitted Deliverable:</span>
                    {task.deliverableUrl.startsWith("http") ? (
                      <a
                        href={task.deliverableUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline font-semibold break-all max-w-md"
                      >
                        {task.deliverableUrl}
                      </a>
                    ) : (
                      <span className="font-semibold break-all max-w-md text-inherit">{task.deliverableUrl}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Submission Modal */}
      <SubmitDeliverableModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSubmissionSuccess={() => setRefreshTrigger(prev => prev + 1)} 
      />
    </div>
  );
}