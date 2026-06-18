import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { questions } from "@/lib/quiz-data";

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

  const total = questions.length;
  const question = questions[current];
  const progress = ((current + 1) / total) * 100;

  function selectOption(optionKey: string) {
    const next = [...answers];
    next[current] = optionKey;
    setAnswers(next);

    if (current < total - 1) {
      setCurrent(current + 1);
    } else {
      try {
        sessionStorage.setItem("quiz-answers", JSON.stringify(next));
      } catch {
        // ignore
      }
      navigate({ to: "/result" });
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
          Выберите вариант, чтобы продолжить
        </span>
      </div>
    </div>
  );
}
