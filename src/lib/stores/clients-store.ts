import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Client } from "@/app/presentation/types/clients/types";
import { useQuotationsStore } from "@/lib/stores/quotations-store";
import { useScopesStore } from "@/lib/stores/scopes-store";

export const CLIENTS_STORE_KEY = "projectly:clients";
export const MAX_CLIENTS = 5;

type AddClientResult =
  | { ok: true; client: Client }
  | { ok: false; error: string };

interface ClientsState {
  clients: Client[];
  addClient: (input: Omit<Client, "id" | "createdAt">) => AddClientResult;
  updateClient: (id: string, input: Omit<Client, "id" | "createdAt">) => void;
  removeClient: (id: string) => void;
}

export const useClientsStore = create<ClientsState>()(
  persist(
    (set, get) => ({
      clients: [],
      addClient: (input) => {
        if (get().clients.length >= MAX_CLIENTS) {
          return {
            ok: false,
            error: `Ya tienes ${MAX_CLIENTS} clientes. Elimina uno para poder crear otro.`,
          };
        }
        const client: Client = {
          ...input,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ clients: [...state.clients, client] }));
        return { ok: true, client };
      },
      updateClient: (id, input) =>
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id ? { ...client, ...input } : client
          ),
        })),
      removeClient: (id) => {
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id),
        }));
        useQuotationsStore.getState().removeByClientId(id);
        useScopesStore.getState().removeByClientId(id);
      },
    }),
    { name: CLIENTS_STORE_KEY }
  )
);
