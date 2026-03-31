"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-context";
import type { TKey } from "@/lib/i18n/translations";
import { EventsMap } from "./events-map";

interface OwnershipSectionProps {
  events: Array<Record<string, unknown>>;
  manufacturingFacility?: string;
  repairEvents?: Array<Record<string, unknown>>;
  endOfLifeRecords?: Array<Record<string, unknown>>;
}

// Dot color mapping by event type
const EVENT_DOT_COLORS: Record<string, string> = {
  MANUFACTURED: "bg-teal-700",
  SOLD_TO_RETAILER: "bg-teal-500",
  SOLD_TO_CONSUMER: "bg-teal-400",
  REGISTERED: "bg-teal-300",
  RESOLD: "bg-teal-500",
  SECOND_HAND_RESALE: "bg-teal-400",
  DONATED: "bg-teal-300",
  COLLECTED_FOR_RECYCLING: "bg-teal-600",
};

// Left border color mapping by event type
const EVENT_BORDER_COLORS: Record<string, string> = {
  MANUFACTURED: "border-l-teal-700",
  SOLD_TO_RETAILER: "border-l-teal-500",
  SOLD_TO_CONSUMER: "border-l-teal-400",
  REGISTERED: "border-l-teal-300",
  RESOLD: "border-l-teal-500",
  SECOND_HAND_RESALE: "border-l-teal-400",
  DONATED: "border-l-teal-300",
  COLLECTED_FOR_RECYCLING: "border-l-teal-600",
};

// Service center locations for repairs that don't have explicit locations
const SERVICE_CENTER_LOCATIONS: Record<string, string> = {
  "Brastemp Assistência Técnica - São Paulo": "São Paulo, SP",
  "Consul Service Center - Curitiba": "Curitiba, PR",
  "Electrolux Service - Rio de Janeiro": "Rio de Janeiro, RJ",
  "Samsung Serviço Autorizado - Manaus": "Manaus, AM",
  "TechFix Assistência - Belo Horizonte": "Belo Horizonte, MG",
  "RepairPro - Porto Alegre": "Porto Alegre, RS",
};

