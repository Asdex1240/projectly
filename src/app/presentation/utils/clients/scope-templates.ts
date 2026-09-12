import { uid } from "@/app/presentation/utils/clients/ids";
import type { ScopeDocument, ScopeSection } from "@/app/presentation/types/clients/types";
import type { CompanyProfile } from "@/app/presentation/types/profile/types";

export function defaultScopeSections(): ScopeSection[] {
  return [
    {
      id: uid(),
      type: "text",
      title: "Resumen ejecutivo",
      enabled: true,
      body: "Breve descripción del proyecto, el problema que resuelve y el resultado esperado para el cliente.",
    },
    {
      id: uid(),
      type: "list",
      title: "Objetivos del proyecto",
      enabled: true,
      intro: "",
      items: ["", "", ""],
    },
    {
      id: uid(),
      type: "list",
      title: "Alcance incluido",
      enabled: true,
      intro: "Lo que sí forma parte de esta contratación:",
      items: ["", ""],
    },
    {
      id: uid(),
      type: "list",
      title: "Fuera de alcance",
      enabled: true,
      intro: "Lo que no está contemplado y requeriría una cotización aparte:",
      items: ["", ""],
    },
    {
      id: uid(),
      type: "list",
      title: "Entregables",
      enabled: true,
      intro: "",
      items: ["", ""],
    },
    {
      id: uid(),
      type: "phases",
      title: "Plan de trabajo y fases",
      enabled: true,
      intro: "",
      phases: [
        { id: uid(), name: "Fase 1 — Descubrimiento y diseño", description: "", duration: "" },
        { id: uid(), name: "Fase 2 — Desarrollo", description: "", duration: "" },
        { id: uid(), name: "Fase 3 — Pruebas y entrega", description: "", duration: "" },
      ],
    },
    {
      id: uid(),
      type: "pricing",
      title: "Desglose y justificación de la inversión",
      enabled: true,
      intro: "Detalle de cada concepto de la cotización y la razón por la que tiene el valor indicado.",
      showAmounts: true,
      items: [
        { id: uid(), concept: "", detail: "", justification: "", amount: 0 },
        { id: uid(), concept: "", detail: "", justification: "", amount: 0 },
      ],
      notes: "Los valores no incluyen impuestos salvo que se indique. Forma de pago sujeta a acuerdo.",
    },
    {
      id: uid(),
      type: "list",
      title: "Supuestos y dependencias",
      enabled: true,
      intro: "Este alcance y estimación asumen lo siguiente:",
      items: [
        "El cliente entrega contenidos, accesos y credenciales necesarios en tiempo.",
        "Una única ronda de revisión por entregable.",
      ],
    },
    {
      id: uid(),
      type: "list",
      title: "Condiciones comerciales",
      enabled: true,
      intro: "",
      items: [
        "Validez de la propuesta: 30 días.",
        "El código fuente se entrega al finalizar y liquidar el pago.",
        "Soporte correctivo de 30 días posterior a la entrega.",
      ],
    },
  ];
}

export function createEmptyScopeDocument(
  clientId: string,
  profile?: CompanyProfile
): ScopeDocument {
  const now = new Date().toISOString();
  return {
    id: uid(),
    clientId,
    createdAt: now,
    updatedAt: now,
    docTitle: "Documento de Alcance del Proyecto",
    company: profile?.name ?? "",
    preparedBy: profile?.preparedBy ?? "",
    contact: profile?.contact ?? "",
    date: now.slice(0, 10),
    version: "1.0",
    validity: "30 días",
    currency: "USD",
    accent: profile?.brandColor || "#2563eb",
    quoteTotal: null,
    sections: defaultScopeSections(),
  };
}

export function newScopeSection(type: ScopeSection["type"]): ScopeSection {
  switch (type) {
    case "text":
      return { id: uid(), type: "text", title: "Nueva sección", enabled: true, body: "" };
    case "list":
      return { id: uid(), type: "list", title: "Nueva sección", enabled: true, intro: "", items: [""] };
    case "phases":
      return { id: uid(), type: "phases", title: "Nueva sección", enabled: true, intro: "", phases: [] };
    case "pricing":
      return {
        id: uid(),
        type: "pricing",
        title: "Nueva sección",
        enabled: true,
        intro: "",
        showAmounts: true,
        items: [],
        notes: "",
      };
  }
}
