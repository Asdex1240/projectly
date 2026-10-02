export interface JsonGuideField {
  name: string;
  type: string;
  description: string;
}

export interface JsonGuideSection {
  title: string;
  description?: string;
  fields: JsonGuideField[];
}

// ---------- Tablas (compartidas por todas las secciones de alcance) ----------

const TABLE_FIELDS: JsonGuideField[] = [
  { name: "title", type: "string", description: "Título opcional de la tabla." },
  { name: "columns", type: "string[]", description: "Encabezados de las columnas." },
  {
    name: "rows",
    type: "string[][]",
    description:
      "Filas; cada fila es un arreglo de celdas en el mismo orden que columns. Si faltan celdas se rellenan vacías y las sobrantes se descartan.",
  },
];

const SECTION_COMMON_FIELDS: JsonGuideField[] = [
  {
    name: "type",
    type: '"text" | "list" | "phases" | "pricing"',
    description: "Obligatorio. Define cómo se muestra la sección.",
  },
  { name: "title", type: "string", description: 'Título de la sección. Por defecto "Nueva sección".' },
  {
    name: "enabled",
    type: "boolean",
    description: "Si es false, la sección se guarda pero no aparece en el documento. Por defecto true.",
  },
  {
    name: "tables",
    type: "Tabla[]",
    description: "Tablas opcionales que se muestran al final de la sección (ver «Tablas»).",
  },
];

// ---------- Alcance ----------

export const SCOPE_JSON_GUIDE: JsonGuideSection[] = [
  {
    title: "Documento",
    description: "Todos los campos son opcionales; lo que falte se toma del perfil o de los valores por defecto.",
    fields: [
      { name: "docTitle", type: "string", description: 'Título del documento. Por defecto "Documento de Alcance del Proyecto".' },
      { name: "company", type: "string", description: "Empresa que emite. Por defecto, la del perfil." },
      { name: "preparedBy", type: "string", description: "Quién elabora. Por defecto, el del perfil." },
      { name: "contact", type: "string", description: "Datos de contacto. Por defecto, los del perfil." },
      { name: "date", type: "string (AAAA-MM-DD)", description: "Fecha del documento. Por defecto, hoy." },
      { name: "version", type: "string", description: 'Versión. Por defecto "1.0".' },
      { name: "validity", type: "string", description: 'Vigencia. Por defecto "30 días".' },
      { name: "currency", type: "string", description: 'Código de moneda (USD, MXN, EUR…). Por defecto "USD".' },
      { name: "accent", type: "string (#hex)", description: "Color de acento. Por defecto, el color de marca del perfil." },
      { name: "quoteTotal", type: "number | null", description: "Total de la cotización asociada. Por defecto null." },
      {
        name: "sections",
        type: "Sección[]",
        description: "Secciones en el orden en que aparecen. Si se omite, se usan las secciones por defecto.",
      },
    ],
  },
  {
    title: "Sección «text»",
    description: "Un bloque de texto libre (resumen, contexto, etc.).",
    fields: [
      ...SECTION_COMMON_FIELDS,
      { name: "body", type: "string", description: "Contenido del texto. Usa \\n para saltos de línea." },
    ],
  },
  {
    title: "Sección «list»",
    description: "Lista con viñetas (objetivos, entregables, supuestos…).",
    fields: [
      ...SECTION_COMMON_FIELDS,
      { name: "intro", type: "string", description: "Párrafo opcional antes de la lista." },
      { name: "items", type: "string[]", description: "Elementos de la lista." },
    ],
  },
  {
    title: "Sección «phases»",
    description: "Plan de trabajo dividido en fases.",
    fields: [
      ...SECTION_COMMON_FIELDS,
      { name: "intro", type: "string", description: "Párrafo opcional antes de las fases." },
      {
        name: "phases",
        type: "Fase[] | string[]",
        description: "Cada fase: { name, description, duration }. También puedes pasar solo el nombre como string.",
      },
      { name: "phases[].name", type: "string", description: "Nombre de la fase." },
      { name: "phases[].description", type: "string", description: "Qué se hace en la fase." },
      { name: "phases[].duration", type: "string", description: 'Duración, p. ej. "2 semanas".' },
    ],
  },
  {
    title: "Sección «pricing»",
    description: "Desglose de la inversión con justificación por concepto.",
    fields: [
      ...SECTION_COMMON_FIELDS,
      { name: "intro", type: "string", description: "Párrafo opcional antes del desglose." },
      {
        name: "showAmounts",
        type: "boolean",
        description: "Si es false, oculta los montos y solo muestra conceptos. Por defecto true.",
      },
      {
        name: "items",
        type: "Concepto[] | string[]",
        description: "Cada concepto: { concept, detail, justification, amount }. También puedes pasar solo el concepto como string.",
      },
      { name: "items[].concept", type: "string", description: "Nombre del concepto." },
      { name: "items[].detail", type: "string", description: "Qué incluye." },
      { name: "items[].justification", type: "string", description: "Por qué tiene ese valor." },
      { name: "items[].amount", type: "number", description: "Monto. Por defecto 0." },
      { name: "notes", type: "string", description: "Notas al pie del desglose." },
    ],
  },
  {
    title: "Tablas",
    description: "Disponibles en cualquier tipo de sección mediante el campo tables.",
    fields: TABLE_FIELDS,
  },
];