export function OwnershipSection({ events, manufacturingFacility, repairEvents, endOfLifeRecords }: OwnershipSectionProps) {
  const { t, locale } = useLocale();
  const [showMap, setShowMap] = useState(false);

  // Build map events from ownership data
  const ownershipMapEvents = events
    .map((event) => {
      const eventType = String(event.eventType);
      const saleLocation = event.saleLocation as string | undefined;
      const date = event.date as string | undefined;

      if (eventType === "MANUFACTURED" && manufacturingFacility) {
        return { label: t("ownershipEvent.MANUFACTURED"), location: manufacturingFacility, type: "manufacture" as const, date };
      }
      if ((eventType === "SOLD_TO_RETAILER" || eventType === "SOLD_TO_CONSUMER") && saleLocation) {
        return { label: t(`ownershipEvent.${eventType}` as TKey), location: saleLocation, type: "sale" as const, date };
      }
      if (eventType === "REGISTERED" && saleLocation) {
        return { label: t(`ownershipEvent.REGISTERED` as TKey), location: saleLocation, type: "registered" as const, date };
      }
      if (eventType === "SECOND_HAND_RESALE" && saleLocation) {
        return { label: t(`ownershipEvent.SECOND_HAND_RESALE` as TKey), location: saleLocation, type: "resale" as const, date };
      }
      if (eventType === "COLLECTED_FOR_RECYCLING") {
        const toEntity = event.toEntity as string | undefined;
        // Use a default recycler location
        const recyclerLocations: Record<string, string> = {
          "JG-SUSTENTARE": "Alvorada, RS",
          "WK Solutions": "São Paulo, SP",
          "Greentech": "Belo Horizonte, MG",
        };
        const location = toEntity ? (recyclerLocations[toEntity] || "São Paulo, SP") : "São Paulo, SP";
        return { label: t("ownershipEvent.COLLECTED_FOR_RECYCLING"), location, type: "collection" as const, date };
      }
      return null;
    })
    .filter(Boolean) as { label: string; location: string; type: "manufacture" | "sale" | "registered" | "resale" | "repair" | "collection" | "recycling"; date?: string }[];

  // Build map events from repair events
  const repairMapEvents = (repairEvents || []).map((re) => {
    const serviceCenterId = re.serviceCenterId as string | undefined;
    const date = re.date as string | undefined;
    const issue = re.issueDescription as string || "";

    // Try to find a location from the service center name
    let location = "São Paulo, SP"; // default
    for (const [name, loc] of Object.entries(SERVICE_CENTER_LOCATIONS)) {
      if (serviceCenterId && name.includes(serviceCenterId)) {
        location = loc;
        break;
      }
    }
    // Assign varied locations for repairs based on hash of service center ID
    if (serviceCenterId) {
      const hash = serviceCenterId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      const cities = ["São Paulo, SP", "Curitiba, PR", "Rio de Janeiro, RJ", "Belo Horizonte, MG", "Porto Alegre, RS", "Manaus, AM"];
      location = cities[hash % cities.length];
    }

    const issueKey = `repairIssue.${issue}` as TKey;
    const translatedIssue = t(issueKey);
    const label = `${t("repair.title")}: ${translatedIssue === issueKey ? issue : translatedIssue}`;

    return { label, location, type: "repair" as const, date };
  });

  // Build map events from EOL records
  const eolMapEvents = (endOfLifeRecords || []).flatMap((eol) => {
    const evts: { label: string; location: string; type: "collection" | "recycling"; date?: string }[] = [];

    const collectionLocation = eol.collectionLocation as string | undefined;
    const processingLocation = eol.processingLocation as string | undefined;
    const collectionDate = eol.collectionDate as string | undefined;
    const processingDate = eol.processingDate as string | undefined;
    const recyclerName = eol.recyclerName as string || "";
    const recyclerCity = eol.recyclerCity as string || "";

    // Collection event
    if (collectionLocation || recyclerCity) {
      evts.push({
        label: `${t("eol.collection")}: ${recyclerName}`,
        location: collectionLocation || recyclerCity || "São Paulo, SP",
        type: "collection",
        date: collectionDate,
      });
    }

    // Recycling/processing event
    if (processingLocation || recyclerCity) {
      evts.push({
        label: `${t("eol.processing")}: ${recyclerName}`,
        location: processingLocation || recyclerCity || "São Paulo, SP",
        type: "recycling",
        date: processingDate,
      });
    }

    return evts;
  });

  // Combine all events sorted by date
  const mapEvents = [...ownershipMapEvents, ...repairMapEvents, ...eolMapEvents].sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }) as { label: string; location: string; type: "manufacture" | "sale" | "registered" | "resale" | "repair" | "collection" | "recycling" }[];

  if (events.length === 0) {
    return (
      <Card className="border border-stone-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-stone-800">{t("ownership.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-stone-400">{t("ownership.noEvents")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border border-stone-200 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-stone-800">{t("ownership.title")}</CardTitle>
            {mapEvents.length > 0 && (
              <button
                onClick={() => setShowMap(!showMap)}
                className="text-xs font-medium text-teal-700 hover:text-teal-800 transition-colors"
              >
                {showMap ? t("ownership.hideMap") : t("ownership.viewMap")}
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-stone-200" />

            <div className="space-y-3">
              {events.map((event, idx) => {
                const eventType = String(event.eventType);
                const dateStr = event.date
                  ? new Date(event.date as string).toLocaleDateString(
                      locale === "en" ? "en-US" : locale === "es" ? "es-ES" : "pt-BR"
                    )
                  : "N/A";

                const dotColor = EVENT_DOT_COLORS[eventType] || "bg-stone-400";
                const borderColor = EVENT_BORDER_COLORS[eventType] || "border-l-stone-300";

                return (
                  <div key={idx} className="relative flex gap-3 items-start">
                    {/* Dot */}
                    <div className="relative z-10 flex-shrink-0 mt-3">
                      <div className={`w-[14px] h-[14px] rounded-full border-2 border-white ${dotColor}`} />
                    </div>
                    {/* Event card */}
                    <div className={`flex-1 bg-stone-50 rounded-md p-3 border-l-2 ${borderColor}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-stone-700">
                          {t(`ownershipEvent.${eventType}` as TKey) || eventType}
                        </span>
                        <span className="text-xs text-stone-400 tabular-nums">{dateStr}</span>
                      </div>
                      <div className="text-xs text-stone-500 mt-1.5 space-y-0.5">
                        {!!event.fromEntity && (
                          <p>{t("ownership.from")}: {String(event.fromEntity)}</p>
                        )}
                        {!!event.toEntity && (
                          <p>{t("ownership.to")}: {String(event.toEntity)}</p>
                        )}
                        {!!event.consumerIdHash && (
                          <p>
                            {t("ownership.consumerId")}:{" "}
                            <span className="font-mono text-stone-400">{String(event.consumerIdHash)}</span>
                            <span className="text-stone-300 ml-1">{t("ownership.lgpdHash")}</span>
                          </p>
                        )}
                        {!!event.retailerName && (
                          <p>{t("ownership.retailer")}: {String(event.retailerName)}</p>
                        )}
                        {!!event.saleLocation && (
                          <p>
                            {t("ownership.saleLocation")}: {String(event.saleLocation)}
                          </p>
                        )}
                        {!!event.price && (
                          <p>
                            {t("ownership.price")}: {String(event.currency || "BRL")} {Number(event.price).toLocaleString(locale === "en" ? "en-US" : locale === "es" ? "es-ES" : "pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {showMap && <EventsMap events={mapEvents} />}
    </div>
  );
}
