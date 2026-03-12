import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { buildGS1Path } from "@/lib/gs1";

/**
 * Legacy passport route — redirects to GS1 Digital Link format.
 * /passport/{uuid} → /passport/01/{gtin}/21/{serial}
 */
export default async function LegacyPassportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true, gtin: true, serialNumber: true },
  });

  if (!product) {
    notFound();
  }

  if (product.gtin) {
    redirect(buildGS1Path(product.gtin, product.serialNumber));
  }

  // Fallback: if no GTIN, show a not-found since we can't build GS1 URL
  notFound();
}
