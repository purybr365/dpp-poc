import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OwnershipSectionProps {
  events: Array<Record<string, unknown>>;
}

const EVENT_LABELS: Record<string, string> = {
  MANUFACTURED: "Fabricado",
  SOLD_TO_RETAILER: "Vendido ao Varejista",
  SOLD_TO_CONSUMER: "Vendido ao Consumidor",
  RESOLD: "Revendido",
  DONATED: "Doado",
  COLLECTED_FOR_RECYCLING: "Coletado para Reciclagem",
};

const EVENT_ICONS: Record<string, string> = {
  MANUFACTURED: "🏭",
  SOLD_TO_RETAILER: "🏬",
  SOLD_TO_CONSUMER: "🛒",
  RESOLD: "🔄",
  DONATED: "🤝",
  COLLECTED_FOR_RECYCLING: "♻️",
};

export function OwnershipSection({ events }: OwnershipSectionProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Propriedade & Uso</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400">Nenhum evento de propriedade registrado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Propriedade & Uso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />

          <div className="space-y-4">
            {events.map((event, idx) => {
              const eventType = String(event.eventType);
              const date = event.date
                ? new Date(event.date as string).toLocaleDateString("pt-BR")
                : "N/A";

              return (
                <div key={idx} className="relative flex gap-4 items-start pl-2">
                  <div className="relative z-10 w-7 h-7 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-sm flex-shrink-0">
                    {EVENT_ICONS[eventType] || "📋"}
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-lg p-3 -mt-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">
                        {EVENT_LABELS[eventType] || eventType}
                      </span>
                      <span className="text-xs text-slate-400">{date}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                      {!!event.fromEntity && <p>De: {String(event.fromEntity)}</p>}
                      {!!event.toEntity && <p>Para: {String(event.toEntity)}</p>}
                      {!!event.consumerIdHash && (
                        <p>
                          ID Consumidor:{" "}
                          <span className="font-mono">{String(event.consumerIdHash)}</span>
                          <span className="text-slate-300 ml-1">(hash LGPD)</span>
                        </p>
                      )}
                      {!!event.retailerName && <p>Varejista: {String(event.retailerName)}</p>}
                      {!!event.price && (
                        <p className="font-medium">
                          R$ {Number(event.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
