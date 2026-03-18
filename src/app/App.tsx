import React, { useState, useRef } from "react";
import { Printer, ClipboardList, Package, Tag, FileText, Eye } from "lucide-react";
import { PickingList } from "./components/picking-list";
import { PackingList } from "./components/packing-list";
import { ShippingLabel } from "./components/shipping-label";
import { BillOfLading } from "./components/bill-of-lading";
import { Button } from "./components/ui/button";

type DocType = "pick" | "pack" | "label" | "bol";

const DOC_TABS: { id: DocType; label: string; icon: React.ReactNode; description: string }[] = [
  { id: "pick", label: "Pick List", icon: <ClipboardList size={14} />, description: "Generated at Release → Ready to Pick" },
  { id: "pack", label: "Packing List", icon: <Package size={14} />, description: "Available from Ready to Pick onwards" },
  { id: "label", label: "Shipping Label", icon: <Tag size={14} />, description: "Generated at Ship Confirmation" },
  { id: "bol", label: "Bill of Lading", icon: <FileText size={14} />, description: "Generated at Execution" },
];

const DOC_TITLES: Record<DocType, string> = {
  pick: "Pick List",
  pack: "Packing List",
  label: "Shipping Label",
  bol: "Bill of Lading",
};

export default function App() {
  const [activeDoc, setActiveDoc] = useState<DocType>("pick");
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const isLabel = activeDoc === "label";
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${DOC_TITLES[activeDoc]} - SHP-2026-00312</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Inter', sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              display: flex;
              justify-content: center;
              padding: ${isLabel ? "0.5in" : "0"};
            }
            @page { size: ${isLabel ? "4in 6in" : "letter"}; margin: ${isLabel ? "0" : "0"}; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  const currentTab = DOC_TABS.find((t) => t.id === activeDoc)!;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--secondary)", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Top toolbar */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-2.5"
        style={{
          backgroundColor: "var(--background)",
          borderBottom: "1px solid var(--border)",
          boxShadow: "var(--elevation-sm)",
        }}
      >
        {/* Left: title */}
        <div className="flex items-center gap-2">
          <Eye size={16} style={{ color: "var(--primary)" }} />
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "var(--text-label)",
              fontWeight: "var(--font-weight-semibold)" as any,
              color: "var(--foreground)",
            }}
          >
            Document Preview
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              fontWeight: "var(--font-weight-normal)" as any,
              color: "var(--foreground)",
              opacity: 0.45,
              marginLeft: "4px",
            }}
          >
            SHP-2026-00312
          </span>
        </div>

        {/* Center: tabs */}
        <div
          className="flex items-center gap-0.5"
          style={{
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            padding: "3px",
            backgroundColor: "var(--secondary)",
          }}
        >
          {DOC_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDoc(tab.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 transition-all cursor-pointer"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "12px",
                fontWeight: "var(--font-weight-medium)" as any,
                borderRadius: "calc(var(--radius) - 4px)",
                backgroundColor: activeDoc === tab.id ? "var(--primary)" : "transparent",
                color: activeDoc === tab.id ? "var(--primary-foreground)" : "var(--foreground)",
                border: "none",
                whiteSpace: "nowrap",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: print */}
        <Button onClick={handlePrint} size="sm" className="gap-1.5">
          <Printer size={14} />
          Print {DOC_TITLES[activeDoc]}
        </Button>
      </div>

      {/* Document subtitle */}
      <div className="flex justify-center py-3">
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "11px",
            fontWeight: "var(--font-weight-normal)" as any,
            color: "var(--foreground)",
            opacity: 0.5,
          }}
        >
          {currentTab.description}
        </span>
      </div>

      {/* Document preview */}
      <div className="flex-1 flex justify-center pb-10 px-4">
        <div ref={printRef}>
          {activeDoc === "pick" && <PickingList />}
          {activeDoc === "pack" && <PackingList />}
          {activeDoc === "label" && <ShippingLabel />}
          {activeDoc === "bol" && <BillOfLading />}
        </div>
      </div>
    </div>
  );
}
