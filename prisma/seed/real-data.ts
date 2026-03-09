// Real recycler data transcribed from PDFs and Excel files

export interface RealRecyclerProduct {
  recyclerName: string;
  recyclerCity: string;
  category: "REFRIGERATOR" | "WASHING_MACHINE" | "STOVE" | "MICROWAVE" | "AIR_CONDITIONER";
  brand: string;
  model: string;
  serialNumber: string;
  productCode?: string;
  collectionLocation: string;
  processingLocation: string;
  processingDate: Date;
  condition: {
    functionalStatus: "non-functional" | "partially-functional" | "functional";
    cosmeticCondition: "good" | "fair" | "poor";
    isRusted: boolean;
    isDented: boolean;
    isYellowed: boolean;
    isBroken: boolean;
    isDisassembled: boolean;
    isCannibalized: boolean;
    otherNotes?: string;
  };
  photos: string[];
  dataSource: string;
}

// ============================================================
// JG-SUSTENTARE (Alvorada, RS) — Source: Typed PDF
// ============================================================
export const jgSustentareProducts: RealRecyclerProduct[] = [
  {
    recyclerName: "JG-SUSTENTARE",
    recyclerCity: "Alvorada, RS",
    category: "REFRIGERATOR",
    brand: "Consul",
    model: "CRD37EBANA",
    serialNumber: "JL0402085",
    productCode: "W10327003",
    collectionLocation: "Porto Alegre/Lami",
    processingLocation: "JG-SUSTENTARE",
    processingDate: new Date("2026-02-10T13:10:00-03:00"),
    condition: {
      functionalStatus: "non-functional",
      cosmeticCondition: "poor",
      isRusted: true,
      isDented: false,
      isYellowed: false,
      isBroken: false,
      isDisassembled: false,
      isCannibalized: false,
      otherNotes: "Falta gaveta",
    },
    photos: [
      "/uploads/recyclers/jg-sustentare/prod1-photo1.jpg",
      "/uploads/recyclers/jg-sustentare/prod1-photo2.jpg",
      "/uploads/recyclers/jg-sustentare/prod1-photo3.jpg",
      "/uploads/recyclers/jg-sustentare/prod1-photo4.jpg",
      "/uploads/recyclers/jg-sustentare/prod1-photo5.jpg",
      "/uploads/recyclers/jg-sustentare/prod1-photo6.jpg",
    ],
    dataSource: "jg-sustentare-pdf",
  },
  {
    recyclerName: "JG-SUSTENTARE",
    recyclerCity: "Alvorada, RS",
    category: "WASHING_MACHINE",
    brand: "Brastemp",
    model: "BWJ09ABBNA00",
    serialNumber: "CC7042611",
    collectionLocation: "Alvorada/Porto Verde",
    processingLocation: "JG-SUSTENTARE",
    processingDate: new Date("2026-02-10T11:50:00-03:00"),
    condition: {
      functionalStatus: "non-functional",
      cosmeticCondition: "fair",
      isRusted: false,
      isDented: true,
      isYellowed: false,
      isBroken: false,
      isDisassembled: false,
      isCannibalized: false,
      otherNotes: "Plástico ressecado",
    },
    photos: [
      "/uploads/recyclers/jg-sustentare/prod2-photo1.jpg",
      "/uploads/recyclers/jg-sustentare/prod2-photo2.jpg",
      "/uploads/recyclers/jg-sustentare/prod2-photo3.jpg",
      "/uploads/recyclers/jg-sustentare/prod2-photo4.jpg",
      "/uploads/recyclers/jg-sustentare/prod2-photo5.jpg",
      "/uploads/recyclers/jg-sustentare/prod2-photo6.jpg",
    ],
    dataSource: "jg-sustentare-pdf",
  },
  {
    recyclerName: "JG-SUSTENTARE",
    recyclerCity: "Alvorada, RS",
    category: "STOVE",
    brand: "Brastemp",
    model: "BF050BBU",
    serialNumber: "60503304",
    collectionLocation: "Porto Alegre/Partenon",
    processingLocation: "JG-SUSTENTARE",
    processingDate: new Date("2026-02-10T14:00:00-03:00"),
    condition: {
      functionalStatus: "non-functional",
      cosmeticCondition: "poor",
      isRusted: true,
      isDented: true,
      isYellowed: false,
      isBroken: true,
      isDisassembled: true,
      isCannibalized: false,
    },
    photos: [
      "/uploads/recyclers/jg-sustentare/prod3-photo1.jpg",
      "/uploads/recyclers/jg-sustentare/prod3-photo2.jpg",
      "/uploads/recyclers/jg-sustentare/prod3-photo3.jpg",
      "/uploads/recyclers/jg-sustentare/prod3-photo4.jpg",
      "/uploads/recyclers/jg-sustentare/prod3-photo5.jpg",
    ],
    dataSource: "jg-sustentare-pdf",
  },
  {
    recyclerName: "JG-SUSTENTARE",
    recyclerCity: "Alvorada, RS",
    category: "MICROWAVE",
    brand: "Consul",
    model: "CM020BFBNA",
    serialNumber: "ML0212913",
    collectionLocation: "Alvorada/Formosa",
    processingLocation: "JG-SUSTENTARE",
    processingDate: new Date("2026-02-10T14:35:00-03:00"),
    condition: {
      functionalStatus: "non-functional",
      cosmeticCondition: "fair",
      isRusted: true,
      isDented: false,
      isYellowed: false,
      isBroken: false,
      isDisassembled: false,
      isCannibalized: false,
    },
    photos: [
      "/uploads/recyclers/jg-sustentare/prod4-photo1.jpg",
      "/uploads/recyclers/jg-sustentare/prod4-photo2.jpg",
      "/uploads/recyclers/jg-sustentare/prod4-photo3.jpg",
      "/uploads/recyclers/jg-sustentare/prod4-photo4.jpg",
      "/uploads/recyclers/jg-sustentare/prod4-photo5.jpg",
    ],
    dataSource: "jg-sustentare-pdf",
  },
];

