"use client";

import * as React from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { geoCentroid, geoBounds } from "d3-geo";

import { REGION_OF_UF } from "@/lib/labor-market/geo";

const GEO_URL = "/geo/br-states.json";
const NEUTRAL = "rgba(255,255,255,0.16)";
const OUT_OF_SCOPE = "rgba(255,255,255,0.05)";

// Spectrum stops per scheme (light → strong). Ocean = header/footer color.
const STOPS: Record<"salary" | "ocean", [number[], number[]]> = {
  salary: [[144, 224, 239], [3, 105, 161]],
  ocean: [[144, 224, 239], [10, 35, 66]],
};

interface GeoJson {
  type: string;
  features: { properties: { sigla: string } }[];
}

interface Props {
  values: { uf: string; value: number | null }[];
  scheme: "salary" | "ocean";
  /** Legend endpoints, e.g. ["Menos", "Mais"]. */
  spectrumLabels?: [string, string];
  selectedRegion: string;
  selectedUf: string;
  onSelectRegion: (region: string) => void;
  onSelectUf: (uf: string) => void;
}

function lerp(a: number[], b: number[], t: number) {
  const c = a.map((x, i) => Math.round(x + (b[i] - x) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

/**
 * Real, interactive Brazil map with drill-down + zoom:
 * - Brazil level: hovering highlights the whole REGION; clicking selects it (zoom in).
 * - Region level: hovering highlights a STATE; clicking selects it (zoom in).
 * - Clicking the map background (outside the states) undoes one level (and the zoom).
 * Colors states by a single-hue spectrum (salary or ocean).
 */
export function BrazilMap({
  values, scheme, spectrumLabels, selectedRegion, selectedUf, onSelectRegion, onSelectUf,
}: Props) {
  const [geo, setGeo] = React.useState<GeoJson | null>(null);
  const [hover, setHover] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    fetch(GEO_URL).then((r) => r.json()).then((d) => active && setGeo(d)).catch(() => {});
    return () => { active = false; };
  }, []);

  const byUf = React.useMemo(() => new Map(values.map((v) => [v.uf, v.value])), [values]);

  const range = React.useMemo(() => {
    const nums = values.map((v) => v.value).filter((v): v is number => v != null);
    return nums.length ? { min: Math.min(...nums), max: Math.max(...nums) } : null;
  }, [values]);

  // Center + zoom for the current level (Brazil / region / state).
  const view = React.useMemo(() => {
    const DEFAULT = { center: [-54, -15] as [number, number], zoom: 1 };
    if (!geo) return DEFAULT;
    const pick = (predicate: (uf: string) => boolean) => ({
      type: "FeatureCollection",
      features: geo.features.filter((f) => predicate(f.properties.sigla)),
    });
    let fc: GeoJson | null = null;
    if (selectedUf) fc = pick((uf) => uf === selectedUf) as unknown as GeoJson;
    else if (selectedRegion) fc = pick((uf) => REGION_OF_UF[uf] === selectedRegion) as unknown as GeoJson;
    if (!fc || fc.features.length === 0) return DEFAULT;
    const center = geoCentroid(fc as never) as [number, number];
    const [[x0, y0], [x1, y1]] = geoBounds(fc as never);
    const spanLon = Math.max(0.5, x1 - x0);
    const spanLat = Math.max(0.5, y1 - y0);
    const zoom = Math.min(16, Math.max(3.2, 1.3 * Math.min(40 / spanLon, 40 / spanLat)));
    return { center, zoom };
  }, [geo, selectedRegion, selectedUf]);

  const [lo, hi] = STOPS[scheme];
  function fillFor(uf: string): string {
    const v = byUf.get(uf);
    if (v == null || !range) return NEUTRAL;
    const t = range.max === range.min ? 0.5 : (v - range.min) / (range.max - range.min);
    return lerp(lo, hi, t);
  }

  const undo = () => {
    if (selectedUf) onSelectUf("");
    else if (selectedRegion) onSelectRegion("");
  };

  const hoverRegion = hover ? REGION_OF_UF[hover] : null;
  const labels = spectrumLabels ?? (scheme === "ocean" ? ["Menos", "Mais"] : ["Menor", "Maior"]);
  const gradient = `linear-gradient(to right, rgb(${lo.join(",")}), rgb(${hi.join(",")}))`;

  return (
    <div>
      <div onClick={undo} className="cursor-default">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 800, center: [-54, -15] }}
          width={800}
          height={520}
          style={{ width: "100%", height: "auto" }}
        >
          <ZoomableGroup center={view.center} zoom={view.zoom} minZoom={1} maxZoom={20} filterZoomEvent={() => false}>
            {geo && (
              <Geographies geography={geo}>
                {({ geographies }) =>
                  geographies.map((g) => {
                    const uf = g.properties.sigla as string;
                    const region = REGION_OF_UF[uf];
                    const inScope = !selectedRegion || region === selectedRegion;
                    const highlighted = selectedRegion
                      ? hover === uf && inScope
                      : hoverRegion != null && region === hoverRegion;
                    const baseFill = inScope ? fillFor(uf) : OUT_OF_SCOPE;
                    const handleClick = (e: React.MouseEvent) => {
                      e.stopPropagation();
                      if (!selectedRegion) onSelectRegion(region);
                      else if (inScope) onSelectUf(uf);
                    };
                    return (
                      <Geography
                        key={g.rsmKey}
                        geography={g}
                        onClick={handleClick}
                        onMouseEnter={() => setHover(uf)}
                        onMouseLeave={() => setHover((h) => (h === uf ? null : h))}
                        style={{
                          default: {
                            fill: baseFill,
                            stroke: highlighted ? "#FFFFFF" : "rgba(255,255,255,0.45)",
                            strokeWidth: highlighted ? 1.2 : 0.4,
                            outline: "none",
                          },
                          hover: {
                            fill: baseFill,
                            stroke: "#FFFFFF",
                            strokeWidth: 1.2,
                            outline: "none",
                            cursor: inScope ? "pointer" : "default",
                          },
                          pressed: { fill: baseFill, outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            )}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Legend only (no hover read-out) */}
      <div className="mt-2 flex items-center justify-center gap-2 text-xs text-white/70">
        {labels[0]}
        <i className="h-3 w-20 rounded" style={{ background: gradient }} />
        {labels[1]}
      </div>
    </div>
  );
}
