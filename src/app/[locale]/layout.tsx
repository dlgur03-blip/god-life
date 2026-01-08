import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Providers from "../providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import HeaderWrapper from '@/components/HeaderWrapper';
import FeedbackFooter from '@/components/FeedbackFooter';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "God Life Maker",
  description: "Architect your destiny.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050b14] min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
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
