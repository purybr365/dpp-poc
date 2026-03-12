"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/locale-context";

// Approximate coordinates for Brazilian cities/states on a 600x550 SVG
const CITY_COORDS: Record<string, { x: number; y: number; state: string }> = {
  // RS
  "porto alegre": { x: 335, y: 440, state: "RS" },
  "alvorada": { x: 338, y: 438, state: "RS" },
  "lami": { x: 340, y: 442, state: "RS" },
  // SP
  "são paulo": { x: 310, y: 350, state: "SP" },
  "bragança paulista": { x: 305, y: 342, state: "SP" },
  "rio claro": { x: 295, y: 340, state: "SP" },
  "são carlos": { x: 290, y: 335, state: "SP" },
  // MG
  "belo horizonte": { x: 340, y: 300, state: "MG" },
  "contagem": { x: 335, y: 298, state: "MG" },
  // PR
  "curitiba": { x: 315, y: 390, state: "PR" },
  "joinville": { x: 325, y: 395, state: "SC" },
  // AM
  "manaus": { x: 170, y: 120, state: "AM" },
  // RJ
  "rio de janeiro": { x: 355, y: 345, state: "RJ" },
};

function findCityCoords(location: string): { x: number; y: number; state: string } | null {
  const loc = location.toLowerCase();
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (loc.includes(city)) return coords;
  }
  // Try state abbreviation
  const stateMatch = loc.match(/\b([A-Z]{2})\b/i);
  if (stateMatch) {
    const state = stateMatch[1].toUpperCase();
    const stateCoords: Record<string, { x: number; y: number }> = {
      RS: { x: 335, y: 440 },
      SP: { x: 310, y: 350 },
      MG: { x: 340, y: 300 },
      PR: { x: 315, y: 390 },
      SC: { x: 325, y: 400 },
      AM: { x: 170, y: 120 },
      RJ: { x: 355, y: 345 },
    };
    if (stateCoords[state]) return { ...stateCoords[state], state };
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
          <svg viewBox="60 40 480 480" className="w-full md:w-2/3 h-auto max-h-[400px]">
            {/* Simplified Brazil outline */}
            <path
              d="M180,80 L220,70 L280,75 L340,80 L380,90 L410,100 L430,120
                 L440,150 L435,180 L420,200 L415,230 L410,260 L400,290
                 L390,310 L380,330 L370,350 L365,370 L360,390 L350,410
                 L340,430 L330,445 L315,455 L300,458 L280,450 L260,435
                 L240,415 L225,400 L210,380 L195,360 L180,340 L165,320
                 L150,300 L140,280 L130,260 L120,240 L115,220 L110,200
                 L108,180 L110,160 L115,140 L125,120 L140,105 L155,90 Z"
              fill="#f1f5f9"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />

            {/* State borders (simplified) */}
            <line x1="250" y1="280" x2="380" y2="320" stroke="#e2e8f0" strokeWidth="0.5" />
            <line x1="280" y1="350" x2="380" y2="340" stroke="#e2e8f0" strokeWidth="0.5" />
            <line x1="300" y1="390" x2="360" y2="380" stroke="#e2e8f0" strokeWidth="0.5" />

            {/* Event dots */}
            {plotted.map((point, idx) => (
              <g key={idx}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="8"
                  fill={TYPE_COLORS[point.type]}
                  opacity="0.2"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill={TYPE_COLORS[point.type]}
                  stroke="white"
                  strokeWidth="1.5"
                />
                <text
                  x={point.x + 8}
                  y={point.y + 3}
                  fontSize="8"
                  fill="#64748b"
                  fontFamily="sans-serif"
                >
                  {point.state}
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
