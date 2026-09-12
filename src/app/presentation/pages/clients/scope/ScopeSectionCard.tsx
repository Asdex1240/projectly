"use client";

import { ArrowDown, ArrowUp, GripVertical, Plus, Trash2, X } from "lucide-react";
import type { ScopePhase, ScopePriceItem, ScopeSection } from "@/app/presentation/types/clients/types";
import { uid } from "@/app/presentation/utils/clients/ids";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScopeEditorField } from "@/app/presentation/pages/clients/scope/ScopeEditorField";
import { ScopeListEditor } from "@/app/presentation/pages/clients/scope/ScopeListEditor";

interface ScopeSectionCardProps {
  section: ScopeSection;
  index: number;
  count: number;
  onChange: (next: ScopeSection) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}

export function ScopeSectionCard({
  section,
  index,
  count,
  onChange,
  onMove,
  onRemove,
}: ScopeSectionCardProps) {
  const patch = (p: Partial<ScopeSection>) => onChange({ ...section, ...p } as ScopeSection);

  return (
    <div className={"rounded-lg border bg-card " + (section.enabled ? "" : "opacity-60")}>
      <div className="flex items-center gap-2 border-b p-2.5">
        <GripVertical className="size-4 shrink-0 text-muted-foreground" />
        <Input
          value={section.title}
          onChange={(e) => patch({ title: e.target.value })}
          className="h-8 border-transparent bg-transparent px-1 font-semibold shadow-none focus-visible:border-input focus-visible:bg-background"
          placeholder="Título de la sección"
        />
        <div className="flex shrink-0 items-center gap-1">
          <div className="mr-1 flex items-center gap-1.5">
            <Switch
              id={`en-${section.id}`}
              checked={section.enabled}
              onCheckedChange={(v) => patch({ enabled: v })}
            />
            <Label
              htmlFor={`en-${section.id}`}
              className="hidden text-[11px] text-muted-foreground sm:block"
            >
              {section.enabled ? "Visible" : "Oculta"}
            </Label>
          </div>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label="Subir sección"
          >
            <ArrowUp />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onMove(1)}
            disabled={index === count - 1}
            aria-label="Bajar sección"
          >
            <ArrowDown />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
            onClick={onRemove}
            aria-label="Eliminar sección"
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <div className="space-y-4 p-4">
        {section.type === "text" && (
          <ScopeEditorField label="Contenido" hint="Separa párrafos con una línea en blanco.">
            <Textarea
              className="bg-background"
              value={section.body}
              onChange={(e) => patch({ body: e.target.value })}
              rows={5}
              placeholder="Escribe el contenido de esta sección…"
            />
          </ScopeEditorField>
        )}

        {section.type === "list" && (
          <>
            <ScopeEditorField label="Texto introductorio (opcional)">
              <Input
                className="h-9 bg-background"
                value={section.intro ?? ""}
                onChange={(e) => patch({ intro: e.target.value })}
                placeholder="Frase que aparece antes de la lista"
              />
            </ScopeEditorField>
            <ScopeEditorField label="Puntos">
              <ScopeListEditor items={section.items} onChange={(items) => patch({ items })} />
            </ScopeEditorField>
          </>
        )}

        {section.type === "phases" && (
          <PhasesEditor
            intro={section.intro ?? ""}
            phases={section.phases}
            onIntro={(intro) => patch({ intro })}
            onPhases={(phases) => patch({ phases })}
          />
        )}

        {section.type === "pricing" && (
          <PricingEditor section={section} onPatch={(p) => onChange({ ...section, ...p })} />
        )}
      </div>
    </div>
  );
}

