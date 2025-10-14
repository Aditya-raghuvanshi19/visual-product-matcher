import React from "react";
import ProductCard from "./ProductCard";

export default function ResultsGrid({ results, filter = 50 }){
  const filtered = (results || []).filter(p => ((p.similarity || 0) * 100) >= filter);

  if(filtered.length === 0){
    return <p style={{ color:"var(--muted)" }}>No products match the threshold. Try lowering the filter.</p>;
  }

  return (
    <div className="results-grid" role="list">
      {filtered.map((p, idx) => (
        <div role="listitem" key={p.id || p._id || idx}>
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
