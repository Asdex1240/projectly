"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { QuotationEditor } from "@/app/presentation/pages/clients/quotation/QuotationEditor";
import { useQuotationEditorPage } from "@/app/presentation/hooks/clients/useQuotationEditorPage";

export default function QuotationEditorPage(
  props: PageProps<"/clients/[clientId]/quotations/[quotationId]">
) {
  const { clientId, quotationId } = use(props.params);
  const { hydrated, client, quotation, updateFields, updateItems, pdfRef, exportPdf } =
    useQuotationEditorPage(clientId, quotationId);

  if (!hydrated) return null;
  if (!client || !quotation) notFound();

  return (
    <QuotationEditor
      client={client}
      quotation={quotation}
      pdfRef={pdfRef}
      onUpdateFields={updateFields}
      onUpdateItems={updateItems}
      onExport={exportPdf}
    />
  );
}
