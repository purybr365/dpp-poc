"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-context";

export default function EndOfLifePage() {
  return (
    <Suspense>
      <EndOfLifeForm />
    </Suspense>
  );
}

function EndOfLifeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!productId) {
      setError(t("form.eol.missingProduct"));
    }
  }, [productId, t]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!productId) return;
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const body = {
      recyclerName: formData.get("recyclerName"),
      recyclerCity: formData.get("recyclerCity"),
      collectionDate: formData.get("collectionDate"),
      collectionLocation: formData.get("collectionLocation"),
      processingLocation: formData.get("processingLocation"),
      processingDate: formData.get("processingDate"),
      functionalStatus: formData.get("functionalStatus"),
      cosmeticCondition: formData.get("cosmeticCondition"),
      isRusted: formData.get("isRusted") === "on",
      isDented: formData.get("isDented") === "on",
      isYellowed: formData.get("isYellowed") === "on",
      isBroken: formData.get("isBroken") === "on",
      isDisassembled: formData.get("isDisassembled") === "on",
      isCannibalized: formData.get("isCannibalized") === "on",
      otherConditionNotes: formData.get("otherConditionNotes") || null,
      recyclingRate: Number(formData.get("recyclingRate")) || null,
      finalDisposition: formData.get("finalDisposition"),
      disassemblyReport: {
        components: (formData.get("components") as string)
          ?.split(",")
          .map((c) => c.trim())
          .filter(Boolean) || [],
        materialsExtracted: {
          metals: formData.get("metals") || "",
          plastics: formData.get("plastics") || "",
          copper: formData.get("copper") || "",
          glass: formData.get("glass") || "",
        },
        hazardousHandled: formData.get("hazardousHandled") === "on",
        hazardousDetails: formData.get("hazardousDetails") || "",
      },
    };

    try {
      const res = await fetch(`/api/products/${productId}/end-of-life`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t("form.eol.error"));
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
          <span className="font-bold text-lg text-slate-900">{t("nav.title")}</span>
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          {t("form.eol.title")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recycler Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("form.eol.recyclerData")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recyclerName">{t("form.eol.recyclerName")} *</Label>
                  <Input id="recyclerName" name="recyclerName" required placeholder="JG-SUSTENTARE" />
                </div>
                <div>
                  <Label htmlFor="recyclerCity">{t("form.eol.city")} *</Label>
                  <Input id="recyclerCity" name="recyclerCity" required placeholder="Alvorada, RS" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collection & Processing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("form.eol.collectionProcessing")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="collectionDate">{t("form.eol.collectionDate")} *</Label>
                  <Input id="collectionDate" name="collectionDate" type="date" required />
                </div>
                <div>
                  <Label htmlFor="collectionLocation">{t("form.eol.collectionLocation")} *</Label>
                  <Input id="collectionLocation" name="collectionLocation" required placeholder="Porto Alegre, RS" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="processingDate">{t("form.eol.processingDate")} *</Label>
                  <Input
                    id="processingDate"
                    name="processingDate"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="processingLocation">{t("form.eol.processingLocation")} *</Label>
                  <Input id="processingLocation" name="processingLocation" required placeholder="Alvorada, RS" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Condition */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("form.eol.condition")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="functionalStatus">{t("form.eol.functionalStatus")} *</Label>
                  <select
                    id="functionalStatus"
                    name="functionalStatus"
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="functional">{t("condition.functional")}</option>
                    <option value="partially_functional">{t("condition.partiallyFunctional")}</option>
                    <option value="non_functional">{t("condition.nonFunctional")}</option>
                    <option value="unknown">{t("condition.unknown")}</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="cosmeticCondition">{t("form.eol.cosmeticCondition")} *</Label>
                  <select
                    id="cosmeticCondition"
                    name="cosmeticCondition"
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="good">{t("condition.good")}</option>
                    <option value="fair">{t("condition.fair")}</option>
                    <option value="poor">{t("condition.poor")}</option>
                    <option value="very_poor">{t("condition.veryPoor")}</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-sm text-slate-500 mb-2 block">{t("condition.conditionFlags")}</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: "isRusted", key: "eol.conditionRusted" as const },
                    { name: "isDented", key: "eol.conditionDented" as const },
                    { name: "isYellowed", key: "eol.conditionYellowed" as const },
                    { name: "isBroken", key: "eol.conditionBroken" as const },
                    { name: "isDisassembled", key: "eol.conditionDisassembled" as const },
                    { name: "isCannibalized", key: "eol.conditionCannibalized" as const },
                  ].map((flag) => (
                    <label key={flag.name} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name={flag.name} className="rounded" />
                      {t(flag.key)}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="otherConditionNotes">{t("form.eol.otherNotes")}</Label>
                <textarea
                  id="otherConditionNotes"
                  name="otherConditionNotes"
                  placeholder={t("form.eol.otherNotesPlaceholder")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Disassembly Report */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("form.eol.disassembly")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="components">{t("form.eol.components")}</Label>
                <Input
                  id="components"
                  name="components"
                  placeholder="Compressor, Motor, Placa eletrônica, Estrutura metálica"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metals">{t("form.eol.metalsExtracted")}</Label>
                  <Input id="metals" name="metals" placeholder="15.3 kg" />
                </div>
                <div>
                  <Label htmlFor="plastics">{t("form.eol.plastics")}</Label>
                  <Input id="plastics" name="plastics" placeholder="8.2 kg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="copper">{t("form.eol.copper")}</Label>
                  <Input id="copper" name="copper" placeholder="1.5 kg" />
                </div>
                <div>
                  <Label htmlFor="glass">{t("form.eol.glass")}</Label>
                  <Input id="glass" name="glass" placeholder="2.1 kg" />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="hazardousHandled" className="rounded" />
                {t("form.eol.hazardousHandled")}
              </label>
              <div>
                <Label htmlFor="hazardousDetails">{t("form.eol.hazardousDetails")}</Label>
                <Input id="hazardousDetails" name="hazardousDetails" placeholder="Gás R-600a recuperado" />
              </div>
            </CardContent>
          </Card>

          {/* Result */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("form.eol.result")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recyclingRate">{t("form.eol.recyclingRate")}</Label>
                  <Input id="recyclingRate" name="recyclingRate" type="number" step="0.1" placeholder="85.0" />
                </div>
                <div>
                  <Label htmlFor="finalDisposition">{t("form.eol.finalDisposition")} *</Label>
                  <select
                    id="finalDisposition"
                    name="finalDisposition"
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="recycled">{t("form.eol.dispositionRecycled")}</option>
                    <option value="refurbished">{t("form.eol.dispositionRefurbished")}</option>
                    <option value="landfill">{t("form.eol.dispositionLandfill")}</option>
                    <option value="incinerated">{t("form.eol.dispositionIncinerated")}</option>
                    <option value="partially_recycled">{t("form.eol.dispositionPartiallyRecycled")}</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={loading || !productId} className="flex-1">
              {loading ? t("form.eol.submitting") : t("form.eol.submit")}
            </Button>
            <Link href="/">
              <Button variant="outline" type="button">
                {t("form.cancel")}
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
