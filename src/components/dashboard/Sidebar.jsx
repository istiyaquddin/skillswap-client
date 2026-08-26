"use client";
import avatar from "@/assets/user.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutGrid,
  ClipboardList,
  PlusCircle,
  FileText,
  Wallet,
  ChevronRight,
  Menu,
  X,
  Search,
  BriefcaseBusiness,
  DollarSign,
  UserRoundPen,
  Users,
  Briefcase,
  LogOut,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function Sidebar() {
  const { data: session } = authClient.useSession();

  const clientLinks = [
    { name: "Overview", icon: LayoutGrid, href: "/dashboard/client" },
    { name: "Profile Preview", icon: UserRoundPen, href: "/dashboard/client/profile" },
    { name: "My Tasks", icon: ClipboardList, href: "/dashboard/client/tasks" },
    { name: "Post Task", icon: PlusCircle, href: "/dashboard/client/tasks/post-task" },
    { name: "Proposals", icon: FileText, href: "/dashboard/client/proposals" },
    { name: "Payments", icon: Wallet, href: "/dashboard/client/payments" },
  ];

  const freelancerLinks = [
    { name: "Overview", icon: LayoutGrid, href: "/dashboard/freelancer" },
    { name: "Profile Preview", icon: UserRoundPen, href: "/dashboard/freelancer/profile" },
    { name: "Browse Tasks", icon: Search, href: "/browse-task" },
    { name: "My Proposals", icon: FileText, href: "/dashboard/freelancer/my-proposals" },
    { name: "Active Projects", icon: BriefcaseBusiness, href: "/dashboard/freelancer/active-projects" },
    { name: "Earnings", icon: DollarSign, href: "/dashboard/freelancer/earnings" },
  ];

  const adminLinks = [
    { name: "Overview", icon: LayoutGrid, href: "/dashboard/admin" },
    { name: "Profile Preview", icon: UserRoundPen, href: "/dashboard/admin/profile" },
    { name: "Users", icon: Users, href: "/dashboard/admin/users" },
    { name: "Tasks", icon: Briefcase, href: "/dashboard/admin/tasks" },
    { name: "Payments", icon: DollarSign, href: "/dashboard/admin/payments" },
  ];

  const linksMap = { client: clientLinks, freelancer: freelancerLinks, admin: adminLinks };
  const role = session?.user?.role || "client";
  const menuItems = linksMap[role] || clientLinks;

  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  return (
    <>
      {!isOpen && (
        <div className="fixed left-4 top-3 z-50 flex items-center gap-3 md:hidden">
          <button onClick={() => setIsOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-lg">
            <Menu size={20} className="text-[var(--primary)]" />
          </button>
          <Link href="/">
            <h2 className="text-lg font-bold leading-none text-[var(--text)]">Skill<span className="text-[var(--accent)]">Swap</span></h2>
            <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">workspace</p>
          </Link>
        </div>
      )}

      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden" />}

      <aside className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-[var(--border)] bg-[var(--surface-strong)] p-4 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:static md:translate-x-0`}>
        <button onClick={() => setIsOpen(false)} className="absolute right-4 top-4 text-[var(--muted)] hover:text-[var(--primary)] md:hidden">
          <X size={20} />
        </button>

        <Link href="/" className="mb-6 mt-8 flex items-center gap-3 md:mt-0">
          <div className="brand-gradient flex h-10 w-10 items-center justify-center rounded-2xl p-1.5">
            <img src="/favicon.svg" alt="SkillSwap logo" className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold leading-none text-[var(--text)]">Skill<span className="text-[var(--accent)]">Swap</span></h2>
            <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">workspace</p>
          </div>
        </Link>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center justify-between rounded-2xl px-3 py-2.5 transition-all duration-300 ${isActive ? "bg-[var(--surface)] text-[var(--primary)] shadow-sm" : "hover:bg-[var(--surface)] hover:text-[var(--primary)]"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${isActive ? "bg-[#1dbf73]/15 text-[#1dbf73] scale-105" : "group-hover:bg-[#1dbf73]/10 group-hover:text-[#1dbf73] group-hover:scale-110"}`}>
                    <Icon size={18} className="transition-transform duration-300 group-hover:rotate-6" />
                  </div>
                  <span className={`text-sm font-semibold transition-colors ${isActive ? "text-[#1dbf73] font-bold" : "group-hover:text-[#1dbf73]"}`}>{item.name}</span>
                </div>
                <ChevronRight size={16} className={`transition-all duration-300 ${isActive ? "text-[#1dbf73] translate-x-0.5" : "text-[var(--muted)] group-hover:text-[#1dbf73] group-hover:translate-x-1"}`} />
              </Link>
            );
          })}
        </div>

        <div className="mt-auto space-y-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 backdrop-blur shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 font-bold animate-pulse">⚡</div>
              <div>
                <h4 className="text-sm font-bold text-[var(--text)]">Stay productive</h4>
                <p className="text-xs text-[var(--muted)]">Your workspace is active.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-sm">
            <div className="flex items-center gap-3">
              <Image src={session?.user?.image?.startsWith("https") ? session.user.image : avatar} alt="profile" width={40} height={40} className="rounded-full border-2 border-amber-500/30 object-cover" />
              <div>
                <h4 className="max-w-[7rem] truncate text-sm font-bold text-[var(--text)]">{session?.user?.name}</h4>
                <p className="text-[11px] font-bold capitalize text-amber-400">{session?.user?.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} title="Logout" className="rounded-xl p-2 text-[var(--muted)] transition-colors hover:bg-amber-500/10 hover:text-amber-400 cursor-pointer">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}