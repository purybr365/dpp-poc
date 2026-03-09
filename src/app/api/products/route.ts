import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "MANUFACTURER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();

  const gtin = body.gtin || `789${Math.floor(Math.random() * 100000000).toString().padStart(8, "0")}0`;
  const uid = `urn:dpp:br:${gtin}:${body.serialNumber}`;

  const product = await prisma.product.create({
    data: {
      uid,
      gtin,
      serialNumber: body.serialNumber,
      category: body.category,
      brand: body.brand,
      model: body.model,
      productCode: body.productCode || null,
      manufacturingDate: new Date(body.manufacturingDate),
      manufacturingFacility: body.manufacturingFacility,
      batchNumber: body.batchNumber || null,
      lifecycleStage: "MANUFACTURED",
      manufacturerId: session.user.id,
      supplyChainData: body.supplyChainData || {},
      environmentalData: body.environmentalData || {},
      operatingManualData: body.operatingManualData || {},
      regulatoryData: body.regulatoryData || {},
    },
  });

  return NextResponse.json(product, { status: 201 });
}
