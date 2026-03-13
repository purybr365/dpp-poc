"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/locale-context";

// Brazil bounding box: lat ~5.3N to ~33.75S, lon ~-73.99W to ~-34.79W
// We project lat/long to SVG coordinates on a 600x600 canvas.
function geoToSvg(lat: number, lon: number): { x: number; y: number } {
  const minLon = -74;
  const maxLon = -34;
  const minLat = -34;
  const maxLat = 6;

  const x = ((lon - minLon) / (maxLon - minLon)) * 560 + 20;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 560 + 20;
  return { x, y };
}

// Real geographic coordinates for Brazilian cities
const CITY_GEO: Record<string, { lat: number; lon: number; state: string }> = {
  // RS
  "porto alegre": { lat: -30.03, lon: -51.23, state: "RS" },
  "alvorada": { lat: -29.99, lon: -51.08, state: "RS" },
  "lami": { lat: -30.18, lon: -51.08, state: "RS" },
  "caxias do sul": { lat: -29.17, lon: -51.18, state: "RS" },
  // SP
  "são paulo": { lat: -23.55, lon: -46.63, state: "SP" },
  "bragança paulista": { lat: -22.95, lon: -46.54, state: "SP" },
  "rio claro": { lat: -22.41, lon: -47.56, state: "SP" },
  "são carlos": { lat: -22.02, lon: -47.89, state: "SP" },
  "campinas": { lat: -22.91, lon: -47.06, state: "SP" },
  "osasco": { lat: -23.53, lon: -46.79, state: "SP" },
  "guarulhos": { lat: -23.46, lon: -46.53, state: "SP" },
  "sorocaba": { lat: -23.50, lon: -47.46, state: "SP" },
  "são bernardo do campo": { lat: -23.69, lon: -46.56, state: "SP" },
  "santo andré": { lat: -23.66, lon: -46.54, state: "SP" },
  "são josé dos campos": { lat: -23.18, lon: -45.88, state: "SP" },
  "ribeirão preto": { lat: -21.18, lon: -47.81, state: "SP" },
  // MG
  "belo horizonte": { lat: -19.92, lon: -43.94, state: "MG" },
  "contagem": { lat: -19.93, lon: -44.05, state: "MG" },
  "uberlândia": { lat: -18.92, lon: -48.28, state: "MG" },
  "juiz de fora": { lat: -21.76, lon: -43.35, state: "MG" },
  // PR
  "curitiba": { lat: -25.43, lon: -49.27, state: "PR" },
  "londrina": { lat: -23.30, lon: -51.17, state: "PR" },
  "maringá": { lat: -23.42, lon: -51.94, state: "PR" },
  // SC
  "joinville": { lat: -26.30, lon: -48.84, state: "SC" },
  "florianópolis": { lat: -27.59, lon: -48.55, state: "SC" },
  // AM
  "manaus": { lat: -3.12, lon: -60.02, state: "AM" },
  // RJ
  "rio de janeiro": { lat: -22.91, lon: -43.17, state: "RJ" },
  "niterói": { lat: -22.88, lon: -43.10, state: "RJ" },
  // BA
  "salvador": { lat: -12.97, lon: -38.51, state: "BA" },
  // PE
  "recife": { lat: -8.05, lon: -34.87, state: "PE" },
  // CE
  "fortaleza": { lat: -3.72, lon: -38.54, state: "CE" },
  // DF
  "brasília": { lat: -15.79, lon: -47.88, state: "DF" },
  // GO
  "goiânia": { lat: -16.69, lon: -49.26, state: "GO" },
  // PA
  "belém": { lat: -1.46, lon: -48.50, state: "PA" },
  // MT
  "cuiabá": { lat: -15.60, lon: -56.10, state: "MT" },
  // MS
  "campo grande": { lat: -20.44, lon: -54.65, state: "MS" },
  // ES
  "vitória": { lat: -20.32, lon: -40.34, state: "ES" },
};

