// GS1 Digital Link helpers

/**
 * Build a GS1 Digital Link path for a product.
 * Format: /passport/01/{gtin}/21/{serial}
 */
export function buildGS1Path(gtin: string, serialNumber: string): string {
  return `/passport/01/${gtin}/21/${serialNumber}`;
}

/**
 * Build the full GS1 Digital Link URL for a product.
 */
export function buildGS1Url(baseUrl: string, gtin: string, serialNumber: string): string {
  return `${baseUrl}${buildGS1Path(gtin, serialNumber)}`;
}

/**
 * Standard GTIN-13 numbers for mock products (Brazilian prefix 789).
 * These follow the GS1 Brasil format: 789 + company prefix + item reference + check digit
 */
export const STANDARD_GTINS: Record<string, string> = {
  // Brastemp (Whirlpool) - company prefix 9033
  "Brastemp-BRE57AK": "7899033400012",
  "Brastemp-BWH12AB": "7899033400029",
  "Brastemp-BWJ09ABBNA00": "7899033400036",
  "Brastemp-BF050BBU": "7899033400043",
  "Brastemp-BFS6NARUNA10": "7899033400050",
  "Brastemp-BWR92ABANA": "7899033400067",
  "Brastemp-BWS15ABANA": "7899033400074",
  "Brastemp-BWC07ABANA10": "7899033400081",
  "Brastemp-BRD41ABANA": "7899033400098",

  // Consul - company prefix 1037
  "Consul-CRD37EBANA": "7891037400010",
  "Consul-CRD49AK": "7891037400027",
  "Consul-CM020BFBNA": "7891037400034",
  "Consul-CRM33EBANA10": "7891037400041",
  "Consul-CPB35ABUNA": "7891037400058",

  // Electrolux - company prefix 6584
  "Electrolux-DF56S": "7896584400015",
  "Electrolux-LEV11": "7896584400022",
  "Electrolux-QI12R": "7896584400039",

  // Samsung - company prefix 2509
  "Samsung-RT46K6": "7892509400013",
  "Samsung-AR12BVHC": "7892509400020",

  // LG - company prefix 8941
  "LG-S4NQ12JA3": "7898941400016",

  // Midea - company prefix 9903
  "Midea-MSA12CR": "7899903346939",
};

/**
 * Get a standard GTIN for a brand+model combination, or generate a deterministic one.
 */
export function getStandardGTIN(brand: string, model: string): string {
  const key = `${brand}-${model}`;
  if (STANDARD_GTINS[key]) {
    return STANDARD_GTINS[key];
  }
  // Fallback: generate deterministic GTIN from brand+model hash
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0;
  }
  const num = Math.abs(hash) % 1000000000;
  return `789${num.toString().padStart(9, "0")}0`;
}
