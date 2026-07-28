"use client";

import { useState } from "react";
import { Input, Button } from "@heroui/react";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const LoginPage = () => {
  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Google Authentication Failed");
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const loginData = Object.fromEntries(formData.entries());

    const { error } = await authClient.signIn.email({ ...loginData });

    if (!error) {
      toast.success("Login Successful! Redirecting...");
      window.location.href = "/";
    }

    if (error) {
      toast.error(error.message || "Login Failed");
    }
  };

  const passwordRules = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "At least 1 number", valid: /\d/.test(password) },
    { label: "At least 1 lowercase letter", valid: /[a-z]/.test(password) },
    { label: "At least 1 uppercase letter", valid: /[A-Z]/.test(password) },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_40%),linear-gradient(135deg,_rgba(248,251,255,0.96),_rgba(236,244,255,0.95))] px-3 py-6">
      <div className="mb-4 flex justify-start md:ml-10 lg:ml-20">
        <Link href="/">
          <Button variant="light" size="sm" className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] font-medium text-[var(--text)]">
            <ArrowLeft size={16} />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-center">
        <div className="glass-panel w-full max-w-lg rounded-[2rem] p-5 md:p-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">🔐</div>
            <h1 className="text-3xl font-black text-[var(--text)]">Welcome back</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Sign in to continue your next project.</p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                <Mail size={16} /> Email
              </label>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1">
                <Input type="email" placeholder="you@example.com" radius="lg" size="md" className="w-full" id="email" name="email" required />
              </div>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                <Lock size={16} /> Password
              </label>
              <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1">
                <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" radius="lg" size="md" className="w-full" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-[var(--muted)]">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <p className="mt-2 text-sm">
                <Link href="/forgot-password" className="text-[var(--primary)] hover:underline">Forgot your password?</Link>
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
              <h3 className="mb-2 text-sm font-semibold text-[var(--text)]">Password should include</h3>
              <div className="space-y-1.5 text-sm text-[var(--muted)]">
                {passwordRules.map((rule, index) => (
                  <div key={index} className={`flex items-center gap-2 ${rule.valid ? "text-emerald-600" : ""}`}>
                    <span>{rule.valid ? "✓" : "•"}</span>
                    <span>{rule.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="brand-gradient h-11 w-full rounded-full text-base font-semibold text-white">
              Login
            </Button>

            <Button onClick={handleGoogleLogin} type="button" variant="bordered" className="h-11 w-full rounded-full border border-[var(--border)] bg-[var(--surface)] font-medium text-[var(--text)]">
              <FcGoogle /> Continue With Google
            </Button>

            <p className="pt-1 text-center text-sm text-[var(--muted)]">
              Don&apos;t have an account? <Link href="/signup" className="font-semibold text-[var(--primary)]">Signup</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;