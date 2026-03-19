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

  const [totalRepairs, totalEOL, totalOwnership, registeredCount, secondHandResaleCount] = await Promise.all([
    prisma.repairEvent.count(),
    prisma.endOfLifeRecord.count(),
    prisma.ownershipEvent.count(),
    prisma.ownershipEvent.count({ where: { eventType: "REGISTERED" } }),
    prisma.ownershipEvent.count({ where: { eventType: "SECOND_HAND_RESALE" } }),
  ]);

  const realDataCount = await prisma.endOfLifeRecord.count({
    where: { isRealData: true },
  });

  // Fetch repair events with product details for KPIs
  const repairEvents = await prisma.repairEvent.findMany({
    select: {
      issueDescription: true,
      product: {
        select: { category: true, brand: true },
      },
    },
  });

  // Fetch ownership events with product details for KPIs
  const ownershipEvents = await prisma.ownershipEvent.findMany({
    where: { eventType: { in: ["REGISTERED", "SECOND_HAND_RESALE"] } },
    select: {
      eventType: true,
      product: {
        select: { category: true, brand: true },
      },
    },
  });

  // Fetch recycled products with manufacturing date and EOL processing date for lifecycle KPI
  const recycledProducts = await prisma.product.findMany({
    where: { lifecycleStage: "RECYCLED" },
    select: {
      category: true,
      brand: true,
      manufacturingDate: true,
      endOfLifeRecords: {
        select: { processingDate: true },
        take: 1,
        orderBy: { processingDate: "desc" },
      },
    },
  });

  // Build repair KPI data: by category+brand, count + most common issue
  const repairByGroup: Record<string, { count: number; issues: Record<string, number> }> = {};
  for (const re of repairEvents) {
    const key = `${re.product.category}|${re.product.brand}`;
    if (!repairByGroup[key]) repairByGroup[key] = { count: 0, issues: {} };
    repairByGroup[key].count++;
    const issue = re.issueDescription;
    repairByGroup[key].issues[issue] = (repairByGroup[key].issues[issue] || 0) + 1;
  }

  const repairKpiData = Object.entries(repairByGroup).map(([key, data]) => {
    const [category, brand] = key.split("|");
    const topIssue = Object.entries(data.issues).sort((a, b) => b[1] - a[1])[0];
    return {
      category,
      brand,
      repairCount: data.count,
      topIssue: topIssue ? topIssue[0] : "N/A",
      topIssueCount: topIssue ? topIssue[1] : 0,
    };
  });

  // Build product counts by category+brand for percentage calculations
  const productsByGroup: Record<string, number> = {};
  for (const p of products) {
    const key = `${p.category}|${p.brand}`;
    productsByGroup[key] = (productsByGroup[key] || 0) + 1;
  }

  // Repair percentage by category+brand
  const repairPercentageData = Object.entries(productsByGroup).map(([key, total]) => {
    const [category, brand] = key.split("|");
    const repaired = repairByGroup[key]?.count || 0;
    return { category, brand, total, repaired, percentage: total > 0 ? Math.round((repaired / total) * 100) : 0 };
  });

  // Registered percentage by category+brand
  const registeredByGroup: Record<string, number> = {};
  for (const oe of ownershipEvents) {
    if (oe.eventType === "REGISTERED") {
      const key = `${oe.product.category}|${oe.product.brand}`;
      registeredByGroup[key] = (registeredByGroup[key] || 0) + 1;
    }
  }
  const registeredPercentageData = Object.entries(productsByGroup).map(([key, total]) => {
    const [category, brand] = key.split("|");
    const registered = registeredByGroup[key] || 0;
    return { category, brand, total, registered, percentage: total > 0 ? Math.round((registered / total) * 100) : 0 };
  });

  // Second-hand resale percentage by category+brand
  const resaleByGroup: Record<string, number> = {};
  for (const oe of ownershipEvents) {
    if (oe.eventType === "SECOND_HAND_RESALE") {
      const key = `${oe.product.category}|${oe.product.brand}`;
      resaleByGroup[key] = (resaleByGroup[key] || 0) + 1;
    }
  }
  const resalePercentageData = Object.entries(productsByGroup).map(([key, total]) => {
    const [category, brand] = key.split("|");
    const resold = resaleByGroup[key] || 0;
    return { category, brand, total, resold, percentage: total > 0 ? Math.round((resold / total) * 100) : 0 };
  });

  // Average lifecycle of recycled products by category+brand
  const lifecycleByGroup: Record<string, { totalMonths: number; count: number }> = {};
  for (const rp of recycledProducts) {
    const eolDate = rp.endOfLifeRecords[0]?.processingDate;
    if (!eolDate) continue;
    const months = Math.round(
      (eolDate.getTime() - rp.manufacturingDate.getTime()) / (30.44 * 24 * 60 * 60 * 1000)
    );
    const key = `${rp.category}|${rp.brand}`;
    if (!lifecycleByGroup[key]) lifecycleByGroup[key] = { totalMonths: 0, count: 0 };
    lifecycleByGroup[key].totalMonths += months;
    lifecycleByGroup[key].count++;
  }
  const lifecycleKpiData = Object.entries(lifecycleByGroup).map(([key, data]) => {
    const [category, brand] = key.split("|");
    return { category, brand, avgMonths: Math.round(data.totalMonths / data.count), count: data.count };
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
    registeredCount,
    secondHandResaleCount,
  };

  const kpiData = {
    repairKpi: repairKpiData,
    repairPercentage: repairPercentageData,
    registeredPercentage: registeredPercentageData,
    resalePercentage: resalePercentageData,
    lifecycleKpi: lifecycleKpiData,
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
      kpiData={kpiData}
    />
  );
}
