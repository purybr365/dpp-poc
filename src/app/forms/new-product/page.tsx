"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-context";
import type { TKey } from "@/lib/i18n/translations";

const CATEGORY_KEYS = [
  "REFRIGERATOR",
  "WASHING_MACHINE",
  "AIR_CONDITIONER",
  "STOVE",
  "MICROWAVE",
  "DRYER",
  "DISHWASHER",
] as const;

const ENERGY_CLASSES = ["A", "B", "C", "D", "E", "F", "G"];

export default function NewProductForm() {
  const router = useRouter();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const body = {
      serialNumber: formData.get("serialNumber"),
      category: formData.get("category"),
      brand: formData.get("brand"),
      model: formData.get("model"),
      productCode: formData.get("productCode") || null,
      gtin: formData.get("gtin") || null,
      manufacturingDate: formData.get("manufacturingDate"),
      manufacturingFacility: formData.get("manufacturingFacility"),
      batchNumber: formData.get("batchNumber") || null,
      supplyChainData: {
        totalWeight: Number(formData.get("weight")) || null,
        countryOfOrigin: "Brasil",
        manufacturerLegalName: formData.get("legalName") || null,
        mainMaterials: (formData.get("materials") as string)?.split(",").map((m) => m.trim()).filter(Boolean) || [],
      },
      environmentalData: {
        energyClass: formData.get("energyClass") || null,
        energyConsumption: Number(formData.get("energyConsumption")) || null,
        energyUnit: "kWh/ano",
        carbonFootprint: Number(formData.get("carbonFootprint")) || null,
        carbonUnit: "kg CO2e",
        recyclabilityRate: Number(formData.get("recyclabilityRate")) || null,
        conamaCompliance: true,
        ibamaCompliance: true,
      },
      operatingManualData: {
        warrantyDuration: formData.get("warrantyDuration") || "12 meses",
        customerSupport: { sac: formData.get("sacNumber") || "" },
      },
      regulatoryData: {
        inmetroStatus: "Válido",
        seloProcel: formData.get("energyClass") || null,
        conamaCompliance: true,
        euAlignment: { esprReadinessScore: 70, rohsCompliance: true },
      },
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t("form.newProduct.error"));
      }

      const product = await res.json();
      router.push(`/passport/${product.id}`);
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
          {t("form.newProduct.title")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("form.newProduct.identification")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">{t("form.newProduct.brand")} *</Label>
                  <Input id="brand" name="brand" required placeholder="Brastemp" />
                </div>
                <div>
                  <Label htmlFor="model">{t("form.newProduct.model")} *</Label>
                  <Input id="model" name="model" required placeholder="BRM56AB" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serialNumber">{t("form.newProduct.serialNumber")} *</Label>
                  <Input id="serialNumber" name="serialNumber" required placeholder="SN-001234" />
                </div>
                <div>
                  <Label htmlFor="category">{t("form.newProduct.category")} *</Label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {CATEGORY_KEYS.map((key) => (
                      <option key={key} value={key}>
                        {t(`category.${key}` as TKey)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gtin">GTIN</Label>
                  <Input id="gtin" name="gtin" placeholder="7891234567890" />
                </div>
                <div>
                  <Label htmlFor="productCode">{t("form.newProduct.productCode")}</Label>
                  <Input id="productCode" name="productCode" placeholder="BRM56ABANA" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manufacturing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("form.newProduct.manufacturing")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manufacturingDate">{t("form.newProduct.manufacturingDate")} *</Label>
                  <Input id="manufacturingDate" name="manufacturingDate" type="date" required />
                </div>
                <div>
                  <Label htmlFor="manufacturingFacility">{t("form.newProduct.factory")} *</Label>
                  <Input
                    id="manufacturingFacility"
                    name="manufacturingFacility"
                    required
                    placeholder="Rio Claro, SP"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="batchNumber">{t("form.newProduct.batch")}</Label>
                  <Input id="batchNumber" name="batchNumber" placeholder="LOT-2024-001" />
                </div>
                <div>
                  <Label htmlFor="legalName">{t("form.newProduct.legalName")}</Label>
                  <Input id="legalName" name="legalName" placeholder="Whirlpool S.A." />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environmental */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("form.newProduct.environmental")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="energyClass">{t("form.newProduct.energyClass")}</Label>
                  <select
                    id="energyClass"
                    name="energyClass"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {ENERGY_CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="energyConsumption">{t("form.newProduct.energyConsumption")}</Label>
                  <Input id="energyConsumption" name="energyConsumption" type="number" placeholder="350" />
                </div>
                <div>
                  <Label htmlFor="carbonFootprint">{t("form.newProduct.co2")}</Label>
                  <Input id="carbonFootprint" name="carbonFootprint" type="number" placeholder="400" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="weight">{t("form.newProduct.weight")}</Label>
                  <Input id="weight" name="weight" type="number" placeholder="65" />
                </div>
                <div>
                  <Label htmlFor="recyclabilityRate">{t("form.newProduct.recyclability")}</Label>
                  <Input id="recyclabilityRate" name="recyclabilityRate" type="number" placeholder="80" />
                </div>
                <div>
                  <Label htmlFor="materials">{t("form.newProduct.materials")}</Label>
                  <Input id="materials" name="materials" placeholder="Aço, Plástico, Cobre" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("form.newProduct.support")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="warrantyDuration">{t("form.newProduct.warranty")}</Label>
                  <Input id="warrantyDuration" name="warrantyDuration" placeholder="12 meses" />
                </div>
                <div>
                  <Label htmlFor="sacNumber">{t("form.newProduct.sac")}</Label>
                  <Input id="sacNumber" name="sacNumber" placeholder="0800-970-0999" />
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
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? t("form.newProduct.creating") : t("form.newProduct.submit")}
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
