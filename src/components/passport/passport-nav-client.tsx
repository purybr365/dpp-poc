"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/locale-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { TKey } from "@/lib/i18n/translations";

interface PassportNavClientProps {
  role: string;
  userName: string | null;
}

export function PassportNavClient({ role, userName }: PassportNavClientProps) {
  const { t } = useLocale();

  return (
    <nav className="bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80">
        <span className="font-bold text-lg tracking-tight text-stone-900">DPP</span>
        <span className="text-stone-300 font-light">|</span>
        <span className="text-sm font-medium text-stone-500">{t("nav.title")}</span>
      </Link>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <Link href="/about" className="text-sm text-stone-400 hover:text-teal-700 transition-colors">
          {t("nav.about")}
        </Link>
        {userName ? (
          <>
            <Badge variant="outline" className="text-xs border-stone-300 text-stone-500 font-normal">
              {t(`role.${role}` as TKey)}
            </Badge>
            <span className="text-sm font-medium text-stone-600">{userName}</span>
          </>
        ) : (
          <Badge variant="secondary" className="text-xs bg-stone-100 text-stone-500 font-normal">
            {t("nav.publicAccess")}
          </Badge>
        )}
      </div>
    </nav>
  );
}
