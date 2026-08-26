"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Message sent! Our campus support team will respond within 2 hours.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16 space-y-12 font-sans text-[var(--text)]">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-400">
          <MessageSquare className="w-4 h-4" /> 24/7 Dedicated Support
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text)]">
          Get in Touch with <span className="amber-text-gradient">SkillSwap Support</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--muted)] font-medium">
          Have questions regarding escrow payments, account verification, or task disputes? We&apos;re here to assist you 24/7.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info Side */}
        <div className="md:col-span-5 space-y-6">
          <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 space-y-6 border border-[var(--border)]">
            <h2 className="text-xl font-extrabold text-[var(--text)] border-b border-[var(--border)] pb-4">
              Contact Channels
            </h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Support Email</h3>
                  <p className="text-sm font-bold text-[var(--text)] mt-0.5">support@skillswap.edu</p>
                  <p className="text-[11px] text-[var(--muted)]">Avg response time: &lt; 2 Hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Campus Helpline</h3>
                  <p className="text-sm font-bold text-[var(--text)] mt-0.5">+1 (800) 555-SKILL</p>
                  <p className="text-[11px] text-[var(--muted)]">Mon - Sun: 8am - 10pm EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">HQ Address</h3>
                  <p className="text-sm font-bold text-[var(--text)] mt-0.5">100 Innovation Way, Suite 400</p>
                  <p className="text-[11px] text-[var(--muted)]">Cambridge, MA 02142</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6 space-y-3 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Escrow Dispute Guarantee
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed font-medium">
              All payment disputes are mediated by our dedicated campus arbitration panel. Your escrow funds remain 100% safe.
            </p>
          </div>
        </div>

        {/* Contact Form Side */}
        <div className="md:col-span-7">
          <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 space-y-6 border border-[var(--border)]">
            <h2 className="text-xl font-extrabold text-[var(--text)]">Send Us a Direct Message</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-sm font-bold text-[var(--text)] focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@university.edu"
                    className="w-full px-4 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-sm font-bold text-[var(--text)] focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Question regarding Escrow Payout"
                  className="w-full px-4 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-sm font-bold text-[var(--text)] focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Message</label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry in detail..."
                  className="w-full px-4 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-sm font-bold text-[var(--text)] focus:outline-none focus:border-amber-400 transition resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 amber-gradient amber-glow shine-button text-white font-extrabold text-xs uppercase tracking-widest rounded-full flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Sending Message..." : "Submit Ticket"} <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
