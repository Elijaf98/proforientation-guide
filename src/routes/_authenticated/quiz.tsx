import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Вопрос {current + 1} из {TOTAL_QUESTIONS}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="rounded-2xl shadow-soft">
        <CardContent className="p-6 space-y-5">
          <h2 className="text-xl font-semibold leading-snug">{question.text}</h2>
          <div className="space-y-3">
            {question.options.map((opt) => {
              const selected = selectedKey === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => selectOption(opt)}
                  disabled={isSaving}
                  className={`w-full text-left rounded-xl border p-4 transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.99] ${
                    selected ? "border-primary bg-primary/10" : "border-border bg-card"
                  }`}
                >
                  <span className="text-sm sm:text-base">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={goBack} disabled={current === 0 || isSaving}>
          Назад
        </Button>
        <span className="text-xs text-muted-foreground self-center">
          {isSaving ? "Сохраняем результат..." : "Выберите вариант, чтобы продолжить"}
        </span>
      </div>
    </div>
  );
}
