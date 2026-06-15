// Brazil geography helpers — regions, UF lists and full state names.
// The tile cartogram groups UF tiles by region (Yan's chosen approach).

export interface RegionMeta {
  code: string; // N | NE | CO | SE | S
  label: string;
}

export const REGIONS: RegionMeta[] = [
  { code: "N", label: "Norte" },
  { code: "NE", label: "Nordeste" },
  { code: "CO", label: "Centro-Oeste" },
  { code: "SE", label: "Sudeste" },
  { code: "S", label: "Sul" },
];

export const UF_BY_REGION: Record<string, string[]> = {
  N: ["RO", "AC", "AM", "RR", "PA", "AP", "TO"],
  NE: ["MA", "PI", "CE", "RN", "PB", "PE", "AL", "SE", "BA"],
  CO: ["MS", "MT", "GO", "DF"],
  SE: ["MG", "ES", "RJ", "SP"],
  S: ["PR", "SC", "RS"],
};

export const ALL_UFS: string[] = Object.values(UF_BY_REGION).flat();

export const REGION_OF_UF: Record<string, string> = Object.fromEntries(
  Object.entries(UF_BY_REGION).flatMap(([region, ufs]) => ufs.map((uf) => [uf, region]))
);

export const UF_NAMES: Record<string, string> = {
  RO: "Rondônia", AC: "Acre", AM: "Amazonas", RR: "Roraima", PA: "Pará", AP: "Amapá", TO: "Tocantins",
  MA: "Maranhão", PI: "Piauí", CE: "Ceará", RN: "Rio Grande do Norte", PB: "Paraíba", PE: "Pernambuco",
  AL: "Alagoas", SE: "Sergipe", BA: "Bahia",
  MS: "Mato Grosso do Sul", MT: "Mato Grosso", GO: "Goiás", DF: "Distrito Federal",
  MG: "Minas Gerais", ES: "Espírito Santo", RJ: "Rio de Janeiro", SP: "São Paulo",
  PR: "Paraná", SC: "Santa Catarina", RS: "Rio Grande do Sul",
};

export function regionLabel(code: string): string {
  return REGIONS.find((r) => r.code === code)?.label ?? code;
}
