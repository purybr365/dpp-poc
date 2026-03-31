"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface RecyclerKpi {
  recyclingRateByBrand: Array<{ brand: string; avgRate: number; count: number }>;
  conditionCounts: { functional: number; partiallyFunctional: number; nonFunctional: number };
  realVsEstimated: { real: number; estimated: number };
}

interface RepairTechKpi {
  topIssues: Array<{ issue: string; count: number }>;
  statusCounts: { passed: number; conditional: number; failed: number };
  avgCost: number;
  costByCategory: Array<{ category: string; avgCost: number; count: number }>;
}

interface KpiData {
  repairKpi: RepairKpiRow[];
  repairPercentage: PercentageKpiRow[];
  registeredPercentage: PercentageKpiRow[];
  resalePercentage: PercentageKpiRow[];
  lifecycleKpi: LifecycleKpiRow[];
  recyclerKpi?: RecyclerKpi;
  repairTechKpi?: RepairTechKpi;
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

  function translateIssue(issue: string): string {
    const key = `repairIssue.${issue}` as TKey;
    const translated = t(key);
    return translated === key ? issue : translated;
  }

  const hasKpis = role === "MANUFACTURER" || role === "RECYCLER" || role === "REPAIR_TECH";

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="bg-white border-b border-stone-200 px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="bg-teal-700 text-white text-xs font-bold px-2 py-1 rounded">DPP</span>
          <span className="font-semibold text-sm text-stone-900">{t("nav.title")}</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link href="/about" className="text-sm text-stone-400 hover:text-stone-600 transition-colors">
            {t("nav.about")}
          </Link>
          <div className="h-4 w-px bg-stone-200" />
          <Badge variant="outline" className="text-xs font-normal border-stone-200 text-stone-500">
            {t(`role.${role}` as TKey)}
          </Badge>
          <span className="text-sm text-stone-600">{userName}</span>
          {userOrganization && (
            <span className="text-xs text-stone-400">{userOrganization}</span>
          )}
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-stone-500 hover:text-stone-700">
              {t("nav.switchProfile")}
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Role Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-stone-900 mb-1">
              {t("dashboard.panel")} — {t(`role.${role}` as TKey)}
            </h1>
            <p className="text-sm text-stone-500">{t(`dashboardDesc.${role}` as TKey)}</p>
          </div>
          <div className="flex gap-2">
            {role === "MANUFACTURER" && (
              <Link href="/forms/new-product">
                <Button size="sm" className="bg-teal-700 hover:bg-teal-600 text-white">
                  {t("dashboard.newProduct")}
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Strip */}
        {role === "MANUFACTURER" && (
          <StatsStrip items={[
            { label: t("dashboard.totalProducts"), value: stats.totalProducts },
            { label: t("dashboard.registered"), value: stats.registeredCount },
            { label: t("dashboard.recycled"), value: stats.recycled },
            { label: t("dashboard.repairsPerformed"), value: stats.totalRepairs },
          ]} />
        )}

        {role === "CONSUMER" && (
          <StatsStrip items={[
            { label: t("dashboard.registered"), value: stats.registeredCount },
            { label: t("dashboard.inUse"), value: stats.inUse },
            { label: t("dashboard.withRepair"), value: stats.totalRepairs },
          ]} />
        )}

        {role === "REPAIR_TECH" && (
          <StatsStrip items={[
            { label: t("dashboard.totalProducts"), value: stats.totalProducts },
            { label: t("dashboard.underRepair"), value: stats.underRepair },
            { label: t("dashboard.repairsPerformed"), value: stats.totalRepairs },
            { label: t("dashboard.inUse"), value: stats.inUse },
          ]} />
        )}

        {role === "RECYCLER" && (
          <StatsStrip items={[
            { label: t("dashboard.totalProducts"), value: stats.totalProducts },
            { label: t("dashboard.recycled"), value: stats.recycled },
            { label: t("dashboard.eolRecords"), value: stats.totalEOL },
            { label: t("dashboard.realData"), value: stats.realDataCount },
          ]} />
        )}

        {/* Tabbed Layout: KPIs | Products */}
        <Tabs defaultValue="products" className="w-full">
          {hasKpis && (
            <TabsList className="bg-transparent border-b border-stone-200 rounded-none h-auto p-0 mb-8 w-full justify-start gap-0">
              <TabsTrigger
                value="products"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-700 data-[state=active]:bg-transparent data-[state=active]:text-stone-900 data-[state=active]:shadow-none text-stone-400 px-4 pb-3 pt-1 text-sm font-medium"
              >
                {t("dashboard.tab.products")}
              </TabsTrigger>
              <TabsTrigger
                value="kpis"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-700 data-[state=active]:bg-transparent data-[state=active]:text-stone-900 data-[state=active]:shadow-none text-stone-400 px-4 pb-3 pt-1 text-sm font-medium"
              >
                {t("dashboard.tab.kpis")}
              </TabsTrigger>
            </TabsList>
          )}

          {/* KPI Tab */}
          {hasKpis && kpiData && (
            <TabsContent value="kpis">
              {role === "MANUFACTURER" && <ManufacturerKpis kpiData={kpiData} t={t} locale={locale} translateIssue={translateIssue} />}
              {role === "RECYCLER" && kpiData.recyclerKpi && <RecyclerKpis data={kpiData.recyclerKpi} t={t} />}
              {role === "REPAIR_TECH" && kpiData.repairTechKpi && <RepairTechKpis data={kpiData.repairTechKpi} t={t} translateIssue={translateIssue} />}
            </TabsContent>
          )}

          {/* Products Tab */}
          <TabsContent value="products">
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

            <div className="flex items-center justify-between mb-4 mt-2">
              <h2 className="text-sm font-medium uppercase tracking-wide text-stone-400">
                {t("dashboard.products")}
              </h2>
              <span className="text-sm text-stone-400">
                {displayProducts.length} {t("dashboard.records")}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {displayProducts.map((product) => {
                const cat = PRODUCT_CATEGORIES[product.category as keyof typeof PRODUCT_CATEGORIES];
                const mfgDate = new Date(product.manufacturingDate);
                const age = getProductAge(mfgDate, locale);

                return (
                  <Link key={product.id} href={getPassportUrl(product)}>
                    <div className="group bg-white border border-stone-200 rounded-lg px-4 py-3 hover:border-teal-600/40 hover:shadow-sm transition-all cursor-pointer h-full">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">{cat?.icon || "📦"}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-stone-900 truncate">
                              {product.brand} {product.model}
                            </p>
                            <p className="text-xs text-stone-400">{t(`category.${product.category}` as TKey)}</p>
                          </div>
                        </div>
                        <Badge
                          variant={product.lifecycleStage === "RECYCLED" ? "secondary" : "outline"}
                          className="text-[10px] shrink-0 font-normal"
                        >
                          {t(`lifecycle.${product.lifecycleStage}` as TKey)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-stone-500">
                        <span className="truncate">{product.serialNumber}</span>
                        <span className="shrink-0">
                          {mfgDate.toLocaleDateString(
                            locale === "en" ? "en-US" : locale === "es" ? "es-ES" : "pt-BR"
                          )}
                        </span>
                        <span className="shrink-0 text-teal-700 font-medium">{age}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-stone-400 border-t border-stone-200 mt-8">
        {t("footer.text")}
      </footer>
    </div>
  );
}

/* -- Stats Strip (Stripe-style horizontal metrics) -- */
function StatsStrip({ items }: { items: Array<{ label: string; value: number }> }) {
  return (
    <div className="bg-white border border-stone-200 rounded-lg flex divide-x divide-stone-200 mb-8">
      {items.map((item, idx) => (
        <div key={idx} className="flex-1 px-6 py-4">
          <p className="text-xs text-stone-400 mb-1">{item.label}</p>
          <p className="text-2xl font-semibold text-stone-900">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

/* -- KPI Section Card (reusable wrapper) -- */
function KpiSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-lg p-5">
      <h3 className="text-sm font-medium uppercase tracking-wide text-stone-400 mb-4">{title}</h3>
      {children}
    </div>
  );
}

/* -- Manufacturer KPIs -- */
function ManufacturerKpis({ kpiData, t, locale, translateIssue }: {
  kpiData: KpiData;
  t: (key: TKey) => string;
  locale: string;
  translateIssue: (issue: string) => string;
}) {
  return (
    <div className="space-y-6">
      {/* Row 1: Repairs + Repair Percentage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <KpiSection title={t("dashboard.kpi.repairsByProblem")}>
          {kpiData.repairKpi.length === 0 ? (
            <p className="text-sm text-stone-400">{t("dashboard.kpi.noData")}</p>
          ) : (
            <div className="space-y-2.5">
              {kpiData.repairKpi
                .sort((a, b) => b.repairCount - a.repairCount)
                .map((row, idx) => {
                  const catInfo = PRODUCT_CATEGORIES[row.category as keyof typeof PRODUCT_CATEGORIES];
                  return (
                    <div key={idx} className="bg-white rounded-md border border-stone-100 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-stone-700">
                          {catInfo?.icon || "📦"} {t(`category.${row.category}` as TKey)} — {row.brand}
                        </span>
                        <span className="text-sm text-stone-600 font-semibold">
                          {row.repairCount} {t("dashboard.kpi.repairs")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-400">{t("dashboard.kpi.topIssue")}:</span>
                        <span className="text-xs text-teal-700 font-medium">{translateIssue(row.topIssue)}</span>
                        <span className="text-xs text-stone-300">({row.topIssueCount}x)</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </KpiSection>

        <KpiSection title={t("dashboard.kpi.repairPercentage")}>
          <div className="space-y-3">
            {kpiData.repairPercentage
              .filter((r) => r.percentage > 0)
              .sort((a, b) => b.percentage - a.percentage)
              .map((row, idx) => {
                const catInfo = PRODUCT_CATEGORIES[row.category as keyof typeof PRODUCT_CATEGORIES];
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-stone-600">
                        {catInfo?.icon || "📦"} {t(`category.${row.category}` as TKey)} — {row.brand}
                      </span>
                      <span className="text-sm font-semibold text-teal-700">{row.percentage}%</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-teal-600 h-full rounded-full transition-all" style={{ width: `${row.percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            {kpiData.repairPercentage.filter((r) => r.percentage > 0).length === 0 && (
              <p className="text-sm text-stone-400">{t("dashboard.kpi.noData")}</p>
            )}
          </div>
        </KpiSection>
      </div>

      {/* Row 2: Lifecycle + Registration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <KpiSection title={t("dashboard.kpi.avgLifecycle")}>
          {kpiData.lifecycleKpi.length === 0 ? (
            <p className="text-sm text-stone-400">{t("dashboard.kpi.noData")}</p>
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
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-600">
                          {catInfo?.icon || "📦"} {t(`category.${row.category}` as TKey)} — {row.brand}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-teal-700">{label.trim()}</span>
                          <span className="text-xs text-stone-300">({row.count})</span>
                        </div>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-teal-500 h-full rounded-full transition-all" style={{ width: `${(row.avgMonths / maxMonths) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </KpiSection>

        <KpiSection title={t("dashboard.kpi.registeredPercentage")}>
          <div className="space-y-3">
            {kpiData.registeredPercentage
              .sort((a, b) => b.percentage - a.percentage)
              .map((row, idx) => {
                const catInfo = PRODUCT_CATEGORIES[row.category as keyof typeof PRODUCT_CATEGORIES];
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-stone-600">
                        {catInfo?.icon || "📦"} {t(`category.${row.category}` as TKey)} — {row.brand}
                      </span>
                      <span className="text-sm font-semibold text-teal-700">{row.percentage}%</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-teal-600 h-full rounded-full transition-all" style={{ width: `${row.percentage}%` }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </KpiSection>
      </div>

      {/* Row 3: Second-Hand Resale */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <KpiSection title={t("dashboard.kpi.resalePercentage")}>
          <div className="space-y-3">
            {kpiData.resalePercentage
              .sort((a, b) => b.percentage - a.percentage)
              .map((row, idx) => {
                const catInfo = PRODUCT_CATEGORIES[row.category as keyof typeof PRODUCT_CATEGORIES];
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-stone-600">
                        {catInfo?.icon || "📦"} {t(`category.${row.category}` as TKey)} — {row.brand}
                      </span>
                      <div className="flex items-center gap-2">
                        {(row.resold ?? 0) > 0 && (
                          <span className="text-xs text-stone-400">({row.resold} {t("dashboard.kpi.products")})</span>
                        )}
                        <span className="text-sm font-semibold text-teal-700">{row.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-teal-500 h-full rounded-full transition-all" style={{ width: `${row.percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            {kpiData.resalePercentage.filter((r) => r.percentage > 0).length === 0 && (
              <p className="text-sm text-stone-400">{t("dashboard.kpi.noResaleData")}</p>
            )}
            {(() => {
              const totalWeight = kpiData.resalePercentage.reduce((sum, r) => sum + (r.resoldWeight || 0), 0);
              const totalResold = kpiData.resalePercentage.reduce((sum, r) => sum + (r.resold || 0), 0);
              if (totalResold > 0) {
                return (
                  <div className="border-t border-stone-200 pt-3 mt-2 flex items-center justify-between">
                    <span className="text-sm text-stone-500">{t("dashboard.kpi.totalResaleWeight")}</span>
                    <span className="text-sm font-semibold text-teal-700">{totalWeight.toFixed(1)} kg</span>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </KpiSection>
      </div>
    </div>
  );
}

/* -- Recycler KPIs -- */
function RecyclerKpis({ data, t }: { data: RecyclerKpi; t: (key: TKey) => string }) {
  const totalCondition = data.conditionCounts.functional + data.conditionCounts.partiallyFunctional + data.conditionCounts.nonFunctional;
  const totalDatapoints = data.realVsEstimated.real + data.realVsEstimated.estimated;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <KpiSection title={t("dashboard.kpi.recyclingRateByBrand")}>
          <div className="space-y-3">
            {data.recyclingRateByBrand
              .sort((a, b) => b.avgRate - a.avgRate)
              .map((row, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-600 font-medium">{row.brand}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-teal-700">{row.avgRate}%</span>
                      <span className="text-xs text-stone-300">({row.count})</span>
                    </div>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full transition-all" style={{ width: `${row.avgRate}%` }} />
                  </div>
                </div>
              ))}
          </div>
        </KpiSection>

        <KpiSection title={t("dashboard.kpi.conditionBreakdown")}>
          {totalCondition > 0 ? (
            <div className="space-y-3">
              <ConditionBar
                label={t("dashboard.kpi.nonFunctional")}
                value={data.conditionCounts.nonFunctional}
                total={totalCondition}
                color="bg-stone-400"
              />
              <ConditionBar
                label={t("dashboard.kpi.partiallyFunctional")}
                value={data.conditionCounts.partiallyFunctional}
                total={totalCondition}
                color="bg-teal-400"
              />
              <ConditionBar
                label={t("dashboard.kpi.functional")}
                value={data.conditionCounts.functional}
                total={totalCondition}
                color="bg-teal-600"
              />
            </div>
          ) : (
            <p className="text-sm text-stone-400">{t("dashboard.kpi.noData")}</p>
          )}
        </KpiSection>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <KpiSection title={t("dashboard.kpi.realVsEstimated")}>
          {totalDatapoints > 0 ? (
            <div className="space-y-3">
              <ConditionBar
                label={t("dashboard.kpi.realData")}
                value={data.realVsEstimated.real}
                total={totalDatapoints}
                color="bg-teal-700"
              />
              <ConditionBar
                label={t("dashboard.kpi.estimatedData")}
                value={data.realVsEstimated.estimated}
                total={totalDatapoints}
                color="bg-stone-300"
              />
            </div>
          ) : (
            <p className="text-sm text-stone-400">{t("dashboard.kpi.noData")}</p>
          )}
        </KpiSection>
      </div>
    </div>
  );
}

/* -- Repair Tech KPIs -- */
function RepairTechKpis({ data, t, translateIssue }: { data: RepairTechKpi; t: (key: TKey) => string; translateIssue: (issue: string) => string }) {
  const totalStatus = data.statusCounts.passed + data.statusCounts.conditional + data.statusCounts.failed;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <KpiSection title={t("dashboard.kpi.mostCommonIssues")}>
          <div className="space-y-3">
            {data.topIssues.map((row, idx) => {
              const maxCount = data.topIssues[0]?.count || 1;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-600">{translateIssue(row.issue)}</span>
                    <span className="text-sm font-semibold text-teal-700">{row.count}x</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full transition-all" style={{ width: `${(row.count / maxCount) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </KpiSection>

        <KpiSection title={t("dashboard.kpi.repairSuccessRate")}>
          {totalStatus > 0 ? (
            <div className="space-y-3">
              <ConditionBar label={t("dashboard.kpi.passed")} value={data.statusCounts.passed} total={totalStatus} color="bg-teal-600" />
              <ConditionBar label={t("dashboard.kpi.conditional")} value={data.statusCounts.conditional} total={totalStatus} color="bg-teal-400" />
              <ConditionBar label={t("dashboard.kpi.failed")} value={data.statusCounts.failed} total={totalStatus} color="bg-stone-400" />
            </div>
          ) : (
            <p className="text-sm text-stone-400">{t("dashboard.kpi.noData")}</p>
          )}
        </KpiSection>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <KpiSection title={t("dashboard.kpi.avgRepairCost")}>
          <div className="space-y-3">
            {data.costByCategory
              .sort((a, b) => b.avgCost - a.avgCost)
              .map((row, idx) => {
                const catInfo = PRODUCT_CATEGORIES[row.category as keyof typeof PRODUCT_CATEGORIES];
                const maxCost = Math.max(...data.costByCategory.map((r) => r.avgCost), 1);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-stone-600">
                        {catInfo?.icon || "📦"} {t(`category.${row.category}` as TKey)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-stone-700">R$ {row.avgCost}</span>
                        <span className="text-xs text-stone-300">({row.count} {t("dashboard.kpi.repairs")})</span>
                      </div>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-teal-500 h-full rounded-full transition-all" style={{ width: `${(row.avgCost / maxCost) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </KpiSection>
      </div>
    </div>
  );
}

/* -- Condition/Percentage Bar (reusable) -- */
function ConditionBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-stone-600">{label}</span>
        <span className="text-sm font-semibold text-stone-700">{value} ({pct}%)</span>
      </div>
      <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
        <div className={`${color} h-full rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
