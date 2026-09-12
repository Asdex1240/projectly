import type { QuotationItem } from "@/app/presentation/types/clients/types";

export interface QuotationTotals {
  subtotal: number;
  taxAmount: number;
  total: number;
}

export function calculateQuotationTotals(
  items: QuotationItem[],
  taxRate: number
): QuotationTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const taxAmount = subtotal * (taxRate / 100);
  return { subtotal, taxAmount, total: subtotal + taxAmount };
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
  }).format(amount);
}

export function generateQuotationNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(100 + Math.random() * 900);
  return `COT-${year}${month}-${random}`;
}
