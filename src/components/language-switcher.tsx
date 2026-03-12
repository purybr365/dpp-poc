"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import { LOCALE_NAMES, type Locale } from "@/lib/i18n/translations";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-1">
      {(Object.entries(LOCALE_NAMES) as [Locale, string][]).map(([loc, name]) => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          className={`text-xs px-2 py-0.5 rounded transition-colors ${
            locale === loc
              ? "bg-slate-900 text-white"
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          }`}
          title={name}
        >
          {loc === "pt-BR" ? "PT" : loc === "en" ? "EN" : "ES"}
        </button>
      ))}
    </div>
  );
}
