"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/lib/i18n/locale-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { TKey } from "@/lib/i18n/translations";

const ROLE_CARDS = [
  {
    email: "fabricante@dpp.br",
    name: "Ana Silva",
    role: "MANUFACTURER",
    organization: "Brastemp (Whirlpool)",
    initial: "M",
  },
  {
    email: "consumidor@dpp.br",
    name: "Maria Oliveira",
    role: "CONSUMER",
    organization: "Pessoa Fisica",
    initial: "C",
  },
  {
    email: "tecnico@dpp.br",
    name: "Joao Pereira",
    role: "REPAIR_TECH",
    organization: "Brastemp Assistencia",
    initial: "R",
  },
  {
    email: "reciclador@dpp.br",
    name: "Roberto Costa",
    role: "RECYCLER",
    organization: "JG-SUSTENTARE",
    initial: "E",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleDemoLogin(demoEmail: string) {
    setLoading(demoEmail);
    setError("");

    const result = await signIn("credentials", {
      email: demoEmail,
      password: "dpp2026",
      redirect: false,
    });

    if (result?.error) {
      setError(t("login.error"));
      setLoading(null);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  async function handleManualLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading("manual");
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(t("login.invalidCredentials"));
      setLoading(null);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-[var(--font-sans)]">
      {/* Header */}
      <header className="pt-16 pb-10 text-center px-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
            Digital Product Passport
          </h1>
          <span className="ml-2 text-[10px] font-medium uppercase tracking-widest text-stone-400 border border-stone-300 rounded px-1.5 py-0.5 leading-none relative top-[-2px]">
            POC
          </span>
        </div>
        <p className="text-sm text-stone-500 mt-2 max-w-md mx-auto leading-relaxed">
          {t("login.subtitle")}
        </p>
        <div className="flex justify-center mt-4">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-xl mx-auto px-4 pb-16 w-full">
        <div className="mb-6">
          <h2 className="text-sm font-medium text-stone-900 mb-1">
            {t("login.selectProfile")}
          </h2>
          <p className="text-xs text-stone-400">
            {t("login.profileDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {ROLE_CARDS.map((card) => (
            <button
              key={card.email}
              type="button"
              disabled={!!loading}
              onClick={() => handleDemoLogin(card.email)}
              className={`group text-left w-full rounded-lg border border-stone-200 bg-white
                border-l-[3px] border-l-teal-700
                transition-all duration-150
                ${
                  loading === card.email
                    ? "opacity-60 scale-[0.98]"
                    : "hover:border-stone-300 hover:shadow-sm hover:bg-stone-50/50"
                }
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2
              `}
            >
              <div className="px-4 py-4">
                <div className="flex items-start gap-3">
                  {/* Icon circle */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center">
                    <span className="text-xs font-semibold text-teal-700">
                      {card.initial}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-stone-900">
                      {t(`role.${card.role}` as TKey)}
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      {card.organization}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-stone-500 mt-2.5 leading-relaxed">
                  {t(`roleDesc.${card.role}` as TKey)}
                </p>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-stone-100">
                  <span className="text-[11px] text-stone-400">{card.name}</span>
                  {loading === card.email ? (
                    <span className="text-[11px] text-stone-400 animate-pulse">
                      {t("login.entering")}
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-teal-700 group-hover:underline">
                      {t("login.enter")}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {error && (
          <div className="text-center text-sm text-red-600 mb-6 bg-red-50 border border-red-100 rounded-md py-2 px-3">
            {error}
          </div>
        )}

        {/* Manual Login Toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowManual(!showManual)}
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            {showManual ? t("login.hideManual") : t("login.manualLogin")}
          </button>
        </div>

        {showManual && (
          <div className="max-w-sm mx-auto mt-4 rounded-lg border border-stone-200 bg-white p-5">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-stone-900">
                {t("login.manualTitle")}
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                {t("login.manualDescription")}
              </p>
            </div>
            <form onSubmit={handleManualLogin} className="space-y-3">
              <div>
                <Label htmlFor="email" className="text-xs font-medium text-stone-700">
                  {t("login.email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fabricante@dpp.br"
                  required
                  className="mt-1 h-9 text-sm border-stone-200 focus-visible:ring-teal-700"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-xs font-medium text-stone-700">
                  {t("login.password")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="dpp2026"
                  required
                  className="mt-1 h-9 text-sm border-stone-200 focus-visible:ring-teal-700"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-9 text-sm bg-teal-700 hover:bg-teal-800 text-white"
                disabled={loading === "manual"}
              >
                {loading === "manual" ? t("login.entering") : t("login.submit")}
              </Button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-[11px] text-stone-400 border-t border-stone-200">
        {t("footer.text")}
      </footer>
    </div>
  );
}
