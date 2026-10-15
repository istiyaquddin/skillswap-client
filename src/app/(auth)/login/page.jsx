"use client";

import { useState } from "react";
import { Input, Button } from "@heroui/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  Sparkles,
  Briefcase,
  Code,
  Shield,
  ArrowRight,
  UserCheck,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const LoginPage = () => {
  const { data: session } = authClient.useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts = [
    {
      label: "Client",
      desc: "Post tasks",
      email: "client@demo.com",
      password: "DemoClient123",
      icon: Briefcase,
      cls: "border-[#1dbf73]/30 hover:border-[#1dbf73] hover:bg-[#1dbf73]/10 hover:text-[#1dbf73]",
      iconCls: "text-[#1dbf73]",
    },
    {
      label: "Freelancer",
      desc: "Earn tokens",
      email: "freelancer@demo.com",
      password: "DemoFreelancer123",
      icon: Code,
      cls: "border-emerald-400/30 hover:border-emerald-400 hover:bg-emerald-400/10 hover:text-emerald-400",
      iconCls: "text-emerald-400",
    },
    {
      label: "Admin",
      desc: "Root controls",
      email: "admin@skillswap.edu",
      password: "Admin123!",
      icon: Shield,
      cls: "border-violet-400/30 hover:border-violet-400 hover:bg-violet-400/10 hover:text-violet-400",
      iconCls: "text-violet-400",
    },
  ];

  const fillDemoCredentials = (dEmail, dPassword) => {
    setEmail(dEmail);
    setPassword(dPassword);
    toast.success("Demo credentials filled! Click Login to proceed.");
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Google Authentication Failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        setIsLoading(false);
        return;
      }

      toast.success("Login Successful! Redirecting...");
      const sessionRes = await authClient.getSession();
      const role = sessionRes?.data?.user?.role;

      if (role === "freelancer") {
        window.location.href = "/dashboard/freelancer";
      } else if (role === "admin") {
        window.location.href = "/dashboard/admin";
      } else {
        window.location.href = "/dashboard/client";
      }
    } catch (err) {
      console.error("Login Exception:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (session?.user) {
    const role = session.user.role || "client";
    const dashboardHref = `/dashboard/${role}`;
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
              You are already logged in as an authorized <strong className="text-amber-400 capitalize">{role}</strong>.
            </p>
          </div>

          <div className="p-3.5 bg-[var(--surface-strong)] rounded-2xl border border-[var(--border)] text-xs flex items-center justify-between font-mono">
            <span className="text-[var(--muted)]">Signed in as:</span>
            <span className="text-amber-400 font-bold truncate max-w-44">{session.user.email}</span>
          </div>

          <div className="space-y-3 pt-2">
            <Link href={dashboardHref} className="block w-full">
              <button className="w-full py-3.5 px-6 amber-gradient amber-glow text-white font-extrabold text-xs uppercase tracking-widest rounded-full hover:scale-[1.02] active:scale-95 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                <span>Continue to {role.toUpperCase()} Workspace</span>
                <ArrowRight size={15} />
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
              Sign Out / Switch Account
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
    <div className="min-h-screen relative flex flex-col justify-center px-3 py-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute left-1/4 top-10 h-80 w-80 rounded-full bg-[#1dbf73]/10 blur-[120px] pointer-events-none" />
      <div className="absolute right-1/4 bottom-10 h-64 w-64 rounded-full bg-blue-500/8 blur-[100px] pointer-events-none" />

      {/* Back Button */}
      <div className="relative mb-6 flex justify-start mx-auto w-full max-w-lg">
        <Link href="/">
          <Button
            variant="light"
            size="sm"
            className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] font-semibold text-[var(--text)] hover:text-[#1dbf73] hover:border-[#1dbf73]/40 transition-all"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Card */}
      <div className="relative flex items-center justify-center">
        <div className="glass-panel w-full max-w-lg rounded-[2.5rem] p-6 md:p-9 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="amber-gradient amber-glow mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text)]">Welcome back</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Sign in to access your dashboard and active tasks.
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="mb-7 rounded-2xl border border-[#1dbf73]/20 bg-[#1dbf73]/6 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1dbf73] mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Quick Fill — Demo Credentials
            </div>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((acc) => {
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.label}
                    type="button"
                    onClick={() => fillDemoCredentials(acc.email, acc.password)}
                    className={`rounded-2xl border bg-[var(--surface-strong)] p-3 text-center text-xs font-semibold text-[var(--text)] transition-all duration-200 active:scale-95 hover:shadow-md ${acc.cls}`}
                  >
                    <Icon className={`h-4 w-4 mx-auto mb-1.5 ${acc.iconCls}`} />
                    <span className="block font-bold text-[11px]">{acc.label}</span>
                    <span className="block text-[10px] text-[var(--muted)] mt-0.5">{acc.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                <Mail size={13} className="text-[#1dbf73]" /> Email Address
              </label>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-1 transition-colors focus-within:border-[#1dbf73]/50">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  radius="lg"
                  size="md"
                  className="w-full"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                <Lock size={13} className="text-[#1dbf73]" /> Password
              </label>
              <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-1 transition-colors focus-within:border-[#1dbf73]/50">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  radius="lg"
                  size="md"
                  className="w-full"
                  id="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-[var(--muted)] hover:text-[#1dbf73] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="amber-gradient amber-glow shine-button h-12 w-full rounded-full text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-95 mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight size={15} />
                </span>
              )}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="font-semibold">or</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {/* Google */}
            <Button
              onClick={handleGoogleLogin}
              type="button"
              variant="bordered"
              className="h-12 w-full rounded-full border border-[var(--border)] bg-[var(--surface-strong)] font-semibold text-[var(--text)] hover:bg-[var(--surface)] hover:border-[#1dbf73]/30 transition-all flex items-center justify-center gap-2"
            >
              <FcGoogle className="text-xl" /> Continue With Google
            </Button>

            <p className="text-center text-xs text-[var(--muted)]">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-bold text-[#1dbf73] hover:underline">
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;