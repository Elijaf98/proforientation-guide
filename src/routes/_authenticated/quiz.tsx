import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  conclusions,
  emptyScores,
  pickWinner,
  q1,
  q2ByTrack,
  q3,
  q4,
  q5,
  TOTAL_QUESTIONS,
  type Direction,
  type QuizOption,
  type QuizQuestion,
  type Scores,
} from "@/lib/quiz-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/quiz")({
  head: () => ({
    meta: [{ title: "Вопросы — Профориентация" }],
  }),
  component: QuizPage,
});

type AnswerRecord = {
  question_key: string;
  question_text: string;
  answer_key: string;
  answer_text: string;
  scores: Partial<Scores>;
};

function QuizPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const questionsForFlow = useMemo<QuizQuestion[]>(() => {
    const q1Answer = answers[0];
    const track = q1Answer
      ? q1.options.find((o) => o.key === q1Answer.answer_key)?.track
      : undefined;
    const q2 = track ? q2ByTrack[track] : q2ByTrack.DATA;
    return [q1, q2, q3, q4, q5];
  }, [answers]);

  const question = questionsForFlow[current];
  const progress = ((current + 1) / TOTAL_QUESTIONS) * 100;

  async function saveQuizAttempt(finalAnswers: AnswerRecord[]) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData.user;
    if (userError || !user) throw new Error("Не удалось определить пользователя");

    const scores = emptyScores();
    for (const a of finalAnswers) {
      for (const [dir, val] of Object.entries(a.scores)) {
        scores[dir as Direction] += val ?? 0;
      }
    }
    const winner = pickWinner(scores);
    const c = conclusions[winner];
    const conclusionText = `${c.description} Что подтянуть: ${c.toLearn} Первый шаг: ${c.firstStep}`;

    const { data: result, error: resultError } = await supabase
      .from("quiz_results")
      .insert({
        user_id: user.id,
        top_direction: winner,
        top_title: c.title,
        conclusion: conclusionText,
        scores,
      })
      .select("id")
      .single();

    if (resultError) throw resultError;
    if (!result) throw new Error("Supabase не вернул id");

    const rows = finalAnswers.map((a) => ({
      result_id: result.id,
      user_id: user.id,
      question_key: a.question_key,
      question_text: a.question_text,
      answer_text: a.answer_text,
    }));
    const { error: ansErr } = await supabase.from("quiz_answers").insert(rows);
    if (ansErr) throw ansErr;

    sessionStorage.setItem(
      "quiz-result",
      JSON.stringify({ direction: winner, scores }),
    );
  }

  async function selectOption(opt: QuizOption) {
    if (isSaving) return;
    const record: AnswerRecord = {
      question_key: question.key,
      question_text: question.text,
      answer_key: opt.key,
      answer_text: opt.text,
      scores: opt.scores,
    };
    const next = [...answers.slice(0, current), record];

    if (current < TOTAL_QUESTIONS - 1) {
      setAnswers(next);
      setCurrent(current + 1);
    } else {
      setAnswers(next);
      try {
        setIsSaving(true);
        await saveQuizAttempt(next);
        navigate({ to: "/result" });
      } catch (e) {
        console.error(e);
        toast.error("Не удалось сохранить результат. Попробуйте ещё раз.");
        setIsSaving(false);
      }
    }
  }

  function goBack() {
    if (current > 0) setCurrent(current - 1);
  }

  const selectedKey = answers[current]?.answer_key;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[#0B2545]">
          <span className="text-xs font-bold uppercase tracking-[0.18em]">
            Вопрос {current + 1} из {TOTAL_QUESTIONS}
          </span>
          <span className="text-xs font-extrabold tabular-nums">{Math.round(progress)}%</span>
        </div>
        <div className="h-4 w-full rounded-full border border-[#0B2545] bg-[#FBF3E2] overflow-hidden shadow-[inset_0_2px_0_0_rgba(11,37,69,0.15)]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #FCD116, #F26B4E)",
            }}
          />
        </div>
      </div>

      <div
        key={current}
        className="rounded-[2rem] border border-[#0B2545] bg-[#FBF3E2] p-6 sm:p-8 shadow-[0_22px_44px_-18px_rgba(11,37,69,0.5),0_8px_0_0_#0B2545] animate-in fade-in slide-in-from-right-4 duration-300 space-y-6"
      >
        <h2 className="font-display text-2xl sm:text-3xl leading-[1.1] text-[#0B2545]">
          {question.text}
        </h2>
        <div className="space-y-3">
          {question.options.map((opt) => {
            const selected = selectedKey === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => selectOption(opt)}
                disabled={isSaving}
                className={`w-full text-left rounded-2xl border px-5 py-4 font-semibold text-sm sm:text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 ${
                  selected
                    ? "bg-[#0B2545] text-[#FBF3E2] border-[#0B2545] shadow-[0_8px_0_0_#FCD116]"
                    : "bg-white text-[#0B2545] border-[#0B2545] shadow-[0_5px_0_0_#0B2545] hover:bg-[#FCD116]/30"
                }`}
              >
                {opt.text}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={goBack}
          disabled={current === 0 || isSaving}
          className="rounded-full border border-[#0B2545] bg-[#FBF3E2] px-5 py-2.5 text-sm font-bold text-[#0B2545] shadow-[0_4px_0_0_#0B2545] disabled:opacity-40 hover:-translate-y-0.5 active:translate-y-0 transition"
        >
          ← Назад
        </button>
        <span className="text-xs font-bold text-[#0B2545]/70">
          {isSaving ? "Сохраняем..." : "Выбери вариант"}
        </span>
      </div>
    </div>
  );
}
