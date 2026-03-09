-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "organization" TEXT,
    "cnpj" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uid" TEXT NOT NULL,
    "gtin" TEXT,
    "serialNumber" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "productCode" TEXT,
    "manufacturingDate" DATETIME NOT NULL,
    "manufacturingFacility" TEXT NOT NULL,
    "batchNumber" TEXT,
    "productImageUrl" TEXT,
    "lifecycleStage" TEXT NOT NULL DEFAULT 'MANUFACTURED',
    "manufacturerId" TEXT,
    "supplyChainData" JSONB,
    "environmentalData" JSONB,
    "operatingManualData" JSONB,
    "regulatoryData" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Product_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RepairEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "serviceCenterId" TEXT,
    "technicianId" TEXT,
    "issueDescription" TEXT NOT NULL,
    "partsReplaced" JSONB,
    "laborCost" REAL,
    "totalCost" REAL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "postRepairStatus" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RepairEvent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RepairEvent_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OwnershipEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "fromEntity" TEXT,
    "toEntity" TEXT,
    "retailerName" TEXT,
    "retailerCnpj" TEXT,
    "consumerIdHash" TEXT,
    "price" REAL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "notes" TEXT,
    "createdById" TEXT,
    "usageTelemetry" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OwnershipEvent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OwnershipEvent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EndOfLifeRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "recyclerId" TEXT,
    "recyclerName" TEXT NOT NULL,
    "recyclerCnpj" TEXT,
    "recyclerCity" TEXT NOT NULL,
    "collectionDate" DATETIME NOT NULL,
    "collectionLocation" TEXT NOT NULL,
    "processingLocation" TEXT NOT NULL,
    "processingDate" DATETIME NOT NULL,
    "functionalStatus" TEXT NOT NULL,
    "cosmeticCondition" TEXT NOT NULL,
    "isRusted" BOOLEAN NOT NULL DEFAULT false,
    "isDented" BOOLEAN NOT NULL DEFAULT false,
    "isYellowed" BOOLEAN NOT NULL DEFAULT false,
    "isBroken" BOOLEAN NOT NULL DEFAULT false,
    "isDisassembled" BOOLEAN NOT NULL DEFAULT false,
    "isCannibalized" BOOLEAN NOT NULL DEFAULT false,
    "otherConditionNotes" TEXT,
    "photos" JSONB NOT NULL,
    "disassemblyReport" JSONB,
    "recyclingRate" REAL,
    "finalDisposition" TEXT,
    "certificateNumber" TEXT,
    "isRealData" BOOLEAN NOT NULL DEFAULT false,
    "dataSource" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EndOfLifeRecord_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EndOfLifeRecord_recyclerId_fkey" FOREIGN KEY ("recyclerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Product_uid_key" ON "Product"("uid");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_brand_idx" ON "Product"("brand");

-- CreateIndex
CREATE INDEX "Product_serialNumber_idx" ON "Product"("serialNumber");

-- CreateIndex
CREATE INDEX "Product_lifecycleStage_idx" ON "Product"("lifecycleStage");

-- CreateIndex
CREATE INDEX "RepairEvent_productId_idx" ON "RepairEvent"("productId");

-- CreateIndex
CREATE INDEX "OwnershipEvent_productId_idx" ON "OwnershipEvent"("productId");

-- CreateIndex
CREATE INDEX "EndOfLifeRecord_productId_idx" ON "EndOfLifeRecord"("productId");

-- CreateIndex
CREATE INDEX "EndOfLifeRecord_recyclerName_idx" ON "EndOfLifeRecord"("recyclerName");