// ============================================================
// WK Solutions (São Paulo, SP) — Source: Excel file
// ============================================================
export const wkSolutionsProducts: RealRecyclerProduct[] = [
  {
    recyclerName: "WK Solutions",
    recyclerCity: "São Paulo, SP",
    category: "REFRIGERATOR",
    brand: "Consul",
    model: "CRM33EBANA10",
    serialNumber: "JI9167071",
    productCode: "CRM33E",
    collectionLocation: "Bragança Paulista/SP (Centro)",
    processingLocation: "WK Solutions",
    processingDate: new Date("2026-02-27T15:06:00-03:00"),
    condition: {
      functionalStatus: "non-functional",
      cosmeticCondition: "good",
      isRusted: false,
      isDented: false,
      isYellowed: false,
      isBroken: false,
      isDisassembled: false,
      isCannibalized: false,
    },
    photos: [
      "/uploads/recyclers/wk-solutions/produto-001.jpeg",
      "/uploads/recyclers/wk-solutions/serial-001.jpeg",
    ],
    dataSource: "wk-solutions-xlsx",
  },
  {
    recyclerName: "WK Solutions",
    recyclerCity: "São Paulo, SP",
    category: "STOVE",
    brand: "Brastemp",
    model: "BFS6NARUNA10",
    serialNumber: "CA6250533",
    collectionLocation: "São Paulo/SP (Vila Sofia)",
    processingLocation: "WK Solutions",
    processingDate: new Date("2026-03-02T11:42:00-03:00"),
    condition: {
      functionalStatus: "non-functional",
      cosmeticCondition: "poor",
      isRusted: true,
      isDented: true,
      isYellowed: false,
      isBroken: true,
      isDisassembled: false,
      isCannibalized: false,
    },
    photos: [
      "/uploads/recyclers/wk-solutions/produto-002.jpeg",
      "/uploads/recyclers/wk-solutions/serial-002.jpeg",
    ],
    dataSource: "wk-solutions-xlsx",
  },
  {
    recyclerName: "WK Solutions",
    recyclerCity: "São Paulo, SP",
    category: "WASHING_MACHINE",
    brand: "Brastemp",
    model: "BWR92ABANA",
    serialNumber: "6AB339440",
    productCode: "BWR92A",
    collectionLocation: "São Paulo/SP (Vila Guarani)",
    processingLocation: "WK Solutions",
    processingDate: new Date("2026-03-02T14:14:00-03:00"),
    condition: {
      functionalStatus: "non-functional",
      cosmeticCondition: "poor",
      isRusted: true,
      isDented: true,
      isYellowed: true,
      isBroken: true,
      isDisassembled: false,
      isCannibalized: false,
    },
    photos: [
      "/uploads/recyclers/wk-solutions/produto-003.jpeg",
    ],
    dataSource: "wk-solutions-xlsx",
  },
];

