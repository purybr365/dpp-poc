"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface PartReplaced {
  name: string;
  cost: number;
}

export default function RepairPage() {
  return (
    <Suspense>
      <RepairForm />
    </Suspense>
  );
}

function RepairForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [parts, setParts] = useState<PartReplaced[]>([]);
  const [partName, setPartName] = useState("");
  const [partCost, setPartCost] = useState("");

  useEffect(() => {
    if (!productId) {
      setError("ID do produto não fornecido. Volte e selecione um produto.");
    }
  }, [productId]);

  function addPart() {
    if (partName.trim()) {
      setParts([...parts, { name: partName.trim(), cost: Number(partCost) || 0 }]);
      setPartName("");
      setPartCost("");
    }
  }

  function removePart(index: number) {
    setParts(parts.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!productId) return;
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const body = {
      date: formData.get("date"),
      issueDescription: formData.get("issueDescription"),
      partsReplaced: parts,
      laborCost: Number(formData.get("laborCost")) || null,
      totalCost: Number(formData.get("totalCost")) || null,
      postRepairStatus: formData.get("postRepairStatus"),
      notes: formData.get("notes") || null,
    };

    try {
      const res = await fetch(`/api/products/${productId}/repair-events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao registrar reparo");
      }

      router.push(`/passport/${productId}`);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80">
          <span className="text-2xl">📋</span>
          <span className="font-bold text-lg text-slate-900">DPP Brasil</span>
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Registrar Reparo
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados do Reparo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Data do Reparo *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="postRepairStatus">Status Pós-Reparo</Label>
                  <select
                    id="postRepairStatus"
                    name="postRepairStatus"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="passed">Aprovado</option>
                    <option value="needs_followup">Precisa Acompanhamento</option>
                    <option value="failed">Falhou</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="issueDescription">Descrição do Problema *</Label>
                <textarea
                  id="issueDescription"
                  name="issueDescription"
                  required
                  placeholder="Descreva o problema encontrado..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="laborCost">Custo da Mão de Obra (R$)</Label>
                  <Input id="laborCost" name="laborCost" type="number" step="0.01" placeholder="150.00" />
                </div>
                <div>
                  <Label htmlFor="totalCost">Custo Total (R$)</Label>
                  <Input id="totalCost" name="totalCost" type="number" step="0.01" placeholder="350.00" />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Observações</Label>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Notas adicionais..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Parts Replaced */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Peças Substituídas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nome da peça"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Custo (R$)"
                  value={partCost}
                  onChange={(e) => setPartCost(e.target.value)}
                  type="number"
                  step="0.01"
                  className="w-32"
                />
                <Button type="button" variant="outline" onClick={addPart}>
                  Adicionar
                </Button>
              </div>

              {parts.length > 0 && (
                <div className="space-y-2">
                  {parts.map((part, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                      <span className="text-sm">{part.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">
                          R$ {part.cost.toFixed(2)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePart(i)}
                          className="text-red-500 h-6 px-2"
                        >
                          X
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={loading || !productId} className="flex-1">
              {loading ? "Registrando..." : "Registrar Reparo"}
            </Button>
            <Link href="/">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
