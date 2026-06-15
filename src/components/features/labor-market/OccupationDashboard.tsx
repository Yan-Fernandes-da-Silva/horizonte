"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DashboardData } from "@/lib/labor-market/types";
import { FilterBar } from "./FilterBar";
import { OverviewTab } from "./tabs/OverviewTab";
import { MarketTab } from "./tabs/MarketTab";
import { SalaryTab } from "./tabs/SalaryTab";
import { ProfileTab } from "./tabs/ProfileTab";

interface Props {
  data: DashboardData;
  region: string;
  uf: string;
}

export function OccupationDashboard({ data, region, uf }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const update = (next: { region?: string | null; uf?: string | null }) => {
    const p = new URLSearchParams(sp.toString());
    if ("region" in next) {
      if (next.region) p.set("region", next.region);
      else p.delete("region");
    }
    if ("uf" in next) {
      if (next.uf) p.set("uf", next.uf);
      else p.delete("uf");
    }
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const onSelectRegion = (r: string) => update({ region: r || null, uf: null });
  const onSelectUf = (u: string) => update({ uf: u || null });

  return (
    <div>
      <FilterBar region={region} uf={uf} onRegionChange={(r) => onSelectRegion(r)} onUfChange={(u) => onSelectUf(u)} />

      <Tabs defaultValue="overview" className="mt-5">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="market">Mercado</TabsTrigger>
          <TabsTrigger value="salary">Remuneração</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <OverviewTab data={data} />
        </TabsContent>
        <TabsContent value="market" className="mt-4">
          <MarketTab market={data.market} selectedUf={uf} onSelectUf={onSelectUf} onSelectRegion={onSelectRegion} />
        </TabsContent>
        <TabsContent value="salary" className="mt-4">
          <SalaryTab salary={data.salary} selectedUf={uf} onSelectUf={onSelectUf} onSelectRegion={onSelectRegion} />
        </TabsContent>
        <TabsContent value="profile" className="mt-4">
          <ProfileTab profile={data.profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
