import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  conclusions,
  DIRECTION_EMOJI,
  DIRECTION_PRIORITY,
  type Direction,
  type Scores,
} from "@/lib/quiz-data";

export const Route = createFileRoute("/_authenticated/result")({
  head: () => ({
    meta: [{ title: "Результат — Профориентация" }],
  }),
  component: ResultPage,
});

type StoredResult = { direction: Direction; scores: Scores };

const BAR_COLORS = ["#FCD116", "#1FA36A", "#2C6FE3", "#F26B4E", "#0B2545", "#FCD116"];

function ResultPage() {
  const navigate = useNavigate();
  const [stored, setStored] = useState<StoredResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("quiz-result");
    if (!raw) {
      navigate({ to: "/quiz" });
      return;
    }
    try {
      setStored(JSON.parse(raw) as StoredResult);
    } catch {
      navigate({ to: "/quiz" });
    }
  }, [navigate]);

  if (!stored) return null;
  const c = conclusions[stored.direction];
  const max = Math.max(1, ...Object.values(stored.scores));
  const sorted = [...DIRECTION_PRIORITY].sort(
    (a, b) => stored.scores[b] - stored.scores[a],
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-4">
        <span className="relative inline-block rounded-full bg-[#FCD116] text-[#0B2545] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] border border-[#0B2545] shadow-[0_4px_0_0_#0B2545]">
          ★ Ваше направление
          <span className="absolute -bottom-2 left-8 w-3 h-3 bg-[#FCD116] border-r border-b border-[#0B2545] rotate-45" />
        </span>
        <div className="relative rounded-t-[3rem] rounded-b-[2rem] border border-[#0B2545] bg-[#FBF3E2] p-6 sm:p-8 shadow-[0_24px_50px_-16px_rgba(11,37,69,0.55),0_10px_0_0_#0B2545] overflow-hidden">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(80% 60% at 0% 0%, rgba(252,209,22,0.35), transparent 60%), radial-gradient(60% 60% at 100% 100%, rgba(242,107,78,0.25), transparent 60%)",
            }}
            aria-hidden
          />
          <div className="relative flex items-start gap-4">
            <span
              className="shrink-0 grid place-items-center h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-white border border-[#0B2545] shadow-[0_10px_0_0_#0B2545] text-5xl sm:text-6xl"
              aria-hidden
            >
              {DIRECTION_EMOJI[stored.direction]}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl leading-[0.95] text-[#0B2545]">
              {c.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[#0B2545] bg-[#FBF3E2] p-6 shadow-[0_14px_30px_-12px_rgba(11,37,69,0.4),0_6px_0_0_#0B2545]">
        <p className="text-[15px] font-semibold leading-relaxed text-[#0B2545]">{c.description}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-[2rem] border border-[#0B2545] bg-[#2C6FE3] text-[#FBF3E2] p-5 shadow-[0_14px_28px_-12px_rgba(11,37,69,0.5),0_6px_0_0_#0B2545]">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-90">
            Что подтянуть
          </div>
          <p className="text-sm font-semibold leading-relaxed">{c.toLearn}</p>
        </div>
        <div className="rounded-[2rem] border border-[#0B2545] bg-[#1FA36A] text-[#FBF3E2] p-5 shadow-[0_14px_28px_-12px_rgba(11,37,69,0.5),0_6px_0_0_#0B2545]">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-90">
            Первый шаг
          </div>
          <p className="text-sm font-semibold leading-relaxed">{c.firstStep}</p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[#0B2545] bg-[#FBF3E2] p-6 shadow-[0_14px_30px_-12px_rgba(11,37,69,0.4),0_6px_0_0_#0B2545] space-y-4">
        <h2 className="font-display text-xl text-[#0B2545]">Баллы по направлениям</h2>
        <ul className="space-y-3.5">
          {sorted.map((d, i) => {
            const v = stored.scores[d];
            const pct = (v / max) * 100;
            const isWinner = d === stored.direction;
            const color = isWinner ? "#F26B4E" : BAR_COLORS[i % BAR_COLORS.length];
            return (
              <li key={d} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className={`flex items-center gap-2 font-bold ${isWinner ? "text-[#0B2545]" : "text-[#0B2545]/75"}`}>
                    <span className="text-lg" aria-hidden>{DIRECTION_EMOJI[d]}</span>
                    <span>{conclusions[d].title}</span>
                    {isWinner && (
                      <span className="rounded-full bg-[#0B2545] text-[#FBF3E2] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                        Топ
                      </span>
                    )}
                  </span>
                  <span className={`tabular-nums font-black ${isWinner ? "text-[#F26B4E]" : "text-[#0B2545]/60"}`}>
                    {v}
                  </span>
                </div>
                <div className="h-4 w-full rounded-full border border-[#0B2545] bg-white overflow-hidden shadow-[inset_0_2px_0_0_rgba(11,37,69,0.1)]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(180deg, ${color}, color-mix(in oklab, ${color} 70%, #0B2545))`,
                      boxShadow: isWinner ? "inset 0 -2px 0 0 rgba(11,37,69,0.25)" : undefined,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/quiz"
          className="flex-1 text-center rounded-full bg-[#0B2545] text-[#FBF3E2] font-bold py-4 shadow-[0_8px_0_0_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition"
        >
          Пройти ещё раз
        </Link>
        <Link
          to="/"
          className="flex-1 text-center rounded-full border border-[#0B2545] bg-[#FBF3E2] text-[#0B2545] font-bold py-4 shadow-[0_8px_0_0_#0B2545] hover:-translate-y-0.5 active:translate-y-0 transition"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
