import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.14),_transparent_35%),linear-gradient(135deg,_#02070c,_#07110d)] text-[var(--text)]">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
