"use client";

import React, { useEffect, useRef, useState } from "react";
import NavLink from "./NavLink";

const DropDownMenu = ({ menus }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div ref={menuRef} className="lg:hidden relative z-50">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        className="relative z-50 flex flex-col justify-center items-center gap-1 w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text)] transition hover:border-amber-400 cursor-pointer shadow-sm"
      >
        <span
          className={`w-4.5 h-0.5 bg-amber-400 rounded-full transition-all duration-300 ${
            menuOpen ? "rotate-45 translate-y-1.5" : ""
          }`}
        />

        <span
          className={`w-4.5 h-0.5 bg-amber-400 rounded-full transition-all duration-300 ${
            menuOpen ? "opacity-0" : ""
          }`}
        />

        <span
          className={`w-4.5 h-0.5 bg-amber-400 rounded-full transition-all duration-300 ${
            menuOpen ? "-rotate-45 -translate-y-1.5" : ""
          }`}
        />
      </button>

      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-xs transition-all duration-300 z-40
        ${menuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      <div
        className={`absolute top-12 left-0 w-64 rounded-3xl
        glass-panel border border-[var(--border)]
        shadow-2xl transition-all duration-300 z-50 overflow-hidden
        ${
          menuOpen
            ? "opacity-100 translate-y-0 scale-100 visible"
            : "opacity-0 -translate-y-4 scale-95 invisible"
        }`}
      >
        <div className="p-3">
          <div className="mb-3 px-4 py-3 rounded-2xl amber-gradient amber-glow text-white shadow-md">
            <h3 className="font-extrabold text-base">Welcome 👋</h3>
            <p className="text-xs text-white/90 mt-0.5">Campus Skill Exchange</p>
          </div>

          <ul className="space-y-1">
            {menus.map((menu) => (
              <li key={menu.href}>
                <NavLink href={menu.href} onClick={() => setMenuOpen(false)}>
                  <span className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-xs font-bold text-[var(--text)] hover:bg-amber-500/10 hover:text-amber-400 transition-all duration-200">
                    {menu.icon} {menu.name}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DropDownMenu;
