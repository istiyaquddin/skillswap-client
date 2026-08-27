import { CheckCircle2, Clock, Orbit, Send, Tag, Code, Palette, Megaphone, Flame } from "lucide-react";

const TaskCard = ({ task }) => {
  const taskDate = task.deadline || task.createdAt;
  const formattedDate = taskDate
    ? new Date(taskDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Date unavailable";

  const activeProposalsCount =
    task.proposals && Array.isArray(task.proposals)
      ? task.proposals.filter((p) => p.status?.toLowerCase() !== "rejected")
          .length
      : 0;

  const isCompleted = task.status?.toLowerCase() === "completed";

  const getCategoryMeta = (category) => {
    const catLower = (category || "").toLowerCase();
    if (catLower.includes("dev") || catLower.includes("code"))
      return { icon: Code, color: "text-blue-400", bar: "from-blue-500/40 to-blue-400/20" };
    if (catLower.includes("design") || catLower.includes("ui"))
      return { icon: Palette, color: "text-violet-400", bar: "from-violet-500/40 to-violet-400/20" };
    if (catLower.includes("market") || catLower.includes("seo"))
      return { icon: Megaphone, color: "text-rose-400", bar: "from-rose-500/40 to-rose-400/20" };
    return { icon: Tag, color: "text-[#1dbf73]", bar: "from-[#1dbf73]/40 to-[#1dbf73]/20" };
  };

  const { icon: CategoryIcon, color: catColor, bar: catBar } = getCategoryMeta(task.category);

  // Urgency: deadline within 3 days
  const isUrgent = (() => {
    if (!task.deadline) return false;
    const diff = new Date(task.deadline) - new Date();
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
  })();

  return (
    <div className="glass-panel group relative rounded-[2rem] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[#1dbf73]/40 hover:shadow-2xl cursor-pointer flex flex-col justify-between h-full">
      {/* Category gradient top bar */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${catBar} group-hover:opacity-100 opacity-70 transition-opacity`} />

      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
          <span className={`rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-semibold inline-flex items-center gap-1.5 transition-transform duration-200 group-hover:scale-105 ${catColor}`}>
            <CategoryIcon size={12} className="group-hover:rotate-12 transition-transform" />
            {task.category || "General"}
          </span>

          <span
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border flex items-center gap-1.5 backdrop-blur-md whitespace-nowrap ${
              isCompleted
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-[#1dbf73]/10 text-[#1dbf73] border-[#1dbf73]/20"
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 size={13} />
            ) : (
              <Orbit size={13} className="animate-spin" style={{ animationDuration: "3s" }} />
            )}
            {task.status}
          </span>
        </div>

        {/* Urgency badge */}
        {isUrgent && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 px-2.5 py-0.5 text-[10px] font-bold text-rose-400">
            <Flame size={10} />
            Closing Soon
          </div>
        )}

        <h2 className="font-extrabold text-xl text-[var(--text)] mt-4 group-hover:text-[#1dbf73] transition-colors line-clamp-1">
          {task.title}
        </h2>

        <p className="text-[var(--muted)] text-sm mt-2.5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      </div>

      <div className="mx-6 mb-6 pt-4 border-t border-[var(--border)] flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] block font-bold">
            Budget
          </span>
          <span className="text-2xl font-black text-[#1dbf73] flex items-center transition-transform group-hover:scale-105">
            ${task.budget}
          </span>
        </div>

        <div className="text-right">
          <span className="text-xs text-[var(--muted)] flex items-center justify-end gap-1 mb-0.5">
            <Clock size={12} /> {formattedDate}
          </span>
          <span className="text-xs font-semibold text-[var(--text)] flex items-center justify-end gap-1">
            <Send size={11} className="text-[#1dbf73] transition-transform group-hover:translate-x-0.5" />
            {activeProposalsCount} Proposals
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
