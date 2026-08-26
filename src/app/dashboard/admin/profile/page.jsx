"use client";

import React, { useEffect, useState } from "react";
import {
  Mail,
  Camera,
  Save,
  Edit2,
  CheckCircle,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Loader2,
  Sparkles,
  User,
} from "lucide-react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

const AdminProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminProfile = async () => {
      try {
        const { data: tokenData } = await authClient.token();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/admins/${session.user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${tokenData?.token}`,
          },
        });
        const data = await res.json();
        if (data && !data.error) {
          setProfile(data);
          setEditedProfile(data);
        }
      } catch (error) {
        console.error("Error fetching admin profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      loadAdminProfile();
    } else {
      const timeoutId = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timeoutId);
    }
  }, [session]);

  const handleStartEdit = () => {
    setEditedProfile({ ...profile });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { data: tokenData } = await authClient.token();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const payload = {
        name: editedProfile.name,
        title: editedProfile.title,
        bio: editedProfile.bio,
        image: editedProfile.image,
      };
      const response = await fetch(`${apiUrl}/api/admins/${session.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        setProfile({ ...editedProfile });
        setIsEditing(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error("Error saving admin profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex flex-col h-96 w-full items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
          Loading Admin Profile...
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="glass-panel rounded-[2rem] max-w-md mx-auto mt-10 p-8 text-center space-y-3">
        <ShieldAlert className="w-8 h-8 mx-auto text-rose-400" />
        <p className="text-sm font-bold text-rose-400">System Guard: Record Unresolved</p>
        <p className="text-xs text-[var(--muted)]">Admin profile could not be loaded.</p>
      </div>
    );
  }

  const displayProfile = isEditing ? editedProfile : profile;
  const avatarSrc = displayProfile.image?.startsWith("http")
    ? displayProfile.image
    : "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg";

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-6 font-sans relative">

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 amber-gradient text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-extrabold animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-5 h-5" /> Master Records Updated!
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" /> Admin Profile
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">
            Root <span className="amber-text-gradient">Configuration</span>
          </h1>
          <p className="text-sm text-[var(--muted)] max-w-lg">
            System administrator core cryptographic profile configurations.
          </p>
        </div>

        {/* Edit / Save Actions */}
        {!isEditing ? (
          <button
            onClick={handleStartEdit}
            className="amber-gradient amber-glow inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shrink-0 transition-all hover:opacity-90"
          >
            <Edit2 className="w-4 h-4" /> Edit Config
          </button>
        ) : (
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-2.5 text-sm font-bold text-[var(--muted)] hover:border-amber-400 hover:text-amber-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="amber-gradient amber-glow inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Saving..." : "Commit Changes"}
            </button>
          </div>
        )}
      </div>

      {/* Profile Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left Column: Avatar & Identity */}
        <div className="md:col-span-1 space-y-5">
          <div className="glass-panel rounded-[2rem] p-6 flex flex-col items-center text-center space-y-4 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Avatar */}
            <div className="relative">
              <div className="p-1 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 shadow-lg">
                <Image
                  src={avatarSrc}
                  alt="Admin Avatar"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover"
                  unoptimized
                />
              </div>
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[var(--surface)] animate-pulse" />
            </div>

            {/* Name & Title */}
            <div>
              <h2 className="text-xl font-extrabold text-[var(--text)]">{displayProfile.name}</h2>
              <span className="inline-block mt-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                {displayProfile.title || "System Administrator"}
              </span>
            </div>

            {/* Identity Info */}
            <div className="w-full space-y-2.5 text-xs font-bold pt-3 border-t border-[var(--border)]">
              <div className="flex items-center justify-between gap-2 text-[var(--muted)]">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" /> Root Mail
                </span>
                <span className="text-[var(--text)] truncate max-w-32">{displayProfile.email}</span>
              </div>
              <div className="flex items-center justify-between gap-2 text-[var(--muted)]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Access
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {displayProfile.role || "Admin"}
                </span>
              </div>
              {displayProfile.createdAt && (
                <div className="flex items-center justify-between gap-2 text-[var(--muted)]">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" /> Since
                  </span>
                  <span className="text-[var(--text)]">
                    {new Date(displayProfile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Access Privileges Card */}
          <div className="glass-panel rounded-[2rem] p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text)]">Access Privileges</h4>
              <p className="text-[11px] text-[var(--muted)] font-bold mt-0.5">Full Read/Write Platform Authority</p>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Form */}
        <div className="md:col-span-2">
          <div className="glass-panel rounded-[2rem] p-6 md:p-8 space-y-6">

            {/* Name & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">
                  Identity Label (Name)
                </label>
                <input
                  type="text"
                  name="name"
                  value={displayProfile.name || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full text-sm rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-[var(--text)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">
                  System Title / Role Label
                </label>
                <input
                  type="text"
                  name="title"
                  value={displayProfile.title || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="System Administrator"
                  className="w-full text-sm rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-[var(--text)] placeholder:text-[var(--muted)]"
                />
              </div>
            </div>

            {/* Image URL (edit only) */}
            {isEditing && (
              <div className="space-y-2 animate-in fade-in duration-200">
                <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={editedProfile.image || ""}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full text-xs rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition font-mono text-[var(--text)] placeholder:text-[var(--muted)]"
                />
              </div>
            )}

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">
                Administrative Notes / Summary
              </label>
              <textarea
                rows={5}
                name="bio"
                value={displayProfile.bio || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Write system bio, rules summary, or administrative notes here..."
                className="w-full text-sm rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition resize-none leading-relaxed font-medium text-[var(--text)] placeholder:text-[var(--muted)]"
              />
            </div>

            {/* Timestamp */}
            {displayProfile.createdAt && (
              <div className="pt-4 border-t border-[var(--border)] flex flex-wrap gap-4 text-[10px] uppercase font-black tracking-wider text-[var(--muted)]">
                <div>Created: {new Date(displayProfile.createdAt).toLocaleDateString()}</div>
                <div className="text-emerald-400">System Status: Operational</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
