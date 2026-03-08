import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  let user: { email?: string } | null = null;

  try {
    const { data } = await supabase.auth.getClaims();
    user = (data?.claims as { email?: string } | null) ?? null;
  } catch {
    user = null;
  }

  return user ? (
    <div className="flex items-center gap-4">
      Olá, {user.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Entrar</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Criar conta</Link>
      </Button>
    </div>
  );
}
