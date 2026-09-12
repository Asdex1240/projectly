function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Exporta un documento (Cotización o Alcance) a PDF abriendo una ventana aislada
 * (sin los estilos de la app) y lanzando el diálogo de impresión del navegador.
 * Genera un PDF vectorial, con texto seleccionable y saltos de página correctos.
 *
 * Se hace así a propósito: las librerías tipo html2canvas no soportan las
 * funciones de color modernas (`oklch`, `lab`) que usa Tailwind v4.
 *
 * @returns `false` si el navegador bloqueó la ventana emergente.
 */
export function exportDocumentToPdf(node: HTMLElement, title: string): boolean {
  const win = window.open("", "_blank", "width=900,height=1200");
  if (!win) return false;

  const doc = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
  @page { size: A4; margin: 0; }
  html, body { margin: 0; padding: 0; background: #ffffff; }
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .pdf-page { width: 100%; border-collapse: collapse; }
  .pdf-page > thead td,
  .pdf-page > tfoot td { border: 0; padding: 0; }
  .pdf-spacer { height: 16mm; }
  .pdf-body { padding: 0 14mm; vertical-align: top; }
  .doc-preview {
    width: auto !important;
    min-height: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
  }
  .doc-preview .doc-section,
  .doc-preview .phase,
  .doc-preview .price-item,
  .doc-preview .item-row,
  .doc-preview .doc-total,
  .doc-preview .price-total { break-inside: avoid; }
  .doc-preview h2.doc-h2 { break-after: avoid; }
</style>
</head>
<body>
<table class="pdf-page">
  <thead><tr><td><div class="pdf-spacer"></div></td></tr></thead>
  <tfoot><tr><td><div class="pdf-spacer"></div></td></tr></tfoot>
  <tbody><tr><td class="pdf-body">
${node.outerHTML}
  </td></tr></tbody>
</table>
<script>
  window.addEventListener('load', function () {
    setTimeout(function () { window.focus(); window.print(); }, 350);
  });
  window.addEventListener('afterprint', function () { window.close(); });
</script>
</body>
</html>`;

  win.document.open();
  win.document.write(doc);
  win.document.close();
  return true;
}
