import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CONDITION_LABELS } from "@/lib/rbac-matrix";

interface RepairSectionProps {
  events: Array<Record<string, unknown>>;
}

export function RepairSection({ events }: RepairSectionProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reparo & Manutenção</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400">Nenhum registro de reparo encontrado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Reparo & Manutenção</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {events.length} registro{events.length > 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, idx) => {
            const parts = event.partsReplaced as Array<{ name: string; cost: number }> | null;
            const date = event.date
              ? new Date(event.date as string).toLocaleDateString("pt-BR")
              : "N/A";

            return (
              <div
                key={idx}
                className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔧</span>
                    <div>
                      <p className="font-medium text-sm">{String(event.issueDescription)}</p>
                      <p className="text-xs text-slate-400">{date}</p>
                    </div>
                  </div>
                  {!!event.totalCost && (
                    <span className="text-sm font-semibold text-slate-700">
                      R$ {Number(event.totalCost).toFixed(2)}
                    </span>
                  )}
                </div>

                {!!event.postRepairStatus && (
                  <Badge
                    className={`text-xs ${
                      event.postRepairStatus === "passed"
                        ? "bg-green-100 text-green-700"
                        : event.postRepairStatus === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {CONDITION_LABELS.postRepairStatus[
                      event.postRepairStatus as keyof typeof CONDITION_LABELS.postRepairStatus
                    ] || String(event.postRepairStatus)}
                  </Badge>
                )}

                {parts && parts.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-slate-400">Peças substituídas:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {parts.map((part, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {part.name}
                          {part.cost ? ` (R$ ${part.cost.toFixed(2)})` : ""}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {!!event.notes && (
                  <p className="text-xs text-slate-500 mt-2 italic">{String(event.notes)}</p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
