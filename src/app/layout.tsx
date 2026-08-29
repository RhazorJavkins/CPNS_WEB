import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CPNS Web - Simulasi CAT BKN 1:1 | Latihan SKD TWK TIU TKP",
  description: "Latihan CPNS gratis dengan simulasi CAT BKN mirip asli. Bank soal 300+ TWK TIU TKP, timer 100 menit, passing grade real (TWK 65 TIU 80 TKP 166), pembahasan lengkap. Lolos SKD lebih cepat.",
  keywords: ["CPNS", "SKD", "CAT BKN", "TWK", "TIU", "TKP", "latihan CPNS", "tryout CPNS"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">{children}</body>
    </html>
  );
}
