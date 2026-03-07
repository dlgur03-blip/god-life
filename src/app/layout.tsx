import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GOD LIFE AI - 갓생AI",
  description: "운명을 설계하고, 규율을 마스터하며, 바이오해킹으로 최적화하라. Design your destiny, master discipline, optimize with biohacking.",
  openGraph: {
    title: "GOD LIFE AI - 갓생AI",
    description: "운명 설계 · 100일 프로젝트 · 규율 마스터리 · 셀프 서신 · 바이오해킹",
    url: "https://godlife.kr",
    siteName: "GOD LIFE AI",
    images: [{ url: "https://godlife.kr/og-image.png", width: 1200, height: 630, alt: "GOD LIFE AI" }],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GOD LIFE AI - 갓생AI",
    description: "운명 설계 · 100일 프로젝트 · 규율 마스터리 · 셀프 서신 · 바이오해킹",
    images: ["https://godlife.kr/og-image.png"],
  },
  metadataBase: new URL("https://godlife.kr"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
