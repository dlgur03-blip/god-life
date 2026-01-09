import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Noto_Serif_KR } from "next/font/google";
import "../globals.css";
import Providers from "../providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import HeaderWrapper from '@/components/HeaderWrapper';
import FeedbackFooter from '@/components/FeedbackFooter';
import InAppBrowserGuard from '@/components/InAppBrowserGuard';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GOD LIFE MAKER - 갓생메이커",
  description: "운명을 설계하고, 규율을 마스터하며, 바이오해킹으로 최적화하라. Design your destiny, master discipline, optimize with biohacking.",
  openGraph: {
    title: "GOD LIFE MAKER - 갓생메이커",
    description: "운명 설계 · 100일 프로젝트 · 규율 마스터리 · 셀프 서신 · 바이오해킹",
    url: "https://god-life.vercel.app",
    siteName: "GOD LIFE MAKER",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GOD LIFE MAKER - 통합 자기계발 플랫폼",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GOD LIFE MAKER - 갓생메이커",
    description: "운명 설계 · 100일 프로젝트 · 규율 마스터리 · 셀프 서신 · 바이오해킹",
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://god-life.vercel.app"),
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${notoSerifKR.variable} antialiased min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <InAppBrowserGuard />
            <HeaderWrapper />
            <main className="pt-14 flex-1">
              {children}
            </main>
            <FeedbackFooter />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
