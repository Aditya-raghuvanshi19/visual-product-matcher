import React from "react";

export default function Loader(){
  return (
    <div style={{ textAlign:"center", padding:"2rem" }} aria-busy="true">
      <div className="spinner" role="status" aria-hidden={false}></div>
      <div style={{ marginTop:".8rem", color:"var(--muted)" }}>Finding similar products…</div>
    </div>
  );
}
