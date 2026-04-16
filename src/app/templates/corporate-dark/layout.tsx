import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "기업 홈페이지 템플릿 (다크) | Corporate Dark Template",
  description:
    "크래프톤 스타일에서 영감을 받은 강렬하고 프리미엄한 기업 홈페이지 다크 템플릿입니다.",
};

export default function CorporateDarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-black min-h-screen">{children}</div>;
}
