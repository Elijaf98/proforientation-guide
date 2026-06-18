import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

function StartPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Узнайте своё направление</h1>
        <p className="text-muted-foreground">
          Короткий тест из 5 вопросов поможет понять, какая профессиональная сфера подходит вам
          больше всего.
        </p>
      </div>

      <Card className="rounded-2xl shadow-soft">
        <CardContent className="p-6 space-y-4">
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="text-primary font-semibold">1.</span>
              <span>5 коротких вопросов о ваших предпочтениях</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold">2.</span>
              <span>Выберите наиболее близкий вариант ответа</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold">3.</span>
              <span>Получите направление и рекомендации</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Button asChild size="lg" className="w-full h-12 text-base">
        <Link to="/quiz">Начать тест</Link>
      </Button>
    </div>
  );
}
