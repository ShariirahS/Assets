import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";
import { AppNavbar } from "@/components/shared/AppNavbar";
import { AppFooter } from "@/components/shared/AppFooter";

export const metadata: Metadata = {
  title: "Assets Platform",
  description: "Modern asset lending dashboard built with Next.js and HeroUI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background font-sans antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <AppNavbar />
            <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-14 sm:px-8 lg:px-12">
              <div className="pointer-events-none absolute -top-24 right-10 hidden h-56 w-56 rounded-full bg-accent/30 blur-[120px] lg:block" />
              <div className="pointer-events-none absolute -bottom-16 left-0 hidden h-64 w-64 rounded-full bg-accentStrong/15 blur-[130px] md:block" />
              <div className="relative z-10">{children}</div>
            </main>
            <AppFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
