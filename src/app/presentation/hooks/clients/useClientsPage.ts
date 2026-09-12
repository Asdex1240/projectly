"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useClientsStore } from "@/lib/stores/clients-store";
import type { Client } from "@/app/presentation/types/clients/types";
import type { ClientFormValues } from "@/app/presentation/pages/clients/ClientModal";

export function useClientsPage() {
  const clients = useClientsStore((state) => state.clients);
  const addClient = useClientsStore((state) => state.addClient);
  const updateClient = useClientsStore((state) => state.updateClient);
  const removeClient = useClientsStore((state) => state.removeClient);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const openCreateModal = () => {
    setEditingClient(null);
    setModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = (values: ClientFormValues) => {
    const input = {
      name: values.name.trim(),
      company: values.company.trim() || undefined,
      email: values.email.trim() || undefined,
      phone: values.phone.trim() || undefined,
    };

    if (editingClient) {
      updateClient(editingClient.id, input);
    } else {
      const result = addClient(input);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
    }
    setModalOpen(false);
  };

  const handleDelete = (client: Client) => {
    removeClient(client.id);
    toast.success(`Cliente "${client.name}" eliminado`);
  };

  return {
    clients,
    modalOpen,
    editingClient,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
  };
}
