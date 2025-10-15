import React from "react";

export default function Header() {
  return (
    <header
      className="header"
      role="banner"
      style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}
    >
      <div className="brand" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {/* ✅ Corrected logo path */}
        <div className="logo" aria-hidden>
          <img
            src="/favicon.png"
            alt="Visual Product Matcher Logo"
            style={{ width: "40px", height: "40px", borderRadius: "8px" }}
          />
        </div>

        {/* ✅ Corrected name and subtitle */}
        <div>
          <div className="title" style={{ fontSize: "1.25rem", fontWeight: "600" }}>
            Visual Product Matcher
          </div>
          <div className="subtitle" style={{ fontSize: "0.9rem", color: "#666" }}>
            AI-powered visual search for product discovery
          </div>
        </div>
      </div>
    </header>
  );
}
