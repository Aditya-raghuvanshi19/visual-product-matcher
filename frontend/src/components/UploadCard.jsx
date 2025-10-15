import React, { useRef, useState } from "react";

export default function UploadCard({ onSubmit, disabled, preview, setPreview }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [lastFile, setLastFile] = useState(null);

  // 👉 Only store the uploaded file and show preview — don't call onSubmit yet
  const handleFile = (file) => {
    if (!file) return;
    setLastFile(file);

    // create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    handleFile(file);
  };

  // 👉 Run search only when user clicks the Search button
  const handleSearch = (e) => {
    e.preventDefault();
    if (!disabled && lastFile) {
      onSubmit(lastFile);
    }
  };

  return (
    <div>
      <label htmlFor="file" style={{ fontWeight: 600 }}>Upload image</label>

      <div
        className="card"
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        style={{
          marginTop: ".6rem",
          cursor: "pointer",
          outline: dragActive ? "2px dashed var(--primary)" : "none"
        }}
      >
        <div
          style={{
            display: "flex",
            gap: ".8rem",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", gap: ".8rem", alignItems: "center", flex: 1 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 10,
                background: "linear-gradient(90deg,var(--primary),#7c3aed)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700
              }}
            >
              IMG
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>Drag & drop an image here</div>
              <div className="subtitle" style={{ marginTop: 4 }}>
                Or click to browse — supported: PNG, JPG, JPEG
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
            <input
              id="file"
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={onChange}
              style={{ display: "none" }}
            />
            <button
              className={`btn ${disabled ? "btn-disabled" : "btn-primary"}`}
              onClick={(e) => {
                e.preventDefault();
                if (!disabled) inputRef.current?.click();
              }}
              aria-disabled={disabled}
            >
              Choose file
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div
          style={{
            marginTop: ".8rem",
            display: "flex",
            gap: ".75rem",
            alignItems: "center"
          }}
        >
          <button
            className={`btn btn-primary`}
            onClick={handleSearch}
            disabled={disabled || !lastFile}
            title="Search similar images"
          >
            Search
          </button>

          <button
            className="btn btn-ghost"
            onClick={(e) => {
              e.preventDefault();
              setPreview("");
              setLastFile(null);
            }}
          >
            Clear
          </button>

          <div
            style={{
              marginLeft: "auto",
              color: "var(--muted)",
              fontSize: ".9rem"
            }}
          >
            Tip: Use high-quality photos for best matches.
          </div>
        </div>
      </div>
    </div>
  );
}
