import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/api/sign-in";

const signInForm = z.object({
  email: z.string().email(),
});

type SignInForm = z.infer<typeof signInForm>;

export function SignIn() {
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<SignInForm>({
    defaultValues: {
      email: searchParams.get("email") ?? "",
    },
  });

  const { mutateAsync: authenticate } = useMutation({ mutationFn: signIn });

  async function handleSignIn(data: SignInForm) {
    try {
      await authenticate({ email: data.email });

      toast.success("Enviamos um login de autenticação para seu e-mail.", {
        action: {
          label: "Reenviar",
          onClick: () => handleSignIn(data),
        },
      });
      reset();
    } catch {
      toast.error("Credenciais inválidas.");
    }
  }

  return (
    <>
      <Helmet title="Login" />

      {/* Botão no canto no desktop; no mobile vira link abaixo do título */}
      <Button
        variant="ghost"
        asChild
        className="absolute right-6 top-6 hidden md:right-8 md:top-8 md:inline-flex"
      >
        <Link to="/sign-up">Novo estabelecimento</Link>
      </Button>

      <div className="w-full max-w-sm sm:max-w-md">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tighter">
            Acessar painel
          </h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe suas vendas pelo painel do parceiro!
          </p>

          {/* Link alternativo visível apenas no mobile */}
          <div className="md:hidden">
            <Link
              to="/sign-up"
              className="text-sm underline underline-offset-4"
            >
              Novo estabelecimento
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleSignIn)} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Seu e-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="voce@exemplo.com"
              {...register("email")}
            />
          </div>

          <Button
            disabled={isSubmitting}
            className="h-11 w-full text-base md:h-9 md:text-sm lg:h-10 lg:text-sm"
            type="submit"
          >
            {isSubmitting ? "Enviando..." : "Acessar painel"}
          </Button>
        </form>
      </div>
    </>
  );
}
