import Link from "next/link";
import { FaFacebookF, FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { GraduationCap, Sparkles, Send, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-20 relative overflow-hidden">
      {/* Top gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#1dbf73]/40 to-transparent" />

      {/* Subtle background mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[#1dbf73]/5 blur-[100px]" />
        <div className="absolute top-0 right-1/4 h-48 w-48 rounded-full bg-blue-500/4 blur-[80px]" />
      </div>

      <div className="relative bg-[var(--surface)]/40 backdrop-blur border-t border-[var(--border)]/60">
        <div className="mx-auto w-[95%] py-14 lg:w-[78%]">
          <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="mb-6 flex items-center gap-3 group w-fit">
                <div className="amber-gradient amber-glow flex h-11 w-11 items-center justify-center rounded-2xl text-white font-black shadow-lg transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 relative">
                  <GraduationCap className="h-5 w-5" />
                  <Sparkles className="absolute -bottom-1 -right-1 h-3.5 w-3.5 text-white animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-[var(--text)]">
                    Skill<span className="amber-text-gradient">Swap</span>
                  </h2>
                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--muted)] group-hover:text-[#1dbf73] transition-colors">
                    Campus Skills Exchange
                  </p>
                </div>
              </Link>

              <p className="mt-4 max-w-md text-sm leading-6 text-[var(--muted)]">
                Connect with peer mentors, launch ambitious tasks, build your portfolio, and turn campus skills into real-world impact.
              </p>

              {/* Newsletter */}
              <div className="mt-6">
                <p className="text-xs font-bold text-[var(--text)] mb-2.5 uppercase tracking-wider">
                  Stay Updated
                </p>
                <div className="flex items-center gap-2 max-w-sm">
                  <div className="flex-1 min-w-0 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 flex items-center gap-2 focus-within:border-[#1dbf73]/50 transition-colors">
                    <input
                      type="email"
                      placeholder="Your student email..."
                      className="w-full bg-transparent text-xs text-[var(--text)] placeholder-[var(--muted)] focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    aria-label="Subscribe to newsletter"
                    className="amber-gradient amber-glow shine-button flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Social Icons */}
              <div className="mt-6 flex items-center gap-2.5">
                {[
                  { icon: FaFacebookF, label: "Facebook" },
                  { icon: FaLinkedinIn, label: "LinkedIn" },
                  { icon: FaGithub, label: "GitHub" },
                  { icon: FaXTwitter, label: "X (Twitter)" },
                ].map(({ icon: Icon, label }, index) => (
                  <a
                    key={index}
                    aria-label={label}
                    href="#"
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-2.5 text-[var(--muted)] transition-all duration-300 hover:-translate-y-1 hover:border-[#1dbf73]/40 hover:text-[#1dbf73] hover:shadow-md"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links: Marketplace */}
            <div>
              <h3 className="mb-4 font-bold text-[var(--text)] text-xs tracking-widest uppercase">
                Marketplace
              </h3>
              <ul className="space-y-3 text-sm text-[var(--muted)]">
                <li>
                  <Link href="/browse-task" className="transition-all hover:text-[#1dbf73] hover:translate-x-1 inline-flex items-center gap-1.5 group">
                    <span className="h-1 w-1 rounded-full bg-[#1dbf73]/0 group-hover:bg-[#1dbf73] transition-all" />
                    Browse Tasks
                  </Link>
                </li>
                <li>
                  <Link href="/browse-freelancer" className="transition-all hover:text-[#1dbf73] hover:translate-x-1 inline-flex items-center gap-1.5 group">
                    <span className="h-1 w-1 rounded-full bg-[#1dbf73]/0 group-hover:bg-[#1dbf73] transition-all" />
                    Find Mentors
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/client/tasks/post-task" className="transition-all hover:text-[#1dbf73] hover:translate-x-1 inline-flex items-center gap-1.5 group">
                    <span className="h-1 w-1 rounded-full bg-[#1dbf73]/0 group-hover:bg-[#1dbf73] transition-all" />
                    Post a Task
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="transition-all hover:text-[#1dbf73] hover:translate-x-1 inline-flex items-center gap-1.5 group">
                    <span className="h-1 w-1 rounded-full bg-[#1dbf73]/0 group-hover:bg-[#1dbf73] transition-all" />
                    Skill Categories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Links: Platform */}
            <div>
              <h3 className="mb-4 font-bold text-[var(--text)] text-xs tracking-widest uppercase">
                Platform
              </h3>
              <ul className="space-y-3 text-sm text-[var(--muted)]">
                <li>
                  <Link href="/about" className="transition-all hover:text-[#1dbf73] hover:translate-x-1 inline-flex items-center gap-1.5 group">
                    <span className="h-1 w-1 rounded-full bg-[#1dbf73]/0 group-hover:bg-[#1dbf73] transition-all" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="transition-all hover:text-[#1dbf73] hover:translate-x-1 inline-flex items-center gap-1.5 group">
                    <span className="h-1 w-1 rounded-full bg-[#1dbf73]/0 group-hover:bg-[#1dbf73] transition-all" />
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="transition-all hover:text-[#1dbf73] hover:translate-x-1 inline-flex items-center gap-1.5 group">
                    <span className="h-1 w-1 rounded-full bg-[#1dbf73]/0 group-hover:bg-[#1dbf73] transition-all" />
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="transition-all hover:text-[#1dbf73] hover:translate-x-1 inline-flex items-center gap-1.5 group">
                    <span className="h-1 w-1 rounded-full bg-[#1dbf73]/0 group-hover:bg-[#1dbf73] transition-all" />
                    Campus Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Links: Support */}
            <div>
              <h3 className="mb-4 font-bold text-[var(--text)] text-xs tracking-widest uppercase">
                Support
              </h3>
              <ul className="space-y-3 text-sm text-[var(--muted)]">
                <li>
                  <Link href="/faq" className="transition-all hover:text-[#1dbf73] hover:translate-x-1 inline-flex items-center gap-1.5 group">
                    <span className="h-1 w-1 rounded-full bg-[#1dbf73]/0 group-hover:bg-[#1dbf73] transition-all" />
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/help-center" className="transition-all hover:text-[#1dbf73] hover:translate-x-1 inline-flex items-center gap-1.5 group">
                    <span className="h-1 w-1 rounded-full bg-[#1dbf73]/0 group-hover:bg-[#1dbf73] transition-all" />
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="transition-all hover:text-[#1dbf73] hover:translate-x-1 inline-flex items-center gap-1.5 group">
                    <span className="h-1 w-1 rounded-full bg-[#1dbf73]/0 group-hover:bg-[#1dbf73] transition-all" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="transition-all hover:text-[#1dbf73] hover:translate-x-1 inline-flex items-center gap-1.5 group">
                    <span className="h-1 w-1 rounded-full bg-[#1dbf73]/0 group-hover:bg-[#1dbf73] transition-all" />
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border)]/60">
          <div className="mx-auto flex w-[95%] flex-col items-center justify-between gap-3 py-5 text-xs font-medium text-[var(--muted)] md:flex-row lg:w-[78%]">
            <p className="flex items-center gap-1.5">
              © {new Date().getFullYear()} SkillSwap. Made with{" "}
              <Heart className="h-3 w-3 fill-rose-400 text-rose-400" /> for campus creators.
            </p>
            <div className="flex items-center gap-5">
              <Link href="/privacy" className="hover:text-[#1dbf73] transition">Privacy</Link>
              <Link href="/terms" className="hover:text-[#1dbf73] transition">Terms</Link>
              <Link href="/cookies" className="hover:text-[#1dbf73] transition">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
