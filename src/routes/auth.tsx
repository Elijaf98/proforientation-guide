import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BackgroundDecor, Star } from "@/components/decor";

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
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-white text-[#111]">
      <BackgroundDecor />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-6 flex flex-col items-center gap-3">
          <Star className="h-14 w-14" fill="#F5331F" />
          <h1 className="font-display text-4xl sm:text-5xl uppercase leading-none">
            Профориентация
          </h1>
          <p className="text-sm font-semibold text-[#111]/70">
            Мини-тест, который подскажет твоё направление
          </p>
        </div>
        <div className="rounded-3xl border-2 border-[#111] bg-white p-6 sm:p-8 shadow-[6px_6px_0_0_#111]">
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button
              onClick={() => setMode("signin")}
              className={`rounded-full py-2 text-sm font-extrabold uppercase border-2 border-[#111] transition ${
                mode === "signin" ? "bg-[#111] text-white" : "bg-white text-[#111]"
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`rounded-full py-2 text-sm font-extrabold uppercase border-2 border-[#111] transition ${
                mode === "signup" ? "bg-[#111] text-white" : "bg-white text-[#111]"
              }`}
            >
              Регистрация
            </button>
          </div>
          <AuthForm mode={mode} />
        </div>
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
      <div className="space-y-1.5">
        <label htmlFor={`email-${mode}`} className="text-xs font-extrabold uppercase tracking-wider">
          Email
        </label>
        <input
          id={`email-${mode}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full rounded-full border-2 border-[#111] bg-white px-5 py-3 font-semibold placeholder:text-[#111]/40 focus:outline-none focus:bg-[#FFD400]/30"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor={`password-${mode}`} className="text-xs font-extrabold uppercase tracking-wider">
          Пароль
        </label>
        <input
          id={`password-${mode}`}
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Минимум 6 символов"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          className="w-full rounded-full border-2 border-[#111] bg-white px-5 py-3 font-semibold placeholder:text-[#111]/40 focus:outline-none focus:bg-[#FFD400]/30"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#111] text-white font-extrabold uppercase tracking-wide py-3.5 hover:bg-[#F5331F] transition disabled:opacity-60"
      >
        {loading ? "Подождите..." : mode === "signup" ? "Создать аккаунт" : "Войти"}
      </button>
    </form>
  );
}
