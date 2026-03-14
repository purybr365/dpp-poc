"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/locale-context";

export default function PassportNotFound() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80">
          <span className="text-2xl">📋</span>
          <span className="font-bold text-lg text-slate-900">{t("nav.title")}</span>
        </Link>
      </nav>
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <Card>
          <CardContent className="p-8 space-y-4">
            <span className="text-6xl block">🔍</span>
            <h1 className="text-2xl font-bold text-slate-900">
              {t("notFound.title")}
            </h1>
            <p className="text-slate-500">
              {t("notFound.description")}
            </p>
            <Link href="/">
              <Button>{t("notFound.backHome")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
