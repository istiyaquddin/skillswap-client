"use client";

import React, { useEffect, useState, useCallback } from "react";
import FreelancerCard from "@/components/mejor/FreelancerCard";
import { Users, Search, ChevronLeft, ChevronRight, Loader2, X, Sparkles, Filter, SlidersHorizontal } from "lucide-react";
import { getAllFreelancers } from "@/lib/api/tasks";

const SKILL_PILLS = [
  "All Skills",
  "React",
  "Node.js",
  "UI/UX Design",
  "Full-Stack",
  "MongoDB",
  "Mobile App",
];

const RATE_PRESETS = [
  { label: "All Rates", min: "", max: "" },
  { label: "< $25/hr", min: "", max: "25" },
  { label: "$25 - $50/hr", min: "25", max: "50" },
  { label: "$50+/hr", min: "50", max: "" },
];

const BrowseFreelancersPage = () => {
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All Skills");
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  const [freelancers, setFreelancers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchFreelancersData = useCallback(async () => {
    setLoading(true);
    try {
      const activeSearchQuery = selectedSkill !== "All Skills" ? selectedSkill : search;
      const response = await getAllFreelancers({
        search: activeSearchQuery,
        minRate,
        maxRate,
        page,
        limit,
      });

      if (response?.success) {
        setFreelancers(response.freelancers || []);
        setTotalPages(response.totalPages || 1);
        setTotalResults(response.totalResults || 0);
      } else if (Array.isArray(response)) {
        setFreelancers(response);
        setTotalResults(response.length);
      }
    } catch (error) {
      console.error("Error loading freelancers:", error);
    } finally {
      setLoading(false);
    }
  }, [search, selectedSkill, minRate, maxRate, page]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (isMounted) {
        await fetchFreelancersData();
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [page, fetchFreelancersData]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchFreelancersData();
  };

  const handleSkillSelect = (skill) => {
    setSelectedSkill(skill);
    setSearch("");
    setPage(1);
  };

  const handleRatePresetSelect = (min, max) => {
    setMinRate(min);
    setMaxRate(max);
    setPage(1);
  };

  const resetAllFilters = () => {
    setSearch("");
    setSelectedSkill("All Skills");
    setMinRate("");
    setMaxRate("");
    setPage(1);
  };

  const startResult = totalResults === 0 ? 0 : (page - 1) * limit + 1;
  const endResult = Math.min(page * limit, totalResults);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 font-sans space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-[2.5rem] p-8 text-center space-y-3 relative overflow-hidden">
        <div className="amber-gradient mx-auto flex h-13 w-13 items-center justify-center rounded-2xl text-white shadow-lg mb-2">
          <Users className="w-6 h-6" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text)]">
          Browse Top <span className="amber-text-gradient">Vetted Freelancers</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
          Connect with top-rated developers, designers, and specialists ready to deliver high-impact results for your projects.
        </p>
      </div>

      {/* Skill Matrix Pills */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Skill Matrix Categories:
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SKILL_PILLS.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => handleSkillSelect(skill)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                selectedSkill === skill
                  ? "amber-gradient amber-glow text-white scale-105"
                  : "border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text)] hover:border-amber-400"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Rate Filter Toolbar */}
      <form onSubmit={handleFilterSubmit} className="glass-panel rounded-[2rem] p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Search Field */}
          <div className="lg:col-span-5 relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-amber-400" />
            <input
              type="text"
              placeholder="Search freelancer name, bio, or skills..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (selectedSkill !== "All Skills") setSelectedSkill("All Skills");
              }}
              className="w-full pl-10 pr-10 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-full text-sm text-[var(--text)] focus:outline-none focus:border-amber-400 placeholder:[var(--muted)]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 text-[var(--muted)] hover:text-amber-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Rate Preset Pills */}
          <div className="lg:col-span-4 flex flex-wrap items-center gap-1.5">
            {RATE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleRatePresetSelect(preset.min, preset.max)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition cursor-pointer ${
                  minRate === preset.min && maxRate === preset.max
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Min/Max Input */}
          <div className="lg:col-span-3 flex items-center gap-2">
            <input
              type="number"
              placeholder="Min $"
              value={minRate}
              onChange={(e) => setMinRate(e.target.value)}
              className="w-full px-3 py-2.5 bg-[var(--surface-strong)] border border-[var(--border)] rounded-full text-xs text-[var(--text)] focus:outline-none focus:border-amber-400"
            />
            <span className="text-[var(--muted)] text-xs font-bold">-</span>
            <input
              type="number"
              placeholder="Max $"
              value={maxRate}
              onChange={(e) => setMaxRate(e.target.value)}
              className="w-full px-3 py-2.5 bg-[var(--surface-strong)] border border-[var(--border)] rounded-full text-xs text-[var(--text)] focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="amber-gradient amber-glow px-5 py-2.5 rounded-full text-xs font-extrabold text-white transition hover:scale-105 shrink-0"
            >
              Filter
            </button>
          </div>
        </div>
      </form>

      {/* Freelancers Directory Grid */}
      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-72 gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Loading Verified Freelancers...</p>
        </div>
      ) : freelancers.length === 0 ? (
        <div className="glass-panel text-center py-16 px-6 rounded-[2.5rem] space-y-4 max-w-lg mx-auto">
          <SlidersHorizontal className="w-10 h-10 mx-auto text-amber-400 opacity-60" />
          <h3 className="text-xl font-extrabold text-[var(--text)]">No Freelancers Found</h3>
          <p className="text-sm text-[var(--muted)]">
            We couldn&apos;t find any freelancers matching your search criteria.
          </p>
          <button
            onClick={resetAllFilters}
            className="amber-gradient amber-glow px-6 py-2.5 rounded-full text-xs font-bold text-white uppercase tracking-wider transition hover:scale-105"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((freelancer) => (
            <FreelancerCard key={freelancer._id || freelancer.id} freelancer={freelancer} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-[var(--border)]">
          <div className="text-xs font-semibold text-[var(--muted)]">
            Showing <span className="font-bold text-[var(--text)]">{startResult}-{endResult}</span> of <span className="font-bold text-[var(--text)]">{totalResults}</span> verified freelancers
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-xs font-bold text-[var(--text)] transition hover:border-amber-400 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-xs font-bold text-[var(--text)] transition hover:border-amber-400 disabled:opacity-40"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseFreelancersPage;