import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { filterPassportByRole, FullPassport } from "@/lib/passport-filter";
import type { Role } from "@/lib/rbac-matrix";
import { RBAC_MATRIX, SECTION_LABELS, ROLE_LABELS_PT } from "@/lib/rbac-matrix";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductHero } from "@/components/passport/product-hero";
import { LifecycleTimeline } from "@/components/passport/lifecycle-timeline";
import { SupplyChainSection } from "@/components/passport/supply-chain-section";
import { EnvironmentalSection } from "@/components/passport/environmental-section";
import { RepairSection } from "@/components/passport/repair-section";
import { OwnershipSection } from "@/components/passport/ownership-section";
import { EndOfLifeSection } from "@/components/passport/end-of-life-section";
import { RegulatorySection } from "@/components/passport/regulatory-section";
import { OperatingManualSection } from "@/components/passport/operating-manual-section";

export default async function PassportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const role = (session?.user?.role as Role) || "CONSUMER";

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      repairEvents: { orderBy: { date: "desc" } },
      ownershipEvents: { orderBy: { date: "asc" } },
      endOfLifeRecords: { orderBy: { createdAt: "desc" } },
      manufacturer: { select: { name: true, organization: true } },
    },
  });

  if (!product) {
    notFound();
  }

  const fullPassport: FullPassport = {
    productIdentification: {
      id: product.id,
      uid: product.uid,
      gtin: product.gtin,
      serialNumber: product.serialNumber,
      category: product.category,
      brand: product.brand,
      model: product.model,
      productCode: product.productCode,
      manufacturingDate: product.manufacturingDate,
      manufacturingFacility: product.manufacturingFacility,
      batchNumber: product.batchNumber,
      lifecycleStage: product.lifecycleStage,
      manufacturer: product.manufacturer,
    },
    supplyChain: product.supplyChainData as Record<string, unknown> | null,
    environmental: product.environmentalData as Record<string, unknown> | null,
    operatingManual: product.operatingManualData as Record<string, unknown> | null,
    repairData: product.repairEvents.map((r) => ({ ...r } as Record<string, unknown>)),
    ownershipEvents: product.ownershipEvents.map((o) => ({ ...o } as Record<string, unknown>)),
    endOfLife: product.endOfLifeRecords.map((e) => ({ ...e } as Record<string, unknown>)),
    regulatory: product.regulatoryData as Record<string, unknown> | null,
  };

  const filtered = filterPassportByRole(fullPassport, role);
  const matrix = RBAC_MATRIX[role];

  const cat = PRODUCT_CATEGORIES[product.category as keyof typeof PRODUCT_CATEGORIES];

  // Build visible tabs
  type SectionKey = keyof typeof SECTION_LABELS;
  const visibleSections = (Object.entries(matrix) as [SectionKey, string][])
    .filter(([, access]) => access !== "hidden")
    .filter(([key]) => key !== "productIdentification") // shown in hero
    .map(([key]) => key);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80">
          <span className="text-2xl">📋</span>
          <span className="font-bold text-lg text-slate-900">DPP Brasil</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/about" className="text-sm text-slate-500 hover:text-slate-700">
            Sobre o DPP
          </Link>
          {session ? (
            <>
              <Badge variant="outline" className="text-xs">
                {ROLE_LABELS_PT[role]}
              </Badge>
              <span className="text-sm text-slate-600">{session.user.name}</span>
            </>
          ) : (
            <Badge variant="secondary" className="text-xs">
              Acesso Público
            </Badge>
          )}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Product Hero */}
        <ProductHero
          product={filtered.productIdentification as Record<string, unknown>}
          category={cat}
          productId={product.id}
        />

        {/* Role Actions */}
        {session && (
          <div className="flex gap-2 mt-4">
            {role === "REPAIR_TECH" && (
              <Link href={`/forms/repair?productId=${product.id}`}>
                <Button size="sm" variant="outline">
                  Registrar Reparo
                </Button>
              </Link>
            )}
            {role === "RECYCLER" && (
              <Link href={`/forms/end-of-life?productId=${product.id}`}>
                <Button size="sm" variant="outline">
                  Registrar Fim de Vida
                </Button>
              </Link>
            )}
          </div>
        )}

        <Separator className="my-6" />

        {/* Lifecycle Timeline */}
        <LifecycleTimeline currentStage={product.lifecycleStage} />

        {/* Passport Sections as Tabs */}
        <Tabs defaultValue={visibleSections[0]} className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0 mb-4">
            {visibleSections.map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className="text-xs data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-full px-3 py-1.5 border"
              >
                {SECTION_LABELS[key].pt}
              </TabsTrigger>
            ))}
          </TabsList>

          {visibleSections.includes("supplyChain") && filtered.supplyChain && (
            <TabsContent value="supplyChain">
              <SupplyChainSection data={filtered.supplyChain} accessLevel={matrix.supplyChain} />
            </TabsContent>
          )}

          {visibleSections.includes("environmental") && filtered.environmental && (
            <TabsContent value="environmental">
              <EnvironmentalSection data={filtered.environmental} accessLevel={matrix.environmental} />
            </TabsContent>
          )}

          {visibleSections.includes("operatingManual") && filtered.operatingManual && (
            <TabsContent value="operatingManual">
              <OperatingManualSection data={filtered.operatingManual} />
            </TabsContent>
          )}

          {visibleSections.includes("repairData") && filtered.repairData && (
            <TabsContent value="repairData">
              <RepairSection events={filtered.repairData} />
            </TabsContent>
          )}

          {visibleSections.includes("ownershipEvents") && filtered.ownershipEvents && (
            <TabsContent value="ownershipEvents">
              <OwnershipSection events={filtered.ownershipEvents} />
            </TabsContent>
          )}

          {visibleSections.includes("endOfLife") && filtered.endOfLife && (
            <TabsContent value="endOfLife">
              <EndOfLifeSection records={filtered.endOfLife} />
            </TabsContent>
          )}

          {visibleSections.includes("regulatory") && filtered.regulatory && (
            <TabsContent value="regulatory">
              <RegulatorySection data={filtered.regulatory} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
