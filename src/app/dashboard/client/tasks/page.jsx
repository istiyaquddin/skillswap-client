"use client";

import TaskCard from "@/components/mejor/TaskCard";
import { getMyTasks } from "@/lib/api/tasks";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PlusCircle, ClipboardList, Loader2 } from "lucide-react";

const TasksPage = () => {
  const { data: session } = authClient.useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔥 ফিল্টারিং এর জন্য নতুন স্টেট (ডিফল্ট থাকবে "All")
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const loadTasks = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const data = await getMyTasks(session.user.id);
        setTasks(data || []);
      } catch (error) {
        console.error("Error loading tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [session]);

  // 🔥 ফিল্টার লজিক প্রয়োগ (স্ট্যাটাস ছোট হাতের বা বড় হাতের যাই হোক হ্যান্ডেল করবে)
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "All") return true;
    return task.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="mt-12 md:mt-0 max-w-6xl mx-auto p-4 md:p-0 font-sans text-[var(--text)]">
      <div className="glass-panel relative mb-6 sm:mb-8 p-5 sm:p-6 md:p-8 rounded-[2.5rem] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">
            My <span className="amber-text-gradient">Tasks</span>
          </h1>
          <p className="mt-1 text-sm font-medium text-[var(--muted)]">
            Manage your posted task opportunities and active projects.
          </p>
        </div>

        {tasks.length > 0 && (
          <div className="flex gap-1.5 bg-[var(--surface-strong)] border border-[var(--border)] p-1.5 rounded-2xl w-fit backdrop-blur-md">
            {["All", "Open", "Completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition duration-300 cursor-pointer ${
                  filterStatus === status
                    ? "amber-gradient amber-glow text-white shadow-md"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {status} (
                {status === "All"
                  ? tasks.length
                  : tasks.filter((t) => t.status?.toLowerCase() === status.toLowerCase()).length}
                )
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ১. ডেটা যখন লোড হচ্ছে */}
      {loading ? (
        <div className="text-center py-20 text-[var(--muted)] flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Loading your tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        
        /* ২. কোনো টাস্ক একদমই না থাকলে (Empty State) */
        <div className="flex flex-col items-center justify-center border border-dashed border-[var(--border)] rounded-3xl p-10 bg-[var(--surface-strong)] max-w-2xl mx-auto text-center mt-6 shadow-sm">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-full mb-4">
            <ClipboardList className="w-10 h-10 text-amber-400" />
          </div>
          <h3 className="text-lg font-bold mb-1 text-[var(--text)]">No Tasks Found</h3>
          <p className="text-[var(--muted)] text-sm max-w-sm mb-6">
            You have not created any tasks yet. Create your first task to get started with freelancers!
          </p>
          
          <Link 
            href="/dashboard/client/tasks/post-task" 
            className="inline-flex items-center gap-2 amber-gradient amber-glow text-white font-bold text-sm px-6 py-3 rounded-full shadow-md transition"
          >
            <PlusCircle className="w-4 h-4" />
            Create a Task
          </Link>
        </div>

      ) : filteredTasks.length === 0 ? (

        /* ৩. ফিল্টার করার পর যদি ওই স্ট্যাটাসের কোনো টাস্ক না পাওয়া যায় */
        <div className="text-center p-16 border border-dashed border-current/10 rounded-3xl bg-current/5">
          <p className="opacity-50 font-medium italic text-sm">
            No {filterStatus} tasks found.
          </p>
        </div>

      ) : (
        
        /* ৪. ফিল্টার করা টাস্কগুলো গ্রিড আকারে দেখাবে */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <Link key={task._id} href={`/dashboard/client/tasks/${task._id}`} className="block group">
              <TaskCard task={task} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;