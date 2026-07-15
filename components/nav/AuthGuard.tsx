"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "./SessionProvider";
import type { Role } from "@/types";

export function AuthGuard({ requiredRole, children }: { requiredRole: Role; children: React.ReactNode }) {
  const { session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!session || session.role !== requiredRole) {
      router.replace("/login");
    }
  }, [isLoading, session, requiredRole, router]);

  if (isLoading || !session || session.role !== requiredRole) {
    return <div className="page" aria-busy="true" />;
  }

  return <>{children}</>;
}
