import { createFileRoute, Outlet, redirect, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { BackgroundDecor, Sparkle } from "@/components/decor";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="relative min-h-screen text-[#0B2545]">
      <BackgroundDecor />
      <header className="sticky top-0 z-20 backdrop-blur-md bg-[#F26B4E]/70 border-b border-[#0B2545]/15">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="relative grid place-items-center h-10 w-10 rounded-2xl bg-[#FBF3E2] border border-[#0B2545] shadow-[0_4px_0_0_#0B2545] group-hover:-translate-y-0.5 transition">
              <Sparkle className="h-6 w-6" fill="#FCD116" />
            </span>
            <span className="font-display text-lg sm:text-xl tracking-tight text-[#0B2545]">
              Профориентация
            </span>
          </Link>
          <button
            onClick={handleSignOut}
            className="rounded-full bg-[#FBF3E2] border border-[#0B2545] px-4 py-2 text-sm font-bold text-[#0B2545] shadow-[0_4px_0_0_#0B2545] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_0_0_#0B2545] transition"
          >
            Выйти
          </button>
        </div>
      </header>
      <main className="relative max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <Outlet />
      </main>
    </div>
  );
}
