"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardEntryPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    const role = session?.user?.role;
    router.replace(
      role === "admin"
        ? "/dashboard/admin"
        : role === "freelancer"
          ? "/dashboard/freelancer"
          : "/dashboard/client",
    );
  }, [isPending, router, session]);

  return null;
}
