"use client";

import type { RefObject } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileText,
  List,
  ListChecks,
  Plus,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Client, ScopeDocument, ScopeSection } from "@/app/presentation/types/clients/types";
import { CURRENCY_LABELS } from "@/app/presentation/constants/clients/constants";
import { ScopeEditorField } from "@/app/presentation/pages/clients/scope/ScopeEditorField";
import { ScopeSectionCard } from "@/app/presentation/pages/clients/scope/ScopeSectionCard";
import { ScopePreview } from "@/app/presentation/pages/clients/scope/ScopePreview";

interface ScopeEditorProps {
  client: Client;
  scope: ScopeDocument;
  pdfRef: RefObject<HTMLDivElement | null>;
  onUpdate: (patch: Partial<ScopeDocument>) => void;
  onAddSection: (type: ScopeSection["type"]) => void;
  onChangeSection: (index: number, next: ScopeSection) => void;
  onMoveSection: (index: number, dir: -1 | 1) => void;
  onRemoveSection: (index: number) => void;
  onExport: () => void;
}

export function ScopeEditor({
  client,
  scope,
  pdfRef,
  onUpdate,
  onAddSection,
  onChangeSection,
  onMoveSection,
  onRemoveSection,
  onExport,
}: ScopeEditorProps) {
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
        <span className="font-medium">{scope.docTitle}</span>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" onClick={onExport}>
            <Download />
            Exportar PDF
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Cliente
            </p>
            <div className="rounded-md border border-border bg-muted/30 p-3 text-sm">
              <p className="font-medium">{client.name}</p>
              {client.company && <p className="text-muted-foreground">{client.company}</p>}
              {client.email && <p className="text-muted-foreground">{client.email}</p>}
              {client.phone && <p className="text-muted-foreground">{client.phone}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Datos del documento
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <ScopeEditorField label="Título del documento">
                <Input
                  className="h-9 bg-background"
                  value={scope.docTitle}
                  onChange={(e) => onUpdate({ docTitle: e.target.value })}
                />
              </ScopeEditorField>
              <ScopeEditorField label="Tu empresa / marca">
                <Input
                  className="h-9 bg-background"
                  value={scope.company}
                  onChange={(e) => onUpdate({ company: e.target.value })}
                />
              </ScopeEditorField>
              <ScopeEditorField label="Preparado por">
                <Input
                  className="h-9 bg-background"
                  value={scope.preparedBy}
                  onChange={(e) => onUpdate({ preparedBy: e.target.value })}
                />
              </ScopeEditorField>
              <ScopeEditorField label="Contacto (email / teléfono)">
                <Input
                  className="h-9 bg-background"
                  value={scope.contact}
                  onChange={(e) => onUpdate({ contact: e.target.value })}
                />
              </ScopeEditorField>
              <ScopeEditorField label="Fecha">
                <Input
                  className="h-9 bg-background"
                  type="date"
                  value={scope.date}
                  onChange={(e) => onUpdate({ date: e.target.value })}
                />
              </ScopeEditorField>
              <ScopeEditorField label="Versión">
                <Input
                  className="h-9 bg-background"
                  value={scope.version}
                  onChange={(e) => onUpdate({ version: e.target.value })}
                />
              </ScopeEditorField>
              <ScopeEditorField label="Validez de la propuesta">
                <Input
                  className="h-9 bg-background"
                  value={scope.validity}
                  onChange={(e) => onUpdate({ validity: e.target.value })}
                />
              </ScopeEditorField>
              <ScopeEditorField label="Moneda">
                <Select
                  items={CURRENCY_LABELS}
                  value={scope.currency}
                  onValueChange={(value) => onUpdate({ currency: value as string })}
                >
                  <SelectTrigger className="h-9 bg-background w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CURRENCY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </ScopeEditorField>
              <ScopeEditorField label="Color de acento">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={scope.accent}
                    onChange={(e) => onUpdate({ accent: e.target.value })}
                    className="h-9 w-12 cursor-pointer rounded-md border border-input bg-transparent"
                  />
                  <Input
                    className="h-9 bg-background flex-1 font-mono text-xs"
                    value={scope.accent}
                    onChange={(e) => onUpdate({ accent: e.target.value })}
                  />
                </div>
              </ScopeEditorField>
            </div>
            <ScopeEditorField
              label="Inversión total (opcional)"
              hint="Si lo llenas, aparece como recuadro destacado al inicio del documento."
            >
              <Input
                className="h-9 bg-background"
                type="number"
                inputMode="decimal"
                placeholder="Dejar vacío para no mostrar"
                value={scope.quoteTotal ?? ""}
                onChange={(e) =>
                  onUpdate({
                    quoteTotal: e.target.value === "" ? null : parseFloat(e.target.value) || 0,
                  })
                }
              />
            </ScopeEditorField>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Secciones
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button size="sm" variant="outline">
                      <Plus />
                      Agregar sección
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onAddSection("text")}>
                    <FileText />
                    Texto
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAddSection("list")}>
                    <List />
                    Lista de puntos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAddSection("phases")}>
                    <ListChecks />
                    Fases / Plan de trabajo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAddSection("pricing")}>
                    <Receipt />
                    Desglose de precios
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {scope.sections.map((section, i) => (
              <ScopeSectionCard
                key={section.id}
                section={section}
                index={i}
                count={scope.sections.length}
                onChange={(next) => onChangeSection(i, next)}
                onMove={(dir) => onMoveSection(i, dir)}
                onRemove={() => onRemoveSection(i)}
              />
            ))}
          </div>
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
                      <ScopePreview client={client} scope={scope} />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mx-auto w-fit">
              <div className="preview-scale overflow-hidden rounded-md shadow-lg">
                <ScopePreview client={client} scope={scope} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        style={{ position: "fixed", left: "-10000px", top: 0, width: "794px", pointerEvents: "none" }}
      >
        <ScopePreview ref={pdfRef} client={client} scope={scope} />
      </div>
    </div>
  );
}
