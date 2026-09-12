"use client";

import type { RefObject } from "react";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Client, QuotationDocument, QuotationItem } from "@/app/presentation/types/clients/types";
import { QuotationFormFields } from "@/app/presentation/pages/clients/quotation/QuotationFormFields";
import { QuotationItemsTable } from "@/app/presentation/pages/clients/quotation/QuotationItemsTable";
import { QuotationPreview } from "@/app/presentation/pages/clients/quotation/QuotationPreview";

interface QuotationEditorProps {
  client: Client;
  quotation: QuotationDocument;
  pdfRef: RefObject<HTMLDivElement | null>;
  onUpdateFields: (patch: Partial<QuotationDocument>) => void;
  onUpdateItems: (items: QuotationItem[]) => void;
  onExport: () => void;
}

export function QuotationEditor({
  client,
  quotation,
  pdfRef,
  onUpdateFields,
  onUpdateItems,
  onExport,
}: QuotationEditorProps) {
  return (
    <div className="flex flex-col gap-4 pb-6">
      <header className="sticky top-0 z-20 -mx-4 flex items-center gap-3 border-b bg-background/95 px-4 py-2.5 backdrop-blur">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href={`/clients/${client.id}`} />}
        >
          <ArrowLeft />
          {client.name}
        </Button>
        <span className="font-medium">{quotation.number}</span>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" onClick={onExport}>
            <Download />
            Exportar PDF
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <QuotationFormFields client={client} quotation={quotation} onUpdate={onUpdateFields} />
          <QuotationItemsTable
            items={quotation.items}
            currency={quotation.currency}
            onChange={onUpdateItems}
          />
        </div>

        <div className="hidden bg-muted/40 lg:block">
          <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-auto rounded-lg p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Vista previa</span>
              <Dialog>
                <DialogTrigger render={<Button variant="ghost" size="sm" />}>
                  Ver a tamaño real
                </DialogTrigger>
                <DialogContent className="max-h-[92vh] max-w-[900px] overflow-auto p-0">
                  <DialogHeader className="sr-only">
                    <DialogTitle>Vista previa a tamaño real</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center bg-muted p-6">
                    <div className="shadow-lg">
                      <QuotationPreview client={client} quotation={quotation} />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mx-auto w-fit">
              <div className="preview-scale overflow-hidden rounded-md shadow-lg">
                <QuotationPreview client={client} quotation={quotation} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        style={{ position: "fixed", left: "-10000px", top: 0, width: "794px", pointerEvents: "none" }}
      >
        <QuotationPreview ref={pdfRef} client={client} quotation={quotation} />
      </div>
    </div>
  );
}