// State-level fallback
const STATE_GEO: Record<string, { lat: number; lon: number }> = {
  RS: { lat: -30.03, lon: -51.23 },
  SP: { lat: -23.55, lon: -46.63 },
  MG: { lat: -19.92, lon: -43.94 },
  PR: { lat: -25.43, lon: -49.27 },
  SC: { lat: -27.59, lon: -48.55 },
  AM: { lat: -3.12, lon: -60.02 },
  RJ: { lat: -22.91, lon: -43.17 },
  BA: { lat: -12.97, lon: -38.51 },
  PE: { lat: -8.05, lon: -34.87 },
  CE: { lat: -3.72, lon: -38.54 },
  DF: { lat: -15.79, lon: -47.88 },
  GO: { lat: -16.69, lon: -49.26 },
  PA: { lat: -1.46, lon: -48.50 },
  MT: { lat: -15.60, lon: -56.10 },
  MS: { lat: -20.44, lon: -54.65 },
  ES: { lat: -20.32, lon: -40.34 },
  MA: { lat: -2.53, lon: -44.28 },
  PI: { lat: -5.09, lon: -42.80 },
  RN: { lat: -5.79, lon: -35.21 },
  PB: { lat: -7.12, lon: -34.86 },
  AL: { lat: -9.67, lon: -35.74 },
  SE: { lat: -10.91, lon: -37.07 },
  TO: { lat: -10.18, lon: -48.33 },
  RO: { lat: -8.76, lon: -63.90 },
  AC: { lat: -9.97, lon: -67.81 },
  RR: { lat: 2.82, lon: -60.67 },
  AP: { lat: 0.03, lon: -51.07 },
};

function findCityCoords(location: string): { x: number; y: number; state: string } | null {
  const loc = location.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Try exact city match
  for (const [city, geo] of Object.entries(CITY_GEO)) {
    const normalizedCity = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (loc.includes(normalizedCity)) {
      const svg = geoToSvg(geo.lat, geo.lon);
      return { ...svg, state: geo.state };
    }
  }
  // Try state abbreviation
  const stateMatch = location.match(/\b([A-Z]{2})\b/);
  if (stateMatch) {
    const state = stateMatch[1].toUpperCase();
    if (STATE_GEO[state]) {
      const svg = geoToSvg(STATE_GEO[state].lat, STATE_GEO[state].lon);
      return { ...svg, state };
    }
  }
  return null;
}

interface EventLocation {
  label: string;
  location: string;
  type: "manufacture" | "sale" | "repair" | "collection" | "recycling";
}

interface EventsMapProps {
  events: EventLocation[];
}

const TYPE_COLORS: Record<string, string> = {
  manufacture: "#3b82f6",
  sale: "#8b5cf6",
  repair: "#f97316",
  collection: "#10b981",
  recycling: "#06b6d4",
};

const TYPE_LABELS: Record<string, Record<string, string>> = {
  manufacture: { "pt-BR": "Fabricação", en: "Manufacturing", es: "Fabricación" },
  sale: { "pt-BR": "Venda", en: "Sale", es: "Venta" },
  repair: { "pt-BR": "Reparo", en: "Repair", es: "Reparación" },
  collection: { "pt-BR": "Coleta", en: "Collection", es: "Recolección" },
  recycling: { "pt-BR": "Reciclagem", en: "Recycling", es: "Reciclaje" },
};

