import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { conclusions, type Direction, type Scores } from "@/lib/quiz-data";

export const Route = createFileRoute("/_authenticated/result")({
  head: () => ({
    meta: [{ title: "Результат — Профориентация" }],
  }),
  component: ResultPage,
});

type StoredResult = { direction: Direction; scores: Scores };

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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-wider text-primary font-medium">
          Ваше направление
        </p>
        <h1 className="text-3xl font-bold tracking-tight">{c.title}</h1>
      </div>

      <Card className="rounded-2xl shadow-soft">
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-foreground/80 leading-relaxed">{c.description}</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-soft">
        <CardContent className="p-6 space-y-4">
          <div>
            <h2 className="font-semibold mb-1">Что подтянуть</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{c.toLearn}</p>
          </div>
          <div>
            <h2 className="font-semibold mb-1">Первый шаг</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{c.firstStep}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-soft">
        <CardContent className="p-6 space-y-3">
          <h2 className="font-semibold">Баллы по направлениям</h2>
          <ul className="space-y-2 text-sm">
            {(Object.keys(stored.scores) as Direction[])
              .sort((a, b) => stored.scores[b] - stored.scores[a])
              .map((d) => (
                <li key={d} className="flex justify-between">
                  <span className="text-foreground/80">{conclusions[d].title}</span>
                  <span className="font-medium tabular-nums">{stored.scores[d]}</span>
                </li>
              ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild size="lg" className="flex-1 h-12">
          <Link to="/quiz">Пройти ещё раз</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="flex-1 h-12">
          <Link to="/">На главную</Link>
        </Button>
      </div>
    </div>
  );
}
