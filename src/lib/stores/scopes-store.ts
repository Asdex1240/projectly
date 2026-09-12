import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ScopeDocument } from "@/app/presentation/types/clients/types";

export const SCOPES_STORE_KEY = "projectly:scopes";

interface ScopesState {
  scopes: ScopeDocument[];
  addScope: (doc: ScopeDocument) => void;
  updateScope: (
    id: string,
    updater: Partial<ScopeDocument> | ((doc: ScopeDocument) => ScopeDocument)
  ) => void;
  removeScope: (id: string) => void;
  removeByClientId: (clientId: string) => void;
}

export const useScopesStore = create<ScopesState>()(
  persist(
    (set) => ({
      scopes: [],
      addScope: (doc) => set((state) => ({ scopes: [...state.scopes, doc] })),
      updateScope: (id, updater) =>
        set((state) => ({
          scopes: state.scopes.map((scope) => {
            if (scope.id !== id) return scope;
            const next =
              typeof updater === "function" ? updater(scope) : { ...scope, ...updater };
            return { ...next, updatedAt: new Date().toISOString() };
          }),
        })),
      removeScope: (id) =>
        set((state) => ({ scopes: state.scopes.filter((scope) => scope.id !== id) })),
      removeByClientId: (clientId) =>
        set((state) => ({
          scopes: state.scopes.filter((scope) => scope.clientId !== clientId),
        })),
    }),
    { name: SCOPES_STORE_KEY }
  )
);
