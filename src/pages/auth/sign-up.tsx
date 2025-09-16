import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerRestaurant } from "@/api/register-restaurant";
import InputMask from "react-input-mask";

const signUpForm = z.object({
  restaurantName: z.string(),
  managerName: z.string(),
  phone: z.string(),
  email: z.string().email(),
});

type SignUpForm = z.infer<typeof signUpForm>;

export function SignUp() {
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<SignUpForm>({
    defaultValues: {
      restaurantName: "",
      managerName: "",
      email: "",
      phone: "",
    },
  });

  const { mutateAsync: registerRestaurantFn } = useMutation({
    mutationFn: registerRestaurant,
  });

  async function handleSignUp(data: SignUpForm) {
    try {
      await registerRestaurantFn({
        restaurantName: data.restaurantName,
        managerName: data.managerName,
        email: data.email,
        phone: data.phone,
      });

      toast.success("Restaurante cadastrado com sucesso!", {
        action: {
          label: "Login",
          onClick: () => navigate(`/?email=${encodeURIComponent(data.email)}`),
        },
      });
      reset({
        restaurantName: "",
        managerName: "",
        email: "",
        phone: "",
      });
    } catch {
      toast.error("Erro ao cadastrar restaurante.");
    }
  }

  return (
    <>
      <Helmet title="Cadastro" />

      {/* Botão no canto no desktop; no mobile vira link abaixo do título */}
      <Button
        variant="ghost"
        asChild
        className="absolute right-6 top-6 hidden md:right-8 md:top-8 md:inline-flex"
      >
        <Link to="/">Fazer login</Link>
      </Button>

      <div className="w-full max-w-sm sm:max-w-md">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tighter">
            Criar conta grátis
          </h1>
          <p className="text-sm text-muted-foreground">
            Seja um parceiro e comece as suas vendas!
          </p>

          {/* Link alternativo visível apenas no mobile */}
          <div className="md:hidden">
            <Link to="/" className="text-sm underline underline-offset-4">
              Já tenho conta
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleSignUp)} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="restaurantName">Nome do estabelecimento</Label>
            <Input
              id="restaurantName"
              type="text"
              autoComplete="organization"
              placeholder="Pizzaria da Esquina"
              {...register("restaurantName")}
              maxLength={50}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="managerName">Seu nome</Label>
            <Input
              id="managerName"
              type="text"
              autoComplete="name"
              placeholder="João Silva"
              {...register("managerName")}
              maxLength={50}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Seu e-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="voce@exemplo.com"
              {...register("email")}
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Seu celular</Label>

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <InputMask
                  mask="(99) 99999-9999" // aceita fixo e celular
                  maskChar={null} // não mostra '_' na máscara
                  value={field.value || ""} // garante string
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                >
                  {(inputProps: any) => (
                    <Input
                      {...inputProps}
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="(99) 91234-5678"
                    />
                  )}
                </InputMask>
              )}
            />
          </div>

          <Button
            disabled={isSubmitting}
            className="h-11 w-full text-base md:h-9 md:text-sm lg:h-8 lg:text-sm"
            type="submit"
          >
            {isSubmitting ? "Enviando..." : "Finalizar cadastro"}
          </Button>

          <p className="px-2 text-center text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Ao continuar, você concorda com nossos{" "}
            <a className="underline underline-offset-4" href="#">
              termos de serviço
            </a>{" "}
            e{" "}
            <a className="underline underline-offset-4" href="#">
              políticas de privacidade
            </a>
            .
          </p>
        </form>
      </div>
    </>
  );
}
