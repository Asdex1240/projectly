"use client";

import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ScopeListEditorProps {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}

export function ScopeListEditor({
  items,
  onChange,
  placeholder = "Escribe un punto…",
  addLabel = "Agregar punto",
}: ScopeListEditorProps) {
  const set = (i: number, v: string) => {
    const next = [...items];
    next[i] = v;
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <Input
            className="h-9 bg-background"
            value={item}
            placeholder={placeholder}
            onChange={(e) => set(i, e.target.value)}
          />
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => move(i, -1)}
            disabled={i === 0}
            aria-label="Subir"
          >
            <ArrowUp />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => move(i, 1)}
            disabled={i === items.length - 1}
            aria-label="Bajar"
          >
            <ArrowDown />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => remove(i)}
            aria-label="Quitar"
          >
            <X />
          </Button>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={() => onChange([...items, ""])}>
        <Plus />
        {addLabel}
      </Button>
    </div>
  );
}
