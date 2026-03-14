"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/locale-context";
import type { TKey } from "@/lib/i18n/translations";
import { PhotoLightbox } from "./photo-lightbox";

const FUNCTIONAL_STATUS_KEYS: Record<string, TKey> = {
  "non-functional": "condition.nonFunctional",
  "partially-functional": "condition.partiallyFunctional",
  functional: "condition.functional",
};

const COSMETIC_CONDITION_KEYS: Record<string, TKey> = {
  poor: "condition.poor",
  fair: "condition.fair",
  good: "condition.good",
};

const CONDITION_FLAG_KEYS: Record<string, TKey> = {
  isRusted: "eol.conditionRusted",
  isDented: "eol.conditionDented",
  isYellowed: "eol.conditionYellowed",
  isBroken: "eol.conditionBroken",
  isDisassembled: "eol.conditionDisassembled",
  isCannibalized: "eol.conditionCannibalized",
};

interface EndOfLifeSectionProps {
  records: Array<Record<string, unknown>>;
}

export function EndOfLifeSection({ records }: EndOfLifeSectionProps) {
  const { t, locale } = useLocale();
  const dateFmt = locale === "en" ? "en-US" : locale === "es" ? "es" : "pt-BR";

  if (records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("eol.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400">
            {t("eol.noRecords")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record, idx) => {
        const photos = (record.photos as string[]) || [];
        const disassembly = record.disassemblyReport as Record<string, unknown> | null;
        const materialsExtracted = disassembly?.materialsExtracted as Record<string, string> | null;

        const conditionFlags = (
          ["isRusted", "isDented", "isYellowed", "isBroken", "isDisassembled", "isCannibalized"] as const
        )
          .filter((key) => record[key])
          .map((key) => t(CONDITION_FLAG_KEYS[key]));

        const collectionDate = record.collectionDate
          ? new Date(record.collectionDate as string).toLocaleDateString(dateFmt)
          : "N/A";
        const processingDate = record.processingDate
          ? new Date(record.processingDate as string).toLocaleDateString(dateFmt)
          : "N/A";

        const functionalKey = FUNCTIONAL_STATUS_KEYS[record.functionalStatus as string];
        const functionalLabel = functionalKey ? t(functionalKey) : String(record.functionalStatus);

        const cosmeticKey = COSMETIC_CONDITION_KEYS[record.cosmeticCondition as string];
        const cosmeticLabel = cosmeticKey ? t(cosmeticKey) : String(record.cosmeticCondition);

        return (
          <Card key={idx}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    ♻️ {String(record.recyclerName)}
                  </CardTitle>
                  <p className="text-sm text-slate-400">{String(record.recyclerCity)}</p>
                </div>
                <div className="flex gap-2">
                  {!!record.isRealData && (
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      {t("eol.realData")}
                    </Badge>
                  )}
                  {!!record.certificateNumber && (
                    <Badge variant="outline" className="text-xs">
                      {String(record.certificateNumber)}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Dates & Location */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">{t("eol.collection")}</span>
                  <span>{collectionDate}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">{t("eol.collectionLocation")}</span>
                  <span>{String(record.collectionLocation)}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">{t("eol.processing")}</span>
                  <span>{processingDate}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">{t("eol.processingLocation")}</span>
                  <span>{String(record.processingLocation)}</span>
                </div>
              </div>

              {/* Condition */}
              <div>
                <span className="text-xs text-slate-400 block mb-2">{t("eol.condition")}</span>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {t("eol.functional")} {functionalLabel}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {t("eol.cosmetic")} {cosmeticLabel}
                  </Badge>
                  {conditionFlags.map((flag, i) => (
                    <Badge key={i} className="bg-amber-100 text-amber-700 text-xs">
                      {flag}
                    </Badge>
                  ))}
                </div>
                {!!record.otherConditionNotes && (
                  <p className="text-xs text-slate-500 mt-1 italic">
                    {String(record.otherConditionNotes)}
                  </p>
                )}
              </div>

              {/* Recycling Rate */}
              {!!record.recyclingRate && (
                <div>
                  <span className="text-xs text-slate-400 block mb-1">{t("eol.recyclingRate")}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${Number(record.recyclingRate)}%` }}
                      />
                    </div>
                    <span className="font-semibold text-emerald-700">
                      {Number(record.recyclingRate).toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-300 italic mt-1 block">
                    {record.isRealData
                      ? t("eol.recyclingRateReal")
                      : t("eol.recyclingRateEstimate")}
                  </span>
                </div>
              )}

              {/* Materials Extracted */}
              {materialsExtracted && (
                <div>
                  <span className="text-xs text-slate-400 block mb-2">
                    {t("eol.materialsExtracted")}
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(materialsExtracted).map(([mat, qty]) => (
                      <div key={mat} className="bg-slate-50 p-2 rounded text-sm text-center">
                        <span className="text-slate-400 text-xs block capitalize">
                          {mat}
                        </span>
                        <span className="font-medium">{qty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Photos — Lightbox */}
              {photos.length > 0 && (
                <div>
                  <span className="text-xs text-slate-400 block mb-2">
                    {t("eol.photos")} ({photos.length})
                  </span>
                  <PhotoLightbox photos={photos} />
                </div>
              )}

              {/* Data Source */}
              {!!record.dataSource && (
                <p className="text-xs text-slate-300 italic">
                  {t("eol.source")} {String(record.dataSource)}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
