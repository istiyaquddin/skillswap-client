"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Input, Button } from "@heroui/react";
import {
  User,
  Mail,
  ImageIcon,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Code,
  Sparkles,
  Briefcase,
  CheckCircle2,
  Zap,
  Building2,
  ShieldCheck,
  ChevronRight,
  ShieldAlert,
  X,
  Info,
  UserCheck,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export const PLAN_DETAILS = {
  free: {
    id: "free",
    name: "Student Starter",
    badge: "Free Forever",
    price: "$0",
    period: "/forever",
    tagline: "Ideal for freshmen & casual learners — browse, bid, and learn with zero cost.",
    icon: Zap,
    accent: "emerald",
    popular: false,
    facilities: [
      "Browse unlimited campus tasks",
      "Submit up to 5 proposals / month",
      "Public campus student profile",
      "Stripe escrow milestone security",
      "Standard campus community support",
      "Basic portfolio showcase",
    ],
    rolePerks: {
      client: "Free task posting with automated milestone escrow protection.",
      freelancer: "Zero upfront fees. Bid on tasks and build your first campus ratings.",
    },
  },
  pro: {
    id: "pro",
    name: "Creator Pro",
    badge: "Most Popular",
    price: "$9",
    period: "/month",
    tagline: "For active student freelancers looking for high bid priority and unlimited work.",
    icon: Sparkles,
    accent: "amber",
    popular: true,
    facilities: [
      "Unlimited monthly proposal bids",
      "Featured Verified Student Badge & portfolio spotlight",
      "Top-ranked proposal placement on client task boards",
      "Direct client messaging & instant project chat",
      "0% platform commission on all earnings",
      "Priority 24/7 campus escrow payout processing",
      "Access to exclusive high-budget bounties",
    ],
    rolePerks: {
      client: "Direct messaging with top talent & priority task highlight badges.",
      freelancer: "Unlimited bids, verified badge, and 3x higher hiring visibility.",
    },
  },
  team: {
    id: "team",
    name: "Startup & Club",
    badge: "Scale Up",
    price: "$29",
    period: "/month",
    tagline: "For student startups, labs, and campus organizations managing multiple hires.",
    icon: Building2,
    accent: "indigo",
    popular: false,
    facilities: [
      "Post unlimited tasks & campus bounties",
      "Up to 5 collaborative team member seats",
      "Dedicated student manager support & arbitration",
      "Custom invoice billing & tax receipts",
      "Private task boards for university societies",
      "Candidate analytics & review logs",
      "Early access to top graduating talent",
      "Priority API & webhook integrations",
    ],
    rolePerks: {
      client: "Multi-seat management for student startup founders and lab directors.",
      freelancer: "Collaborate as an agency team under a shared brand.",
    },
  },
};

function SignupContent() {
  const searchParams = useSearchParams();
  const initialPlanParam = searchParams.get("plan")?.toLowerCase();
  const defaultPlanKey = initialPlanParam === "pro" ? "pro" : initialPlanParam === "team" ? "team" : "free";

  const [selectedPlan, setSelectedPlan] = useState(defaultPlanKey);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showAdminHelp, setShowAdminHelp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [role, setRole] = useState("client");

  const currentPlan = PLAN_DETAILS[selectedPlan] || PLAN_DETAILS.free;
  const PlanIcon = currentPlan.icon;

  const handleGoogleSignUp = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        newUserOptions: {
          data: {
            role,
            plan: selectedPlan,
          },
        },
      });
    } catch (error) {
      console.error("Google Auth Error:", error);
      toast.error("Google Authentication Failed");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setPasswordError("");

    const isLengthValid = password.length >= 6;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);

    if (!isLengthValid || !hasLowercase || !hasUppercase) {
      setPasswordError(
        "Password must be at least 6 characters long and contain at least one uppercase letter and one lowercase letter."
      );
      return;
    }

    const formData = new FormData(e.currentTarget);
    const baseData = Object.fromEntries(formData.entries());

    const payload = {
      name: baseData.name,
      email: baseData.email,
      password: baseData.password,
      image: baseData.image,
      role,
      plan: selectedPlan,
      skills: role === "freelancer" ? baseData.skills : undefined,
      bio: role === "freelancer" ? baseData.bio : undefined,
      hourlyRate: role === "freelancer" && baseData.hourlyRate ? Number(baseData.hourlyRate) : undefined,
    };

    const { error } = await authClient.signUp.email(payload);

    if (error) {
      toast.error(error.message || "Signup Failed");
      return;
    }

    toast.success(`Account created with ${currentPlan.name} plan!`);
    if (role === "freelancer") {
      window.location.href = "/dashboard/freelancer";
    } else {
      window.location.href = "/dashboard/client";
    }
  };

  const { data: session } = authClient.useSession();

  if (session?.user) {
    const userRole = session.user.role || "client";
    const dashboardHref = `/dashboard/${userRole}`;
    return (
      <div className="min-h-screen relative flex flex-col justify-center px-4 py-8 items-center bg-grid-pattern text-[var(--text)]">
        <div className="glass-panel w-full max-w-md rounded-[2.5rem] p-8 text-center space-y-6 shadow-2xl border border-[var(--border)] relative z-10 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-3xl amber-gradient mx-auto flex items-center justify-center text-white shadow-[0_8px_25px_rgba(245,158,11,0.35)]">
            <UserCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full border border-emerald-500/20">
              Active Session Detected
            </span>
            <h2 className="text-2xl font-black text-[var(--text)] tracking-tight">
              Welcome back, {session.user.name || "User"}!
            </h2>
            <p className="text-xs text-[var(--muted)] leading-relaxed max-w-xs mx-auto">
              You already have an active account as an authorized <strong className="text-amber-400 capitalize">{userRole}</strong>.
            </p>
          </div>

          <div className="p-3.5 bg-[var(--surface-strong)] rounded-2xl border border-[var(--border)] text-xs flex items-center justify-between font-mono">
            <span className="text-[var(--muted)]">Active Account:</span>
            <span className="text-amber-400 font-bold truncate max-w-44">{session.user.email}</span>
          </div>

          <div className="space-y-3 pt-2">
            <Link href={dashboardHref} className="block w-full">
              <button className="w-full py-3.5 px-6 amber-gradient amber-glow text-white font-extrabold text-xs uppercase tracking-widest rounded-full hover:scale-[1.02] active:scale-95 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                <span>Go to {userRole.toUpperCase()} Dashboard</span>
                <ChevronRight size={15} />
              </button>
            </Link>

            <button
              onClick={async () => {
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      toast.success("Signed out successfully");
                      window.location.reload();
                    },
                  },
                });
              }}
              className="w-full py-3 px-6 border border-[var(--border)] bg-[var(--surface-strong)] rounded-full text-xs font-bold text-[var(--muted)] hover:text-rose-400 hover:border-rose-400/30 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut size={14} />
              Sign Out & Register New Account
            </button>
          </div>

          <Link href="/" className="inline-block text-xs font-bold text-[var(--muted)] hover:text-amber-400 transition">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grid-pattern px-3 py-8 flex flex-col justify-center text-[var(--text)]">
      {/* Top Back Navigation */}
      <div className="mb-6 flex items-center justify-between mx-auto w-full max-w-xl">
        <Link href="/">
          <Button
            variant="light"
            size="sm"
            className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] font-semibold text-[var(--text)] hover:text-amber-400"
          >
            <ArrowLeft size={16} /> Back to Home
          </Button>
        </Link>

        {/* Quick Admin Portal Button */}
        <button
          type="button"
          onClick={() => setShowAdminHelp(!showAdminHelp)}
          className="text-xs font-bold text-[var(--muted)] hover:text-amber-400 transition flex items-center gap-1.5 cursor-pointer bg-[var(--surface-strong)] px-3 py-1.5 rounded-full border border-[var(--border)]"
        >
          <ShieldAlert size={14} className="text-amber-400" />
          Admin / Evaluator Info
        </button>
      </div>

      {/* Admin Quick Credentials Banner (Collapsible) */}
      {showAdminHelp && (
        <div className="mx-auto w-full max-w-xl mb-4 glass-panel rounded-2xl p-4 border border-amber-500/30 bg-amber-500/5 animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ShieldCheck size={15} /> Evaluator & Admin Credentials
              </h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                To test the <strong>Root Administrator Center</strong> with full moderation and escrow clearing powers, you can sign in directly with the pre-configured admin account:
              </p>
              <div className="font-mono text-xs bg-[var(--surface-strong)] p-2 rounded-xl border border-[var(--border)] mt-2 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <span>Email: <strong className="text-amber-400">admin@skillswap.edu</strong></span>
                <span>Pass: <strong className="text-emerald-400">Admin123!</strong></span>
              </div>
            </div>
            <Link
              href="/login"
              className="amber-gradient text-white text-xs font-bold px-3 py-1.5 rounded-xl shrink-0"
            >
              Sign In as Admin
            </Link>
          </div>
        </div>
      )}

      {/* Main Signup Form Container */}
      <div className="flex items-center justify-center">
        <div className="glass-panel w-full max-w-xl rounded-[2.5rem] p-6 md:p-8 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="text-center">
            <div className="amber-gradient mx-auto mb-4 flex h-13 w-13 items-center justify-center rounded-2xl text-white shadow-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text)]">Create your account</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">Select your role and start building your next opportunity.</p>
          </div>

          {/* DYNAMIC PLAN BADGE & FACILITIES RIBBON */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <PlanIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">
                      Selected Tier
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {currentPlan.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-[var(--text)] flex items-center gap-1.5">
                    {currentPlan.name}{" "}
                    <span className="text-amber-400 text-sm font-bold">
                      ({currentPlan.price}{currentPlan.period})
                    </span>
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPlanModal(true)}
                className="text-xs font-bold text-amber-400 bg-[var(--surface-strong)] px-3 py-2 rounded-xl border border-[var(--border)] hover:border-amber-400 transition flex items-center justify-center gap-1 cursor-pointer shrink-0"
              >
                View Facilities / Change <ChevronRight size={14} />
              </button>
            </div>

            {/* Quick Facilities Preview */}
            <div className="mt-3 pt-3 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-semibold text-[var(--text)]">
              {currentPlan.facilities.slice(0, 4).map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <span className="truncate">{f}</span>
                </div>
              ))}
            </div>

            {/* Role-tailored perk preview */}
            <p className="mt-2.5 text-[11px] text-[var(--muted)] italic">
              💡 For {role === "freelancer" ? "Freelancers" : "Clients"}: {currentPlan.rolePerks[role]}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                <User size={14} className="text-amber-400" /> Full Name
              </label>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-1">
                <Input id="name" required placeholder="John Doe" radius="lg" size="md" className="w-full" name="name" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                <ImageIcon size={14} className="text-amber-400" /> Avatar Image URL
              </label>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-1">
                <Input id="image" required placeholder="https://images.unsplash.com/photo-..." radius="lg" size="md" className="w-full" name="image" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                <Mail size={14} className="text-amber-400" /> Email Address
              </label>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-1">
                <Input type="email" placeholder="you@example.com" className="w-full" id="email" name="email" required />
              </div>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                <Lock size={14} className="text-amber-400" /> Password
              </label>
              <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters (1 upper & lower)"
                  radius="lg"
                  size="md"
                  className="w-full"
                  id="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-[var(--muted)] hover:text-amber-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && <p className="mt-2 text-xs font-semibold text-rose-400">{passwordError}</p>}
            </div>

            {/* Role Selection */}
            <div className="space-y-2.5 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Choose Your Account Role:
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <div
                  onClick={() => setRole("client")}
                  className={`cursor-pointer rounded-2xl border p-4 text-center transition-all ${
                    role === "client"
                      ? "border-amber-500 bg-amber-500/10 amber-glow"
                      : "border-[var(--border)] bg-[var(--surface-strong)] hover:border-amber-500/30"
                  }`}
                >
                  <div className={`mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-2xl ${role === "client" ? "amber-gradient text-white" : "bg-[var(--surface)] text-[var(--muted)]"}`}>
                    <Briefcase size={20} />
                  </div>
                  <h3 className="font-bold text-sm text-[var(--text)]">Client</h3>
                  <p className="text-xs text-[var(--muted)]">Hire specialists & post tasks</p>
                </div>

                <div
                  onClick={() => setRole("freelancer")}
                  className={`cursor-pointer rounded-2xl border p-4 text-center transition-all ${
                    role === "freelancer"
                      ? "border-emerald-500 bg-emerald-500/10 emerald-glow"
                      : "border-[var(--border)] bg-[var(--surface-strong)] hover:border-emerald-500/30"
                  }`}
                >
                  <div className={`mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-2xl ${role === "freelancer" ? "emerald-gradient text-white" : "bg-[var(--surface)] text-[var(--muted)]"}`}>
                    <Code size={20} />
                  </div>
                  <h3 className="font-bold text-sm text-[var(--text)]">Freelancer</h3>
                  <p className="text-xs text-[var(--muted)]">Find tasks & offer services</p>
                </div>
              </div>
            </div>

            {/* Extra Freelancer Fields */}
            {role === "freelancer" && (
              <div className="space-y-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <Code size={16} /> Freelancer Profile Details
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[var(--muted)]">
                    Skills <span className="text-[10px]">(comma-separated)</span>
                  </label>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-1">
                    <Input id="skills" name="skills" required placeholder="React, Node.js, Design" radius="lg" size="md" className="w-full" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[var(--muted)]">Bio</label>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-1">
                    <Input id="bio" name="bio" required placeholder="Tell clients about your expertise..." radius="lg" className="w-full" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[var(--muted)]">Hourly Rate (USD)</label>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-1">
                    <Input type="number" id="hourlyRate" name="hourlyRate" placeholder="50" radius="lg" size="md" className="w-full" />
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="amber-gradient amber-glow h-12 w-full rounded-full text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-95 mt-4 cursor-pointer shadow-lg"
            >
              Complete Registration ({currentPlan.name})
            </Button>
            
            <Button
              onClick={handleGoogleSignUp}
              type="button"
              variant="bordered"
              className="h-12 w-full rounded-full border border-[var(--border)] bg-[var(--surface-strong)] font-semibold text-[var(--text)] hover:bg-[var(--surface)] cursor-pointer"
            >
              <FcGoogle className="text-xl" /> Continue With Google
            </Button>
            
            <p className="pt-2 text-center text-xs text-[var(--muted)]">
              Already have an account? <Link href="/login" className="font-bold text-amber-400 hover:underline">Sign In</Link>
            </p>
          </form>
        </div>
      </div>

      {/* INTERACTIVE PLAN FACILITIES & COMPARISON MODAL */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-3xl rounded-[2.5rem] p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-[var(--border)] shadow-2xl relative">
            <button
              onClick={() => setShowPlanModal(false)}
              className="absolute top-5 right-5 text-[var(--muted)] hover:text-amber-400 transition cursor-pointer p-1 rounded-full hover:bg-[var(--surface-strong)]"
            >
              <X size={20} />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold mb-2">
                <Sparkles size={13} /> Compare Plan Facilities
              </div>
              <h2 className="text-2xl font-black text-[var(--text)]">Choose Your Growth Plan</h2>
              <p className="text-xs text-[var(--muted)] mt-1">
                Every plan includes Stripe escrow milestone protection. Select the tier that matches your ambition.
              </p>
            </div>

            {/* 3 Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(PLAN_DETAILS).map((plan) => {
                const Icon = plan.icon;
                const isSelected = selectedPlan === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      setShowPlanModal(false);
                      toast.success(`Selected ${plan.name} plan`);
                    }}
                    className={`rounded-2xl p-5 border flex flex-col justify-between transition-all cursor-pointer relative ${
                      isSelected
                        ? "border-amber-400 bg-amber-500/10 shadow-lg scale-[1.02]"
                        : "border-[var(--border)] bg-[var(--surface-strong)] hover:border-amber-500/30"
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
                        Popular
                      </span>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                          <Icon size={18} />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-[var(--text)]">{plan.name}</h4>
                          <span className="text-lg font-black text-amber-400">{plan.price}</span>
                          <span className="text-[10px] text-[var(--muted)] font-bold">{plan.period}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                        {plan.tagline}
                      </p>

                      <div className="space-y-1.5 pt-2 border-t border-[var(--border)] text-xs">
                        {plan.facilities.map((fac, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-[11px] text-[var(--text)] leading-tight">{fac}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`w-full mt-4 py-2 text-xs font-bold rounded-xl transition ${
                        isSelected
                          ? "amber-gradient text-white shadow"
                          : "border border-[var(--border)] text-[var(--muted)] hover:text-amber-400"
                      }`}
                    >
                      {isSelected ? "Active Plan ✓" : "Select Plan"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[var(--border)] flex justify-end">
              <button
                type="button"
                onClick={() => setShowPlanModal(false)}
                className="amber-gradient text-white text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer"
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

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Loading Signup...</p>
        </div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}