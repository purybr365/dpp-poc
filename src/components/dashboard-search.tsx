"use client";

import { useState, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-context";

interface Product {
  id: string;
  gtin: string | null;
  serialNumber: string;
  brand: string;
  model: string;
  category: string;
}

interface DashboardSearchProps {
  products: Product[];
  onFilter: (filtered: string[] | null) => void;
}

export function DashboardSearch({ products, onFilter }: DashboardSearchProps) {
  const [query, setQuery] = useState("");
  const { t } = useLocale();

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      if (!value.trim()) {
        onFilter(null);
        return;
      }
      const q = value.toLowerCase();
      const matched = products
        .filter(
          (p) =>
            p.brand.toLowerCase().includes(q) ||
            p.model.toLowerCase().includes(q) ||
            p.serialNumber.toLowerCase().includes(q) ||
            (p.gtin && p.gtin.includes(q)) ||
            p.category.toLowerCase().includes(q)
        )
        .map((p) => p.id);
      onFilter(matched);
    },
    [products, onFilter]
  );

  const resultCount = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.brand.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        p.serialNumber.toLowerCase().includes(q) ||
        (p.gtin && p.gtin.includes(q)) ||
        p.category.toLowerCase().includes(q)
    ).length;
  }, [query, products]);

  return (
    <div className="relative mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <Input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t("dashboard.search.placeholder")}
          className="pl-10 pr-20 h-11 text-base bg-white border-slate-200 shadow-sm focus:border-blue-300 focus:ring-blue-200 rounded-xl"
        />
        {query && (
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-2">
            <span className="text-xs text-slate-400">
              {resultCount !== null ? `${resultCount}` : ""}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSearch("")}
              className="h-7 px-2 text-xs text-slate-400 hover:text-slate-600"
            >
              {t("dashboard.search.clear")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
