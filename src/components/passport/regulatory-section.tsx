"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/locale-context";

interface RegulatorySectionProps {
  data: Record<string, unknown>;
}

export function RegulatorySection({ data }: RegulatorySectionProps) {
  const { t } = useLocale();
  const euAlignment = data.euAlignment as Record<string, unknown> | undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("regulatory.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!!data.inmetroStatus && (
          <div className="bg-slate-50 p-3 rounded-lg w-fit">
            <span className="text-xs text-slate-400 block">INMETRO</span>
            <Badge
              className={`mt-1 ${
                data.inmetroStatus === "Válido" || data.inmetroStatus === "Aprovado"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {String(data.inmetroStatus)}
            </Badge>
          </div>
        )}

        {/* EU ESPR Alignment */}
        {euAlignment && (
          <div>
            <span className="text-xs text-slate-400 block mb-2">
              {t("regulatory.euAlignment")}
            </span>
            <div className="border rounded-lg p-4 space-y-3">
              {euAlignment.esprReadinessScore != null && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{t("regulatory.esprReadiness")}</span>
                    <span className="font-semibold">{String(euAlignment.esprReadinessScore)}%</span>
                  </div>
                  <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        Number(euAlignment.esprReadinessScore) >= 80
                          ? "bg-green-500"
                          : Number(euAlignment.esprReadinessScore) >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${Number(euAlignment.esprReadinessScore)}%` }}
                    />
                  </div>
                </div>
              )}
              {euAlignment.rohsCompliance != null && (
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      euAlignment.rohsCompliance
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    RoHS {euAlignment.rohsCompliance ? t("regulatory.rohsCompliant") : t("regulatory.rohsNonCompliant")}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
