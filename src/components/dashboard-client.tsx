"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES, LIFECYCLE_STAGES } from "@/lib/constants";
import { useLocale } from "@/lib/i18n/locale-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { DashboardSearch } from "@/components/dashboard-search";
import { buildGS1Path } from "@/lib/gs1";
import { getProductAge } from "@/lib/i18n/translations";
import type { TKey } from "@/lib/i18n/translations";

interface DashboardProduct {
  id: string;
  gtin: string | null;
  serialNumber: string;
  brand: string;
  model: string;
  category: string;
  lifecycleStage: string;
  manufacturingDate: string; // ISO string
  manufacturingFacility: string | null;
}

interface DashboardProps {
  products: DashboardProduct[];
  role: string;
  userName: string;
  userOrganization: string | null;
  stats: {
    totalProducts: number;
    recycled: number;
    inUse: number;
    manufactured: number;
    underRepair: number;
    sold: number;
    totalRepairs: number;
    totalEOL: number;
    totalOwnership: number;
    realDataCount: number;
  };
}

export function DashboardClient({ products, role, userName, userOrganization, stats }: DashboardProps) {
  const { t, locale } = useLocale();
  const [filteredIds, setFilteredIds] = useState<string[] | null>(null);

  const displayProducts = filteredIds
    ? products.filter((p) => filteredIds.includes(p.id))
    : products;

  const categoryBreakdown = products.reduce(
    (acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const brandBreakdown = products.reduce(
    (acc, p) => {
      acc[p.brand] = (acc[p.brand] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  function getPassportUrl(product: DashboardProduct) {
    if (product.gtin) {
      return buildGS1Path(product.gtin, product.serialNumber);
    }
    return `/passport/${product.id}`;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <span className="font-bold text-lg text-slate-900">{t("nav.title")}</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link href="/about" className="text-sm text-slate-500 hover:text-slate-700">
            {t("nav.about")}
          </Link>
          <Badge variant="outline">{t(`role.${role}` as TKey)}</Badge>
          <span className="text-sm text-slate-600">{userName}</span>
          {userOrganization && (
            <span className="text-xs text-slate-400">{userOrganization}</span>
          )}
          <Link href="/login">
            <Button variant="ghost" size="sm">
              {t("nav.switchProfile")}
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Role Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              {t("dashboard.panel")} — {t(`role.${role}` as TKey)}
            </h1>
            <p className="text-sm text-slate-500">{t(`dashboardDesc.${role}` as TKey)}</p>
          </div>
          <div className="flex gap-2">
            {role === "MANUFACTURER" && (
              <Link href="/forms/new-product">
                <Button size="sm">{t("dashboard.newProduct")}</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Role-specific stats */}
        {role === "MANUFACTURER" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard title={t("dashboard.totalProducts")} value={stats.totalProducts} />
            <StatCard title={t("dashboard.manufactured")} value={stats.manufactured} color="text-blue-600" />
            <StatCard title={t("dashboard.inUse")} value={stats.inUse} color="text-green-600" />
            <StatCard title={t("dashboard.recycled")} value={stats.recycled} color="text-emerald-600" />
          </div>
        )}

        {role === "CONSUMER" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <StatCard title={t("dashboard.registered")} value={stats.totalProducts} />
            <StatCard title={t("dashboard.inUse")} value={stats.inUse} color="text-green-600" />
            <StatCard title={t("dashboard.withRepair")} value={stats.totalRepairs} color="text-orange-600" />
          </div>
        )}

        {role === "REPAIR_TECH" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard title={t("dashboard.totalProducts")} value={stats.totalProducts} />
            <StatCard title={t("dashboard.underRepair")} value={stats.underRepair} color="text-orange-600" />
            <StatCard title={t("dashboard.repairsPerformed")} value={stats.totalRepairs} color="text-blue-600" />
            <StatCard title={t("dashboard.inUse")} value={stats.inUse} color="text-green-600" />
          </div>
        )}

        {role === "RECYCLER" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard title={t("dashboard.totalProducts")} value={stats.totalProducts} />
            <StatCard title={t("dashboard.recycled")} value={stats.recycled} color="text-emerald-600" />
            <StatCard title={t("dashboard.eolRecords")} value={stats.totalEOL} color="text-green-600" />
            <StatCard title={t("dashboard.realData")} value={stats.realDataCount} color="text-blue-600" />
          </div>
        )}

        {/* Category + Brand breakdowns (for Manufacturer) */}
        {role === "MANUFACTURER" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-500">{t("dashboard.byCategory")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(categoryBreakdown).map(([cat, count]) => {
                    const catInfo = PRODUCT_CATEGORIES[cat as keyof typeof PRODUCT_CATEGORIES];
                    return (
                      <div key={cat} className="flex items-center justify-between">
                        <span className="text-sm">
                          {catInfo?.icon || "📦"} {t(`category.${cat}` as TKey)}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-blue-500 h-full rounded-full"
                              style={{ width: `${(count / stats.totalProducts) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-right">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-500">{t("dashboard.byBrand")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(brandBreakdown)
                    .sort((a, b) => b[1] - a[1])
                    .map(([brand, count]) => (
                      <div key={brand} className="flex items-center justify-between">
                        <span className="text-sm">{brand}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${(count / stats.totalProducts) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search */}
        <DashboardSearch
          products={products.map((p) => ({
            id: p.id,
            gtin: p.gtin,
            serialNumber: p.serialNumber,
            brand: p.brand,
            model: p.model,
            category: p.category,
          }))}
          onFilter={setFilteredIds}
        />

        {/* Product List */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">{t("dashboard.products")}</h2>
          <span className="text-sm text-slate-400">
            {displayProducts.length} {t("dashboard.records")}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayProducts.map((product) => {
            const cat = PRODUCT_CATEGORIES[product.category as keyof typeof PRODUCT_CATEGORIES];
            const stage = LIFECYCLE_STAGES[product.lifecycleStage as keyof typeof LIFECYCLE_STAGES];
            const mfgDate = new Date(product.manufacturingDate);
            const age = getProductAge(mfgDate, locale);

            return (
              <Link key={product.id} href={getPassportUrl(product)}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{cat?.icon || "📦"}</span>
                        <div>
                          <CardTitle className="text-sm">{product.brand} {product.model}</CardTitle>
                          <p className="text-xs text-slate-400">{t(`category.${product.category}` as TKey)}</p>
                        </div>
                      </div>
                      <Badge
                        variant={product.lifecycleStage === "RECYCLED" ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {t(`lifecycle.${product.lifecycleStage}` as TKey)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-slate-500 space-y-1">
                      <p>{t("passport.serial")}: {product.serialNumber}</p>
                      <p>
                        {t("passport.manufacturing")}:{" "}
                        {mfgDate.toLocaleDateString(
                          locale === "en" ? "en-US" : locale === "es" ? "es-ES" : "pt-BR"
                        )}
                      </p>
                      <p className="text-slate-400">
                        {t("dashboard.productAge")}: {age}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t mt-8">
        {t("footer.text")}
      </footer>
    </div>
  );
}

function StatCard({
  title,
  value,
  color = "text-slate-900",
}: {
  title: string;
  value: number;
  color?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-slate-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
