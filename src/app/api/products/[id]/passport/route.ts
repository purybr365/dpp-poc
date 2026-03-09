import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { filterPassportByRole, FullPassport } from "@/lib/passport-filter";
import type { Role } from "@/lib/rbac-matrix";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  const role = (session?.user?.role as Role) || null;

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
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
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
    repairData: product.repairEvents.map((r) => ({
      id: r.id,
      date: r.date,
      issueDescription: r.issueDescription,
      partsReplaced: r.partsReplaced,
      laborCost: r.laborCost,
      totalCost: r.totalCost,
      currency: r.currency,
      postRepairStatus: r.postRepairStatus,
      notes: r.notes,
      serviceCenterId: r.serviceCenterId,
    })),
    ownershipEvents: product.ownershipEvents.map((o) => ({
      id: o.id,
      eventType: o.eventType,
      date: o.date,
      fromEntity: o.fromEntity,
      toEntity: o.toEntity,
      retailerName: o.retailerName,
      price: o.price,
      currency: o.currency,
      notes: o.notes,
      usageTelemetry: o.usageTelemetry,
    })),
    endOfLife: product.endOfLifeRecords.map((e) => ({
      id: e.id,
      recyclerName: e.recyclerName,
      recyclerCity: e.recyclerCity,
      collectionDate: e.collectionDate,
      collectionLocation: e.collectionLocation,
      processingDate: e.processingDate,
      processingLocation: e.processingLocation,
      functionalStatus: e.functionalStatus,
      cosmeticCondition: e.cosmeticCondition,
      isRusted: e.isRusted,
      isDented: e.isDented,
      isYellowed: e.isYellowed,
      isBroken: e.isBroken,
      isDisassembled: e.isDisassembled,
      isCannibalized: e.isCannibalized,
      otherConditionNotes: e.otherConditionNotes,
      photos: e.photos,
      disassemblyReport: e.disassemblyReport,
      recyclingRate: e.recyclingRate,
      finalDisposition: e.finalDisposition,
      certificateNumber: e.certificateNumber,
      isRealData: e.isRealData,
      dataSource: e.dataSource,
    })),
    regulatory: product.regulatoryData as Record<string, unknown> | null,
  };

  const filtered = filterPassportByRole(fullPassport, role);

  return NextResponse.json({
    passport: filtered,
    userRole: role || "CONSUMER",
  });
}
