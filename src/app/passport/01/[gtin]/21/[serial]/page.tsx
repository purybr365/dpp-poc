import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { filterPassportByRole, FullPassport } from "@/lib/passport-filter";
import type { Role } from "@/lib/rbac-matrix";
import { RBAC_MATRIX } from "@/lib/rbac-matrix";
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
import { PassportNavClient } from "@/components/passport/passport-nav-client";
import { PassportTabsClient } from "@/components/passport/passport-tabs-client";

export default async function PassportGS1Page({
  params,
}: {
  params: Promise<{ gtin: string; serial: string }>;
}) {
  const { gtin, serial } = await params;
  const session = await auth();
  const role = (session?.user?.role as Role) || "CONSUMER";

  // Look up product by GTIN + serial number
  const product = await prisma.product.findFirst({
    where: {
      gtin: gtin,
      serialNumber: serial,
    },
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

  type SectionKey = keyof typeof matrix;
  const visibleSections = (Object.entries(matrix) as [SectionKey, string][])
    .filter(([, access]) => access !== "hidden")
    .filter(([key]) => key !== "productIdentification")
    .map(([key]) => key);

  return (
    <div className="min-h-screen bg-slate-50">
      <PassportNavClient role={role} userName={session?.user?.name || null} />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <ProductHero
          product={filtered.productIdentification as Record<string, unknown>}
          category={cat}
          productId={product.id}
          gtin={product.gtin || undefined}
          serialNumber={product.serialNumber}
        />

        {session && (
          <div className="flex gap-2 mt-4">
            {role === "REPAIR_TECH" && (
              <Link href={`/forms/repair?productId=${product.id}`}>
                <Button size="sm" variant="outline">
                  <PassportTabsClient translationKey="passport.registerRepair" />
                </Button>
              </Link>
            )}
            {role === "RECYCLER" && (
              <Link href={`/forms/end-of-life?productId=${product.id}`}>
                <Button size="sm" variant="outline">
                  <PassportTabsClient translationKey="passport.registerEOL" />
                </Button>
              </Link>
            )}
          </div>
        )}

        <Separator className="my-6" />

        <LifecycleTimeline currentStage={product.lifecycleStage} />

        <Tabs defaultValue={visibleSections[0]} className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0 mb-8">
            {visibleSections.map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className="text-xs data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-full px-3 py-1.5 border"
              >
                <PassportTabsClient translationKey={`section.${key}` as never} />
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
              <OwnershipSection
                events={filtered.ownershipEvents}
                manufacturingFacility={product.manufacturingFacility}
              />
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
