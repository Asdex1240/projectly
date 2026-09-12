"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { ScopeEditor } from "@/app/presentation/pages/clients/scope/ScopeEditor";
import { useScopeEditorPage } from "@/app/presentation/hooks/clients/useScopeEditorPage";

export default function ScopeEditorPage(props: PageProps<"/clients/[clientId]/scopes/[scopeId]">) {
  const { clientId, scopeId } = use(props.params);
  const {
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
  } = useScopeEditorPage(clientId, scopeId);

  if (!hydrated) return null;
  if (!client || !scope) notFound();

  return (
    <ScopeEditor
      client={client}
      scope={scope}
      pdfRef={pdfRef}
      onUpdate={update}
      onAddSection={addSection}
      onChangeSection={changeSection}
      onMoveSection={moveSection}
      onRemoveSection={removeSection}
      onExport={exportPdf}
    />
  );
}
