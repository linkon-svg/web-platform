'use client';

const CTA_ITEMS = [
  {
    label: '금액/예약',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    href: 'tel:02-6952-2586',
    color: 'bg-hospital-gold text-white',
    external: false,
  },
  {
    label: '인스타그램',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    href: 'https://www.instagram.com/yepida_clinic/',
    color: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
    external: true,
  },
  {
    label: '전화상담',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    href: 'tel:02-6952-2586',
    color: 'bg-hospital-brown text-white',
    external: false,
  },
  {
    label: '카톡상담',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.844 1.882 5.34 4.727 6.762-.21.782-.763 2.834-.875 3.272-.138.54.199.533.418.388.172-.113 2.736-1.86 3.848-2.617A11.39 11.39 0 0012 19c5.523 0 10-3.582 10-8s-4.477-8-10-8z" />
      </svg>
    ),
    href: 'https://pf.kakao.com/_yepida',
    color: 'bg-yellow-400 text-yellow-900',
    external: true,
  },
];

export default function BottomCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div className="grid grid-cols-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        {CTA_ITEMS.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={`flex flex-col items-center justify-center gap-1 min-h-[56px] ${item.color} transition-opacity active:opacity-80`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
