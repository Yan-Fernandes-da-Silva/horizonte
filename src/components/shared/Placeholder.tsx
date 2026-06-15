import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/PageContainer";

interface PlaceholderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}

/** Reusable "coming soon" page used for routes implemented in later phases. */
export function Placeholder({
  title,
  description = "Esta página será implementada em breve.",
  backHref = "/",
  backLabel = "Voltar",
}: PlaceholderProps) {
  return (
    <PageContainer className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-lighter text-sky">
        <Compass className="h-8 w-8 animate-float" />
      </div>
      <h1 className="text-3xl font-bold text-ocean">{title}</h1>
      <p className="mt-2 max-w-md text-muted-foreground">{description}</p>
      <Button
        asChild
        variant="outline"
        className="mt-6 gap-2 border-ocean/20 text-ocean hover:bg-ocean/5"
      >
        <Link href={backHref}>
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </Button>
    </PageContainer>
  );
}
