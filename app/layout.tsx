import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/nav/SessionProvider";
import { ToastProvider } from "@/components/common/Toast";
import { RoleNav } from "@/components/nav/RoleNav";

export const metadata: Metadata = {
  title: "JobMate",
  description: "채용 정보 매칭 플랫폼",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <SessionProvider>
          <ToastProvider>
            <RoleNav />
            {children}
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
