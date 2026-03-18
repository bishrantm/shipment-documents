import React from "react";
import { FONT, sectionHeaderStyle, sectionValueStyle, docTitleStyle } from "./doc-styles";

interface InfoField {
  label: string;
  value: string;
  highlight?: boolean;
}

interface DocumentHeaderProps {
  documentType: string;
  documentNumber: string;
  fields: InfoField[][];
}

export function DocumentHeader({ documentType, documentNumber, fields }: DocumentHeaderProps) {
  const cols = fields[0]?.length || 4;

  return (
    <div style={{ marginBottom: "16px" }}>
      {/* Top row: company + document title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div>
          <div style={{ fontFamily: FONT, fontSize: "var(--text-h4)", fontWeight: "var(--font-weight-semibold)" as any }}>
            Omnesoft Warehouse Inc.
          </div>
          <div style={{ fontFamily: FONT, fontSize: "11px", fontWeight: "var(--font-weight-normal)" as any, color: "var(--foreground)", opacity: 0.6, marginTop: "2px", lineHeight: "1.4" }}>
            1234 Industrial Blvd, Suite 100<br />
            Houston, TX 77001 &nbsp;|&nbsp; (713) 555-0142
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ ...docTitleStyle, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {documentType}
          </div>
          <div style={{ fontFamily: FONT, fontSize: "var(--text-label)", fontWeight: "var(--font-weight-medium)" as any, color: "var(--primary)", marginTop: "2px" }}>
            {documentNumber}
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        {fields.map((row, ri) => (
          <div
            key={ri}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              borderTop: ri > 0 ? "1px solid var(--border)" : "none",
            }}
          >
            {row.map((cell, ci) => (
              <div
                key={ci}
                style={{
                  padding: "6px 10px",
                  borderRight: ci < row.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={sectionHeaderStyle}>{cell.label}</div>
                <div
                  style={{
                    ...sectionValueStyle,
                    fontWeight: cell.highlight ? ("var(--font-weight-semibold)" as any) : ("var(--font-weight-normal)" as any),
                    color: cell.highlight ? "var(--destructive)" : "var(--foreground)",
                  }}
                >
                  {cell.value}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
