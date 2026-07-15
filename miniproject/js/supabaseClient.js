// Supabase 클라이언트 초기화 (공개 anon/publishable key — RLS로 보호되므로 노출 전제)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const SUPABASE_URL = "https://niutlooaizrmcuupxgdq.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_XGC_jc9oCRXaAAUite9iMw_Qi_ZL9xH";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// 로그인 세션 + profiles(role) 를 함께 가져온다. 비로그인이면 { user: null, role: null }.
export async function getCurrentProfile() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { user: null, role: null };

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", session.user.id)
    .maybeSingle();

  if (error) {
    console.error("profiles 조회 실패", error);
    return { user: session.user, role: null };
  }
  return { user: session.user, role: profile?.role ?? null };
}

// role이 필요한 페이지에서 사용: 조건 안 맞으면 지정된 경로로 리다이렉트.
export async function requireRole(allowedRoles) {
  const { user, role } = await getCurrentProfile();
  if (!user) {
    window.location.href = "index.html";
    return null;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    window.location.href = role === "company" ? "company-home.html" : "jobseeker-home.html";
    return null;
  }
  return { user, role };
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}
