import { type CSSProperties } from "react";

function Asterisk({
  className,
  style,
  fill = "#1FA36A",
}: {
  className?: string;
  style?: CSSProperties;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <g fill={fill} stroke="#0B2545" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <rect x="44" y="6" width="12" height="88" rx="6" />
        <rect x="6" y="44" width="88" height="12" rx="6" />
        <rect x="44" y="6" width="12" height="88" rx="6" transform="rotate(45 50 50)" />
        <rect x="44" y="6" width="12" height="88" rx="6" transform="rotate(-45 50 50)" />
      </g>
    </svg>
  );
}

function Sparkle({
  className,
  style,
  fill = "#FCD116",
}: {
  className?: string;
  style?: CSSProperties;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <path
        d="M50 4 C54 34 66 46 96 50 C66 54 54 66 50 96 C46 66 34 54 4 50 C34 46 46 34 50 4 Z"
        fill={fill}
        stroke="#0B2545"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DotGrid({ className }: { className?: string }) {
  return (
    <svg className={className} aria-hidden viewBox="0 0 120 120">
      <defs>
        <pattern id="dotgrid" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="#0B2545" />
        </pattern>
      </defs>
      <rect width="120" height="120" fill="url(#dotgrid)" />
    </svg>
  );
}

export function BackgroundDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* warm gradient wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 20% 0%, #F58668 0%, #F26B4E 45%, #E55A3E 100%)",
        }}
      />
      {/* soft light blobs */}
      <div className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-white/15 blur-3xl" />
      <div className="absolute top-1/2 -right-40 w-[520px] h-[520px] rounded-full bg-[#FCD116]/20 blur-3xl" />

      {/* big wavy yellow ribbons */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 1024"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M-100 220 C 200 120, 420 360, 700 240 S 1200 100, 1600 280"
          stroke="#FCD116"
          strokeWidth="46"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />
        <path
          d="M-100 220 C 200 120, 420 360, 700 240 S 1200 100, 1600 280"
          stroke="#0B2545"
          strokeWidth="48"
          strokeLinecap="round"
          fill="none"
          opacity="0.08"
        />
        <path
          d="M-100 760 C 260 660, 520 880, 820 760 S 1260 640, 1600 820"
          stroke="#FCD116"
          strokeWidth="38"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M-200 520 C 200 460, 500 600, 900 520 S 1500 420, 1700 540"
          stroke="#ffffff"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          opacity="0.25"
        />
      </svg>

      {/* green starbursts */}
      <Asterisk className="absolute top-16 right-10 w-16 sm:w-20 rotate-12" fill="#1FA36A" />
      <Asterisk className="absolute bottom-40 left-6 w-12 sm:w-16 -rotate-12" fill="#1FA36A" />
      <Asterisk className="absolute top-1/2 left-1/3 w-10 sm:w-12 rotate-45 opacity-90" fill="#1FA36A" />

      {/* yellow sparkles */}
      <Sparkle className="absolute top-32 left-8 w-10 sm:w-14" fill="#FCD116" />
      <Sparkle className="absolute bottom-24 right-16 w-12 sm:w-16 rotate-12" fill="#FCD116" />

      {/* navy dot grid corner */}
      <DotGrid className="absolute bottom-4 left-4 w-28 sm:w-36 opacity-60" />
      <DotGrid className="absolute top-4 right-4 w-24 sm:w-32 opacity-50" />
    </div>
  );
}

export { Asterisk, Sparkle, DotGrid };
