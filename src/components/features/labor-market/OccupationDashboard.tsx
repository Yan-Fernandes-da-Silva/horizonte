"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DashboardData } from "@/lib/labor-market/types";
import { DEFAULT_PERIOD } from "@/lib/labor-market/periods";
import { FilterBar } from "./FilterBar";
import { OverviewTab } from "./tabs/OverviewTab";
import { MarketTab } from "./tabs/MarketTab";
import { SalaryTab } from "./tabs/SalaryTab";
import { ProfileTab } from "./tabs/ProfileTab";

interface Props {
  data: DashboardData;
  region: string;
  uf: string;
  period: string;
}

export function OccupationDashboard({ data, region, uf, period }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const update = (next: { region?: string | null; uf?: string | null; period?: string | null }) => {
    const p = new URLSearchParams(sp.toString());
    if ("region" in next) {
      if (next.region) p.set("region", next.region);
      else p.delete("region");
    }
    if ("uf" in next) {
      if (next.uf) p.set("uf", next.uf);
      else p.delete("uf");
    }
    if ("period" in next) {
      if (next.period) p.set("period", next.period);
      else p.delete("period");
    }
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const onSelectRegion = (r: string) => update({ region: r || null, uf: null });
  const onSelectUf = (u: string) => update({ uf: u || null });
  // Keep the URL clean: omit the param when it's the default (latest) period.
  const onSelectPeriod = (p: string) => update({ period: p === DEFAULT_PERIOD ? null : p });

  // One glass panel: filters on top, tabs below.
  const triggerCls =
    "text-white/70 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-none";

  return (
    <div>
      <Tabs defaultValue="overview">
        <div className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 shadow-sm backdrop-blur-sm">
          <FilterBar region={region} uf={uf} period={period} onRegionChange={(r) => onSelectRegion(r)} onUfChange={(u) => onSelectUf(u)} onPeriodChange={(p) => onSelectPeriod(p)} />
          <TabsList className="w-full flex-wrap justify-center bg-white/10">
            <TabsTrigger value="overview" className={triggerCls}>Resumo</TabsTrigger>
            <TabsTrigger value="market" className={triggerCls}>Demanda</TabsTrigger>
            <TabsTrigger value="salary" className={triggerCls}>Remuneração</TabsTrigger>
            <TabsTrigger value="profile" className={triggerCls}>Perfil</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-4">
          <OverviewTab data={data} />
        </TabsContent>
        <TabsContent value="market" className="mt-4">
          <MarketTab market={data.market} selectedRegion={region} selectedUf={uf} onSelectUf={onSelectUf} onSelectRegion={onSelectRegion} />
        </TabsContent>
        <TabsContent value="salary" className="mt-4">
          <SalaryTab salary={data.salary} selectedRegion={region} selectedUf={uf} onSelectUf={onSelectUf} onSelectRegion={onSelectRegion} />
        </TabsContent>
        <TabsContent value="profile" className="mt-4">
          <ProfileTab profile={data.profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
