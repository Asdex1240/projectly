import { uid } from "@/app/presentation/utils/clients/ids";
import { generateQuotationNumber } from "@/app/presentation/utils/clients/quotation-totals";
import { createEmptyScopeDocument } from "@/app/presentation/utils/clients/scope-templates";
import type {
  QuotationDocument,
  QuotationItem,
  ScopeDocument,
  ScopePhase,
  ScopePriceItem,
  ScopeSection,
  ScopeTable,
} from "@/app/presentation/types/clients/types";
import type { CompanyProfile } from "@/app/presentation/types/profile/types";

type Json = Record<string, unknown>;

export class DocumentImportError extends Error {}

function isObject(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function num(value: unknown, fallback = 0): number {
  const parsed = typeof value === "string" ? Number(value) : value;
  return typeof parsed === "number" && Number.isFinite(parsed) ? parsed : fallback;
}

function arr(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function parseRoot(raw: string): Json {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (error) {
    throw new DocumentImportError(
      `JSON inválido: ${error instanceof Error ? error.message : "no se pudo leer"}`
    );
  }
  if (!isObject(data)) {
    throw new DocumentImportError("El JSON debe ser un objeto ({ ... }).");
  }
  return data;
}

// ---------- Cotización ----------

function toQuotationItem(value: unknown, index: number): QuotationItem {
  if (!isObject(value)) {
    throw new DocumentImportError(`El concepto #${index + 1} debe ser un objeto.`);
  }
  return {
    id: uid(),
    description: str(value.description),
    quantity: num(value.quantity, 1),
    unitPrice: num(value.unitPrice),
    subItems: arr(value.subItems).map((sub) => ({
      id: uid(),
      description: isObject(sub) ? str(sub.description) : str(sub),
    })),
  };
}

export function parseQuotationJson(
  raw: string,
  clientId: string,
  profile: CompanyProfile
): QuotationDocument {
  const data = parseRoot(raw);
  if (data.items !== undefined && !Array.isArray(data.items)) {
    throw new DocumentImportError('"items" debe ser un arreglo.');
  }

  const now = new Date().toISOString();
  const today = now.slice(0, 10);
  const issuer = isObject(data.issuer) ? data.issuer : {};

  return {
    id: uid(),
    clientId,
    number: str(data.number) || generateQuotationNumber(),
    date: str(data.date, today),
    validUntil: str(data.validUntil, today),
    currency: str(data.currency, "MXN").toUpperCase(),
    issuer: {
      name: str(issuer.name, profile.name),
      logo: profile.logo,
      brandColor: str(issuer.brandColor) || profile.brandColor || "#111827",
    },
    preparedBy: str(data.preparedBy, profile.preparedBy),
    items: arr(data.items).map(toQuotationItem),
    notes: str(data.notes),
    terms: str(data.terms),
    taxRate: num(data.taxRate, 16),
    createdAt: now,
    updatedAt: now,
  };
}

// ---------- Alcance ----------

const SECTION_TYPES: ScopeSection["type"][] = ["text", "list", "phases", "pricing"];

function toTables(value: unknown): ScopeTable[] {
  return arr(value)
    .filter(isObject)
    .map((table) => {
      const columns = arr(table.columns).map((col) => str(col));
      return {
        id: uid(),
        title: str(table.title) || undefined,
        columns,
        rows: arr(table.rows).map((row) => {
          const cells = arr(row).map((cell) => str(cell));
          return columns.map((_, i) => cells[i] ?? "");
        }),
      };
    });
}

function toPhase(value: unknown): ScopePhase {
  const phase = isObject(value) ? value : { name: value };
  return {
    id: uid(),
    name: str(phase.name),
    description: str(phase.description),
    duration: str(phase.duration),
  };
}

function toPriceItem(value: unknown): ScopePriceItem {
  const item = isObject(value) ? value : { concept: value };
  return {
    id: uid(),
    concept: str(item.concept),
    detail: str(item.detail),
    justification: str(item.justification),
    amount: num(item.amount),
  };
}

function toScopeSection(value: unknown, index: number): ScopeSection {
  if (!isObject(value)) {
    throw new DocumentImportError(`La sección #${index + 1} debe ser un objeto.`);
  }
  const type = str(value.type) as ScopeSection["type"];
  if (!SECTION_TYPES.includes(type)) {
    throw new DocumentImportError(
      `La sección #${index + 1} tiene un "type" inválido. Usa: ${SECTION_TYPES.join(", ")}.`
    );
  }

  const base = {
    id: uid(),
    title: str(value.title, "Nueva sección"),
    enabled: value.enabled !== false,
    tables: toTables(value.tables),
  };

  switch (type) {
    case "text":
      return { ...base, type, body: str(value.body) };
    case "list":
      return {
        ...base,
        type,
        intro: str(value.intro),
        items: arr(value.items).map((item) => str(item)),
      };
    case "phases":
      return { ...base, type, intro: str(value.intro), phases: arr(value.phases).map(toPhase) };
    case "pricing":
      return {
        ...base,
        type,
        intro: str(value.intro),
        showAmounts: value.showAmounts !== false,
        items: arr(value.items).map(toPriceItem),
        notes: str(value.notes),
      };
  }
}

export function parseScopeJson(
  raw: string,
  clientId: string,
  profile: CompanyProfile
): ScopeDocument {
  const data = parseRoot(raw);
  if (data.sections !== undefined && !Array.isArray(data.sections)) {
    throw new DocumentImportError('"sections" debe ser un arreglo.');
  }

  const base = createEmptyScopeDocument(clientId, profile);
  const quoteTotal = data.quoteTotal === null || data.quoteTotal === undefined
    ? null
    : num(data.quoteTotal);

  return {
    ...base,
    docTitle: str(data.docTitle, base.docTitle),
    company: str(data.company, base.company),
    preparedBy: str(data.preparedBy, base.preparedBy),
    contact: str(data.contact, base.contact),
    date: str(data.date, base.date),
    version: str(data.version, base.version),
    validity: str(data.validity, base.validity),
    currency: str(data.currency, base.currency).toUpperCase(),
    accent: str(data.accent) || base.accent,
    quoteTotal,
    sections: Array.isArray(data.sections)
      ? data.sections.map(toScopeSection)
      : base.sections,
  };
}
