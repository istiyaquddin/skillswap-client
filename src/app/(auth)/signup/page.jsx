"use client";

import { useState } from "react";
import { Input, Button } from "@heroui/react";
import {
  User,
  Mail,
  Image as ImageIcon,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Code,
  Palette,
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
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_45%),linear-gradient(135deg,_rgba(248,251,255,0.96),_rgba(236,244,255,0.95))] px-3 py-6">
      <div className="mb-4 flex justify-start md:ml-10 lg:ml-20">
        <Link href="/">
          <Button variant="light" size="sm" className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] font-medium text-[var(--text)]">
            <ArrowLeft size={16} /> Back to Home
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-center">
        <div className="glass-panel w-full max-w-lg rounded-[2rem] p-5 md:p-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]">✨</div>
            <h1 className="text-3xl font-black text-[var(--text)]">Create your account</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Pick a role and start building your next opportunity.</p>
          </div>

          <form onSubmit={handleSignUp} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--text)]"><User size={16} /> Name</label>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1"><Input id="name" required placeholder="Enter your name" radius="lg" size="md" className="w-full" name="name" /></div>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--text)]"><ImageIcon size={16} /> Image URL</label>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1"><Input id="image" required placeholder="https://example.com/avatar.png" radius="lg" size="md" className="w-full" name="image" /></div>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--text)]"><Mail size={16} /> Email</label>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1"><Input type="email" placeholder="you@example.com" className="w-full" id="email" name="email" required /></div>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--text)]"><Lock size={16} /> Password</label>
              <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1">
                <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" radius="lg" size="md" className="w-full" id="password" name="password" required value={password} onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(""); }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-[var(--muted)]">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && <p className="mt-2 text-sm font-medium text-rose-500">{passwordError}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[var(--text)]">I want to join as a:</label>
              <div className="grid gap-3 sm:grid-cols-2">
                <div onClick={() => setRole("client")} className={`cursor-pointer rounded-2xl border p-4 text-center transition-all ${role === "client" ? "border-[var(--primary)] bg-[var(--primary)]/10" : "border-[var(--border)] bg-[var(--surface)]"}`}>
                  <div className={`mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-2xl ${role === "client" ? "bg-[var(--primary)]/20 text-[var(--primary)]" : "bg-[var(--surface-strong)] text-[var(--muted)]"}`}><User size={20} /></div>
                  <h3 className="font-semibold text-[var(--text)]">Client</h3>
                  <p className="text-xs text-[var(--muted)]">Hire talent</p>
                </div>
                <div onClick={() => setRole("freelancer")} className={`cursor-pointer rounded-2xl border p-4 text-center transition-all ${role === "freelancer" ? "border-[var(--accent)] bg-[var(--accent)]/10" : "border-[var(--border)] bg-[var(--surface)]"}`}>
                  <div className={`mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-2xl ${role === "freelancer" ? "bg-[var(--accent)]/20 text-[var(--accent)]" : "bg-[var(--surface-strong)] text-[var(--muted)]"}`}><Code size={20} /></div>
                  <h3 className="font-semibold text-[var(--text)]">Freelancer</h3>
                  <p className="text-xs text-[var(--muted)]">Find work</p>
                </div>
              </div>
            </div>

            {role === "freelancer" && (
              <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)]"><Palette size={16} /> Freelancer profile</div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--muted)]">Skills <span className="text-xs">(comma-separated)</span></label>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-1"><Input id="skills" name="skills" required placeholder="React, Node.js, Design" radius="lg" size="md" className="w-full" /></div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--muted)]">Bio</label>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-1"><Input id="bio" name="bio" required placeholder="Tell clients about yourself..." radius="lg" className="w-full" rows={3} /></div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--muted)]">Hourly Rate (USD) <span className="text-xs">optional</span></label>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-1"><Input type="number" id="hourlyRate" name="hourlyRate" placeholder="50" radius="lg" size="md" className="w-full" /></div>
                </div>
              </div>
            )}

            <Button type="submit" className="brand-gradient h-11 w-full rounded-full text-base font-semibold text-white">Register</Button>
            <Button onClick={handleGoogleSignUp} type="button" variant="bordered" className="h-11 w-full rounded-full border border-[var(--border)] bg-[var(--surface)] font-medium text-[var(--text)]"><FcGoogle /> Continue With Google</Button>
            <p className="pt-1 text-center text-sm text-[var(--muted)]">Already have an account? <Link href="/login" className="font-semibold text-[var(--primary)]">Login</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;