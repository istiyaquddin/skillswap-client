"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getAllTasks } from '@/lib/api/tasks';
import TaskCard from '@/components/mejor/TaskCard';
import { Search, ChevronLeft, ChevronRight, Loader2, X, SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';

const TasksPage = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [minBudget, setMinBudget] = useState("");
    const [maxBudget, setMaxBudget] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [page, setPage] = useState(1);
    const limit = 9; 

    const [tasks, setTasks] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(true);

    const categories = [
        { label: "All Tasks", value: "" },
        { label: "Development", value: "Development" },
        { label: "Design", value: "Design" },
        { label: "Writing", value: "Writing" },
        { label: "Marketing", value: "Marketing" },
        { label: "Other", value: "Other" },
    ];

    const fetchTasksData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllTasks({
                search,
                category,
                minBudget,
                maxBudget,
                page,
                limit,
                status: "open"
            });

            if (response?.success) {
                let fetchedTasks = response.tasks || [];

                // Client-side sorting logic
                if (sortBy === "budget-desc") {
                    fetchedTasks.sort((a, b) => Number(b.budget) - Number(a.budget));
                } else if (sortBy === "budget-asc") {
                    fetchedTasks.sort((a, b) => Number(a.budget) - Number(b.budget));
                } else if (sortBy === "proposals") {
                    fetchedTasks.sort((a, b) => (b.proposals?.length || 0) - (a.proposals?.length || 0));
                }

                setTasks(fetchedTasks);
                setTotalPages(response.totalPages || 1);
                setTotalResults(response.totalResults || 0);
            }
        } catch (error) {
            console.error("Error loading tasks:", error);
        } finally {
            setLoading(false);
        }
    }, [search, category, minBudget, maxBudget, page, limit, sortBy]);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (isMounted) {
                await fetchTasksData();
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [search, category, page, fetchTasksData]);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setPage(1); 
        fetchTasksData();
    };

    const handlePresetBudget = (min, max) => {
        setMinBudget(min ? String(min) : "");
        setMaxBudget(max ? String(max) : "");
        setPage(1);
    };

    const clearAllFilters = () => {
        setSearch("");
        setCategory("");
        setMinBudget("");
        setMaxBudget("");
        setSortBy("latest");
        setPage(1);
    };

    const startResult = totalResults === 0 ? 0 : (page - 1) * limit + 1;
    const endResult = Math.min(page * limit, totalResults);

    const renderPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (page <= 3) {
                pages.push(1, 2, 3, "...", totalPages);
            } else if (page >= totalPages - 2) {
                pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", page, "...", totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 font-sans">
            
            {/* Header Banner */}
            <div className="mb-10 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[var(--border)] pb-8">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                        <Sparkles className="h-3.5 w-3.5" /> Global Project Feed
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--text)]">
                        Browse Open <span className="amber-text-gradient">Tasks & Sprints</span>
                    </h1>
                    <p className="text-sm md:text-base text-[var(--muted)] mt-2.5 max-w-2xl">
                        Discover micro-tasks and software engineering sprints tailored to your skillset. Apply with custom proposals and earn securely.
                    </p>
                </div>

                <div className="flex items-center gap-3 justify-center lg:justify-end">
                    <span className="text-xs font-semibold text-[var(--muted)]">Sort By:</span>
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-xs font-bold text-[var(--text)] focus:outline-none focus:border-amber-400 cursor-pointer appearance-none pr-8"
                        >
                            <option value="latest">Latest First</option>
                            <option value="budget-desc">Budget: High to Low</option>
                            <option value="budget-asc">Budget: Low to High</option>
                            <option value="proposals">Most Proposals</option>
                        </select>
                        <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-amber-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Category Pills Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
                {categories.map((cat) => {
                    const isActive = category === cat.value;
                    return (
                        <button
                            key={cat.label}
                            onClick={() => { setCategory(cat.value); setPage(1); }}
                            className={`rounded-full px-5 py-2.5 text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                                isActive
                                    ? "amber-gradient amber-glow text-white scale-105"
                                    : "glass-panel text-[var(--muted)] hover:text-amber-400 hover:border-amber-500/30"
                            }`}
                        >
                            {cat.label}
                        </button>
                    );
                })}
            </div>

            {/* Search & Filter Toolbar */}
            <form onSubmit={handleFilterSubmit} className="glass-panel p-5 rounded-[2rem] mb-10 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Search Input */}
                    <div className="md:col-span-6 relative flex items-center">
                        <Search className="absolute left-4 w-4 h-4 text-amber-400" />
                        <input
                            type="text"
                            placeholder="Search tasks by title or keywords..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-11 pr-10 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-full text-sm text-[var(--text)] placeholder:[var(--muted)] focus:outline-none focus:border-amber-400 transition"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="absolute right-3 text-[var(--muted)] hover:text-amber-400"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Min & Max Budget Inputs */}
                    <div className="md:col-span-4 flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Min $"
                            value={minBudget}
                            onChange={(e) => setMinBudget(e.target.value)}
                            className="w-full px-4 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-full text-sm text-[var(--text)] placeholder:[var(--muted)] focus:outline-none focus:border-amber-400"
                        />
                        <span className="text-[var(--muted)] font-semibold">-</span>
                        <input
                            type="number"
                            placeholder="Max $"
                            value={maxBudget}
                            onChange={(e) => setMaxBudget(e.target.value)}
                            className="w-full px-4 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-full text-sm text-[var(--text)] placeholder:[var(--muted)] focus:outline-none focus:border-amber-400"
                        />
                    </div>

                    {/* Apply Button */}
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="w-full amber-gradient amber-glow py-3 px-6 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
                        </button>
                    </div>
                </div>

                {/* Quick Budget Presets */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border)] text-xs text-[var(--muted)]">
                    <div className="flex items-center gap-2">
                        <span className="font-bold uppercase tracking-wider text-[10px]">Presets:</span>
                        <button
                            type="button"
                            onClick={() => handlePresetBudget("", "100")}
                            className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 hover:border-amber-400 hover:text-amber-400 transition"
                        >
                            Under $100
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePresetBudget("100", "500")}
                            className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 hover:border-amber-400 hover:text-amber-400 transition"
                        >
                            $100 - $500
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePresetBudget("500", "")}
                            className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1 hover:border-amber-400 hover:text-amber-400 transition"
                        >
                            $500+
                        </button>
                    </div>

                    {(search || category || minBudget || maxBudget || sortBy !== "latest") && (
                        <button
                            type="button"
                            onClick={clearAllFilters}
                            className="text-amber-400 hover:underline font-bold flex items-center gap-1"
                        >
                            <X className="w-3.5 h-3.5" /> Reset Filters
                        </button>
                    )}
                </div>
            </form>

            {/* Task Grid & State Rendering */}
            {loading ? (
                <div className="flex flex-col justify-center items-center min-h-[40vh] gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
                    <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Fetching live tasks...</p>
                </div>
            ) : tasks.length === 0 ? (
                <div className="glass-panel text-center py-20 rounded-[2.5rem] p-8 border-dashed">
                    <div className="amber-gradient mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg">
                        <Search className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text)] mb-2">No tasks found</h3>
                    <p className="text-sm text-[var(--muted)] max-w-md mx-auto mb-6">
                        No open tasks matched your search or budget criteria. Try clearing your filters to see more results.
                    </p>
                    <button
                        onClick={clearAllFilters}
                        className="amber-gradient amber-glow px-6 py-2.5 rounded-full text-xs font-bold text-white uppercase tracking-wider"
                    >
                        Reset All Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                        <Link key={task._id} href={`/browse-task/${task._id}`}>
                            <TaskCard task={task} />
                        </Link>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-14 pt-8 border-t border-[var(--border)]">
                    <div className="text-xs font-semibold text-[var(--muted)]">
                        Showing <span className="text-[var(--text)] font-bold">{startResult}-{endResult}</span> of <span className="text-amber-400 font-bold">{totalResults}</span> open tasks
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page === 1}
                            className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text)] hover:border-amber-400 hover:text-amber-400 disabled:opacity-30 disabled:pointer-events-none transition"
                        >
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </button>

                        {renderPageNumbers().map((item, index) => (
                            <button
                                key={index}
                                onClick={() => typeof item === "number" && setPage(item)}
                                disabled={item === "..."}
                                className={`w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold transition ${
                                    item === page
                                        ? "amber-gradient amber-glow text-white scale-105"
                                        : "bg-[var(--surface-strong)] border border-[var(--border)] text-[var(--muted)] hover:text-amber-400 hover:border-amber-400 disabled:opacity-40"
                                }`}
                            >
                                {item}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            disabled={page === totalPages}
                            className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text)] hover:border-amber-400 hover:text-amber-400 disabled:opacity-30 disabled:pointer-events-none transition"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TasksPage;