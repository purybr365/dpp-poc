import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/dashboard-client";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as { role?: string }).role || "CONSUMER";

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      gtin: true,
      serialNumber: true,
      brand: true,
      model: true,
      category: true,
      lifecycleStage: true,
      manufacturingDate: true,
      manufacturingFacility: true,
    },
  });

  const [totalRepairs, totalEOL, totalOwnership] = await Promise.all([
    prisma.repairEvent.count(),
    prisma.endOfLifeRecord.count(),
    prisma.ownershipEvent.count(),
  ]);

  const realDataCount = await prisma.endOfLifeRecord.count({
    where: { isRealData: true },
  });

  const stats = {
    totalProducts: products.length,
    recycled: products.filter((p) => p.lifecycleStage === "RECYCLED").length,
    inUse: products.filter((p) => p.lifecycleStage === "IN_USE").length,
    manufactured: products.filter((p) => p.lifecycleStage === "MANUFACTURED").length,
    underRepair: products.filter((p) => p.lifecycleStage === "UNDER_REPAIR").length,
    sold: products.filter((p) => p.lifecycleStage === "SOLD").length,
    totalRepairs,
    totalEOL,
    totalOwnership,
    realDataCount,
  };

  return (
    <DashboardClient
      products={products.map((p) => ({
        ...p,
        manufacturingDate: p.manufacturingDate.toISOString(),
      }))}
      role={role}
      userName={session.user.name || ""}
      userOrganization={session.user.organization || null}
      stats={stats}
    />
  );
}
