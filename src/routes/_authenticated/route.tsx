import { createFileRoute, Outlet, redirect, Link, useNavigate } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-70" />
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="grid place-items-center h-9 w-9 rounded-full bg-primary text-primary-foreground shadow-soft transition-transform group-hover:scale-105">
              <Compass className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-bold tracking-tight text-base">Профориентация</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            Выйти
          </Button>
        </div>
      </header>
      <main className="max-w-xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
