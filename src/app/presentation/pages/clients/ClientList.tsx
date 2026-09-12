"use client";

import Link from "next/link";
import { Building2, Mail, Pencil, Phone, Plus, Trash2, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Client } from "@/app/presentation/types/clients/types";
import { MAX_CLIENTS } from "@/lib/stores/clients-store";

interface ClientListProps {
  clients: Client[];
  onCreate: () => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export function ClientList({ clients, onCreate, onEdit, onDelete }: ClientListProps) {
  const atLimit = clients.length >= MAX_CLIENTS;

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            {clients.length} de {MAX_CLIENTS} clientes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" nativeButton={false} render={<Link href="/profile" />}>
            <User />
            Perfil
          </Button>
          <Button onClick={onCreate} disabled={atLimit}>
            <Plus />
            Nuevo cliente
          </Button>
        </div>
      </div>

      {atLimit && (
        <p className="text-sm text-muted-foreground">
          Ya tienes {MAX_CLIENTS} clientes. Elimina uno para poder crear otro.
        </p>
      )}

      {clients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
            <Users className="size-8" />
            <p className="text-sm">Aún no tienes clientes.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.id}>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/clients/${client.id}`}
                    className="font-medium hover:underline"
                  >
                    {client.name}
                  </Link>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(client)}
                    >
                      <Pencil />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-destructive"
                          />
                        }
                      >
                        <Trash2 />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar cliente</AlertDialogTitle>
                          <AlertDialogDescription>
                            Se eliminará &quot;{client.name}&quot; junto con todas sus
                            cotizaciones y alcances. Esta acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => onDelete(client)}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  {client.company && (
                    <span className="flex items-center gap-1.5">
                      <Building2 className="size-3.5" />
                      {client.company}
                    </span>
                  )}
                  {client.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="size-3.5" />
                      {client.email}
                    </span>
                  )}
                  {client.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="size-3.5" />
                      {client.phone}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
