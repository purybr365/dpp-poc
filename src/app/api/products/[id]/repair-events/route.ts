import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "REPAIR_TECH") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const repair = await prisma.repairEvent.create({
    data: {
      productId: id,
      technicianId: session.user.id,
      date: new Date(body.date),
      issueDescription: body.issueDescription,
      partsReplaced: body.partsReplaced || [],
      laborCost: body.laborCost || null,
      totalCost: body.totalCost || null,
      postRepairStatus: body.postRepairStatus || "passed",
      notes: body.notes || null,
    },
  });

  // Update lifecycle stage if needed
  if (product.lifecycleStage === "IN_USE") {
    await prisma.product.update({
      where: { id },
      data: { lifecycleStage: "UNDER_REPAIR" },
    });
  }

  return NextResponse.json(repair, { status: 201 });
}
