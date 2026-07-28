"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { FaGoogle, FaPaypal, FaArrowRight } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { SiMeta, SiNetflix, SiPayoneer } from "react-icons/si";

const Banner = () => {
  const { data: session } = authClient.useSession();

  const categories = [
    "Website Development",
    "Product Design",
    "UGC & Video",
    "Marketing",
    "Brand Strategy",
    "AI Automation",
  ];

  return (
    <section className="relative overflow-hidden py-10 md:py-16">
      <div className="absolute inset-0">
        <div className="bg-grid-pattern absolute inset-0 opacity-25" />
        <div className="absolute left-0 top-0 h-[26rem] w-[26rem] rounded-full bg-[var(--primary)]/20 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[24rem] w-[24rem] rounded-full bg-[var(--accent)]/20 blur-[140px]" />
      </div>

      <div className="relative mx-auto w-[95%] lg:w-[76%]">
        <div className="glass-panel overflow-hidden rounded-[2rem] border border-[var(--border)] p-6 md:p-10 lg:p-14">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="text-center lg:text-left">
              <div className="mb-4 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1.5 text-sm font-semibold text-[var(--primary)]">
                ✦ Premium freelance marketplace
              </div>
              <h1 className="text-4xl font-black leading-tight text-[var(--text)] md:text-5xl lg:text-6xl">
                Build faster with the right creative crew.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
                Hire proven specialists, post work in minutes, and keep every project moving with clear delivery and secure payments.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                {session?.user && session.user.role === "client" && (
                  <>
                    <Link href="/client/tasks/post-task" className="brand-gradient inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">
                      Post a Task <FiExternalLink />
                    </Link>
                    <Link href="/client/tasks" className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-0.5">
                      View My Tasks
                    </Link>
                  </>
                )}

                {session?.user && session.user.role === "freelancer" && (
                  <>
                    <Link href="/browse-task" className="brand-gradient inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">
                      Browse Tasks <FiExternalLink />
                    </Link>
                    <Link href="/freelancer/profile" className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-0.5">
                      Profile Preview
                    </Link>
                  </>
                )}

                {(!session?.user || session.user.role === "admin") && (
                  <>
                    <Link href="/browse-task" className="brand-gradient inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">
                      Browse Tasks <FiExternalLink />
                    </Link>
                    <Link href="/browse-freelancer" className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:-translate-y-0.5">
                      Find Talent
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start md:gap-3">
                {categories.map((item) => (
                  <div key={item} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--muted)]">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-xl">
              <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Live workspace</p>
                    <h2 className="mt-1 text-xl font-bold text-[var(--text)]">Team delivery board</h2>
                  </div>
                  <div className="rounded-full bg-[var(--accent)]/15 px-3 py-1 text-sm font-semibold text-[var(--accent)]">
                    24/7 active
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {[
                    ["Project brief", "Drafted and shared", "Ready"],
                    ["Design review", "Pending feedback", "In review"],
                    ["Payments", "Milestone secured", "Locked"],
                  ].map(([title, desc, status]) => (
                    <div key={title} className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
                        <p className="text-xs text-[var(--muted)]">{desc}</p>
                      </div>
                      <span className="rounded-full bg-[var(--surface-strong)] px-2.5 py-1 text-xs font-semibold text-[var(--primary)]">
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--muted)]">
                <div className="flex items-center gap-2"><FaGoogle /> <span>Google</span></div>
                <div className="flex items-center gap-2"><SiMeta /> <span>Meta</span></div>
                <div className="flex items-center gap-2"><SiNetflix /> <span>Netflix</span></div>
                <div className="flex items-center gap-2"><FaPaypal /> <span>PayPal</span></div>
                <div className="flex items-center gap-2"><SiPayoneer /> <span>Payoneer</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;