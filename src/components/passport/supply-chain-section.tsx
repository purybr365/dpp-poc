"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/locale-context";
import type { TKey } from "@/lib/i18n/translations";

interface SupplyChainSectionProps {
  data: Record<string, unknown>;
  accessLevel: string;
}

export function SupplyChainSection({ data, accessLevel }: SupplyChainSectionProps) {
  const { t } = useLocale();
  const materials = data.mainMaterials as string[] | undefined;
  const keyComponents = data.keyComponents as Record<string, string> | undefined;
  const accessLabel = t(`access.${accessLevel}` as TKey) || accessLevel;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t("supply.title")}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {accessLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {!!data.totalWeight && (
            <div>
              <span className="text-xs text-slate-400 block">{t("supply.totalWeight")}</span>
              <span className="text-lg font-semibold">{String(data.totalWeight)} kg</span>
            </div>
          )}
          {!!data.countryOfOrigin && (
            <div>
              <span className="text-xs text-slate-400 block">{t("supply.countryOfOrigin")}</span>
              <span className="text-lg font-semibold">{String(data.countryOfOrigin)}</span>
            </div>
          )}
          {!!data.manufacturerLegalName && (
            <div>
              <span className="text-xs text-slate-400 block">{t("supply.legalName")}</span>
              <span className="text-sm">{String(data.manufacturerLegalName)}</span>
            </div>
          )}
        </div>

        {materials && materials.length > 0 && (
          <div>
            <span className="text-xs text-slate-400 block mb-2">{t("supply.mainMaterials")}</span>
            <div className="flex flex-wrap gap-2">
              {materials.map((m, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {m}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {keyComponents && accessLevel !== "summary" && (
          <div>
            <span className="text-xs text-slate-400 block mb-2">{t("supply.keyComponents")}</span>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(keyComponents).map(([key, val]) => (
                <div key={key} className="bg-slate-50 p-2 rounded text-sm">
                  <span className="text-slate-400 text-xs block capitalize">{key}</span>
                  <span>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
