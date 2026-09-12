"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { ClientDetailView } from "@/app/presentation/pages/clients/ClientDetailView";
import { useClientDetailPage } from "@/app/presentation/hooks/clients/useClientDetailPage";

export default function ClientDetailPage(props: PageProps<"/clients/[clientId]">) {
  const { clientId } = use(props.params);
  const {
    hydrated,
    client,
    quotations,
    scopes,
    createQuotation,
    removeQuotation,
    createScope,
    removeScope,
  } = useClientDetailPage(clientId);

  if (!hydrated) return null;
  if (!client) notFound();

  return (
    <ClientDetailView
      client={client}
      quotations={quotations}
      scopes={scopes}
      onCreateQuotation={createQuotation}
      onDeleteQuotation={removeQuotation}
      onCreateScope={createScope}
      onDeleteScope={removeScope}
    />
  );
}
