import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import { ALL_REAL_PRODUCTS } from "./real-data";
import {
  generateMockProducts,
  generateRepairEvents,
  generateOwnershipChain,
} from "./mock-data";
import { getStandardGTIN } from "../../src/lib/gs1";
import * as fs from "fs";
import * as path from "path";

// dev.db is at project root (CWD), same path as DATABASE_URL="file:./dev.db"
const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

const DEMO_PASSWORD = "dpp2026";

const DEMO_USERS = [
  { email: "fabricante@dpp.br", name: "Ana Silva", role: "MANUFACTURER" as const, organization: "Brastemp (Whirlpool)", cnpj: "59.104.760/0001-01" },
  { email: "consumidor@dpp.br", name: "Maria Oliveira", role: "CONSUMER" as const, organization: null, cnpj: null },
  { email: "tecnico@dpp.br", name: "João Pereira", role: "REPAIR_TECH" as const, organization: "Brastemp Assistência Técnica", cnpj: "12.345.678/0001-90" },
  { email: "reciclador@dpp.br", name: "Roberto Costa", role: "RECYCLER" as const, organization: "JG-SUSTENTARE", cnpj: "98.765.432/0001-10" },
];

function generateUID(gtin: string | null, serial: string): string {
  const id = gtin || Math.random().toString(36).substr(2, 13);
  return `urn:dpp:br:${id}:${serial}`;
}

async function copyRecyclerPhotos() {
  const projectRoot = path.resolve(__dirname, "../..");
  const realDataRoot = path.resolve(projectRoot, "../poc-real-data/recyclers");
  const uploadsRoot = path.resolve(projectRoot, "public/uploads/recyclers");

  // Create directories
  const dirs = ["jg-sustentare", "wk-solutions", "greentech"];
  for (const dir of dirs) {
    const dirPath = path.join(uploadsRoot, dir);
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // JG-SUSTENTARE: 4 products
  const jgPath = path.join(realDataRoot, "JG-SUSTENTARE (Alvorada-RS)");
  for (let prod = 1; prod <= 4; prod++) {
    const prodDir = path.join(jgPath, `PRODUTO ${prod}`);
    if (!fs.existsSync(prodDir)) continue;
    const files = fs.readdirSync(prodDir).filter((f) => /\.(jpg|jpeg)$/i.test(f)).sort();
    files.forEach((file, idx) => {
      const src = path.join(prodDir, file);
      const dest = path.join(uploadsRoot, "jg-sustentare", `prod${prod}-photo${idx + 1}.jpg`);
      fs.copyFileSync(src, dest);
    });
  }

  // WK Solutions: flat structure
  const wkPath = path.join(realDataRoot, "WK Solutions - São Paulo SP");
  if (fs.existsSync(wkPath)) {
    const wkFiles = fs.readdirSync(wkPath);
    for (const file of wkFiles) {
      if (/^Produto \d+\.jpeg$/i.test(file)) {
        const num = file.match(/(\d+)/)?.[1];
        if (num) {
          fs.copyFileSync(
            path.join(wkPath, file),
            path.join(uploadsRoot, "wk-solutions", `produto-0${num}.jpeg`)
          );
        }
      }
      if (/^Serial \d+\.jpeg$/i.test(file)) {
        const num = file.match(/(\d+)/)?.[1];
        if (num) {
          fs.copyFileSync(
            path.join(wkPath, file),
            path.join(uploadsRoot, "wk-solutions", `serial-0${num}.jpeg`)
          );
        }
      }
    }
  }

  // Greentech: products in subdirectories
  const gtPath = path.join(realDataRoot, "Greentech - MG");
  for (let prod = 1; prod <= 4; prod++) {
    const prodDir = path.join(gtPath, `Produto ${prod}`);
    if (!fs.existsSync(prodDir)) continue;
    const files = fs.readdirSync(prodDir).filter((f) => /\.(jpg|jpeg)$/i.test(f)).sort();
    files.forEach((file, idx) => {
      const src = path.join(prodDir, file);
      const dest = path.join(uploadsRoot, "greentech", `prod${prod}-photo${idx + 1}.jpeg`);
      fs.copyFileSync(src, dest);
    });
  }

  console.log("✅ Recycler photos copied to public/uploads/recyclers/");
}

async function seedUsers() {
  const hash = await bcrypt.hash(DEMO_PASSWORD, 10);

  for (const user of DEMO_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        passwordHash: hash,
        role: user.role,
        organization: user.organization,
        cnpj: user.cnpj,
      },
    });
  }
  console.log("✅ Demo users created (password: dpp2026)");
}

