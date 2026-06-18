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
      <div className="space-y-4">
        <span className="relative inline-block rounded-full bg-[#FCD116] text-[#0B2545] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] border border-[#0B2545] shadow-[0_4px_0_0_#0B2545]">
          Онлайн-академия
          <span className="absolute -bottom-2 left-6 w-3 h-3 bg-[#FCD116] border-r border-b border-[#0B2545] rotate-45" />
        </span>
        <h1 className="font-display text-5xl sm:text-6xl leading-[0.95] text-[#0B2545]">
          Узнай своё<br />
          <span className="text-[#FBF3E2]">направление</span>
        </h1>
      </div>

      <div className="rounded-[2rem] border border-[#0B2545] bg-[#FBF3E2] p-6 shadow-[0_18px_40px_-16px_rgba(11,37,69,0.45),0_6px_0_0_#0B2545]">
        <p className="text-base font-semibold text-[#0B2545] leading-relaxed">
          5 коротких вопросов — и ты поймёшь, в какой сфере ты на своём месте.
          Без занудства, по-доброму и по делу.
        </p>
      </div>

      {!loading && last && (
        <div className="relative rounded-[2rem] border border-[#0B2545] bg-[#FCD116] p-6 shadow-[0_20px_40px_-12px_rgba(11,37,69,0.5),0_8px_0_0_#0B2545] space-y-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0B2545]/80">
            ✨ Твой прошлый результат
          </div>
          <div className="flex items-center gap-4">
            <span
              className="grid place-items-center h-16 w-16 rounded-2xl bg-[#FBF3E2] border border-[#0B2545] shadow-[0_6px_0_0_#0B2545] text-3xl"
              aria-hidden
            >
              {DIRECTION_EMOJI[last.top_direction]}
            </span>
            <div className="min-w-0">
              <div className="font-display text-2xl sm:text-3xl leading-tight text-[#0B2545]">
                {conclusions[last.top_direction].title}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={viewLast}
              className="flex-1 rounded-full bg-[#0B2545] text-[#FBF3E2] font-bold text-sm py-3.5 shadow-[0_6px_0_0_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition"
            >
              Посмотреть подробно
            </button>
            <Link
              to="/quiz"
              className="flex-1 text-center rounded-full bg-[#FBF3E2] border border-[#0B2545] text-[#0B2545] font-bold text-sm py-3.5 shadow-[0_6px_0_0_#0B2545] hover:-translate-y-0.5 active:translate-y-0 transition"
            >
              Пройти заново
            </Link>
          </div>
        </div>
      )}

      <div className="rounded-[2rem] border border-[#0B2545] bg-[#FBF3E2] p-6 shadow-[0_14px_30px_-12px_rgba(11,37,69,0.4),0_6px_0_0_#0B2545]">
        <h2 className="font-display text-xl text-[#0B2545] mb-4">Как это работает</h2>
        <ul className="space-y-3">
          {[
            { t: "5 коротких вопросов о твоих привычках", c: "#2C6FE3" },
            { t: "Выбирай самый близкий вариант", c: "#1FA36A" },
            { t: "Получи направление и первый шаг", c: "#F26B4E" },
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span
                className="grid place-items-center shrink-0 h-9 w-9 rounded-full text-[#FBF3E2] text-sm font-black border border-[#0B2545] shadow-[0_4px_0_0_#0B2545]"
                style={{ background: item.c }}
              >
                {i + 1}
              </span>
              <span className="pt-1.5 text-sm font-semibold text-[#0B2545]">{item.t}</span>
            </li>
          ))}
        </ul>
      </div>

      {!last && (
        <Link
          to="/quiz"
          className="block text-center rounded-full bg-[#0B2545] text-[#FBF3E2] font-bold tracking-wide py-5 text-base shadow-[0_10px_0_0_rgba(0,0,0,0.25),0_24px_36px_-12px_rgba(11,37,69,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition"
        >
          Начать тест →
        </Link>
      )}
    </div>
  );
}
