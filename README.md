# Projectly

Herramienta para freelancers y pequeños estudios para gestionar clientes y generar, en minutos, **cotizaciones** y **documentos de alcance (scope of work)** listos para exportar a PDF.

## ¿Qué hace?

- **Clientes**: alta, edición y borrado de clientes (límite de 5 por ahora). Cada cliente puede tener múltiples cotizaciones y alcances asociados.
- **Cotizaciones**: editor de partidas (ítems con sub-ítems, cantidad, precio unitario), cálculo automático de subtotal/impuestos/total, moneda configurable, numeración automática (`COT-YYYYMM-###`), notas y términos. Incluye vista previa y exportación a PDF.
- **Alcances (scopes)**: editor de secciones dinámicas (texto libre, listas, fases del proyecto, tabla de precios con justificación) para armar documentos de propuesta/alcance de trabajo, también con vista previa y exportación a PDF.
- **Perfil**: datos de la empresa/emisor (nombre, logo, color de marca, responsable, contacto) que se usan como valores por defecto al crear cotizaciones y alcances.
- **Exportación a PDF**: se hace abriendo una ventana aislada (sin los estilos de la app) y disparando el diálogo de impresión del navegador, para obtener un PDF vectorial con texto seleccionable. Se eligió este enfoque porque librerías tipo `html2canvas` no soportan funciones de color modernas (`oklch`, `lab`) usadas por Tailwind v4.

## Stack técnico

- **Next.js 16** (App Router) + **React 19** + **TypeScript**.
- **Tailwind CSS v4** + componentes UI basados en shadcn/Base UI (`src/components/ui`).
- **Zustand** con middleware `persist` para el estado (clientes, cotizaciones, alcances y perfil), persistido en `localStorage` del navegador — no hay backend ni base de datos.
- **Sonner** para notificaciones (toasts).

## Estructura del proyecto

```
src/app/
  clients/                        Rutas: listado, detalle, cotización y alcance de un cliente
  profile/                        Ruta de perfil de la empresa
  presentation/
    hooks/clients|profile/        Hooks de página (lógica de cada vista)
    pages/clients|profile|shared/ Componentes de UI de cada vista
    types/                        Tipos de dominio (Client, QuotationDocument, ScopeDocument, ...)
    utils/                        Cálculo de totales, export a PDF, plantillas de scope, helpers
    constants/                    Constantes de la sección de clientes
src/lib/stores/                   Stores de Zustand (clients, quotations, scopes, profile)
src/components/ui/                Componentes UI reutilizables (botones, diálogos, tabs, etc.)
```

## Empezar a desarrollar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) — redirige automáticamente a `/clients`.

Otros scripts:

```bash
npm run build   # build de producción
npm run start   # levanta el build de producción
npm run lint    # eslint
```
