"use client";

import Link from "next/link";
import { FileText, Plus, Trash2 } from "lucide-react";
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
import type { QuotationDocument } from "@/app/presentation/types/clients/types";
import { calculateQuotationTotals, formatCurrency } from "@/app/presentation/utils/clients/quotation-totals";

interface QuotationsTabProps {
  clientId: string;
  quotations: QuotationDocument[];
  onCreate: () => void;
  onDelete: (id: string) => void;
}

export function QuotationsTab({ clientId, quotations, onCreate, onDelete }: QuotationsTabProps) {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex justify-end">
        <Button onClick={onCreate}>
          <Plus />
          Nueva cotización
        </Button>
      </div>

      {quotations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
            <FileText className="size-8" />
            <p className="text-sm">Este cliente aún no tiene cotizaciones.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quotations.map((quotation) => {
            const { total } = calculateQuotationTotals(quotation.items, quotation.taxRate);
            return (
              <Card key={quotation.id}>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/clients/${clientId}/quotations/${quotation.id}`}
                      className="font-medium hover:underline"
                    >
                      {quotation.number}
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
                          <AlertDialogTitle>Eliminar cotización</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => onDelete(quotation.id)}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Fecha: {quotation.date}</p>
                    <p className="font-medium text-foreground">
                      {formatCurrency(total, quotation.currency)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
