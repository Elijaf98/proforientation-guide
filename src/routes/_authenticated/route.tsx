import { createFileRoute, Outlet, redirect, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { BackgroundDecor, Star } from "@/components/decor";

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
    <div className="relative min-h-screen bg-white text-[#111]">
      <BackgroundDecor />
      <header className="sticky top-0 z-20 bg-white border-b-2 border-[#111]">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <Star className="h-9 w-9 transition-transform group-hover:rotate-12" fill="#F5331F" />
            <span className="font-display text-lg sm:text-xl uppercase tracking-tight">
              Профориентация
            </span>
          </Link>
          <button
            onClick={handleSignOut}
            className="rounded-full border-2 border-[#111] px-4 py-1.5 text-sm font-extrabold uppercase tracking-wide bg-white hover:bg-[#FFD400] transition"
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
