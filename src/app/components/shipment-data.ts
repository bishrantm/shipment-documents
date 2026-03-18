// Shared shipment mock data used across all four document types
//
// INVENTORY TYPES:
//   "lot-serialized"    → tracked by Lot AND Serial
//   "serialized"        → tracked by Serial only (no lot)
//   "lot-nonserialized" → tracked by Lot, qty-based (no serial)
//   "nonserialized"     → no lot, no serial, pure qty-based
//
// SERIAL AVAILABILITY at a location:
//   "allocated"  → reserved for THIS shipment — picker should pick these
//   "available"  → free inventory, not allocated to any shipment
//   (Serials allocated to OTHER shipments are simply excluded from the list)

export type InventoryType =
  | "lot-serialized"
  | "serialized"
  | "lot-nonserialized"
  | "nonserialized";

export type AllocationStatus =
  | "fully-allocated"
  | "partially-allocated"
  | "not-allocated";

// ─── Serial unit at a location ───

export interface InventorySerial {
  id: string;
  serialNumber: string;
  /** "allocated" = reserved for THIS shipment. "available" = free, not allocated to anything. */
  status: "allocated" | "available";
}

// ─── Location with inventory ───

export interface InventoryAtLocation {
  id: string;
  location: string;
  /** For serialized items: all serials visible to the picker (allocated + available) */
  serials?: InventorySerial[];
  /** For non-serialized items: total on-hand qty at this location */
  onHandQty?: number;
  /** For non-serialized items: qty allocated to THIS shipment from this location */
  allocatedQty?: number;
}

// ─── Lot group (for lot-serialized and lot-nonserialized) ───

export interface LotGroup {
  id: string;
  lotNumber: string;
  /** true if this lot was allocated to the shipment */
  allocated: boolean;
  locations: InventoryAtLocation[];
}

// ─── Pick line item ───

export interface PickLineItem {
  lineNo: number;
  partNumber: string;
  description: string;
  uom: string;
  totalQtyToPick: number;
  allocatedQty: number;
  inventoryType: InventoryType;
  allocationStatus: AllocationStatus;
  thumbnail: string;

  /**
   * Lot-based items populate lotGroups.
   * Non-lot items populate locations directly.
   */
  lotGroups?: LotGroup[];
  locations?: InventoryAtLocation[];

  emptyPickRows: number;
}

// ─── Flat line items (Packing List, BOL, Label) ───

export interface FlatLineItem {
  lineNo: number;
  sku: string;
  description: string;
  uom: string;
  orderedQty: number;
  pickedQty: number;
  weight: number;
  stagedLocation?: string;
  lots?: string[];
  serials?: string[];
  emptyPackRows: number;
}

// ─── Shipment ───

export interface ShipmentData {
  shipmentNumber: string;
  orderNumber: string;
  poNumber: string;
  status: string;
  shipDate: string;
  requestedDate: string;

  shipperName: string;
  shipFromAddress: string;
  shipFromCityStateZip: string;
  shipFromPhone: string;

  customerName: string;
  shipToAddress: string;
  shipToCityStateZip: string;
  shipToPhone: string;
  shipToContact: string;

  carrier: string;
  shippingMode: string;
  trackingNumber: string;
  serviceLevel: string;

  pickerName: string;
  warehouse: string;

  packageCount: number;
  totalWeight: number;

  specialHandling: string;

  pickLineItems: PickLineItem[];
  flatLineItems: FlatLineItem[];
}

