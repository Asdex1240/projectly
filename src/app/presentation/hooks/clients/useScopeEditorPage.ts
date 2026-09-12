"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { useClientsStore } from "@/lib/stores/clients-store";
import { useScopesStore } from "@/lib/stores/scopes-store";
import { useStoreHydrated } from "@/app/presentation/hooks/clients/useStoreHydrated";
import { exportDocumentToPdf } from "@/app/presentation/utils/clients/export-pdf";
import { newScopeSection } from "@/app/presentation/utils/clients/scope-templates";
import type { ScopeDocument, ScopeSection } from "@/app/presentation/types/clients/types";

export function useScopeEditorPage(clientId: string, scopeId: string) {
  const hydrated = useStoreHydrated(useScopesStore.persist);
  const client = useClientsStore((state) => state.clients.find((c) => c.id === clientId));
  const scope = useScopesStore((state) => state.scopes.find((s) => s.id === scopeId));
  const updateScope = useScopesStore((state) => state.updateScope);

  const pdfRef = useRef<HTMLDivElement>(null);

  const update = (patch: Partial<ScopeDocument>) => updateScope(scopeId, patch);

  const addSection = (type: ScopeSection["type"]) =>
    updateScope(scopeId, (doc) => ({
      ...doc,
      sections: [...doc.sections, newScopeSection(type)],
    }));

  const changeSection = (index: number, next: ScopeSection) =>
    updateScope(scopeId, (doc) => {
      const sections = [...doc.sections];
      sections[index] = next;
      return { ...doc, sections };
    });

  const moveSection = (index: number, dir: -1 | 1) =>
    updateScope(scopeId, (doc) => {
      const j = index + dir;
      if (j < 0 || j >= doc.sections.length) return doc;
      const sections = [...doc.sections];
      [sections[index], sections[j]] = [sections[j], sections[index]];
      return { ...doc, sections };
    });

  const removeSection = (index: number) =>
    updateScope(scopeId, (doc) => ({
      ...doc,
      sections: doc.sections.filter((_, i) => i !== index),
    }));

  const exportPdf = () => {
    if (!pdfRef.current || !scope) return;
    const ok = exportDocumentToPdf(pdfRef.current, `${scope.docTitle || "Documento"} - Alcance`);
    if (ok) {
      toast.info('Se abrió el documento. Elige "Guardar como PDF" en el diálogo.');
    } else {
      toast.error(
        "El navegador bloqueó la ventana emergente. Permítela para este sitio e intenta de nuevo."
      );
    }
  };

  return {
    hydrated,
    client,
    scope,
    pdfRef,
    update,
    addSection,
    changeSection,
    moveSection,
    removeSection,
    exportPdf,
  };
}
