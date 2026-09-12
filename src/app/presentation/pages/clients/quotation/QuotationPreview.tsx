"use client";

import { Fragment, forwardRef } from "react";
import type { Client, QuotationDocument } from "@/app/presentation/types/clients/types";
import { calculateQuotationTotals, formatCurrency } from "@/app/presentation/utils/clients/quotation-totals";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
}

interface QuotationPreviewProps {
  client: Client;
  quotation: QuotationDocument;
}

export const QuotationPreview = forwardRef<HTMLDivElement, QuotationPreviewProps>(
  function QuotationPreview({ client, quotation }, ref) {
    const accent = /^#[0-9a-fA-F]{3,8}$/.test(quotation.issuer.brandColor)
      ? quotation.issuer.brandColor
      : "#111827";
    const { subtotal, taxAmount, total } = calculateQuotationTotals(
      quotation.items,
      quotation.taxRate
    );

    return (
      <div ref={ref} className="doc-preview">
        <style>{`
          .doc-preview {
            width: 794px;
            min-height: 1123px;
            background: #ffffff;
            color: #1f2937;
            padding: 56px 60px 64px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 13px;
            line-height: 1.6;
            box-sizing: border-box;
          }
          .doc-preview * { box-sizing: border-box; }
          .doc-preview .quote-head {
            display: flex; justify-content: space-between; align-items: flex-start;
            gap: 24px; margin-bottom: 40px;
          }
          .doc-preview .quote-head-left { display: flex; align-items: center; gap: 16px; }
          .doc-preview .quote-logo { height: 48px; width: 48px; object-fit: contain; }
          .doc-preview h1.quote-title {
            font-size: 24px; font-weight: 700; letter-spacing: -0.01em; margin: 0;
            color: ${accent};
          }
          .doc-preview .quote-issuer { color: #4b5563; font-size: 13px; margin-top: 2px; }
          .doc-preview .quote-meta { text-align: right; font-size: 11.5px; color: #6b7280; }
          .doc-preview .client-block {
            margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #f3f4f6;
          }
          .doc-preview .client-label {
            font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 8px;
          }
          .doc-preview .client-name { font-weight: 600; color: #111827; }
          .doc-preview .client-line { font-size: 12.5px; color: #6b7280; }
          .doc-preview table.items { width: 100%; margin-bottom: 32px; font-size: 13px; border-collapse: collapse; }
          .doc-preview table.items thead tr { border-bottom: 1px solid ${accent}; }
          .doc-preview table.items th {
            text-align: left; padding: 8px 0; font-weight: 600; color: #111827;
          }
          .doc-preview table.items th.num { text-align: center; width: 64px; }
          .doc-preview table.items th.money { text-align: right; width: 96px; }
          .doc-preview table.items td { padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #374151; }
          .doc-preview table.items td.num { text-align: center; color: #4b5563; }
          .doc-preview table.items td.money { text-align: right; color: #4b5563; }
          .doc-preview table.items td.money.total { color: #111827; }
          .doc-preview .sub-items { margin: 0; padding: 8px 0 4px 24px; list-style: none; font-size: 11.5px; color: #6b7280; }
          .doc-preview .sub-items li { position: relative; padding-left: 14px; margin-bottom: 4px; }
          .doc-preview .sub-items li::before { content: "•"; position: absolute; left: 0; color: #9ca3af; }
          .doc-preview .totals { display: flex; justify-content: flex-end; margin-bottom: 8px; }
          .doc-preview .totals-box { width: 220px; font-size: 13px; }
          .doc-preview .totals-row { display: flex; justify-content: space-between; color: #6b7280; padding: 2px 0; }
          .doc-preview .totals-row.grand {
            border-top: 1px solid #e5e7eb; margin-top: 8px; padding-top: 10px;
            display: flex; justify-content: space-between; align-items: baseline;
          }
          .doc-preview .totals-row.grand .lbl { font-weight: 600; color: #111827; }
          .doc-preview .totals-row.grand .val { font-size: 18px; font-weight: 700; color: ${accent}; }
          .doc-preview .note-block { margin-top: 40px; padding-top: 20px; border-top: 1px solid #f3f4f6; }
          .doc-preview .note-label {
            font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 6px;
          }
          .doc-preview .note-body { font-size: 12.5px; color: #6b7280; white-space: pre-line; }
        `}</style>

        <div className="quote-head">
          <div className="quote-head-left">
            {quotation.issuer.logo && (
              <img src={quotation.issuer.logo} alt="Logo" className="quote-logo" />
            )}
            <div>
              <h1 className="quote-title">Cotización</h1>
              {quotation.issuer.name && <div className="quote-issuer">{quotation.issuer.name}</div>}
              {quotation.preparedBy && (
                <div className="quote-issuer">Preparado por {quotation.preparedBy}</div>
              )}
            </div>
          </div>
          <div className="quote-meta">
            <div>Número: {quotation.number}</div>
            <div>Emisión: {formatDate(quotation.date)}</div>
            <div>Válida hasta: {formatDate(quotation.validUntil)}</div>
          </div>
        </div>

        <div className="client-block">
          <div className="client-label">Cliente</div>
          <div className="client-name">{client.name}</div>
          {client.company && <div className="client-line">{client.company}</div>}
          {client.email && <div className="client-line">{client.email}</div>}
          {client.phone && <div className="client-line">{client.phone}</div>}
        </div>

        <table className="items">
          <thead>
            <tr>
              <th>Descripción</th>
              <th className="num">Cant.</th>
              <th className="money">Precio</th>
              <th className="money">Total</th>
            </tr>
          </thead>
          <tbody>
            {quotation.items.map((item) => (
              <Fragment key={item.id}>
                <tr>
                  <td>{item.description}</td>
                  <td className="num">{item.quantity}</td>
                  <td className="money">{formatCurrency(item.unitPrice, quotation.currency)}</td>
                  <td className="money total">
                    {formatCurrency(item.quantity * item.unitPrice, quotation.currency)}
                  </td>
                </tr>
                {item.subItems.length > 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: 0, border: 0 }}>
                      <ul className="sub-items">
                        {item.subItems.map((sub) => (
                          <li key={sub.id}>{sub.description}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>

        <div className="totals">
          <div className="totals-box">
            <div className="totals-row">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal, quotation.currency)}</span>
            </div>
            <div className="totals-row">
              <span>IVA ({quotation.taxRate}%)</span>
              <span>{formatCurrency(taxAmount, quotation.currency)}</span>
            </div>
            <div className="totals-row grand">
              <span className="lbl">Total</span>
              <span className="val">{formatCurrency(total, quotation.currency)}</span>
            </div>
          </div>
        </div>

        {quotation.notes && (
          <div className="note-block">
            <div className="note-label">Notas</div>
            <div className="note-body">{quotation.notes}</div>
          </div>
        )}

        {quotation.terms && (
          <div className="note-block">
            <div className="note-label">Términos y condiciones</div>
            <div className="note-body">{quotation.terms}</div>
          </div>
        )}
      </div>
    );
  }
);
