import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UploadCard from "./components/UploadCard";
import ResultsGrid from "./components/ResultsGrid";
import Loader from "./components/Loader";
// import AdminPanel from "./components/AdminPanel";
import axios from "axios";

export default function App(){
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(50);
  const [preview, setPreview] = useState("");
  const [log, setLog] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Consistent backend base similar to working code
  const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

  // revoke old preview URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // handle upload + search
  const handleUploadAndSearch = async (file) => {
    if(!file) return;
    const nextPreview = URL.createObjectURL(file);
    // cleanup previous preview if any
    if (preview) URL.revokeObjectURL(preview);
    setPreview(nextPreview);

    setLoading(true);
    setResults([]);
    setLog("");

    try{
      const form = new FormData();
      form.append("image", file);

      // Let axios set multipart boundary automatically in browser
      const uploadRes = await axios.post(`${BACKEND_URL}/api/upload`, form, {
        headers: { "Content-Type": undefined },
      });
      const uploadedPath = uploadRes?.data?.imagePath || uploadRes?.data?.path || uploadRes?.data?.url || "";

      if(!uploadedPath) throw new Error("Upload response missing imagePath.");

      const searchRes = await axios.get(`${BACKEND_URL}/api/search`, { params: { img: uploadedPath } });
      const list = Array.isArray(searchRes.data) ? searchRes.data : (searchRes.data?.results || []);
      setResults(list);
    }catch(err){
      console.error("Search error:", err);
      const message = err?.response?.data?.error || err?.message || "Failed to find similar products.";
      alert(message);
    }finally{
      setLoading(false);
    }
  };

  // refresh embeddings (admin)
  const handleRefresh = async () => {
    if (!confirm("This operation will reprocess all product images. Continue?")) return;
    setRefreshing(true);
    setLog("♻️ Regenerating embeddings...");

    try{
      const res = await axios.post(`${BACKEND_URL}/api/refresh`, {}, {
        headers: { "x-refresh-token": "secret123" }
      });
      setLog(res?.data?.log || res?.data?.message || "Refresh finished.");
      alert("Embeddings refreshed.");
    }catch(err){
      console.error("Refresh failed:", err);
      setLog(err?.response?.data?.error || err.message || "Refresh failed.");
      alert("Refresh failed. Check console/logs.");
    }finally{
      setRefreshing(false);
    }
  };

  return (
    <div className="app-shell">
      <Header />
      <main>
        <div style={{ display:"grid", gap:"1rem" }}>
          <div className="card upload-grid" aria-live="polite">
            <div className="upload-left">
              <h2 style={{margin:0}}>Visual Product Matcher</h2>
              <p className="subtitle">Upload an image and find visually similar products from your catalog.</p>

              <UploadCard
                onSubmit={handleUploadAndSearch}
                disabled={loading}
                preview={preview}
                setPreview={setPreview}
              />

              <div style={{ marginTop: ".5rem" }}>
                <label style={{fontWeight:600}}>Filter results</label>
                <div className="range-wrap">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filter}
                    onChange={(e)=>setFilter(Number(e.target.value))}
                    aria-label="Similarity threshold"
                  />
                  <div style={{ minWidth:60, textAlign:"left", fontWeight:700 }}>{filter}%</div>
                </div>
              </div>
            </div>

            <aside style={{ width: "360px" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:".75rem" }}>
                <div className="card" style={{ padding: ".75rem" }}>
                  <strong>Uploaded Preview</strong>
                  <div style={{ marginTop:".6rem" }} className="preview" aria-hidden={!preview}>
                    { preview ? <img src={preview} alt="Uploaded preview" style={{ maxWidth:"100%", maxHeight:"100%", objectFit:"contain" }} /> : <div style={{ color:"var(--muted)" }}>No image uploaded yet</div> }
                  </div>
                </div>

                {/* <AdminPanel
                  onRefresh={handleRefresh}
                  refreshing={refreshing}
                  log={log}
                /> */}
              </div>
            </aside>
          </div>

          <div className="card" style={{ padding:"1rem" }}>
            <h3 style={{ marginTop:0 }}>Search results</h3>
            { loading ? <Loader /> : (
              results?.length ? <ResultsGrid results={results} filter={filter} /> :
              <p style={{ color:"var(--muted)" }}>No results yet. Upload an image to begin searching.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
