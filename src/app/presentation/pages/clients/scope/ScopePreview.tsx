"use client";

import { forwardRef } from "react";
import type { Client, ScopeDocument } from "@/app/presentation/types/clients/types";

function paragraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("es", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("es")}`;
  }
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es", { day: "2-digit", month: "long", year: "numeric" });
}

interface ScopePreviewProps {
  client: Client;
  scope: ScopeDocument;
}

export const ScopePreview = forwardRef<HTMLDivElement, ScopePreviewProps>(function ScopePreview(
  { client, scope },
  ref
) {
  const accent = /^#[0-9a-fA-F]{3,8}$/.test(scope.accent) ? scope.accent : "#2563eb";
  const sections = scope.sections.filter((s) => s.enabled);

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
        .doc-preview .doc-topbar {
          height: 6px; background: ${accent}; border-radius: 3px; margin-bottom: 28px;
        }
        .doc-preview .doc-head {
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 24px; margin-bottom: 32px;
        }
        .doc-preview .doc-company { font-size: 15px; font-weight: 700; color: #111827; }
        .doc-preview .doc-by { font-size: 12px; color: #6b7280; margin-top: 2px; }
        .doc-preview .doc-meta { text-align: right; font-size: 11.5px; color: #6b7280; }
        .doc-preview .doc-meta b { color: #374151; font-weight: 600; }
        .doc-preview h1.doc-title {
          font-size: 24px; line-height: 1.25; font-weight: 800; color: #0f172a;
          margin: 0 0 6px;
        }
        .doc-preview .doc-subtitle { font-size: 13px; color: #6b7280; margin-bottom: 28px; }
        .doc-preview .doc-subtitle b { color: #374151; }
        .doc-preview .doc-total {
          border: 1px solid #e5e7eb; border-left: 4px solid ${accent};
          border-radius: 8px; padding: 14px 18px; margin: 0 0 28px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .doc-preview .doc-total .lbl { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: .04em; }
        .doc-preview .doc-total .val { font-size: 20px; font-weight: 800; color: #0f172a; }
        .doc-preview section.doc-section { margin-bottom: 26px; }
        .doc-preview h2.doc-h2 {
          font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 10px;
          padding-bottom: 6px; border-bottom: 2px solid #f1f5f9;
        }
        .doc-preview h2.doc-h2::before {
          content: ""; display: inline-block; width: 8px; height: 8px; border-radius: 2px;
          background: ${accent}; margin-right: 8px; vertical-align: middle;
        }
        .doc-preview p.doc-p { margin: 0 0 8px; }
        .doc-preview .doc-intro { color: #4b5563; margin: 0 0 8px; }
        .doc-preview ul.doc-list { margin: 0; padding-left: 0; list-style: none; }
        .doc-preview ul.doc-list li {
          position: relative; padding-left: 20px; margin-bottom: 6px;
        }
        .doc-preview ul.doc-list li::before {
          content: ""; position: absolute; left: 4px; top: 7px;
          width: 6px; height: 6px; border-radius: 50%; background: ${accent};
        }
        .doc-preview .phase {
          border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 14px; margin-bottom: 10px;
        }
        .doc-preview .phase-head { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; }
        .doc-preview .phase-name { font-weight: 700; color: #111827; font-size: 13px; }
        .doc-preview .phase-dur {
          font-size: 11px; font-weight: 600; color: ${accent};
          background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 999px; padding: 2px 10px; white-space: nowrap;
        }
        .doc-preview .phase-desc { color: #4b5563; margin-top: 4px; }
        .doc-preview .price-item {
          border-bottom: 1px solid #f1f5f9; padding: 12px 0;
        }
        .doc-preview .price-item:first-child { padding-top: 4px; }
        .doc-preview .price-head { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; }
        .doc-preview .price-concept { font-weight: 700; color: #111827; font-size: 13.5px; }
        .doc-preview .price-amount { font-weight: 700; color: #0f172a; white-space: nowrap; }
        .doc-preview .price-detail { color: #4b5563; margin-top: 3px; }
        .doc-preview .price-just { margin-top: 5px; font-size: 12.5px; color: #475569; }
        .doc-preview .price-just .tag {
          display: inline-block; font-size: 10.5px; font-weight: 700; text-transform: uppercase;
          letter-spacing: .04em; color: ${accent}; margin-right: 6px;
        }
        .doc-preview .price-total {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 12px; padding: 10px 14px; background: #f8fafc;
          border: 1px solid #e5e7eb; border-radius: 8px;
        }
        .doc-preview .price-total .lbl { font-weight: 700; color: #0f172a; }
        .doc-preview .price-total .val { font-weight: 800; color: #0f172a; font-size: 16px; }
        .doc-preview .price-notes {
          margin-top: 10px; font-size: 11.5px; color: #6b7280; font-style: italic;
        }
        .doc-preview .doc-foot {
          margin-top: 40px; padding-top: 14px; border-top: 1px solid #e5e7eb;
          font-size: 11px; color: #9ca3af; display: flex; justify-content: space-between; gap: 16px;
        }
      `}</style>

      <div className="doc-topbar" />

      <div className="doc-head">
        <div>
          <div className="doc-company">{scope.company || "Tu empresa"}</div>
          {scope.preparedBy ? <div className="doc-by">Preparado por {scope.preparedBy}</div> : null}
          {scope.contact ? <div className="doc-by">{scope.contact}</div> : null}
        </div>
        <div className="doc-meta">
          <div>
            <b>Fecha:</b> {formatDate(scope.date)}
          </div>
          <div>
            <b>Versión:</b> {scope.version || "1.0"}
          </div>
          {scope.validity ? (
            <div>
              <b>Validez:</b> {scope.validity}
            </div>
          ) : null}
        </div>
      </div>

      <h1 className="doc-title">{scope.docTitle || "Documento de Alcance del Proyecto"}</h1>
      <div className="doc-subtitle">
        Cliente: <b>{client.name}</b>
      </div>

      {scope.quoteTotal != null ? (
        <div className="doc-total">
          <span className="lbl">Inversión total de la propuesta</span>
          <span className="val">{formatMoney(scope.quoteTotal, scope.currency)}</span>
        </div>
      ) : null}

      {sections.map((s) => (
        <section key={s.id} className="doc-section">
          <h2 className="doc-h2">{s.title}</h2>

          {s.type === "text" &&
            paragraphs(s.body).map((p, i) => (
              <p key={i} className="doc-p">
                {p}
              </p>
            ))}

          {s.type === "list" && (
            <>
              {s.intro ? <p className="doc-intro">{s.intro}</p> : null}
              <ul className="doc-list">
                {s.items
                  .filter((i) => i.trim())
                  .map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
              </ul>
            </>
          )}

          {s.type === "phases" && (
            <>
              {s.intro ? <p className="doc-intro">{s.intro}</p> : null}
              {s.phases
                .filter((p) => p.name.trim() || p.description.trim())
                .map((p) => (
                  <div key={p.id} className="phase">
                    <div className="phase-head">
                      <span className="phase-name">{p.name || "Fase"}</span>
                      {p.duration ? <span className="phase-dur">{p.duration}</span> : null}
                    </div>
                    {p.description ? <div className="phase-desc">{p.description}</div> : null}
                  </div>
                ))}
            </>
          )}

          {s.type === "pricing" && (
            <>
              {s.intro ? <p className="doc-intro">{s.intro}</p> : null}
              {s.items
                .filter(
                  (i) => i.concept.trim() || i.detail.trim() || i.justification.trim() || i.amount
                )
                .map((item) => (
                  <div key={item.id} className="price-item">
                    <div className="price-head">
                      <span className="price-concept">{item.concept || "Concepto"}</span>
                      {s.showAmounts ? (
                        <span className="price-amount">
                          {formatMoney(item.amount || 0, scope.currency)}
                        </span>
                      ) : null}
                    </div>
                    {item.detail ? <div className="price-detail">{item.detail}</div> : null}
                    {item.justification ? (
                      <div className="price-just">
                        <span className="tag">Por qué este valor</span>
                        {item.justification}
                      </div>
                    ) : null}
                  </div>
                ))}

              {s.showAmounts && (
                <div className="price-total">
                  <span className="lbl">Total</span>
                  <span className="val">
                    {formatMoney(
                      s.items.reduce((acc, i) => acc + (Number(i.amount) || 0), 0),
                      scope.currency
                    )}
                  </span>
                </div>
              )}
              {s.notes ? <div className="price-notes">{s.notes}</div> : null}
            </>
          )}
        </section>
      ))}

      <div className="doc-foot">
        <span>
          {scope.company || "Tu empresa"} — {scope.docTitle}
        </span>
        <span>{client.name}{scope.version ? ` · v${scope.version}` : ""}</span>
      </div>
    </div>
  );
});
