"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLocale } from "@/lib/i18n/locale-context";
import type { TKey } from "@/lib/i18n/translations";

export default function AboutPage() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80">
          <span className="text-2xl">📋</span>
          <span className="font-bold text-lg text-slate-900">{t("nav.title")}</span>
        </Link>
        <Badge variant="secondary" className="text-xs">
          {t("about.archDocs")}
        </Badge>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {t("about.title")}
          </h1>
          <p className="text-slate-500 text-lg">
            {t("about.subtitle")}
          </p>
        </div>

        {/* Section 1: Product Identification */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🔑 {t("about.urnTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm">
              <span className="text-slate-400">urn:dpp:br:</span>
              <span className="text-blue-600 font-semibold">789786730430</span>
              <span className="text-slate-400">:</span>
              <span className="text-emerald-600 font-semibold">6AB339440</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-3">
                <span className="text-xs text-slate-400 block mb-1">Namespace</span>
                <code className="text-sm font-mono text-slate-700">urn:dpp:br</code>
                <p className="text-xs text-slate-500 mt-1">
                  {t("about.urnNamespace")}
                </p>
              </div>
              <div className="border rounded-lg p-3">
                <span className="text-xs text-slate-400 block mb-1">
                  GTIN <Badge variant="outline" className="text-[10px] ml-1">13 dígitos</Badge>
                </span>
                <code className="text-sm font-mono text-blue-600">789786730430</code>
                <p className="text-xs text-slate-500 mt-1">
                  {t("about.urnGtin")}
                </p>
              </div>
              <div className="border rounded-lg p-3">
                <span className="text-xs text-slate-400 block mb-1">{t("about.urnSerialLabel")}</span>
                <code className="text-sm font-mono text-emerald-600">6AB339440</code>
                <p className="text-xs text-slate-500 mt-1">
                  {t("about.urnSerial")}
                </p>
              </div>
              <div className="border rounded-lg p-3">
                <span className="text-xs text-slate-400 block mb-1">{t("about.urnProduction")}</span>
                <p className="text-xs text-slate-500">
                  {t("about.urnProductionDesc")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Manufacturer Registration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🏭 {t("about.mfgRegTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              {t("about.mfgRegDesc")}
            </p>

            <div className="bg-slate-50 rounded-lg p-4">
              <span className="text-xs text-slate-400 block mb-3">{t("about.mfgRegAnalogy")}</span>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-white border rounded px-3 py-2 text-center">
                  <span className="text-xs text-slate-400 block">GS1 Brasil</span>
                  <span className="text-sm font-medium">{t("about.mfgRegCompanyPrefix")}</span>
                </div>
                <span className="text-slate-300">→</span>
                <div className="bg-white border rounded px-3 py-2 text-center">
                  <span className="text-xs text-slate-400 block">{t("passport.manufacturer")}</span>
                  <span className="text-sm font-medium">{t("about.mfgRegProductCode")}</span>
                </div>
                <span className="text-slate-300">→</span>
                <div className="bg-white border rounded px-3 py-2 text-center">
                  <span className="text-xs text-slate-400 block">{t("passport.manufacturer")}</span>
                  <span className="text-sm font-medium">{t("about.mfgRegSerialNumber")}</span>
                </div>
                <span className="text-slate-300">=</span>
                <div className="bg-blue-50 border-blue-200 border rounded px-3 py-2 text-center">
                  <span className="text-xs text-blue-400 block">DPP</span>
                  <span className="text-sm font-semibold text-blue-700">{t("about.mfgRegUniqueUid")}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-600">{t("about.mfgRegBullet1")}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-600">{t("about.mfgRegBullet2")}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-600">{t("about.mfgRegBullet3")}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">◆</span>
                <span className="text-slate-600">{t("about.mfgRegBullet4")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Data Sources */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              📊 {t("about.dataSourcesTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-100 text-green-700 text-xs">{t("about.realData")}</Badge>
                  <span className="text-sm font-semibold">{t("about.realDataProducts")}</span>
                </div>
                <p className="text-xs text-slate-500">
                  {t("about.realDataDesc")}
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-slate-400">• JG-SUSTENTARE (Alvorada, RS)</p>
                  <p className="text-xs text-slate-400">• WK Solutions (São Paulo, SP)</p>
                  <p className="text-xs text-slate-400">• Greentech (Belo Horizonte, MG)</p>
                </div>
              </div>

              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-100 text-blue-700 text-xs">{t("about.mockData")}</Badge>
                  <span className="text-sm font-semibold">{t("about.mockDataProducts")}</span>
                </div>
                <p className="text-xs text-slate-500">
                  {t("about.mockDataDesc")}
                </p>
              </div>

              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-purple-100 text-purple-700 text-xs">{t("about.hybridData")}</Badge>
                </div>
                <p className="text-xs text-slate-500">
                  {t("about.hybridDataDesc")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Recycling Rate */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              ♻️ {t("about.recyclingRateTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-amber-200 bg-amber-50 rounded-lg p-3">
                <span className="text-xs text-amber-600 font-medium block mb-1">
                  {t("about.recyclingRatePocLabel")}
                </span>
                <p className="text-sm text-slate-700">
                  {t("about.recyclingRatePocDesc")}
                </p>
                <code className="text-xs text-slate-400 mt-2 block font-mono">
                  75 + Math.random() × 15
                </code>
              </div>

              <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-3">
                <span className="text-xs text-emerald-600 font-medium block mb-1">
                  {t("about.recyclingRateProdLabel")}
                </span>
                <p className="text-sm text-slate-700">
                  {t("about.recyclingRateProdDesc")}
                </p>
                <div className="bg-white rounded p-2 mt-2 text-xs font-mono text-center">
                  taxa = (Σ materiais extraídos) ÷ peso total × 100
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {t("about.recyclingRateProdFormula")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Consumer Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🔒 {t("about.privacyTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              {t("about.privacyDesc")}
            </p>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-white border rounded px-3 py-2 text-center">
                  <span className="text-xs text-slate-400 block">{t("about.privacyRetailerSystem")}</span>
                  <span className="text-sm">{t("about.privacyRetailerData")}</span>
                </div>
                <span className="text-slate-300">→</span>
                <div className="bg-white border rounded px-3 py-2 text-center">
                  <span className="text-xs text-slate-400 block">Hash</span>
                  <span className="text-sm font-mono">f(dados) = 3tylgm0o</span>
                </div>
                <span className="text-slate-300">→</span>
                <div className="bg-green-50 border-green-200 border rounded px-3 py-2 text-center">
                  <span className="text-xs text-green-600 block">DPP</span>
                  <span className="text-sm font-mono">consumerIdHash</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-600">
                  <strong>consumerIdHash</strong> — {t("about.privacyBullet1").replace("consumerIdHash — ", "")}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-600">{t("about.privacyBullet2")}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-600">{t("about.privacyBullet3")}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-600">{t("about.privacyBullet4")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: RBAC Model */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              👥 {t("about.rbacTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              {t("about.rbacDesc")}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 text-slate-400">{t("about.rbacSection")}</th>
                    <th className="p-2 text-center text-slate-400">{t("about.rbacManufacturer")}</th>
                    <th className="p-2 text-center text-slate-400">{t("about.rbacRetailer")}</th>
                    <th className="p-2 text-center text-slate-400">{t("about.rbacConsumer")}</th>
                    <th className="p-2 text-center text-slate-400">{t("about.rbacTechnician")}</th>
                    <th className="p-2 text-center text-slate-400">{t("about.rbacRecycler")}</th>
                    <th className="p-2 text-center text-slate-400">{t("about.rbacRegulator")}</th>
                  </tr>
                </thead>
                <tbody>
                  <RBACRow section={t("about.rbacIdentification")} levels={["full", "read", "read", "read", "read", "full"]} t={t} />
                  <RBACRow section={t("about.rbacSupplyChain")} levels={["full", "summary", "hidden", "summary", "summary", "full"]} t={t} />
                  <RBACRow section={t("about.rbacEnvironmental")} levels={["full", "read", "simplified", "read", "read", "full"]} t={t} />
                  <RBACRow section={t("about.rbacManual")} levels={["full", "read", "read", "read", "hidden", "full"]} t={t} />
                  <RBACRow section={t("about.rbacRepair")} levels={["read", "partial", "own", "write", "read", "full"]} t={t} />
                  <RBACRow section={t("about.rbacOwnership")} levels={["read", "read", "own", "hidden", "read", "full"]} t={t} />
                  <RBACRow section={t("about.rbacEol")} levels={["read", "hidden", "hidden", "hidden", "write", "full"]} t={t} />
                  <RBACRow section={t("about.rbacRegulatory")} levels={["read", "hidden", "hidden", "hidden", "hidden", "full"]} t={t} />
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap gap-2">
              <AccessBadge level="full" label={t("about.rbacFull")} />
              <AccessBadge level="read" label={t("about.rbacRead")} />
              <AccessBadge level="write" label={t("about.rbacWrite")} />
              <AccessBadge level="summary" label={t("about.rbacSummary")} />
              <AccessBadge level="simplified" label={t("about.rbacSimplified")} />
              <AccessBadge level="partial" label={t("about.rbacPartial")} />
              <AccessBadge level="own" label={t("about.rbacOwn")} />
              <AccessBadge level="hidden" label={t("about.rbacHidden")} />
            </div>
          </CardContent>
        </Card>

        {/* Section 7: Production Roadmap */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🚀 {t("about.roadmapTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 mb-4">
              {t("about.roadmapDesc")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <RoadmapItem
                title="Blockchain / DLT"
                description={t("about.roadmapBlockchain")}
              />
              <RoadmapItem
                title="GS1 Digital Link"
                description={t("about.roadmapGs1")}
              />
              <RoadmapItem
                title="GTIN Validation"
                description={t("about.roadmapGtinValidation")}
              />
              <RoadmapItem
                title="Multi-tenancy"
                description={t("about.roadmapMultiTenancy")}
              />
              <RoadmapItem
                title="IoT Telemetry"
                description={t("about.roadmapIot")}
              />
              <RoadmapItem
                title="EU ESPR Interop"
                description={t("about.roadmapEspr")}
              />
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Tech Stack */}
        <div className="text-center text-sm text-slate-400 space-y-2">
          <p className="font-medium text-slate-500">{t("about.techStack")}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="text-xs">Next.js 16</Badge>
            <Badge variant="outline" className="text-xs">TypeScript</Badge>
            <Badge variant="outline" className="text-xs">Prisma 7</Badge>
            <Badge variant="outline" className="text-xs">SQLite</Badge>
            <Badge variant="outline" className="text-xs">NextAuth.js v5</Badge>
            <Badge variant="outline" className="text-xs">Tailwind CSS v4</Badge>
            <Badge variant="outline" className="text-xs">shadcn/ui</Badge>
          </div>
          <p className="text-xs">
            {t("about.realDataFooter")}
          </p>
        </div>
      </div>
    </div>
  );
}

function RBACRow({ section, levels, t }: { section: string; levels: string[]; t: (key: TKey) => string }) {
  const colorMap: Record<string, string> = {
    full: "bg-emerald-100 text-emerald-700",
    read: "bg-blue-100 text-blue-700",
    write: "bg-orange-100 text-orange-700",
    summary: "bg-yellow-100 text-yellow-700",
    simplified: "bg-purple-100 text-purple-700",
    partial: "bg-cyan-100 text-cyan-700",
    own: "bg-pink-100 text-pink-700",
    hidden: "bg-slate-100 text-slate-400",
  };

  const labelKeyMap: Record<string, TKey> = {
    full: "about.rbacFull",
    read: "about.rbacRead",
    write: "about.rbacWrite",
    summary: "about.rbacSummary",
    simplified: "about.rbacSimplified",
    partial: "about.rbacPartial",
    own: "about.rbacOwn",
    hidden: "about.rbacHidden",
  };

  return (
    <tr className="border-b hover:bg-slate-50">
      <td className="p-2 text-slate-700 font-medium">{section}</td>
      {levels.map((level, i) => (
        <td key={i} className="p-2 text-center">
          <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${colorMap[level] || ""}`}>
            {level === "hidden" ? "—" : t(labelKeyMap[level])}
          </span>
        </td>
      ))}
    </tr>
  );
}

function AccessBadge({ level, label }: { level: string; label: string }) {
  const colorMap: Record<string, string> = {
    full: "bg-emerald-100 text-emerald-700",
    read: "bg-blue-100 text-blue-700",
    write: "bg-orange-100 text-orange-700",
    summary: "bg-yellow-100 text-yellow-700",
    simplified: "bg-purple-100 text-purple-700",
    partial: "bg-cyan-100 text-cyan-700",
    own: "bg-pink-100 text-pink-700",
    hidden: "bg-slate-100 text-slate-400",
  };

  return (
    <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-medium ${colorMap[level] || ""}`}>
      {label}
    </span>
  );
}

function RoadmapItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-3">
      <span className="text-slate-300 mt-0.5">◇</span>
      <div>
        <span className="text-sm font-medium text-slate-700">{title}</span>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}
