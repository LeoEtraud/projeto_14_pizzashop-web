import { Outlet } from "react-router-dom";
import { Copyright, Pizza } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 antialiased md:grid-cols-2">
      {/* Painel lateral: esconde no mobile, mostra a partir do md */}
      <div className="hidden h-full flex-col justify-between border-r border-foreground/5 bg-muted p-8 text-muted-foreground md:flex lg:p-10">
        <div className="flex items-center gap-3 text-lg text-foreground">
          <Pizza className="h-5 w-5" />
          <span className="font-semibold">pizza.shop</span>
        </div>

        <footer className="flex items-center gap-1 text-sm">
          Painel do parceiro <Copyright className="inline h-4 w-4" /> pizza.shop
          - {new Date().getFullYear()}
        </footer>
      </div>

      {/* Conteúdo de auth */}
      <div className="relative flex flex-col items-center justify-center p-6 sm:p-8">
        {/* Header compacto no mobile (substitui o painel lateral oculto) */}
        <div className="mb-8 flex w-full max-w-sm items-center gap-3 text-foreground md:hidden">
          <Pizza className="h-5 w-5" />
          <span className="font-semibold">pizza.shop</span>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
