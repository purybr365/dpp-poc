// Mock product data for upstream lifecycle phases

import { getStandardGTIN } from "../../src/lib/gs1";

interface MockProduct {
  category: "REFRIGERATOR" | "WASHING_MACHINE" | "AIR_CONDITIONER" | "STOVE" | "MICROWAVE";
  brand: string;
  model: string;
  serialNumber: string;
  gtin: string;
  manufacturingDate: Date;
  manufacturingFacility: string;
  batchNumber: string;
  lifecycleStage: string;
  supplyChainData: Record<string, unknown>;
  environmentalData: Record<string, unknown>;
  operatingManualData: Record<string, unknown>;
  regulatoryData: Record<string, unknown>;
}

const FACTORIES: Record<string, string[]> = {
  Brastemp: ["Joinville, SC", "Rio Claro, SP", "Manaus, AM"],
  Consul: ["Joinville, SC", "Manaus, AM"],
  Electrolux: ["Curitiba, PR", "São Carlos, SP"],
  Samsung: ["Manaus, AM"],
};

const RETAILERS = [
  { name: "Magazine Luiza", cnpj: "47.960.950/0001-21", location: "São Paulo, SP" },
  { name: "Casas Bahia", cnpj: "33.041.260/0001-64", location: "São Paulo, SP" },
  { name: "Ponto (ex-Ponto Frio)", cnpj: "33.041.260/0118-05", location: "Curitiba, PR" },
  { name: "Americanas", cnpj: "00.776.574/0001-56", location: "Belo Horizonte, MG" },
  { name: "Amazon Brasil", cnpj: "15.436.940/0001-03", location: "São Paulo, SP" },
];

