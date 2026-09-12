"use client";

import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { useClientsStore } from "@/lib/stores/clients-store";
import { useQuotationsStore } from "@/lib/stores/quotations-store";
import { useScopesStore } from "@/lib/stores/scopes-store";
import { useProfileStore } from "@/lib/stores/profile-store";
import { uid } from "@/app/presentation/utils/clients/ids";
import { generateQuotationNumber } from "@/app/presentation/utils/clients/quotation-totals";
import { createEmptyScopeDocument } from "@/app/presentation/utils/clients/scope-templates";
import { useStoreHydrated } from "@/app/presentation/hooks/clients/useStoreHydrated";
import type { QuotationDocument } from "@/app/presentation/types/clients/types";

export function useClientDetailPage(clientId: string) {
  const router = useRouter();
  const hydrated = useStoreHydrated(useClientsStore.persist);

  const client = useClientsStore((state) =>
    state.clients.find((c) => c.id === clientId)
  );
  const quotations = useQuotationsStore(
    useShallow((state) => state.quotations.filter((quotation) => quotation.clientId === clientId))
  );
  const scopes = useScopesStore(
    useShallow((state) => state.scopes.filter((scope) => scope.clientId === clientId))
  );
  const addQuotation = useQuotationsStore((state) => state.addQuotation);
  const removeQuotation = useQuotationsStore((state) => state.removeQuotation);
  const addScope = useScopesStore((state) => state.addScope);
  const removeScope = useScopesStore((state) => state.removeScope);
  const profile = useProfileStore((state) => state.profile);

  const createQuotation = () => {
    const now = new Date().toISOString();
    const doc: QuotationDocument = {
      id: uid(),
      clientId,
      number: generateQuotationNumber(),
      date: now.slice(0, 10),
      validUntil: now.slice(0, 10),
      currency: "MXN",
      issuer: {
        name: profile.name,
        logo: profile.logo,
        brandColor: profile.brandColor || "#111827",
      },
      preparedBy: profile.preparedBy,
      items: [],
      notes: "",
      terms:
        "Pago: 50% al confirmar, 50% contra entrega.\nFacturación se emite contra pago recibido.",
      taxRate: 16,
      createdAt: now,
      updatedAt: now,
    };
    addQuotation(doc);
    router.push(`/clients/${clientId}/quotations/${doc.id}`);
  };

  const createScope = () => {
    const doc = createEmptyScopeDocument(clientId, profile);
    addScope(doc);
    router.push(`/clients/${clientId}/scopes/${doc.id}`);
  };

  return {
    hydrated,
    client,
    quotations,
    scopes,
    createQuotation,
    removeQuotation,
    createScope,
    removeScope,
  };
}
