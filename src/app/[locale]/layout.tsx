import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import "../globals.css";
import Providers from "../providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import HeaderWrapper from '@/components/HeaderWrapper';
import FeedbackFooter from '@/components/FeedbackFooter';
import InAppBrowserGuard from '@/components/InAppBrowserGuard';
import TimezoneDetector from '@/components/TimezoneDetector';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GOD LIFE MAKER - 갓생메이커",
  description: "매일 아침, 반드시 들어오세요. 당신은 분명 갓생을 살게 될 것입니다.",
  openGraph: {
    title: "갓생메이커 | 당신의 인생이 바뀝니다",
    description: "매일 아침, 반드시 들어오세요. 운명 설계 · 100일 프로젝트 · 규율 마스터리 · 셀프 서신",
    url: "https://godlife.kr",
    siteName: "GOD LIFE MAKER",
    images: [
      {
        url: "https://godlife.kr/og-image.png",
        width: 1200,
        height: 630,
        alt: "GOD LIFE MAKER - 갓생메이커",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "갓생메이커 | 당신의 인생이 바뀝니다",
    description: "매일 아침, 반드시 들어오세요. 운명 설계 · 100일 프로젝트 · 규율 마스터리 · 셀프 서신",
    images: ["https://godlife.kr/og-image.png"],
  },
  metadataBase: new URL("https://godlife.kr"),
  other: {
    "naver-site-verification": "",
  },
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
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKR.variable} antialiased min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <TimezoneDetector />
            <InAppBrowserGuard />
            <HeaderWrapper />
            <main className="pt-[72px] md:pt-[120px] lg:pt-[130px] flex-1">
              {children}
            </main>
            <FeedbackFooter />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
