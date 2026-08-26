import { CheckCircle2, Clock, Orbit, Send } from "lucide-react";

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

  return (
    <div className="glass-panel group relative rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/40 hover:shadow-2xl cursor-pointer flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start gap-4">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            {task.category || "General"}
          </span>

          <span
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border flex items-center gap-1.5 backdrop-blur-md whitespace-nowrap ${
              isCompleted
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 size={13} />
            ) : (
              <Orbit
                size={13}
                className="animate-spin"
                style={{ animationDuration: "3s" }}
              />
            )}
            {task.status}
          </span>
        </div>

        <h2 className="font-extrabold text-xl text-[var(--text)] mt-4 group-hover:text-amber-400 transition line-clamp-1">
          {task.title}
        </h2>

        <p className="text-[var(--muted)] text-sm mt-2.5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-[var(--muted)] block">
            Budget
          </span>
          <span className="text-2xl font-black text-amber-400 flex items-center">
            ${task.budget}
          </span>
        </div>

        <div className="text-right">
          <span className="text-xs text-[var(--muted)] flex items-center justify-end gap-1 mb-0.5">
            <Clock size={12} /> {formattedDate}
          </span>
          <span className="text-xs font-semibold text-[var(--text)] flex items-center justify-end gap-1">
            <Send size={11} className="text-amber-400" /> {activeProposalsCount}{" "}
            Proposals
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
