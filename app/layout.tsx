import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/nav/SessionProvider";
import { ToastProvider } from "@/components/common/Toast";
import { RoleNav } from "@/components/nav/RoleNav";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobMate",
  description: "채용 정보 매칭 플랫폼",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={jetbrainsMono.variable}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
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
