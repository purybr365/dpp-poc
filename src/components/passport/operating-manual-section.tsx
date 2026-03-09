import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OperatingManualSectionProps {
  data: Record<string, unknown>;
}

export function OperatingManualSection({ data }: OperatingManualSectionProps) {
  const customerSupport = data.customerSupport as Record<string, string> | undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Manual e Informações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!!data.manualUrl && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <span className="text-xs text-blue-400 block mb-1">Manual do Produto</span>
              <span className="text-sm font-medium text-blue-700">{String(data.manualUrl)}</span>
            </div>
          )}
          {!!data.warrantyDuration && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <span className="text-xs text-slate-400 block mb-1">Garantia</span>
              <span className="text-lg font-semibold">{String(data.warrantyDuration)}</span>
            </div>
          )}
        </div>

        {customerSupport && (
          <div>
            <span className="text-xs text-slate-400 block mb-2">Suporte ao Cliente</span>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(customerSupport).map(([key, value]) => (
                <div key={key} className="bg-slate-50 p-3 rounded-lg">
                  <span className="text-xs text-slate-400 block uppercase">{key}</span>
                  <span className="text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!!data.safetyInfo && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <span className="text-xs text-amber-500 block mb-1">Informações de Segurança</span>
            <p className="text-sm text-amber-700">{String(data.safetyInfo)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
