import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES, LIFECYCLE_STAGES } from "@/lib/constants";

const ROLE_LABELS: Record<string, string> = {
  MANUFACTURER: "Fabricante",
  RETAILER: "Varejista",
  CONSUMER: "Consumidor",
  REPAIR_TECH: "Técnico de Reparo",
  RECYCLER: "Reciclador",
  REGULATOR: "Regulador",
};

const ROLE_DESCRIPTIONS: Record<string, string> = {
  MANUFACTURER: "Gerencie passaportes de produtos, acompanhe a produção e cadeia de suprimentos.",
  RETAILER: "Registre vendas, rastreie estoque e consulte passaportes de produtos.",
  CONSUMER: "Consulte informações do seu produto, manual, garantia e histórico.",
  REPAIR_TECH: "Registre reparos, consulte peças e histórico de manutenção.",
  RECYCLER: "Registre dados de fim de vida, desmontagem e materiais extraídos.",
  REGULATOR: "Acesso completo para auditorias, conformidade e estatísticas gerais.",
};

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as { role?: string }).role || "CONSUMER";

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
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

  const categoryBreakdown = products.reduce(
    (acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const brandBreakdown = products.reduce(
    (acc, p) => {
      acc[p.brand] = (acc[p.brand] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <span className="font-bold text-lg text-slate-900">DPP Brasil</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/about" className="text-sm text-slate-500 hover:text-slate-700">
            Sobre o DPP
          </Link>
          <Badge variant="outline">{ROLE_LABELS[role] || role}</Badge>
          <span className="text-sm text-slate-600">{session.user.name}</span>
          {session.user.organization && (
            <span className="text-xs text-slate-400">{session.user.organization}</span>
          )}
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Trocar Perfil
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Role Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Painel — {ROLE_LABELS[role]}
            </h1>
            <p className="text-sm text-slate-500">{ROLE_DESCRIPTIONS[role]}</p>
          </div>
          <div className="flex gap-2">
            {role === "MANUFACTURER" && (
              <Link href="/forms/new-product">
                <Button size="sm">+ Novo Produto</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Role-specific stats */}
        {role === "REGULATOR" && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <StatCard title="Total Produtos" value={stats.totalProducts} />
            <StatCard title="Eventos de Reparo" value={stats.totalRepairs} color="text-orange-600" />
            <StatCard title="Registros de Reciclagem" value={stats.totalEOL} color="text-emerald-600" />
            <StatCard title="Dados Reais" value={stats.realDataCount} color="text-green-600" />
            <StatCard title="Eventos de Propriedade" value={stats.totalOwnership} color="text-purple-600" />
          </div>
        )}

        {role === "MANUFACTURER" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Produtos" value={stats.totalProducts} />
            <StatCard title="Fabricados" value={stats.manufactured} color="text-blue-600" />
            <StatCard title="Em Uso" value={stats.inUse} color="text-green-600" />
            <StatCard title="Reciclados" value={stats.recycled} color="text-emerald-600" />
          </div>
        )}

        {role === "RETAILER" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Produtos" value={stats.totalProducts} />
            <StatCard title="Vendidos" value={stats.sold} color="text-purple-600" />
            <StatCard title="Em Uso" value={stats.inUse} color="text-green-600" />
            <StatCard title="Em Reparo" value={stats.underRepair} color="text-orange-600" />
          </div>
        )}

        {role === "CONSUMER" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <StatCard title="Produtos Registrados" value={stats.totalProducts} />
            <StatCard title="Em Uso" value={stats.inUse} color="text-green-600" />
            <StatCard title="Com Reparo" value={stats.totalRepairs} color="text-orange-600" />
          </div>
        )}

        {role === "REPAIR_TECH" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Produtos" value={stats.totalProducts} />
            <StatCard title="Em Reparo" value={stats.underRepair} color="text-orange-600" />
            <StatCard title="Reparos Realizados" value={stats.totalRepairs} color="text-blue-600" />
            <StatCard title="Em Uso" value={stats.inUse} color="text-green-600" />
          </div>
        )}

        {role === "RECYCLER" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Produtos" value={stats.totalProducts} />
            <StatCard title="Reciclados" value={stats.recycled} color="text-emerald-600" />
            <StatCard title="Registros EOL" value={stats.totalEOL} color="text-green-600" />
            <StatCard title="Dados Reais" value={stats.realDataCount} color="text-blue-600" />
          </div>
        )}

        {/* Category + Brand breakdowns (for Regulator / Manufacturer) */}
        {(role === "REGULATOR" || role === "MANUFACTURER") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-500">Por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(categoryBreakdown).map(([cat, count]) => {
                    const catInfo = PRODUCT_CATEGORIES[cat as keyof typeof PRODUCT_CATEGORIES];
                    return (
                      <div key={cat} className="flex items-center justify-between">
                        <span className="text-sm">
                          {catInfo?.icon || "📦"} {catInfo?.pt || cat}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-blue-500 h-full rounded-full"
                              style={{ width: `${(count / stats.totalProducts) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-right">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-500">Por Marca</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(brandBreakdown)
                    .sort((a, b) => b[1] - a[1])
                    .map(([brand, count]) => (
                      <div key={brand} className="flex items-center justify-between">
                        <span className="text-sm">{brand}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${(count / stats.totalProducts) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lifecycle breakdown (for Regulator) */}
        {role === "REGULATOR" && (
          <Card className="mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-500">Distribuição por Estágio do Ciclo de Vida</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(LIFECYCLE_STAGES).map(([key, stage]) => {
                  const count = products.filter((p) => p.lifecycleStage === key).length;
                  if (count === 0) return null;
                  return (
                    <div
                      key={key}
                      className="bg-slate-50 border rounded-lg p-3 text-center min-w-[100px]"
                    >
                      <span className="text-lg block">{stage.icon}</span>
                      <span className="text-2xl font-bold block">{count}</span>
                      <span className="text-xs text-slate-500">{stage.pt}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product List */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Produtos</h2>
          <span className="text-sm text-slate-400">{products.length} registros</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const cat = PRODUCT_CATEGORIES[product.category as keyof typeof PRODUCT_CATEGORIES];
            const stage = LIFECYCLE_STAGES[product.lifecycleStage as keyof typeof LIFECYCLE_STAGES];

            return (
              <Link key={product.id} href={`/passport/${product.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{cat?.icon || "📦"}</span>
                        <div>
                          <CardTitle className="text-sm">{product.brand} {product.model}</CardTitle>
                          <p className="text-xs text-slate-400">{cat?.pt || product.category}</p>
                        </div>
                      </div>
                      <Badge
                        variant={product.lifecycleStage === "RECYCLED" ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {stage?.pt || product.lifecycleStage}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-slate-500 space-y-1">
                      <p>Serial: {product.serialNumber}</p>
                      <p>
                        Fabricação:{" "}
                        {new Date(product.manufacturingDate).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t mt-8">
        DPP Brasil POC • Dados reais: JG-SUSTENTARE, WK Solutions, Greentech
      </footer>
    </div>
  );
}

function StatCard({
  title,
  value,
  color = "text-slate-900",
}: {
  title: string;
  value: number;
  color?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-slate-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
