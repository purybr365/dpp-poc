import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";
import { buildGS1Path } from "@/lib/gs1";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true, uid: true, brand: true, model: true, gtin: true, serialNumber: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const format = request.nextUrl.searchParams.get("format") || "svg";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;

  // Use GS1 Digital Link URL if gtin is available
  const passportPath = product.gtin
    ? buildGS1Path(product.gtin, product.serialNumber)
    : `/passport/${product.id}`;
  const passportUrl = `${baseUrl}${passportPath}`;

  if (format === "png") {
    const buffer = await QRCode.toBuffer(passportUrl, {
      type: "png",
      width: 400,
      margin: 2,
      color: { dark: "#1e293b", light: "#ffffff" },
    });
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  const svg = await QRCode.toString(passportUrl, {
    type: "svg",
    width: 400,
    margin: 2,
    color: { dark: "#1e293b", light: "#ffffff" },
  });

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
