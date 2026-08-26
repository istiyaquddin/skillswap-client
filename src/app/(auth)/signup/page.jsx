"use client";

import { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [role, setRole] = useState("client");

  const handleGoogleSignUp = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        newUserOptions: {
          data: {
            role,
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
      skills: role === "freelancer" ? baseData.skills : undefined,
      bio: role === "freelancer" ? baseData.bio : undefined,
      hourlyRate: role === "freelancer" && baseData.hourlyRate ? Number(baseData.hourlyRate) : undefined,
    };

    const { error } = await authClient.signUp.email(payload);

    if (error) {
      toast.error(error.message || "Signup Failed");
      return;
    }

    toast.success("Signup Successful!");
    if (role === "freelancer") {
      window.location.href = "/dashboard/freelancer";
    } else {
      window.location.href = "/dashboard/client";
    }
  };

  return (
    <div className="min-h-screen bg-grid-pattern px-3 py-8 flex flex-col justify-center">
      <div className="mb-6 flex justify-start mx-auto w-full max-w-lg">
        <Link href="/">
          <Button variant="light" size="sm" className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] font-semibold text-[var(--text)] hover:text-amber-400">
            <ArrowLeft size={16} /> Back to Home
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-center">
        <div className="glass-panel w-full max-w-lg rounded-[2.5rem] p-6 md:p-8 shadow-2xl">
          <div className="text-center">
            <div className="amber-gradient mx-auto mb-4 flex h-13 w-13 items-center justify-center rounded-2xl text-white shadow-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text)]">Create your account</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Select your role and start building your next opportunity.</p>
          </div>

          <form onSubmit={handleSignUp} className="mt-8 space-y-4">
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
                <Input type={showPassword ? "text" : "password"} placeholder="Min. 6 characters (1 upper & lower)" radius="lg" size="md" className="w-full" id="password" name="password" required value={password} onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(""); }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-[var(--muted)] hover:text-amber-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && <p className="mt-2 text-xs font-semibold text-rose-400">{passwordError}</p>}
            </div>

            <div className="space-y-2.5 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Choose Role:</label>
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

            {role === "freelancer" && (
              <div className="space-y-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <Code size={16} /> Freelancer Profile Details
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[var(--muted)]">Skills <span className="text-[10px]">(comma-separated)</span></label>
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

            <Button type="submit" className="amber-gradient amber-glow h-12 w-full rounded-full text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-95 mt-4">
              Create Account
            </Button>
            
            <Button onClick={handleGoogleSignUp} type="button" variant="bordered" className="h-12 w-full rounded-full border border-[var(--border)] bg-[var(--surface-strong)] font-semibold text-[var(--text)] hover:bg-[var(--surface)]">
              <FcGoogle className="text-xl" /> Continue With Google
            </Button>
            
            <p className="pt-2 text-center text-xs text-[var(--muted)]">
              Already have an account? <Link href="/login" className="font-bold text-amber-400 hover:underline">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;