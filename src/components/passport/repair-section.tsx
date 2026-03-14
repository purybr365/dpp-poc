"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/locale-context";
import type { TKey } from "@/lib/i18n/translations";

const POST_REPAIR_STATUS_KEYS: Record<string, TKey> = {
  passed: "condition.passed",
  needs_followup: "condition.needsFollowup",
  failed: "condition.failed",
};

interface RepairSectionProps {
  events: Array<Record<string, unknown>>;
}

export function RepairSection({ events }: RepairSectionProps) {
  const { t, locale } = useLocale();

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("repair.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400">{t("repair.noRecords")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t("repair.title")}</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {events.length} {events.length > 1 ? t("repair.records") : t("repair.record")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, idx) => {
            const parts = event.partsReplaced as Array<{ name: string; cost: number }> | null;
            const date = event.date
              ? new Date(event.date as string).toLocaleDateString(locale === "en" ? "en-US" : locale === "es" ? "es" : "pt-BR")
              : "N/A";

            const statusKey = POST_REPAIR_STATUS_KEYS[event.postRepairStatus as string];

            return (
              <div
                key={idx}
                className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔧</span>
                    <div>
                      <p className="font-medium text-sm">{String(event.issueDescription)}</p>
                      <p className="text-xs text-slate-400">{date}</p>
                    </div>
                  </div>
                  {!!event.totalCost && (
                    <span className="text-sm font-semibold text-slate-700">
                      R$ {Number(event.totalCost).toFixed(2)}
                    </span>
                  )}
                </div>

                {!!event.postRepairStatus && (
                  <Badge
                    className={`text-xs ${
                      event.postRepairStatus === "passed"
                        ? "bg-green-100 text-green-700"
                        : event.postRepairStatus === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {statusKey ? t(statusKey) : String(event.postRepairStatus)}
                  </Badge>
                )}

                {parts && parts.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-slate-400">{t("repair.partsReplaced")}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {parts.map((part, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {part.name}
                          {part.cost ? ` (R$ ${part.cost.toFixed(2)})` : ""}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {!!event.notes && (
                  <p className="text-xs text-slate-500 mt-2 italic">{String(event.notes)}</p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
