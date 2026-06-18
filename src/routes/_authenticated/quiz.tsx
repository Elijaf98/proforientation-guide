import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { placeholderResult, questions } from "@/lib/quiz-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/quiz")({
  head: () => ({
    meta: [{ title: "Вопросы — Профориентация" }],
  }),
  component: QuizPage,
});

function QuizPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const total = questions.length;
  const question = questions[current];
  const progress = ((current + 1) / total) * 100;

  async function saveQuizAttempt(nextAnswers: string[]) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData.user;

    if (userError || !user) {
      throw new Error("Не удалось определить пользователя для сохранения результата");
    }

    const { data: result, error: resultError } = await supabase
      .from("quiz_results")
      .insert({
        user_id: user.id,
        top_direction: "analytics",
        top_title: placeholderResult.direction,
        conclusion: placeholderResult.explanation,
        scores: { placeholder: true, answers: nextAnswers },
      })
      .select("id")
      .single();

    if (resultError) throw resultError;

    const answerRows = questions.map((item, index) => {
      const answerKey = nextAnswers[index];
      const answer = item.options.find((option) => option.key === answerKey);

      return {
        result_id: result.id,
        user_id: user.id,
        question_key: item.key,
        question_text: item.text,
        answer_text: answer?.text ?? answerKey,
      };
    });

    const { error: answersError } = await supabase.from("quiz_answers").insert(answerRows);
    if (answersError) throw answersError;
  }

  async function selectOption(optionKey: string) {
    if (isSaving) return;

    const next = [...answers];
    next[current] = optionKey;
    setAnswers(next);

    if (current < total - 1) {
      setCurrent(current + 1);
    } else {
      try {
        setIsSaving(true);
        sessionStorage.setItem("quiz-answers", JSON.stringify(next));
        await saveQuizAttempt(next);
        navigate({ to: "/result" });
      } catch {
        toast.error("Не удалось сохранить результат. Попробуйте ещё раз.");
        setIsSaving(false);
      }
    }
  }

  function goBack() {
    if (current > 0) setCurrent(current - 1);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Вопрос {current + 1} из {total}
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
              const selected = answers[current] === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => selectOption(opt.key)}
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
        <Button variant="ghost" onClick={goBack} disabled={current === 0}>
          Назад
        </Button>
        <span className="text-xs text-muted-foreground self-center">
          {isSaving ? "Сохраняем результат..." : "Выберите вариант, чтобы продолжить"}
        </span>
      </div>
    </div>
  );
}
