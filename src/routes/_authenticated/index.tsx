import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  conclusions,
  DIRECTION_EMOJI,
  type Direction,
  type Scores,
} from "@/lib/quiz-data";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Профориентация — Начать тест" },
      {
        name: "description",
        content: "Пройдите мини-тест профориентации и узнайте подходящее направление.",
      },
    ],
  }),
  component: StartPage,
});

type LastResult = {
  id: string;
  top_direction: Direction;
  top_title: string;
  scores: Scores;
  conclusion: string;
};

function StartPage() {
  const navigate = useNavigate();
  const [last, setLast] = useState<LastResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("quiz_results")
        .select("id, top_direction, top_title, scores, conclusion")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) setLast(data as LastResult);
      setLoading(false);
    })();
  }, []);

  function viewLast() {
    if (!last) return;
    sessionStorage.setItem(
      "quiz-result",
      JSON.stringify({ direction: last.top_direction, scores: last.scores }),
    );
    navigate({ to: "/result" });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <span className="inline-block rounded-full bg-[#F5331F] text-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.15em]">
          креативная академия
        </span>
        <h1 className="font-display text-5xl sm:text-6xl uppercase leading-[0.95]">
          Узнай <span className="text-[#F5331F]">своё</span><br />направление
        </h1>
        <p className="text-base font-semibold text-[#111]/80 leading-relaxed max-w-md">
          5 коротких вопросов — и ты поймёшь, в какой сфере ты на своём месте.
        </p>
      </div>

      {!loading && last && (
        <div className="relative rounded-3xl border-2 border-[#111] bg-[#FFD400] p-6 shadow-[6px_6px_0_0_#111] space-y-4">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.2em]">
            ★ Твой прошлый результат
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden>
              {DIRECTION_EMOJI[last.top_direction]}
            </span>
            <div className="min-w-0">
              <div className="font-display text-2xl sm:text-3xl uppercase leading-tight">
                {conclusions[last.top_direction].title}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              onClick={viewLast}
              className="flex-1 rounded-full bg-[#111] text-white font-extrabold uppercase text-sm tracking-wide py-3 hover:bg-[#F5331F] transition"
            >
              Посмотреть подробно
            </button>
            <Link
              to="/quiz"
              className="flex-1 text-center rounded-full bg-white border-2 border-[#111] text-[#111] font-extrabold uppercase text-sm tracking-wide py-3 hover:bg-[#111] hover:text-white transition"
            >
              Пройти заново
            </Link>
          </div>
        </div>
      )}

      <div className="rounded-3xl border-2 border-[#111] bg-white p-6 shadow-[6px_6px_0_0_#111]">
        <h2 className="font-display text-xl uppercase mb-4">Как это работает</h2>
        <ul className="space-y-3">
          {[
            "5 коротких вопросов о твоих привычках",
            "Выбирай самый близкий вариант",
            "Получи направление и первый шаг",
          ].map((t, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="grid place-items-center shrink-0 h-7 w-7 rounded-full bg-[#111] text-white text-xs font-black">
                {i + 1}
              </span>
              <span className="pt-0.5 text-sm font-semibold">{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {!last && (
        <Link
          to="/quiz"
          className="block text-center rounded-full bg-[#111] text-white font-extrabold uppercase tracking-wider py-4 text-base hover:bg-[#F5331F] transition shadow-[6px_6px_0_0_#F5331F]"
        >
          Начать тест →
        </Link>
      )}
    </div>
  );
}
