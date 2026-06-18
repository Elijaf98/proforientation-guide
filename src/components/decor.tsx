import { type CSSProperties } from "react";

function Star({ className, style, fill = "#F5331F" }: { className?: string; style?: CSSProperties; fill?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <path
        d="M50 2 L61 38 L98 38 L68 60 L79 96 L50 74 L21 96 L32 60 L2 38 L39 38 Z"
        fill={fill}
        stroke="#111111"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Bolt({ className, style, fill = "#FFD400" }: { className?: string; style?: CSSProperties; fill?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <path
        d="M58 4 L18 56 L44 56 L34 96 L82 38 L56 38 L66 4 Z"
        fill={fill}
        stroke="#111111"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Blob({ className, style, fill = "#2D6BE0" }: { className?: string; style?: CSSProperties; fill?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} style={style} aria-hidden>
      <path
        d="M20 50 Q4 50 8 32 Q12 14 32 18 Q40 4 56 12 Q72 -2 86 14 Q112 12 110 36 Q120 56 96 60 Q88 76 68 70 Q52 80 38 70 Q22 74 20 50 Z"
        fill={fill}
        stroke="#111111"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BackgroundDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <Star className="absolute -top-10 -left-8 w-32 sm:w-40 opacity-90 rotate-12" fill="#F5331F" />
      <Bolt className="absolute top-24 right-[-20px] w-24 sm:w-32 rotate-12" />
      <Blob className="absolute top-1/3 -left-12 w-44 sm:w-56 opacity-90" />
      <Star className="absolute bottom-24 right-4 w-20 sm:w-28 -rotate-12" fill="#1E7D3C" />
      <Bolt className="absolute bottom-6 left-1/4 w-16 sm:w-20 -rotate-12" />
      <Star className="absolute top-1/2 right-8 w-16 sm:w-20 rotate-45" fill="#FFD400" />
      <Blob className="absolute -bottom-10 -right-10 w-56 sm:w-72" fill="#2D6BE0" />
    </div>
  );
}

export { Star, Bolt, Blob };
