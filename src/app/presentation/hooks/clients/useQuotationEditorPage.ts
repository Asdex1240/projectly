"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { useClientsStore } from "@/lib/stores/clients-store";
import { useQuotationsStore } from "@/lib/stores/quotations-store";
import { useStoreHydrated } from "@/app/presentation/hooks/clients/useStoreHydrated";
import { exportDocumentToPdf } from "@/app/presentation/utils/clients/export-pdf";
import type { QuotationDocument, QuotationItem } from "@/app/presentation/types/clients/types";

export function useQuotationEditorPage(clientId: string, quotationId: string) {
  const hydrated = useStoreHydrated(useQuotationsStore.persist);
  const client = useClientsStore((state) => state.clients.find((c) => c.id === clientId));
  const quotation = useQuotationsStore((state) =>
    state.quotations.find((q) => q.id === quotationId)
  );
  const updateQuotation = useQuotationsStore((state) => state.updateQuotation);

  const pdfRef = useRef<HTMLDivElement>(null);

  const updateFields = (patch: Partial<QuotationDocument>) => {
    updateQuotation(quotationId, patch);
  };

  const updateItems = (items: QuotationItem[]) => {
    updateQuotation(quotationId, { items });
  };

  const exportPdf = () => {
    if (!pdfRef.current || !quotation) return;
    const ok = exportDocumentToPdf(pdfRef.current, `Cotización ${quotation.number}`);
    if (ok) {
      toast.info('Se abrió el documento. Elige "Guardar como PDF" en el diálogo.');
    } else {
      toast.error(
        "El navegador bloqueó la ventana emergente. Permítela para este sitio e intenta de nuevo."
      );
    }
  };

  return { hydrated, client, quotation, updateFields, updateItems, pdfRef, exportPdf };
}
