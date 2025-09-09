import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold sm:text-4xl">Página não encontrada</h1>
      <p className="text-accent-foreground">
        Voltar para o{" "}
        <Link to="/dashboard" className="text-sky-600 dark:text-sky-400">
          Dashboard
        </Link>
      </p>
    </div>
  );
}
