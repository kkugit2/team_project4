import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 클라이언트 사이드용 클라이언트 (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 서버 사이드용 클라이언트 (service role key) - API 라우트 및 서버 액션에서만 사용
export const supabaseServer = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;
