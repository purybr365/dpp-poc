"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/locale-context";
import type { TKey } from "@/lib/i18n/translations";

interface EnvironmentalSectionProps {
  data: Record<string, unknown>;
  accessLevel: string;
}

const ENERGY_CLASS_COLORS: Record<string, string> = {
  A: "bg-green-500",
  B: "bg-lime-500",
  C: "bg-yellow-500",
  D: "bg-orange-400",
  E: "bg-orange-500",
  F: "bg-red-400",
  G: "bg-red-600",
};

const HAZARDOUS_LABELS: Record<string, Record<string, string>> = {
  refrigerantGas: { "pt-BR": "Gás Refrigerante", en: "Refrigerant Gas", es: "Gas Refrigerante" },
  flameRetardants: { "pt-BR": "Retardantes de Chama", en: "Flame Retardants", es: "Retardantes de Llama" },
  mercury: { "pt-BR": "Mercúrio", en: "Mercury", es: "Mercurio" },
  leadInSolder: { "pt-BR": "Chumbo na Solda", en: "Lead in Solder", es: "Plomo en Soldadura" },
  rohsCompliance: { "pt-BR": "Conformidade RoHS", en: "RoHS Compliance", es: "Conformidad RoHS" },
  enamelCoating: { "pt-BR": "Revestimento Esmaltado", en: "Enamel Coating", es: "Recubrimiento Esmaltado" },
  magnetronBeryllium: { "pt-BR": "Berílio do Magnetron", en: "Magnetron Beryllium", es: "Berilio del Magnetrón" },
};

const REFRIGERANT_LABELS: Record<string, Record<string, string>> = {
  type: { "pt-BR": "Tipo", en: "Type", es: "Tipo" },
  gwp: { "pt-BR": "GWP", en: "GWP", es: "GWP" },
  odp: { "pt-BR": "ODP", en: "ODP", es: "ODP" },
  charge: { "pt-BR": "Carga", en: "Charge", es: "Carga" },
};

const COMPLIANT_LABELS: Record<string, string> = {
  "pt-BR": "Conforme",
  en: "Compliant",
  es: "Conforme",
};

const NON_COMPLIANT_LABELS: Record<string, string> = {
  "pt-BR": "Não Conforme",
  en: "Non-Compliant",
  es: "No Conforme",
};

export function EnvironmentalSection({ data, accessLevel }: EnvironmentalSectionProps) {
  const { t, locale } = useLocale();
  const energyClass = String(data.energyClass || "");
  const accessLabel = t(`access.${accessLevel}` as TKey) || accessLevel;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t("env.title")}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {accessLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Energy Rating Visual */}
        {energyClass && (
          <div>
            <span className="text-xs text-slate-400 block mb-2">{t("env.energyRating")}</span>
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                {["A", "B", "C", "D", "E", "F", "G"].map((cls) => (
                  <div
                    key={cls}
                    className={`flex items-center gap-1 ${cls === energyClass ? "scale-110" : "opacity-40"}`}
                  >
                    <div
                      className={`h-5 text-white text-xs font-bold flex items-center px-2 rounded-r ${ENERGY_CLASS_COLORS[cls]}`}
                      style={{ width: `${40 + ["A", "B", "C", "D", "E", "F", "G"].indexOf(cls) * 12}px` }}
                    >
                      {cls}
                    </div>
                    {cls === energyClass && (
                      <span className="text-sm font-bold ml-1">◄</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <span className="text-4xl font-bold text-slate-900">{energyClass}</span>
                <p className="text-xs text-slate-400">{t("env.procelLabel")}</p>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {!!data.energyConsumption && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="text-xs text-blue-400 block">{t("env.energyConsumption")}</span>
              <span className="text-lg font-semibold text-blue-700">
                {Number(data.energyConsumption).toFixed(0)} {String(data.energyUnit || "kWh/ano")}
              </span>
            </div>
          )}
          {!!data.carbonFootprint && (
            <div className="bg-emerald-50 p-3 rounded-lg">
              <span className="text-xs text-emerald-400 block">{t("env.carbonFootprint")}</span>
              <span className="text-lg font-semibold text-emerald-700">
                {Number(data.carbonFootprint).toFixed(0)} {String(data.carbonUnit || "kg CO2e")}
              </span>
            </div>
          )}
          {!!data.recyclabilityRate && (
            <div className="bg-green-50 p-3 rounded-lg">
              <span className="text-xs text-green-400 block">{t("env.recyclabilityRate")}</span>
              <span className="text-lg font-semibold text-green-700">
                {Number(data.recyclabilityRate).toFixed(0)}%
              </span>
            </div>
          )}
          {data.recycledContent != null && (
            <div className="bg-teal-50 p-3 rounded-lg">
              <span className="text-xs text-teal-400 block">{t("env.recycledContent")}</span>
              <span className="text-lg font-semibold text-teal-700">
                {Number(data.recycledContent).toFixed(0)}%
              </span>
            </div>
          )}
        </div>

        {/* Compliance Badges */}
        {!!(data.conamaCompliance || data.ibamaCompliance) && (
          <div>
            <span className="text-xs text-slate-400 block mb-2">{t("env.compliance")}</span>
            <div className="flex flex-wrap gap-2">
              {!!data.conamaCompliance && <Badge className="bg-green-100 text-green-700">CONAMA</Badge>}
              {!!data.ibamaCompliance && <Badge className="bg-green-100 text-green-700">IBAMA</Badge>}
            </div>
          </div>
        )}

        {/* Hazardous Substances — Structured */}
        {!!data.hazardousSubstances && (
          <HazardousSubstancesDisplay data={data.hazardousSubstances as Record<string, unknown>} locale={locale} />
        )}
      </CardContent>
    </Card>
  );
}

function HazardousSubstancesDisplay({ data, locale }: { data: Record<string, unknown>; locale: string }) {
  const { t } = useLocale();

  return (
    <div>
      <span className="text-xs text-slate-400 block mb-2">{t("env.hazardousSubstances")}</span>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
        {Object.entries(data).map(([key, value]) => {
          const label = HAZARDOUS_LABELS[key]?.[locale] || HAZARDOUS_LABELS[key]?.["pt-BR"] || key;

          // RoHS compliance → badge
          if (key === "rohsCompliance") {
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-amber-800">{label}</span>
                <Badge
                  className={
                    value
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {value ? (COMPLIANT_LABELS[locale] || "Conforme") : (NON_COMPLIANT_LABELS[locale] || "Não Conforme")}
                </Badge>
              </div>
            );
          }

          // Refrigerant gas → nested sub-grid
          if (key === "refrigerantGas" && typeof value === "object" && value !== null) {
            const gas = value as Record<string, unknown>;
            return (
              <div key={key}>
                <span className="text-sm font-medium text-amber-800 block mb-2">{label}</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ml-2">
                  {Object.entries(gas).map(([gk, gv]) => (
                    <div key={gk} className="bg-white/60 p-2 rounded text-sm">
                      <span className="text-xs text-amber-500 block">
                        {REFRIGERANT_LABELS[gk]?.[locale] || REFRIGERANT_LABELS[gk]?.["pt-BR"] || gk}
                      </span>
                      <span className="font-medium text-amber-900">{String(gv)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // Simple key-value
          return (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-amber-800">{label}</span>
              <span className="text-sm font-medium text-amber-900">{String(value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
