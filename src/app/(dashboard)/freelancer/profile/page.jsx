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
} from "lucide-react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { getMyProfile, updateProfile } from "@/lib/api/tasks";

const MyProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  const [profile, setProfile] = useState(null);

  // এডিটিং স্টেটস
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

        const formattedSkills = Array.isArray(data.skills)
          ? data.skills
          : data.skills
            ? data.skills.split(",")
            : [];

        setProfile({ ...data, skills: formattedSkills });
        setEditedProfile({ ...data, skills: formattedSkills });
      } catch (error) {
        console.error(error);
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
    if (newSkill.trim() && !editedProfile.skills.includes(newSkill.trim())) {
      setEditedProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditedProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const payload = {
        name: editedProfile.name,
        title: editedProfile.title,
        image: editedProfile.image,
        bio: editedProfile.bio,
        skills: editedProfile.skills,
        hourlyRate: Number(editedProfile.hourlyRate),
      };

      const result = await updateProfile(session.user.id, payload);

      if (result.success) {
        // 🌟 উইন্ডো রিলোড ছাড়া রিয়্যাক্ট স্টেট আপডেট করে লাইভ চেঞ্জ দেখানো হলো
        setProfile({ ...editedProfile });
        setIsEditing(false);
        setShowToast(true);

        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending || !profile || !editedProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-2 text-inherit opacity-60 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
        <p className="text-sm font-bold tracking-wider uppercase">Loading profile details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mt-12 md:mt-0 mx-auto px-4 md:px-6 space-y-6 font-sans antialiased relative text-inherit min-h-screen selection:bg-cyan-500/20 selection:text-cyan-500">
      
      {/* সাকসেস টোস্ট অ্যালার্ট */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-500 text-zinc-950 px-4 py-3 rounded-xl shadow-lg text-sm font-extrabold animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-5 h-5" /> Profile Updated Successfully!
        </div>
      )}

      {/* প্রোফাইল হেডার ও অ্যাকশন বাটন */}
      <div className="flex items-center justify-between border-b border-current/10 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-inherit">My Profile</h1>
          <p className="text-xs opacity-50 font-bold mt-0.5">
            Manage and update your freelancer public portfolio layout
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={handleStartEdit}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-linear-to-r from-cyan-400 to-teal-400 text-zinc-950 px-4 py-3 rounded-xl shadow-[0_4px_14px_rgba(6,182,212,0.2)] hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 stroke-[2.5]" /> Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs font-bold uppercase tracking-widest border border-current/10 bg-current/5 hover:bg-current/10 text-inherit px-4 py-3 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-linear-to-r from-cyan-400 to-teal-400 text-zinc-950 px-4 py-3 rounded-xl shadow-[0_4px_14px_rgba(6,182,212,0.2)] hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-950" />
              ) : (
                <Save className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* মূল লেআউট গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* বাম কলাম: অ্যাভাটার ও কুইক স্ট্যাটাস */}
        <div className="md:col-span-1 space-y-6">
          <div className="border border-current/10 bg-current/5 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-cyan-400/10 to-transparent rounded-full blur-2xl" />

            {/* প্রোফাইল ইমেজ আপলোড সেকশন */}
            <div className="relative p-1 bg-linear-to-tr from-cyan-400 to-teal-400 rounded-full shadow-[0_4px_12px_rgba(6,182,212,0.15)] group">
              <Image
                src={
                  (isEditing ? editedProfile.image : profile.image)?.startsWith("http")
                    ? (isEditing ? editedProfile.image : profile.image)
                    : "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
                }
                alt="Avatar"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover bg-zinc-900"
                unoptimized
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer transition opacity-0 group-hover:opacity-100">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            <h2 className="text-lg font-extrabold text-inherit mt-4">
              {profile.name}
            </h2>
            <p className="text-xs text-cyan-400 font-extrabold bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/20 mt-1.5">
              {profile.title || "Frontend Web Developer"}
            </p>

            <div className="w-full border-t border-current/10 pt-4 mt-4 space-y-3 text-left text-xs font-bold opacity-70">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 shrink-0">
                  <Mail className="w-3.5 h-3.5 text-cyan-500" /> Identity
                </span>
                <span className="text-inherit opacity-90 truncate max-w-35">
                  {profile.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> Status
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    profile.emailVerified ? "bg-teal-500/10 text-teal-400" : "bg-amber-500/10 text-amber-500"
                  }`}
                >
                  {profile.emailVerified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ডান কলাম: এডিটেবল ফর্ম সেকশন */}
        <div className="md:col-span-2 space-y-6">
          <div className="border border-current/10 bg-current/5 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 backdrop-blur-md">
            
            {/* ১. নাম ও টাইটেল ফিল্ড */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest opacity-50">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={isEditing ? editedProfile.name : profile.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full text-sm border border-current/10 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 rounded-xl px-4 py-3 outline-none bg-current/5 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-inherit placeholder:opacity-40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest opacity-50">
                  Professional Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={isEditing ? editedProfile.title : profile.title}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full text-sm border border-current/10 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 rounded-xl px-4 py-3 outline-none bg-current/5 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-inherit placeholder:opacity-40"
                />
              </div>
            </div>

            {/* ২. আওয়ার্লি রেট ফিল্ড */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest opacity-50">
                Hourly Rate ($/hr)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-sm font-bold opacity-50">$</span>
                <input
                  type="number"
                  name="hourlyRate"
                  value={isEditing ? editedProfile.hourlyRate || "" : profile.hourlyRate || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full text-sm border border-current/10 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 rounded-xl pl-8 pr-4 py-3 outline-none bg-current/5 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-inherit placeholder:opacity-40"
                />
              </div>
            </div>

            {/* ইমেজের ইউআরএল ফিল্ড (শুধুমাত্র এডিট মোডে দেখাবে) */}
            {isEditing && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label className="text-xs font-black uppercase tracking-widest opacity-50">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={editedProfile.image}
                  onChange={handleInputChange}
                  className="w-full text-xs border border-current/10 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 rounded-xl px-4 py-3 outline-none bg-current/5 transition font-mono text-inherit placeholder:opacity-40"
                />
              </div>
            )}

            {/* ৩. বায়ো ফিল্ড */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest opacity-50">
                Professional Summary (Bio)
              </label>
              <textarea
                rows="4"
                name="bio"
                value={isEditing ? editedProfile.bio : profile.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full text-sm border border-current/10 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 rounded-xl px-4 py-3 outline-none bg-current/5 disabled:opacity-50 disabled:cursor-not-allowed transition resize-none leading-relaxed font-bold text-inherit placeholder:opacity-40"
              />
            </div>

            {/* ৪. স্কিলস ম্যানেজমেন্ট সেকশন */}
            <div className="space-y-3 pt-2 border-t border-current/5">
              <label className="text-xs font-black uppercase tracking-widest opacity-50 block">
                Skills & Core Expertise
              </label>

              {/* স্কিল ট্যাগ লিস্ট */}
              <div className="flex flex-wrap gap-2">
                {(isEditing ? editedProfile.skills : profile.skills).map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 bg-current/5 border border-current/10 text-inherit px-3 py-1.5 rounded-xl text-xs font-bold transition"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="p-0.5 rounded-full hover:bg-rose-500/20 text-rose-500 transition cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {/* নতুন স্কিল যোগ করার ইনপুট */}
              {isEditing && (
                <form
                  onSubmit={handleAddSkill}
                  className="flex gap-2 pt-2 max-w-xs animate-in fade-in duration-200"
                >
                  <input
                    type="text"
                    placeholder="Add a skill (e.g. Next.js)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="w-full text-xs border border-current/10 focus:border-cyan-500 rounded-xl px-3 py-2.5 outline-none bg-current/5 text-inherit font-bold placeholder:opacity-40"
                  />
                  <button
                    type="submit"
                    className="bg-linear-to-r from-cyan-400 to-teal-400 text-zinc-950 p-2.5 rounded-xl shadow-sm hover:opacity-95 transition shrink-0 flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;