function PhasesEditor({
  intro,
  phases,
  onIntro,
  onPhases,
}: {
  intro: string;
  phases: ScopePhase[];
  onIntro: (v: string) => void;
  onPhases: (v: ScopePhase[]) => void;
}) {
  const set = (i: number, p: Partial<ScopePhase>) => {
    const next = [...phases];
    next[i] = { ...next[i], ...p };
    onPhases(next);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= phases.length) return;
    const next = [...phases];
    [next[i], next[j]] = [next[j], next[i]];
    onPhases(next);
  };

  return (
    <>
      <ScopeEditorField label="Texto introductorio (opcional)">
        <Input
          className="h-9 bg-background"
          value={intro}
          onChange={(e) => onIntro(e.target.value)}
          placeholder="Frase que aparece antes de las fases"
        />
      </ScopeEditorField>
      <div className="space-y-3">
        {phases.map((p, i) => (
          <div key={p.id} className="space-y-2 rounded-md border p-3">
            <div className="flex items-center gap-1.5">
              <Input
                value={p.name}
                onChange={(e) => set(i, { name: e.target.value })}
                placeholder="Nombre de la fase"
                className="h-9 bg-background font-medium"
              />
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Subir"
              >
                <ArrowUp />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => move(i, 1)}
                disabled={i === phases.length - 1}
                aria-label="Bajar"
              >
                <ArrowDown />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => onPhases(phases.filter((_, idx) => idx !== i))}
                aria-label="Quitar fase"
              >
                <X />
              </Button>
            </div>
            <Input
              className="h-9 bg-background"
              value={p.duration}
              onChange={(e) => set(i, { duration: e.target.value })}
              placeholder="Duración (ej. 2 semanas)"
            />
            <Textarea
              className="bg-background"
              value={p.description}
              onChange={(e) => set(i, { description: e.target.value })}
              rows={2}
              placeholder="Qué se hace en esta fase"
            />
          </div>
        ))}
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPhases([...phases, { id: uid(), name: "", description: "", duration: "" }])}
        >
          <Plus />
          Agregar fase
        </Button>
      </div>
    </>
  );
}

function PricingEditor({
  section,
  onPatch,
}: {
  section: Extract<ScopeSection, { type: "pricing" }>;
  onPatch: (p: Partial<Extract<ScopeSection, { type: "pricing" }>>) => void;
}) {
  const items = section.items;
  const set = (i: number, p: Partial<ScopePriceItem>) => {
    const next = [...items];
    next[i] = { ...next[i], ...p };
    onPatch({ items: next });
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onPatch({ items: next });
  };
  const total = items.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);

  return (
    <>
      <ScopeEditorField label="Texto introductorio (opcional)">
        <Input
          className="h-9 bg-background"
          value={section.intro ?? ""}
          onChange={(e) => onPatch({ intro: e.target.value })}
        />
      </ScopeEditorField>

      <div className="flex items-center gap-2">
        <Switch
          id={`amt-${section.id}`}
          checked={section.showAmounts}
          onCheckedChange={(v) => onPatch({ showAmounts: v })}
        />
        <Label htmlFor={`amt-${section.id}`} className="text-xs text-muted-foreground">
          Mostrar montos y total en el documento
        </Label>
      </div>

      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={it.id} className="space-y-2 rounded-md border p-3">
            <div className="flex items-center gap-1.5">
              <Input
                value={it.concept}
                onChange={(e) => set(i, { concept: e.target.value })}
                placeholder="Concepto (ej. API backend)"
                className="h-9 bg-background font-medium"
              />
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Subir"
              >
                <ArrowUp />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                aria-label="Bajar"
              >
                <ArrowDown />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => onPatch({ items: items.filter((_, idx) => idx !== i) })}
                aria-label="Quitar concepto"
              >
                <X />
              </Button>
            </div>
            <ScopeEditorField label="Qué incluye">
              <Textarea
                className="bg-background"
                value={it.detail}
                onChange={(e) => set(i, { detail: e.target.value })}
                rows={2}
                placeholder="Describe qué entra en este concepto"
              />
            </ScopeEditorField>
            <ScopeEditorField
              label="Por qué se cobra / justificación del valor"
              hint="El argumento que verá el cliente para entender el precio."
            >
              <Textarea
                className="bg-background"
                value={it.justification}
                onChange={(e) => set(i, { justification: e.target.value })}
                rows={2}
                placeholder="Ej. Es el núcleo del producto y requiere más pruebas por la concurrencia…"
              />
            </ScopeEditorField>
            <ScopeEditorField label="Monto">
              <Input
                className="h-9 bg-background"
                type="number"
                inputMode="decimal"
                value={Number.isFinite(it.amount) ? it.amount : 0}
                onChange={(e) => set(i, { amount: parseFloat(e.target.value) || 0 })}
              />
            </ScopeEditorField>
          </div>
        ))}
        <div className="flex items-center justify-between">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              onPatch({
                items: [...items, { id: uid(), concept: "", detail: "", justification: "", amount: 0 }],
              })
            }
          >
            <Plus />
            Agregar concepto
          </Button>
          {section.showAmounts ? (
            <span className="text-sm text-muted-foreground">
              Total:{" "}
              <b className="text-foreground">
                {total.toLocaleString("es", { minimumFractionDigits: 2 })}
              </b>
            </span>
          ) : null}
        </div>
      </div>

      <ScopeEditorField label="Notas al pie (impuestos, forma de pago, etc.)">
        <Textarea
          className="bg-background"
          value={section.notes}
          onChange={(e) => onPatch({ notes: e.target.value })}
          rows={2}
        />
      </ScopeEditorField>
    </>
  );
}
