"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { QuotationItem } from "@/app/presentation/types/clients/types";
import { formatCurrency } from "@/app/presentation/utils/clients/quotation-totals";
import { uid } from "@/app/presentation/utils/clients/ids";

interface QuotationItemsTableProps {
  items: QuotationItem[];
  currency: string;
  onChange: (items: QuotationItem[]) => void;
}

export function QuotationItemsTable({ items, currency, onChange }: QuotationItemsTableProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addItem = () => {
    onChange([
      ...items,
      { id: uid(), description: "", quantity: 1, unitPrice: 0, subItems: [] },
    ]);
  };

  const updateItem = (id: string, patch: Partial<QuotationItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const addSubItem = (itemId: string) => {
    onChange(
      items.map((item) =>
        item.id === itemId
          ? { ...item, subItems: [...item.subItems, { id: uid(), description: "" }] }
          : item
      )
    );
    setExpandedItems((prev) => new Set(prev).add(itemId));
  };

  const updateSubItem = (itemId: string, subItemId: string, description: string) => {
    onChange(
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              subItems: item.subItems.map((sub) =>
                sub.id === subItemId ? { ...sub, description } : sub
              ),
            }
          : item
      )
    );
  };

  const removeSubItem = (itemId: string, subItemId: string) => {
    onChange(
      items.map((item) =>
        item.id === itemId
          ? { ...item, subItems: item.subItems.filter((sub) => sub.id !== subItemId) }
          : item
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Productos / Servicios
        </p>
        <Button type="button" onClick={addItem} variant="outline" size="sm">
          <Plus />
          Agregar
        </Button>
      </div>

      <div className="border border-border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="w-8"></th>
              <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">
                Descripción
              </th>
              <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground w-20">
                Cant.
              </th>
              <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground w-28">
                Precio
              </th>
              <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground w-28">
                Total
              </th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <Fragment key={item.id}>
                <tr className="border-b border-border">
                  <td className="py-1 px-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => toggleExpand(item.id)}
                    >
                      {expandedItems.has(item.id) ? <ChevronDown /> : <ChevronRight />}
                    </Button>
                  </td>
                  <td className="py-1 px-2">
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      placeholder="Descripción"
                      className="border-0 bg-transparent h-8 focus-visible:ring-0"
                    />
                  </td>
                  <td className="py-1 px-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, { quantity: parseInt(e.target.value) || 1 })
                      }
                      className="text-center border-0 bg-transparent h-8 focus-visible:ring-0"
                    />
                  </td>
                  <td className="py-1 px-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })
                      }
                      className="text-right border-0 bg-transparent h-8 focus-visible:ring-0"
                    />
                  </td>
                  <td className="py-2 px-3 text-right font-medium text-foreground">
                    {formatCurrency(item.quantity * item.unitPrice, currency)}
                  </td>
                  <td className="py-1 px-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 />
                    </Button>
                  </td>
                </tr>
                {expandedItems.has(item.id) && (
                  <tr key={`${item.id}-subitems`} className="border-b border-border bg-muted/30">
                    <td colSpan={6} className="py-2 px-4">
                      <div className="space-y-2 pl-6">
                        {item.subItems.map((subItem) => (
                          <div key={subItem.id} className="flex items-center gap-2">
                            <span className="text-muted-foreground text-xs">•</span>
                            <Input
                              value={subItem.description}
                              onChange={(e) => updateSubItem(item.id, subItem.id, e.target.value)}
                              placeholder="Detalle del item"
                              className="flex-1 h-7 text-xs"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => removeSubItem(item.id, subItem.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => addSubItem(item.id)}
                          className="text-xs text-muted-foreground"
                        >
                          <Plus />
                          Agregar detalle
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          <p>No hay productos</p>
        </div>
      )}
    </div>
  );
}
