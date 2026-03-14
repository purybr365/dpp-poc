"use client";

import { useMemo, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/locale-context";

// Real geographic coordinates for Brazilian cities
const CITY_GEO: Record<string, { lat: number; lon: number; state: string }> = {
  "porto alegre": { lat: -30.03, lon: -51.23, state: "RS" },
  "alvorada": { lat: -29.99, lon: -51.08, state: "RS" },
  "lami": { lat: -30.18, lon: -51.08, state: "RS" },
  "caxias do sul": { lat: -29.17, lon: -51.18, state: "RS" },
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
  "belo horizonte": { lat: -19.92, lon: -43.94, state: "MG" },
  "contagem": { lat: -19.93, lon: -44.05, state: "MG" },
  "uberlândia": { lat: -18.92, lon: -48.28, state: "MG" },
  "juiz de fora": { lat: -21.76, lon: -43.35, state: "MG" },
  "curitiba": { lat: -25.43, lon: -49.27, state: "PR" },
  "londrina": { lat: -23.30, lon: -51.17, state: "PR" },
  "maringá": { lat: -23.42, lon: -51.94, state: "PR" },
  "joinville": { lat: -26.30, lon: -48.84, state: "SC" },
  "florianópolis": { lat: -27.59, lon: -48.55, state: "SC" },
  "manaus": { lat: -3.12, lon: -60.02, state: "AM" },
  "rio de janeiro": { lat: -22.91, lon: -43.17, state: "RJ" },
  "niterói": { lat: -22.88, lon: -43.10, state: "RJ" },
  "salvador": { lat: -12.97, lon: -38.51, state: "BA" },
  "recife": { lat: -8.05, lon: -34.87, state: "PE" },
  "fortaleza": { lat: -3.72, lon: -38.54, state: "CE" },
  "brasília": { lat: -15.79, lon: -47.88, state: "DF" },
  "goiânia": { lat: -16.69, lon: -49.26, state: "GO" },
  "belém": { lat: -1.46, lon: -48.50, state: "PA" },
  "cuiabá": { lat: -15.60, lon: -56.10, state: "MT" },
  "campo grande": { lat: -20.44, lon: -54.65, state: "MS" },
  "vitória": { lat: -20.32, lon: -40.34, state: "ES" },
};

const STATE_GEO: Record<string, { lat: number; lon: number }> = {
  RS: { lat: -30.03, lon: -51.23 }, SP: { lat: -23.55, lon: -46.63 },
  MG: { lat: -19.92, lon: -43.94 }, PR: { lat: -25.43, lon: -49.27 },
  SC: { lat: -27.59, lon: -48.55 }, AM: { lat: -3.12, lon: -60.02 },
  RJ: { lat: -22.91, lon: -43.17 }, BA: { lat: -12.97, lon: -38.51 },
  PE: { lat: -8.05, lon: -34.87 }, CE: { lat: -3.72, lon: -38.54 },
  DF: { lat: -15.79, lon: -47.88 }, GO: { lat: -16.69, lon: -49.26 },
  PA: { lat: -1.46, lon: -48.50 }, MT: { lat: -15.60, lon: -56.10 },
  MS: { lat: -20.44, lon: -54.65 }, ES: { lat: -20.32, lon: -40.34 },
  MA: { lat: -2.53, lon: -44.28 }, PI: { lat: -5.09, lon: -42.80 },
  RN: { lat: -5.79, lon: -35.21 }, PB: { lat: -7.12, lon: -34.86 },
  AL: { lat: -9.67, lon: -35.74 }, SE: { lat: -10.91, lon: -37.07 },
  TO: { lat: -10.18, lon: -48.33 }, RO: { lat: -8.76, lon: -63.90 },
  AC: { lat: -9.97, lon: -67.81 }, RR: { lat: 2.82, lon: -60.67 },
  AP: { lat: 0.03, lon: -51.07 },
};

function findCityGeo(location: string): { lat: number; lon: number; state: string } | null {
  const loc = location.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const [city, geo] of Object.entries(CITY_GEO)) {
    const normalizedCity = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (loc.includes(normalizedCity)) return geo;
  }
  const stateMatch = location.match(/\b([A-Z]{2})\b/);
  if (stateMatch) {
    const state = stateMatch[1].toUpperCase();
    if (STATE_GEO[state]) return { ...STATE_GEO[state], state };
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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  const plotted = useMemo(() => {
    return events
      .map((e) => {
        const geo = findCityGeo(e.location);
        if (!geo) return null;
        return { ...e, lat: geo.lat, lon: geo.lon, state: geo.state };
      })
      .filter(Boolean) as (EventLocation & { lat: number; lon: number; state: string })[];
  }, [events]);

  const usedTypes = useMemo(() => [...new Set(plotted.map((p) => p.type))], [plotted]);

  useEffect(() => {
    if (!mapRef.current || plotted.length === 0) return;
    // Prevent double-init
    if (mapInstanceRef.current) return;

    let cancelled = false;

    async function initMap() {
      const L = (await import("leaflet")).default;

      // Import leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (cancelled || !mapRef.current) return;

      // Compute bounds
      const lats = plotted.map((p) => p.lat);
      const lons = plotted.map((p) => p.lon);
      const bounds = L.latLngBounds(
        [Math.min(...lats) - 1, Math.min(...lons) - 1],
        [Math.max(...lats) + 1, Math.max(...lons) + 1]
      );

      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
        attributionControl: true,
      }).fitBounds(bounds, { padding: [30, 30] });

      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      // Draw dashed polyline connecting events in order
      if (plotted.length > 1) {
        const polylineCoords = plotted.map((p) => [p.lat, p.lon] as [number, number]);
        L.polyline(polylineCoords, {
          color: "#94a3b8",
          weight: 2,
          dashArray: "6 4",
          opacity: 0.7,
        }).addTo(map);
      }

      // Add circle markers with popups
      plotted.forEach((point, idx) => {
        const color = TYPE_COLORS[point.type];
        const typeLabel = TYPE_LABELS[point.type]?.[locale] || point.type;

        L.circleMarker([point.lat, point.lon], {
          radius: 9,
          fillColor: color,
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85,
        })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: sans-serif; min-width: 140px;">
              <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px; color: ${color};">
                ${idx + 1}. ${typeLabel}
              </div>
              <div style="font-size: 12px; color: #475569;">
                📍 ${point.location}
              </div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">
                ${point.label}
              </div>
            </div>`,
            { closeButton: false }
          );
      });

      // Force a resize after rendering
      setTimeout(() => map.invalidateSize(), 100);
    }

    initMap();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [plotted, locale]);

  if (plotted.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-sm text-slate-400">
          {t("map.noLocations")}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-slate-500">{t("map.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div
            ref={mapRef}
            className="w-full rounded-lg overflow-hidden border border-slate-200"
            style={{ height: 380 }}
          />

          {/* Legend */}
          <div className="flex gap-4 flex-wrap">
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
