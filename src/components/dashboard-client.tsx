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
  manufacturingDate: string;
  manufacturingFacility: string | null;
}

interface KpiRow {
  category: string;
  brand: string;
}

interface RepairKpiRow extends KpiRow {
  repairCount: number;
  topIssue: string;
  topIssueCount: number;
}

interface PercentageKpiRow extends KpiRow {
  total: number;
  percentage: number;
  repaired?: number;
  registered?: number;
  resold?: number;
  resoldWeight?: number;
}

interface LifecycleKpiRow extends KpiRow {
  avgMonths: number;
  count: number;
}

interface KpiData {
  repairKpi: RepairKpiRow[];
  repairPercentage: PercentageKpiRow[];
  registeredPercentage: PercentageKpiRow[];
  resalePercentage: PercentageKpiRow[];
  lifecycleKpi: LifecycleKpiRow[];
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
    registeredCount: number;
    secondHandResaleCount: number;
  };
  kpiData?: KpiData;
}

export function DashboardClient({ products, role, userName, userOrganization, stats, kpiData }: DashboardProps) {
  const { t, locale } = useLocale();
  const [filteredIds, setFilteredIds] = useState<string[] | null>(null);

  const displayProducts = filteredIds
    ? products.filter((p) => filteredIds.includes(p.id))
    : products;

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
            <StatCard title={t("dashboard.totalProducts")} value={stats.totalProducts} icon="📦" />
            <StatCard title={t("dashboard.registered")} value={stats.registeredCount} color="text-blue-600" icon="📝" />
            <StatCard title={t("dashboard.recycled")} value={stats.recycled} color="text-emerald-600" icon="♻️" />
            <StatCard title={t("dashboard.repairsPerformed")} value={stats.totalRepairs} color="text-orange-600" icon="🔧" />
          </div>
        )}

        {role === "CONSUMER" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <StatCard title={t("dashboard.registered")} value={stats.registeredCount} icon="📝" />
            <StatCard title={t("dashboard.inUse")} value={stats.inUse} color="text-green-600" icon="🏠" />
            <StatCard title={t("dashboard.withRepair")} value={stats.totalRepairs} color="text-orange-600" icon="🔧" />
          </div>
        )}

        {role === "REPAIR_TECH" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard title={t("dashboard.totalProducts")} value={stats.totalProducts} icon="📦" />
            <StatCard title={t("dashboard.underRepair")} value={stats.underRepair} color="text-orange-600" icon="🔧" />
            <StatCard title={t("dashboard.repairsPerformed")} value={stats.totalRepairs} color="text-blue-600" icon="✅" />
            <StatCard title={t("dashboard.inUse")} value={stats.inUse} color="text-green-600" icon="🏠" />
          </div>
        )}

        {role === "RECYCLER" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard title={t("dashboard.totalProducts")} value={stats.totalProducts} icon="📦" />
            <StatCard title={t("dashboard.recycled")} value={stats.recycled} color="text-emerald-600" icon="♻️" />
            <StatCard title={t("dashboard.eolRecords")} value={stats.totalEOL} color="text-green-600" icon="📋" />
            <StatCard title={t("dashboard.realData")} value={stats.realDataCount} color="text-blue-600" icon="🔬" />
          </div>
        )}

        {/* KPI Section — Manufacturer only */}
        {role === "MANUFACTURER" && kpiData && (
          <div className="space-y-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              📊 {t("dashboard.kpiTitle")}
            </h2>

            {/* Row 1: Repair KPI (table) + Repair Percentage (bar chart) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Products Repaired with Most Common Problem */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-500 flex items-center gap-2">
                    🔧 {t("dashboard.kpi.repairsByProblem")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {kpiData.repairKpi.length === 0 ? (
                    <p className="text-xs text-slate-400">{t("dashboard.kpi.noData")}</p>
                  ) : (
                    <div className="space-y-3">
                      {kpiData.repairKpi
                        .sort((a, b) => b.repairCount - a.repairCount)
                        .map((row, idx) => {
                          const catInfo = PRODUCT_CATEGORIES[row.category as keyof typeof PRODUCT_CATEGORIES];
                          return (
                            <div key={idx} className="bg-slate-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">
                                  {catInfo?.icon || "📦"} {t(`category.${row.category}` as TKey)} — {row.brand}
                                </span>
                                <Badge variant="secondary" className="text-xs">{row.repairCount} {t("dashboard.kpi.repairs")}</Badge>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-slate-400">{t("dashboard.kpi.topIssue")}:</span>
                                <span className="text-xs text-orange-600 font-medium">{row.topIssue}</span>
                                <span className="text-xs text-slate-300">({row.topIssueCount}x)</span>
                              </div>
                            </div>
                          );
                        })}
                      {/* Total repairs */}
                      <div className="border-t border-slate-200 pt-2 mt-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700">Total</span>
                        <Badge variant="outline" className="text-xs font-semibold">{kpiData.repairKpi.reduce((sum, r) => sum + r.repairCount, 0)} {t("dashboard.kpi.repairs")}</Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Percentage of Products Repaired */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-500 flex items-center gap-2">
                    📈 {t("dashboard.kpi.repairPercentage")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {kpiData.repairPercentage
                      .filter((r) => r.percentage > 0)
                      .sort((a, b) => b.percentage - a.percentage)
                      .map((row, idx) => {
                        const catInfo = PRODUCT_CATEGORIES[row.category as keyof typeof PRODUCT_CATEGORIES];
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-600">
                                {catInfo?.icon || "📦"} {t(`category.${row.category}` as TKey)} — {row.brand}
                              </span>
                              <span className="text-xs font-semibold text-orange-600">{row.percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-orange-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${row.percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    {kpiData.repairPercentage.filter((r) => r.percentage > 0).length === 0 && (
                      <p className="text-xs text-slate-400">{t("dashboard.kpi.noData")}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Row 2: Avg Lifecycle + Registration Percentage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Average Lifecycle of Recycled Products */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-500 flex items-center gap-2">
                    ⏱️ {t("dashboard.kpi.avgLifecycle")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {kpiData.lifecycleKpi.length === 0 ? (
                    <p className="text-xs text-slate-400">{t("dashboard.kpi.noData")}</p>
                  ) : (
                    <div className="space-y-3">
                      {kpiData.lifecycleKpi
                        .sort((a, b) => b.avgMonths - a.avgMonths)
                        .map((row, idx) => {
                          const catInfo = PRODUCT_CATEGORIES[row.category as keyof typeof PRODUCT_CATEGORIES];
                          const years = Math.floor(row.avgMonths / 12);
                          const months = row.avgMonths % 12;
                          const label = years > 0
                            ? `${years} ${t("time.years")} ${months > 0 ? `${months} ${t("time.months")}` : ""}`
                            : `${months} ${t("time.months")}`;
                          const maxMonths = Math.max(...kpiData.lifecycleKpi.map((r) => r.avgMonths), 1);
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-600">
                                  {catInfo?.icon || "📦"} {t(`category.${row.category}` as TKey)} — {row.brand}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-emerald-600">{label.trim()}</span>
                                  <span className="text-xs text-slate-300">({row.count} {t("dashboard.kpi.products")})</span>
                                </div>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                                  style={{ width: `${(row.avgMonths / maxMonths) * 100}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Percentage of Products Registered */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-500 flex items-center gap-2">
                    📝 {t("dashboard.kpi.registeredPercentage")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {kpiData.registeredPercentage
                      .sort((a, b) => b.percentage - a.percentage)
                      .map((row, idx) => {
                        const catInfo = PRODUCT_CATEGORIES[row.category as keyof typeof PRODUCT_CATEGORIES];
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-600">
                                {catInfo?.icon || "📦"} {t(`category.${row.category}` as TKey)} — {row.brand}
                              </span>
                              <span className="text-xs font-semibold text-blue-600">{row.percentage}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-blue-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${row.percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Row 3: Second-Hand Resale Percentage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-500 flex items-center gap-2">
                    🤝 {t("dashboard.kpi.resalePercentage")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {kpiData.resalePercentage
                      .sort((a, b) => b.percentage - a.percentage)
                      .map((row, idx) => {
                        const catInfo = PRODUCT_CATEGORIES[row.category as keyof typeof PRODUCT_CATEGORIES];
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-600">
                                {catInfo?.icon || "📦"} {t(`category.${row.category}` as TKey)} — {row.brand}
                              </span>
                              <div className="flex items-center gap-2">
                                {(row.resold ?? 0) > 0 && (
                                  <span className="text-xs text-slate-400">({row.resold} {t("dashboard.kpi.products")})</span>
                                )}
                                <span className="text-xs font-semibold text-purple-600">{row.percentage}%</span>
                              </div>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-purple-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${row.percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    {kpiData.resalePercentage.filter((r) => r.percentage > 0).length === 0 && (
                      <p className="text-xs text-slate-400">{t("dashboard.kpi.noResaleData")}</p>
                    )}
                    {(() => {
                      const totalWeight = kpiData.resalePercentage.reduce((sum, r) => sum + (r.resoldWeight || 0), 0);
                      const totalResold = kpiData.resalePercentage.reduce((sum, r) => sum + (r.resold || 0), 0);
                      if (totalResold > 0) {
                        return (
                          <div className="border-t border-slate-200 pt-2 mt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500 font-medium">
                                {t("dashboard.kpi.totalResaleWeight")}
                              </span>
                              <span className="text-xs font-semibold text-purple-700">
                                {totalWeight.toFixed(1)} kg
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>
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
                      <p className="text-green-600 font-medium">
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
  icon,
}: {
  title: string;
  value: number;
  color?: string;
  icon?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-slate-500 flex items-center gap-1.5">
          {icon && <span>{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
