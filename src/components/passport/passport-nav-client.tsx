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
    <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3 hover:opacity-80">
        <span className="text-2xl">📋</span>
        <span className="font-bold text-lg text-slate-900">{t("nav.title")}</span>
      </Link>
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <Link href="/about" className="text-sm text-slate-500 hover:text-slate-700">
          {t("nav.about")}
        </Link>
        {userName ? (
          <>
            <Badge variant="outline" className="text-xs">
              {t(`role.${role}` as TKey)}
            </Badge>
            <span className="text-sm text-slate-600">{userName}</span>
          </>
        ) : (
          <Badge variant="secondary" className="text-xs">
            {t("nav.publicAccess")}
          </Badge>
        )}
      </div>
    </nav>
  );
}
