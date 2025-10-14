import React from "react";

export default function Header(){
  return (
    <header className="header" role="banner" style={{ marginBottom:"1rem" }}>
      <div className="brand">
        <div className="logo" aria-hidden>VP</div>
        <div>
          <div className="title">VisionPro — Product Matching</div>
          <div className="subtitle">Reliable visual search for enterprise catalogs</div>
        </div>
      </div>

      
    </header>
  );
}
