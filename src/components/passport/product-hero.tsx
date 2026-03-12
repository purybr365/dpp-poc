import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LIFECYCLE_STAGES } from "@/lib/constants";
import { buildGS1Path } from "@/lib/gs1";

interface ProductHeroProps {
  product: Record<string, unknown>;
  category?: { pt: string; en: string; icon: string };
  productId?: string;
  gtin?: string;
  serialNumber?: string;
}

export function ProductHero({ product, category, productId, gtin, serialNumber }: ProductHeroProps) {
  const stage = LIFECYCLE_STAGES[product.lifecycleStage as keyof typeof LIFECYCLE_STAGES];
  const mfgDate = product.manufacturingDate
    ? new Date(product.manufacturingDate as string).toLocaleDateString("pt-BR")
    : "N/A";

  const manufacturer = product.manufacturer as { name: string; organization: string } | null;

  // Build QR code URL - use GS1 path if gtin+serial available
  const qrUrl = gtin && serialNumber
    ? `/api/products/${productId}/qr-code?format=svg&gtin=${gtin}&serial=${serialNumber}`
    : productId
    ? `/api/products/${productId}/qr-code?format=svg`
    : null;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Icon / Image area */}
          <div className="flex-shrink-0 w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center">
            <span className="text-5xl">{category?.icon || "📦"}</span>
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {product.brand as string} {product.model as string}
                </h1>
                <p className="text-slate-500">{category?.pt || (product.category as string)}</p>
              </div>
              <Badge
                className={`text-sm ${
                  product.lifecycleStage === "RECYCLED"
                    ? "bg-emerald-100 text-emerald-700"
                    : product.lifecycleStage === "IN_USE"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {stage?.pt || (product.lifecycleStage as string)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-slate-400 block text-xs">Serial</span>
                <span className="font-mono text-slate-700">{product.serialNumber as string}</span>
              </div>
              {!!product.gtin && (
                <div>
                  <span className="text-slate-400 block text-xs">GTIN</span>
                  <span className="font-mono text-slate-700">{product.gtin as string}</span>
                </div>
              )}
              <div>
                <span className="text-slate-400 block text-xs">Fabricação</span>
                <span className="text-slate-700">{mfgDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Fábrica</span>
                <span className="text-slate-700">{product.manufacturingFacility as string}</span>
              </div>
            </div>

            {manufacturer && (
              <div className="text-xs text-slate-400">
                Fabricante: {manufacturer.organization || manufacturer.name}
              </div>
            )}

            <div className="text-xs font-mono text-slate-300 break-all">
              {product.uid as string}
            </div>
          </div>

          {/* QR Code */}
          {qrUrl && (
            <div className="flex-shrink-0 flex flex-col items-center gap-1 md:self-start self-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt="QR Code do Passaporte Digital"
                width={120}
                height={120}
                className="rounded"
              />
              <span className="text-[10px] text-slate-400">Escaneie para acessar</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
