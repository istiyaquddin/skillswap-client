import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 relative overflow-x-hidden">
      {/* Dynamic ambient lighting that cleanly adapts in light & dark modes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#1dbf73]/5 dark:bg-[#1dbf73]/10 blur-[130px]" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-blue-500/4 dark:bg-blue-500/8 blur-[140px]" />
      </div>

      <div className="flex min-h-screen relative z-10">
        <Sidebar />
        <main className="flex-1 pt-16 md:pt-0 p-3 sm:p-4 md:p-6 overflow-y-auto w-full min-w-0 max-w-full overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
