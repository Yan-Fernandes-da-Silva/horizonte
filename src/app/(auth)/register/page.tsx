import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <Card className="border-white/20 bg-white/95 shadow-2xl backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl text-ocean">Criar conta</CardTitle>
        <CardDescription>
          Comece a planejar sua carreira com o Horizonte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="rounded-lg bg-sand px-4 py-3 text-sm text-muted-foreground">
          Esta página será implementada em breve.
        </p>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3">
        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-medium text-sky hover:underline">
            Entrar
          </Link>
        </p>
        <Button asChild variant="ghost" className="text-ocean hover:bg-ocean/5">
          <Link href="/">Voltar para a página inicial</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
