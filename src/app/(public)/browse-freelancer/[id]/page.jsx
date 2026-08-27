"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail, Star, ChevronLeft, Layers, Loader2, ShieldCheck,
  CheckCircle2, MapPin, Briefcase, Clock, Zap, Award,
  Code, Palette, Globe, ArrowRight, MessageSquare,
} from "lucide-react";
import { getFreelancerDetails } from "@/lib/api/tasks";

// Mock portfolio items for a richer profile page
const mockPortfolio = [
  { title: "E-Commerce Platform", stack: "Next.js · Stripe · Tailwind", category: "Web Dev" },
  { title: "Brand Identity Kit", stack: "Figma · Illustrator", category: "Design" },
  { title: "API Microservice", stack: "Node.js · Express · MongoDB", category: "Backend" },
];

const mockStats = [
  { label: "Projects Done", value: "12", icon: Briefcase },
  { label: "Avg Response", value: "< 2h", icon: Clock },
  { label: "Rating", value: "5.0", icon: Star },
  { label: "Skills", value: "8+", icon: Zap },
];

export default function FreelancerDetailsPage() {
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
        if (data && !data.error) setFreelancer(data);
        else setFreelancer(null);
      } catch {
        setFreelancer(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 font-sans text-[var(--muted)]">
        <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
        <p className="text-xs font-bold tracking-widest uppercase">Loading Profile...</p>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="max-w-md mx-auto mt-16 glass-panel rounded-[2.5rem] p-10 text-center space-y-4 font-sans">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-7 h-7 text-amber-400" />
        </div>
        <h2 className="text-lg font-extrabold text-[var(--text)]">Freelancer Not Found</h2>
        <p className="text-sm text-[var(--muted)]">This profile may have been removed or the link is incorrect.</p>
        <button
          onClick={() => router.back()}
          className="amber-gradient amber-glow text-white font-bold text-xs px-6 py-3 rounded-full uppercase tracking-widest transition hover:scale-105"
        >
          Go Back
        </button>
      </div>
    );
  }

  const skills = Array.isArray(freelancer.skills)
    ? freelancer.skills
    : typeof freelancer.skills === "string" && freelancer.skills.trim()
    ? freelancer.skills.split(",").map((s) => s.trim())
    : ["React", "Tailwind CSS", "Node.js", "JavaScript", "TypeScript", "Figma"];

  const initials = freelancer.name ? freelancer.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "FS";
  const firstName = freelancer.name?.split(" ")[0] || "Freelancer";

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-6 font-sans text-[var(--text)] min-h-screen">

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--muted)] hover:text-amber-400 transition-all cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Freelancers
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN — Profile Card */}
        <div className="lg:col-span-1 space-y-4">

          {/* Identity Card */}
          <div className="glass-panel rounded-[2.5rem] p-6 text-center space-y-4 border border-[var(--border)]">
            {/* Avatar */}
            <div className="relative mx-auto w-fit">
              {freelancer.image && freelancer.image.startsWith("http") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={freelancer.image} alt={freelancer.name} className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-500/40 mx-auto" />
              ) : (
                <div className="w-24 h-24 rounded-2xl amber-gradient flex items-center justify-center text-white font-black text-3xl mx-auto shadow-lg">
                  {initials}
                </div>
              )}
              <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-1 border-2 border-[var(--surface-strong)]">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Name & Title */}
            <div className="space-y-1">
              <h1 className="text-xl font-black text-[var(--text)]">{freelancer.name}</h1>
              <p className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {freelancer.title || "Verified Campus Specialist"}
              </p>
              <div className="flex items-center justify-center gap-1 pt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-amber-400 ml-1">5.0</span>
              </div>
            </div>

            {/* Meta Info */}
            <div className="space-y-2 text-xs text-[var(--muted)] font-semibold text-left border-t border-[var(--border)] pt-4">
              {freelancer.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{freelancer.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Campus Network</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Available for Remote Projects</span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href={`mailto:${freelancer.email || ""}`}
              className="w-full py-3 amber-gradient amber-glow text-white font-extrabold text-xs uppercase tracking-widest rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] transition active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4" />
              Contact {firstName}
            </Link>
            <Link
              href="/dashboard/client/tasks/post-task"
              className="w-full py-3 border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text)] font-bold text-xs uppercase tracking-widest rounded-full flex items-center justify-center gap-2 hover:border-amber-400 hover:text-amber-400 transition"
            >
              Hire for a Project <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {mockStats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="glass-panel rounded-2xl p-4 text-center space-y-1 border border-[var(--border)] hover:border-amber-500/30 transition">
                  <Icon className="w-4 h-4 text-amber-400 mx-auto" />
                  <p className="text-lg font-black text-[var(--text)]">{s.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN — Main Content */}
        <div className="lg:col-span-2 space-y-5">

          {/* Bio */}
          <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 space-y-4 border border-[var(--border)]">
            <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">About Me</h2>
            <p className="text-sm leading-relaxed text-[var(--text)]">
              {freelancer.bio ||
                `Hi, I'm ${firstName} — a verified campus creator on SkillSwap. I specialize in delivering high-quality, production-ready work on time and within budget. My projects are covered by SkillSwap's escrow protection, so you never pay until you're satisfied. Feel free to reach out to discuss your project!`}
            </p>
          </div>

          {/* Skills */}
          <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 space-y-4 border border-[var(--border)]">
            <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] flex items-center gap-2">
              <Code className="w-3.5 h-3.5 text-amber-400" /> Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-[var(--surface-strong)] border border-[var(--border)] text-[var(--text)] px-3.5 py-1.5 rounded-xl text-xs font-bold hover:border-amber-500/40 hover:text-amber-400 transition"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 space-y-4 border border-[var(--border)]">
            <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-amber-400" /> Sample Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {mockPortfolio.map((item, i) => (
                <div
                  key={i}
                  className="bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl p-4 space-y-2 hover:border-amber-500/30 transition"
                >
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {item.category}
                  </span>
                  <p className="text-sm font-bold text-[var(--text)]">{item.title}</p>
                  <p className="text-[10px] text-[var(--muted)] font-semibold">{item.stack}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Work History */}
          <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 space-y-4 border border-[var(--border)]">
            <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" /> Work History & Reviews
            </h2>
            <div className="text-center py-8 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-strong)]">
              <Award className="w-8 h-8 text-amber-400/40 mx-auto mb-2" />
              <p className="text-xs font-bold text-[var(--muted)]">No completed projects yet</p>
              <p className="text-[10px] text-[var(--muted)] mt-1">Reviews will appear here after first contract completion.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}