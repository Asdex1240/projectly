"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Client, QuotationDocument, QuotationIssuer } from "@/app/presentation/types/clients/types";
import { CURRENCY_LABELS } from "@/app/presentation/constants/clients/constants";
import { BrandFields } from "@/app/presentation/pages/shared/BrandFields";

interface QuotationFormFieldsProps {
  client: Client;
  quotation: QuotationDocument;
  onUpdate: (patch: Partial<QuotationDocument>) => void;
}

export function QuotationFormFields({ client, quotation, onUpdate }: QuotationFormFieldsProps) {
  const updateIssuer = (patch: Partial<QuotationIssuer>) => {
    onUpdate({ issuer: { ...quotation.issuer, ...patch } });
  };

  return (
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
          Tu empresa
        </p>
        <BrandFields
          name={quotation.issuer.name}
          logo={quotation.issuer.logo}
          brandColor={quotation.issuer.brandColor}
          onChange={updateIssuer}
        />
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Preparado por</Label>
          <Input
            className="h-9 bg-background"
            value={quotation.preparedBy}
            onChange={(e) => onUpdate({ preparedBy: e.target.value })}
            placeholder="Tu nombre"
          />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Detalles de la cotización
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Número</Label>
            <Input className="h-9 bg-background" value={quotation.number} readOnly />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Moneda</Label>
            <Select
              items={CURRENCY_LABELS}
              value={quotation.currency}
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
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Fecha de emisión</Label>
            <Input
              className="h-9 bg-background"
              type="date"
              value={quotation.date}
              onChange={(e) => onUpdate({ date: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Válida hasta</Label>
            <Input
              className="h-9 bg-background"
              type="date"
              value={quotation.validUntil}
              onChange={(e) => onUpdate({ validUntil: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Impuesto (%)</Label>
            <Input
              className="h-9 bg-background"
              type="number"
              min="0"
              step="0.01"
              value={quotation.taxRate}
              onChange={(e) => onUpdate({ taxRate: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Notas</Label>
          <Textarea
            className="bg-background"
            value={quotation.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Notas adicionales para el cliente"
            rows={3}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Términos y condiciones</Label>
          <Textarea
            className="bg-background"
            value={quotation.terms}
            onChange={(e) => onUpdate({ terms: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
