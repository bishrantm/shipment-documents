import React from "react";

// Shared document styling constants using CSS variables from the design system.
// All typography uses 'Inter' as defined in the CSS.

export const FONT = "'Inter', sans-serif";

export const pageStyle: React.CSSProperties = {
  width: "8.5in",
  minHeight: "11in",
  padding: "0.5in 0.5in",
  fontFamily: FONT,
  color: "var(--foreground)",
  backgroundColor: "var(--background)",
  boxShadow: "var(--elevation-sm)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
};

export const labelPageStyle: React.CSSProperties = {
  width: "4in",
  minHeight: "6in",
  padding: "0.3in",
  fontFamily: FONT,
  color: "var(--foreground)",
  backgroundColor: "var(--background)",
  boxShadow: "var(--elevation-sm)",
  border: "2px solid var(--foreground)",
  borderRadius: "var(--radius)",
};

export const cellStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: "12px",
  fontWeight: "var(--font-weight-normal)" as any,
  padding: "5px 8px",
  borderRight: "1px solid var(--border)",
  borderBottom: "1px solid var(--border)",
  verticalAlign: "middle",
};

export const headerCellStyle: React.CSSProperties = {
  ...cellStyle,
  fontWeight: "var(--font-weight-semibold)" as any,
  fontSize: "10px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  backgroundColor: "var(--secondary)",
  color: "var(--foreground)",
  padding: "4px 8px",
};

export const fillCellBg = "var(--secondary)";

export const sectionHeaderStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: "10px",
  fontWeight: "var(--font-weight-semibold)" as any,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--foreground)",
  opacity: 0.5,
  marginBottom: "2px",
};

export const sectionValueStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: "12px",
  fontWeight: "var(--font-weight-normal)" as any,
  color: "var(--foreground)",
};

export const docTitleStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: "var(--text-h4)",
  fontWeight: "var(--font-weight-semibold)" as any,
  color: "var(--foreground)",
  letterSpacing: "0.02em",
};

export const signatureLineStyle: React.CSSProperties = {
  borderBottom: "1px solid var(--foreground)",
  height: "32px",
  marginBottom: "3px",
};

export const signatureLabelStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: "10px",
  fontWeight: "var(--font-weight-medium)" as any,
  opacity: 0.5,
  textTransform: "uppercase",
};
