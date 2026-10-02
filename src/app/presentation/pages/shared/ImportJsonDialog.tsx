"use client";

import { useState, type FormEvent } from "react";
import { Braces, Copy } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { JsonGuideSection } from "@/app/presentation/utils/clients/document-import-guides";

interface ImportJsonDialogProps {
  title: string;
  example: string;
  guide: JsonGuideSection[];
  /** Lanza un error con mensaje legible si el JSON no es válido. */
  onImport: (raw: string) => void;
}

export function ImportJsonDialog({ title, example, guide, onImport }: ImportJsonDialogProps) {
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setRaw("");
      setError(null);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!raw.trim()) return;
    try {
      onImport(raw);
      handleOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo importar el JSON.");
    }
  };

  const copyExample = async () => {
    try {
      await navigator.clipboard.writeText(example);
      toast.success("Ejemplo copiado al portapapeles");
    } catch {
      toast.error("No se pudo copiar el ejemplo");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" />}>
        <Braces />
        Pegar JSON
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)] sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Pega el JSON del documento. Los campos que falten se completan con valores por
            defecto. Consulta la guía para ver todo lo que puedes definir.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col gap-4">
          <div className="grid min-h-0 gap-4 overflow-y-auto md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:overflow-visible">
            <div className="flex min-h-0 flex-col gap-2">
              <Textarea
                value={raw}
                onChange={(e) => {
                  setRaw(e.target.value);
                  setError(null);
                }}
                placeholder={example}
                aria-invalid={!!error}
                className="field-sizing-fixed h-80 resize-none bg-background font-mono text-xs md:h-[60dvh] md:text-xs"
                spellCheck={false}
                autoFocus
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <JsonGuide guide={guide} />
          </div>
          <DialogFooter>
            <div className="flex gap-2 sm:mr-auto">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setRaw(example);
                  setError(null);
                }}
              >
                Usar ejemplo
              </Button>
              <Button type="button" variant="ghost" onClick={copyExample}>
                <Copy />
                Copiar ejemplo
              </Button>
            </div>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!raw.trim()}>
              Generar documento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function JsonGuide({ guide }: { guide: JsonGuideSection[] }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-3 md:h-[60dvh] md:overflow-y-auto">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Guía de campos
      </p>
      {guide.map((section) => (
        <div key={section.title} className="flex flex-col gap-1.5">
          <h3 className="text-sm font-medium">{section.title}</h3>
          {section.description && (
            <p className="text-xs text-muted-foreground">{section.description}</p>
          )}
          <dl className="flex flex-col divide-y rounded-md border bg-background">
            {section.fields.map((field) => (
              <div key={field.name} className="flex flex-col gap-0.5 px-2.5 py-1.5">
                <dt className="flex flex-wrap items-baseline gap-x-2">
                  <code className="font-mono text-xs font-medium">{field.name}</code>
                  <span className="font-mono text-[11px] text-muted-foreground">{field.type}</span>
                </dt>
                <dd className="text-xs text-muted-foreground">{field.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
