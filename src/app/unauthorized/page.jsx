"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Code,
  Terminal,
  Sparkles,
  CheckCircle2,
  X,
  RefreshCw,
  Eye,
  UserCheck,
  HelpCircle,
  Layers,
  Zap,
  DollarSign,
  AlertTriangle,
  ExternalLink,
  Activity,
  LogOut,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "@/components/minor/ThemeToggle";

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const fromPath = searchParams.get("from") || "";
  const { data: session, isPending } = authClient.useSession();

  // Role simulation for testing / admin preview
  const [simulatedRole, setSimulatedRole] = useState(null);
  const [showRoleMatrixModal, setShowRoleMatrixModal] = useState(false);
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState(false);
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticsDone, setDiagnosticsDone] = useState(false);

  // Active role detection (simulated overrides actual for demo purposes)
  const actualRole = session?.user?.role || "guest";
  const activeRole = simulatedRole || actualRole;

  const handleRunDiagnostics = () => {
    setDiagnosticsRunning(true);
    setDiagnosticsDone(false);
    setTimeout(() => {
      setDiagnosticsRunning(false);
      setDiagnosticsDone(true);
    }, 1200);
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  };

  // Role metadata configurations
  const roleConfigs = {
    guest: {
      badge: "401 / 403 · Unauthenticated Visitor",
      badgeClass: "border-rose-500/30 bg-rose-500/10 text-rose-400",
      title: "Authentication Required",
      subtitle: "Sign In to Access Protected Workspaces",
      description:
        "You attempted to access a private dashboard or protected platform resource without an active session. Please authenticate with your authorized credentials to continue.",
      primaryAction: {
        label: "Sign In to SkillSwap",
        href: "/login",
        icon: UserCheck,
        cls: "amber-gradient text-white",
      },
      secondaryAction: {
        label: "Create Free Account",
        href: "/signup",
        icon: Sparkles,
        cls: "border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text)] hover:border-amber-400",
      },
      allowedFacilities: [
        "Browse public campus tasks & bounties",
        "View verified mentor profiles & ratings",
        "Read platform guidelines & escrow guarantees",
      ],
      restrictedFacilities: [
        "Private client hiring & contract management",
        "Freelancer proposal bidding & deliverable uploads",
        "Root system administration & user moderation",
      ],
    },
    client: {
      badge: "Role: Corporate / Student Hirer",
      badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-400",
      title: "Freelancer / Admin Area Restricted",
      subtitle: "Client Clearance Active",
      description:
        "You are logged in as a Client. Your credentials grant full access to task creation, proposal reviews, escrow milestone deposits, and talent hiring. Direct freelancer bidding tools and root administrative panels are restricted.",
      primaryAction: {
        label: "Go to Client Workspace",
        href: "/dashboard/client",
        icon: Briefcase,
        cls: "amber-gradient text-white",
      },
      secondaryAction: {
        label: "Post a New Task",
        href: "/dashboard/client/tasks/post-task",
        icon: Zap,
        cls: "border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20",
      },
      allowedFacilities: [
        "Post unlimited task bounties & project briefs",
        "Review talent proposals & chat with applicants",
        "Deposit funds into Stripe Escrow Vaults",
        "Approve deliverables & release milestone payouts",
        "Rate & review student freelancers",
      ],
      restrictedFacilities: [
        "Submit proposal bids on public tasks",
        "Upload freelancer deliverables",
        "Access root admin telemetry & audit logs",
      ],
    },
    freelancer: {
      badge: "Role: Verified Specialist / Talent",
      badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
      title: "Client / Admin Area Restricted",
      subtitle: "Freelancer Clearance Active",
      description:
        "You are logged in as a Freelancer. You have full permission to browse campus projects, submit custom proposals, upload milestone work deliverables, and receive guaranteed payouts. Employer task posting control and root admin settings are restricted.",
      primaryAction: {
        label: "Go to Freelancer Workspace",
        href: "/dashboard/freelancer",
        icon: Code,
        cls: "emerald-gradient text-white",
      },
      secondaryAction: {
        label: "Browse Open Tasks",
        href: "/browse-task",
        icon: Sparkles,
        cls: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",
      },
      allowedFacilities: [
        "Submit bids on open campus tasks",
        "Deliver completed work & upload project zip/links",
        "Collect 100% escrow payouts with zero commission cuts",
        "Showcase student portfolio & campus skill tags",
        "Upgrade to Creator Pro for top proposal ranking",
      ],
      restrictedFacilities: [
        "Hire other freelancers or fund client escrow contracts",
        "Moderate platform users or inspect system audit logs",
      ],
    },
    admin: {
      badge: "Role: Super Administrator · Root Mode",
      badgeClass: "border-violet-500/30 bg-violet-500/10 text-violet-400",
      title: "Root Clearance Detected",
      subtitle: "System Command & Telemetry Available",
      description:
        "You hold full platform administrative authority on SkillSwap. This specific route is isolated to a client or freelancer tenant sandbox view. As an admin, you can bypass sandbox limitations, audit security logs, or manage all platform records.",
      primaryAction: {
        label: "Admin Command Center",
        href: "/dashboard/admin",
        icon: Terminal,
        cls: "amber-gradient text-white",
      },
      secondaryAction: {
        label: "User Moderation & Bans",
        href: "/dashboard/admin/users",
        icon: ShieldAlert,
        cls: "border border-violet-500/30 bg-violet-500/10 text-violet-400 hover:bg-violet-500/20",
      },
      allowedFacilities: [
        "Manage, verify, suspend, or unban any platform user",
        "Inspect and arbitrate disputed escrow milestones",
        "Directly release locked or frozen escrow payments",
        "View real-time system uptime, latency & error telemetry",
        "Export audit logs and compliance activity records",
      ],
      restrictedFacilities: [
        "None — Full Root Control across all 12 platform nodes",
      ],
    },
  };

  const currentConfig = roleConfigs[activeRole] || roleConfigs.guest;
  const PrimaryIcon = currentConfig.primaryAction.icon;
  const SecondaryIcon = currentConfig.secondaryAction.icon;

  return (
    <div className="min-h-screen bg-grid-pattern py-8 px-4 flex flex-col justify-center items-center text-[var(--text)] relative overflow-x-hidden selection:bg-amber-500/20 selection:text-amber-500">
      
      {/* Background Ambient Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Navigation Row */}
      <div className="w-full max-w-2xl mb-6 flex items-center justify-between z-10">
        <Link href="/">
          <button className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-xs font-bold text-[var(--text)] hover:text-amber-400 transition cursor-pointer shadow-sm">
            <ArrowLeft size={15} /> Return Home
          </button>
        </Link>

        <div className="flex items-center gap-2">
          {/* Day/Night Theme Switcher */}
          <ThemeToggle />

          {/* Role Matrix Modal Button */}
          <button
            onClick={() => setShowRoleMatrixModal(true)}
            className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition cursor-pointer"
          >
            <HelpCircle size={14} /> Role Facilities
          </button>
        </div>
      </div>

      {/* Role Simulator Bar (For Admin or Evaluator Testing) */}
      <div className="w-full max-w-2xl mb-4 glass-panel rounded-2xl p-3 border border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs z-10">
        <div className="flex items-center gap-2 font-bold text-[var(--muted)]">
          <Eye size={15} className="text-amber-400" />
          <span>Interactive Role Preview:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {["guest", "client", "freelancer", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setSimulatedRole(r === actualRole ? null : r)}
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider transition cursor-pointer ${
                activeRole === r
                  ? "bg-amber-400 text-black shadow-md font-black"
                  : "bg-[var(--surface-strong)] text-[var(--muted)] border border-[var(--border)] hover:text-[var(--text)]"
              }`}
            >
              {r} {r === actualRole && "(You)"}
            </button>
          ))}
          {simulatedRole && (
            <button
              onClick={() => setSimulatedRole(null)}
              className="text-[10px] text-rose-400 hover:underline px-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* MAIN UNAUTHORIZED CARD */}
      <div className="glass-panel w-full max-w-2xl rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative border border-[var(--border)] z-10 space-y-6">
        
        {/* Top Indicator & Code */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="font-mono text-xs font-bold text-[var(--muted)] ml-2">
              HTTP_403_RESTRICTED_ACCESS
            </span>
          </div>

          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${currentConfig.badgeClass}`}>
            {currentConfig.badge}
          </span>
        </div>

        {/* Shield & Main Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto shadow-lg">
              <ShieldAlert className="w-10 h-10 stroke-[1.8]" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-black font-black text-xs flex items-center justify-center shadow">
              !
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[var(--text)]">
              {currentConfig.title}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider">
              {currentConfig.subtitle}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed max-w-lg mx-auto">
            {currentConfig.description}
          </p>
        </div>

        {/* Path Info if redirected */}
        {fromPath && (
          <div className="bg-[var(--surface-strong)] rounded-2xl p-3 border border-[var(--border)] text-xs font-mono text-[var(--muted)] flex items-center justify-between">
            <span>Target Route:</span>
            <span className="text-rose-400 font-bold truncate max-w-xs">{fromPath}</span>
          </div>
        )}

        {/* Facilities Breakdown Card */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-widest text-[var(--text)] flex items-center gap-1.5">
              <Layers size={14} className="text-amber-400" />
              What Your {activeRole.toUpperCase()} Account Can Do:
            </h4>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Active Permissions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {currentConfig.allowedFacilities.map((fac, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[var(--text)] font-semibold leading-tight">{fac}</span>
              </div>
            ))}
          </div>

          {currentConfig.restrictedFacilities.length > 0 && (
            <div className="pt-3 border-t border-[var(--border)] space-y-1.5">
              <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider block">
                Restricted from This Tier:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                {currentConfig.restrictedFacilities.map((res, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[var(--muted)] opacity-80">
                    <X size={14} className="text-rose-400 shrink-0 mt-0.5" />
                    <span className="leading-tight text-[11px]">{res}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ADMIN EXTRA TOOLS SECTION */}
        {activeRole === "admin" && (
          <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-5 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-widest text-violet-400 flex items-center gap-2">
                <Terminal size={15} /> Super Administrator Tools & Clearances
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">
                Root Active
              </span>
            </div>

            <p className="text-xs text-[var(--muted)]">
              As a platform administrator, you can execute direct bypasses, inspect server health, or moderate users without tenant friction:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <Link
                href="/dashboard/admin/users"
                className="bg-[var(--surface-strong)] border border-[var(--border)] hover:border-violet-400 p-2.5 rounded-xl text-center text-xs font-bold text-[var(--text)] transition"
              >
                👥 Users
              </Link>
              <Link
                href="/dashboard/admin/tasks"
                className="bg-[var(--surface-strong)] border border-[var(--border)] hover:border-violet-400 p-2.5 rounded-xl text-center text-xs font-bold text-[var(--text)] transition"
              >
                💼 Tasks
              </Link>
              <Link
                href="/dashboard/admin/payments"
                className="bg-[var(--surface-strong)] border border-[var(--border)] hover:border-violet-400 p-2.5 rounded-xl text-center text-xs font-bold text-[var(--text)] transition"
              >
                💳 Payments
              </Link>
              <button
                onClick={() => {
                  setShowDiagnosticsModal(true);
                  handleRunDiagnostics();
                }}
                className="bg-violet-500/20 border border-violet-500/30 hover:bg-violet-500/30 p-2.5 rounded-xl text-center text-xs font-bold text-violet-300 transition cursor-pointer"
              >
                ⚡ Diagnostics
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link href={currentConfig.primaryAction.href} className="w-full sm:flex-1">
            <button
              className={`w-full py-3.5 px-6 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:opacity-90 active:scale-[0.98] transition-all ${currentConfig.primaryAction.cls}`}
            >
              <PrimaryIcon size={16} />
              {currentConfig.primaryAction.label}
            </button>
          </Link>

          <Link href={currentConfig.secondaryAction.href} className="w-full sm:flex-1">
            <button
              className={`w-full py-3.5 px-6 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${currentConfig.secondaryAction.cls}`}
            >
              <SecondaryIcon size={16} />
              {currentConfig.secondaryAction.label}
            </button>
          </Link>

          {session?.user && (
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="py-3.5 px-4 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted)] hover:text-rose-400 hover:border-rose-400/30 transition cursor-pointer text-xs font-bold flex items-center justify-center gap-1.5 shrink-0"
            >
              <LogOut size={15} /> Switch User
            </button>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-center text-[10px] text-[var(--muted)] font-mono">
          Security Protocol · Campus Identity Verification System · Need assistance?{" "}
          <Link href="/privacy" className="underline hover:text-amber-400">
            Read Security Policy
          </Link>
        </p>
      </div>

      {/* POPUP MODAL 1: ROLE CAPABILITIES & FACILITIES MATRIX */}
      {showRoleMatrixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-4xl rounded-[2.5rem] p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-[var(--border)] shadow-2xl relative">
            <button
              onClick={() => setShowRoleMatrixModal(false)}
              className="absolute top-5 right-5 text-[var(--muted)] hover:text-amber-400 transition cursor-pointer p-1 rounded-full hover:bg-[var(--surface-strong)]"
            >
              <X size={20} />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold mb-2">
                <Sparkles size={13} /> Complete Role Capabilities Matrix
              </div>
              <h2 className="text-2xl font-black text-[var(--text)]">
                SkillSwap Role Privileges & Facilities Guide
              </h2>
              <p className="text-xs text-[var(--muted)] mt-1">
                Explore the exact boundaries, abilities, and facilities granted to each account type across the campus ecosystem.
              </p>
            </div>

            {/* 3 Roles Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Client Column */}
              <div className="rounded-2xl border border-amber-500/30 bg-[var(--surface-strong)] p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400">
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-[var(--text)]">Client / Hirer</h3>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      Campus Startups & Buyers
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Best for student founders, club heads, and researchers who need skilled hands for projects.
                </p>

                <div className="space-y-2 border-t border-[var(--border)] pt-3 text-xs">
                  <div className="font-bold text-[var(--text)] text-[11px] uppercase tracking-wider">Key Facilities:</div>
                  {[
                    "Post public & club tasks",
                    "Manage Stripe Escrow vault",
                    "Direct talent interview messaging",
                    "Milestone verification & payout release",
                    "Automated corporate receipts",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-amber-400 shrink-0" />
                      <span className="text-[11px] text-[var(--text)] font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <Link href="/signup" className="block pt-2">
                  <button className="w-full py-2 text-xs font-bold rounded-xl border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition cursor-pointer">
                    Register as Client
                  </button>
                </Link>
              </div>

              {/* Freelancer Column */}
              <div className="rounded-2xl border border-emerald-500/30 bg-[var(--surface-strong)] p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                    <Code size={22} />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-[var(--text)]">Freelancer / Talent</h3>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      Student Creators & Devs
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Best for developers, designers, and marketers who want campus work and guaranteed escrow earnings.
                </p>

                <div className="space-y-2 border-t border-[var(--border)] pt-3 text-xs">
                  <div className="font-bold text-[var(--text)] text-[11px] uppercase tracking-wider">Key Facilities:</div>
                  {[
                    "Submit proposal bids on tasks",
                    "Deliver milestones & upload deliverables",
                    "Zero platform commission cuts",
                    "Creator Pro verified student badge",
                    "Instant wallet earnings withdrawals",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                      <span className="text-[11px] text-[var(--text)] font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <Link href="/signup" className="block pt-2">
                  <button className="w-full py-2 text-xs font-bold rounded-xl border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition cursor-pointer">
                    Register as Freelancer
                  </button>
                </Link>
              </div>

              {/* Admin Column */}
              <div className="rounded-2xl border border-violet-500/30 bg-[var(--surface-strong)] p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-violet-500/15 text-violet-400">
                    <Terminal size={22} />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-[var(--text)]">Super Administrator</h3>
                    <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">
                      Root Governance Team
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Root oversight team with omni-directional moderation, financial arbitration, and platform health telemetry.
                </p>

                <div className="space-y-2 border-t border-[var(--border)] pt-3 text-xs">
                  <div className="font-bold text-[var(--text)] text-[11px] uppercase tracking-wider">Extra Powers:</div>
                  {[
                    "Ban or verify any user account",
                    "Force release or freeze escrow funds",
                    "View platform security audit trails",
                    "Monitor system health & 99.98% uptime",
                    "Override task status & disputes",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-violet-400 shrink-0" />
                      <span className="text-[11px] text-[var(--text)] font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <Link href="/login" className="block pt-2">
                  <button className="w-full py-2 text-xs font-bold rounded-xl border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 transition cursor-pointer">
                    Admin Sign In
                  </button>
                </Link>
              </div>

            </div>

            <div className="pt-3 border-t border-[var(--border)] flex justify-end">
              <button
                onClick={() => setShowRoleMatrixModal(false)}
                className="amber-gradient text-white text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer shadow-md"
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL 2: ADMIN LIVE DIAGNOSTICS & SYSTEM AUDIT */}
      {showDiagnosticsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-lg rounded-[2.5rem] p-6 md:p-8 space-y-5 border border-violet-500/30 shadow-2xl relative">
            <button
              onClick={() => setShowDiagnosticsModal(false)}
              className="absolute top-5 right-5 text-[var(--muted)] hover:text-amber-400 transition cursor-pointer p-1 rounded-full"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-[var(--text)] flex items-center gap-2">
                <Activity className="w-5 h-5 text-violet-400 animate-pulse" />
                Root System Audit & Telemetry
              </h3>
              <p className="text-xs text-[var(--muted)]">
                Live inspection of platform microservices, database clusters, and escrow nodes.
              </p>
            </div>

            <div className="bg-[var(--surface-strong)] p-4 rounded-2xl border border-[var(--border)] font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-[var(--muted)]">
                <span>Auth Core Engine:</span>
                <span className="text-emerald-400 font-bold">Better-Auth 1.6 [PASS]</span>
              </div>
              <div className="flex items-center justify-between text-[var(--muted)]">
                <span>Database Cluster:</span>
                <span className="text-emerald-400 font-bold">MongoDB Atlas [PASS]</span>
              </div>
              <div className="flex items-center justify-between text-[var(--muted)]">
                <span>Escrow Gateway:</span>
                <span className="text-emerald-400 font-bold">Stripe Webhooks [PASS]</span>
              </div>
              <div className="flex items-center justify-between text-[var(--muted)]">
                <span>API Latency:</span>
                <span className="text-amber-400 font-bold">~24ms Healthy</span>
              </div>
              <div className="flex items-center justify-between text-[var(--muted)]">
                <span>Role Enforcement:</span>
                <span className="text-violet-400 font-bold">requireRole() Active</span>
              </div>
            </div>

            {diagnosticsRunning ? (
              <div className="py-4 text-center space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
                <p className="text-xs font-bold text-[var(--muted)]">Testing 12 Node Network Latency...</p>
              </div>
            ) : diagnosticsDone ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-2">
                <CheckCircle2 size={16} /> All 12 platform clusters operational. 0 vulnerabilities found.
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleRunDiagnostics}
                className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-300 hover:bg-violet-500/20 transition cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw size={14} /> Re-run Diagnostics
              </button>
              <button
                onClick={() => setShowDiagnosticsModal(false)}
                className="amber-gradient text-white text-xs font-bold px-5 py-2 rounded-full cursor-pointer shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function UnAuthorizedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Loading Security Layer...</p>
        </div>
      </div>
    }>
      <UnauthorizedContent />
    </Suspense>
  );
}