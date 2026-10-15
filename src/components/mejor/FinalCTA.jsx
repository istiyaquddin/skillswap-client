"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Users,
  Zap,
} from "lucide-react";

export default function FinalCTA() {
  const { data: session } = authClient.useSession();
  const [selectedRole, setSelectedRole] = useState("freelancer");

  const getDashboardHref = (role) => {
    if (role === "admin") return "/dashboard/admin";
    if (role === "freelancer") return "/dashboard/freelancer";
    return "/dashboard/client";
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" id="cta">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[32rem] w-[32rem] rounded-full bg-[#1dbf73]/15 blur-[160px] animate-pulse" />
      </div>

      <div className="relative mx-auto w-[95%] lg:w-[78%]">
        <div className="glass-panel relative rounded-[3rem] p-8 sm:p-14 border border-[#1dbf73]/30 shadow-2xl overflow-hidden text-center space-y-8 bg-gradient-to-b from-[var(--surface-strong)] to-[var(--surface)]">
          {/* Subtle top shimmer bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-[#1dbf73] to-cyan-500" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1dbf73]/30 bg-[#1dbf73]/10 px-4 py-1.5 text-xs font-bold text-[#1dbf73] backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Join 3,800+ Students Across Campuses
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-2xl mx-auto">
            {session?.user ? (
              <>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text)]">
                  Welcome back,{" "}
                  <span className="amber-text-gradient">{session.user.name || "Scholar"}</span>!
                </h2>
                <p className="text-sm sm:text-base text-[var(--muted)]">
                  Ready to launch your next project or check for incoming proposals? Head straight to your dashboard.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text)]">
                  Ready to Exchange Skills &{" "}
                  <span className="amber-text-gradient">Earn on Campus</span>?
                </h2>
                <p className="text-sm sm:text-base text-[var(--muted)]">
                  Create your free account in 60 seconds. Post a gig, bid on active projects, and enjoy guaranteed Stripe escrow protection.
                </p>
              </>
            )}
          </div>

          {/* Dynamic Action Area */}
          {session?.user ? (
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href={getDashboardHref(session.user.role)}
                className="amber-gradient amber-glow inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl group"
              >
                Go to {session.user.role ? session.user.role.toUpperCase() : "MY"} Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/browse-task"
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-4 text-sm font-bold text-[var(--text)] hover:border-[#1dbf73]/40 hover:text-[#1dbf73] transition-all"
              >
                Browse Open Tasks
              </Link>
            </div>
          ) : (
            <div className="space-y-6 pt-2">
              {/* Interactive Role Selector */}
              <div className="inline-flex items-center p-1 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-xs">
                <button
                  onClick={() => setSelectedRole("freelancer")}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedRole === "freelancer"
                      ? "bg-[#1dbf73] text-white shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  I want to Earn (Freelancer)
                </button>
                <button
                  onClick={() => setSelectedRole("client")}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedRole === "client"
                      ? "bg-[#1dbf73] text-white shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  I want to Hire (Client)
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={`/signup?role=${selectedRole}`}
                  className="amber-gradient amber-glow inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl group"
                >
                  Get Started as a {selectedRole === "client" ? "Client" : "Freelancer"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-7 py-4 text-sm font-bold text-[var(--text)] hover:border-[#1dbf73]/40 hover:text-[#1dbf73] transition-all"
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="pt-6 border-t border-[var(--border)] flex flex-wrap justify-center items-center gap-6 text-xs font-semibold text-[var(--muted)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#1dbf73]" />
              <span>Stripe Escrow Milestone Guard</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-blue-500" />
              <span>Campus ID Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>0% Student Commission</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
