export type AccessLevel =
  | "full"
  | "read"
  | "summary"
  | "simplified"
  | "partial"
  | "own"
  | "write"
  | "hidden";

export type PassportSection =
  | "productIdentification"
  | "supplyChain"
  | "environmental"
  | "operatingManual"
  | "repairData"
  | "ownershipEvents"
  | "endOfLife"
  | "regulatory";

export type Role =
  | "MANUFACTURER"
  | "RETAILER"
  | "CONSUMER"
  | "REPAIR_TECH"
  | "RECYCLER"
  | "REGULATOR";

export const RBAC_MATRIX: Record<Role, Record<PassportSection, AccessLevel>> = {
  MANUFACTURER: {
    productIdentification: "full",
    supplyChain: "full",
    environmental: "full",
    operatingManual: "full",
    repairData: "full",
    ownershipEvents: "write",
    endOfLife: "read",
    regulatory: "full",
  },
  RETAILER: {
    productIdentification: "full",
    supplyChain: "summary",
    environmental: "full",
    operatingManual: "full",
    repairData: "read",
    ownershipEvents: "write",
    endOfLife: "read",
    regulatory: "read",
  },
  CONSUMER: {
    productIdentification: "full",
    supplyChain: "hidden",
    environmental: "simplified",
    operatingManual: "full",
    repairData: "own",
    ownershipEvents: "own",
    endOfLife: "read",
    regulatory: "simplified",
  },
  REPAIR_TECH: {
    productIdentification: "full",
    supplyChain: "partial",
    environmental: "partial",
    operatingManual: "full",
    repairData: "full",
    ownershipEvents: "read",
    endOfLife: "read",
    regulatory: "hidden",
  },
  RECYCLER: {
    productIdentification: "full",
    supplyChain: "partial",
    environmental: "full",
    operatingManual: "partial",
    repairData: "read",
    ownershipEvents: "read",
    endOfLife: "full",
    regulatory: "read",
  },
  REGULATOR: {
    productIdentification: "full",
    supplyChain: "full",
    environmental: "full",
    operatingManual: "read",
    repairData: "full",
    ownershipEvents: "full",
    endOfLife: "full",
    regulatory: "full",
  },
};

export const ROLE_LABELS_PT: Record<Role, string> = {
  MANUFACTURER: "Fabricante",
  RETAILER: "Varejista",
  CONSUMER: "Consumidor",
  REPAIR_TECH: "Técnico de Reparo",
  RECYCLER: "Reciclador",
  REGULATOR: "Regulador",
};

export const ACCESS_LEVEL_LABELS: Record<AccessLevel, string> = {
  full: "Acesso Total",
  read: "Leitura",
  summary: "Resumo",
  simplified: "Simplificado",
  partial: "Parcial",
  own: "Próprio",
  write: "Escrita",
  hidden: "Oculto",
};

export const CONDITION_LABELS = {
  functionalStatus: {
    "non-functional": "Não Funcional",
    "partially-functional": "Parcialmente Funcional",
    functional: "Funcional",
  },
  cosmeticCondition: {
    poor: "Ruim",
    fair: "Regular",
    good: "Bom",
  },
  postRepairStatus: {
    passed: "Aprovado",
    needs_followup: "Necessita Acompanhamento",
    failed: "Reprovado",
  },
} as const;

export const SECTION_LABELS: Record<PassportSection, { pt: string; en: string }> = {
  productIdentification: { pt: "Identificação do Produto", en: "Product Identification" },
  supplyChain: { pt: "Cadeia de Suprimentos", en: "Supply Chain & BOM" },
  environmental: { pt: "Dados Ambientais", en: "Environmental & Compliance" },
  operatingManual: { pt: "Manual e Informações", en: "Operating Manual & Info" },
  repairData: { pt: "Reparo e Manutenção", en: "Repair & Maintenance" },
  ownershipEvents: { pt: "Propriedade e Uso", en: "Ownership & Usage" },
  endOfLife: { pt: "Fim de Vida / Reciclagem", en: "End-of-Life / Recycling" },
  regulatory: { pt: "Regulatório e Certificações", en: "Regulatory & Certifications" },
};
