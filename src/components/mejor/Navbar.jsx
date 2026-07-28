"use client";

import Image from "next/image";
import Link from "next/link";
import DropDownMenu from "../minor/DropDownMenu";
import NavLink from "../minor/NavLink";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import avatar from "@/assets/user.png";

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();

  const userImage =
    typeof session?.user?.image === "string" && session.user.image.startsWith("http")
      ? session.user.image
      : avatar;

  const getDashboardHref = (role) => {
    if (role === "admin") return "/admin";
    if (role === "freelancer") return "/freelancer";
    return "/client";
  };

  const getProfileHref = (role) => {
    if (role === "admin") return "/admin/profile";
    if (role === "freelancer") return "/freelancer/profile";
    return "/client/profile";
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
      <nav className="glass-panel mx-auto flex w-[95%] items-center justify-between rounded-full px-3 py-2.5 lg:w-[76%]">
        <div className="flex items-center gap-2">
          <div className="block md:hidden">
            <DropDownMenu menus={menus} />
          </div>

          <Link href="/" className="flex items-center gap-3">
            <div className="brand-gradient hidden h-10 w-10 items-center justify-center rounded-full p-1 shadow-lg md:flex">
              <img src="/favicon.svg" alt="SkillSwap logo" className="h-6 w-6" />
            </div>
            <div className="leading-tight">
              <h2 className="text-base font-bold tracking-tight text-[var(--text)] md:text-lg">
                Skill<span className="ml-1 text-[var(--accent)]">Swap</span>
              </h2>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
                skills marketplace
              </p>
            </div>
          </Link>
        </div>

        <ul className="hidden items-center gap-7 lg:flex">
          {menus.map((menu) => (
            <li key={menu.href}>
              <NavLink href={menu.href}>
                <span className="text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--primary)]">
                  {menu.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="h-8 w-20 animate-pulse rounded-full bg-[var(--surface-strong)]" />
          ) : session?.user ? (
            <>
              <Link href={getProfileHref(session.user.role)} className="flex items-center">
                <Image
                  src={userImage}
                  alt="User"
                  width={34}
                  height={34}
                  className="rounded-full border border-[var(--border)] object-cover"
                  onError={(e) => {
                    e.currentTarget.src = avatar.src || avatar;
                  }}
                />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1.5 text-xs font-semibold text-[var(--text)] transition hover:-translate-y-0.5"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1.5 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-0.5"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="brand-gradient rounded-full px-3 py-1.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
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