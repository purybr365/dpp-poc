export type Locale = "pt-BR" | "en" | "es";

export const LOCALE_NAMES: Record<Locale, string> = {
  "pt-BR": "Português",
  en: "English",
  es: "Español",
};

type TranslationKeys = typeof translations["pt-BR"];
export type TKey = keyof TranslationKeys;

export const translations = {
  "pt-BR": {
    // Nav
    "nav.title": "DPP Brasil",
    "nav.about": "Sobre o DPP",
    "nav.publicAccess": "Acesso Público",
    "nav.switchProfile": "Trocar Perfil",

    // Login
    "login.title": "DPP Brasil",
    "login.subtitle": "Passaporte Digital de Produto — Linha Branca",
    "login.poc": "Proof of Concept • ESPR / CIRPASS alignment",
    "login.selectProfile": "Selecione um perfil para entrar",
    "login.profileDescription": "Cada perfil tem uma visão diferente do passaporte digital",
    "login.enter": "Entrar →",
    "login.entering": "Entrando...",
    "login.manualLogin": "Ou faça login com email e senha",
    "login.hideManual": "Ocultar login manual",
    "login.manualTitle": "Login Manual",
    "login.manualDescription": "Senha padrão: dpp2026",
    "login.email": "Email",
    "login.password": "Senha",
    "login.submit": "Entrar",
    "login.error": "Erro ao fazer login. Tente novamente.",
    "login.invalidCredentials": "Email ou senha inválidos.",

    // Roles
    "role.MANUFACTURER": "Fabricante",
    "role.CONSUMER": "Consumidor",
    "role.REPAIR_TECH": "Técnico de Reparo",
    "role.RECYCLER": "Reciclador",

    // Role descriptions
    "roleDesc.MANUFACTURER": "Cria passaportes, gerencia produção",
    "roleDesc.CONSUMER": "Consulta produto, manual, garantia",
    "roleDesc.REPAIR_TECH": "Registra reparos, consulta peças",
    "roleDesc.RECYCLER": "Registra fim de vida, desmontagem",

    // Dashboard
    "dashboard.panel": "Painel",
    "dashboard.products": "Produtos",
    "dashboard.records": "registros",
    "dashboard.newProduct": "+ Novo Produto",
    "dashboard.totalProducts": "Total Produtos",
    "dashboard.manufactured": "Fabricados",
    "dashboard.inUse": "Em Uso",
    "dashboard.recycled": "Reciclados",
    "dashboard.registered": "Produtos Registrados",
    "dashboard.withRepair": "Com Reparo",
    "dashboard.underRepair": "Em Reparo",
    "dashboard.repairsPerformed": "Reparos Realizados",
    "dashboard.eolRecords": "Registros EOL",
    "dashboard.realData": "Dados Reais",
    "dashboard.byCategory": "Por Categoria",
    "dashboard.byBrand": "Por Marca",
    "dashboard.productAge": "Idade",
    "dashboard.search.placeholder": "Buscar por marca, modelo, serial, GTIN...",
    "dashboard.search.noResults": "Nenhum produto encontrado",
    "dashboard.search.clear": "Limpar busca",

    // Dashboard descriptions
    "dashboardDesc.MANUFACTURER": "Gerencie passaportes de produtos, acompanhe a produção e cadeia de suprimentos.",
    "dashboardDesc.CONSUMER": "Consulte informações do seu produto, manual, garantia e histórico.",
    "dashboardDesc.REPAIR_TECH": "Registre reparos, consulte peças e histórico de manutenção.",
    "dashboardDesc.RECYCLER": "Registre dados de fim de vida, desmontagem e materiais extraídos.",

    // Passport
    "passport.scanToAccess": "Escaneie para acessar",
    "passport.serial": "Serial",
    "passport.gtin": "GTIN",
    "passport.manufacturing": "Fabricação",
    "passport.factory": "Fábrica",
    "passport.manufacturer": "Fabricante",
    "passport.registerRepair": "Registrar Reparo",
    "passport.registerEOL": "Registrar Fim de Vida",

    // Sections
    "section.productIdentification": "Identificação do Produto",
    "section.supplyChain": "Cadeia de Suprimentos",
    "section.environmental": "Dados Ambientais",
    "section.operatingManual": "Manual e Informações",
    "section.repairData": "Reparo e Manutenção",
    "section.ownershipEvents": "Propriedade e Uso",
    "section.endOfLife": "Fim de Vida / Reciclagem",
    "section.regulatory": "Regulatório e Certificações",

    // Environmental
    "env.title": "Dados Ambientais & Conformidade",
    "env.energyRating": "Classificação Energética",
    "env.energyConsumption": "Consumo Energético",
    "env.carbonFootprint": "Pegada de Carbono",
    "env.recyclabilityRate": "Taxa de Reciclabilidade",
    "env.recycledContent": "Conteúdo Reciclado",
    "env.compliance": "Conformidade",
    "env.hazardousSubstances": "Substâncias Perigosas (RoHS)",

    // Ownership
    "ownership.title": "Propriedade & Uso",
    "ownership.noEvents": "Nenhum evento de propriedade registrado.",
    "ownership.from": "De",
    "ownership.to": "Para",
    "ownership.consumerId": "ID Consumidor",
    "ownership.lgpdHash": "(hash LGPD)",
    "ownership.retailer": "Varejista",
    "ownership.saleLocation": "Local de Venda",
    "ownership.viewMap": "Ver no Mapa",
    "ownership.hideMap": "Ocultar Mapa",

    // Ownership events
    "ownershipEvent.MANUFACTURED": "Fabricado",
    "ownershipEvent.SOLD_TO_RETAILER": "Vendido ao Varejista",
    "ownershipEvent.SOLD_TO_CONSUMER": "Vendido ao Consumidor",
    "ownershipEvent.RESOLD": "Revendido",
    "ownershipEvent.DONATED": "Doado",
    "ownershipEvent.COLLECTED_FOR_RECYCLING": "Coletado para Reciclagem",

    // Lifecycle
    "lifecycle.MANUFACTURED": "Fabricado",
    "lifecycle.IN_TRANSIT": "Em Trânsito",
    "lifecycle.SOLD": "Vendido",
    "lifecycle.IN_USE": "Em Uso",
    "lifecycle.UNDER_REPAIR": "Em Reparo",
    "lifecycle.RESOLD": "Revendido",
    "lifecycle.COLLECTED": "Coletado",
    "lifecycle.RECYCLED": "Reciclado",

    // Categories
    "category.REFRIGERATOR": "Geladeira",
    "category.WASHING_MACHINE": "Máquina de Lavar",
    "category.AIR_CONDITIONER": "Ar Condicionado",
    "category.STOVE": "Fogão",
    "category.MICROWAVE": "Micro-ondas",
    "category.DRYER": "Secadora",
    "category.DISHWASHER": "Lava-louça",

    // Map
    "map.title": "Mapa de Eventos",
    "map.noLocations": "Sem dados de localização disponíveis.",

    // Footer
    "footer.text": "DPP Brasil POC • Dados reais: JG-SUSTENTARE, WK Solutions, Greentech",

    // Access levels
    "access.full": "Acesso Total",
    "access.read": "Leitura",
    "access.summary": "Resumo",
    "access.simplified": "Simplificado",
    "access.partial": "Parcial",
    "access.own": "Próprio",
    "access.write": "Escrita",
    "access.hidden": "Oculto",

    // Time
    "time.year": "ano",
    "time.years": "anos",
    "time.month": "mês",
    "time.months": "meses",
    "time.and": "e",
  },
  en: {
    "nav.title": "DPP Brazil",
    "nav.about": "About DPP",
    "nav.publicAccess": "Public Access",
    "nav.switchProfile": "Switch Profile",

    "login.title": "DPP Brazil",
    "login.subtitle": "Digital Product Passport — White Goods",
    "login.poc": "Proof of Concept • ESPR / CIRPASS alignment",
    "login.selectProfile": "Select a profile to log in",
    "login.profileDescription": "Each profile has a different view of the digital passport",
    "login.enter": "Enter →",
    "login.entering": "Entering...",
    "login.manualLogin": "Or log in with email and password",
    "login.hideManual": "Hide manual login",
    "login.manualTitle": "Manual Login",
    "login.manualDescription": "Default password: dpp2026",
    "login.email": "Email",
    "login.password": "Password",
    "login.submit": "Log In",
    "login.error": "Login error. Please try again.",
    "login.invalidCredentials": "Invalid email or password.",

    "role.MANUFACTURER": "Manufacturer",
    "role.CONSUMER": "Consumer",
    "role.REPAIR_TECH": "Repair Technician",
    "role.RECYCLER": "Recycler",

    "roleDesc.MANUFACTURER": "Creates passports, manages production",
    "roleDesc.CONSUMER": "Checks product info, manual, warranty",
    "roleDesc.REPAIR_TECH": "Registers repairs, checks parts",
    "roleDesc.RECYCLER": "Registers end-of-life, disassembly",

    "dashboard.panel": "Dashboard",
    "dashboard.products": "Products",
    "dashboard.records": "records",
    "dashboard.newProduct": "+ New Product",
    "dashboard.totalProducts": "Total Products",
    "dashboard.manufactured": "Manufactured",
    "dashboard.inUse": "In Use",
    "dashboard.recycled": "Recycled",
    "dashboard.registered": "Registered Products",
    "dashboard.withRepair": "With Repairs",
    "dashboard.underRepair": "Under Repair",
    "dashboard.repairsPerformed": "Repairs Performed",
    "dashboard.eolRecords": "EOL Records",
    "dashboard.realData": "Real Data",
    "dashboard.byCategory": "By Category",
    "dashboard.byBrand": "By Brand",
    "dashboard.productAge": "Age",
    "dashboard.search.placeholder": "Search by brand, model, serial, GTIN...",
    "dashboard.search.noResults": "No products found",
    "dashboard.search.clear": "Clear search",

    "dashboardDesc.MANUFACTURER": "Manage product passports, track production and supply chain.",
    "dashboardDesc.CONSUMER": "Check product info, manual, warranty, and history.",
    "dashboardDesc.REPAIR_TECH": "Register repairs, check parts, and maintenance history.",
    "dashboardDesc.RECYCLER": "Register end-of-life data, disassembly, and extracted materials.",

    "passport.scanToAccess": "Scan to access",
    "passport.serial": "Serial",
    "passport.gtin": "GTIN",
    "passport.manufacturing": "Manufacturing",
    "passport.factory": "Factory",
    "passport.manufacturer": "Manufacturer",
    "passport.registerRepair": "Register Repair",
    "passport.registerEOL": "Register End-of-Life",

    "section.productIdentification": "Product Identification",
    "section.supplyChain": "Supply Chain & BOM",
    "section.environmental": "Environmental & Compliance",
    "section.operatingManual": "Operating Manual & Info",
    "section.repairData": "Repair & Maintenance",
    "section.ownershipEvents": "Ownership & Usage",
    "section.endOfLife": "End-of-Life / Recycling",
    "section.regulatory": "Regulatory & Certifications",

    "env.title": "Environmental Data & Compliance",
    "env.energyRating": "Energy Rating",
    "env.energyConsumption": "Energy Consumption",
    "env.carbonFootprint": "Carbon Footprint",
    "env.recyclabilityRate": "Recyclability Rate",
    "env.recycledContent": "Recycled Content",
    "env.compliance": "Compliance",
    "env.hazardousSubstances": "Hazardous Substances (RoHS)",

    "ownership.title": "Ownership & Usage",
    "ownership.noEvents": "No ownership events recorded.",
    "ownership.from": "From",
    "ownership.to": "To",
    "ownership.consumerId": "Consumer ID",
    "ownership.lgpdHash": "(LGPD hash)",
    "ownership.retailer": "Retailer",
    "ownership.saleLocation": "Point of Sale",
    "ownership.viewMap": "View on Map",
    "ownership.hideMap": "Hide Map",

    "ownershipEvent.MANUFACTURED": "Manufactured",
    "ownershipEvent.SOLD_TO_RETAILER": "Sold to Retailer",
    "ownershipEvent.SOLD_TO_CONSUMER": "Sold to Consumer",
    "ownershipEvent.RESOLD": "Resold",
    "ownershipEvent.DONATED": "Donated",
    "ownershipEvent.COLLECTED_FOR_RECYCLING": "Collected for Recycling",

    "lifecycle.MANUFACTURED": "Manufactured",
    "lifecycle.IN_TRANSIT": "In Transit",
    "lifecycle.SOLD": "Sold",
    "lifecycle.IN_USE": "In Use",
    "lifecycle.UNDER_REPAIR": "Under Repair",
    "lifecycle.RESOLD": "Resold",
    "lifecycle.COLLECTED": "Collected",
    "lifecycle.RECYCLED": "Recycled",

    "category.REFRIGERATOR": "Refrigerator",
    "category.WASHING_MACHINE": "Washing Machine",
    "category.AIR_CONDITIONER": "Air Conditioner",
    "category.STOVE": "Stove",
    "category.MICROWAVE": "Microwave",
    "category.DRYER": "Dryer",
    "category.DISHWASHER": "Dishwasher",

    "map.title": "Events Map",
    "map.noLocations": "No location data available.",

    "footer.text": "DPP Brazil POC • Real data: JG-SUSTENTARE, WK Solutions, Greentech",

    "access.full": "Full Access",
    "access.read": "Read Only",
    "access.summary": "Summary",
    "access.simplified": "Simplified",
    "access.partial": "Partial",
    "access.own": "Own",
    "access.write": "Write",
    "access.hidden": "Hidden",

    "time.year": "year",
    "time.years": "years",
    "time.month": "month",
    "time.months": "months",
    "time.and": "and",
  },
  es: {
    "nav.title": "DPP Brasil",
    "nav.about": "Sobre el DPP",
    "nav.publicAccess": "Acceso Público",
    "nav.switchProfile": "Cambiar Perfil",

    "login.title": "DPP Brasil",
    "login.subtitle": "Pasaporte Digital de Producto — Línea Blanca",
    "login.poc": "Proof of Concept • ESPR / CIRPASS alignment",
    "login.selectProfile": "Seleccione un perfil para ingresar",
    "login.profileDescription": "Cada perfil tiene una vista diferente del pasaporte digital",
    "login.enter": "Ingresar →",
    "login.entering": "Ingresando...",
    "login.manualLogin": "O inicie sesión con email y contraseña",
    "login.hideManual": "Ocultar inicio manual",
    "login.manualTitle": "Inicio Manual",
    "login.manualDescription": "Contraseña por defecto: dpp2026",
    "login.email": "Email",
    "login.password": "Contraseña",
    "login.submit": "Ingresar",
    "login.error": "Error al iniciar sesión. Inténtelo de nuevo.",
    "login.invalidCredentials": "Email o contraseña inválidos.",

    "role.MANUFACTURER": "Fabricante",
    "role.CONSUMER": "Consumidor",
    "role.REPAIR_TECH": "Técnico de Reparación",
    "role.RECYCLER": "Reciclador",

    "roleDesc.MANUFACTURER": "Crea pasaportes, gestiona producción",
    "roleDesc.CONSUMER": "Consulta producto, manual, garantía",
    "roleDesc.REPAIR_TECH": "Registra reparaciones, consulta piezas",
    "roleDesc.RECYCLER": "Registra fin de vida, desmontaje",

    "dashboard.panel": "Panel",
    "dashboard.products": "Productos",
    "dashboard.records": "registros",
    "dashboard.newProduct": "+ Nuevo Producto",
    "dashboard.totalProducts": "Total Productos",
    "dashboard.manufactured": "Fabricados",
    "dashboard.inUse": "En Uso",
    "dashboard.recycled": "Reciclados",
    "dashboard.registered": "Productos Registrados",
    "dashboard.withRepair": "Con Reparación",
    "dashboard.underRepair": "En Reparación",
    "dashboard.repairsPerformed": "Reparaciones Realizadas",
    "dashboard.eolRecords": "Registros EOL",
    "dashboard.realData": "Datos Reales",
    "dashboard.byCategory": "Por Categoría",
    "dashboard.byBrand": "Por Marca",
    "dashboard.productAge": "Edad",
    "dashboard.search.placeholder": "Buscar por marca, modelo, serial, GTIN...",
    "dashboard.search.noResults": "No se encontraron productos",
    "dashboard.search.clear": "Limpiar búsqueda",

    "dashboardDesc.MANUFACTURER": "Gestione pasaportes de productos, producción y cadena de suministros.",
    "dashboardDesc.CONSUMER": "Consulte información del producto, manual, garantía e historial.",
    "dashboardDesc.REPAIR_TECH": "Registre reparaciones, consulte piezas e historial de mantenimiento.",
    "dashboardDesc.RECYCLER": "Registre datos de fin de vida, desmontaje y materiales extraídos.",

    "passport.scanToAccess": "Escanee para acceder",
    "passport.serial": "Serial",
    "passport.gtin": "GTIN",
    "passport.manufacturing": "Fabricación",
    "passport.factory": "Fábrica",
    "passport.manufacturer": "Fabricante",
    "passport.registerRepair": "Registrar Reparación",
    "passport.registerEOL": "Registrar Fin de Vida",

    "section.productIdentification": "Identificación del Producto",
    "section.supplyChain": "Cadena de Suministros",
    "section.environmental": "Datos Ambientales",
    "section.operatingManual": "Manual e Información",
    "section.repairData": "Reparación y Mantenimiento",
    "section.ownershipEvents": "Propiedad y Uso",
    "section.endOfLife": "Fin de Vida / Reciclaje",
    "section.regulatory": "Regulatorio y Certificaciones",

    "env.title": "Datos Ambientales y Conformidad",
    "env.energyRating": "Clasificación Energética",
    "env.energyConsumption": "Consumo Energético",
    "env.carbonFootprint": "Huella de Carbono",
    "env.recyclabilityRate": "Tasa de Reciclabilidad",
    "env.recycledContent": "Contenido Reciclado",
    "env.compliance": "Conformidad",
    "env.hazardousSubstances": "Sustancias Peligrosas (RoHS)",

    "ownership.title": "Propiedad y Uso",
    "ownership.noEvents": "No hay eventos de propiedad registrados.",
    "ownership.from": "De",
    "ownership.to": "Para",
    "ownership.consumerId": "ID Consumidor",
    "ownership.lgpdHash": "(hash LGPD)",
    "ownership.retailer": "Minorista",
    "ownership.saleLocation": "Punto de Venta",
    "ownership.viewMap": "Ver en Mapa",
    "ownership.hideMap": "Ocultar Mapa",

    "ownershipEvent.MANUFACTURED": "Fabricado",
    "ownershipEvent.SOLD_TO_RETAILER": "Vendido al Minorista",
    "ownershipEvent.SOLD_TO_CONSUMER": "Vendido al Consumidor",
    "ownershipEvent.RESOLD": "Revendido",
    "ownershipEvent.DONATED": "Donado",
    "ownershipEvent.COLLECTED_FOR_RECYCLING": "Recolectado para Reciclaje",

    "lifecycle.MANUFACTURED": "Fabricado",
    "lifecycle.IN_TRANSIT": "En Tránsito",
    "lifecycle.SOLD": "Vendido",
    "lifecycle.IN_USE": "En Uso",
    "lifecycle.UNDER_REPAIR": "En Reparación",
    "lifecycle.RESOLD": "Revendido",
    "lifecycle.COLLECTED": "Recolectado",
    "lifecycle.RECYCLED": "Reciclado",

    "category.REFRIGERATOR": "Refrigerador",
    "category.WASHING_MACHINE": "Lavadora",
    "category.AIR_CONDITIONER": "Aire Acondicionado",
    "category.STOVE": "Cocina",
    "category.MICROWAVE": "Microondas",
    "category.DRYER": "Secadora",
    "category.DISHWASHER": "Lavavajillas",

    "map.title": "Mapa de Eventos",
    "map.noLocations": "Sin datos de ubicación disponibles.",

    "footer.text": "DPP Brasil POC • Datos reales: JG-SUSTENTARE, WK Solutions, Greentech",

    "access.full": "Acceso Total",
    "access.read": "Solo Lectura",
    "access.summary": "Resumen",
    "access.simplified": "Simplificado",
    "access.partial": "Parcial",
    "access.own": "Propio",
    "access.write": "Escritura",
    "access.hidden": "Oculto",

    "time.year": "año",
    "time.years": "años",
    "time.month": "mes",
    "time.months": "meses",
    "time.and": "y",
  },
} as const;

export function t(locale: Locale, key: TKey): string {
  return translations[locale]?.[key] || translations["pt-BR"][key] || key;
}

export function getProductAge(manufacturingDate: Date, locale: Locale): string {
  const now = new Date();
  const diff = now.getTime() - manufacturingDate.getTime();
  const totalMonths = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} ${t(locale, years === 1 ? "time.year" : "time.years")}`);
  }
  if (months > 0) {
    parts.push(`${months} ${t(locale, months === 1 ? "time.month" : "time.months")}`);
  }
  if (parts.length === 0) {
    return `< 1 ${t(locale, "time.month")}`;
  }
  return parts.join(` ${t(locale, "time.and")} `);
}
