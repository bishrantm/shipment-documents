import React from "react";
import { DocumentHeader } from "./document-header";
import {
  mockShipment,
  INVENTORY_TYPE_LABELS,
  ALLOCATION_STATUS_LABELS,
  type PickLineItem,
  type InventoryAtLocation,
  type InventorySerial,
  type LotGroup,
  type AllocationStatus,
  type InventoryType,
} from "./shipment-data";
import {
  pageStyle,
  FONT,
  sectionHeaderStyle,
  signatureLineStyle,
  signatureLabelStyle,
} from "./doc-styles";

/* ── Reusable font-weight vars ── */
const FW_SEMI = "var(--font-weight-semibold)" as any;
const FW_MED = "var(--font-weight-medium)" as any;
const FW_NORMAL = "var(--font-weight-normal)" as any;

/* ═══════════════════════════════════════════════════════════
   PICK LIST  (main export)
   ═══════════════════════════════════════════════════════════ */

export function PickingList() {
  const s = mockShipment;

  return (
    <div style={pageStyle} className="mx-auto">
      <DocumentHeader
        documentType="Pick List"
        documentNumber={s.shipmentNumber}
        fields={[
          [
            { label: "Shipment #", value: s.shipmentNumber },
            { label: "Order #", value: s.orderNumber },
            { label: "Customer", value: s.customerName },
            { label: "Date", value: s.shipDate },
          ],
          [
            { label: "Assigned Picker", value: s.pickerName },
            { label: "Warehouse", value: s.warehouse },
            { label: "Requested Date", value: s.requestedDate, highlight: true },
            { label: "Status", value: s.status },
          ],
        ]}
      />

      {/* ── SUMMARY TABLE ── */}
      <SectionTitle>Line Items</SectionTitle>
      <table style={tblBase}>
        <thead>
          <tr>
            <Th w="24px" center>#</Th>
            <Th w="34px" center>Img</Th>
            <Th w="98px">Part Number</Th>
            <Th>Description</Th>
            <Th w="60px" center>Qty</Th>
            <Th w="110px" center>Inv. Type</Th>
            <Th w="115px" center last>Alloc. Status</Th>
          </tr>
        </thead>
        <tbody>
          {s.pickLineItems.map((item) => (
            <tr key={item.lineNo}>
              <Td center>{item.lineNo}</Td>
              <Td center>
                <img
                  src={item.thumbnail}
                  alt={item.partNumber}
                  style={{
                    width: "24px",
                    height: "24px",
                    objectFit: "cover",
                    borderRadius: "3px",
                    border: "1px solid var(--border)",
                  }}
                />
              </Td>
              <Td medium primary>{item.partNumber}</Td>
              <Td>{item.description}</Td>
              <Td center semibold>{item.totalQtyToPick} {item.uom}</Td>
              <Td center><InvTypeBadge type={item.inventoryType} /></Td>
              <Td center last>
                <StatusBadge status={item.allocationStatus} allocated={item.allocatedQty} total={item.totalQtyToPick} />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── DETAIL BLOCKS ── */}
      <div style={{ marginTop: "20px" }}>
        <SectionTitle>Pick Allocation Details</SectionTitle>
      </div>

      {s.pickLineItems.map((item) => (
        <LineItemBlock key={item.lineNo} item={item} />
      ))}

      {/* ── TOTALS ── */}
      <div style={{ border: "1px solid var(--border)", borderRadius: "calc(var(--radius) - 4px)", overflow: "hidden", marginTop: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          <SummaryCell label="Total Lines" value={String(s.pickLineItems.length)} />
          <SummaryCell label="Total Units" value={String(s.pickLineItems.reduce((a, l) => a + l.totalQtyToPick, 0))} />
          <SummaryCell label="Total Allocated" value={String(s.pickLineItems.reduce((a, l) => a + l.allocatedQty, 0))} />
          <SummaryCell label="Est. Weight (lbs)" value={String(s.totalWeight)} last />
        </div>
      </div>

      {/* ── SIGNATURES ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginTop: "32px" }}>
        <div>
          <div style={signatureLineStyle} />
          <div style={signatureLabelStyle}>Picker Signature / Date</div>
        </div>
        <div>
          <div style={signatureLineStyle} />
          <div style={signatureLabelStyle}>Verified By / Date</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LINE ITEM BLOCK
   ═══════════════════════════════════════════════════════════ */

function LineItemBlock({ item }: { item: PickLineItem }) {
  const isSerialized = item.inventoryType === "serialized" || item.inventoryType === "lot-serialized";
  const isLot = item.inventoryType === "lot-serialized" || item.inventoryType === "lot-nonserialized";

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "calc(var(--radius) - 4px)", overflow: "hidden", marginBottom: "12px" }}>
      {/* ── Header bar ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: "6px", padding: "5px 10px",
        backgroundColor: "var(--secondary)", borderBottom: "1px solid var(--border)",
        fontFamily: FONT, fontSize: "11px", color: "var(--foreground)",
      }}>
        <img src={item.thumbnail} alt={item.partNumber} style={{ width: "20px", height: "20px", objectFit: "cover", borderRadius: "3px", border: "1px solid var(--border)" }} />
        <span style={{ fontFamily: FONT, fontWeight: FW_SEMI, opacity: 0.5, fontSize: "10px" }}>Line {item.lineNo}</span>
        <span style={{ fontFamily: FONT, fontWeight: FW_SEMI, color: "var(--primary)" }}>{item.partNumber}</span>
        <span style={{ fontFamily: FONT, fontWeight: FW_NORMAL, opacity: 0.65, flex: 1 }}>{item.description}</span>
        <InvTypeBadge type={item.inventoryType} />
        <StatusBadge status={item.allocationStatus} allocated={item.allocatedQty} total={item.totalQtyToPick} />
        <span style={{ fontFamily: FONT, fontWeight: FW_SEMI, whiteSpace: "nowrap" }}>{item.totalQtyToPick} {item.uom}</span>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "8px 10px" }}>
        {isLot ? (
          <LotBody lotGroups={item.lotGroups || []} serialized={isSerialized} uom={item.uom} emptyRows={item.emptyPickRows} />
        ) : (
          <FlatBody locations={item.locations || []} serialized={isSerialized} uom={item.uom} emptyRows={item.emptyPickRows} />
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LOT BODY  (lot-serialized / lot-nonserialized)
   ═══════════════════════════════════════════════════════════ */

function LotBody({ lotGroups, serialized, uom, emptyRows }: { lotGroups: LotGroup[]; serialized: boolean; uom: string; emptyRows: number }) {
  const allocatedLots = lotGroups.filter((l) => l.allocated);
  const unallocatedLots = lotGroups.filter((l) => !l.allocated);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* Allocated lots first */}
      {allocatedLots.map((lot) => (
        <div key={lot.id} style={lotCard}>
          <div style={lotHeader}>
            <Micro>Lot</Micro>
            <span style={{ fontFamily: FONT, fontSize: "11px", fontWeight: FW_SEMI, color: "var(--foreground)", letterSpacing: "0.02em" }}>{lot.lotNumber}</span>
            <span style={allocatedPill}>Allocated</span>
          </div>
          <div style={{ padding: "6px 8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {lot.locations.map((loc) => (
              <LocationCard key={loc.id} loc={loc} serialized={serialized} uom={uom} />
            ))}
          </div>
        </div>
      ))}

      {/* Unallocated lots — available for picker reference */}
      {unallocatedLots.length > 0 && (
        <div>
          <div style={{ fontFamily: FONT, fontSize: "8px", fontWeight: FW_SEMI, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--foreground)", opacity: 0.35, marginBottom: "4px" }}>
            Other available lots (not allocated)
          </div>
          {unallocatedLots.map((lot) => (
            <div key={lot.id} style={{ ...lotCard, opacity: 0.6, marginBottom: "6px" }}>
              <div style={lotHeader}>
                <Micro>Lot</Micro>
                <span style={{ fontFamily: FONT, fontSize: "11px", fontWeight: FW_MED, color: "var(--foreground)", letterSpacing: "0.02em" }}>{lot.lotNumber}</span>
              </div>
              <div style={{ padding: "6px 8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {lot.locations.map((loc) => (
                  <LocationCard key={loc.id} loc={loc} serialized={serialized} uom={uom} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blank rows */}
      {emptyRows > 0 && <BlankRows count={emptyRows} serialized={serialized} showLot />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FLAT BODY  (serialized / nonserialized — no lot)
   ═══════════════════════════════════════════════════════════ */

function FlatBody({ locations, serialized, uom, emptyRows }: { locations: InventoryAtLocation[]; serialized: boolean; uom: string; emptyRows: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {locations.map((loc) => (
        <LocationCard key={loc.id} loc={loc} serialized={serialized} uom={uom} />
      ))}
      {emptyRows > 0 && <BlankRows count={emptyRows} serialized={serialized} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LOCATION CARD
   Shows ALL inventory at a location.
   For serialized: allocated serials (highlighted) + available serials (dimmed)
   For qty: on-hand qty + allocated qty
   ═══════════════════════════════════════════════════════════ */

function LocationCard({ loc, serialized, uom }: { loc: InventoryAtLocation; serialized: boolean; uom: string }) {
  if (serialized && loc.serials) {
    return <SerializedLocationCard loc={loc} />;
  }
  return <QtyLocationCard loc={loc} uom={uom} />;
}

/* ── Serialized location card ── */

function SerializedLocationCard({ loc }: { loc: InventoryAtLocation }) {
  const serials = loc.serials || [];
  const allocated = serials.filter((s) => s.status === "allocated");
  const available = serials.filter((s) => s.status === "available");

  return (
    <div style={locCard}>
      {/* Location header */}
      <div style={locHeader}>
        <Micro>Location</Micro>
        <span style={locCode}>{loc.location}</span>
        <span style={{ fontFamily: FONT, fontSize: "9px", fontWeight: FW_NORMAL, color: "var(--foreground)", opacity: 0.4, marginLeft: "auto" }}>
          {serials.length} total &middot; {allocated.length} allocated &middot; {available.length} available
        </span>
      </div>

      <div style={{ padding: "4px 8px 6px" }}>
        {/* ALLOCATED section */}
        {allocated.length > 0 && (
          <div style={{ marginBottom: available.length > 0 ? "8px" : "0" }}>
            <div style={sectionLabelAllocated}>
              <span style={dotAllocated} />
              Allocated to this shipment ({allocated.length})
            </div>
            {allocated.map((s) => (
              <div key={s.id} style={serialRowAlloc}>
                <CBox />
                <span style={{ fontFamily: FONT, fontSize: "10.5px", fontWeight: FW_MED, color: "var(--foreground)", letterSpacing: "0.02em", minWidth: "110px" }}>
                  {s.serialNumber}
                </span>
                <span style={fieldLabel}>Picked:</span>
                <FillLine />
              </div>
            ))}
          </div>
        )}

        {/* AVAILABLE section */}
        {available.length > 0 && (
          <div>
            <div style={sectionLabelAvailable}>
              Available ({available.length})
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
              {available.map((s) => (
                <span key={s.id} style={availSerialPill}>
                  {s.serialNumber}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Qty-based location card ── */

function QtyLocationCard({ loc, uom }: { loc: InventoryAtLocation; uom: string }) {
  const onHand = loc.onHandQty ?? 0;
  const allocated = loc.allocatedQty ?? 0;

  return (
    <div style={locCard}>
      <div style={{ ...locHeader, padding: "5px 10px" }}>
        <Micro>Location</Micro>
        <span style={locCode}>{loc.location}</span>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontFamily: FONT, fontSize: "10px", fontWeight: FW_NORMAL, color: "var(--foreground)", opacity: 0.5 }}>
            On Hand: <strong>{onHand}</strong>
          </span>
          {allocated > 0 && (
            <span style={{ fontFamily: FONT, fontSize: "10px", fontWeight: FW_MED, color: "var(--accent)" }}>
              Allocated: <strong>{allocated} {uom}</strong>
            </span>
          )}
          <span style={fieldLabel}>Picked:</span>
          <FillLine short />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BLANK ROWS  (for manual floor additions)
   ═══════════════════════════════════════════════════════════ */

function BlankRows({ count, serialized, showLot }: { count: number; serialized: boolean; showLot?: boolean }) {
  return (
    <div style={{ marginTop: "2px" }}>
      <div style={{ fontFamily: FONT, fontSize: "8px", fontWeight: FW_SEMI, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--foreground)", opacity: 0.35, marginBottom: "4px" }}>
        Additional picks (fill in)
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={blankRow}>
            {showLot && (<><Micro>Lot</Micro><FillLine short /></>)}
            <Micro>Location</Micro>
            <FillLine short />
            {serialized
              ? (<><Micro>Serial</Micro><FillLine /><span style={fieldLabel}>Picked:</span><FillLine short /></>)
              : (<><span style={fieldLabel}>Picked:</span><FillLine short /></>)
            }
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHARED ATOMS
   All use Inter via FONT constant — zero monospace fonts.
   ═══════════════════════════════════════════════════════════ */

const tblBase: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontFamily: FONT, fontSize: "11px" };

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: FONT, fontSize: "12px", fontWeight: FW_SEMI, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--foreground)", borderBottom: "2px solid var(--foreground)", paddingBottom: "3px", marginBottom: "10px" }}>
      {children}
    </div>
  );
}

/* ── Lot card ── */
const lotCard: React.CSSProperties = { border: "1px solid var(--border)", borderRadius: "calc(var(--radius) - 4px)", overflow: "hidden" };
const lotHeader: React.CSSProperties = { display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px", backgroundColor: "var(--secondary)", borderBottom: "1px solid var(--border)" };
const allocatedPill: React.CSSProperties = { fontFamily: FONT, fontSize: "8px", fontWeight: FW_SEMI, textTransform: "uppercase", letterSpacing: "0.04em", padding: "1px 5px", borderRadius: "3px", backgroundColor: "var(--accent)", color: "var(--accent-foreground)" };

/* ── Location card ── */
const locCard: React.CSSProperties = { border: "1px solid var(--border)", borderRadius: "calc(var(--radius) - 6px)", overflow: "hidden" };
const locHeader: React.CSSProperties = { display: "flex", alignItems: "center", gap: "6px", padding: "3px 10px", backgroundColor: "var(--background)", borderBottom: "1px solid var(--border)" };
const locCode: React.CSSProperties = { fontFamily: FONT, fontSize: "11px", fontWeight: FW_MED, color: "var(--primary)", letterSpacing: "0.02em" };

/* ── Section labels inside serialized location ── */
const sectionLabelAllocated: React.CSSProperties = { fontFamily: FONT, fontSize: "8px", fontWeight: FW_SEMI, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--accent)", display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" };
const dotAllocated: React.CSSProperties = { width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "var(--accent)", flexShrink: 0 };
const sectionLabelAvailable: React.CSSProperties = { fontFamily: FONT, fontSize: "8px", fontWeight: FW_SEMI, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--foreground)", opacity: 0.35, marginBottom: "3px" };

/* ── Serial rows ── */
const serialRowAlloc: React.CSSProperties = { display: "flex", alignItems: "center", gap: "6px", padding: "2px 0", borderBottom: "1px solid var(--border)", minHeight: "20px" };
const availSerialPill: React.CSSProperties = { fontFamily: FONT, fontSize: "9px", fontWeight: FW_NORMAL, padding: "1px 6px", borderRadius: "3px", backgroundColor: "var(--secondary)", border: "1px solid var(--border)", color: "var(--foreground)", opacity: 0.55 };

/* ── Field label + fill line ── */
const fieldLabel: React.CSSProperties = { fontFamily: FONT, fontSize: "10px", fontWeight: FW_MED, color: "var(--foreground)", opacity: 0.5, whiteSpace: "nowrap" };

function FillLine({ short }: { short?: boolean } = {}) {
  return <div style={{ width: short ? "72px" : undefined, flex: short ? undefined : 1, height: "15px", borderBottom: "1px solid var(--muted-foreground)", opacity: 0.3, flexShrink: 0 }} />;
}

/* ── Blank row ── */
const blankRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: "6px", padding: "3px 8px", border: "1px dashed var(--border)", borderRadius: "calc(var(--radius) - 6px)", minHeight: "24px" };

/* ── Checkbox ── */
function CBox({ light }: { light?: boolean } = {}) {
  return <div style={{ width: "11px", height: "11px", border: `1.5px solid ${light ? "var(--border)" : "var(--foreground)"}`, borderRadius: "2px", flexShrink: 0, opacity: light ? 0.45 : 0.65 }} />;
}

/* ── Micro label ── */
function Micro({ children }: { children: React.ReactNode }) {
  return <span style={{ fontFamily: FONT, fontSize: "8px", fontWeight: FW_SEMI, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--foreground)", opacity: 0.4, whiteSpace: "nowrap" }}>{children}</span>;
}

/* ── Table cells ── */
function Th({ children, w, center, last }: { children: React.ReactNode; w?: string; center?: boolean; last?: boolean }) {
  return (
    <th style={{ fontFamily: FONT, fontSize: "9px", fontWeight: FW_SEMI, textTransform: "uppercase", letterSpacing: "0.06em", padding: "4px 6px", textAlign: center ? "center" : "left", backgroundColor: "var(--secondary)", color: "var(--foreground)", borderBottom: "1px solid var(--border)", borderRight: last ? "none" : "1px solid var(--border)", width: w, whiteSpace: "nowrap" }}>
      {children}
    </th>
  );
}

function Td({ children, center, last, medium, semibold, primary }: { children?: React.ReactNode; center?: boolean; last?: boolean; medium?: boolean; semibold?: boolean; primary?: boolean }) {
  return (
    <td style={{ fontFamily: FONT, fontSize: "11px", fontWeight: semibold ? FW_SEMI : medium ? FW_MED : FW_NORMAL, padding: "4px 6px", textAlign: center ? "center" : "left", borderBottom: "1px solid var(--border)", borderRight: last ? "none" : "1px solid var(--border)", color: primary ? "var(--primary)" : "var(--foreground)", verticalAlign: "middle" }}>
      {children}
    </td>
  );
}

/* ── Badges ── */

function InvTypeBadge({ type }: { type: InventoryType }) {
  const c: Record<InventoryType, string> = {
    "lot-serialized": "var(--chart-4)",
    "serialized": "var(--primary)",
    "lot-nonserialized": "var(--chart-3)",
    "nonserialized": "var(--foreground)",
  };
  return (
    <span style={{ fontFamily: FONT, fontSize: "8px", fontWeight: FW_SEMI, textTransform: "uppercase", letterSpacing: "0.04em", padding: "1px 5px", borderRadius: "3px", border: `1px solid ${c[type]}`, backgroundColor: "var(--background)", color: c[type], whiteSpace: "nowrap", opacity: 0.85 }}>
      {INVENTORY_TYPE_LABELS[type]}
    </span>
  );
}

function StatusBadge({ status, allocated, total }: { status: AllocationStatus; allocated: number; total: number }) {
  const c: Record<AllocationStatus, string> = {
    "fully-allocated": "var(--accent)",
    "partially-allocated": "var(--chart-3)",
    "not-allocated": "var(--destructive)",
  };
  return (
    <span style={{ fontFamily: FONT, fontSize: "8px", fontWeight: FW_SEMI, textTransform: "uppercase", letterSpacing: "0.04em", padding: "1px 5px", borderRadius: "3px", backgroundColor: c[status], color: "#fff", whiteSpace: "nowrap" }}>
      {ALLOCATION_STATUS_LABELS[status]}
      {status === "partially-allocated" && <span style={{ opacity: 0.8 }}> ({allocated}/{total})</span>}
    </span>
  );
}

/* ── Summary cell ── */
function SummaryCell({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ padding: "6px 10px", borderRight: last ? "none" : "1px solid var(--border)" }}>
      <div style={sectionHeaderStyle}>{label}</div>
      <div style={{ fontFamily: FONT, fontSize: "13px", fontWeight: FW_SEMI }}>{value}</div>
    </div>
  );
}