const SERVICE_CENTERS = [
  "Brastemp Assistência Técnica - São Paulo",
  "Consul Service Center - Curitiba",
  "Electrolux Service - Rio de Janeiro",
  "Samsung Serviço Autorizado - Manaus",
  "TechFix Assistência - Belo Horizonte",
  "RepairPro - Porto Alegre",
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomPick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateBOM(category: string) {
  const boms: Record<string, Record<string, unknown>> = {
    REFRIGERATOR: {
      totalWeight: randomFloat(60, 80),
      materials: {
        steel: { weight: randomFloat(25, 35), unit: "kg" },
        aluminum: { weight: randomFloat(3, 6), unit: "kg" },
        copper: { weight: randomFloat(1, 3), unit: "kg" },
        plasticPP: { weight: randomFloat(5, 10), unit: "kg" },
        plasticPS: { weight: randomFloat(2, 5), unit: "kg" },
        plasticABS: { weight: randomFloat(3, 6), unit: "kg" },
        puFoam: { weight: randomFloat(8, 12), unit: "kg" },
        glass: { weight: randomFloat(2, 5), unit: "kg" },
        electronics: { weight: randomFloat(0.5, 1.5), unit: "kg" },
        rubber: { weight: randomFloat(1, 2), unit: "kg" },
      },
      refrigerantType: "R-600a",
      refrigerantCharge: randomFloat(40, 65) + "g",
      packagingWeight: randomFloat(8, 12),
      keyComponents: {
        compressor: "Embraco (Nidec Global Appliance)",
        thermostat: "Robertshaw",
        controlBoard: "Whirlpool Electronics",
      },
    },
    WASHING_MACHINE: {
      totalWeight: randomFloat(55, 75),
      materials: {
        steel: { weight: randomFloat(20, 30), unit: "kg" },
        aluminum: { weight: randomFloat(2, 4), unit: "kg" },
        copper: { weight: randomFloat(2, 4), unit: "kg" },
        plasticPP: { weight: randomFloat(8, 15), unit: "kg" },
        concrete: { weight: randomFloat(10, 15), unit: "kg" },
        glass: { weight: randomFloat(1, 3), unit: "kg" },
        electronics: { weight: randomFloat(0.5, 1.5), unit: "kg" },
        rubber: { weight: randomFloat(2, 4), unit: "kg" },
      },
      packagingWeight: randomFloat(6, 10),
      keyComponents: {
        motor: "Nidec",
        pump: "Askoll",
        controlBoard: "Whirlpool Electronics",
      },
    },
    AIR_CONDITIONER: {
      totalWeight: randomFloat(30, 50),
      materials: {
        steel: { weight: randomFloat(10, 18), unit: "kg" },
        aluminum: { weight: randomFloat(5, 10), unit: "kg" },
        copper: { weight: randomFloat(3, 6), unit: "kg" },
        plasticABS: { weight: randomFloat(5, 10), unit: "kg" },
        electronics: { weight: randomFloat(0.5, 1.5), unit: "kg" },
      },
      refrigerantType: randomPick(["R-32", "R-410A"]),
      refrigerantCharge: randomFloat(500, 1200) + "g",
      packagingWeight: randomFloat(5, 8),
      keyComponents: {
        compressor: "Rotary (GMCC/Toshiba)",
        evaporator: "Copper-aluminum fin",
        controlBoard: "Inverter PCB",
      },
    },
    STOVE: {
      totalWeight: randomFloat(40, 60),
      materials: {
        steel: { weight: randomFloat(25, 40), unit: "kg" },
        aluminum: { weight: randomFloat(1, 3), unit: "kg" },
        glass: { weight: randomFloat(2, 4), unit: "kg" },
        enamel: { weight: randomFloat(2, 4), unit: "kg" },
        rubber: { weight: randomFloat(0.5, 1), unit: "kg" },
        electronics: { weight: randomFloat(0.2, 0.5), unit: "kg" },
      },
      packagingWeight: randomFloat(5, 8),
      keyComponents: {
        burners: "Cast iron / brass injectors",
        oven: "Enameled steel cavity",
        ignition: "Piezo electric / electronic",
      },
    },
    MICROWAVE: {
      totalWeight: randomFloat(10, 15),
      materials: {
        steel: { weight: randomFloat(5, 8), unit: "kg" },
        plasticABS: { weight: randomFloat(2, 4), unit: "kg" },
        glass: { weight: randomFloat(1, 2), unit: "kg" },
        electronics: { weight: randomFloat(1, 2), unit: "kg" },
        copper: { weight: randomFloat(0.3, 0.8), unit: "kg" },
      },
      packagingWeight: randomFloat(2, 4),
      keyComponents: {
        magnetron: "2M226 (LG/Samsung)",
        transformer: "High voltage transformer",
        controlPanel: "Touch/button PCB",
      },
    },
  };
  return boms[category] || boms.REFRIGERATOR;
}

function generateEnvironmentalData(category: string) {
  const data: Record<string, Record<string, unknown>> = {
    REFRIGERATOR: {
      carbonFootprint: randomFloat(250, 450),
      carbonUnit: "kg CO2e",
      energyConsumption: randomFloat(200, 400),
      energyUnit: "kWh/ano",
      energyClass: randomPick(["A", "B", "C"]),
      energyRating: "Selo Procel",
      noiseLevel: randomInt(36, 44),
      noiseUnit: "dB",
      hazardousSubstances: {
        refrigerantGas: { type: "R-600a", gwp: 3, odp: 0 },
        flameRetardants: "HBCD-free",
        mercury: "Not present",
        leadInSolder: "RoHS compliant (< 0.1%)",
        rohsCompliance: true,
      },
      recyclabilityRate: randomFloat(75, 92),
      recycledContent: randomFloat(10, 30),
      conamaCompliance: true,
      ibamaCompliance: true,
      euAlignment: { rohs: true, reach: "Screening complete", weee: "Aligned" },
    },
    WASHING_MACHINE: {
      carbonFootprint: randomFloat(200, 350),
      carbonUnit: "kg CO2e",
      energyConsumption: randomFloat(0.08, 0.22),
      energyUnit: "kWh/ciclo",
      energyClass: randomPick(["A", "A", "B"]),
      waterConsumption: randomFloat(80, 150),
      waterUnit: "L/ciclo",
      noiseLevel: randomInt(48, 56),
      noiseUnit: "dB",
      hazardousSubstances: {
        flameRetardants: "Halogen-free",
        mercury: "Not present",
        leadInSolder: "RoHS compliant",
        rohsCompliance: true,
      },
      recyclabilityRate: randomFloat(70, 88),
      recycledContent: randomFloat(15, 35),
      conamaCompliance: true,
      ibamaCompliance: true,
      euAlignment: { rohs: true, reach: "Screening complete", weee: "Aligned" },
    },
    AIR_CONDITIONER: {
      carbonFootprint: randomFloat(300, 550),
      carbonUnit: "kg CO2e",
      energyConsumption: randomFloat(700, 1200),
      energyUnit: "kWh/ano",
      energyClass: randomPick(["A", "B", "C"]),
      btu: randomPick([9000, 12000, 18000, 24000]),
      noiseLevel: randomInt(19, 32),
      noiseUnit: "dB (indoor)",
      hazardousSubstances: {
        refrigerantGas: { type: randomPick(["R-32", "R-410A"]), gwp: 675, odp: 0 },
        flameRetardants: "Halogen-free plastics",
        rohsCompliance: true,
      },
      recyclabilityRate: randomFloat(70, 85),
      recycledContent: randomFloat(5, 20),
      conamaCompliance: true,
      ibamaCompliance: true,
      euAlignment: { rohs: true, reach: "Partial screening", weee: "Aligned" },
    },
    STOVE: {
      carbonFootprint: randomFloat(150, 280),
      carbonUnit: "kg CO2e",
      energyClass: randomPick(["A", "B"]),
      gasType: "GLP (P-13)",
      noiseLevel: "N/A",
      hazardousSubstances: {
        enamelCoating: "Lead-free",
        rohsCompliance: true,
      },
      recyclabilityRate: randomFloat(80, 95),
      recycledContent: randomFloat(20, 40),
      conamaCompliance: true,
      ibamaCompliance: true,
      euAlignment: { rohs: true, reach: "Compliant", weee: "Aligned" },
    },
    MICROWAVE: {
      carbonFootprint: randomFloat(80, 150),
      carbonUnit: "kg CO2e",
      energyConsumption: randomFloat(0.8, 1.5),
      energyUnit: "kWh/dia (média)",
      energyClass: randomPick(["A", "B", "C"]),
      power: randomPick([800, 900, 1000, 1200]),
      powerUnit: "W",
      noiseLevel: "N/A",
      hazardousSubstances: {
        magnetronBeryllium: "Sealed component",
        leadInSolder: "RoHS compliant",
        rohsCompliance: true,
      },
      recyclabilityRate: randomFloat(65, 82),
      recycledContent: randomFloat(8, 22),
      conamaCompliance: true,
      ibamaCompliance: true,
      euAlignment: { rohs: true, reach: "Screening complete", weee: "Aligned" },
    },
  };
  return data[category] || data.REFRIGERATOR;
}

function generateOperatingManual(brand: string, model: string) {
  return {
    manualUrl: `/docs/manuals/${brand.toLowerCase()}-${model.toLowerCase()}.pdf`,
    installationGuide: "Included in manual - Section 2",
    safetyWarnings: [
      "Não obstrua as entradas de ventilação",
      "Mantenha distância mínima de 5cm das paredes",
      "Não use extensões elétricas",
    ],
    energySavingTips: [
      "Mantenha a porta fechada o máximo possível",
      "Verifique a borracha de vedação regularmente",
      "Limpe o condensador a cada 6 meses",
    ],
    warrantyDuration: "12 meses",
    warrantyTerms: "Cobertura para defeitos de fabricação. Não cobre mau uso.",
    customerSupport: {
      sac: "0800-970-0999",
      email: `suporte@${brand.toLowerCase()}.com.br`,
      website: `https://www.${brand.toLowerCase()}.com.br/suporte`,
    },
  };
}

function generateRegulatoryData(category: string, energyClass: string) {
  return {
    inmetroStatus: "Válido",
    inmetroCertNumber: `INM-${randomInt(100000, 999999)}-${new Date().getFullYear()}`,
    inmetroExpiry: "2027-12-31",
    seloProcel: energyClass,
    seloProcelYear: 2025,
    conamaCompliance: true,
    conamaRef: "Resolução CONAMA nº 401/2008",
    euAlignment: {
      esprReadinessScore: randomInt(60, 95),
      weeeAlignment: "Aligned",
      rohsCompliance: true,
      reachSvhcScreening: randomPick(["Complete", "In progress"]),
    },
  };
}

export function generateMockProducts(): MockProduct[] {
  const products: MockProduct[] = [];

  // 4 more refrigerators (we have 3 real ones from recyclers)
  const refrigerators = [
    { brand: "Brastemp", model: "BRE57AK", serial: `BR${randomInt(1000000, 9999999)}` },
    { brand: "Consul", model: "CRD49AK", serial: `CL${randomInt(1000000, 9999999)}` },
    { brand: "Electrolux", model: "DF56S", serial: `EX${randomInt(1000000, 9999999)}` },
    { brand: "Samsung", model: "RT46K6", serial: `SM${randomInt(1000000, 9999999)}` },
  ];

  for (const r of refrigerators) {
    const envData = generateEnvironmentalData("REFRIGERATOR");
    products.push({
      category: "REFRIGERATOR",
      brand: r.brand,
      model: r.model,
      serialNumber: r.serial,
      gtin: getStandardGTIN(r.brand, r.model),
      manufacturingDate: randomDate(new Date("2023-01-01"), new Date("2025-06-01")),
      manufacturingFacility: randomPick(FACTORIES[r.brand] || ["Manaus, AM"]),
      batchNumber: `LOT-${randomInt(1000, 9999)}`,
      lifecycleStage: randomPick(["SOLD", "IN_USE", "IN_USE", "IN_USE"]),
      supplyChainData: {
        ...generateBOM("REFRIGERATOR"),
        manufacturerLegalName: `${r.brand} S.A.`,
        countryOfOrigin: "Brasil",
        mainMaterials: ["Aço", "Plástico", "Espuma PU", "Cobre"],
      },
      environmentalData: envData,
      operatingManualData: generateOperatingManual(r.brand, r.model),
      regulatoryData: generateRegulatoryData("REFRIGERATOR", envData.energyClass as string),
    });
  }

  // 2 more washing machines
  const washingMachines = [
    { brand: "Brastemp", model: "BWH12AB", serial: `BW${randomInt(1000000, 9999999)}` },
    { brand: "Electrolux", model: "LEV11", serial: `EL${randomInt(1000000, 9999999)}` },
  ];

  for (const w of washingMachines) {
    const envData = generateEnvironmentalData("WASHING_MACHINE");
    products.push({
      category: "WASHING_MACHINE",
      brand: w.brand,
      model: w.model,
      serialNumber: w.serial,
      gtin: getStandardGTIN(w.brand, w.model),
      manufacturingDate: randomDate(new Date("2023-06-01"), new Date("2025-03-01")),
      manufacturingFacility: randomPick(FACTORIES[w.brand] || ["Curitiba, PR"]),
      batchNumber: `LOT-${randomInt(1000, 9999)}`,
      lifecycleStage: randomPick(["MANUFACTURED", "SOLD", "IN_USE"]),
      supplyChainData: {
        ...generateBOM("WASHING_MACHINE"),
        manufacturerLegalName: `${w.brand} S.A.`,
        countryOfOrigin: "Brasil",
        mainMaterials: ["Aço", "Plástico", "Concreto", "Cobre"],
      },
      environmentalData: envData,
      operatingManualData: generateOperatingManual(w.brand, w.model),
      regulatoryData: generateRegulatoryData("WASHING_MACHINE", envData.energyClass as string),
    });
  }

  // 4 air conditioners
  const airCons = [
    { brand: "Samsung", model: "AR12BVHC", serial: `AC${randomInt(1000000, 9999999)}` },
    { brand: "LG", model: "S4NQ12JA3", serial: `LG${randomInt(1000000, 9999999)}` },
    { brand: "Electrolux", model: "QI12R", serial: `AE${randomInt(1000000, 9999999)}` },
    { brand: "Midea", model: "MSA12CR", serial: `MD${randomInt(1000000, 9999999)}` },
  ];

  for (const ac of airCons) {
    const envData = generateEnvironmentalData("AIR_CONDITIONER");
    products.push({
      category: "AIR_CONDITIONER",
      brand: ac.brand,
      model: ac.model,
      serialNumber: ac.serial,
      gtin: getStandardGTIN(ac.brand, ac.model),
      manufacturingDate: randomDate(new Date("2024-01-01"), new Date("2025-09-01")),
      manufacturingFacility: "Manaus, AM",
      batchNumber: `LOT-${randomInt(1000, 9999)}`,
      lifecycleStage: randomPick(["MANUFACTURED", "SOLD", "IN_USE", "IN_USE"]),
      supplyChainData: {
        ...generateBOM("AIR_CONDITIONER"),
        manufacturerLegalName: `${ac.brand} da Amazônia Ltda.`,
        countryOfOrigin: "Brasil",
        mainMaterials: ["Aço", "Alumínio", "Cobre", "Plástico ABS"],
      },
      environmentalData: envData,
      operatingManualData: generateOperatingManual(ac.brand, ac.model),
      regulatoryData: generateRegulatoryData("AIR_CONDITIONER", envData.energyClass as string),
    });
  }

  return products;
}

export function generateRepairEvents(productId: string, count: number) {
  const events = [];
  const issues = [
    { desc: "Compressor não liga", parts: [{ name: "Compressor Embraco VEMY7C", partNumber: "W10393809", cost: 450 }] },
    { desc: "Vazamento de água na base", parts: [{ name: "Mangueira de drenagem", partNumber: "W10254672", cost: 35 }] },
    { desc: "Termostato com defeito", parts: [{ name: "Termostato Robertshaw RC-42600-2P", partNumber: "TST-42600", cost: 85 }] },
    { desc: "Placa eletrônica queimada", parts: [{ name: "Placa de controle principal", partNumber: "W10706206", cost: 280 }] },
    { desc: "Borracha de vedação ressecada", parts: [{ name: "Gaxeta da porta", partNumber: "W10632465", cost: 120 }] },
    { desc: "Motor do ventilador com ruído", parts: [{ name: "Motor ventilador evaporador", partNumber: "W10527902", cost: 95 }] },
    { desc: "Resistência de degelo queimada", parts: [{ name: "Resistência de degelo", partNumber: "W10515807", cost: 65 }] },
    { desc: "Bomba de drenagem entupida", parts: [{ name: "Bomba de drenagem Askoll", partNumber: "W10130914", cost: 110 }] },
  ];

  for (let i = 0; i < count; i++) {
    const issue = randomPick(issues);
    const laborCost = randomFloat(80, 200);
    const partsCost = issue.parts.reduce((sum, p) => sum + p.cost, 0);
    events.push({
      productId,
      date: randomDate(new Date("2024-01-01"), new Date("2026-01-01")),
      serviceCenterId: `SC-${randomInt(1000, 9999)}`,
      issueDescription: issue.desc,
      partsReplaced: issue.parts,
      laborCost,
      totalCost: laborCost + partsCost,
      currency: "BRL",
      postRepairStatus: randomPick(["passed", "passed", "passed", "conditional"]),
      notes: randomPick([null, "Cliente satisfeito", "Garantia aplicada", "Peça sob encomenda"]),
    });
  }

  return events;
}

const CONSUMER_CITIES = [
  "São Paulo, SP",
  "Rio de Janeiro, RJ",
  "Belo Horizonte, MG",
  "Curitiba, PR",
  "Porto Alegre, RS",
  "Recife, PE",
  "Salvador, BA",
  "Fortaleza, CE",
  "Brasília, DF",
  "Campinas, SP",
  "Goiânia, GO",
  "Florianópolis, SC",
];

export function generateOwnershipChain(productId: string, brand: string, stage: string, options?: { addRegistration?: boolean; addSecondHandResale?: boolean }) {
  const events = [];
  const mfgDate = randomDate(new Date("2023-01-01"), new Date("2024-06-01"));

  // Manufacturing event
  events.push({
    productId,
    eventType: "MANUFACTURED",
    date: mfgDate,
    fromEntity: null,
    toEntity: `${brand} S.A.`,
    notes: "Produto fabricado",
  });

  if (["SOLD", "IN_USE", "UNDER_REPAIR", "RESOLD", "COLLECTED", "RECYCLED"].includes(stage)) {
    const retailer = randomPick(RETAILERS);
    const saleToRetailer = new Date(mfgDate.getTime() + randomInt(15, 60) * 86400000);
    events.push({
      productId,
      eventType: "SOLD_TO_RETAILER",
      date: saleToRetailer,
      fromEntity: `${brand} S.A.`,
      toEntity: retailer.name,
      retailerName: retailer.name,
      retailerCnpj: retailer.cnpj,
      saleLocation: retailer.location,
    });

    if (["IN_USE", "UNDER_REPAIR", "RESOLD", "COLLECTED", "RECYCLED"].includes(stage)) {
      const saleToConsumer = new Date(saleToRetailer.getTime() + randomInt(1, 30) * 86400000);
      const consumerHash = Math.random().toString(36).substr(2, 8);
      events.push({
        productId,
        eventType: "SOLD_TO_CONSUMER",
        date: saleToConsumer,
        fromEntity: retailer.name,
        toEntity: "Consumidor Final",
        consumerIdHash: consumerHash,
        retailerName: retailer.name,
        retailerCnpj: retailer.cnpj,
        saleLocation: retailer.location,
        usageTelemetry: {
          operatingHours: randomInt(1000, 15000),
          energyConsumed: randomFloat(200, 2000) + " kWh",
          faultCodes: randomPick([[], [], ["E01"], ["E03", "E07"]]),
        },
      });

      // Registered event — consumer registers the product before first use
      if (options?.addRegistration) {
        const registrationDate = new Date(saleToConsumer.getTime() + randomInt(0, 7) * 86400000);
        events.push({
          productId,
          eventType: "REGISTERED",
          date: registrationDate,
          fromEntity: null,
          toEntity: null,
          consumerIdHash: consumerHash,
          saleLocation: randomPick(CONSUMER_CITIES),
          notes: "Produto registrado pelo consumidor",
        });
      }

      // Second-hand resale — consumer sells to another consumer
      if (options?.addSecondHandResale) {
        const resaleDate = new Date(saleToConsumer.getTime() + randomInt(180, 730) * 86400000);
        const buyerHash = Math.random().toString(36).substr(2, 8);
        // Ensure the resale date is before any collection/recycling event
        if (!["COLLECTED", "RECYCLED"].includes(stage) || resaleDate < new Date("2025-11-01")) {
          events.push({
            productId,
            eventType: "SECOND_HAND_RESALE",
            date: resaleDate,
            fromEntity: `Consumer ${consumerHash}`,
            toEntity: `Consumer ${buyerHash}`,
            consumerIdHash: buyerHash,
            saleLocation: randomPick(CONSUMER_CITIES),
            price: randomFloat(200, 3000, 0),
            currency: "BRL",
            notes: "Venda entre consumidores em marketplace",
          });
        }
      }
    }

    if (["COLLECTED", "RECYCLED"].includes(stage)) {
      events.push({
        productId,
        eventType: "COLLECTED_FOR_RECYCLING",
        date: randomDate(new Date("2025-12-01"), new Date("2026-02-10")),
        fromEntity: "Consumidor",
        toEntity: randomPick(["JG-SUSTENTARE", "WK Solutions", "Greentech"]),
        notes: "Coletado para reciclagem - PNRS",
      });
    }
  }

  return events;
}

export { RETAILERS, SERVICE_CENTERS };
