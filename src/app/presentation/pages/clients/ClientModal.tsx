"use client";

import { useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Client } from "@/app/presentation/types/clients/types";

export interface ClientFormValues {
  name: string;
  company: string;
  email: string;
  phone: string;
}

interface ClientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ClientFormValues) => void;
  client?: Client | null;
}

export function ClientModal({ open, onClose, onSubmit, client }: ClientModalProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{client ? "Editar cliente" : "Nuevo cliente"}</DialogTitle>
        </DialogHeader>
        {open && (
          <ClientForm
            key={client?.id ?? "new"}
            client={client}
            onSubmit={onSubmit}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface ClientFormProps {
  client?: Client | null;
  onSubmit: (values: ClientFormValues) => void;
  onClose: () => void;
}

function ClientForm({ client, onSubmit, onClose }: ClientFormProps) {
  const [form, setForm] = useState<ClientFormValues>(
    client
      ? {
          name: client.name,
          company: client.company ?? "",
          email: client.email ?? "",
          phone: client.phone ?? "",
        }
      : { name: "", company: "", email: "", phone: "" }
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Nombre</Label>
          <Input
            className="h-9 bg-background"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nombre del cliente"
            autoFocus
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Empresa</Label>
          <Input
            className="h-9 bg-background"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="Empresa (opcional)"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Correo</Label>
            <Input
              className="h-9 bg-background"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Teléfono</Label>
            <Input
              className="h-9 bg-background"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Teléfono (opcional)"
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">{client ? "Guardar cambios" : "Crear cliente"}</Button>
      </DialogFooter>
    </form>
  );
}
