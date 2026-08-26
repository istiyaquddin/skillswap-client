"use client";

import { useState } from "react";
import { Input, Button } from "@heroui/react";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, KeyRound, Sparkles, User, Briefcase, Code, Shield } from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts = [
    { label: "Client Demo", email: "client@demo.com", password: "DemoClient123", icon: Briefcase, color: "hover:border-amber-400 hover:text-amber-400" },
    { label: "Freelancer Demo", email: "freelancer@demo.com", password: "DemoFreelancer123", icon: Code, color: "hover:border-emerald-400 hover:text-emerald-400" },
    { label: "Admin Demo", email: "admin@demo.com", password: "DemoAdmin123", icon: Shield, color: "hover:border-indigo-400 hover:text-indigo-400" },
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

  return (
    <div className="min-h-screen bg-grid-pattern px-3 py-8 flex flex-col justify-center">
      <div className="mb-6 flex justify-start mx-auto w-full max-w-lg">
        <Link href="/">
          <Button variant="light" size="sm" className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] font-semibold text-[var(--text)] hover:text-amber-400">
            <ArrowLeft size={16} />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-center">
        <div className="glass-panel w-full max-w-lg rounded-[2.5rem] p-6 md:p-8 shadow-2xl">
          <div className="text-center">
            <div className="amber-gradient mx-auto mb-4 flex h-13 w-13 items-center justify-center rounded-2xl text-white shadow-lg">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text)]">Welcome back</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Sign in to access your dashboard and active tasks.</p>
          </div>

          {/* Quick Demo Fill Bar */}
          <div className="mt-6 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Quick Fill Demo Credentials:
            </div>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((acc) => {
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.label}
                    type="button"
                    onClick={() => fillDemoCredentials(acc.email, acc.password)}
                    className={`rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-2.5 text-center text-xs font-semibold text-[var(--text)] transition-all duration-200 active:scale-95 ${acc.color}`}
                  >
                    <Icon className="h-4 w-4 mx-auto mb-1 text-amber-400" />
                    <span className="block truncate text-[11px]">{acc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                <Mail size={14} className="text-amber-400" /> Email Address
              </label>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-1">
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

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                <Lock size={14} className="text-amber-400" /> Password
              </label>
              <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-1">
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
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-[var(--muted)] hover:text-amber-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="amber-gradient amber-glow h-12 w-full rounded-full text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-95 mt-2"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <Button
              onClick={handleGoogleLogin}
              type="button"
              variant="bordered"
              className="h-12 w-full rounded-full border border-[var(--border)] bg-[var(--surface-strong)] font-semibold text-[var(--text)] hover:bg-[var(--surface)]"
            >
              <FcGoogle className="text-xl" /> Continue With Google
            </Button>

            <p className="pt-2 text-center text-xs text-[var(--muted)]">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-bold text-amber-400 hover:underline">
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