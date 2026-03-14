"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import { LOCALE_NAMES, type Locale } from "@/lib/i18n/translations";

const FLAG_CODES: Record<Locale, string> = {
  "pt-BR": "br",
  en: "us",
  es: "es",
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-1.5">
      {(Object.entries(LOCALE_NAMES) as [Locale, string][]).map(([loc, name]) => {
        const isActive = locale === loc;
        return (
          <button
            key={loc}
            onClick={() => setLocale(loc)}
            className={`relative rounded-md overflow-hidden transition-all duration-200 ${
              isActive
                ? "ring-2 ring-slate-800 ring-offset-1 shadow-sm scale-105"
                : "opacity-40 hover:opacity-75 hover:scale-105"
            }`}
            title={name}
            style={{ width: 28, height: 20 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://flagcdn.com/w40/${FLAG_CODES[loc]}.png`}
              srcSet={`https://flagcdn.com/w80/${FLAG_CODES[loc]}.png 2x`}
              alt={name}
              className="w-full h-full object-cover"
              width={28}
              height={20}
            />
          </button>
        );
      })}
    </div>
  );
}
