import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
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
      <div className="space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-soft">
          <Sparkles className="h-3.5 w-3.5" />
          Ваше направление
        </span>
        <div className="flex items-start gap-3">
          <span className="text-4xl sm:text-5xl leading-none" aria-hidden>
            {DIRECTION_EMOJI[stored.direction]}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{c.title}</h1>
        </div>
      </div>

      <Card className="rounded-2xl shadow-soft">
        <CardContent className="p-6">
          <p className="text-foreground/85 leading-relaxed">{c.description}</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-soft">
        <CardContent className="p-6 space-y-5">
          <div>
            <h2 className="font-semibold mb-1.5">Что подтянуть</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{c.toLearn}</p>
          </div>
          <div className="h-px bg-border" />
          <div>
            <h2 className="font-semibold mb-1.5">Первый шаг</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{c.firstStep}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-soft">
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold">Баллы по направлениям</h2>
          <ul className="space-y-3">
            {sorted.map((d) => {
              const v = stored.scores[d];
              const pct = (v / max) * 100;
              const isWinner = d === stored.direction;
              return (
                <li key={d} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={`flex items-center gap-2 ${
                        isWinner ? "font-semibold text-foreground" : "text-foreground/75"
                      }`}
                    >
                      <span aria-hidden>{DIRECTION_EMOJI[d]}</span>
                      <span>{conclusions[d].title}</span>
                    </span>
                    <span
                      className={`tabular-nums text-xs ${
                        isWinner ? "font-bold text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {v}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isWinner ? "bg-primary" : "bg-primary/25"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
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
