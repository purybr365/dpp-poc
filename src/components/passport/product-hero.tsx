"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LIFECYCLE_STAGES } from "@/lib/constants";
import { useLocale } from "@/lib/i18n/locale-context";
import type { TKey } from "@/lib/i18n/translations";

interface ProductHeroProps {
  product: Record<string, unknown>;
  category?: { pt: string; en: string; icon: string };
  productId?: string;
  gtin?: string;
  serialNumber?: string;
}

export function ProductHero({ product, category, productId, gtin, serialNumber }: ProductHeroProps) {
  const { t, locale } = useLocale();
  const stage = LIFECYCLE_STAGES[product.lifecycleStage as keyof typeof LIFECYCLE_STAGES];
  const mfgDate = product.manufacturingDate
    ? new Date(product.manufacturingDate as string).toLocaleDateString(locale === "en" ? "en-US" : locale === "es" ? "es" : "pt-BR")
    : "N/A";

  const manufacturer = product.manufacturer as { name: string; organization: string } | null;

  const categoryLabel = category
    ? (locale === "en" ? category.en : category.pt)
    : (product.category as string);

  const stageLabel = stage
    ? (locale === "en" ? stage.en : stage.pt)
    : (product.lifecycleStage as string);

  // Build QR code URL - use GS1 path if gtin+serial available
  const qrUrl = gtin && serialNumber
    ? `/api/products/${productId}/qr-code?format=svg&gtin=${gtin}&serial=${serialNumber}`
    : productId
    ? `/api/products/${productId}/qr-code?format=svg`
    : null;

  const categoryInitial = categoryLabel ? categoryLabel.charAt(0).toUpperCase() : "P";

  return (
    <Card className="border border-stone-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Category initial */}
          <div className="flex-shrink-0 w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center self-start">
            <span className="text-xl font-semibold text-teal-700">{categoryInitial}</span>
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Title row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-stone-900 tracking-tight">
                  {product.brand as string} {product.model as string}
                </h1>
                <p className="text-sm text-stone-400 mt-0.5">{categoryLabel}</p>
              </div>
              <Badge
                className={`text-xs font-medium px-2.5 py-0.5 flex-shrink-0 ${
                  product.lifecycleStage === "RECYCLED"
                    ? "bg-teal-50 text-teal-700 border border-teal-200"
                    : product.lifecycleStage === "IN_USE"
                    ? "bg-teal-50 text-teal-700 border border-teal-200"
                    : "bg-stone-50 text-stone-600 border border-stone-200"
                }`}
              >
                {stageLabel}
              </Badge>
            </div>

            {/* Data grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 text-sm">
              <div>
                <span className="text-xs text-stone-400 block mb-0.5">{t("passport.serial")}</span>
                <span className="font-mono text-sm text-stone-700">{product.serialNumber as string}</span>
              </div>
              {!!product.gtin && (
                <div>
                  <span className="text-xs text-stone-400 block mb-0.5">{t("passport.gtin")}</span>
                  <span className="font-mono text-sm text-stone-700">{product.gtin as string}</span>
                </div>
              )}
              <div>
                <span className="text-xs text-stone-400 block mb-0.5">{t("passport.manufacturing")}</span>
                <span className="text-sm text-stone-700">{mfgDate}</span>
              </div>
              <div>
                <span className="text-xs text-stone-400 block mb-0.5">{t("passport.factory")}</span>
                <span className="text-sm text-stone-700">{product.manufacturingFacility as string}</span>
              </div>
            </div>

            {manufacturer && (
              <p className="text-xs text-stone-400">
                {t("passport.manufacturer")}: {manufacturer.organization || manufacturer.name}
              </p>
            )}

            <p className="text-[11px] font-mono text-stone-300 break-all leading-relaxed">
              {product.uid as string}
            </p>
          </div>

          {/* QR Code */}
          {qrUrl && (
            <div className="flex-shrink-0 flex flex-col items-center gap-2 md:self-start self-center md:pl-4 md:border-l md:border-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt={t("passport.qrAlt")}
                width={100}
                height={100}
                className="rounded"
              />
              <span className="text-[10px] text-stone-400">{t("passport.scanToAccess")}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