export const SCOPE_JSON_EXAMPLE = JSON.stringify(
  {
    docTitle: "Documento de Alcance del Proyecto",
    company: "Mi Empresa S.A. de C.V.",
    preparedBy: "Juan Pérez",
    contact: "juan@miempresa.com · 55 1234 5678",
    date: "2026-10-02",
    version: "1.0",
    validity: "30 días",
    currency: "USD",
    accent: "#2563eb",
    quoteTotal: 5000,
    sections: [
      {
        type: "text",
        title: "Resumen ejecutivo",
        body: "Desarrollo de una plataforma web para gestionar pedidos.\nEl objetivo es reducir el tiempo de captura en un 50%.",
      },
      {
        type: "list",
        title: "Objetivos del proyecto",
        items: ["Digitalizar la captura de pedidos", "Centralizar la información de clientes"],
      },
      {
        type: "list",
        title: "Alcance incluido",
        intro: "Lo que sí forma parte de esta contratación:",
        items: ["Panel de administración", "Módulo de pedidos", "Reportes básicos"],
        tables: [
          {
            title: "Módulos",
            columns: ["Módulo", "Descripción", "Prioridad"],
            rows: [
              ["Pedidos", "Alta, edición y seguimiento", "Alta"],
              ["Reportes", "Ventas por periodo", "Media"],
            ],
          },
        ],
      },
      {
        type: "list",
        title: "Fuera de alcance",
        intro: "Lo que no está contemplado y requeriría una cotización aparte:",
        items: ["App móvil nativa", "Integración con ERP"],
      },
      {
        type: "phases",
        title: "Plan de trabajo y fases",
        intro: "El proyecto se divide en tres fases:",
        phases: [
          { name: "Fase 1 — Descubrimiento y diseño", description: "Entrevistas y wireframes", duration: "2 semanas" },
          { name: "Fase 2 — Desarrollo", description: "Implementación de módulos", duration: "6 semanas" },
          "Fase 3 — Pruebas y entrega",
        ],
      },
      {
        type: "pricing",
        title: "Desglose y justificación de la inversión",
        intro: "Detalle de cada concepto y la razón de su valor.",
        showAmounts: true,
        items: [
          {
            concept: "Diseño UX/UI",
            detail: "Wireframes y prototipo navegable",
            justification: "20 horas de diseño",
            amount: 1000,
          },
          {
            concept: "Desarrollo",
            detail: "Frontend y backend",
            justification: "80 horas de desarrollo",
            amount: 4000,
          },
        ],
        notes: "Los valores no incluyen impuestos.",
        tables: [
          {
            title: "Horas estimadas",
            columns: ["Rol", "Horas", "Tarifa"],
            rows: [
              ["Diseñador", "20", "$50"],
              ["Desarrollador", "80", "$50"],
            ],
          },
        ],
      },
      {
        type: "list",
        title: "Notas internas",
        enabled: false,
        items: ["Esta sección está oculta en el documento"],
      },
    ],
  },
  null,
  2
);

