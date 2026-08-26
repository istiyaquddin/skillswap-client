"use client";

import React, { useEffect, useState } from "react";
import {
  Mail,
  Camera,
  Save,
  Edit2,
  Plus,
  X,
  CheckCircle,
  ShieldCheck,
  Loader2,
  Sparkles,
  User,
  Star,
  DollarSign,
} from "lucide-react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { getMyProfile, updateProfile } from "@/lib/api/tasks";

const MyProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user?.id) return;
      try {
        const data = await getMyProfile(session.user.id);
        const formattedSkills = Array.isArray(data?.skills)
          ? data.skills
          : data?.skills
          ? data.skills.split(",")
          : ["React", "Node.js", "JavaScript"];

        const mergedProfile = {
          name: data?.name || session?.user?.name || "Freelancer",
          email: data?.email || session?.user?.email || "",
          image: data?.image || session?.user?.image || "",
          title: data?.title || "Professional Freelancer",
          skills: formattedSkills,
          hourlyRate: data?.hourlyRate || 50,
          bio: data?.bio || "",
          emailVerified: session?.user?.emailVerified ?? true,
        };

        setProfile(mergedProfile);
        setEditedProfile(mergedProfile);
      } catch (error) {
        console.error(error);
        const fallback = {
          name: session?.user?.name || "Freelancer",
          email: session?.user?.email || "",
          image: session?.user?.image || "",
          title: "Professional Freelancer",
          skills: ["React", "Node.js", "JavaScript"],
          hourlyRate: 50,
          bio: "",
          emailVerified: true,
        };
        setProfile(fallback);
        setEditedProfile(fallback);
      }
    };
    loadProfile();
  }, [session]);

  const handleStartEdit = () => {
    setEditedProfile({ ...profile });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (editedProfile.skills.includes(trimmed)) {
      setNewSkill("");
      return;
    }
    setEditedProfile((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditedProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { ...editedProfile, skills: editedProfile.skills.join(",") };
      const result = await updateProfile(session.user.id, payload);
      if (result.success || !result.error) {
        setProfile({ ...editedProfile });
        setIsEditing(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error(error);
      setProfile({ ...editedProfile });
      setIsEditing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending || !profile || !editedProfile) {
    return (
      <div className="flex flex-col h-96 w-full items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
          Loading Profile...
        </p>
      </div>
    );
  }

  const displayProfile = isEditing ? editedProfile : profile;
  const avatarSrc = displayProfile.image?.startsWith("http")
    ? displayProfile.image
    : "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg";

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-6 font-sans relative text-[var(--text)]">

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 amber-gradient text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-extrabold animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-5 h-5" /> Profile Updated Successfully!
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> My Profile
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">
            Freelancer <span className="amber-text-gradient">Portfolio</span>
          </h1>
          <p className="text-sm text-[var(--muted)] max-w-lg">
            Manage and update your public-facing freelancer profile, skills, and hourly rate.
          </p>
        </div>

        {/* Edit / Save Actions */}
        {!isEditing ? (
          <button
            onClick={handleStartEdit}
            className="amber-gradient amber-glow inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shrink-0 transition-all hover:opacity-90 cursor-pointer"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-2.5 text-sm font-bold text-[var(--muted)] hover:border-amber-400 hover:text-amber-400 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="amber-gradient amber-glow inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* Profile Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left Column: Avatar & Identity */}
        <div className="md:col-span-1 space-y-5">
          <div className="glass-panel rounded-[2rem] p-6 flex flex-col items-center text-center space-y-4 relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Avatar */}
            <div className="relative">
              <div className="p-1 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 shadow-lg">
                <Image
                  src={avatarSrc}
                  alt="Avatar"
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
                {displayProfile.title || "Professional Freelancer"}
              </span>
            </div>

            {/* Quick stats */}
            <div className="w-full grid grid-cols-2 gap-3 pt-3 border-t border-[var(--border)]">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-amber-400 font-black text-lg">
                  <DollarSign className="w-4 h-4" />
                  {displayProfile.hourlyRate || "50"}
                </div>
                <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider">
                  /hr Rate
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-amber-400 font-black text-lg">
                  <Star className="w-4 h-4" />
                  5.0
                </div>
                <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider">
                  Rating
                </p>
              </div>
            </div>

            {/* Identity Info */}
            <div className="w-full space-y-2.5 text-xs font-bold">
              <div className="flex items-center justify-between gap-2 text-[var(--muted)]">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" /> Email
                </span>
                <span className="text-[var(--text)] truncate max-w-32 font-mono">{displayProfile.email}</span>
              </div>
              <div className="flex items-center justify-between gap-2 text-[var(--muted)]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Status
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    displayProfile.emailVerified
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {displayProfile.emailVerified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>
          </div>

          {/* Skills Tag Cloud */}
          <div className="glass-panel rounded-[2rem] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Skills & Expertise
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(isEditing ? editedProfile.skills : profile.skills).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400"
                >
                  {skill}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-0.5 hover:text-rose-400 transition cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <form onSubmit={handleAddSkill} className="flex gap-2 w-full mt-1">
                  <input
                    type="text"
                    placeholder="Add skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 text-xs rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2 outline-none focus:border-amber-400 text-[var(--text)] placeholder:text-[var(--muted)]"
                  />
                  <button
                    type="submit"
                    className="amber-gradient rounded-full p-2 flex items-center justify-center shrink-0 transition hover:opacity-90 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </form>
              )}
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
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={displayProfile.name || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full text-sm rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-[var(--text)] placeholder:text-[var(--muted)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">
                  Professional Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={displayProfile.title || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="e.g. Full-Stack Developer"
                  className="w-full text-sm rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-[var(--text)] placeholder:text-[var(--muted)]"
                />
              </div>
            </div>

            {/* Hourly Rate */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">
                Hourly Rate ($/hr)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-sm font-black text-amber-400">$</span>
                <input
                  type="number"
                  name="hourlyRate"
                  value={displayProfile.hourlyRate || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="e.g. 50"
                  className="w-full text-sm rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] pl-8 pr-4 py-3 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-[var(--text)] placeholder:text-[var(--muted)]"
                />
              </div>
            </div>

            {/* Profile Image URL (edit mode only) */}
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
                Professional Summary
              </label>
              <textarea
                rows={5}
                name="bio"
                value={displayProfile.bio || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Write a compelling summary about your expertise..."
                className="w-full text-sm rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition resize-none leading-relaxed font-medium text-[var(--text)] placeholder:text-[var(--muted)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
