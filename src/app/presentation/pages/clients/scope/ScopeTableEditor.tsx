"use client";

import { ArrowDown, ArrowUp, Columns3, Plus, Rows3, Trash2, X } from "lucide-react";
import type { ScopeTable } from "@/app/presentation/types/clients/types";
import { uid } from "@/app/presentation/utils/clients/ids";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ScopeTableEditorProps {
  tables: ScopeTable[];
  onChange: (next: ScopeTable[]) => void;
}

function emptyTable(): ScopeTable {
  return {
    id: uid(),
    title: "",
    columns: ["Columna 1", "Columna 2"],
    rows: [
      ["", ""],
      ["", ""],
    ],
  };
}

export function ScopeTableEditor({ tables, onChange }: ScopeTableEditorProps) {
  const setTable = (i: number, next: ScopeTable) => {
    const copy = [...tables];
    copy[i] = next;
    onChange(copy);
  };
  const removeTable = (i: number) => onChange(tables.filter((_, idx) => idx !== i));
  const moveTable = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= tables.length) return;
    const next = [...tables];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {tables.map((table, i) => (
        <div key={table.id} className="space-y-2 rounded-md border p-3">
          <div className="flex items-center gap-1.5">
            <Input
              value={table.title ?? ""}
              onChange={(e) => setTable(i, { ...table, title: e.target.value })}
              placeholder="Título de la tabla (opcional)"
              className="h-9 bg-background font-medium"
            />
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() => moveTable(i, -1)}
              disabled={i === 0}
              aria-label="Subir tabla"
            >
              <ArrowUp />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() => moveTable(i, 1)}
              disabled={i === tables.length - 1}
              aria-label="Bajar tabla"
            >
              <ArrowDown />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => removeTable(i)}
              aria-label="Quitar tabla"
            >
              <Trash2 />
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {table.columns.map((col, ci) => (
                    <th key={ci} className="p-0.5">
                      <div className="flex items-center gap-1">
                        <Input
                          value={col}
                          onChange={(e) => {
                            const columns = [...table.columns];
                            columns[ci] = e.target.value;
                            setTable(i, { ...table, columns });
                          }}
                          placeholder={`Columna ${ci + 1}`}
                          className="h-8 bg-background text-xs font-semibold"
                        />
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            const columns = table.columns.filter((_, idx) => idx !== ci);
                            const rows = table.rows.map((row) =>
                              row.filter((_, idx) => idx !== ci)
                            );
                            setTable(i, { ...table, columns, rows });
                          }}
                          disabled={table.columns.length <= 1}
                          aria-label="Quitar columna"
                        >
                          <X />
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="p-0.5">
                        <Input
                          value={cell}
                          onChange={(e) => {
                            const rows = table.rows.map((r) => [...r]);
                            rows[ri][ci] = e.target.value;
                            setTable(i, { ...table, rows });
                          }}
                          className="h-8 bg-background"
                        />
                      </td>
                    ))}
                    <td className="p-0.5">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() =>
                          setTable(i, { ...table, rows: table.rows.filter((_, idx) => idx !== ri) })
                        }
                        aria-label="Quitar fila"
                      >
                        <X />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                setTable(i, {
                  ...table,
                  rows: [...table.rows, table.columns.map(() => "")],
                })
              }
            >
              <Rows3 />
              Agregar fila
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                setTable(i, {
                  ...table,
                  columns: [...table.columns, `Columna ${table.columns.length + 1}`],
                  rows: table.rows.map((row) => [...row, ""]),
                })
              }
            >
              <Columns3 />
              Agregar columna
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={() => onChange([...tables, emptyTable()])}>
        <Plus />
        Agregar tabla
      </Button>
    </div>
  );
}
