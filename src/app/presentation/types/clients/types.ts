export interface Client {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

export interface QuotationSubItem {
  id: string;
  description: string;
}

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subItems: QuotationSubItem[];
}

export interface QuotationIssuer {
  name: string;
  logo: string | null;
  brandColor: string;
}

export interface QuotationDocument {
  id: string;
  clientId: string;
  number: string;
  date: string;
  validUntil: string;
  currency: string;
  issuer: QuotationIssuer;
  preparedBy: string;
  items: QuotationItem[];
  notes: string;
  terms: string;
  taxRate: number;
  createdAt: string;
  updatedAt: string;
}

export type ScopeSectionType = "text" | "list" | "phases" | "pricing";

export interface ScopeTable {
  id: string;
  title?: string;
  columns: string[];
  rows: string[][];
}

export interface ScopeTextSection {
  id: string;
  type: "text";
  title: string;
  enabled: boolean;
  body: string;
  tables?: ScopeTable[];
}

export interface ScopeListSection {
  id: string;
  type: "list";
  title: string;
  enabled: boolean;
  intro?: string;
  items: string[];
  tables?: ScopeTable[];
}

export interface ScopePhase {
  id: string;
  name: string;
  description: string;
  duration: string;
}

export interface ScopePhasesSection {
  id: string;
  type: "phases";
  title: string;
  enabled: boolean;
  intro?: string;
  phases: ScopePhase[];
  tables?: ScopeTable[];
}

export interface ScopePriceItem {
  id: string;
  concept: string;
  detail: string;
  justification: string;
  amount: number;
}

export interface ScopePricingSection {
  id: string;
  type: "pricing";
  title: string;
  enabled: boolean;
  intro?: string;
  showAmounts: boolean;
  items: ScopePriceItem[];
  notes: string;
  tables?: ScopeTable[];
}

export type ScopeSection =
  | ScopeTextSection
  | ScopeListSection
  | ScopePhasesSection
  | ScopePricingSection;

export interface ScopeDocument {
  id: string;
  clientId: string;
  docTitle: string;
  company: string;
  preparedBy: string;
  contact: string;
  date: string;
  version: string;
  validity: string;
  currency: string;
  accent: string;
  quoteTotal: number | null;
  sections: ScopeSection[];
  createdAt: string;
  updatedAt: string;
}
