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

const siteUrl = "https://cpns-web-coral.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CPNS Web - Simulasi CAT BKN 1:1 | Latihan SKD TWK TIU TKP",
    template: "%s | CPNS Web",
  },
  description: "Latihan CPNS gratis dengan simulasi CAT BKN mirip asli. Bank soal 300+ TWK TIU TKP, timer 100 menit, passing grade real (TWK 65 TIU 80 TKP 166), pembahasan lengkap. Lolos SKD lebih cepat.",
  keywords: ["CPNS", "SKD", "CAT BKN", "TWK", "TIU", "TKP", "latihan CPNS", "tryout CPNS", "simulasi CAT", "BKN"],
  authors: [{ name: "CPNS Web" }],
  creator: "CPNS Web",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "CPNS Web",
    title: "CPNS Web - Simulasi CAT BKN 1:1",
    description: "Bank soal 300+ TWK TIU TKP • Timer 100 menit • Passing grade real TWK65 TIU80 TKP166 • Pembahasan lengkap",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CPNS Web Simulasi CAT" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CPNS Web - Simulasi CAT BKN 1:1",
    description: "Latihan CPNS gratis mirip CAT BKN asli. 300+ soal, skor langsung.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
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
