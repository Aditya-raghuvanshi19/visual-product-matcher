import React from "react";

export default function ProductCard({ product }){
  const backendURL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");
  let imgSrc = "";

  try{
    imgSrc = product?.image?.startsWith?.("http") ? product.image : `${backendURL}/db/${product?.image || "products/default.jpg"}`;
  }catch(e){
    imgSrc = `${backendURL}/db/products/default.jpg`;
  }

  const similarityPercent = ((product?.similarity || 0) * 100).toFixed(1);

  return (
    <div className="product card" style={{ padding:".6rem" }}>
      <img
        src={imgSrc}
        alt={product?.name || "product"}
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `${backendURL}/db/products/default.jpg`; }}
        style={{ width:"100%", height:"220px", objectFit:"contain", borderRadius:"10px", background:"#f9f9f9" }}
      />
      <div className="meta">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontWeight:700, fontSize:".95rem" }}>{product?.name || "Untitled product"}</div>
            <div className="category">{product?.category || "Uncategorized"}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div className="sim">{similarityPercent}%</div>
            <div style={{ fontSize:".8rem", color:"var(--muted)" }}>similar</div>
          </div>
        </div>
      </div>
    </div>
  );
}
