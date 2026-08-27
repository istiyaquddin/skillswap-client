import Link from "next/link";
import { FaFacebookF, FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { GraduationCap, Sparkles, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-[var(--border)]/80 relative overflow-hidden bg-[var(--surface)]/30 backdrop-blur">
      <div className="mx-auto w-[95%] py-14 lg:w-[76%]">
        <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-6 flex items-center gap-3 group inline-flex">
              <div className="amber-gradient amber-glow flex h-11 w-11 items-center justify-center rounded-2xl text-white font-black shadow-lg transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 relative">
                <GraduationCap className="h-5 w-5" />
                <Sparkles className="absolute -bottom-1 -right-1 h-3.5 w-3.5 text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-[var(--text)]">
                  Skill<span className="amber-text-gradient">Swap</span>
                </h2>
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--muted)] group-hover:text-amber-400 transition-colors">
                  Campus Skills Exchange
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-[var(--muted)]">
              Connect with peer mentors, launch ambitious tasks, build your portfolio, and turn campus skills into real-world impact.
            </p>

            <div className="mt-6">
              <p className="text-xs font-bold text-[var(--text)] mb-2 uppercase tracking-wider">Stay Updated</p>
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your student email..."
                  className="w-full rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-xs text-[var(--text)] placeholder-[var(--muted)] focus:border-amber-500/50 focus:outline-none transition min-w-0"
                />
                <button
                  type="button"
                  aria-label="Subscribe to newsletter"
                  className="amber-gradient amber-glow shine-button flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
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
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] p-2.5 text-[var(--muted)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:text-amber-400 hover:shadow-lg"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-[var(--text)] text-sm tracking-wider uppercase">Marketplace</h3>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              <li><Link href="/browse-task" className="transition hover:text-amber-400 hover:translate-x-1 inline-block">Browse Tasks</Link></li>
              <li><Link href="/browse-freelancer" className="transition hover:text-amber-400 hover:translate-x-1 inline-block">Find Mentors</Link></li>
              <li><Link href="/dashboard/client/tasks/post-task" className="transition hover:text-amber-400 hover:translate-x-1 inline-block">Post a Task</Link></li>
              <li><Link href="/categories" className="transition hover:text-amber-400 hover:translate-x-1 inline-block">Skill Categories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-[var(--text)] text-sm tracking-wider uppercase">Platform</h3>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              <li><Link href="/about" className="transition hover:text-amber-400 hover:translate-x-1 inline-block">About Us</Link></li>
              <li><Link href="/pricing" className="transition hover:text-amber-400 hover:translate-x-1 inline-block">Pricing</Link></li>
              <li><Link href="/contact" className="transition hover:text-amber-400 hover:translate-x-1 inline-block">Contact Support</Link></li>
              <li><Link href="/careers" className="transition hover:text-amber-400 hover:translate-x-1 inline-block">Careers</Link></li>
              <li><Link href="/blog" className="transition hover:text-amber-400 hover:translate-x-1 inline-block">Campus Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-[var(--text)] text-sm tracking-wider uppercase">Support</h3>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              <li><Link href="/faq" className="transition hover:text-amber-400 hover:translate-x-1 inline-block">FAQ</Link></li>
              <li><Link href="/help-center" className="transition hover:text-amber-400 hover:translate-x-1 inline-block">Help Center</Link></li>
              <li><Link href="/privacy" className="transition hover:text-amber-400 hover:translate-x-1 inline-block">Privacy Policy</Link></li>
              <li><Link href="/terms" className="transition hover:text-amber-400 hover:translate-x-1 inline-block">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)]/80">
        <div className="mx-auto flex w-[95%] flex-col items-center justify-between gap-4 py-5 text-xs font-medium text-[var(--muted)] md:flex-row lg:w-[76%]">
          <p>© {new Date().getFullYear()} SkillSwap. Built with passion for campus collaboration.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-amber-400 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-amber-400 transition">Terms</Link>
            <Link href="/cookies" className="hover:text-amber-400 transition">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

