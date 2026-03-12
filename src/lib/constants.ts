export const PRODUCT_CATEGORIES = {
  REFRIGERATOR: { pt: "Geladeira", en: "Refrigerator", icon: "❄️" },
  WASHING_MACHINE: { pt: "Máquina de Lavar", en: "Washing Machine", icon: "🫧" },
  AIR_CONDITIONER: { pt: "Ar Condicionado", en: "Air Conditioner", icon: "🌬️" },
  STOVE: { pt: "Fogão", en: "Stove", icon: "🔥" },
  MICROWAVE: { pt: "Micro-ondas", en: "Microwave", icon: "📡" },
  DRYER: { pt: "Secadora", en: "Dryer", icon: "💨" },
  DISHWASHER: { pt: "Lava-louça", en: "Dishwasher", icon: "🍽️" },
} as const;

export const LIFECYCLE_STAGES = {
  MANUFACTURED: { pt: "Fabricado", en: "Manufactured", order: 1, icon: "🏭" },
  IN_TRANSIT: { pt: "Em Trânsito", en: "In Transit", order: 2, icon: "🚚" },
  SOLD: { pt: "Vendido", en: "Sold", order: 3, icon: "🏬" },
  IN_USE: { pt: "Em Uso", en: "In Use", order: 4, icon: "🏠" },
  UNDER_REPAIR: { pt: "Em Reparo", en: "Under Repair", order: 5, icon: "🔧" },
  RESOLD: { pt: "Revendido", en: "Resold", order: 6, icon: "🔄" },
  COLLECTED: { pt: "Coletado", en: "Collected", order: 7, icon: "📦" },
  RECYCLED: { pt: "Reciclado", en: "Recycled", order: 8, icon: "♻️" },
} as const;

export const ENERGY_CLASSES = ["A", "B", "C", "D", "E", "F", "G"] as const;

export const BRAZILIAN_BRANDS = [
  "Brastemp",
  "Consul",
  "Electrolux",
  "Samsung",
  "LG",
  "Midea",
  "Philco",
] as const;

export const DEMO_USERS = [
  {
    email: "fabricante@dpp.br",
    name: "Ana Silva",
    role: "MANUFACTURER" as const,
    organization: "Brastemp (Whirlpool)",
    cnpj: "59.104.760/0001-01",
  },
  {
    email: "consumidor@dpp.br",
    name: "Maria Oliveira",
    role: "CONSUMER" as const,
    organization: null,
    cnpj: null,
  },
  {
    email: "tecnico@dpp.br",
    name: "João Pereira",
    role: "REPAIR_TECH" as const,
    organization: "Brastemp Assistência Técnica",
    cnpj: "12.345.678/0001-90",
  },
  {
    email: "reciclador@dpp.br",
    name: "Roberto Costa",
    role: "RECYCLER" as const,
    organization: "JG-SUSTENTARE",
    cnpj: "98.765.432/0001-10",
  },
] as const;
