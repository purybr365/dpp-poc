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

export function LifecycleTimeline({ currentStage }: LifecycleTimelineProps) {
  const { t, locale } = useLocale();
  const currentIndex = STAGE_ORDER.indexOf(currentStage as typeof STAGE_ORDER[number]);

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-stone-500 mb-4 tracking-wide uppercase">
        {t("lifecycle.title")}
      </h3>
      <div className="flex items-start overflow-x-auto pt-2 pb-2">
        {STAGE_ORDER.map((stage, idx) => {
          const stageInfo = LIFECYCLE_STAGES[stage];
          const isPast = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isFuture = idx > currentIndex;
          const stageLabel = t(`lifecycle.${stage}` as TKey);

          return (
            <div key={stage} className="flex items-start flex-shrink-0">
              <div className="flex flex-col items-center">
                {/* Circle indicator */}
                <div className="relative flex items-center justify-center">
                  {isCurrent && (
                    <div className="absolute w-6 h-6 rounded-full bg-teal-100 opacity-50" />
                  )}
                  <div
                    className={`relative w-3 h-3 rounded-full transition-all ${
                      isCurrent
                        ? "bg-teal-700 ring-2 ring-teal-200 ring-offset-2"
                        : isPast
                        ? "bg-teal-200"
                        : "border-2 border-stone-300 bg-white"
                    }`}
                  />
                </div>
                {/* Label */}
                <span
                  className={`text-[10px] mt-2 text-center w-16 leading-tight ${
                    isCurrent
                      ? "font-semibold text-teal-700"
                      : isPast
                      ? "text-stone-500"
                      : "text-stone-300"
                  }`}
                >
                  {stageLabel}
                </span>
              </div>
              {/* Connector line */}
              {idx < STAGE_ORDER.length - 1 && (
                <div
                  className={`w-8 h-px mt-1.5 mx-0.5 ${
                    idx < currentIndex ? "bg-teal-200" : "bg-stone-200"
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
