import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80">
          <span className="text-2xl">📋</span>
          <span className="font-bold text-lg text-slate-900">DPP Brasil</span>
        </Link>
        <Badge variant="secondary" className="text-xs">
          Documentação da Arquitetura
        </Badge>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Sobre o DPP Brasil
          </h1>
          <p className="text-slate-500 text-lg">
            Arquitetura e decisões de design do Passaporte Digital de Produto
            para eletrodomésticos de linha branca.
          </p>
        </div>

        {/* Section 1: Product Identification */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🔑 Identificação de Produto & Formato URN
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm">
              <span className="text-slate-400">urn:dpp:br:</span>
              <span className="text-blue-600 font-semibold">789786730430</span>
              <span className="text-slate-400">:</span>
              <span className="text-emerald-600 font-semibold">6AB339440</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-3">
                <span className="text-xs text-slate-400 block mb-1">Namespace</span>
                <code className="text-sm font-mono text-slate-700">urn:dpp:br</code>
                <p className="text-xs text-slate-500 mt-1">
                  Identificador URN para Passaportes Digitais de Produto brasileiros.
                  Segue o padrão de namespaces URN (RFC 8141).
                </p>
              </div>
              <div className="border rounded-lg p-3">
                <span className="text-xs text-slate-400 block mb-1">
                  GTIN <Badge variant="outline" className="text-[10px] ml-1">13 dígitos</Badge>
                </span>
                <code className="text-sm font-mono text-blue-600">789786730430</code>
                <p className="text-xs text-slate-500 mt-1">
                  Global Trade Item Number (GS1). O prefixo <code>789</code> identifica o Brasil.
                  No POC, GTINs são gerados sinteticamente. Em produção, seriam emitidos pela GS1 Brasil.
                </p>
              </div>
              <div className="border rounded-lg p-3">
                <span className="text-xs text-slate-400 block mb-1">Número de Série</span>
                <code className="text-sm font-mono text-emerald-600">6AB339440</code>
                <p className="text-xs text-slate-500 mt-1">
                  Serial de fábrica do produto individual. Nos 11 produtos reais
                  do POC, estes são números reais de série coletados nas recicladoras.
                </p>
              </div>
              <div className="border rounded-lg p-3">
                <span className="text-xs text-slate-400 block mb-1">Em Produção</span>
                <p className="text-xs text-slate-500">
                  O GTIN viria da GS1 Brasil; o serial é o número da linha de produção
                  do fabricante. Sem necessidade de aprovação central — similar ao modelo GS1,
                  onde o fabricante auto-atribui dentro do seu prefixo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Manufacturer Registration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🏭 Modelo de Registro pelo Fabricante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Fabricantes registram produtos no <strong>nível do número de série</strong> —
              cada unidade individual recebe um DPP próprio. Não há aprovação prévia ou
              controle centralizado.
            </p>

            <div className="bg-slate-50 rounded-lg p-4">
              <span className="text-xs text-slate-400 block mb-3">Analogia GS1</span>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-white border rounded px-3 py-2 text-center">
                  <span className="text-xs text-slate-400 block">GS1 Brasil</span>
                  <span className="text-sm font-medium">Prefixo da Empresa</span>
                </div>
                <span className="text-slate-300">→</span>
                <div className="bg-white border rounded px-3 py-2 text-center">
                  <span className="text-xs text-slate-400 block">Fabricante</span>
                  <span className="text-sm font-medium">Código do Produto</span>
                </div>
                <span className="text-slate-300">→</span>
                <div className="bg-white border rounded px-3 py-2 text-center">
                  <span className="text-xs text-slate-400 block">Fabricante</span>
                  <span className="text-sm font-medium">Número de Série</span>
                </div>
                <span className="text-slate-300">=</span>
                <div className="bg-blue-50 border-blue-200 border rounded px-3 py-2 text-center">
                  <span className="text-xs text-blue-400 block">DPP</span>
                  <span className="text-sm font-semibold text-blue-700">UID Único</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-600">
                  Registro por serial — cada unidade tem seu próprio passaporte
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-600">
                  Sem aprovação prévia — fabricante auto-registra
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-600">
                  GTIN opcional no POC (gerado automaticamente se omitido)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">◆</span>
                <span className="text-slate-600">
                  Em produção: GTIN obrigatório via GS1 Brasil
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Data Sources */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              📊 Fontes de Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-100 text-green-700 text-xs">Dados Reais</Badge>
                  <span className="text-sm font-semibold">11 produtos</span>
                </div>
                <p className="text-xs text-slate-500">
                  Registros de fim de vida de 3 recicladoras com números de série
                  reais, condições e fotos transcritos de PDFs e planilhas Excel.
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-slate-400">• JG-SUSTENTARE (Alvorada, RS)</p>
                  <p className="text-xs text-slate-400">• WK Solutions (São Paulo, SP)</p>
                  <p className="text-xs text-slate-400">• Greentech (Belo Horizonte, MG)</p>
                </div>
              </div>

              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-100 text-blue-700 text-xs">Dados Mock</Badge>
                  <span className="text-sm font-semibold">10 produtos</span>
                </div>
                <p className="text-xs text-slate-500">
                  Dados de ciclo de vida upstream (fabricação, cadeia de suprimentos,
                  dados ambientais, regulatórios) gerados programaticamente com
                  faixas realistas.
                </p>
              </div>

              <div className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-purple-100 text-purple-700 text-xs">Híbrido</Badge>
                </div>
                <p className="text-xs text-slate-500">
                  Produtos reais reciclados recebem dados upstream sintéticos
                  (datas de fabricação, métricas ambientais) para demonstrar
                  um ciclo de vida completo no passaporte.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Recycling Rate */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              ♻️ Taxa de Reciclagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-amber-200 bg-amber-50 rounded-lg p-3">
                <span className="text-xs text-amber-600 font-medium block mb-1">
                  Neste POC
                </span>
                <p className="text-sm text-slate-700">
                  Gerada aleatoriamente entre <strong>75% e 90%</strong> por peso.
                  Valor ilustrativo baseado em faixas típicas do setor de linha branca.
                </p>
                <code className="text-xs text-slate-400 mt-2 block font-mono">
                  75 + Math.random() × 15
                </code>
              </div>

              <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-3">
                <span className="text-xs text-emerald-600 font-medium block mb-1">
                  Em Produção
                </span>
                <p className="text-sm text-slate-700">
                  Calculada automaticamente a partir do relatório de desmontagem:
                </p>
                <div className="bg-white rounded p-2 mt-2 text-xs font-mono text-center">
                  taxa = (Σ materiais extraídos) ÷ peso total × 100
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  O relatório já contém <code>materialsExtracted</code> (metais, plásticos,
                  cobre, vidro em kg) e a cadeia de suprimentos tem <code>totalWeight</code>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Consumer Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🔒 Privacidade do Consumidor (LGPD)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              O DPP registra transferências de propriedade mas anonimiza consumidores
              via hash unidirecional, em conformidade com a LGPD.
            </p>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-white border rounded px-3 py-2 text-center">
                  <span className="text-xs text-slate-400 block">Sistema do Varejista</span>
                  <span className="text-sm">CPF, Nome, Endereço</span>
                </div>
                <span className="text-slate-300">→</span>
                <div className="bg-white border rounded px-3 py-2 text-center">
                  <span className="text-xs text-slate-400 block">Hash</span>
                  <span className="text-sm font-mono">f(dados) = 3tylgm0o</span>
                </div>
                <span className="text-slate-300">→</span>
                <div className="bg-green-50 border-green-200 border rounded px-3 py-2 text-center">
                  <span className="text-xs text-green-600 block">DPP</span>
                  <span className="text-sm font-mono">consumerIdHash</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-600">
                  <strong>consumerIdHash</strong> — identificador anônimo de 8 caracteres
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-600">
                  Identidade real (CPF, nome) armazenada apenas no sistema do varejista
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-600">
                  LGPD Art. 18 — minimização de dados: DPP armazena apenas o necessário
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-slate-600">
                  Rastreabilidade mantida sem exposição de dados pessoais
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: RBAC Model */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              👥 Modelo de Controle de Acesso (RBAC)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              6 perfis × 8 seções do passaporte → matriz de acesso. Cada seção tem
              um nível de acesso que determina o que cada perfil pode visualizar ou editar.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 text-slate-400">Seção</th>
                    <th className="p-2 text-center text-slate-400">Fabricante</th>
                    <th className="p-2 text-center text-slate-400">Varejista</th>
                    <th className="p-2 text-center text-slate-400">Consumidor</th>
                    <th className="p-2 text-center text-slate-400">Técnico</th>
                    <th className="p-2 text-center text-slate-400">Reciclador</th>
                    <th className="p-2 text-center text-slate-400">Regulador</th>
                  </tr>
                </thead>
                <tbody>
                  <RBACRow section="Identificação" levels={["full", "read", "read", "read", "read", "full"]} />
                  <RBACRow section="Cadeia Suprimentos" levels={["full", "summary", "hidden", "summary", "summary", "full"]} />
                  <RBACRow section="Ambiental" levels={["full", "read", "simplified", "read", "read", "full"]} />
                  <RBACRow section="Manual" levels={["full", "read", "read", "read", "hidden", "full"]} />
                  <RBACRow section="Reparo" levels={["read", "partial", "own", "write", "read", "full"]} />
                  <RBACRow section="Propriedade" levels={["read", "read", "own", "hidden", "read", "full"]} />
                  <RBACRow section="Fim de Vida" levels={["read", "hidden", "hidden", "hidden", "write", "full"]} />
                  <RBACRow section="Regulatório" levels={["read", "hidden", "hidden", "hidden", "hidden", "full"]} />
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap gap-2">
              <AccessBadge level="full" label="Total" />
              <AccessBadge level="read" label="Leitura" />
              <AccessBadge level="write" label="Escrita" />
              <AccessBadge level="summary" label="Resumo" />
              <AccessBadge level="simplified" label="Simplificado" />
              <AccessBadge level="partial" label="Parcial" />
              <AccessBadge level="own" label="Próprio" />
              <AccessBadge level="hidden" label="Oculto" />
            </div>
          </CardContent>
        </Card>

        {/* Section 7: Production Roadmap */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              🚀 Roadmap para Produção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500 mb-4">
              Funcionalidades que o POC não cobre, mas que seriam necessárias em uma
              implementação real:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <RoadmapItem
                title="Blockchain / DLT"
                description="Ancoragem de eventos em ledger distribuído para log à prova de adulteração"
              />
              <RoadmapItem
                title="GS1 Digital Link"
                description="Resolução de URIs de produto via padrão GS1 Digital Link"
              />
              <RoadmapItem
                title="Validação GTIN"
                description="Verificação em tempo real via APIs da GS1 Brasil"
              />
              <RoadmapItem
                title="Multi-tenancy"
                description="Onboarding de múltiplos fabricantes com isolamento de dados"
              />
              <RoadmapItem
                title="Telemetria IoT"
                description="Integração com dados de eletrodomésticos conectados (smart appliances)"
              />
              <RoadmapItem
                title="Interoperabilidade EU ESPR"
                description="Troca de dados com sistemas de DPP europeus via protocolo padronizado"
              />
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Tech Stack */}
        <div className="text-center text-sm text-slate-400 space-y-2">
          <p className="font-medium text-slate-500">Stack Tecnológica do POC</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="text-xs">Next.js 16</Badge>
            <Badge variant="outline" className="text-xs">TypeScript</Badge>
            <Badge variant="outline" className="text-xs">Prisma 7</Badge>
            <Badge variant="outline" className="text-xs">SQLite</Badge>
            <Badge variant="outline" className="text-xs">NextAuth.js v5</Badge>
            <Badge variant="outline" className="text-xs">Tailwind CSS v4</Badge>
            <Badge variant="outline" className="text-xs">shadcn/ui</Badge>
          </div>
          <p className="text-xs">
            Dados reais: JG-SUSTENTARE • WK Solutions • Greentech
          </p>
        </div>
      </div>
    </div>
  );
}

