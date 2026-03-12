"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import type { TKey } from "@/lib/i18n/translations";

interface PassportTabsClientProps {
  translationKey: TKey;
}

export function PassportTabsClient({ translationKey }: PassportTabsClientProps) {
  const { t } = useLocale();
  return <>{t(translationKey)}</>;
}
