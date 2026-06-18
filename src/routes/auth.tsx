import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      { title: "Вход — Профориентация" },
      { name: "description", content: "Вход и регистрация в мини-тесте профориентации." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Профориентация</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Мини-тест, который подскажет подходящее направление
          </p>
        </div>
        <Card className="shadow-soft rounded-2xl">
          <CardHeader>
            <CardTitle>Добро пожаловать</CardTitle>
            <CardDescription>Войдите или создайте аккаунт, чтобы продолжить</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="signin">Вход</TabsTrigger>
                <TabsTrigger value="signup">Регистрация</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="mt-4">
                <AuthForm mode="signin" />
              </TabsContent>
              <TabsContent value="signup" className="mt-4">
                <AuthForm mode="signup" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Аккаунт создан");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Что-то пошло не так";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`email-${mode}`}>Email</Label>
        <Input
          id={`email-${mode}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`password-${mode}`}>Пароль</Label>
        <Input
          id={`password-${mode}`}
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Минимум 6 символов"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </div>
      <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
        {loading ? "Подождите..." : mode === "signup" ? "Создать аккаунт" : "Войти"}
      </Button>
    </form>
  );
}
