import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QuotationDocument } from "@/app/presentation/types/clients/types";

export const QUOTATIONS_STORE_KEY = "projectly:quotations";

interface QuotationsState {
  quotations: QuotationDocument[];
  addQuotation: (doc: QuotationDocument) => void;
  updateQuotation: (
    id: string,
    updater: Partial<QuotationDocument> | ((doc: QuotationDocument) => QuotationDocument)
  ) => void;
  removeQuotation: (id: string) => void;
  removeByClientId: (clientId: string) => void;
}

export const useQuotationsStore = create<QuotationsState>()(
  persist(
    (set) => ({
      quotations: [],
      addQuotation: (doc) =>
        set((state) => ({ quotations: [...state.quotations, doc] })),
      updateQuotation: (id, updater) =>
        set((state) => ({
          quotations: state.quotations.map((quotation) => {
            if (quotation.id !== id) return quotation;
            const next =
              typeof updater === "function"
                ? updater(quotation)
                : { ...quotation, ...updater };
            return { ...next, updatedAt: new Date().toISOString() };
          }),
        })),
      removeQuotation: (id) =>
        set((state) => ({
          quotations: state.quotations.filter((quotation) => quotation.id !== id),
        })),
      removeByClientId: (clientId) =>
        set((state) => ({
          quotations: state.quotations.filter(
            (quotation) => quotation.clientId !== clientId
          ),
        })),
    }),
    { name: QUOTATIONS_STORE_KEY }
  )
);
