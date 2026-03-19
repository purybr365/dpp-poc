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
}

const EVENT_ICONS: Record<string, string> = {
  MANUFACTURED: "🏭",
  SOLD_TO_RETAILER: "🏬",
  SOLD_TO_CONSUMER: "🛒",
  REGISTERED: "📝",
  RESOLD: "🔄",
  SECOND_HAND_RESALE: "🤝",
  DONATED: "🎁",
  COLLECTED_FOR_RECYCLING: "♻️",
};

export function OwnershipSection({ events, manufacturingFacility }: OwnershipSectionProps) {
  const { t, locale } = useLocale();
  const [showMap, setShowMap] = useState(false);

  // Build map events from ownership data
  const mapEvents = events
    .map((event) => {
      const eventType = String(event.eventType);
      const saleLocation = event.saleLocation as string | undefined;
      const retailerName = event.retailerName as string | undefined;

      if (eventType === "MANUFACTURED" && manufacturingFacility) {
        return { label: t("ownershipEvent.MANUFACTURED"), location: manufacturingFacility, type: "manufacture" as const };
      }
      if ((eventType === "SOLD_TO_RETAILER" || eventType === "SOLD_TO_CONSUMER") && saleLocation) {
        return { label: t(`ownershipEvent.${eventType}` as TKey), location: saleLocation, type: "sale" as const };
      }
      if (eventType === "REGISTERED" && saleLocation) {
        return { label: t(`ownershipEvent.REGISTERED` as TKey), location: saleLocation, type: "sale" as const };
      }
      if (eventType === "SECOND_HAND_RESALE" && saleLocation) {
        return { label: t(`ownershipEvent.SECOND_HAND_RESALE` as TKey), location: saleLocation, type: "sale" as const };
      }
      if (eventType === "COLLECTED_FOR_RECYCLING") {
        const toEntity = event.toEntity as string | undefined;
        if (toEntity) {
          return { label: t("ownershipEvent.COLLECTED_FOR_RECYCLING"), location: toEntity, type: "collection" as const };
        }
      }
      return null;
    })
    .filter(Boolean) as { label: string; location: string; type: "manufacture" | "sale" | "repair" | "collection" | "recycling" }[];

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("ownership.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400">{t("ownership.noEvents")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{t("ownership.title")}</CardTitle>
            {mapEvents.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMap(!showMap)}
                className="text-xs"
              >
                🗺️ {showMap ? t("ownership.hideMap") : t("ownership.viewMap")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />

            <div className="space-y-4">
              {events.map((event, idx) => {
                const eventType = String(event.eventType);
                const dateStr = event.date
                  ? new Date(event.date as string).toLocaleDateString(
                      locale === "en" ? "en-US" : locale === "es" ? "es-ES" : "pt-BR"
                    )
                  : "N/A";

                return (
                  <div key={idx} className="relative flex gap-4 items-start pl-2">
                    <div className="relative z-10 w-7 h-7 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-sm flex-shrink-0">
                      {EVENT_ICONS[eventType] || "📋"}
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-lg p-3 -mt-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {t(`ownershipEvent.${eventType}` as TKey) || eventType}
                        </span>
                        <span className="text-xs text-slate-400">{dateStr}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                        {!!event.fromEntity && (
                          <p>{t("ownership.from")}: {String(event.fromEntity)}</p>
                        )}
                        {!!event.toEntity && (
                          <p>{t("ownership.to")}: {String(event.toEntity)}</p>
                        )}
                        {!!event.consumerIdHash && (
                          <p>
                            {t("ownership.consumerId")}:{" "}
                            <span className="font-mono">{String(event.consumerIdHash)}</span>
                            <span className="text-slate-300 ml-1">{t("ownership.lgpdHash")}</span>
                          </p>
                        )}
                        {!!event.retailerName && (
                          <p>{t("ownership.retailer")}: {String(event.retailerName)}</p>
                        )}
                        {!!event.saleLocation && (
                          <p>
                            📍 {t("ownership.saleLocation")}: {String(event.saleLocation)}
                          </p>
                        )}
                        {!!event.price && (
                          <p>
                            💰 {t("ownership.price")}: {String(event.currency || "BRL")} {Number(event.price).toLocaleString(locale === "en" ? "en-US" : locale === "es" ? "es-ES" : "pt-BR", { minimumFractionDigits: 2 })}
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
