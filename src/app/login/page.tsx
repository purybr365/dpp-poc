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
    icon: "🏭",
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
  },
  {
    email: "consumidor@dpp.br",
    name: "Maria Oliveira",
    role: "CONSUMER",
    organization: "Pessoa Física",
    icon: "👤",
    color: "bg-green-50 border-green-200 hover:border-green-400",
  },
  {
    email: "tecnico@dpp.br",
    name: "João Pereira",
    role: "REPAIR_TECH",
    organization: "Brastemp Assistência",
    icon: "🔧",
    color: "bg-orange-50 border-orange-200 hover:border-orange-400",
  },
  {
    email: "reciclador@dpp.br",
    name: "Roberto Costa",
    role: "RECYCLER",
    organization: "JG-SUSTENTARE",
    icon: "♻️",
    color: "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="py-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-4xl">📋</span>
          <h1 className="text-3xl font-bold text-slate-900">
            {t("login.title")}
          </h1>
        </div>
        <p className="text-lg text-slate-600">
          {t("login.subtitle")}
        </p>
        <p className="text-sm text-slate-400 mt-1">
          {t("login.poc")}
        </p>
        <div className="flex justify-center mt-3">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Role Selector */}
      <main className="flex-1 max-w-4xl mx-auto px-4 pb-12 w-full">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-slate-700 mb-1">
            {t("login.selectProfile")}
          </h2>
          <p className="text-sm text-slate-500">
            {t("login.profileDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {ROLE_CARDS.map((card) => (
            <Card
              key={card.email}
              className={`cursor-pointer transition-all duration-200 border-2 ${card.color} ${
                loading === card.email ? "opacity-75 scale-95" : "hover:scale-[1.02] hover:shadow-md"
              }`}
              onClick={() => !loading && handleDemoLogin(card.email)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{card.icon}</span>
                  <div>
                    <CardTitle className="text-base">
                      {t(`role.${card.role}` as TKey)}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {card.organization}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-2">
                  {t(`roleDesc.${card.role}` as TKey)}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{card.name}</span>
                  {loading === card.email ? (
                    <span className="text-xs text-slate-500 animate-pulse">
                      {t("login.entering")}
                    </span>
                  ) : (
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      {t("login.enter")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {error && (
          <div className="text-center text-red-600 text-sm mb-4">{error}</div>
        )}

        {/* Manual Login Toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowManual(!showManual)}
            className="text-sm text-slate-400 hover:text-slate-600 underline"
          >
            {showManual ? t("login.hideManual") : t("login.manualLogin")}
          </button>
        </div>

        {showManual && (
          <Card className="max-w-sm mx-auto mt-4">
            <CardHeader>
              <CardTitle className="text-base">{t("login.manualTitle")}</CardTitle>
              <CardDescription className="text-xs">
                {t("login.manualDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualLogin} className="space-y-3">
                <div>
                  <Label htmlFor="email" className="text-sm">
                    {t("login.email")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="fabricante@dpp.br"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-sm">
                    {t("login.password")}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="dpp2026"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading === "manual"}
                >
                  {loading === "manual" ? t("login.entering") : t("login.submit")}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t">
        {t("footer.text")}
      </footer>
    </div>
  );
}
