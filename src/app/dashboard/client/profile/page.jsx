"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
// টোস্ট ইম্পোর্ট করা হলো
import {
  ArrowUpRight,
  Briefcase,
  Calendar,
  DollarSign,
  Edit3,
  FileText,
  Globe,
  History,
  Layers,
  Loader2,
  Mail,
  ShieldAlert,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const ClientProfilePage = () => {
  const { data: session, isPending: authLoading } = authClient.useSession();

  // States
  const [clientInfo, setClientInfo] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [totalSpend, setTotalSpend] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Edit Form States
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const fetchClientData = async () => {
      if (!session?.user?.id || !session?.user?.email) return;

      try {
        // Better Auth থেকে টোকেন নেওয়া হচ্ছে
        const { data: tokenData } = await authClient.token();
        const headers = {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`,
        };

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        // ১. ক্লায়েন্ট বেসিক প্রোফাইল ডেটা লোড
        const profileRes = await fetch(
          `${apiUrl}/api/clients/${session.user.id}`,
          { headers },
        );
        const profileData = await profileRes.json();

        if (profileRes.ok) {
          setClientInfo(profileData);
          setName(profileData.name || "");
          setImage(profileData.image || "");
          setBio(profileData.bio || "");
        }

        // ২. ক্লায়েন্টের পেমেন্ট হিস্ট্রি ও টোটাল স্পেন্ড লোড
        const paymentRes = await fetch(
          `${apiUrl}/api/payment-history?email=${session.user.email}`,
          { headers },
        );
        const paymentData = await paymentRes.json();

        if (paymentRes.ok && paymentData.success) {
          setPaymentHistory(paymentData.history || []);
          setTotalSpend(paymentData.totalSpend || 0);
        }
      } catch (error) {
        console.error("Error fetching client profile data:", error);
      } finally {
        setLoading(false); // async ব্লকের শেষে রান হওয়ায় এটি সম্পূর্ণ সেফ
      }
    };

    if (!authLoading) {
      if (!session?.user) {
        // ক্যাসকেডিং রেন্ডার ওয়ার্নিং এড়াতে সরাসরি setLoading না করে টাইমাউট ট্রিক
        const timeoutId = setTimeout(() => setLoading(false), 0);
        return () => clearTimeout(timeoutId);
      }

      const timeoutId = setTimeout(() => {
        setLoading(true);
        fetchClientData();
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [session, authLoading]);

  // প্রোফাইল আপডেট হ্যান্ডলার
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    // একটি লোডিং টোস্ট স্টার্ট হবে
    const toastId = toast.loading("Updating profile...");

    try {
      // Better Auth থেকে টোকেন নেওয়া হচ্ছে
      const { data: tokenData } = await authClient.token();

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/clients/${session.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Authorization হেডারে Bearer টোকেন পাস করা হলো
          authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify({ name, image, bio }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setClientInfo((prev) => ({ ...prev, name, image, bio }));
        setIsEditing(false);

        // সাকসেস টোস্ট
        toast.success("Profile updated successfully!", { id: toastId });
      } else {
        // এরর টোস্ট
        toast.error(result.message || "Failed to update profile", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      // নেটওয়ার্ক এরর টোস্ট
      toast.error("Network error, please try again.", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col h-96 w-full items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
          Loading Profile...
        </p>
      </div>
    );
  }

  if (!session?.user || session?.user?.role !== "client") {
    return (
      <div className="text-center mt-20 text-rose-500 font-sans p-6 border border-rose-500/10 bg-rose-500/5 rounded-2xl max-w-md mx-auto shadow-sm">
        <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-80" />
        <p className="text-sm font-black uppercase tracking-wider">
          Access Denied
        </p>
        <p className="text-xs opacity-60 mt-1 font-medium">
          Please authenticate using an authorized Client account.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-6 font-sans relative selection:bg-amber-500/20 selection:text-amber-500">
      {/* ২. টোস্ট কন্টেইনার এড করা হলো */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* প্রোফাইল হেডার */}
      <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-current/10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Client Workspace
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text)]">
            Partner <span className="text-amber-500">Profile</span>
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Manage corporate preferences, hiring metrics, and financial ledgers
          </p>
        </div>
      </div>

      {/* টপ প্রোফাইল কার্ড এবং এডিট ফর্ম লেআউট গ্রিড */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* বামে: প্রিমিয়াম প্রোফাইল ওভারভিউ কার্ড */}
        <div className="border border-current/10 bg-current/5 rounded-3xl p-6 space-y-6 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-amber-400/10 to-transparent rounded-full blur-2xl" />

          {clientInfo?.status === "Blocked" && (
            <div className="absolute top-0 right-0 bg-linear-to-r from-rose-500 to-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-bl-xl flex items-center gap-1 shadow-sm">
              <ShieldAlert className="w-3.5 h-3.5" /> Restricted
            </div>
          )}

          <div className="flex flex-col items-center text-center space-y-3 pt-4">
            <div className="relative p-1 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full shadow-[0_4px_12px_rgba(245,158,11,0.15)]">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-900 flex items-center justify-center text-3xl font-black text-white">
                {clientInfo?.image?.startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={clientInfo.image}
                    alt={clientInfo.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  clientInfo?.name?.charAt(0)
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-extrabold tracking-tight">
                {clientInfo?.name}
              </h2>
              <span className="inline-block mt-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                Corporate {clientInfo?.role}
              </span>
            </div>

            {clientInfo?.bio && (
              <p className="text-xs opacity-75 font-medium max-w-xs pt-2 leading-relaxed bg-current/5 px-4 py-2 rounded-xl border border-current/5">
                {clientInfo.bio}
              </p>
            )}
          </div>

          <div className="border-t border-current/10 pt-4 space-y-3 text-xs font-bold opacity-75">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 shrink-0">
                <Mail className="w-3.5 h-3.5 text-amber-400" /> Email
              </span>
              <span className="truncate opacity-90 max-w-40 font-mono">
                {clientInfo?.email}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Joined
              </span>
              <span className="opacity-90">
                {clientInfo?.createdAt
                  ? new Date(clientInfo.createdAt).toLocaleDateString(
                      undefined,
                      { year: "numeric", month: "short", day: "numeric" },
                    )
                  : "N/A"}
              </span>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full mt-2 py-3 px-4 amber-gradient amber-glow font-black text-xs uppercase tracking-widest rounded-full hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer text-white"
            >
              <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" /> Modify Credentials
            </button>
          )}
        </div>

        {/* ডানে: এডিট ফর্ম অথবা স্পেন্ডিং স্ট্যাটাস সামারি */}
        <div className="lg:col-span-2 space-y-6">
          {isEditing ? (
            <div className="glass-panel rounded-[2rem] p-6 md:p-8 space-y-6 animate-in fade-in duration-200">
              <h3 className="text-base font-extrabold flex items-center gap-2 uppercase tracking-wider text-amber-400">
                <Edit3 className="w-4 h-4 stroke-[2.5]" /> Update Profile
              </h3>

              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-50">
                      Authorized Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-sm font-bold text-[var(--text)] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest opacity-50">
                      Profile Image URL
                    </label>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-4 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-sm font-bold text-[var(--text)] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition placeholder:text-[var(--muted)] font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-widest opacity-50">
                    Corporate Bio / Description
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell freelancers about yourself or your company..."
                    className="w-full px-4 py-3 bg-[var(--surface-strong)] border border-[var(--border)] rounded-2xl text-sm font-bold text-[var(--text)] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition placeholder:text-[var(--muted)] resize-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-3 amber-gradient amber-glow text-white font-black text-xs uppercase tracking-widest rounded-full hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-3 border border-[var(--border)] rounded-full text-xs font-black uppercase tracking-widest hover:bg-[var(--surface)] transition cursor-pointer text-[var(--muted)]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ড্যাশবোর্ড মেট্রিকেক্স কার্ডস */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* টোটাল ইনভেস্টেড কার্ড */}
              <div className="glass-panel rounded-[2rem] p-6 flex items-center justify-between relative overflow-hidden group hover:border-amber-500/40 hover:scale-[1.02] transition-all duration-300">
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all duration-500" />
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400">
                    <DollarSign className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--muted)] font-black uppercase tracking-widest">Total Invested</p>
                    <p className="text-3xl font-black text-amber-400 tracking-tight mt-0.5">${totalSpend}</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 opacity-20 group-hover:opacity-60 transition-opacity self-start mt-1" />
              </div>

              {/* হায়ারড টাস্কস কার্ড */}
              <div className="glass-panel rounded-[2rem] p-6 flex items-center justify-between relative overflow-hidden group hover:border-amber-500/40 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-[var(--surface)] rounded-2xl border border-[var(--border)]">
                    <Briefcase className="w-6 h-6 stroke-2 text-[var(--muted)]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--muted)] font-black uppercase tracking-widest">Hired Tasks</p>
                    <p className="text-3xl font-black text-[var(--text)] tracking-tight mt-0.5">{paymentHistory.length}</p>
                  </div>
                </div>
                <FileText className="w-4 h-4 opacity-20 self-start mt-1" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* পেমেন্ট ও ট্রানজেকশন হিস্ট্রি টেবিল */}
      <div className="glass-panel rounded-[2rem] p-6 space-y-4">
        <h3 className="text-base font-extrabold flex items-center gap-2 uppercase tracking-wider text-[var(--text)]">
          <History className="w-5 h-5 text-amber-400 stroke-2" /> Payment History
        </h3>

        {paymentHistory.length === 0 ? (
          <div className="glass-panel rounded-[2rem] py-12 text-center">
            <p className="text-xs text-[var(--muted)] font-bold italic">No payment records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full rounded-2xl border border-current/5">
            <table className="w-full text-left border-collapse text-xs font-bold">
              <thead>
                <tr className="border-b border-current/10 bg-current/5 opacity-60 text-[10px] font-black uppercase tracking-widest">
                  <th className="py-3.5 px-4">Task Title</th>
                  <th className="py-3.5 px-4">Session ID</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Amount Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-current/5">
                {paymentHistory.map((item) => (
                  <tr
                    key={item._id}
                    className="opacity-85 hover:opacity-100 hover:bg-current/5 transition-all"
                  >
                    <td
                      className="py-4 px-4 max-w-50 sm:max-w-xs truncate font-extrabold text-inherit"
                      title={item.taskTitle}
                    >
                      {item.taskTitle}
                    </td>
                    <td
                      className="py-4 px-4 font-mono opacity-50 max-w-30 truncate"
                      title={item.sessionId}
                    >
                      {item.sessionId}
                    </td>
                    <td className="py-4 px-4 opacity-60 font-medium">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "short", day: "numeric" },
                          )
                        : "N/A"}
                    </td>
                    <td className="py-4 px-4 text-right font-black text-amber-400 text-sm">
                      ${item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientProfilePage;
