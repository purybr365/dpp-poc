import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "RECYCLER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const eol = await prisma.endOfLifeRecord.create({
    data: {
      productId: id,
      recyclerId: session.user.id,
      recyclerName: body.recyclerName || session.user.organization || "",
      recyclerCity: body.recyclerCity || "",
      collectionDate: body.collectionDate ? new Date(body.collectionDate) : new Date(),
      collectionLocation: body.collectionLocation || "",
      processingLocation: body.processingLocation || "",
      processingDate: body.processingDate ? new Date(body.processingDate) : new Date(),
      functionalStatus: body.functionalStatus || "non_functional",
      cosmeticCondition: body.cosmeticCondition || "poor",
      isRusted: body.isRusted || false,
      isDented: body.isDented || false,
      isYellowed: body.isYellowed || false,
      isBroken: body.isBroken || false,
      isDisassembled: body.isDisassembled || false,
      isCannibalized: body.isCannibalized || false,
      otherConditionNotes: body.otherConditionNotes || null,
      photos: body.photos || [],
      disassemblyReport: body.disassemblyReport || null,
      recyclingRate: body.recyclingRate || null,
      finalDisposition: body.finalDisposition || "recycled",
      certificateNumber: body.certificateNumber || `CERT-${Date.now().toString(36).toUpperCase()}`,
      isRealData: false,
      dataSource: "manual_entry",
    },
  });

  // Update lifecycle stage
  await prisma.product.update({
    where: { id },
    data: { lifecycleStage: "RECYCLED" },
  });

  return NextResponse.json(eol, { status: 201 });
}
