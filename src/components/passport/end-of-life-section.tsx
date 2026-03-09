import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CONDITION_LABELS } from "@/lib/rbac-matrix";
import { PhotoLightbox } from "./photo-lightbox";

interface EndOfLifeSectionProps {
  records: Array<Record<string, unknown>>;
}

export function EndOfLifeSection({ records }: EndOfLifeSectionProps) {
  if (records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fim de Vida / Reciclagem</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400">
            Nenhum registro de fim de vida encontrado.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record, idx) => {
        const photos = (record.photos as string[]) || [];
        const disassembly = record.disassemblyReport as Record<string, unknown> | null;
        const materialsExtracted = disassembly?.materialsExtracted as Record<string, string> | null;

        const conditionFlags = [
          record.isRusted && "Enferrujado",
          record.isDented && "Amassado",
          record.isYellowed && "Amarelado",
          record.isBroken && "Quebrado",
          record.isDisassembled && "Desmontado",
          record.isCannibalized && "Canibalizado",
        ].filter((v): v is string => typeof v === "string");

        const collectionDate = record.collectionDate
          ? new Date(record.collectionDate as string).toLocaleDateString("pt-BR")
          : "N/A";
        const processingDate = record.processingDate
          ? new Date(record.processingDate as string).toLocaleDateString("pt-BR")
          : "N/A";

        const functionalLabel =
          CONDITION_LABELS.functionalStatus[
            record.functionalStatus as keyof typeof CONDITION_LABELS.functionalStatus
          ] || String(record.functionalStatus);

        const cosmeticLabel =
          CONDITION_LABELS.cosmeticCondition[
            record.cosmeticCondition as keyof typeof CONDITION_LABELS.cosmeticCondition
          ] || String(record.cosmeticCondition);

        return (
          <Card key={idx}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    ♻️ {String(record.recyclerName)}
                  </CardTitle>
                  <p className="text-sm text-slate-400">{String(record.recyclerCity)}</p>
                </div>
                <div className="flex gap-2">
                  {!!record.isRealData && (
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      Dados Reais
                    </Badge>
                  )}
                  {!!record.certificateNumber && (
                    <Badge variant="outline" className="text-xs">
                      {String(record.certificateNumber)}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Dates & Location */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">Coleta</span>
                  <span>{collectionDate}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Local Coleta</span>
                  <span>{String(record.collectionLocation)}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Processamento</span>
                  <span>{processingDate}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Local Processamento</span>
                  <span>{String(record.processingLocation)}</span>
                </div>
              </div>

              {/* Condition */}
              <div>
                <span className="text-xs text-slate-400 block mb-2">Condição</span>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    Funcional: {functionalLabel}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Estética: {cosmeticLabel}
                  </Badge>
                  {conditionFlags.map((flag, i) => (
                    <Badge key={i} className="bg-amber-100 text-amber-700 text-xs">
                      {flag}
                    </Badge>
                  ))}
                </div>
                {!!record.otherConditionNotes && (
                  <p className="text-xs text-slate-500 mt-1 italic">
                    {String(record.otherConditionNotes)}
                  </p>
                )}
              </div>

              {/* Recycling Rate */}
              {!!record.recyclingRate && (
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Taxa de Reciclagem</span>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${Number(record.recyclingRate)}%` }}
                      />
                    </div>
                    <span className="font-semibold text-emerald-700">
                      {Number(record.recyclingRate).toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-300 italic mt-1 block">
                    {record.isRealData
                      ? "Calculado a partir do relatório de desmontagem"
                      : "Estimativa baseada em dados do setor"}
                  </span>
                </div>
              )}

              {/* Materials Extracted */}
              {materialsExtracted && (
                <div>
                  <span className="text-xs text-slate-400 block mb-2">
                    Materiais Extraídos
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(materialsExtracted).map(([mat, qty]) => (
                      <div key={mat} className="bg-slate-50 p-2 rounded text-sm text-center">
                        <span className="text-slate-400 text-xs block capitalize">
                          {mat}
                        </span>
                        <span className="font-medium">{qty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Photos — Lightbox */}
              {photos.length > 0 && (
                <div>
                  <span className="text-xs text-slate-400 block mb-2">
                    Fotos ({photos.length})
                  </span>
                  <PhotoLightbox photos={photos} />
                </div>
              )}

              {/* Data Source */}
              {!!record.dataSource && (
                <p className="text-xs text-slate-300 italic">
                  Fonte: {String(record.dataSource)}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
