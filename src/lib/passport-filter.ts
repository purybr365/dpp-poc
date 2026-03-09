import { RBAC_MATRIX, type Role, type PassportSection } from "./rbac-matrix";

export interface FullPassport {
  productIdentification: Record<string, unknown>;
  supplyChain: Record<string, unknown> | null;
  environmental: Record<string, unknown> | null;
  operatingManual: Record<string, unknown> | null;
  repairData: Array<Record<string, unknown>>;
  ownershipEvents: Array<Record<string, unknown>>;
  endOfLife: Array<Record<string, unknown>>;
  regulatory: Record<string, unknown> | null;
}

export function filterPassportByRole(
  passport: FullPassport,
  role: Role | null
): Partial<FullPassport> {
  const effectiveRole = role ?? "CONSUMER";
  const matrix = RBAC_MATRIX[effectiveRole];
  const filtered: Partial<FullPassport> = {};

  for (const [section, access] of Object.entries(matrix)) {
    const key = section as PassportSection;

    if (access === "hidden") {
      continue;
    }

    switch (key) {
      case "productIdentification":
        filtered.productIdentification = passport.productIdentification;
        break;

      case "supplyChain":
        if (!passport.supplyChain) break;
        if (access === "full") {
          filtered.supplyChain = passport.supplyChain;
        } else if (access === "summary") {
          filtered.supplyChain = filterSupplyChainSummary(passport.supplyChain);
        } else if (access === "partial") {
          filtered.supplyChain = filterSupplyChainPartial(passport.supplyChain);
        }
        break;

      case "environmental":
        if (!passport.environmental) break;
        if (access === "full" || access === "read") {
          filtered.environmental = passport.environmental;
        } else if (access === "simplified") {
          filtered.environmental = filterEnvironmentalSimplified(passport.environmental);
        } else if (access === "partial") {
          filtered.environmental = filterEnvironmentalPartial(passport.environmental);
        }
        break;

      case "operatingManual":
        if (!passport.operatingManual) break;
        if (access === "full" || access === "read") {
          filtered.operatingManual = passport.operatingManual;
        } else if (access === "partial") {
          // Show manual but not internal docs
          const { ...rest } = passport.operatingManual;
          filtered.operatingManual = rest;
        }
        break;

      case "repairData":
        if (access === "full" || access === "write" || access === "read") {
          filtered.repairData = passport.repairData;
        } else if (access === "own") {
          // In a real system, filter by consumer's product ownership
          // For POC, show all repair data for simplicity
          filtered.repairData = passport.repairData;
        }
        break;

      case "ownershipEvents":
        if (access === "full" || access === "write" || access === "read") {
          filtered.ownershipEvents = passport.ownershipEvents;
        } else if (access === "own") {
          // Show only consumer-relevant ownership events
          filtered.ownershipEvents = passport.ownershipEvents.map((event) => ({
            date: event.date,
            eventType: event.eventType,
            // Redact internal entity details
          }));
        }
        break;

      case "endOfLife":
        if (access === "full" || access === "write") {
          filtered.endOfLife = passport.endOfLife;
        } else if (access === "read") {
          // Read-only: show data but not write capabilities
          filtered.endOfLife = passport.endOfLife;
        }
        break;

      case "regulatory":
        if (!passport.regulatory) break;
        if (access === "full" || access === "read") {
          filtered.regulatory = passport.regulatory;
        } else if (access === "simplified") {
          filtered.regulatory = filterRegulatorySimplified(passport.regulatory);
        }
        break;
    }
  }

  return filtered;
}

function filterSupplyChainSummary(data: Record<string, unknown>) {
  return {
    totalWeight: data.totalWeight,
    mainMaterials: data.mainMaterials,
    countryOfOrigin: data.countryOfOrigin,
  };
}

function filterSupplyChainPartial(data: Record<string, unknown>) {
  return {
    totalWeight: data.totalWeight,
    mainMaterials: data.mainMaterials,
    countryOfOrigin: data.countryOfOrigin,
    keyComponents: data.keyComponents,
  };
}

function filterEnvironmentalSimplified(data: Record<string, unknown>) {
  return {
    energyRating: data.energyRating,
    energyClass: data.energyClass,
    recyclabilityRate: data.recyclabilityRate,
  };
}

function filterEnvironmentalPartial(data: Record<string, unknown>) {
  return {
    energyRating: data.energyRating,
    energyClass: data.energyClass,
    energyConsumption: data.energyConsumption,
    recyclabilityRate: data.recyclabilityRate,
    hazardousSubstances: data.hazardousSubstances,
  };
}

function filterRegulatorySimplified(data: Record<string, unknown>) {
  return {
    inmetroStatus: data.inmetroStatus,
    seloProcel: data.seloProcel,
    esprReadiness: data.esprReadiness,
  };
}