// ============================================================
// Greentech (MG) — Source: Scanned/handwritten PDF
// Data approximated from photos. 4 products with extensive photo documentation.
// ============================================================
export const greentechProducts: RealRecyclerProduct[] = [
  {
    recyclerName: "Greentech",
    recyclerCity: "Belo Horizonte, MG",
    category: "WASHING_MACHINE",
    brand: "Brastemp",
    model: "BWS15ABANA",
    serialNumber: "C15081165",
    collectionLocation: "Belo Horizonte, MG",
    processingLocation: "Greentech",
    processingDate: new Date("2026-02-10T14:00:00-03:00"),
    condition: {
      functionalStatus: "non-functional",
      cosmeticCondition: "fair",
      isRusted: false,
      isDented: false,
      isYellowed: false,
      isBroken: false,
      isDisassembled: false,
      isCannibalized: false,
    },
    photos: [
      "/uploads/recyclers/greentech/prod1-photo1.jpeg",
      "/uploads/recyclers/greentech/prod1-photo2.jpeg",
      "/uploads/recyclers/greentech/prod1-photo3.jpeg",
      "/uploads/recyclers/greentech/prod1-photo4.jpeg",
      "/uploads/recyclers/greentech/prod1-photo5.jpeg",
    ],
    dataSource: "greentech-pdf",
  },
  {
    recyclerName: "Greentech",
    recyclerCity: "Belo Horizonte, MG",
    category: "WASHING_MACHINE",
    brand: "Brastemp",
    model: "BWC07ABANA10",
    serialNumber: "CJ9571955",
    collectionLocation: "Contagem, MG",
    processingLocation: "Greentech",
    processingDate: new Date("2026-02-10T14:20:00-03:00"),
    condition: {
      functionalStatus: "non-functional",
      cosmeticCondition: "poor",
      isRusted: false,
      isDented: false,
      isYellowed: true,
      isBroken: true,
      isDisassembled: false,
      isCannibalized: false,
      otherNotes: "Sem a tampa",
    },
    photos: [
      "/uploads/recyclers/greentech/prod2-photo1.jpeg",
      "/uploads/recyclers/greentech/prod2-photo2.jpeg",
      "/uploads/recyclers/greentech/prod2-photo3.jpeg",
      "/uploads/recyclers/greentech/prod2-photo4.jpeg",
      "/uploads/recyclers/greentech/prod2-photo5.jpeg",
      "/uploads/recyclers/greentech/prod2-photo6.jpeg",
      "/uploads/recyclers/greentech/prod2-photo7.jpeg",
    ],
    dataSource: "greentech-pdf",
  },
  {
    recyclerName: "Greentech",
    recyclerCity: "Belo Horizonte, MG",
    category: "REFRIGERATOR",
    brand: "Brastemp",
    model: "BRD41ABANA",
    serialNumber: "8MA677428",
    collectionLocation: "Belo Horizonte, MG",
    processingLocation: "Greentech",
    processingDate: new Date("2026-02-10T14:30:00-03:00"),
    condition: {
      functionalStatus: "non-functional",
      cosmeticCondition: "poor",
      isRusted: true,
      isDented: true,
      isYellowed: true,
      isBroken: true,
      isDisassembled: false,
      isCannibalized: false,
    },
    photos: [
      "/uploads/recyclers/greentech/prod3-photo1.jpeg",
      "/uploads/recyclers/greentech/prod3-photo2.jpeg",
      "/uploads/recyclers/greentech/prod3-photo3.jpeg",
      "/uploads/recyclers/greentech/prod3-photo4.jpeg",
      "/uploads/recyclers/greentech/prod3-photo5.jpeg",
      "/uploads/recyclers/greentech/prod3-photo6.jpeg",
    ],
    dataSource: "greentech-pdf",
  },
  {
    recyclerName: "Greentech",
    recyclerCity: "Belo Horizonte, MG",
    category: "REFRIGERATOR",
    brand: "Consul",
    model: "CPB35ABUNA",
    serialNumber: "IA7007678",
    collectionLocation: "Belo Horizonte, MG",
    processingLocation: "Greentech",
    processingDate: new Date("2026-02-10T14:40:00-03:00"),
    condition: {
      functionalStatus: "non-functional",
      cosmeticCondition: "fair",
      isRusted: false,
      isDented: false,
      isYellowed: false,
      isBroken: false,
      isDisassembled: false,
      isCannibalized: false,
    },
    photos: [
      "/uploads/recyclers/greentech/prod4-photo1.jpeg",
      "/uploads/recyclers/greentech/prod4-photo2.jpeg",
      "/uploads/recyclers/greentech/prod4-photo3.jpeg",
      "/uploads/recyclers/greentech/prod4-photo4.jpeg",
    ],
    dataSource: "greentech-pdf",
  },
];

export const ALL_REAL_PRODUCTS = [
  ...jgSustentareProducts,
  ...wkSolutionsProducts,
  ...greentechProducts,
];
