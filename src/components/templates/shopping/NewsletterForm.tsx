"use client";

import { useState } from "react";

interface NewsletterFormProps {
  title?: string;
}

export default function NewsletterForm({ title = "뉴스레터" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && agreed) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-md">
      <h3
        className="text-2xl font-light mb-6"
        style={{
          fontFamily: "var(--font-shop-serif, 'Cormorant Garamond', Georgia, serif)",
          color: "var(--color-shop-text, #000)",
        }}
      >
        {title}
      </h3>

      {submitted ? (
        <p
          className="text-sm font-light"
          style={{
            fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
            color: "var(--color-shop-text-secondary, #999)",
          }}
        >
          구독해 주셔서 감사합니다.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex border-b mb-4" style={{ borderColor: "var(--color-shop-border-dark, #000)" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소"
              className="flex-1 py-3 text-sm font-light bg-transparent outline-none min-h-[44px]"
              style={{
                fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                color: "var(--color-shop-text, #000)",
              }}
              required
            />
            <button
              type="submit"
              className="text-xs min-h-[44px] px-4 transition-colors"
              style={{
                fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                letterSpacing: "0.1em",
                color: "var(--color-shop-text, #000)",
              }}
            >
              구독하기
            </button>
          </div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1"
              required
            />
            <span
              className="text-xs font-light leading-relaxed"
              style={{
                fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                color: "var(--color-shop-text-secondary, #999)",
              }}
            >
              개인정보 수집 및 이용에 동의합니다.
            </span>
          </label>
        </form>
      )}
    </div>
  );
}
