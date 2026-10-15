"use client";

import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  Search,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Users,
} from "lucide-react";

const faqData = [
  {
    id: 1,
    category: "Payments & Escrow",
    question: "How does the Stripe Escrow payment protection work?",
    answer:
      "When a client accepts a freelancer's proposal, payment is authorized and held securely in Stripe Escrow. The funds are not released until the freelancer submits their completed work deliverable and the client inspects and approves it. If there is an issue, our admin arbitration step protects both parties.",
  },
  {
    id: 2,
    category: "Payments & Escrow",
    question: "Does SkillSwap deduct platform fees from student earnings?",
    answer:
      "No! Student freelancers receive 100% of their quoted project price. There are 0% platform cuts on your task earnings. We only charge standard Stripe payment processing costs.",
  },
  {
    id: 3,
    category: "For Clients",
    question: "How quickly do freelancers typically respond to posted tasks?",
    answer:
      "Most campus tasks receive their first verified student proposal within 2 to 4 hours. Because freelancers are active students in your local or global campus tech community, coordination is fast and direct.",
  },
  {
    id: 4,
    category: "For Freelancers",
    question: "How do I get verified as a trusted student freelancer?",
    answer:
      "Sign up using your university credentials or Google account, then complete your profile by adding your GitHub portfolio, Behance/Figma links, or course major. Admins verify student profiles within 24 hours.",
  },
  {
    id: 5,
    category: "For Freelancers",
    question: "What happens if a client doesn't review my deliverable?",
    answer:
      "Once you submit your project deliverable URL or repository link through the freelancer dashboard, the client has 5 days to inspect the work. If no dispute is raised, the escrow funds are automatically disbursed to your account.",
  },
  {
    id: 6,
    category: "General",
    question: "Can I use SkillSwap both as a client and a freelancer?",
    answer:
      "Yes! Your SkillSwap account allows you to post tasks when you need design, code, or marketing support, and also switch to bidding on open projects whenever you want to earn money using your skills.",
  },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState(1);

  const categories = ["All", "Payments & Escrow", "For Clients", "For Freelancers", "General"];

  const filteredFaqs = faqData.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" id="faq">
      <div className="relative mx-auto w-[95%] lg:w-[78%]">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14 space-y-3">
          <div className="section-badge mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-[#1dbf73]" />
            Got Questions?
          </div>
          <h2 className="section-title">
            Frequently Asked <span className="amber-text-gradient">Questions</span>
          </h2>
          <p className="section-desc">
            Everything you need to know about peer skill swaps, escrow milestones, and campus verification.
          </p>

          {/* Dynamic Search Input */}
          <div className="pt-4 max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. escrow, verification, fees)..."
              className="w-full pl-11 pr-4 py-3 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] text-xs sm:text-sm text-[var(--text)] focus:outline-hidden focus:border-[#1dbf73] transition-all shadow-xs"
            />
          </div>

          {/* Dynamic Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#1dbf73] text-white shadow-sm scale-105"
                    : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[#1dbf73]/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center text-sm text-[var(--muted)]">
              No questions found matching &quot;{searchQuery}&quot;. Try a different keyword!
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`glass-panel rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "border-[#1dbf73]/50 shadow-md bg-[var(--surface-strong)]"
                      : "border-[var(--border)] hover:border-[#1dbf73]/30"
                  }`}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#1dbf73] shrink-0" />
                      <span className="text-sm sm:text-base font-bold text-[var(--text)]">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-[var(--muted)] shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#1dbf73]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[var(--muted)] leading-relaxed border-t border-[var(--border)]/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