// ─── Thumbnails ───
const T = {
  steelBeam: "https://images.unsplash.com/photo-1632924200740-7c6b2657de8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVlbCUyMGJlYW0lMjBpbmR1c3RyaWFsJTIwd2FyZWhvdXNlfGVufDF8fHx8MTc3Mzc1MTkwMHww&ixlib=rb-4.1.0&q=80&w=1080",
  cable: "https://images.unsplash.com/photo-1635179885954-c778885a1197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwY2FibGUlMjBzcG9vbCUyMGNvcHBlcnxlbnwxfHx8fDE3NzM3NTE5MDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
  bolts: "https://images.unsplash.com/photo-1759064776046-45b988af4b6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhbCUyMGhleCUyMGJvbHRzJTIwaGFyZHdhcmV8ZW58MXx8fHwxNzczNzUxOTAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  hardHat: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGhhcmQlMjBoYXQlMjBzYWZldHklMjBoZWxtZXR8ZW58MXx8fHwxNzczNzUxOTAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  copperPipe: "https://images.unsplash.com/photo-1560883123-04646fef95df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3BwZXIlMjBwaXBlJTIwcGx1bWJpbmclMjBzdXBwbGllc3xlbnwxfHx8fDE3NzM3NTE5MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  drill: "https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGRyaWxsJTIwdG9vbCUyMGNvbnN0cnVjdGlvbnxlbnwxfHx8fDE3NzM2NjM1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  cement: "https://images.unsplash.com/photo-1747103068995-e6db935a922b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jcmV0ZSUyMGJhZ3MlMjBjZW1lbnQlMjBjb25zdHJ1Y3Rpb258ZW58MXx8fHwxNzczNzUxOTAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  vest: "https://images.unsplash.com/photo-1768796372300-9454ec946a23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWZldHklMjB2ZXN0JTIwaGlnaCUyMHZpc2liaWxpdHl8ZW58MXx8fHwxNzczNzUxOTAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  plywood: "https://images.unsplash.com/photo-1692313208723-16476006a5a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBwbHl3b29kJTIwc2hlZXRzJTIwbHVtYmVyfGVufDF8fHx8MTc3Mzc1MTkwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
  ledLight: "https://images.unsplash.com/photo-1711721176205-eb8678885f8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMRUQlMjBmbG9vZCUyMGxpZ2h0JTIwaW5kdXN0cmlhbHxlbnwxfHx8fDE3NzM3NTE5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  pump: "https://images.unsplash.com/photo-1701448149957-b96dbd1926ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoeWRyYXVsaWMlMjBwdW1wJTIwaW5kdXN0cmlhbCUyMG1hY2hpbmV8ZW58MXx8fHwxNzczNzUxOTA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  pipeFitting: "https://images.unsplash.com/photo-1590239481209-b99e795df500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMHBpcGUlMjBmaXR0aW5nfGVufDF8fHx8MTc3Mzc1MTkwNHww&ixlib=rb-4.1.0&q=80&w=1080",
  weldRod: "https://images.unsplash.com/photo-1575305842946-0e807ce6f3fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxkaW5nJTIwcm9kJTIwZWxlY3Ryb2RlJTIwaW5kdXN0cmlhbHxlbnwxfHx8fDE3NzM3NTA3MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  gasket: "https://images.unsplash.com/photo-1758873263527-ca53b938fbd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydWJiZXIlMjBnYXNrZXQlMjBzZWFsJTIwaW5kdXN0cmlhbHxlbnwxfHx8fDE3NzM3NTE5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  hoist: "https://images.unsplash.com/photo-1654826710721-1204eda66762?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFpbiUyMGhvaXN0JTIwbGlmdGluZyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzM3NTE5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
};

// ═══════════════════════════════════════════════════════════
//  MOCK SHIPMENT
// ═══════════════════════════════════════════════════════════

