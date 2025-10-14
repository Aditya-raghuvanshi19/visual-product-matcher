import React, { useState } from "react";

import api from "../utils/api";

export default function AdminPanel({ onRefresh, refreshing, log }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  async function uploadProduct(e) {
    e.preventDefault();
    if (!file) {
      setUploadMessage("⚠️ Please select an image file.");
      return;
    }
    setUploading(true);
    setUploadMessage("");

    try {
      const form = new FormData();
      form.append("image", file);
      form.append("name", name);
      form.append("category", category);

      const res = await api.post("/api/admin/upload-product", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-admin-key": import.meta.env.VITE_ADMIN_KEY || "" , // must match backend ADMIN_KEY
        },
      });

      setUploadMessage(res.data?.success
        ? `✅ Product uploaded: ${res.data.product?.name}`
        : "⚠️ Upload failed"
      );

      // Clear inputs
      setFile(null);
      setName("");
      setCategory("");
    } catch (err) {
      console.error(err);
      setUploadMessage("❌ Upload error. Check console for details.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="card" style={{ padding: ".9rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 700 }}>Admin</div>
          <div className="subtitle">Maintenance & logs</div>
        </div>
        <div>
          <button
            className={`btn ${refreshing ? "btn-disabled" : "btn-success"}`}
            onClick={(e) => { e.preventDefault(); if (!refreshing) onRefresh(); }}
            aria-pressed={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh embeddings"}
          </button>
        </div>
      </div>

      {/* --- NEW: Upload Product Form --- */}
      <form
        onSubmit={uploadProduct}
        style={{ marginTop: "1rem", borderTop: "1px solid var(--muted)", paddingTop: ".8rem" }}
      >
        <div style={{ marginBottom: ".6rem" }}>
          <label style={{ fontWeight: 700 }}>Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={uploading}
            style={{ marginLeft: ".5rem" }}
          />
        </div>
        <div style={{ marginBottom: ".6rem" }}>
          <label style={{ fontWeight: 700 }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={uploading}
            placeholder="Product name"
            style={{ marginLeft: ".5rem" }}
          />
        </div>
        <div style={{ marginBottom: ".6rem" }}>
          <label style={{ fontWeight: 700 }}>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={uploading}
            placeholder="Product category"
            style={{ marginLeft: ".5rem" }}
          />
        </div>
        <button
          type="submit"
          className={`btn ${uploading ? "btn-disabled" : "btn-primary"}`}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Product"}
        </button>
        {uploadMessage && <div style={{ marginTop: ".5rem" }}>{uploadMessage}</div>}
      </form>

      {/* --- Existing log display --- */}
      <div style={{ marginTop: ".8rem" }}>
        <label style={{ fontWeight: 700 }}>Activity log</label>
        <div className="log" style={{ marginTop: ".6rem" }}>
          {log ? (
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{log}</pre>
          ) : (
            <div style={{ color: "var(--muted)" }}>No logs yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
