"use client";

import { useState } from "react";

interface CookieBannerProps {
  message?: string;
  learnMoreHref?: string;
  onAccept?: () => void;
  onSettings?: () => void;
}

export default function CookieBanner({
  message = "이 웹사이트는 사용자 경험 향상을 위해 쿠키를 사용합니다. 사이트를 계속 이용하시면 쿠키 사용에 동의하는 것으로 간주합니다.",
  learnMoreHref = "#",
  onAccept,
  onSettings,
}: CookieBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleAccept = () => {
    setDismissed(true);
    onAccept?.();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A] border-t border-[#333] px-8 py-5">
      <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-white/70 text-sm font-light leading-relaxed flex-1">
          {message}{" "}
          <a
            href={learnMoreHref}
            className="text-white underline underline-offset-2 hover:text-white/80 transition-colors"
          >
            자세히 보기
          </a>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onSettings?.();
            }}
            className="text-sm text-white/60 border border-[#555] px-5 py-2.5 hover:text-white hover:border-[#888] transition-colors min-h-[44px]"
          >
            쿠키 설정
          </button>
          <button
            onClick={handleAccept}
            className="text-sm text-black bg-white px-6 py-2.5 font-medium hover:bg-[#E0E0E0] transition-colors min-h-[44px]"
          >
            수락
          </button>
        </div>
      </div>
    </div>
  );
}