async function seedRealProducts() {
  const recyclerUser = await prisma.user.findFirst({ where: { role: "RECYCLER" } });
  const manufacturerUser = await prisma.user.findFirst({ where: { role: "MANUFACTURER" } });

  for (const rp of ALL_REAL_PRODUCTS) {
    const gtin = getStandardGTIN(rp.brand, rp.model);
    const uid = generateUID(gtin, rp.serialNumber);

    // Generate mock upstream data for real recycled products
    const envData = {
      carbonFootprint: 300 + Math.random() * 200,
      carbonUnit: "kg CO2e",
      energyConsumption: 200 + Math.random() * 200,
      energyUnit: "kWh/ano",
      energyClass: ["A", "B", "C"][Math.floor(Math.random() * 3)],
      recyclabilityRate: 70 + Math.random() * 20,
      recycledContent: 10 + Math.random() * 20,
      conamaCompliance: true,
      ibamaCompliance: true,
    };

    const product = await prisma.product.create({
      data: {
        uid,
        gtin,
        serialNumber: rp.serialNumber,
        category: rp.category,
        brand: rp.brand,
        model: rp.model,
        productCode: rp.productCode,
        manufacturingDate: new Date(rp.processingDate.getTime() - (365 * (2 + Math.random() * 8)) * 86400000), // 2-10 years before recycling (varied)
        manufacturingFacility: rp.brand === "Consul" ? "Joinville, SC" : rp.brand === "Brastemp" ? "Rio Claro, SP" : "Manaus, AM",
        batchNumber: `LOT-${Math.floor(Math.random() * 9000 + 1000)}`,
        lifecycleStage: "RECYCLED",
        manufacturerId: manufacturerUser?.id,
        supplyChainData: {
          totalWeight: rp.category === "MICROWAVE" ? 12 : rp.category === "STOVE" ? 50 : 65,
          manufacturerLegalName: `${rp.brand} S.A.`,
          countryOfOrigin: "Brasil",
          mainMaterials: ["Aço", "Plástico", "Cobre", "Alumínio"],
          keyComponents: { compressor: "Embraco", controlBoard: "Whirlpool Electronics" },
        },
        environmentalData: envData,
        operatingManualData: {
          manualUrl: `/docs/manuals/${rp.brand.toLowerCase()}-${rp.model.toLowerCase()}.pdf`,
          warrantyDuration: "12 meses",
          customerSupport: { sac: "0800-970-0999" },
        },
        regulatoryData: {
          inmetroStatus: "Expirado",
          seloProcel: envData.energyClass,
          conamaCompliance: true,
          euAlignment: { esprReadinessScore: 65, rohsCompliance: true },
        },
      },
    });

    // Create end-of-life record with real data
    await prisma.endOfLifeRecord.create({
      data: {
        productId: product.id,
        recyclerId: recyclerUser?.id,
        recyclerName: rp.recyclerName,
        recyclerCity: rp.recyclerCity,
        collectionDate: new Date(rp.processingDate.getTime() - 7 * 86400000), // 1 week before processing
        collectionLocation: rp.collectionLocation,
        processingLocation: rp.processingLocation,
        processingDate: rp.processingDate,
        functionalStatus: rp.condition.functionalStatus,
        cosmeticCondition: rp.condition.cosmeticCondition,
        isRusted: rp.condition.isRusted,
        isDented: rp.condition.isDented,
        isYellowed: rp.condition.isYellowed,
        isBroken: rp.condition.isBroken,
        isDisassembled: rp.condition.isDisassembled,
        isCannibalized: rp.condition.isCannibalized,
        otherConditionNotes: rp.condition.otherNotes,
        photos: rp.photos,
        disassemblyReport: {
          components: ["Compressor", "Motor", "Placa eletrônica", "Estrutura metálica"],
          materialsExtracted: {
            metals: `${(Math.random() * 20 + 15).toFixed(1)} kg`,
            plastics: `${(Math.random() * 10 + 5).toFixed(1)} kg`,
            copper: `${(Math.random() * 2 + 0.5).toFixed(1)} kg`,
            glass: `${(Math.random() * 3 + 1).toFixed(1)} kg`,
          },
          hazardousHandled: true,
          hazardousDetails: rp.category === "REFRIGERATOR" ? "Gás R-600a recuperado" : "N/A",
        },
        recyclingRate: 75 + Math.random() * 15,
        finalDisposition: "recycled",
        certificateNumber: `CERT-${rp.recyclerName.substring(0, 2).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
        isRealData: true,
        dataSource: rp.dataSource,
      },
    });

    // Add ownership chain — real recycled products: ~50% with registration, ~30% with second-hand resale
    const addRegistration = Math.random() < 0.5;
    const addSecondHandResale = Math.random() < 0.3;
    const mfgDate = product.manufacturingDate;
    const ownershipEvents = generateOwnershipChain(product.id, rp.brand, "RECYCLED", { addRegistration, addSecondHandResale, manufacturingDate: mfgDate });
    for (const event of ownershipEvents) {
      await prisma.ownershipEvent.create({ data: event as never });
    }

    // Add 1-2 repair events
    const repairCount = Math.floor(Math.random() * 2) + 1;
    const repairEvents = generateRepairEvents(product.id, repairCount, mfgDate);
    for (const event of repairEvents) {
      await prisma.repairEvent.create({ data: event as never });
    }
  }

  console.log(`✅ ${ALL_REAL_PRODUCTS.length} real recycler products seeded`);
}

async function seedMockProducts() {
  const manufacturerUser = await prisma.user.findFirst({ where: { role: "MANUFACTURER" } });
  const mockProducts = generateMockProducts();

  for (const mp of mockProducts) {
    const uid = generateUID(mp.gtin, mp.serialNumber);

    const product = await prisma.product.create({
      data: {
        uid,
        gtin: mp.gtin,
        serialNumber: mp.serialNumber,
        category: mp.category,
        brand: mp.brand,
        model: mp.model,
        manufacturingDate: mp.manufacturingDate,
        manufacturingFacility: mp.manufacturingFacility,
        batchNumber: mp.batchNumber,
        lifecycleStage: mp.lifecycleStage as never,
        manufacturerId: manufacturerUser?.id,
        supplyChainData: mp.supplyChainData as never,
        environmentalData: mp.environmentalData as never,
        operatingManualData: mp.operatingManualData as never,
        regulatoryData: mp.regulatoryData as never,
      },
    });

    // Add ownership chain — mock products: ~60% with registration, ~20% with second-hand resale (mainly IN_USE)
    const addRegistration = ["IN_USE", "UNDER_REPAIR", "RESOLD"].includes(mp.lifecycleStage) && Math.random() < 0.6;
    const addSecondHandResale = ["IN_USE", "RESOLD"].includes(mp.lifecycleStage) && Math.random() < 0.2;
    const ownershipEvents = generateOwnershipChain(product.id, mp.brand, mp.lifecycleStage, { addRegistration, addSecondHandResale, manufacturingDate: mp.manufacturingDate });
    for (const event of ownershipEvents) {
      await prisma.ownershipEvent.create({ data: event as never });
    }

    // Add repair events for products in use
    if (["IN_USE", "UNDER_REPAIR"].includes(mp.lifecycleStage)) {
      const repairCount = Math.floor(Math.random() * 3);
      if (repairCount > 0) {
        const repairEvents = generateRepairEvents(product.id, repairCount, mp.manufacturingDate);
        for (const event of repairEvents) {
          await prisma.repairEvent.create({ data: event as never });
        }
      }
    }
  }

  console.log(`✅ ${mockProducts.length} mock products seeded`);
}

async function main() {
  console.log("🌱 Starting seed...\n");

  // Check if already seeded
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log("⚠️  Database already seeded. Skipping.\n");
    return;
  }

  // Copy photos first
  try {
    await copyRecyclerPhotos();
  } catch (e) {
    console.log("⚠️  Could not copy recycler photos (real data dir may not exist):", (e as Error).message);
  }

  await seedUsers();
  await seedRealProducts();
  await seedMockProducts();

  const totalProducts = await prisma.product.count();
  const totalEOL = await prisma.endOfLifeRecord.count();
  const totalRepairs = await prisma.repairEvent.count();
  const totalOwnership = await prisma.ownershipEvent.count();

  console.log(`\n📊 Seed summary:`);
  console.log(`   Products: ${totalProducts}`);
  console.log(`   End-of-Life records: ${totalEOL}`);
  console.log(`   Repair events: ${totalRepairs}`);
  console.log(`   Ownership events: ${totalOwnership}`);
  console.log(`\n✅ Seed complete!\n`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