function RBACRow({ section, levels }: { section: string; levels: string[] }) {
  const colorMap: Record<string, string> = {
    full: "bg-emerald-100 text-emerald-700",
    read: "bg-blue-100 text-blue-700",
    write: "bg-orange-100 text-orange-700",
    summary: "bg-yellow-100 text-yellow-700",
    simplified: "bg-purple-100 text-purple-700",
    partial: "bg-cyan-100 text-cyan-700",
    own: "bg-pink-100 text-pink-700",
    hidden: "bg-slate-100 text-slate-400",
  };

  const labelMap: Record<string, string> = {
    full: "Total",
    read: "Leitura",
    write: "Escrita",
    summary: "Resumo",
    simplified: "Simpl.",
    partial: "Parcial",
    own: "Próprio",
    hidden: "—",
  };

  return (
    <tr className="border-b hover:bg-slate-50">
      <td className="p-2 text-slate-700 font-medium">{section}</td>
      {levels.map((level, i) => (
        <td key={i} className="p-2 text-center">
          <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${colorMap[level] || ""}`}>
            {labelMap[level] || level}
          </span>
        </td>
      ))}
    </tr>
  );
}

function AccessBadge({ level, label }: { level: string; label: string }) {
  const colorMap: Record<string, string> = {
    full: "bg-emerald-100 text-emerald-700",
    read: "bg-blue-100 text-blue-700",
    write: "bg-orange-100 text-orange-700",
    summary: "bg-yellow-100 text-yellow-700",
    simplified: "bg-purple-100 text-purple-700",
    partial: "bg-cyan-100 text-cyan-700",
    own: "bg-pink-100 text-pink-700",
    hidden: "bg-slate-100 text-slate-400",
  };

  return (
    <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-medium ${colorMap[level] || ""}`}>
      {label}
    </span>
  );
}

function RoadmapItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-3">
      <span className="text-slate-300 mt-0.5">◇</span>
      <div>
        <span className="text-sm font-medium text-slate-700">{title}</span>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}
