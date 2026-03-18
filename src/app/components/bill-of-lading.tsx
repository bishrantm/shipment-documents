import React from "react";
import { mockShipment } from "./shipment-data";
import {
  pageStyle,
  FONT,
  cellStyle,
  headerCellStyle,
  sectionHeaderStyle,
  signatureLineStyle,
  signatureLabelStyle,
} from "./doc-styles";

/**
 * BILL OF LADING (BOL) — Generated at Execution
 * Fields: Shipper name/address, consignee name/address, carrier, shipment number,
 * line items with descriptions and quantities, total weight, special handling instructions,
 * driver name and signature, ship date.
 */
export function BillOfLading() {
  const s = mockShipment;

  return (
    <div style={pageStyle} className="mx-auto">
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "14px" }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: "var(--text-h3)",
            fontWeight: "var(--font-weight-semibold)" as any,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Bill of Lading
        </div>
        <div style={{ fontFamily: FONT, fontSize: "11px", fontWeight: "var(--font-weight-normal)" as any, opacity: 0.5, marginTop: "2px" }}>
          Straight Bill of Lading — Original — Not Negotiable
        </div>
      </div>

      {/* Shipment info bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          border: "2px solid var(--foreground)",
          borderRadius: "var(--radius)",
          overflow: "hidden",
          marginBottom: "14px",
        }}
      >
        <BOLField label="Shipment #" value={s.shipmentNumber} bold />
        <BOLField label="Ship Date" value={s.shipDate} />
        <BOLField label="PO #" value={s.poNumber} last />
      </div>

      {/* Shipper / Consignee side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
        {/* Shipper */}
        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
          <div style={{ backgroundColor: "var(--secondary)", padding: "4px 10px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ ...sectionHeaderStyle, opacity: 0.7, marginBottom: 0 }}>Shipper</div>
          </div>
          <div style={{ padding: "8px 10px" }}>
            <div style={{ fontFamily: FONT, fontSize: "13px", fontWeight: "var(--font-weight-semibold)" as any }}>{s.shipperName}</div>
            <div style={{ fontFamily: FONT, fontSize: "12px", fontWeight: "var(--font-weight-normal)" as any, lineHeight: "1.4", marginTop: "2px" }}>
              {s.shipFromAddress}<br />
              {s.shipFromCityStateZip}<br />
              {s.shipFromPhone}
            </div>
          </div>
        </div>

        {/* Consignee */}
        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
          <div style={{ backgroundColor: "var(--secondary)", padding: "4px 10px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ ...sectionHeaderStyle, opacity: 0.7, marginBottom: 0 }}>Consignee</div>
          </div>
          <div style={{ padding: "8px 10px" }}>
            <div style={{ fontFamily: FONT, fontSize: "13px", fontWeight: "var(--font-weight-semibold)" as any }}>{s.customerName}</div>
            <div style={{ fontFamily: FONT, fontSize: "12px", fontWeight: "var(--font-weight-normal)" as any, lineHeight: "1.4", marginTop: "2px" }}>
              {s.shipToAddress}<br />
              {s.shipToCityStateZip}<br />
              Attn: {s.shipToContact} &nbsp;|&nbsp; {s.shipToPhone}
            </div>
          </div>
        </div>
      </div>

      {/* Carrier info */}
      <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", marginBottom: "14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
          <BOLSmall label="Carrier" value={s.carrier} />
          <BOLSmall label="Shipping Mode" value={s.shippingMode} />
          <BOLSmall label="Tracking #" value={s.trackingNumber} />
          <BOLSmall label="Service Level" value={s.serviceLevel} last />
        </div>
      </div>

      {/* Line items table */}
      <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid var(--border)", marginBottom: "14px" }}>
        <thead>
          <tr>
            <th style={{ ...headerCellStyle, width: "40px", textAlign: "center" }}>Line</th>
            <th style={{ ...headerCellStyle, width: "100px" }}>Item / SKU</th>
            <th style={headerCellStyle}>Description</th>
            <th style={{ ...headerCellStyle, width: "50px", textAlign: "center" }}>UOM</th>
            <th style={{ ...headerCellStyle, width: "50px", textAlign: "center" }}>Qty</th>
            <th style={{ ...headerCellStyle, width: "70px", textAlign: "right" }}>Unit Wt</th>
            <th style={{ ...headerCellStyle, width: "80px", textAlign: "right", borderRight: "none" }}>Total Wt</th>
          </tr>
        </thead>
        <tbody>
          {s.flatLineItems.map((item) => (
            <tr key={item.lineNo}>
              <td style={{ ...cellStyle, textAlign: "center", fontWeight: "var(--font-weight-medium)" as any }}>{item.lineNo}</td>
              <td style={{ ...cellStyle, fontWeight: "var(--font-weight-medium)" as any, color: "var(--primary)" }}>{item.sku}</td>
              <td style={cellStyle}>{item.description}</td>
              <td style={{ ...cellStyle, textAlign: "center" }}>{item.uom}</td>
              <td style={{ ...cellStyle, textAlign: "center", fontWeight: "var(--font-weight-semibold)" as any }}>{item.orderedQty}</td>
              <td style={{ ...cellStyle, textAlign: "right" }}>{item.weight} lbs</td>
              <td style={{ ...cellStyle, textAlign: "right", fontWeight: "var(--font-weight-semibold)" as any, borderRight: "none" }}>
                {(item.weight * item.orderedQty).toLocaleString()} lbs
              </td>
            </tr>
          ))}
          {/* Total row */}
          <tr>
            <td colSpan={4} style={{ ...cellStyle, borderBottom: "none" }} />
            <td
              colSpan={2}
              style={{
                ...cellStyle,
                textAlign: "right",
                fontWeight: "var(--font-weight-semibold)" as any,
                fontSize: "12px",
                borderBottom: "none",
              }}
            >
              TOTAL WEIGHT:
            </td>
            <td
              style={{
                ...cellStyle,
                textAlign: "right",
                fontWeight: "var(--font-weight-semibold)" as any,
                fontSize: "13px",
                borderRight: "none",
                borderBottom: "none",
              }}
            >
              {s.totalWeight.toLocaleString()} lbs
            </td>
          </tr>
        </tbody>
      </table>

      {/* Special handling instructions */}
      <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", marginBottom: "14px" }}>
        <div style={{ backgroundColor: "var(--secondary)", padding: "4px 10px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ ...sectionHeaderStyle, opacity: 0.7, marginBottom: 0 }}>Special Handling Instructions</div>
        </div>
        <div style={{ padding: "8px 10px", minHeight: "48px" }}>
          <div style={{ fontFamily: FONT, fontSize: "12px", fontWeight: "var(--font-weight-normal)" as any, lineHeight: "1.5" }}>
            {s.specialHandling}
          </div>
        </div>
      </div>

      {/* Driver & Signature section */}
      <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", marginBottom: "14px" }}>
        <div style={{ backgroundColor: "var(--secondary)", padding: "4px 10px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ ...sectionHeaderStyle, opacity: 0.7, marginBottom: 0 }}>Carrier Acknowledgment</div>
        </div>
        <div style={{ padding: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <div style={sectionHeaderStyle}>Driver Name</div>
            <div style={{ borderBottom: "1px solid var(--border)", height: "28px" }} />
          </div>
          <div>
            <div style={sectionHeaderStyle}>Vehicle / Trailer #</div>
            <div style={{ borderBottom: "1px solid var(--border)", height: "28px" }} />
          </div>
        </div>
      </div>

      {/* Signature lines */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginTop: "20px" }}>
        <div>
          <div style={signatureLineStyle} />
          <div style={signatureLabelStyle}>Shipper Signature / Date</div>
        </div>
        <div>
          <div style={signatureLineStyle} />
          <div style={signatureLabelStyle}>Driver Signature / Date</div>
        </div>
        <div>
          <div style={signatureLineStyle} />
          <div style={signatureLabelStyle}>Consignee Signature / Date</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "16px", fontFamily: FONT, fontSize: "9px", fontWeight: "var(--font-weight-normal)" as any, opacity: 0.4 }}>
        This is an original Bill of Lading. The carrier acknowledges receipt of the goods described above in apparent good order unless otherwise noted.
      </div>
    </div>
  );
}

/* ─── Helper components ─── */

function BOLField({ label, value, bold = false, last = false }: { label: string; value: string; bold?: boolean; last?: boolean }) {
  return (
    <div style={{ padding: "6px 10px", borderRight: last ? "none" : "2px solid var(--foreground)" }}>
      <div style={{ fontFamily: FONT, fontSize: "9px", fontWeight: "var(--font-weight-semibold)" as any, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.5, marginBottom: "1px" }}>
        {label}
      </div>
      <div style={{ fontFamily: FONT, fontSize: bold ? "15px" : "13px", fontWeight: bold ? ("var(--font-weight-semibold)" as any) : ("var(--font-weight-medium)" as any) }}>
        {value}
      </div>
    </div>
  );
}

function BOLSmall({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ padding: "5px 10px", borderRight: last ? "none" : "1px solid var(--border)" }}>
      <div style={sectionHeaderStyle}>{label}</div>
      <div style={{ fontFamily: FONT, fontSize: "12px", fontWeight: "var(--font-weight-medium)" as any }}>{value}</div>
    </div>
  );
}