"use client";

import { LIFECYCLE_STAGES } from "@/lib/constants";
import { useLocale } from "@/lib/i18n/locale-context";
import type { TKey } from "@/lib/i18n/translations";

interface LifecycleTimelineProps {
  currentStage: string;
}

const STAGE_ORDER = [
  "MANUFACTURED",
  "IN_TRANSIT",
  "SOLD",
  "IN_USE",
  "UNDER_REPAIR",
  "RESOLD",
  "COLLECTED",
  "RECYCLED",
] as const;

const STAGE_ICONS: Record<string, string> = {
  MANUFACTURED: "🏭",
  IN_TRANSIT: "🚛",
  SOLD: "🏬",
  IN_USE: "🏠",
  UNDER_REPAIR: "🔧",
  RESOLD: "🔄",
  COLLECTED: "📦",
  RECYCLED: "♻️",
};

export function LifecycleTimeline({ currentStage }: LifecycleTimelineProps) {
  const { t, locale } = useLocale();
  const currentIndex = STAGE_ORDER.indexOf(currentStage as typeof STAGE_ORDER[number]);

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-slate-600 mb-3">{t("lifecycle.title")}</h3>
      <div className="flex items-center overflow-x-auto pb-2 gap-0">
        {STAGE_ORDER.map((stage, idx) => {
          const stageInfo = LIFECYCLE_STAGES[stage];
          const isPast = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const stageLabel = t(`lifecycle.${stage}` as TKey);

          return (
            <div key={stage} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                    isCurrent
                      ? "bg-slate-900 text-white ring-4 ring-slate-300 scale-110"
                      : isPast
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {STAGE_ICONS[stage]}
                </div>
                <span
                  className={`text-xs mt-1 text-center w-16 leading-tight ${
                    isCurrent ? "font-bold text-slate-900" : isPast ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  {stageLabel}
                </span>
              </div>
              {idx < STAGE_ORDER.length - 1 && (
                <div
                  className={`w-6 h-0.5 mx-0.5 mt-[-16px] ${
                    idx < currentIndex ? "bg-emerald-300" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
