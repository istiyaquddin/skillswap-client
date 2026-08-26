"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mail, Star, ChevronLeft, Layers, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { getFreelancerDetails } from "@/lib/api/tasks";

const FreelancerDetailsPage = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getFreelancerDetails(id);
        if (data && !data.error) {
          setFreelancer(data);
        } else {
          setFreelancer(null);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setFreelancer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 font-sans text-[var(--muted)]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <p className="text-xs font-bold tracking-widest uppercase">Loading profile details...</p>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="glass-panel text-center mt-12 font-sans p-8 max-w-md mx-auto rounded-[2rem] space-y-4">
        <p className="text-base font-extrabold text-[var(--text)]">Freelancer Profile Not Found!</p>
        <button 
          onClick={() => router.back()} 
          className="px-5 py-2 amber-gradient amber-glow text-white text-xs uppercase font-black tracking-widest rounded-full transition cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const renderSkills = () => {
    if (Array.isArray(freelancer.skills)) return freelancer.skills;
    if (typeof freelancer.skills === "string" && freelancer.skills.trim() !== "") {
      return freelancer.skills.split(",").map((s) => s.trim());
    }
    return ["React", "Tailwind CSS", "Node.js", "JavaScript"]; 
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 font-sans text-[var(--text)] min-h-screen">
      
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--muted)] hover:text-amber-400 transition-all mb-4 cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> 
        Back to Freelancers
      </button>

      {/* Main Profile Card */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[var(--border)]">
          
          {/* Avatar & Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl amber-gradient amber-glow flex items-center justify-center text-white font-black text-2xl md:text-3xl uppercase shadow-md shrink-0">
                {freelancer.name ? freelancer.name[0] : 'F'}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-[var(--surface-strong)]">
                <CheckCircle2 size={12} />
              </span>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-[var(--text)] leading-tight">{freelancer.name}</h1>
              <p className="text-xs text-amber-400 font-extrabold tracking-wide flex items-center gap-1">
                <ShieldCheck size={13} /> {freelancer.title || "Vetted Specialist"}
              </p>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[var(--muted)] font-bold">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-[var(--text)]">{freelancer.rating || "5.0"}</span> (0 reviews)
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  {freelancer.email || freelancer.client_email}
                </span>
              </div>
            </div>
          </div>

          {/* Hire Button */}
          <a 
            href={`mailto:${freelancer.email || freelancer.client_email}`}
            className="w-full md:w-auto text-center amber-gradient amber-glow shine-button text-white font-extrabold text-xs uppercase tracking-widest px-6 py-3.5 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            Hire {freelancer.name?.split(" ")[0]}
          </a>
        </div>

        {/* Bio / Description */}
        <div className="py-2 space-y-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">
            About Me
          </h3>
          <p className="text-[var(--text)] text-sm md:text-base leading-relaxed bg-[var(--surface-strong)] p-5 rounded-2xl border border-[var(--border)]">
            {freelancer.bio || "This freelancer hasn't added a bio yet. Hire them to discuss your project guidelines directly!"}
          </p>
        </div>

        {/* Skills Section */}
        <div className="pt-4 space-y-3 border-t border-[var(--border)]">
          <h3 className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">
            Skills & Expertise
          </h3>
          <div className="flex flex-wrap gap-2">
            {renderSkills().map((skill, index) => (
              <span 
                key={index} 
                className="bg-[var(--surface-strong)] border border-[var(--border)] text-[var(--text)] px-3.5 py-1.5 rounded-xl text-xs font-bold"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Work History */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center gap-2 border-b border-[var(--border)] pb-4">
          <Layers className="w-3.5 h-3.5" />
          Work History & Reviews
        </h3>
        <p className="text-[var(--muted)] text-xs font-bold uppercase tracking-widest mt-4">
          No completed projects recorded yet on SkillSwap.
        </p>
      </div>

    </div>
  );
};

export default FreelancerDetailsPage;