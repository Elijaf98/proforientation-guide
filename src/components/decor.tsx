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

function Squiggle({ className, stroke = "#0B2545" }: { className?: string; stroke?: string }) {
  return (
    <svg className={className} aria-hidden viewBox="0 0 200 60" fill="none">
      <path
        d="M4 30 C 30 4, 50 56, 76 30 S 122 4, 148 30 S 194 56, 196 30"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function BackgroundDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
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

      {/* prominent wavy ribbons — yellow and white, with navy outlines */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 1024"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* top ribbon */}
        <path
          d="M-120 200 C 180 80, 440 340, 720 220 S 1180 80, 1560 260"
          stroke="#0B2545"
          strokeWidth="52"
          strokeLinecap="round"
          fill="none"
          opacity="0.18"
        />
        <path
          d="M-120 200 C 180 80, 440 340, 720 220 S 1180 80, 1560 260"
          stroke="#FCD116"
          strokeWidth="40"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />

        {/* middle ribbon */}
        <path
          d="M-160 520 C 220 440, 540 620, 920 500 S 1380 380, 1620 540"
          stroke="#0B2545"
          strokeWidth="34"
          strokeLinecap="round"
          fill="none"
          opacity="0.15"
        />
        <path
          d="M-160 520 C 220 440, 540 620, 920 500 S 1380 380, 1620 540"
          stroke="#FBF3E2"
          strokeWidth="22"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />

        {/* bottom ribbon */}
        <path
          d="M-120 780 C 260 660, 560 900, 860 780 S 1300 640, 1580 820"
          stroke="#0B2545"
          strokeWidth="44"
          strokeLinecap="round"
          fill="none"
          opacity="0.18"
        />
        <path
          d="M-120 780 C 260 660, 560 900, 860 780 S 1300 640, 1580 820"
          stroke="#FCD116"
          strokeWidth="34"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* thin accent waves */}
        <path
          d="M-200 360 C 200 280, 500 440, 900 360 S 1500 240, 1700 380"
          stroke="#FBF3E2"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
        <path
          d="M-200 920 C 180 840, 520 1020, 920 900 S 1460 780, 1720 940"
          stroke="#FBF3E2"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />
      </svg>

      {/* decorative line squiggles */}
      <Squiggle className="absolute top-28 left-6 w-32 sm:w-44 opacity-80 rotate-[-6deg]" stroke="#0B2545" />
      <Squiggle className="absolute bottom-48 right-8 w-28 sm:w-40 opacity-70 rotate-[8deg]" stroke="#0B2545" />
      <Squiggle className="absolute top-2/3 right-12 w-24 sm:w-32 opacity-60 rotate-[-4deg]" stroke="#FBF3E2" />

      {/* green starbursts */}
      <Asterisk className="absolute top-20 right-10 w-16 sm:w-20 rotate-12" fill="#1FA36A" />
      <Asterisk className="absolute bottom-40 left-6 w-12 sm:w-16 -rotate-12" fill="#1FA36A" />
      <Asterisk className="absolute top-1/2 left-1/3 w-10 sm:w-12 rotate-45 opacity-90" fill="#1FA36A" />

      {/* yellow sparkles */}
      <Sparkle className="absolute top-36 left-10 w-10 sm:w-14" fill="#FCD116" />
      <Sparkle className="absolute bottom-28 right-16 w-12 sm:w-16 rotate-12" fill="#FCD116" />
      <Sparkle className="absolute top-1/3 right-1/4 w-8 sm:w-10 -rotate-12 opacity-90" fill="#FCD116" />

      {/* navy dot grid corners */}
      <DotGrid className="absolute bottom-4 left-4 w-28 sm:w-36 opacity-60" />
      <DotGrid className="absolute top-4 right-4 w-24 sm:w-32 opacity-50" />
    </div>
  );
}

export { Asterisk, Sparkle, DotGrid, Squiggle };
