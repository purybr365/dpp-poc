import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ACCESS_LEVEL_LABELS, type AccessLevel } from "@/lib/rbac-matrix";

interface EnvironmentalSectionProps {
  data: Record<string, unknown>;
  accessLevel: string;
}

const ENERGY_CLASS_COLORS: Record<string, string> = {
  A: "bg-green-500",
  B: "bg-lime-500",
  C: "bg-yellow-500",
  D: "bg-orange-400",
  E: "bg-orange-500",
  F: "bg-red-400",
  G: "bg-red-600",
};

const HAZARDOUS_LABELS: Record<string, string> = {
  refrigerantGas: "Gás Refrigerante",
  flameRetardants: "Retardantes de Chama",
  mercury: "Mercúrio",
  leadInSolder: "Chumbo na Solda",
  rohsCompliance: "Conformidade RoHS",
};

const REFRIGERANT_LABELS: Record<string, string> = {
  type: "Tipo",
  gwp: "GWP",
  odp: "ODP",
  charge: "Carga",
};

export function EnvironmentalSection({ data, accessLevel }: EnvironmentalSectionProps) {
  const energyClass = String(data.energyClass || "");
  const accessLabel = ACCESS_LEVEL_LABELS[accessLevel as AccessLevel] || accessLevel;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Dados Ambientais & Conformidade</CardTitle>
          <Badge variant="outline" className="text-xs">
            {accessLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Energy Rating Visual */}
        {energyClass && (
          <div>
            <span className="text-xs text-slate-400 block mb-2">Classificação Energética</span>
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                {["A", "B", "C", "D", "E", "F", "G"].map((cls) => (
                  <div
                    key={cls}
                    className={`flex items-center gap-1 ${cls === energyClass ? "scale-110" : "opacity-40"}`}
                  >
                    <div
                      className={`h-5 text-white text-xs font-bold flex items-center px-2 rounded-r ${ENERGY_CLASS_COLORS[cls]}`}
                      style={{ width: `${40 + ["A", "B", "C", "D", "E", "F", "G"].indexOf(cls) * 12}px` }}
                    >
                      {cls}
                    </div>
                    {cls === energyClass && (
                      <span className="text-sm font-bold ml-1">◄</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <span className="text-4xl font-bold text-slate-900">{energyClass}</span>
                <p className="text-xs text-slate-400">Selo Procel</p>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {!!data.energyConsumption && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="text-xs text-blue-400 block">Consumo Energético</span>
              <span className="text-lg font-semibold text-blue-700">
                {Number(data.energyConsumption).toFixed(0)} {String(data.energyUnit || "kWh/ano")}
              </span>
            </div>
          )}
          {!!data.carbonFootprint && (
            <div className="bg-emerald-50 p-3 rounded-lg">
              <span className="text-xs text-emerald-400 block">Pegada de Carbono</span>
              <span className="text-lg font-semibold text-emerald-700">
                {Number(data.carbonFootprint).toFixed(0)} {String(data.carbonUnit || "kg CO2e")}
              </span>
            </div>
          )}
          {!!data.recyclabilityRate && (
            <div className="bg-green-50 p-3 rounded-lg">
              <span className="text-xs text-green-400 block">Taxa de Reciclabilidade</span>
              <span className="text-lg font-semibold text-green-700">
                {Number(data.recyclabilityRate).toFixed(0)}%
              </span>
            </div>
          )}
          {data.recycledContent != null && (
            <div className="bg-teal-50 p-3 rounded-lg">
              <span className="text-xs text-teal-400 block">Conteúdo Reciclado</span>
              <span className="text-lg font-semibold text-teal-700">
                {Number(data.recycledContent).toFixed(0)}%
              </span>
            </div>
          )}
        </div>

        {/* Compliance Badges */}
        {!!(data.conamaCompliance || data.ibamaCompliance) && (
          <div>
            <span className="text-xs text-slate-400 block mb-2">Conformidade</span>
            <div className="flex flex-wrap gap-2">
              {!!data.conamaCompliance && <Badge className="bg-green-100 text-green-700">CONAMA</Badge>}
              {!!data.ibamaCompliance && <Badge className="bg-green-100 text-green-700">IBAMA</Badge>}
            </div>
          </div>
        )}

        {/* Hazardous Substances — Structured */}
        {!!data.hazardousSubstances && (
          <HazardousSubstancesDisplay data={data.hazardousSubstances as Record<string, unknown>} />
        )}
      </CardContent>
    </Card>
  );
}

function HazardousSubstancesDisplay({ data }: { data: Record<string, unknown> }) {
  return (
    <div>
      <span className="text-xs text-slate-400 block mb-2">Substâncias Perigosas</span>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
        {Object.entries(data).map(([key, value]) => {
          const label = HAZARDOUS_LABELS[key] || key;

          // RoHS compliance → badge
          if (key === "rohsCompliance") {
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-amber-800">{label}</span>
                <Badge
                  className={
                    value
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {value ? "Conforme" : "Não Conforme"}
                </Badge>
              </div>
            );
          }

          // Refrigerant gas → nested sub-grid
          if (key === "refrigerantGas" && typeof value === "object" && value !== null) {
            const gas = value as Record<string, unknown>;
            return (
              <div key={key}>
                <span className="text-sm font-medium text-amber-800 block mb-2">{label}</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ml-2">
                  {Object.entries(gas).map(([gk, gv]) => (
                    <div key={gk} className="bg-white/60 p-2 rounded text-sm">
                      <span className="text-xs text-amber-500 block">
                        {REFRIGERANT_LABELS[gk] || gk}
                      </span>
                      <span className="font-medium text-amber-900">{String(gv)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // Simple key-value
          return (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-amber-800">{label}</span>
              <span className="text-sm font-medium text-amber-900">{String(value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
