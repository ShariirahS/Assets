import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";
import { AppNavbar } from "@/components/shared/AppNavbar";
import { AppFooter } from "@/components/shared/AppFooter";

const sans = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const mono = Roboto_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

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
      <body className={`${sans.variable} ${mono.variable} bg-background antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <AppNavbar />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</main>
            <AppFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
