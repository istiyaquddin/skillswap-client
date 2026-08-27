import React from 'react';
import Link from 'next/link';
import { Star, ArrowRight, CheckCircle2, ShieldCheck, Circle } from 'lucide-react';

const FreelancerCard = ({ freelancer }) => {
  const freelancerId = freelancer._id || freelancer.id;

  const skillsList = (() => {
    if (Array.isArray(freelancer.skills)) {
      return freelancer.skills;
    }
    if (typeof freelancer.skills === "string" && freelancer.skills.trim() !== "") {
      return freelancer.skills.split(",").map(s => s.trim());
    }
    return ["React", "Tailwind", "Node.js"];
  })();

  const initial = freelancer.name ? freelancer.name[0].toUpperCase() : "F";

  return (
    <Link
      href={`/browse-freelancer/${freelancerId}`}
      className="block h-full text-left no-underline hover:no-underline"
    >
      <div className="glass-panel rounded-[2rem] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[#1dbf73]/40 hover:shadow-2xl flex flex-col justify-between h-full cursor-pointer group relative">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#1dbf73]/50 via-emerald-400/60 to-[#1dbf73]/30 opacity-60 group-hover:opacity-100 transition-opacity" />

        <div className="p-6">
          {/* Header: Avatar + Name + Status */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <div className="amber-gradient amber-glow w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg uppercase shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {initial}
                </div>
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-[var(--surface-strong)]">
                  <CheckCircle2 size={10} />
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[var(--text)] group-hover:text-[#1dbf73] transition-colors leading-tight">
                  {freelancer.name}
                </h3>
                <p className="text-xs font-semibold text-[#1dbf73] mt-0.5 flex items-center gap-1">
                  <ShieldCheck size={11} className="inline" />
                  {freelancer.title || "Vetted Specialist"}
                </p>
              </div>
            </div>

            {/* Available status dot */}
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 text-[10px] font-bold text-emerald-400 shrink-0">
              <Circle size={6} className="fill-emerald-400 text-emerald-400 animate-pulse" />
              Available
            </div>
          </div>

          <p className="text-[var(--muted)] text-xs line-clamp-2 mb-4 leading-relaxed">
            {freelancer.bio || "Specialized professional ready to collaborate on high-impact projects."}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {skillsList.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)] transition-all group-hover:border-[#1dbf73]/30 group-hover:text-[#1dbf73]"
              >
                {skill}
              </span>
            ))}
            {skillsList.length > 3 && (
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]">
                +{skillsList.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="mx-6 mb-6 border-t border-[var(--border)] pt-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 transition-transform group-hover:scale-110 group-hover:rotate-12 drop-shadow-[0_0_3px_rgba(251,191,36,0.5)]" />
            <span className="font-extrabold text-[var(--text)]">{freelancer.rating || "5.0"}</span>
            <span className="text-[var(--muted)] text-[11px]">(Verified)</span>
          </div>

          <span className="text-[#1dbf73] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View Profile <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default FreelancerCard;