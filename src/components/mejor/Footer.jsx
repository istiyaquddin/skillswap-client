import Link from "next/link";
import { FaFacebookF, FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-[var(--border)]/80">
      <div className="mx-auto w-[95%] py-14 lg:w-[76%]">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-6 flex items-center gap-3">
              <div className="brand-gradient flex h-10 w-10 items-center justify-center rounded-full text-lg font-black text-white">
                S
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                  Skill<span className="text-[var(--accent)]">Swap</span>
                </h2>
                <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
                  skills marketplace
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-[var(--muted)]">
              Connect with high-signal freelancers, launch ambitious projects, and turn great work into lasting partnerships.
            </p>

            <div className="mt-5 flex items-center gap-3">
              {[
                FaFacebookF,
                FaLinkedinIn,
                FaGithub,
                FaXTwitter,
              ].map((Icon, index) => (
                <a key={index} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2.5 text-[var(--muted)] transition hover:-translate-y-0.5 hover:text-[var(--primary)]">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-[var(--text)]">Marketplace</h3>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              <li><Link href="/browse-task">Browse Tasks</Link></li>
              <li><Link href="/browse-freelancer">Browse Freelancers</Link></li>
              <li><Link href="/client/tasks/post-task">Post a Task</Link></li>
              <li><Link href="/categories">Categories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-[var(--text)]">Company</h3>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-[var(--text)]">Support</h3>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/help-center">Help Center</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)]/80">
        <div className="mx-auto flex w-[95%] flex-col items-center justify-between gap-4 py-5 text-sm text-[var(--muted)] md:flex-row lg:w-[76%]">
          <p>© {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
