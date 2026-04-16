import type { Metadata } from "next";
import { Noto_Sans_KR, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/common/LayoutWrapper";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "YEPIDA CLINIC",
  description: "당신의 아름다움이 피어나는 곳",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${notoSansKR.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