export const mockShipment: ShipmentData = {
  shipmentNumber: "SHP-2026-00312",
  orderNumber: "SO-2026-00847",
  poNumber: "PO-BR-40291",
  status: "Ready to Pick",
  shipDate: "March 17, 2026",
  requestedDate: "March 19, 2026",

  shipperName: "Omnesoft Warehouse Inc.",
  shipFromAddress: "1234 Industrial Blvd, Suite 100",
  shipFromCityStateZip: "Houston, TX 77001",
  shipFromPhone: "(713) 555-0142",

  customerName: "BuildRight Construction",
  shipToAddress: "8900 Commerce Park Dr",
  shipToCityStateZip: "Dallas, TX 75247",
  shipToPhone: "(214) 555-0388",
  shipToContact: "James Hartley",

  carrier: "XPO Logistics",
  shippingMode: "LTL Freight",
  trackingNumber: "XPO-7742891056",
  serviceLevel: "Standard",

  pickerName: "Marcus Johnson",
  warehouse: "Main Warehouse - A",

  packageCount: 6,
  totalWeight: 4620,

  specialHandling:
    "Forklift required at delivery. Do not stack pallets. Notify consignee 1 hour before arrival.",

  // ═══════════════════════════════════════════════════════════
  //  PICK LINE ITEMS
  // ═══════════════════════════════════════════════════════════
  pickLineItems: [

    // ──────────────────────────────────────────────
    //  1–3: LOT SERIALIZED
    //  Allocated lots → locations of that lot → allocated + available serials
    // ──────────────────────────────────────────────

    {
      lineNo: 1,
      partNumber: "ELC-CBL-10AWG",
      description: "10 AWG Electrical Cable - 500ft Spool",
      uom: "SPOOL",
      totalQtyToPick: 6,
      allocatedQty: 6,
      inventoryType: "lot-serialized",
      allocationStatus: "fully-allocated",
      thumbnail: T.cable,
      lotGroups: [
        {
          id: "lg1", lotNumber: "LOT-2026-300", allocated: true,
          locations: [
            {
              id: "l1a", location: "D-03-01-A",
              serials: [
                { id: "s1", serialNumber: "SN-90001", status: "allocated" },
                { id: "s2", serialNumber: "SN-90002", status: "allocated" },
                { id: "s3", serialNumber: "SN-90003", status: "allocated" },
                { id: "s4x", serialNumber: "SN-90004", status: "available" },
                { id: "s5x", serialNumber: "SN-90005", status: "available" },
              ],
            },
            {
              id: "l1a2", location: "D-03-01-B",
              serials: [
                { id: "s5y", serialNumber: "SN-90006", status: "available" },
                { id: "s5z", serialNumber: "SN-90007", status: "available" },
              ],
            },
          ],
        },
        {
          id: "lg2", lotNumber: "LOT-2026-305", allocated: true,
          locations: [
            {
              id: "l1b", location: "D-03-02-B",
              serials: [
                { id: "s4", serialNumber: "SN-90015", status: "allocated" },
                { id: "s5", serialNumber: "SN-90016", status: "allocated" },
                { id: "s6x", serialNumber: "SN-90017", status: "available" },
              ],
            },
          ],
        },
        {
          id: "lg3", lotNumber: "LOT-2026-308", allocated: true,
          locations: [
            {
              id: "l1c", location: "D-03-02-B",
              serials: [
                { id: "s6", serialNumber: "SN-90020", status: "allocated" },
                { id: "s7x", serialNumber: "SN-90021", status: "available" },
                { id: "s8x", serialNumber: "SN-90022", status: "available" },
              ],
            },
          ],
        },
      ],
      emptyPickRows: 2,
    },

    {
      lineNo: 2,
      partNumber: "HYD-PMP-3200",
      description: "Hydraulic Pump Assembly - 3200 PSI",
      uom: "EA",
      totalQtyToPick: 3,
      allocatedQty: 3,
      inventoryType: "lot-serialized",
      allocationStatus: "fully-allocated",
      thumbnail: T.pump,
      lotGroups: [
        {
          id: "lg4", lotNumber: "LOT-2026-410", allocated: true,
          locations: [
            {
              id: "l2a", location: "F-01-02-A",
              serials: [
                { id: "s7", serialNumber: "HYD-SN-7001", status: "allocated" },
                { id: "s8", serialNumber: "HYD-SN-7002", status: "allocated" },
                { id: "s8a", serialNumber: "HYD-SN-7003", status: "available" },
                { id: "s8b", serialNumber: "HYD-SN-7004", status: "available" },
              ],
            },
          ],
        },
        {
          id: "lg5", lotNumber: "LOT-2026-412", allocated: true,
          locations: [
            {
              id: "l2b", location: "F-01-03-C",
              serials: [
                { id: "s9", serialNumber: "HYD-SN-7010", status: "allocated" },
                { id: "s9a", serialNumber: "HYD-SN-7011", status: "available" },
              ],
            },
          ],
        },
      ],
      emptyPickRows: 2,
    },

    {
      lineNo: 3,
      partNumber: "LED-FLD-200W",
      description: "LED Flood Light - 200W Industrial Grade",
      uom: "EA",
      totalQtyToPick: 8,
      allocatedQty: 5,
      inventoryType: "lot-serialized",
      allocationStatus: "partially-allocated",
      thumbnail: T.ledLight,
      lotGroups: [
        {
          id: "lg6", lotNumber: "LOT-2026-550", allocated: true,
          locations: [
            {
              id: "l3a", location: "G-02-01-A",
              serials: [
                { id: "s10", serialNumber: "LED-SN-4401", status: "allocated" },
                { id: "s11", serialNumber: "LED-SN-4402", status: "allocated" },
                { id: "s12", serialNumber: "LED-SN-4403", status: "allocated" },
                { id: "s12a", serialNumber: "LED-SN-4404", status: "available" },
                { id: "s12b", serialNumber: "LED-SN-4405", status: "available" },
              ],
            },
          ],
        },
        {
          id: "lg7", lotNumber: "LOT-2026-552", allocated: true,
          locations: [
            {
              id: "l3b", location: "G-02-01-B",
              serials: [
                { id: "s13", serialNumber: "LED-SN-4410", status: "allocated" },
                { id: "s14", serialNumber: "LED-SN-4411", status: "allocated" },
                { id: "s14a", serialNumber: "LED-SN-4412", status: "available" },
                { id: "s14b", serialNumber: "LED-SN-4413", status: "available" },
              ],
            },
            {
              id: "l3c", location: "G-02-02-A",
              serials: [
                { id: "s14c", serialNumber: "LED-SN-4420", status: "available" },
                { id: "s14d", serialNumber: "LED-SN-4421", status: "available" },
                { id: "s14e", serialNumber: "LED-SN-4422", status: "available" },
              ],
            },
          ],
        },
        {
          id: "lg8", lotNumber: "LOT-2026-554", allocated: false,
          locations: [
            {
              id: "l3d", location: "G-02-03-A",
              serials: [
                { id: "s14f", serialNumber: "LED-SN-4430", status: "available" },
                { id: "s14g", serialNumber: "LED-SN-4431", status: "available" },
                { id: "s14h", serialNumber: "LED-SN-4432", status: "available" },
                { id: "s14i", serialNumber: "LED-SN-4433", status: "available" },
              ],
            },
          ],
        },
      ],
      emptyPickRows: 3,
    },

    // ──────────────────────────────────────────────
    //  4–6: SERIALIZED (no lot)
    //  Location → allocated + available serials
    // ──────────────────────────────────────────────

    {
      lineNo: 4,
      partNumber: "PWR-DRL-18V",
      description: "Cordless Power Drill - 18V Lithium",
      uom: "EA",
      totalQtyToPick: 5,
      allocatedQty: 5,
      inventoryType: "serialized",
      allocationStatus: "fully-allocated",
      thumbnail: T.drill,
      locations: [
        {
          id: "l4a", location: "H-04-01-A",
          serials: [
            { id: "s15", serialNumber: "DRL-SN-0501", status: "allocated" },
            { id: "s16", serialNumber: "DRL-SN-0502", status: "allocated" },
            { id: "s17", serialNumber: "DRL-SN-0503", status: "allocated" },
            { id: "s17a", serialNumber: "DRL-SN-0504", status: "available" },
            { id: "s17b", serialNumber: "DRL-SN-0505", status: "available" },
          ],
        },
        {
          id: "l4b", location: "H-04-02-B",
          serials: [
            { id: "s18", serialNumber: "DRL-SN-0510", status: "allocated" },
            { id: "s19", serialNumber: "DRL-SN-0511", status: "allocated" },
            { id: "s19a", serialNumber: "DRL-SN-0512", status: "available" },
          ],
        },
      ],
      emptyPickRows: 2,
    },

    {
      lineNo: 5,
      partNumber: "CHN-HST-2T",
      description: "Chain Hoist - 2 Ton Capacity",
      uom: "EA",
      totalQtyToPick: 3,
      allocatedQty: 2,
      inventoryType: "serialized",
      allocationStatus: "partially-allocated",
      thumbnail: T.hoist,
      locations: [
        {
          id: "l5a", location: "J-01-01-A",
          serials: [
            { id: "s20", serialNumber: "HST-SN-1101", status: "allocated" },
            { id: "s21", serialNumber: "HST-SN-1102", status: "allocated" },
            { id: "s21a", serialNumber: "HST-SN-1103", status: "available" },
            { id: "s21b", serialNumber: "HST-SN-1104", status: "available" },
          ],
        },
        {
          id: "l5b", location: "J-01-02-B",
          serials: [
            { id: "s21c", serialNumber: "HST-SN-1110", status: "available" },
            { id: "s21d", serialNumber: "HST-SN-1111", status: "available" },
          ],
        },
      ],
      emptyPickRows: 2,
    },

    {
      lineNo: 6,
      partNumber: "PPF-FTG-4IN",
      description: "Stainless Steel Pipe Fitting - 4in Elbow",
      uom: "EA",
      totalQtyToPick: 10,
      allocatedQty: 10,
      inventoryType: "serialized",
      allocationStatus: "fully-allocated",
      thumbnail: T.pipeFitting,
      locations: [
        {
          id: "l6a", location: "K-02-03-A",
          serials: [
            { id: "s22", serialNumber: "FTG-SN-2001", status: "allocated" },
            { id: "s23", serialNumber: "FTG-SN-2002", status: "allocated" },
            { id: "s24", serialNumber: "FTG-SN-2003", status: "allocated" },
            { id: "s25", serialNumber: "FTG-SN-2004", status: "allocated" },
            { id: "s26", serialNumber: "FTG-SN-2005", status: "allocated" },
            { id: "s26a", serialNumber: "FTG-SN-2006", status: "available" },
            { id: "s26b", serialNumber: "FTG-SN-2007", status: "available" },
          ],
        },
        {
          id: "l6b", location: "K-02-03-B",
          serials: [
            { id: "s27", serialNumber: "FTG-SN-2010", status: "allocated" },
            { id: "s28", serialNumber: "FTG-SN-2011", status: "allocated" },
            { id: "s29", serialNumber: "FTG-SN-2012", status: "allocated" },
            { id: "s30", serialNumber: "FTG-SN-2013", status: "allocated" },
            { id: "s31", serialNumber: "FTG-SN-2014", status: "allocated" },
            { id: "s31a", serialNumber: "FTG-SN-2015", status: "available" },
          ],
        },
      ],
      emptyPickRows: 2,
    },

    // ──────────────────────────────────────────────
    //  7–9: LOT NON-SERIALIZED
    //  Lot → locations → on-hand / allocated qty
    // ──────────────────────────────────────────────

    {
      lineNo: 7,
      partNumber: "MTL-STL-4020",
      description: "Steel Beam - 40ft x 20in I-Beam",
      uom: "EA",
      totalQtyToPick: 12,
      allocatedQty: 12,
      inventoryType: "lot-nonserialized",
      allocationStatus: "fully-allocated",
      thumbnail: T.steelBeam,
      lotGroups: [
        {
          id: "lq1", lotNumber: "LOT-2026-114", allocated: true,
          locations: [
            { id: "lql1", location: "A-01-03-B", onHandQty: 10, allocatedQty: 5 },
            { id: "lql2", location: "A-01-04-A", onHandQty: 6, allocatedQty: 0 },
          ],
        },
        {
          id: "lq2", lotNumber: "LOT-2026-118", allocated: true,
          locations: [
            { id: "lql3", location: "A-01-03-B", onHandQty: 8, allocatedQty: 4 },
            { id: "lql4", location: "B-02-01-A", onHandQty: 3, allocatedQty: 0 },
          ],
        },
        {
          id: "lq3", lotNumber: "LOT-2026-122", allocated: true,
          locations: [
            { id: "lql5", location: "B-02-01-C", onHandQty: 5, allocatedQty: 3 },
          ],
        },
      ],
      emptyPickRows: 2,
    },

    {
      lineNo: 8,
      partNumber: "HDW-BLT-M16",
      description: "M16 Hex Bolt - Grade 8.8 (Box of 50)",
      uom: "BOX",
      totalQtyToPick: 8,
      allocatedQty: 8,
      inventoryType: "lot-nonserialized",
      allocationStatus: "fully-allocated",
      thumbnail: T.bolts,
      lotGroups: [
        {
          id: "lq4", lotNumber: "LOT-2026-201", allocated: true,
          locations: [
            { id: "lql6", location: "C-05-02-A", onHandQty: 12, allocatedQty: 5 },
            { id: "lql7", location: "C-05-03-A", onHandQty: 4, allocatedQty: 0 },
          ],
        },
        {
          id: "lq5", lotNumber: "LOT-2026-203", allocated: true,
          locations: [
            { id: "lql8", location: "C-05-02-B", onHandQty: 6, allocatedQty: 3 },
          ],
        },
      ],
      emptyPickRows: 2,
    },

    {
      lineNo: 9,
      partNumber: "WLD-ROD-E7018",
      description: "Welding Electrode E7018 - 5kg Pack",
      uom: "PACK",
      totalQtyToPick: 15,
      allocatedQty: 10,
      inventoryType: "lot-nonserialized",
      allocationStatus: "partially-allocated",
      thumbnail: T.weldRod,
      lotGroups: [
        {
          id: "lq6", lotNumber: "LOT-2026-601", allocated: true,
          locations: [
            { id: "lql9", location: "L-01-01-A", onHandQty: 14, allocatedQty: 6 },
            { id: "lql10", location: "L-01-02-A", onHandQty: 5, allocatedQty: 0 },
          ],
        },
        {
          id: "lq7", lotNumber: "LOT-2026-605", allocated: true,
          locations: [
            { id: "lql11", location: "L-01-01-A", onHandQty: 8, allocatedQty: 4 },
          ],
        },
        {
          id: "lq8", lotNumber: "LOT-2026-610", allocated: false,
          locations: [
            { id: "lql12", location: "L-02-01-A", onHandQty: 10, allocatedQty: 0 },
          ],
        },
      ],
      emptyPickRows: 3,
    },

    // ──────────────────────────────────────────────
    //  10–13: NON-SERIALIZED  (allocated)
    //  Location → on-hand / allocated qty
    // ──────────────────────────────────────────────

    {
      lineNo: 10,
      partNumber: "PPE-HLMT-WHT",
      description: "Hard Hat - ANSI Type II (White)",
      uom: "EA",
      totalQtyToPick: 20,
      allocatedQty: 20,
      inventoryType: "nonserialized",
      allocationStatus: "fully-allocated",
      thumbnail: T.hardHat,
      locations: [
        { id: "la1", location: "E-01-01-A", onHandQty: 25, allocatedQty: 12 },
        { id: "la2", location: "E-01-02-A", onHandQty: 14, allocatedQty: 8 },
        { id: "la3", location: "E-01-03-B", onHandQty: 6, allocatedQty: 0 },
      ],
      emptyPickRows: 2,
    },

    {
      lineNo: 11,
      partNumber: "PPE-VEST-ORG",
      description: "High-Visibility Safety Vest - Orange (L)",
      uom: "EA",
      totalQtyToPick: 30,
      allocatedQty: 30,
      inventoryType: "nonserialized",
      allocationStatus: "fully-allocated",
      thumbnail: T.vest,
      locations: [
        { id: "la4", location: "E-02-01-A", onHandQty: 20, allocatedQty: 15 },
        { id: "la5", location: "E-02-01-B", onHandQty: 22, allocatedQty: 15 },
        { id: "la6", location: "E-02-02-A", onHandQty: 10, allocatedQty: 0 },
      ],
      emptyPickRows: 2,
    },

    {
      lineNo: 12,
      partNumber: "CPR-PPE-1IN",
      description: 'Copper Pipe Type L - 1" x 10ft',
      uom: "EA",
      totalQtyToPick: 25,
      allocatedQty: 18,
      inventoryType: "nonserialized",
      allocationStatus: "partially-allocated",
      thumbnail: T.copperPipe,
      locations: [
        { id: "la7", location: "M-03-01-A", onHandQty: 15, allocatedQty: 10 },
        { id: "la8", location: "M-03-02-B", onHandQty: 12, allocatedQty: 8 },
        { id: "la9", location: "M-03-03-A", onHandQty: 8, allocatedQty: 0 },
      ],
      emptyPickRows: 3,
    },

    {
      lineNo: 13,
      partNumber: "RBR-GSK-6IN",
      description: 'Rubber Gasket Seal - 6" EPDM',
      uom: "EA",
      totalQtyToPick: 40,
      allocatedQty: 40,
      inventoryType: "nonserialized",
      allocationStatus: "fully-allocated",
      thumbnail: T.gasket,
      locations: [
        { id: "la10", location: "N-01-01-A", onHandQty: 30, allocatedQty: 20 },
        { id: "la11", location: "N-01-01-B", onHandQty: 25, allocatedQty: 20 },
      ],
      emptyPickRows: 2,
    },

    // ──────────────────────────────────────────────
    //  14–15: NON-SERIALIZED — NOT ALLOCATED
    //  All locations, nothing allocated
    // ──────────────────────────────────────────────

    {
      lineNo: 14,
      partNumber: "CMT-BAG-50KG",
      description: "Portland Cement - 50kg Bag",
      uom: "BAG",
      totalQtyToPick: 50,
      allocatedQty: 0,
      inventoryType: "nonserialized",
      allocationStatus: "not-allocated",
      thumbnail: T.cement,
      locations: [
        { id: "sys1", location: "P-01-01-A", onHandQty: 30, allocatedQty: 0 },
        { id: "sys2", location: "P-01-02-A", onHandQty: 25, allocatedQty: 0 },
        { id: "sys3", location: "P-02-01-B", onHandQty: 18, allocatedQty: 0 },
      ],
      emptyPickRows: 3,
    },

    {
      lineNo: 15,
      partNumber: "PLY-SHT-18MM",
      description: "Plywood Sheet - 18mm x 4ft x 8ft",
      uom: "SHEET",
      totalQtyToPick: 20,
      allocatedQty: 0,
      inventoryType: "nonserialized",
      allocationStatus: "not-allocated",
      thumbnail: T.plywood,
      locations: [
        { id: "sys4", location: "Q-01-01-A", onHandQty: 12, allocatedQty: 0 },
        { id: "sys5", location: "Q-01-02-A", onHandQty: 15, allocatedQty: 0 },
        { id: "sys6", location: "Q-02-01-B", onHandQty: 8, allocatedQty: 0 },
      ],
      emptyPickRows: 3,
    },
  ],

  // ═══════════════════════════════════════════════════════════
  //  FLAT LINE ITEMS  (Packing List, BOL, Label)
  // ═══════════════════════════════════════════════════════════
  flatLineItems: [
    { lineNo: 1, sku: "ELC-CBL-10AWG", description: "10 AWG Electrical Cable - 500ft Spool", uom: "SPOOL", orderedQty: 6, pickedQty: 6, weight: 35, stagedLocation: "STAGE-B1", lots: ["LOT-2026-300","LOT-2026-305","LOT-2026-308"], serials: ["SN-90001","SN-90002","SN-90003","SN-90015","SN-90016","SN-90020"], emptyPackRows: 2 },
    { lineNo: 2, sku: "HYD-PMP-3200", description: "Hydraulic Pump Assembly - 3200 PSI", uom: "EA", orderedQty: 3, pickedQty: 3, weight: 85, stagedLocation: "STAGE-C1", lots: ["LOT-2026-410","LOT-2026-412"], serials: ["HYD-SN-7001","HYD-SN-7002","HYD-SN-7010"], emptyPackRows: 1 },
    { lineNo: 3, sku: "LED-FLD-200W", description: "LED Flood Light - 200W Industrial Grade", uom: "EA", orderedQty: 8, pickedQty: 5, weight: 4.5, stagedLocation: "STAGE-C2", lots: ["LOT-2026-550","LOT-2026-552"], emptyPackRows: 2 },
    { lineNo: 4, sku: "PWR-DRL-18V", description: "Cordless Power Drill - 18V Lithium", uom: "EA", orderedQty: 5, pickedQty: 5, weight: 3.2, stagedLocation: "STAGE-D1", serials: ["DRL-SN-0501","DRL-SN-0502","DRL-SN-0503","DRL-SN-0510","DRL-SN-0511"], emptyPackRows: 1 },
    { lineNo: 5, sku: "CHN-HST-2T", description: "Chain Hoist - 2 Ton Capacity", uom: "EA", orderedQty: 3, pickedQty: 2, weight: 45, stagedLocation: "STAGE-D2", serials: ["HST-SN-1101","HST-SN-1102"], emptyPackRows: 2 },
    { lineNo: 6, sku: "PPF-FTG-4IN", description: "Stainless Steel Pipe Fitting - 4in Elbow", uom: "EA", orderedQty: 10, pickedQty: 10, weight: 2.8, stagedLocation: "STAGE-E1", serials: ["FTG-SN-2001","FTG-SN-2002","FTG-SN-2003","FTG-SN-2004","FTG-SN-2005","FTG-SN-2010","FTG-SN-2011","FTG-SN-2012","FTG-SN-2013","FTG-SN-2014"], emptyPackRows: 1 },
    { lineNo: 7, sku: "MTL-STL-4020", description: "Steel Beam - 40ft x 20in I-Beam", uom: "EA", orderedQty: 12, pickedQty: 12, weight: 180, stagedLocation: "STAGE-A1", lots: ["LOT-2026-114","LOT-2026-118","LOT-2026-122"], emptyPackRows: 2 },
    { lineNo: 8, sku: "HDW-BLT-M16", description: "M16 Hex Bolt - Grade 8.8 (Box of 50)", uom: "BOX", orderedQty: 8, pickedQty: 8, weight: 12, stagedLocation: "STAGE-A2", lots: ["LOT-2026-201","LOT-2026-203"], emptyPackRows: 2 },
    { lineNo: 9, sku: "WLD-ROD-E7018", description: "Welding Electrode E7018 - 5kg Pack", uom: "PACK", orderedQty: 15, pickedQty: 10, weight: 5, stagedLocation: "STAGE-A3", lots: ["LOT-2026-601","LOT-2026-605"], emptyPackRows: 2 },
    { lineNo: 10, sku: "PPE-HLMT-WHT", description: "Hard Hat - ANSI Type II (White)", uom: "EA", orderedQty: 20, pickedQty: 20, weight: 1.2, stagedLocation: "STAGE-B2", emptyPackRows: 2 },
    { lineNo: 11, sku: "PPE-VEST-ORG", description: "High-Visibility Safety Vest - Orange (L)", uom: "EA", orderedQty: 30, pickedQty: 30, weight: 0.3, stagedLocation: "STAGE-B3", emptyPackRows: 2 },
    { lineNo: 12, sku: "CPR-PPE-1IN", description: 'Copper Pipe Type L - 1" x 10ft', uom: "EA", orderedQty: 25, pickedQty: 18, weight: 4.5, stagedLocation: "STAGE-F1", emptyPackRows: 2 },
    { lineNo: 13, sku: "RBR-GSK-6IN", description: 'Rubber Gasket Seal - 6" EPDM', uom: "EA", orderedQty: 40, pickedQty: 40, weight: 0.2, stagedLocation: "STAGE-F2", emptyPackRows: 2 },
    { lineNo: 14, sku: "CMT-BAG-50KG", description: "Portland Cement - 50kg Bag", uom: "BAG", orderedQty: 50, pickedQty: 0, weight: 110, emptyPackRows: 3 },
    { lineNo: 15, sku: "PLY-SHT-18MM", description: "Plywood Sheet - 18mm x 4ft x 8ft", uom: "SHEET", orderedQty: 20, pickedQty: 0, weight: 28, emptyPackRows: 3 },
  ],
};

// ─── Label Helpers ───

export const INVENTORY_TYPE_LABELS: Record<InventoryType, string> = {
  "lot-serialized": "Lot Serialized",
  "serialized": "Serialized",
  "lot-nonserialized": "Lot Non-Serialized",
  "nonserialized": "Non-Serialized",
};

export const ALLOCATION_STATUS_LABELS: Record<AllocationStatus, string> = {
  "fully-allocated": "Fully Allocated",
  "partially-allocated": "Partially Allocated",
  "not-allocated": "Not Allocated",
};
