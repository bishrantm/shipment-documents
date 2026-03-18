import React from "react";
import { DocumentHeader } from "./document-header";
import { mockShipment } from "./shipment-data";
import {
  pageStyle,
  FONT,
  cellStyle,
  headerCellStyle,
  fillCellBg,
  sectionHeaderStyle,
  signatureLineStyle,
  signatureLabelStyle,
} from "./doc-styles";

/**
 * PACKING LIST — Available from Ready to Pick state onwards
 * Fields: Shipment number, customer, ship-to address, carrier, line items with quantities,
 * lot/serial numbers, staged location, total weight (if configured).
 */
export function PackingList() {
  const s = mockShipment;

  return (
    <div style={pageStyle} className="mx-auto">
      <DocumentHeader
        documentType="Packing List"
        documentNumber={s.shipmentNumber}
        fields={[
          [
            { label: "Shipment #", value: s.shipmentNumber },
            { label: "Order #", value: s.orderNumber },
            { label: "PO #", value: s.poNumber },
            { label: "Ship Date", value: s.shipDate },
          ],
          [
            { label: "Customer", value: s.customerName },
            { label: "Ship-To Address", value: `${s.shipToAddress}, ${s.shipToCityStateZip}` },
            { label: "Carrier", value: s.carrier },
            { label: "Shipping Mode", value: s.shippingMode },
          ],
        ]}
      />

      {/* Line items */}
      {s.flatLineItems.map((item) => (
        <div key={item.lineNo} style={{ marginBottom: "14px" }}>
          {/* Line banner */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "5px 10px",
              backgroundColor: "var(--secondary)",
              border: "1px solid var(--border)",
              borderBottom: "none",
              borderRadius: "var(--radius) var(--radius) 0 0",
              fontFamily: FONT,
              fontSize: "12px",
            }}
          >
            <span style={{ fontWeight: "var(--font-weight-semibold)" as any }}>
              Line {item.lineNo}
            </span>
            <span style={{ fontWeight: "var(--font-weight-medium)" as any, color: "var(--primary)" }}>
              {item.sku}
            </span>
            <span style={{ fontWeight: "var(--font-weight-normal)" as any, flex: 1 }}>
              {item.description}
            </span>
            {item.stagedLocation && (
              <span style={{ fontWeight: "var(--font-weight-medium)" as any, color: "var(--accent)", fontSize: "11px" }}>
                Staged: {item.stagedLocation}
              </span>
            )}
            <span style={{ fontWeight: "var(--font-weight-semibold)" as any }}>
              Qty: {item.orderedQty} {item.uom}
            </span>
          </div>

          {/* Pack table */}
          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid var(--border)", borderTop: "none" }}>
            <thead>
              <tr>
                <th style={{ ...headerCellStyle, width: "30px", textAlign: "center" }}>✓</th>
                <th style={{ ...headerCellStyle, width: "100px" }}>Lot / Batch</th>
                <th style={{ ...headerCellStyle, width: "100px" }}>Serial #</th>
                <th style={{ ...headerCellStyle, width: "80px" }}>Staged Loc</th>
                <th style={{ ...headerCellStyle, width: "55px", textAlign: "center" }}>Qty</th>
                <th style={{ ...headerCellStyle, width: "55px", textAlign: "center" }}>Packed</th>
                <th style={{ ...headerCellStyle, width: "55px", textAlign: "center" }}>Box #</th>
                <th style={{ ...headerCellStyle, borderRight: "none" }}>Condition / Notes</th>
              </tr>
            </thead>
            <tbody>
              {/* Pre-fill rows from lots/serials if available */}
              {item.serials && item.serials.length > 0
                ? item.serials.map((serial, si) => (
                    <tr key={`s-${si}`}>
                      <td style={{ ...cellStyle, textAlign: "center" }}><CheckboxPrint /></td>
                      <td style={cellStyle}>{item.lots?.[Math.min(si, (item.lots?.length ?? 1) - 1)] || "—"}</td>
                      <td style={cellStyle}>{serial}</td>
                      <td style={cellStyle}>{item.stagedLocation || "—"}</td>
                      <td style={{ ...cellStyle, textAlign: "center", fontWeight: "var(--font-weight-semibold)" as any }}>1</td>
                      <td style={{ ...cellStyle, textAlign: "center", backgroundColor: fillCellBg }} />
                      <td style={{ ...cellStyle, textAlign: "center", backgroundColor: fillCellBg }} />
                      <td style={{ ...cellStyle, borderRight: "none", backgroundColor: fillCellBg }} />
                    </tr>
                  ))
                : item.lots && item.lots.length > 0
                  ? item.lots.map((lot, li) => (
                      <tr key={`l-${li}`}>
                        <td style={{ ...cellStyle, textAlign: "center" }}><CheckboxPrint /></td>
                        <td style={cellStyle}>{lot}</td>
                        <td style={cellStyle}>—</td>
                        <td style={cellStyle}>{item.stagedLocation || "—"}</td>
                        <td style={{ ...cellStyle, textAlign: "center", fontWeight: "var(--font-weight-semibold)" as any }}>{Math.ceil(item.orderedQty / item.lots!.length)}</td>
                        <td style={{ ...cellStyle, textAlign: "center", backgroundColor: fillCellBg }} />
                        <td style={{ ...cellStyle, textAlign: "center", backgroundColor: fillCellBg }} />
                        <td style={{ ...cellStyle, borderRight: "none", backgroundColor: fillCellBg }} />
                      </tr>
                    ))
                  : (
                      <tr>
                        <td style={{ ...cellStyle, textAlign: "center" }}><CheckboxPrint /></td>
                        <td style={cellStyle}>—</td>
                        <td style={cellStyle}>—</td>
                        <td style={cellStyle}>{item.stagedLocation || "—"}</td>
                        <td style={{ ...cellStyle, textAlign: "center", fontWeight: "var(--font-weight-semibold)" as any }}>{item.orderedQty}</td>
                        <td style={{ ...cellStyle, textAlign: "center", backgroundColor: fillCellBg }} />
                        <td style={{ ...cellStyle, textAlign: "center", backgroundColor: fillCellBg }} />
                        <td style={{ ...cellStyle, borderRight: "none", backgroundColor: fillCellBg }} />
                      </tr>
                    )
              }
              {Array.from({ length: item.emptyPackRows }).map((_, i) => (
                <tr key={`e-${i}`}>
                  <td style={{ ...cellStyle, textAlign: "center" }}><CheckboxPrint light /></td>
                  <td style={{ ...cellStyle, backgroundColor: fillCellBg }} />
                  <td style={{ ...cellStyle, backgroundColor: fillCellBg }} />
                  <td style={{ ...cellStyle, backgroundColor: fillCellBg }} />
                  <td style={{ ...cellStyle, textAlign: "center", backgroundColor: fillCellBg }} />
                  <td style={{ ...cellStyle, textAlign: "center", backgroundColor: fillCellBg }} />
                  <td style={{ ...cellStyle, textAlign: "center", backgroundColor: fillCellBg }} />
                  <td style={{ ...cellStyle, borderRight: "none", backgroundColor: fillCellBg }} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Totals / Weight */}
      <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", marginTop: "12px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)" }}>
          <SummaryCell label="Total Lines" value={String(s.flatLineItems.length)} />
          <SummaryCell label="Total Units" value={String(s.flatLineItems.reduce((a, l) => a + l.orderedQty, 0))} />
          <SummaryCell label="Total Weight (lbs)" value={String(s.totalWeight)} />
          <SummaryCell label="Package Count" value={String(s.packageCount)} />
          <SummaryCell label="Total Boxes" value="________________" last />
        </div>
      </div>

      {/* Signatures */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginTop: "28px" }}>
        <div>
          <div style={signatureLineStyle} />
          <div style={signatureLabelStyle}>Packed By / Date</div>
        </div>
        <div>
          <div style={signatureLineStyle} />
          <div style={signatureLabelStyle}>Verified By / Date</div>
        </div>
        <div>
          <div style={signatureLineStyle} />
          <div style={signatureLabelStyle}>Carrier Signature / Date</div>
        </div>
      </div>
    </div>
  );
}

function CheckboxPrint({ light = false }: { light?: boolean }) {
  return (
    <div
      style={{
        width: "12px",
        height: "12px",
        border: `1.5px solid ${light ? "var(--border)" : "var(--foreground)"}`,
        borderRadius: "2px",
        display: "inline-block",
        verticalAlign: "middle",
      }}
    />
  );
}

function SummaryCell({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ padding: "6px 10px", borderRight: last ? "none" : "1px solid var(--border)" }}>
      <div style={sectionHeaderStyle}>{label}</div>
      <div style={{ fontFamily: FONT, fontSize: "13px", fontWeight: "var(--font-weight-semibold)" as any }}>{value}</div>
    </div>
  );
}