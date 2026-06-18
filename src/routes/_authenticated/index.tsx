import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, RotateCcw } from "lucide-react";
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
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Узнайте своё направление
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Короткий тест из 5 вопросов поможет понять, какая профессиональная сфера подходит
          вам больше всего.
        </p>
      </div>

      {!loading && last && (
        <Card className="rounded-2xl shadow-soft border-primary/30 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              Твой прошлый результат
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden>
                {DIRECTION_EMOJI[last.top_direction]}
              </span>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">Направление</div>
                <div className="text-lg font-bold truncate">
                  {conclusions[last.top_direction].title}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={viewLast} className="flex-1 h-11">
                Посмотреть подробно
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button asChild variant="outline" className="flex-1 h-11">
                <Link to="/quiz">
                  <RotateCcw className="h-4 w-4" />
                  Пройти заново
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl shadow-soft">
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold">Как это работает</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="grid place-items-center shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                1
              </span>
              <span className="pt-0.5">5 коротких вопросов о ваших предпочтениях</span>
            </li>
            <li className="flex gap-3">
              <span className="grid place-items-center shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                2
              </span>
              <span className="pt-0.5">Выберите наиболее близкий вариант ответа</span>
            </li>
            <li className="flex gap-3">
              <span className="grid place-items-center shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                3
              </span>
              <span className="pt-0.5">Получите направление и рекомендации</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {!last && (
        <Button asChild size="lg" className="w-full h-12 text-base">
          <Link to="/quiz">Начать тест</Link>
        </Button>
      )}
    </div>
  );
}
