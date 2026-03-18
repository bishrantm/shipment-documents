import React, { useRef, useEffect } from "react";
import { mockShipment } from "./shipment-data";
import { FONT } from "./doc-styles";

/**
 * SHIPPING LABEL — Generated at Execution (Ship Confirmation)
 * Standard label format. Includes barcode + QR code encoding the shipment number.
 * Fields: Ship-from, ship-to, carrier, shipment # (barcode+QR), tracking #,
 * shipping mode, PO#, SO#, weight, package count.
 */
export function ShippingLabel() {
  const s = mockShipment;

  return (
    <div
      style={{
        width: "4in",
        minHeight: "6in",
        padding: "0.25in",
        fontFamily: FONT,
        color: "var(--foreground)",
        backgroundColor: "var(--background)",
        boxShadow: "var(--elevation-sm)",
        border: "2.5px solid var(--foreground)",
        borderRadius: "var(--radius)",
        margin: "0 auto",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          backgroundColor: "var(--foreground)",
          color: "var(--background)",
          padding: "6px 10px",
          textAlign: "center",
          fontFamily: FONT,
          fontSize: "14px",
          fontWeight: "var(--font-weight-semibold)" as any,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          borderRadius: "calc(var(--radius) - 4px)",
          marginBottom: "8px",
        }}
      >
        Shipping Label
      </div>

      {/* Ship-From */}
      <AddressBlock
        title="SHIP FROM"
        name={s.shipperName}
        address={s.shipFromAddress}
        cityStateZip={s.shipFromCityStateZip}
        phone={s.shipFromPhone}
      />

      {/* Divider */}
      <div style={{ borderTop: "2px solid var(--foreground)", margin: "6px 0" }} />

      {/* Ship-To */}
      <AddressBlock
        title="SHIP TO"
        name={s.customerName}
        address={s.shipToAddress}
        cityStateZip={s.shipToCityStateZip}
        phone={s.shipToPhone}
        contact={s.shipToContact}
        bold
      />

      {/* Divider */}
      <div style={{ borderTop: "2px solid var(--foreground)", margin: "6px 0" }} />

      {/* Info grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", border: "1px solid var(--border)", borderRadius: "calc(var(--radius) - 4px)", overflow: "hidden", marginBottom: "8px" }}>
        <LabelField label="Carrier" value={s.carrier} />
        <LabelField label="Shipping Mode" value={s.shippingMode} last />
        <LabelField label="Tracking #" value={s.trackingNumber} borderTop />
        <LabelField label="Service Level" value={s.serviceLevel} borderTop last />
        <LabelField label="PO #" value={s.poNumber} borderTop />
        <LabelField label="SO #" value={s.orderNumber} borderTop last />
        <LabelField label="Weight" value={`${s.totalWeight} lbs`} borderTop />
        <LabelField label="Packages" value={`${s.packageCount} of ${s.packageCount}`} borderTop last />
      </div>

      {/* Barcode */}
      <div style={{ textAlign: "center", marginBottom: "6px" }}>
        <BarcodeCanvas value={s.shipmentNumber} width={320} height={50} />
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: "11px", fontWeight: "var(--font-weight-medium)" as any, letterSpacing: "0.08em", marginTop: "2px" }}>
          {s.shipmentNumber}
        </div>
      </div>

      {/* QR Code */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "6px 0" }}>
        <QRCodeCanvas value={s.shipmentNumber} size={72} />
        <div>
          <div style={{ fontFamily: FONT, fontSize: "10px", fontWeight: "var(--font-weight-semibold)" as any, textTransform: "uppercase", opacity: 0.5, marginBottom: "2px" }}>
            Scan QR for Shipment Details
          </div>
          <div style={{ fontFamily: FONT, fontSize: "12px", fontWeight: "var(--font-weight-medium)" as any }}>
            {s.shipmentNumber}
          </div>
          <div style={{ fontFamily: FONT, fontSize: "11px", fontWeight: "var(--font-weight-normal)" as any, opacity: 0.6 }}>
            {s.shipDate}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function AddressBlock({
  title,
  name,
  address,
  cityStateZip,
  phone,
  contact,
  bold = false,
}: {
  title: string;
  name: string;
  address: string;
  cityStateZip: string;
  phone: string;
  contact?: string;
  bold?: boolean;
}) {
  return (
    <div style={{ padding: "2px 4px" }}>
      <div style={{ fontFamily: FONT, fontSize: "9px", fontWeight: "var(--font-weight-semibold)" as any, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.5, marginBottom: "2px" }}>
        {title}
      </div>
      <div style={{ fontFamily: FONT, fontSize: bold ? "13px" : "12px", fontWeight: bold ? ("var(--font-weight-semibold)" as any) : ("var(--font-weight-medium)" as any), lineHeight: "1.3" }}>
        {name}
      </div>
      {contact && (
        <div style={{ fontFamily: FONT, fontSize: "11px", fontWeight: "var(--font-weight-normal)" as any, opacity: 0.7 }}>
          Attn: {contact}
        </div>
      )}
      <div style={{ fontFamily: FONT, fontSize: "11px", fontWeight: "var(--font-weight-normal)" as any, lineHeight: "1.3" }}>
        {address}<br />{cityStateZip}
      </div>
      <div style={{ fontFamily: FONT, fontSize: "11px", fontWeight: "var(--font-weight-normal)" as any, opacity: 0.6 }}>
        {phone}
      </div>
    </div>
  );
}

