import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "기업 홈페이지 템플릿 (라이트) | Corporate Light Template",
  description:
    "카카오 스타일에서 영감을 받은 깔끔하고 전문적인 기업 홈페이지 라이트 템플릿입니다.",
};

export default function CorporateLightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
