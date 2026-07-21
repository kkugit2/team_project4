"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Session } from "@/types";
import { getSession, logout as authLogout } from "@/lib/auth";

interface SessionContextValue {
  session: Session | null;
  /** localStorage 읽기가 마운트 이후에만 가능하므로, 최초 체크가 끝나기 전까지 true. */
  isLoading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const sess = await getSession();
    setSession(sess);
  }, []);

  useEffect(() => {
    (async () => {
      await refresh();
      setIsLoading(false);
    })();
  }, [refresh]);

  const logout = useCallback(async () => {
    await authLogout();
    setSession(null);
  }, []);

  return (
    <SessionContext.Provider value={{ session, isLoading, refresh, logout }}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
