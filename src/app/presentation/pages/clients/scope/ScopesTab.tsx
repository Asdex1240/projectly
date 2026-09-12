"use client";

import Link from "next/link";
import { FileStack, Plus, Trash2 } from "lucide-react";
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
import type { ScopeDocument } from "@/app/presentation/types/clients/types";

interface ScopesTabProps {
  clientId: string;
  scopes: ScopeDocument[];
  onCreate: () => void;
  onDelete: (id: string) => void;
}

export function ScopesTab({ clientId, scopes, onCreate, onDelete }: ScopesTabProps) {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex justify-end">
        <Button onClick={onCreate}>
          <Plus />
          Nuevo alcance
        </Button>
      </div>

      {scopes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
            <FileStack className="size-8" />
            <p className="text-sm">Este cliente aún no tiene alcances.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scopes.map((scope) => (
            <Card key={scope.id}>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/clients/${clientId}/scopes/${scope.id}`}
                    className="font-medium hover:underline"
                  >
                    {scope.docTitle}
                  </Link>
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
                        <AlertDialogTitle>Eliminar alcance</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => onDelete(scope.id)}
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <p className="text-sm text-muted-foreground">Versión {scope.version || "1.0"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