function LabelField({
  label,
  value,
  last = false,
  borderTop = false,
}: {
  label: string;
  value: string;
  last?: boolean;
  borderTop?: boolean;
}) {
  return (
    <div
      style={{
        padding: "4px 8px",
        borderRight: last ? "none" : "1px solid var(--border)",
        borderTop: borderTop ? "1px solid var(--border)" : "none",
      }}
    >
      <div style={{ fontFamily: FONT, fontSize: "8px", fontWeight: "var(--font-weight-semibold)" as any, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.45, marginBottom: "1px" }}>
        {label}
      </div>
      <div style={{ fontFamily: FONT, fontSize: "11px", fontWeight: "var(--font-weight-medium)" as any }}>
        {value}
      </div>
    </div>
  );
}

/* ─── Barcode renderer (Code 128-style via canvas) ─── */

function BarcodeCanvas({ value, width, height }: { value: string; width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = "var(--background)";
    ctx.fillRect(0, 0, width, height);

    // Generate a pseudo-barcode pattern from the string
    const fg = getComputedStyle(canvas).color || "#000";
    ctx.fillStyle = fg;

    // Create binary pattern from string
    const bits: number[] = [];
    // Start pattern
    bits.push(1, 1, 0, 1, 0, 1, 1, 0, 0);
    for (const char of value) {
      const code = char.charCodeAt(0);
      for (let b = 7; b >= 0; b--) {
        bits.push((code >> b) & 1);
      }
      bits.push(0); // separator
    }
    // End pattern
    bits.push(1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1);

    const barW = width / bits.length;
    const pad = 4;
    bits.forEach((bit, i) => {
      if (bit) {
        ctx.fillRect(i * barW, pad, barW, height - pad * 2);
      }
    });
  }, [value, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${width}px`, height: `${height}px`, display: "block", margin: "0 auto", color: "var(--foreground)" }}
    />
  );
}

/* ─── QR Code renderer (simple dot-matrix via canvas) ─── */

function QRCodeCanvas({ value, size }: { value: string; size: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const fg = getComputedStyle(canvas).color || "#000";
    const modules = 21; // QR version 1
    const cellSize = size / modules;

    // Background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = fg;

    // Draw finder patterns
    const drawFinder = (x: number, y: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isEdge = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          if (isEdge || isInner) {
            ctx.fillRect((x + c) * cellSize, (y + r) * cellSize, cellSize, cellSize);
          }
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(modules - 7, 0);
    drawFinder(0, modules - 7);

    // Generate pseudo data from the value string
    let seed = 0;
    for (let i = 0; i < value.length; i++) {
      seed = ((seed << 5) - seed + value.charCodeAt(i)) | 0;
    }

    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        // Skip finder pattern areas
        if ((r < 8 && c < 8) || (r < 8 && c > modules - 9) || (r > modules - 9 && c < 8)) continue;

        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        if (seed % 3 === 0) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${size}px`, height: `${size}px`, color: "var(--foreground)", flexShrink: 0 }}
    />
  );
}
