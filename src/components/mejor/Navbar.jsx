"use client";

import Image from "next/image";
import Link from "next/link";
import DropDownMenu from "../minor/DropDownMenu";
import NavLink from "../minor/NavLink";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import avatar from "@/assets/user.png";
import { Briefcase } from "lucide-react";

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();

  const userImage =
    typeof session?.user?.image === "string" && session.user.image.startsWith("http")
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
        { name: "Browse Tasks", href: "/browse-task" },
        { name: "Browse Freelancers", href: "/browse-freelancer" },
      ]
    : [
        { name: "Home", href: "/" },
        { name: "Browse Tasks", href: "/browse-task" },
        { name: "Browse Freelancers", href: "/browse-freelancer" },
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
      <nav className="glass-panel mx-auto flex w-[95%] items-center justify-between rounded-full px-4 py-2.5 lg:w-[78%] transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="block md:hidden">
            <DropDownMenu menus={menus} />
          </div>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="amber-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md transition-transform duration-300 group-hover:scale-105">
              <Briefcase className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="leading-tight">
              <h2 className="text-lg font-extrabold tracking-tight text-[var(--text)]">
                Skill<span className="amber-text-gradient">Swap</span>
              </h2>
            </div>
          </Link>
        </div>

        <ul className="hidden items-center gap-8 lg:flex">
          {menus.map((menu) => (
            <li key={menu.href}>
              <NavLink href={menu.href}>
                <span className="text-sm font-semibold text-[var(--muted)] transition-colors hover:text-amber-400">
                  {menu.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-[var(--surface-strong)]" />
          ) : session?.user ? (
            <>
              <Link href={getProfileHref(session.user.role)} className="flex items-center">
                <Image
                  src={userImage}
                  alt="User"
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-amber-500/40 object-cover hover:border-amber-400 transition"
                  onError={(e) => {
                    e.currentTarget.src = avatar.src || avatar;
                  }}
                />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400 transition hover:bg-amber-500/20 active:scale-95"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:text-amber-400"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="amber-gradient amber-glow rounded-full px-5 py-2 text-sm font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;