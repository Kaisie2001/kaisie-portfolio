import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { Providers } from "@/components/Providers";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default:
      "Cassy — Autonomous Mobility Product & AI-powered Operations",
    template: "%s — Cassy",
  },
  description:
    "Cassy — Autonomous Mobility Product & AI-powered Operations. 智能移动产品策略与 AI 运营提效；Robotaxi、地图导航、无人机、AI 赋能运营。",
};

export const viewport: Viewport = {
  themeColor: "#f7f6f3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full min-h-dvh max-h-dvh overflow-hidden bg-[#f7f6f3] antialiased`}
    >
      <body className="flex min-h-dvh max-h-dvh flex-col overflow-hidden bg-[#f7f6f3] font-sans text-stone-800">
        <Providers>
          <SiteHeader />
          <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
