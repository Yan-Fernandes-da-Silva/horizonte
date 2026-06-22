"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck } from "lucide-react";

import {
  ForgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/auth";
import { AuthBrand } from "@/components/shared/AuthBrand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  async function onSubmit() {
    // MVP: no real email is sent. We just acknowledge the request.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitted(true);
  }

  return (
    <Card className="border-white/20 bg-white/95 shadow-2xl backdrop-blur">
      <CardHeader>
        <AuthBrand />
        <CardDescription className="text-2xl leading-snug text-ocean">
          Informe seu e-mail e enviaremos as instruções de recuperação.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="flex flex-col items-center gap-3 rounded-lg bg-emerald-50 px-4 py-6 text-center">
            <MailCheck className="h-8 w-8 text-emerald-600" />
            <p className="text-sm text-emerald-700">
              Se este e-mail estiver cadastrado, você receberá as instruções em
              breve.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="joao@dominio.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gold text-ocean hover:bg-gold-dark hover:text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando…
                </>
              ) : (
                "Enviar instruções"
              )}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <Link
          href="/login"
          className="text-sm font-medium text-sky hover:underline"
        >
          Voltar para o login
        </Link>
      </CardFooter>
    </Card>
  );
}
