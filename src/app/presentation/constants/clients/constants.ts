import type { ScopeSectionType } from "@/app/presentation/types/clients/types";

export const CURRENCY_LABELS: Record<string, string> = {
  USD: "Dólar estadounidense (USD)",
  EUR: "Euro (EUR)",
  MXN: "Peso mexicano (MXN)",
  COP: "Peso colombiano (COP)",
  ARS: "Peso argentino (ARS)",
  CLP: "Peso chileno (CLP)",
  PEN: "Sol peruano (PEN)",
  BRL: "Real brasileño (BRL)",
};

export const SCOPE_SECTION_TYPE_LABELS: Record<ScopeSectionType, string> = {
  text: "Texto",
  list: "Lista",
  phases: "Fases",
  pricing: "Precios",
};
