import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true, uid: true, brand: true, model: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const format = request.nextUrl.searchParams.get("format") || "svg";
  const baseUrl = request.nextUrl.origin;
  const passportUrl = `${baseUrl}/passport/${product.id}`;

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
