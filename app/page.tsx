import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import CriarColecao from "@/app/colecoes/criarColecao";
import ListaColecoes from "@/app/colecoes/listaColecoes";
async function UserDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }



  return JSON.stringify(data.claims, null, 2);
}

export default function CardsPage() {
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Início</h1>
          <CriarColecao />
      </div>
        <ListaColecoes />
    </div>
  );
}
