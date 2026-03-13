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
          className={`text-base px-1.5 py-0.5 rounded transition-colors ${
            locale === loc
              ? "bg-slate-900 text-white"
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          }`}
          title={name}
        >
          {loc === "pt-BR" ? "\u{1F1E7}\u{1F1F7}" : loc === "en" ? "\u{1F1FA}\u{1F1F8}" : "\u{1F1EA}\u{1F1F8}"}
        </button>
      ))}
    </div>
  );
}