// Simplified but recognizable Brazil outline path using our geoToSvg projection
const BRAZIL_PATH = (() => {
  const points: [number, number][] = [
    // Northern coast (east to west)
    [-1.0, -50.0], [0.0, -50.5], [1.5, -50.0], [2.0, -51.0],
    [4.3, -51.6], [4.4, -52.5], [3.8, -54.0], [2.1, -56.0],
    [1.8, -56.5], [2.5, -58.0], [3.6, -59.8], [5.2, -60.5],
    [4.0, -62.0], [2.2, -64.0], [1.0, -66.0], [0.0, -67.5],
    [-1.0, -68.0], [-3.0, -68.5], [-5.0, -70.0],
    // Western border
    [-7.5, -73.5], [-10.0, -72.0], [-11.0, -70.0],
    [-13.0, -69.5], [-14.0, -68.5], [-15.0, -69.0],
    [-17.0, -68.5], [-18.5, -67.5], [-20.0, -66.0],
    [-22.0, -65.0], [-23.0, -64.5], [-24.5, -61.0],
    // Southern border
    [-26.0, -58.5], [-27.0, -56.0], [-28.5, -54.5],
    [-29.0, -53.5], [-30.0, -53.0], [-31.5, -52.5],
    [-33.0, -52.5], [-33.7, -53.3],
    // Atlantic coast going north
    [-33.0, -52.0], [-31.5, -51.5], [-30.5, -50.5],
    [-29.5, -49.8], [-28.8, -49.2], [-27.5, -48.5],
    [-26.5, -48.5], [-25.5, -48.1], [-25.2, -48.0],
    [-24.5, -47.5], [-23.8, -46.4], [-23.0, -45.0],
    [-22.9, -43.2], [-22.5, -41.8], [-21.0, -41.0],
    [-20.0, -40.2], [-18.5, -39.7], [-17.5, -39.2],
    [-16.0, -39.0], [-15.0, -39.0], [-13.5, -38.9],
    [-12.5, -38.3], [-10.5, -36.5], [-9.0, -35.2],
    [-7.5, -34.8], [-6.0, -35.0], [-5.0, -36.0],
    [-4.0, -37.5], [-2.5, -40.0], [-1.5, -44.0],
    [-1.0, -46.0], [-0.5, -47.5], [-0.5, -48.5],
    [-1.0, -50.0], // close
  ];
  const svgPoints = points.map(([lat, lon]) => geoToSvg(lat, lon));
  return "M" + svgPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L") + " Z";
})();

export function EventsMap({ events }: EventsMapProps) {
  const { t, locale } = useLocale();

  const plotted = useMemo(() => {
    return events
      .map((e) => {
        const coords = findCityCoords(e.location);
        if (!coords) return null;
        return { ...e, ...coords };
      })
      .filter(Boolean) as (EventLocation & { x: number; y: number; state: string })[];
  }, [events]);

  if (plotted.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-sm text-slate-400">
          {t("map.noLocations")}
        </CardContent>
      </Card>
    );
  }

  const usedTypes = [...new Set(plotted.map((p) => p.type))];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-slate-500">{t("map.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <svg viewBox="0 0 600 600" className="w-full md:w-2/3 h-auto max-h-[450px]">
            {/* Brazil outline */}
            <path
              d={BRAZIL_PATH}
              fill="#f1f5f9"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* Connection lines between sequential events */}
            {plotted.length > 1 &&
              plotted.slice(1).map((point, idx) => {
                const prev = plotted[idx];
                return (
                  <line
                    key={`line-${idx}`}
                    x1={prev.x}
                    y1={prev.y}
                    x2={point.x}
                    y2={point.y}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeDasharray="4 3"
                  />
                );
              })}

            {/* Event dots */}
            {plotted.map((point, idx) => (
              <g key={idx}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="10"
                  fill={TYPE_COLORS[point.type]}
                  opacity="0.15"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill={TYPE_COLORS[point.type]}
                  stroke="white"
                  strokeWidth="1.5"
                />
                <text
                  x={point.x + 9}
                  y={point.y + 4}
                  fontSize="9"
                  fill="#475569"
                  fontFamily="sans-serif"
                  fontWeight="500"
                >
                  {point.location.split(",")[0]}
                </text>
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div className="flex md:flex-col gap-2 flex-wrap">
            {usedTypes.map((type) => (
              <div key={type} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: TYPE_COLORS[type] }}
                />
                <span className="text-xs text-slate-600">
                  {TYPE_LABELS[type]?.[locale] || type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
