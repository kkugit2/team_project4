import { createClient } from '@supabase/supabase-js';

// 환경변수 읽기 - 없으면 기본값 사용 (개발 중에도 작동하도록)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fekeiqjxzfibyzxukisk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZla2VpcWp4emZpYnl6eHVraXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxMjgzOTMsImV4cCI6MjA5OTcwNDM5M30.49EQQg7JCiUbszIs9Vd2wzqT5pnG9tXCyRViTOwulVg';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZla2VpcWp4emZpYnl6eHVraXNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEyODM5MywiZXhwIjoyMDk5NzA0MzkzfQ.toSp95lsHpHytkgyrecWCemKD-31Qwby8evoovRpXwE';

// 클라이언트 전용 (브라우저/클라이언트 컴포넌트)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// 서버 전용 (서버 컴포넌트/API 라우트)
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// 환경 확인 (개발/테스트용)
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
