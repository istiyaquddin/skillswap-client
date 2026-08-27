"use client";

import avatar from "@/assets/user.png";
import { authClient } from "@/lib/auth-client";
import { GraduationCap, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DropDownMenu from "../minor/DropDownMenu";
import NavLink from "../minor/NavLink";

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const userImage =
    typeof session?.user?.image === "string" &&
    session.user.image.startsWith("http")
      ? session.user.image
      : avatar;

  const getDashboardHref = (role) => {
    if (role === "admin") return "/dashboard/admin";
    if (role === "freelancer") return "/dashboard/freelancer";
    return "/dashboard/client";
  };

  const getProfileHref = (role) => {
    if (role === "admin") return "/dashboard/admin/profile";
    if (role === "freelancer") return "/dashboard/freelancer/profile";
    return "/dashboard/client/profile";
  };

  const menus = session?.user
    ? [
        { name: "Home", href: "/" },
        { name: "Dashboard", href: getDashboardHref(session.user.role) },
        { name: "Explore Skills", href: "/browse-task" },
        { name: "Find Mentors", href: "/browse-freelancer" },
      ]
    : [
        { name: "Home", href: "/" },
        { name: "Explore Skills", href: "/browse-task" },
        { name: "Find Mentors", href: "/browse-freelancer" },
      ];

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    if (!error) {
      toast.success("Logged out successfully");
      window.location.href = "/";
    }
    if (error) {
      toast.error(error.message || "Logout Failed");
    }
  };

  return (
    <header className="sticky top-4 z-50 py-3">
      <nav
        className={`glass-panel mx-auto flex w-[95%] items-center justify-between rounded-full px-4 py-2.5 lg:w-[78%] transition-all duration-300 ${
          scrolled
            ? "shadow-[0_8px_32px_rgba(29,191,115,0.14),0_2px_12px_rgba(0,0,0,0.07)]"
            : "shadow-xl"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="block md:hidden">
            <DropDownMenu menus={menus} />
          </div>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1a1c1e] text-white shadow-[0_8px_20px_rgba(29,191,115,0.32)] transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#3b82f6] ring-[3px] ring-white/80 animate-pulse" />
              <span className="absolute bottom-1.5 left-1.5 h-2 w-2 rounded-full bg-[#1dbf73]" />
              <GraduationCap className="relative z-10 h-5 w-5 stroke-[2.2] group-hover:scale-110 transition-transform" />
              <Sparkles
                className="absolute -bottom-1 -right-1 h-4 w-4 text-[#1dbf73] animate-spin"
                style={{ animationDuration: "4s" }}
              />
            </div>
            <div className="leading-tight">
              <h2 className="text-[1.1rem] font-black tracking-tight text-[var(--text)]">
                Skill<span className="amber-text-gradient">Swap</span>
              </h2>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] group-hover:text-[#1dbf73] transition-colors">
                Campus exchange
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {menus.map((menu) => (
            <li key={menu.href}>
              <NavLink href={menu.href}>
                <span className="block rounded-full px-3.5 py-2 text-sm font-semibold text-[var(--muted)] transition-all duration-200 hover:bg-[#1dbf73]/8 hover:text-[#1dbf73]">
                  {menu.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Auth / User Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isPending ? (
            <div className="h-9 w-20 sm:w-24 animate-pulse rounded-full bg-[var(--surface-strong)]" />
          ) : session?.user ? (
            <>
              <Link
                href={getProfileHref(session.user.role)}
                className="flex items-center justify-center group shrink-0"
                title="View Profile"
              >
                <div className="relative h-9 w-9 sm:h-10 sm:w-10 min-w-9 sm:min-w-10 min-h-9 sm:min-h-10 shrink-0 aspect-square overflow-hidden rounded-full border-2 border-[#1dbf73]/35 group-hover:border-[#1dbf73] group-hover:scale-105 transition-all shadow-md bg-[#1dbf73]/10 flex items-center justify-center">
                  <Image
                    src={userImage}
                    alt="User Profile"
                    width={40}
                    height={40}
                    className="h-full w-full rounded-full object-cover aspect-square"
                    onError={(e) => {
                      e.currentTarget.src = avatar.src || avatar;
                    }}
                  />
                </div>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[#1dbf73]/25 bg-[#1dbf73]/10 px-3 sm:px-4 py-1.5 text-xs font-semibold text-[#1dbf73] transition-all hover:bg-[#1dbf73]/20 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[var(--muted)] transition-all hover:text-[#1dbf73] hidden xs:block"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="amber-gradient amber-glow shine-button rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-1.5"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Join</span>
                <Sparkles className="h-3.5 w-3.5 opacity-80" />
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
