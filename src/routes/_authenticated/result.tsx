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

const BAR_COLORS = ["#F5331F", "#FFD400", "#1E7D3C", "#2D6BE0", "#111111", "#F5331F"];

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
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5331F] text-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em]">
          ★ Ваше направление
        </span>
        <div className="rounded-3xl border-2 border-[#111] bg-[#FFD400] p-6 sm:p-8 shadow-[6px_6px_0_0_#111]">
          <div className="flex items-start gap-3">
            <span className="text-5xl sm:text-6xl leading-none" aria-hidden>
              {DIRECTION_EMOJI[stored.direction]}
            </span>
            <h1 className="font-display text-4xl sm:text-6xl uppercase leading-[0.9]">
              {c.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border-2 border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
        <p className="text-[15px] font-semibold leading-relaxed">{c.description}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-3xl border-2 border-[#111] bg-[#2D6BE0] text-white p-5 shadow-[6px_6px_0_0_#111]">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] mb-2">
            Что подтянуть
          </div>
          <p className="text-sm font-semibold leading-relaxed">{c.toLearn}</p>
        </div>
        <div className="rounded-3xl border-2 border-[#111] bg-[#1E7D3C] text-white p-5 shadow-[6px_6px_0_0_#111]">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] mb-2">
            Первый шаг
          </div>
          <p className="text-sm font-semibold leading-relaxed">{c.firstStep}</p>
        </div>
      </div>

      <div className="rounded-3xl border-2 border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111] space-y-4">
        <h2 className="font-display text-xl uppercase">Баллы по направлениям</h2>
        <ul className="space-y-3">
          {sorted.map((d, i) => {
            const v = stored.scores[d];
            const pct = (v / max) * 100;
            const isWinner = d === stored.direction;
            const color = isWinner ? "#F5331F" : BAR_COLORS[(i + 1) % BAR_COLORS.length];
            return (
              <li key={d} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className={`flex items-center gap-2 font-bold ${isWinner ? "" : "text-[#111]/75"}`}>
                    <span aria-hidden>{DIRECTION_EMOJI[d]}</span>
                    <span>{conclusions[d].title}</span>
                    {isWinner && (
                      <span className="rounded-full bg-[#111] text-white px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider">
                        Топ
                      </span>
                    )}
                  </span>
                  <span className={`tabular-nums font-black ${isWinner ? "text-[#F5331F]" : "text-[#111]/60"}`}>
                    {v}
                  </span>
                </div>
                <div className="h-3 w-full rounded-full border-2 border-[#111] bg-white overflow-hidden">
                  <div
                    className="h-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: color }}
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
          className="flex-1 text-center rounded-full bg-[#111] text-white font-extrabold uppercase tracking-wide py-4 hover:bg-[#F5331F] transition"
        >
          Пройти ещё раз
        </Link>
        <Link
          to="/"
          className="flex-1 text-center rounded-full border-2 border-[#111] bg-white text-[#111] font-extrabold uppercase tracking-wide py-4 hover:bg-[#FFD400] transition"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
