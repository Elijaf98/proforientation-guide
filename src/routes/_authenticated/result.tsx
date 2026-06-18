import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { placeholderResult } from "@/lib/quiz-data";

export const Route = createFileRoute("/_authenticated/result")({
  head: () => ({
    meta: [{ title: "Результат — Профориентация" }],
  }),
  component: ResultPage,
});

function ResultPage() {
  const result = placeholderResult;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-wider text-primary font-medium">
          Ваше направление
        </p>
        <h1 className="text-3xl font-bold tracking-tight">{result.direction}</h1>
      </div>

      <Card className="rounded-2xl shadow-soft">
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-foreground/80 leading-relaxed">{result.explanation}</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-soft">
        <CardContent className="p-6 space-y-3">
          <h2 className="font-semibold">Рекомендации</h2>
          <ul className="space-y-3">
            {result.recommendations.map((r, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center font-semibold text-xs">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{r}</span>
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
