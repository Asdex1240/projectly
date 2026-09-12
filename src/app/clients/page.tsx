"use client";

import { ClientList } from "@/app/presentation/pages/clients/ClientList";
import { ClientModal } from "@/app/presentation/pages/clients/ClientModal";
import { useClientsPage } from "@/app/presentation/hooks/clients/useClientsPage";

export default function ClientsPage() {
  const {
    clients,
    modalOpen,
    editingClient,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
  } = useClientsPage();

  return (
    <>
      <ClientList
        clients={clients}
        onCreate={openCreateModal}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />
      <ClientModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        client={editingClient}
      />
    </>
  );
}
