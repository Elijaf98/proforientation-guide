import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BackgroundDecor, Sparkle } from "@/components/decor";

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
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 text-[#0B2545]">
      <BackgroundDecor />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-6 flex flex-col items-center gap-3">
          <span className="grid place-items-center h-16 w-16 rounded-3xl bg-[#FBF3E2] border border-[#0B2545] shadow-[0_8px_0_0_#0B2545]">
            <Sparkle className="h-10 w-10" fill="#FCD116" />
          </span>
          <h1 className="font-display text-4xl sm:text-5xl leading-none text-[#0B2545]">
            Профориентация
          </h1>
          <p className="text-sm font-semibold text-[#0B2545]/80">
            Мини-тест, который подскажет твоё направление
          </p>
        </div>
        <div className="rounded-[2rem] border border-[#0B2545] bg-[#FBF3E2] p-6 sm:p-8 shadow-[0_18px_40px_-12px_rgba(11,37,69,0.45),0_8px_0_0_#0B2545]">
          <div className="grid grid-cols-2 gap-2 p-1 mb-6 rounded-full border border-[#0B2545]/20 bg-white/60">
            <button
              onClick={() => setMode("signin")}
              className={`rounded-full py-2 text-sm font-bold transition ${
                mode === "signin"
                  ? "bg-[#0B2545] text-[#FBF3E2] shadow-[0_4px_0_0_#000]/10"
                  : "text-[#0B2545]"
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`rounded-full py-2 text-sm font-bold transition ${
                mode === "signup"
                  ? "bg-[#0B2545] text-[#FBF3E2]"
                  : "text-[#0B2545]"
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
        <label htmlFor={`email-${mode}`} className="text-xs font-bold uppercase tracking-wider text-[#0B2545]/70">
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
          className="w-full rounded-2xl border border-[#0B2545] bg-white px-5 py-3.5 font-semibold text-[#0B2545] placeholder:text-[#0B2545]/40 focus:outline-none focus:ring-4 focus:ring-[#FCD116]/60"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor={`password-${mode}`} className="text-xs font-bold uppercase tracking-wider text-[#0B2545]/70">
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
          className="w-full rounded-2xl border border-[#0B2545] bg-white px-5 py-3.5 font-semibold text-[#0B2545] placeholder:text-[#0B2545]/40 focus:outline-none focus:ring-4 focus:ring-[#FCD116]/60"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#0B2545] text-[#FBF3E2] font-bold py-4 shadow-[0_8px_0_0_#000]/30 hover:-translate-y-0.5 active:translate-y-0 transition disabled:opacity-60"
      >
        {loading ? "Подождите..." : mode === "signup" ? "Создать аккаунт" : "Войти"}
      </button>
    </form>
  );
}