// ---------- Cotización ----------

export const QUOTATION_JSON_GUIDE: JsonGuideSection[] = [
  {
    title: "Documento",
    description: "Todos los campos son opcionales; lo que falte se toma del perfil o de los valores por defecto.",
    fields: [
      { name: "number", type: "string", description: "Folio. Por defecto se genera uno (COT-AAAAMM-###)." },
      { name: "date", type: "string (AAAA-MM-DD)", description: "Fecha de emisión. Por defecto, hoy." },
      { name: "validUntil", type: "string (AAAA-MM-DD)", description: "Vigente hasta. Por defecto, hoy." },
      { name: "currency", type: "string", description: 'Código de moneda (MXN, USD, EUR…). Por defecto "MXN".' },
      { name: "taxRate", type: "number", description: "Porcentaje de impuesto (16 = 16%). Por defecto 16." },
      { name: "preparedBy", type: "string", description: "Quién elabora. Por defecto, el del perfil." },
      { name: "issuer", type: "Emisor", description: "Datos del emisor (ver «Emisor»)." },
      { name: "items", type: "Concepto[]", description: "Conceptos cotizados (ver «Conceptos»)." },
      { name: "notes", type: "string", description: "Notas adicionales." },
      { name: "terms", type: "string", description: "Términos y condiciones. Usa \\n para saltos de línea." },
    ],
  },
  {
    title: "Emisor",
    description: "El logo siempre se toma del perfil.",
    fields: [
      { name: "issuer.name", type: "string", description: "Nombre del emisor. Por defecto, el del perfil." },
      { name: "issuer.brandColor", type: "string (#hex)", description: "Color de marca. Por defecto, el del perfil." },
    ],
  },
  {
    title: "Conceptos",
    description: "Subtotal, impuesto y total se calculan automáticamente.",
    fields: [
      { name: "items[].description", type: "string", description: "Descripción del concepto." },
      { name: "items[].quantity", type: "number", description: "Cantidad. Por defecto 1." },
      { name: "items[].unitPrice", type: "number", description: "Precio unitario. Por defecto 0." },
      {
        name: "items[].subItems",
        type: "string[] | { description }[]",
        description: "Detalle opcional bajo el concepto.",
      },
    ],
  },
];

export const QUOTATION_JSON_EXAMPLE = JSON.stringify(
  {
    number: "COT-202610-001",
    date: "2026-10-02",
    validUntil: "2026-11-01",
    currency: "MXN",
    taxRate: 16,
    preparedBy: "Juan Pérez",
    issuer: {
      name: "Mi Empresa S.A. de C.V.",
      brandColor: "#111827",
    },
    items: [
      {
        description: "Desarrollo de sitio web",
        quantity: 1,
        unitPrice: 25000,
        subItems: ["Diseño responsivo", "Hasta 5 páginas", "Formulario de contacto"],
      },
      {
        description: "Hosting anual",
        quantity: 1,
        unitPrice: 3000,
        subItems: [{ description: "Incluye certificado SSL" }],
      },
      { description: "Horas de soporte", quantity: 10, unitPrice: 500 },
    ],
    notes: "Precios sujetos a cambio sin previo aviso.",
    terms: "Pago: 50% al confirmar, 50% contra entrega.\nFacturación se emite contra pago recibido.",
  },
  null,
  2
);
