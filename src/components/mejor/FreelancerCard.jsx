import React from 'react';
import Link from 'next/link';
import { Star, ArrowRight, CheckCircle2 } from 'lucide-react';

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

  return (
    <Link 
      href={`/browse-freelancer/${freelancerId}`} 
      className="block h-full text-left no-underline hover:no-underline"
    >
      <div className="glass-panel rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/40 hover:shadow-2xl flex flex-col justify-between h-full cursor-pointer group">
        <div>
          <div className="flex items-center gap-3.5 mb-4">
            <div className="amber-gradient amber-glow w-13 h-13 rounded-2xl flex items-center justify-center text-white font-black text-xl uppercase shadow-md transition-transform duration-300 group-hover:scale-105">
              {freelancer.name ? freelancer.name[0] : 'F'}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[var(--text)] group-hover:text-amber-400 transition-colors leading-tight">
                {freelancer.name}
              </h3>
              <p className="text-xs font-semibold text-amber-400 mt-1">
                {freelancer.title || "Vetted Specialist"}
              </p>
            </div>
          </div>

          <p className="text-[var(--muted)] text-xs line-clamp-2 mb-4 leading-relaxed">
            {freelancer.bio || "Specialized professional ready to collaborate on high-impact projects."}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {skillsList.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-3.5 mt-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-extrabold text-[var(--text)]">{freelancer.rating || "5.0"}</span>
            <span className="text-[var(--muted)] text-[11px]">(Verified)</span>
          </div>
          
          <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View Profile <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default FreelancerCard;